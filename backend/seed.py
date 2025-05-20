import asyncio
from prisma import Prisma
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

load_dotenv()

# Configuración de encriptación
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def main():
    # Conectar a la base de datos
    db = Prisma()
    await db.connect()
    
    print("Conectado a la base de datos.")
    
    try:
        # Verificar si ya existe un usuario administrador
        admin = await db.user.find_first(
            where={
                "email": "admin@inmobiliariazaragoza.com"
            }
        )
        
        if admin:
            print(f"El usuario administrador ya existe: {admin.email}")
        else:
            # Crear usuario administrador
            admin = await db.user.create(
                data={
                    "email": "admin@inmobiliariazaragoza.com",
                    "name": "Administrador",
                    "password": pwd_context.hash("adminpassword"),
                    "role": "ADMIN",
                    "active": True
                }
            )
            print(f"Usuario administrador creado: {admin.email}")
        
        # Verificar si existen categorías
        categories_count = await db.category.count()
        
        if categories_count == 0:
            # Crear categorías iniciales
            categories = [
                {"name": "Noticias", "slug": "noticias"},
                {"name": "Consejos", "slug": "consejos"},
                {"name": "Mercado inmobiliario", "slug": "mercado-inmobiliario"},
                {"name": "Reformas", "slug": "reformas"},
                {"name": "Decoración", "slug": "decoracion"}
            ]
            
            for cat in categories:
                category = await db.category.create(
                    data={
                        "name": cat["name"],
                        "slug": cat["slug"]
                    }
                )
                print(f"Categoría creada: {category.name}")
        else:
            print(f"Ya existen {categories_count} categorías en la base de datos.")
        
        print("Seed completado con éxito.")
    except Exception as e:
        print(f"Error durante el seed: {str(e)}")
    finally:
        await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
