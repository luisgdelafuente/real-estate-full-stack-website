import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@/components/layout/Layout';
import { MapPinIcon, BedIcon, BathIcon, ArrowsRightLeftIcon, CalendarIcon, HomeIcon, ChevronLeftIcon, ChevronRightIcon, EnergyCertificateIcon } from '@/components/ui/Icons';

// Datos de ejemplo para una propiedad detallada
const propertyData = {
  id: '1',
  title: 'Apartamento de lujo en Casco Antiguo',
  description: 'Espectacular apartamento reformado en el corazón de Zaragoza, a pocos metros de la Basílica del Pilar. Cuenta con dos dormitorios amplios, dos baños completos, cocina equipada con electrodomésticos de alta gama y salón con vistas a la plaza. El edificio ha sido completamente reformado respetando la fachada original, y dispone de ascensor. Calefacción individual de gas, aire acondicionado y acabados de primera calidad. Ubicación inmejorable, junto a zonas comerciales, restaurantes y transporte público.',
  price: 285000,
  location: 'Casco Antiguo, Zaragoza',
  address: 'Calle Alfonso I, 15',
  zipCode: '50003',
  city: 'Zaragoza',
  province: 'Zaragoza',
  bedrooms: 2,
  bathrooms: 2,
  area: 95,
  yearBuilt: 1920,
  renovatedYear: 2022,
  energyRating: 'B',
  propertyType: 'Apartamento',
  status: 'En venta',
  features: [
    'Aire acondicionado',
    'Calefacción individual',
    'Ascensor',
    'Cocina equipada',
    'Armarios empotrados',
    'Suelos de parquet',
    'Doble ventana',
    'Balcón',
    'Orientación sur',
    'Puerta blindada',
    'Cerca de transporte público',
    'Zona comercial'
  ],
  images: [
    'https://images.unsplash.com/photo-1556597258-dca9fea9ad99',
    'https://images.unsplash.com/photo-1556597249-cd6a997737df',
    'https://images.unsplash.com/photo-1686056040167-1e3dead46d9a',
    'https://images.unsplash.com/photo-1683629357963-adf2b1fa9ad9',
    'https://images.unsplash.com/photo-1602872029708-84d970d3382b'
  ],
  agent: {
    name: 'Elena Martínez',
    phone: '+34 976 123 456',
    email: 'elena@inmobiliariazaragoza.com'
  }
};

export default function PropertyDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Formatear el precio con separador de miles
  const formattedPrice = new Intl.NumberFormat('es-ES').format(propertyData.price);
  
  // Función para determinar color de certificación energética
  const getEnergyRatingColor = (rating) => {
    const colors = {
      'A': 'bg-green-500',
      'B': 'bg-green-400',
      'C': 'bg-yellow-400',
      'D': 'bg-yellow-500',
      'E': 'bg-orange-400',
      'F': 'bg-orange-500',
      'G': 'bg-red-500',
    };
    return colors[rating] || 'bg-gray-400';
  };

  // Navegación de imágenes
  const prevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? propertyData.images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev === propertyData.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Layout>
      <Head>
        <title>{propertyData.title} | Inmobiliaria Zaragoza</title>
        <meta name="description" content={propertyData.description.substring(0, 160)} />
        {/* Open Graph */}
        <meta property="og:title" content={propertyData.title} />
        <meta property="og:description" content={propertyData.description.substring(0, 160)} />
        <meta property="og:image" content={propertyData.images[0]} />
        <meta property="og:type" content="website" />
        {/* Structured Data / JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateListing",
              "name": propertyData.title,
              "description": propertyData.description,
              "image": propertyData.images[0],
              "address": {
                "@type": "PostalAddress",
                "addressLocality": propertyData.city,
                "addressRegion": propertyData.province,
                "postalCode": propertyData.zipCode,
                "streetAddress": propertyData.address
              },
              "numberOfBedrooms": propertyData.bedrooms,
              "numberOfBathroomsTotal": propertyData.bathrooms,
              "floorSize": {
                "@type": "QuantitativeValue",
                "value": propertyData.area,
                "unitCode": "MTK"
              },
              "price": propertyData.price,
              "priceCurrency": "EUR"
            })
          }}
        />
      </Head>

      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-primary">
                  Inicio
                </Link>
              </li>
              <li className="text-gray-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li>
                <Link href="/propiedades" className="text-gray-500 hover:text-primary">
                  Propiedades
                </Link>
              </li>
              <li className="text-gray-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-primary font-medium truncate max-w-xs">
                {propertyData.title}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Property Gallery */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative">
          <div className="relative h-[60vh] w-full overflow-hidden rounded-lg">
            <Image 
              src={propertyData.images[activeImageIndex]} 
              alt={`${propertyData.title} - Imagen ${activeImageIndex + 1}`} 
              fill
              className="object-cover"
            />
            
            {/* Navigation Buttons */}
            <button 
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white"
              onClick={prevImage}
            >
              <ChevronLeftIcon className="h-6 w-6 text-dark" />
            </button>
            
            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white"
              onClick={nextImage}
            >
              <ChevronRightIcon className="h-6 w-6 text-dark" />
            </button>
            
            {/* Image counter */}
            <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
              {activeImageIndex + 1} / {propertyData.images.length}
            </div>
          </div>
          
          {/* Thumbnail Previews */}
          <div className="mt-4 grid grid-cols-5 gap-2">
            {propertyData.images.map((image, index) => (
              <div 
                key={index} 
                className={`relative h-20 cursor-pointer rounded-md overflow-hidden ${index === activeImageIndex ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setActiveImageIndex(index)}
              >
                <Image 
                  src={image} 
                  alt={`${propertyData.title} - Miniatura ${index + 1}`} 
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property Details */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-dark">{propertyData.title}</h1>
              <div className={`${getEnergyRatingColor(propertyData.energyRating)} text-white text-sm font-bold px-3 py-2 rounded-md flex items-center`}>
                <EnergyCertificateIcon className="h-4 w-4 mr-1" />
                {propertyData.energyRating}
              </div>
            </div>
            
            <div className="flex items-center mb-6">
              <MapPinIcon className="h-5 w-5 text-gray-500 mr-2" />
              <p className="text-lg text-gray-700">{propertyData.location}</p>
            </div>
            
            <div className="flex flex-wrap gap-6 border-y border-gray-200 py-4 mb-6">
              <div className="flex items-center">
                <BedIcon className="h-6 w-6 text-gray-500 mr-2" />
                <div>
                  <p className="text-lg font-medium">{propertyData.bedrooms}</p>
                  <p className="text-sm text-gray-500">Dormitorios</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <BathIcon className="h-6 w-6 text-gray-500 mr-2" />
                <div>
                  <p className="text-lg font-medium">{propertyData.bathrooms}</p>
                  <p className="text-sm text-gray-500">Baños</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <ArrowsRightLeftIcon className="h-6 w-6 text-gray-500 mr-2" />
                <div>
                  <p className="text-lg font-medium">{propertyData.area} m²</p>
                  <p className="text-sm text-gray-500">Superficie</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <CalendarIcon className="h-6 w-6 text-gray-500 mr-2" />
                <div>
                  <p className="text-lg font-medium">{propertyData.yearBuilt}</p>
                  <p className="text-sm text-gray-500">Año construcción</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <HomeIcon className="h-6 w-6 text-gray-500 mr-2" />
                <div>
                  <p className="text-lg font-medium">{propertyData.propertyType}</p>
                  <p className="text-sm text-gray-500">Tipo</p>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Descripción</h2>
              <div className="text-gray-700 space-y-4">
                <p>{propertyData.description}</p>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Características</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3">
                {propertyData.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Ubicación</h2>
              <div className="h-[300px] bg-gray-200 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Mapa de ubicación (integración futura con Google Maps o similar)
                </div>
              </div>
              <p className="mt-2 text-gray-700">{propertyData.address}, {propertyData.zipCode} {propertyData.city}</p>
            </div>
          </div>
          
          {/* Right Column - Agent & Price */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm sticky top-28">
              <div className="text-3xl font-bold text-primary mb-4">{formattedPrice} €</div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <h3 className="font-semibold mb-2">Contacta con el agente</h3>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-3 flex items-center justify-center text-gray-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">{propertyData.agent.name}</p>
                    <p className="text-sm text-gray-500">Agente inmobiliario</p>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <a href={`tel:${propertyData.agent.phone}`} className="flex items-center text-gray-700">
                    <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {propertyData.agent.phone}
                  </a>
                  <a href={`mailto:${propertyData.agent.email}`} className="flex items-center text-gray-700">
                    <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {propertyData.agent.email}
                  </a>
                </div>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input type="text" className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input type="tel" className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                  <textarea rows="4" className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"></textarea>
                </div>
                <button type="submit" className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md transition-colors">
                  Enviar mensaje
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">Al enviar este formulario, aceptas nuestra <Link href="/politica-privacidad" className="text-primary hover:underline">política de privacidad</Link></p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Similar Properties */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50">
        <h2 className="text-2xl font-bold text-dark mb-8">Propiedades similares</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Similar properties would be displayed here */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="h-48 relative">
              <Image 
                src="https://images.unsplash.com/photo-1683629357963-adf2b1fa9ad9" 
                alt="Propiedad similar" 
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Apartamento en Centro Histórico</h3>
              <p className="text-gray-600 mb-2">Centro, Zaragoza</p>
              <p className="text-primary font-bold">245.000 €</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="h-48 relative">
              <Image 
                src="https://images.unsplash.com/photo-1686056040167-1e3dead46d9a" 
                alt="Propiedad similar" 
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Piso reformado junto al Pilar</h3>
              <p className="text-gray-600 mb-2">Casco Antiguo, Zaragoza</p>
              <p className="text-primary font-bold">295.000 €</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="h-48 relative">
              <Image 
                src="https://images.unsplash.com/photo-1556597249-cd6a997737df" 
                alt="Propiedad similar" 
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Ático con vistas en La Magdalena</h3>
              <p className="text-gray-600 mb-2">La Magdalena, Zaragoza</p>
              <p className="text-primary font-bold">315.000 €</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
