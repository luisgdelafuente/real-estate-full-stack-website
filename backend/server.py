from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext
from typing import List, Optional
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


@app.post("/api/users", response_model=UserResponse)
async def create_user(user: UserCreate):
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8001, reload=True)
