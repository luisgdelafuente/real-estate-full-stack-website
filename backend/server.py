from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from typing import List, Optional, Dict, Any
from prisma import Prisma
from prisma.models import User, Property, Image, Feature, Post, Category
from pydantic import BaseModel, EmailStr, Field, validator
import os
import cloudinary
import cloudinary.uploader
import uuid
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Configurar Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

# Inicializar FastAPI
app = FastAPI(title="API de InmobiliariaZaragoza")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuración de autenticación
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/token")

# Variables de JWT
JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
JWT_EXPIRATION_TIME = int(os.getenv("JWT_EXPIRATION_TIME", "3600"))

# Cliente Prisma
db = Prisma()


# --- Modelos Pydantic ---

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str


class UserBase(BaseModel):
    email: EmailStr
    name: str


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: str
    role: str
    active: bool
    createdAt: datetime


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    active: Optional[bool] = None
    password: Optional[str] = None


class PropertyBase(BaseModel):
    title: str
    description: str
    price: float
    location: str
    address: Optional[str] = None
    zipCode: Optional[str] = None
    city: str = "Zaragoza"
    province: str = "Zaragoza"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    bedrooms: int
    bathrooms: int
    area: float
    yearBuilt: Optional[int] = None
    energyRating: str
    propertyType: str
    featured: bool = False


class PropertyCreate(PropertyBase):
    pass


class ImageResponse(BaseModel):
    id: str
    url: str
    main: bool


class FeatureResponse(BaseModel):
    id: str
    name: str


class PropertyResponse(PropertyBase):
    id: str
    slug: str
    status: str
    createdAt: datetime
    updatedAt: datetime
    images: List[ImageResponse]
    features: List[FeatureResponse]


class PropertyPatch(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    status: Optional[str] = None
    featured: Optional[bool] = None


class CategoryBase(BaseModel):
    name: str


class CategoryCreate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    id: str
    slug: str
    createdAt: datetime
    updatedAt: datetime


class PostBase(BaseModel):
    title: str
    content: str
    excerpt: Optional[str] = None
    published: bool = False


class PostCreate(PostBase):
    categoryIds: List[str] = []


class PostResponse(PostBase):
    id: str
    slug: str
    coverImage: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime
    categories: List[CategoryResponse] = []


class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    excerpt: Optional[str] = None
    published: Optional[bool] = None
    categoryIds: Optional[List[str]] = None


class DashboardStats(BaseModel):
    activeProperties: int
    totalProperties: int
    soldProperties: int
    reservedProperties: int
    inactiveProperties: int
    totalPosts: int
    publishedPosts: int
    draftPosts: int
    totalUsers: int
    totalCategories: int


# --- Funciones de autenticación ---

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


async def get_user(email: str):
    return await db.user.find_unique(where={"email": email})


async def authenticate_user(email: str, password: str):
    user = await get_user(email)
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(seconds=JWT_EXPIRATION_TIME)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciales inválidas",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credential_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credential_exception
    user = await get_user(email=token_data.email)
    if user is None:
        raise credential_exception
    return user


async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if not current_user.active:
        raise HTTPException(status_code=400, detail="Usuario inactivo")
    return current_user


# --- Helpers ---

def slugify(text):
    """
    Función simple para crear un slug a partir de un texto
    """
    import re
    import unicodedata

    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('ascii')
    text = re.sub(r'[^\w\s-]', '', text.lower())
    text = re.sub(r'[-\s]+', '-', text).strip('-_')
    return text


# --- Eventos de Inicialización y Cierre ---

@app.on_event("startup")
async def startup():
    await db.connect()


@app.on_event("shutdown")
async def shutdown():
    await db.disconnect()


# --- Rutas ---

@app.get("/api/")
async def read_root():
    return {"message": "Bienvenido a la API de InmobiliariaZaragoza"}


@app.post("/api/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Correo electrónico o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(seconds=JWT_EXPIRATION_TIME)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


# --- Rutas de usuarios ---

@app.get("/api/users", response_model=List[UserResponse])
async def get_users(current_user: User = Depends(get_current_active_user)):
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="No tienes permiso para ver los usuarios")
    
    users = await db.user.find_many()
    return users


@app.post("/api/users", response_model=UserResponse)
async def create_user(user: UserCreate, current_user: User = Depends(get_current_active_user)):
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="No tienes permiso para crear usuarios")
    
    db_user = await db.user.find_unique(where={"email": user.email})
    if db_user:
        raise HTTPException(status_code=400, detail="El correo electrónico ya está registrado")
    
    hashed_password = get_password_hash(user.password)
    
    new_user = await db.user.create(
        data={
            "email": user.email,
            "name": user.name,
            "password": hashed_password,
            "role": "AGENT"
        }
    )
    
    return new_user


@app.get("/api/users/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user


@app.get("/api/users/{user_id}", response_model=UserResponse)
async def get_user_by_id(user_id: str, current_user: User = Depends(get_current_active_user)):
    if current_user.role != "ADMIN" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="No tienes permiso para ver este usuario")
    
    user = await db.user.find_unique(where={"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    return user


@app.put("/api/users/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, user_data: UserUpdate, current_user: User = Depends(get_current_active_user)):
    if current_user.role != "ADMIN" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="No tienes permiso para actualizar este usuario")
    
    # Verificar que el usuario existe
    user = await db.user.find_unique(where={"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Preparar los datos para actualizar
    update_data = {}
    if user_data.name is not None:
        update_data["name"] = user_data.name
    if user_data.email is not None:
        # Verificar que el correo no esté en uso por otro usuario
        if user_data.email != user.email:
            existing_user = await db.user.find_unique(where={"email": user_data.email})
            if existing_user:
                raise HTTPException(status_code=400, detail="El correo electrónico ya está en uso")
        update_data["email"] = user_data.email
    if user_data.active is not None:
        update_data["active"] = user_data.active
    
    # Solo el administrador puede cambiar el rol
    if user_data.role is not None and current_user.role == "ADMIN":
        update_data["role"] = user_data.role
    
    # Actualizar la contraseña si se proporciona
    if user_data.password is not None:
        update_data["password"] = get_password_hash(user_data.password)
    
    # Actualizar el usuario
    updated_user = await db.user.update(
        where={"id": user_id},
        data=update_data
    )
    
    return updated_user


@app.delete("/api/users/{user_id}")
async def delete_user(user_id: str, current_user: User = Depends(get_current_active_user)):
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="No tienes permiso para eliminar usuarios")
    
    # Verificar que el usuario existe
    user = await db.user.find_unique(where={"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # No permitir eliminar al último administrador
    if user.role == "ADMIN":
        admin_count = await db.user.count(where={"role": "ADMIN"})
        if admin_count <= 1:
            raise HTTPException(status_code=400, detail="No puedes eliminar al último administrador")
    
    # Eliminar el usuario
    await db.user.delete(where={"id": user_id})
    
    return {"detail": "Usuario eliminado correctamente"}


# --- Rutas de propiedades ---

@app.get("/api/properties", response_model=List[PropertyResponse])
async def get_properties(
    status: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    bedrooms: Optional[int] = None,
    property_type: Optional[str] = None,
    location: Optional[str] = None,
    featured: Optional[bool] = None,
    skip: int = 0,
    limit: int = 10
):
    where = {}
    
    if status:
        where["status"] = status
    
    if min_price is not None:
        where["price"] = {"gte": min_price}
    
    if max_price is not None:
        if "price" in where:
            where["price"]["lte"] = max_price
        else:
            where["price"] = {"lte": max_price}
    
    if bedrooms:
        where["bedrooms"] = {"gte": bedrooms}
    
    if property_type:
        where["propertyType"] = property_type
    
    if location:
        where["location"] = {"contains": location}
    
    if featured is not None:
        where["featured"] = featured
    
    properties = await db.property.find_many(
        where=where,
        include={
            "images": True,
            "features": True
        },
        skip=skip,
        take=limit
    )
    
    return properties


@app.get("/api/properties/{property_id}", response_model=PropertyResponse)
async def get_property(property_id: str):
    property = await db.property.find_unique(
        where={"id": property_id},
        include={
            "images": True,
            "features": True
        }
    )
    
    if not property:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada")
    
    return property


@app.post("/api/properties", response_model=PropertyResponse)
async def create_property(property_data: PropertyCreate, current_user: User = Depends(get_current_active_user)):
    # Crear un slug único basado en el título
    base_slug = slugify(property_data.title)
    slug = base_slug
    
    # Verificar si el slug ya existe y ajustar si es necesario
    existing_property = await db.property.find_unique(where={"slug": slug})
    counter = 1
    while existing_property:
        slug = f"{base_slug}-{counter}"
        existing_property = await db.property.find_unique(where={"slug": slug})
        counter += 1
    
    # Crear la propiedad
    property = await db.property.create(
        data={
            "title": property_data.title,
            "slug": slug,
            "description": property_data.description,
            "price": property_data.price,
            "location": property_data.location,
            "address": property_data.address,
            "zipCode": property_data.zipCode,
            "city": property_data.city,
            "province": property_data.province,
            "latitude": property_data.latitude,
            "longitude": property_data.longitude,
            "bedrooms": property_data.bedrooms,
            "bathrooms": property_data.bathrooms,
            "area": property_data.area,
            "yearBuilt": property_data.yearBuilt,
            "energyRating": property_data.energyRating,
            "propertyType": property_data.propertyType,
            "featured": property_data.featured,
            "userId": current_user.id
        },
        include={
            "images": True,
            "features": True
        }
    )
    
    return property


@app.patch("/api/properties/{property_id}", response_model=PropertyResponse)
async def update_property(
    property_id: str, 
    property_data: PropertyPatch, 
    current_user: User = Depends(get_current_active_user)
):
    # Verificar que la propiedad existe
    property = await db.property.find_unique(
        where={"id": property_id},
        include={"user": True}
    )
    
    if not property:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada")
    
    # Verificar que el usuario es el propietario o un administrador
    if property.userId != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="No tienes permiso para actualizar esta propiedad")
    
    # Preparar los datos para actualizar
    update_data = property_data.dict(exclude_unset=True)
    
    # Actualizar la propiedad
    updated_property = await db.property.update(
        where={"id": property_id},
        data=update_data,
        include={
            "images": True,
            "features": True
        }
    )
    
    return updated_property


@app.delete("/api/properties/{property_id}")
async def delete_property(property_id: str, current_user: User = Depends(get_current_active_user)):
    # Verificar que la propiedad existe
    property = await db.property.find_unique(
        where={"id": property_id},
        include={"user": True, "images": True}
    )
    
    if not property:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada")
    
    # Verificar que el usuario es el propietario o un administrador
    if property.userId != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="No tienes permiso para eliminar esta propiedad")
    
    # Eliminar las imágenes en Cloudinary
    for image in property.images:
        try:
            cloudinary.uploader.destroy(image.publicId)
        except Exception as e:
            # Continuar incluso si falla la eliminación en Cloudinary
            pass
    
    # Eliminar la propiedad (las imágenes y características se eliminarán en cascada)
    await db.property.delete(where={"id": property_id})
    
    return {"detail": "Propiedad eliminada correctamente"}


@app.post("/api/properties/{property_id}/images")
async def upload_property_image(
    property_id: str,
    main: bool = Form(False),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user)
):
    # Verificar que la propiedad existe
    property = await db.property.find_unique(
        where={"id": property_id},
        include={"user": True}
    )
    
    if not property:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada")
    
    # Verificar que el usuario es el propietario o un administrador
    if property.userId != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="No tienes permiso para actualizar esta propiedad")
    
    # Subir la imagen a Cloudinary
    try:
        content = await file.read()
        upload_result = cloudinary.uploader.upload(
            content,
            folder="inmobiliaria/properties",
            public_id=f"{property_id}-{uuid.uuid4()}",
        )
        
        # Si es la imagen principal, actualizar las demás imágenes
        if main:
            await db.image.update_many(
                where={"propertyId": property_id},
                data={"main": False}
            )
        
        # Guardar la referencia en la base de datos
        image = await db.image.create(
            data={
                "url": upload_result["secure_url"],
                "publicId": upload_result["public_id"],
                "propertyId": property_id,
                "main": main
            }
        )
        
        return {
            "id": image.id,
            "url": image.url,
            "main": image.main
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al subir la imagen: {str(e)}")


@app.post("/api/properties/{property_id}/features")
async def add_property_feature(
    property_id: str,
    feature_name: str = Body(..., embed=True),
    current_user: User = Depends(get_current_active_user)
):
    # Verificar que la propiedad existe
    property = await db.property.find_unique(
        where={"id": property_id},
        include={"user": True}
    )
    
    if not property:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada")
    
    # Verificar que el usuario es el propietario o un administrador
    if property.userId != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="No tienes permiso para actualizar esta propiedad")
    
    # Añadir la característica
    feature = await db.feature.create(
        data={
            "name": feature_name,
            "propertyId": property_id
        }
    )
    
    return {
        "id": feature.id,
        "name": feature.name
    }


@app.delete("/api/properties/{property_id}/features/{feature_id}")
async def delete_property_feature(
    property_id: str,
    feature_id: str,
    current_user: User = Depends(get_current_active_user)
):
    # Verificar que la propiedad existe
    property = await db.property.find_unique(
        where={"id": property_id},
        include={"user": True}
    )
    
    if not property:
        raise HTTPException(status_code=404, detail="Propiedad no encontrada")
    
    # Verificar que el usuario es el propietario o un administrador
    if property.userId != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="No tienes permiso para actualizar esta propiedad")
    
    # Verificar que la característica existe
    feature = await db.feature.find_unique(where={"id": feature_id})
    
    if not feature:
        raise HTTPException(status_code=404, detail="Característica no encontrada")
    
    if feature.propertyId != property_id:
        raise HTTPException(status_code=400, detail="La característica no pertenece a esta propiedad")
    
    # Eliminar la característica
    await db.feature.delete(where={"id": feature_id})
    
    return {"detail": "Característica eliminada correctamente"}


@app.get("/api/featured-properties", response_model=List[PropertyResponse])
async def get_featured_properties(limit: int = 6):
    properties = await db.property.find_many(
        where={"featured": True, "status": "ACTIVE"},
        include={
            "images": True,
            "features": True
        },
        take=limit
    )
    
    return properties


# --- Rutas de categorías ---

@app.get("/api/categories", response_model=List[CategoryResponse])
async def get_categories():
    categories = await db.category.find_many()
    return categories


@app.post("/api/categories", response_model=CategoryResponse)
async def create_category(category_data: CategoryCreate, current_user: User = Depends(get_current_active_user)):
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="No tienes permiso para crear categorías")
    
    # Crear slug a partir del nombre
    slug = slugify(category_data.name)
    
    # Verificar si el slug ya existe
    existing_category = await db.category.find_unique(where={"slug": slug})
    counter = 1
    while existing_category:
        slug = f"{slug}-{counter}"
        existing_category = await db.category.find_unique(where={"slug": slug})
        counter += 1
    
    # Crear la categoría
    category = await db.category.create(
        data={
            "name": category_data.name,
            "slug": slug
        }
    )
    
    return category


@app.get("/api/categories/{category_id}", response_model=CategoryResponse)
async def get_category(category_id: str):
    category = await db.category.find_unique(where={"id": category_id})
    if not category:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return category


@app.put("/api/categories/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: str,
    category_data: CategoryCreate,
    current_user: User = Depends(get_current_active_user)
):
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="No tienes permiso para actualizar categorías")
    
    # Verificar que la categoría existe
    category = await db.category.find_unique(where={"id": category_id})
    if not category:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    
    # Si el nombre ha cambiado, actualizar el slug
    if category.name != category_data.name:
        slug = slugify(category_data.name)
        
        # Verificar si el nuevo slug ya existe
        existing_category = await db.category.find_unique(where={"slug": slug})
        counter = 1
        while existing_category and existing_category.id != category_id:
            slug = f"{slug}-{counter}"
            existing_category = await db.category.find_unique(where={"slug": slug})
            counter += 1
        
        # Actualizar la categoría con el nuevo nombre y slug
        updated_category = await db.category.update(
            where={"id": category_id},
            data={
                "name": category_data.name,
                "slug": slug
            }
        )
    else:
        # Solo actualizar el nombre si es necesario
        updated_category = await db.category.update(
            where={"id": category_id},
            data={
                "name": category_data.name
            }
        )
    
    return updated_category


@app.delete("/api/categories/{category_id}")
async def delete_category(category_id: str, current_user: User = Depends(get_current_active_user)):
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="No tienes permiso para eliminar categorías")
    
    # Verificar que la categoría existe
    category = await db.category.find_unique(where={"id": category_id})
    if not category:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    
    # Eliminar la categoría (las relaciones se eliminarán en cascada)
    await db.category.delete(where={"id": category_id})
    
    return {"detail": "Categoría eliminada correctamente"}


# --- Rutas de posts del blog ---

@app.get("/api/posts", response_model=List[PostResponse])
async def get_posts(
    published: Optional[bool] = None,
    category_id: Optional[str] = None,
    skip: int = 0,
    limit: int = 10
):
    # Construir la consulta
    where = {}
    
    if published is not None:
        where["published"] = published
    
    if category_id:
        # Buscar posts con esa categoría
        where["categories"] = {
            "some": {
                "categoryId": category_id
            }
        }
    
    # Buscar los posts
    posts = await db.post.find_many(
        where=where,
        include={
            "categories": {
                "include": {
                    "category": True
                }
            }
        },
        skip=skip,
        take=limit,
        order_by={
            "createdAt": "desc"
        }
    )
    
    # Transformar la respuesta para que se ajuste al modelo
    result = []
    for post in posts:
        categories = []
        for cp in post.categories:
            categories.append({
                "id": cp.category.id,
                "name": cp.category.name,
                "slug": cp.category.slug,
                "createdAt": cp.category.createdAt,
                "updatedAt": cp.category.updatedAt
            })
        
        post_dict = post.dict()
        post_dict["categories"] = categories
        result.append(post_dict)
    
    return result


@app.post("/api/posts", response_model=PostResponse)
async def create_post(post_data: PostCreate, current_user: User = Depends(get_current_active_user)):
    # Crear slug a partir del título
    base_slug = slugify(post_data.title)
    slug = base_slug
    
    # Verificar si el slug ya existe
    existing_post = await db.post.find_unique(where={"slug": slug})
    counter = 1
    while existing_post:
        slug = f"{base_slug}-{counter}"
        existing_post = await db.post.find_unique(where={"slug": slug})
        counter += 1
    
    # Preparar los datos para crear el post
    post_create_data = {
        "title": post_data.title,
        "slug": slug,
        "content": post_data.content,
        "published": post_data.published,
        "userId": current_user.id
    }
    
    if post_data.excerpt:
        post_create_data["excerpt"] = post_data.excerpt
    
    # Crear el post
    post = await db.post.create(
        data=post_create_data
    )
    
    # Añadir las categorías
    categories = []
    for category_id in post_data.categoryIds:
        # Verificar que la categoría existe
        category = await db.category.find_unique(where={"id": category_id})
        if category:
            # Añadir la relación
            await db.categoryonpost.create(
                data={
                    "postId": post.id,
                    "categoryId": category_id
                }
            )
            categories.append({
                "id": category.id,
                "name": category.name,
                "slug": category.slug,
                "createdAt": category.createdAt,
                "updatedAt": category.updatedAt
            })
    
    # Preparar la respuesta
    post_dict = post.dict()
    post_dict["categories"] = categories
    
    return post_dict


@app.get("/api/posts/{post_id}", response_model=PostResponse)
async def get_post(post_id: str):
    # Buscar el post
    post = await db.post.find_unique(
        where={"id": post_id},
        include={
            "categories": {
                "include": {
                    "category": True
                }
            }
        }
    )
    
    if not post:
        raise HTTPException(status_code=404, detail="Post no encontrado")
    
    # Transformar la respuesta para que se ajuste al modelo
    categories = []
    for cp in post.categories:
        categories.append({
            "id": cp.category.id,
            "name": cp.category.name,
            "slug": cp.category.slug,
            "createdAt": cp.category.createdAt,
            "updatedAt": cp.category.updatedAt
        })
    
    post_dict = post.dict()
    post_dict["categories"] = categories
    
    return post_dict


@app.put("/api/posts/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: str,
    post_data: PostUpdate,
    current_user: User = Depends(get_current_active_user)
):
    # Verificar que el post existe
    post = await db.post.find_unique(
        where={"id": post_id},
        include={
            "categories": {
                "include": {
                    "category": True
                }
            }
        }
    )
    
    if not post:
        raise HTTPException(status_code=404, detail="Post no encontrado")
    
    # Verificar que el usuario es el autor o un administrador
    if post.userId != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="No tienes permiso para actualizar este post")
    
    # Preparar los datos para actualizar
    update_data = {}
    
    if post_data.title is not None:
        if post_data.title != post.title:
            # Actualizar el slug solo si cambió el título
            base_slug = slugify(post_data.title)
            slug = base_slug
            
            # Verificar si el nuevo slug ya existe
            existing_post = await db.post.find_unique(where={"slug": slug})
            counter = 1
            while existing_post and existing_post.id != post_id:
                slug = f"{base_slug}-{counter}"
                existing_post = await db.post.find_unique(where={"slug": slug})
                counter += 1
            
            update_data["title"] = post_data.title
            update_data["slug"] = slug
        else:
            update_data["title"] = post_data.title
    
    if post_data.content is not None:
        update_data["content"] = post_data.content
    
    if post_data.excerpt is not None:
        update_data["excerpt"] = post_data.excerpt
    
    if post_data.published is not None:
        update_data["published"] = post_data.published
    
    # Actualizar el post
    updated_post = await db.post.update(
        where={"id": post_id},
        data=update_data
    )
    
    # Actualizar las categorías si se proporcionaron
    if post_data.categoryIds is not None:
        # Eliminar todas las relaciones actuales
        await db.categoryonpost.delete_many(
            where={"postId": post_id}
        )
        
        # Añadir las nuevas relaciones
        for category_id in post_data.categoryIds:
            # Verificar que la categoría existe
            category = await db.category.find_unique(where={"id": category_id})
            if category:
                # Añadir la relación
                await db.categoryonpost.create(
                    data={
                        "postId": post_id,
                        "categoryId": category_id
                    }
                )
    
    # Obtener el post actualizado con sus categorías
    updated_post_with_categories = await db.post.find_unique(
        where={"id": post_id},
        include={
            "categories": {
                "include": {
                    "category": True
                }
            }
        }
    )
    
    # Transformar la respuesta para que se ajuste al modelo
    categories = []
    for cp in updated_post_with_categories.categories:
        categories.append({
            "id": cp.category.id,
            "name": cp.category.name,
            "slug": cp.category.slug,
            "createdAt": cp.category.createdAt,
            "updatedAt": cp.category.updatedAt
        })
    
    post_dict = updated_post_with_categories.dict()
    post_dict["categories"] = categories
    
    return post_dict


@app.delete("/api/posts/{post_id}")
async def delete_post(post_id: str, current_user: User = Depends(get_current_active_user)):
    # Verificar que el post existe
    post = await db.post.find_unique(where={"id": post_id})
    
    if not post:
        raise HTTPException(status_code=404, detail="Post no encontrado")
    
    # Verificar que el usuario es el autor o un administrador
    if post.userId != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="No tienes permiso para eliminar este post")
    
    # Eliminar el post (las relaciones con categorías se eliminarán en cascada)
    await db.post.delete(where={"id": post_id})
    
    return {"detail": "Post eliminado correctamente"}


@app.post("/api/posts/{post_id}/cover-image")
async def upload_post_cover_image(
    post_id: str,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user)
):
    # Verificar que el post existe
    post = await db.post.find_unique(where={"id": post_id})
    
    if not post:
        raise HTTPException(status_code=404, detail="Post no encontrado")
    
    # Verificar que el usuario es el autor o un administrador
    if post.userId != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="No tienes permiso para actualizar este post")
    
    # Subir la imagen a Cloudinary
    try:
        content = await file.read()
        upload_result = cloudinary.uploader.upload(
            content,
            folder="inmobiliaria/blog",
            public_id=f"post-{post_id}",
        )
        
        # Actualizar el post con la nueva imagen
        updated_post = await db.post.update(
            where={"id": post_id},
            data={"coverImage": upload_result["secure_url"]}
        )
        
        return {
            "url": updated_post.coverImage
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al subir la imagen: {str(e)}")


# --- Rutas de estadísticas para el dashboard ---

@app.get("/api/stats/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(current_user: User = Depends(get_current_active_user)):
    if current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="No tienes permiso para ver las estadísticas")
    
    # Contar propiedades por estado
    active_properties = await db.property.count(where={"status": "ACTIVE"})
    sold_properties = await db.property.count(where={"status": "SOLD"})
    reserved_properties = await db.property.count(where={"status": "RESERVED"})
    inactive_properties = await db.property.count(where={"status": "INACTIVE"})
    total_properties = active_properties + sold_properties + reserved_properties + inactive_properties
    
    # Contar posts
    published_posts = await db.post.count(where={"published": True})
    draft_posts = await db.post.count(where={"published": False})
    total_posts = published_posts + draft_posts
    
    # Contar usuarios y categorías
    total_users = await db.user.count()
    total_categories = await db.category.count()
    
    return {
        "activeProperties": active_properties,
        "totalProperties": total_properties,
        "soldProperties": sold_properties,
        "reservedProperties": reserved_properties,
        "inactiveProperties": inactive_properties,
        "totalPosts": total_posts,
        "publishedPosts": published_posts,
        "draftPosts": draft_posts,
        "totalUsers": total_users,
        "totalCategories": total_categories
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8001, reload=True)
