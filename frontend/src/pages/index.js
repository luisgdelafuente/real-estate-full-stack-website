import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import { HomeIcon, BuildingOffice2Icon, UserGroupIcon, BookOpenIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import PropertyCard from '@/components/properties/PropertyCard';

// Datos de ejemplo para propiedades destacadas
const featuredProperties = [
  {
    id: '1',
    title: 'Apartamento de lujo en Casco Antiguo',
    description: 'Espectacular apartamento reformado en el corazón de Zaragoza, a pocos metros de la Basílica del Pilar.',
    price: 285000,
    location: 'Casco Antiguo, Zaragoza',
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    energyRating: 'B',
    imageUrl: 'https://images.unsplash.com/photo-1556597258-dca9fea9ad99'
  },
  {
    id: '2',
    title: 'Ático con terraza en El Rabal',
    description: 'Increíble ático con vistas panorámicas a la ciudad y amplia terraza, ideal para disfrutar del buen tiempo.',
    price: 325000,
    location: 'El Rabal, Zaragoza',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    energyRating: 'A',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'
  },
  {
    id: '3',
    title: 'Casa adosada en Valdespartera',
    description: 'Amplia casa adosada con jardín privado en urbanización con piscina y zonas verdes.',
    price: 245000,
    location: 'Valdespartera, Zaragoza',
    bedrooms: 4,
    bathrooms: 3,
    area: 180,
    energyRating: 'C',
    imageUrl: 'https://images.unsplash.com/photo-1597047084897-51e81819a499'
  }
];

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Inmobiliaria Zaragoza | Tu hogar ideal en la capital aragonesa</title>
        <meta name="description" content="Encuentra tu casa ideal en Zaragoza con nuestra selección de propiedades en venta y alquiler. Apartamentos, pisos, casas y oficinas en las mejores zonas." />
      </Head>

      {/* Hero Section */}
      <section className="relative h-[80vh] w-full">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1622240241336-90c92e89c38c"
            alt="Zaragoza City Skyline"
            fill
            priority
            className="object-cover brightness-[0.85]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:max-w-3xl xl:max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Tu hogar ideal en <br className="hidden sm:block" />
            <span className="text-white">Zaragoza</span>
          </h1>
          <p className="text-xl text-white mb-8 max-w-2xl">
            Encuentra la vivienda perfecta en la capital aragonesa con los mejores profesionales del sector inmobiliario.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/propiedades" className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-md font-medium text-center">
              Ver propiedades
            </Link>
            <Link href="/contacto" className="bg-secondary hover:bg-secondary-dark text-white px-6 py-3 rounded-md font-medium text-center">
              Contacta con nosotros
            </Link>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-16 px-6 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Propiedades destacadas</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Descubre nuestra selección de las mejores propiedades disponibles actualmente en Zaragoza y alrededores.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/propiedades" className="inline-block bg-secondary hover:bg-secondary-dark text-white px-8 py-3 rounded-md font-medium">
            Ver todas las propiedades
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 sm:px-8 md:px-12 lg:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">¿Por qué elegirnos?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Somos especialistas en el mercado inmobiliario de Zaragoza con más de 15 años de experiencia en el sector.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BuildingOffice2Icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Amplio catálogo</h3>
              <p className="text-gray-600">
                Las mejores propiedades en todas las zonas de Zaragoza y alrededores.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Equipo especializado</h3>
              <p className="text-gray-600">
                Profesionales con amplia experiencia en el sector inmobiliario local.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <HomeIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Asesoramiento integral</h3>
              <p className="text-gray-600">
                Te acompañamos en todo el proceso de compra, venta o alquiler.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpenIcon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Transparencia</h3>
              <p className="text-gray-600">
                Información clara y detallada sobre todas nuestras propiedades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">Lo que dicen nuestros clientes</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Conoce la experiencia de quienes ya han encontrado su hogar ideal con nosotros.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600 mb-4">
              "Encontré mi piso ideal en tiempo récord gracias a su profesionalidad y conocimiento del mercado. Muy satisfecho con el servicio recibido."
            </p>
            <div className="font-medium">
              <p className="text-dark">Carlos Martínez</p>
              <p className="text-sm text-gray-500">Actur, Zaragoza</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600 mb-4">
              "Vendimos nuestra casa en menos de un mes a un precio excelente. El equipo nos asesoró perfectamente durante todo el proceso."
            </p>
            <div className="font-medium">
              <p className="text-dark">Ana y Miguel López</p>
              <p className="text-sm text-gray-500">Centro, Zaragoza</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center space-x-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-gray-600 mb-4">
              "Llevaba meses buscando un piso con unas características muy específicas y ellos lo encontraron. Atención personalizada y profesional."
            </p>
            <div className="font-medium">
              <p className="text-dark">Laura Sánchez</p>
              <p className="text-sm text-gray-500">La Romareda, Zaragoza</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 sm:px-8 md:px-12 lg:px-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Buscas vender o alquilar tu propiedad?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Nos encargamos de todo el proceso, desde la valoración inicial hasta la firma del contrato.
          </p>
          <Link href="/contacto" className="inline-block bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-md font-medium">
            Solicitar información
          </Link>
        </div>
      </section>
    </Layout>
  );
}
