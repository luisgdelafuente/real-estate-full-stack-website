import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';

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

function PropertyDetail() {
  const { id } = useParams();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  React.useEffect(() => {
    document.title = `${propertyData.title} | Inmobiliaria Zaragoza`;
  }, []);
  
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
      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link to="/" className="text-gray-500 hover:text-[#252359]">
                  Inicio
                </Link>
              </li>
              <li className="text-gray-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li>
                <Link to="/propiedades" className="text-gray-500 hover:text-[#252359]">
                  Propiedades
                </Link>
              </li>
              <li className="text-gray-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-[#252359] font-medium truncate max-w-xs">
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
            <img 
              src={propertyData.images[activeImageIndex]} 
              alt={`${propertyData.title} - Imagen ${activeImageIndex + 1}`} 
              className="h-full w-full object-cover"
            />
            
            {/* Navigation Buttons */}
            <button 
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white"
              onClick={prevImage}
            >
              <svg className="h-6 w-6 text-[#0D0D0D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:bg-white"
              onClick={nextImage}
            >
              <svg className="h-6 w-6 text-[#0D0D0D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
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
                className={`relative h-20 cursor-pointer rounded-md overflow-hidden ${index === activeImageIndex ? 'ring-2 ring-[#252359]' : ''}`}
                onClick={() => setActiveImageIndex(index)}
              >
                <img 
                  src={image} 
                  alt={`${propertyData.title} - Miniatura ${index + 1}`} 
                  className="h-full w-full object-cover"
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
              <h1 className="text-3xl font-bold text-[#0D0D0D]">{propertyData.title}</h1>
              <div className={`${getEnergyRatingColor(propertyData.energyRating)} text-white text-sm font-bold px-3 py-2 rounded-md flex items-center`}>
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                {propertyData.energyRating}
              </div>
            </div>
            
            <div className="flex items-center mb-6">
              <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              <p className="text-lg text-gray-700">{propertyData.location}</p>
            </div>
            
            <div className="flex flex-wrap gap-6 border-y border-gray-200 py-4 mb-6">
              <div className="flex items-center">
                <svg className="h-6 w-6 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                <div>
                  <p className="text-lg font-medium">{propertyData.bedrooms}</p>
                  <p className="text-sm text-gray-500">Dormitorios</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <svg className="h-6 w-6 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <div>
                  <p className="text-lg font-medium">{propertyData.bathrooms}</p>
                  <p className="text-sm text-gray-500">Baños</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <svg className="h-6 w-6 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                </svg>
                <div>
                  <p className="text-lg font-medium">{propertyData.area} m²</p>
                  <p className="text-sm text-gray-500">Superficie</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <svg className="h-6 w-6 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                <div>
                  <p className="text-lg font-medium">{propertyData.yearBuilt}</p>
                  <p className="text-sm text-gray-500">Año construcción</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <svg className="h-6 w-6 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
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
                    <svg className="h-5 w-5 text-[#252359] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              <div className="text-3xl font-bold text-[#252359] mb-4">{formattedPrice} €</div>
              
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
                    <svg className="h-5 w-5 text-[#252359] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {propertyData.agent.phone}
                  </a>
                  <a href={`mailto:${propertyData.agent.email}`} className="flex items-center text-gray-700">
                    <svg className="h-5 w-5 text-[#252359] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {propertyData.agent.email}
                  </a>
                </div>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input type="text" className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#252359] focus:border-[#252359]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#252359] focus:border-[#252359]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input type="tel" className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#252359] focus:border-[#252359]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                  <textarea rows="4" className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#252359] focus:border-[#252359]"></textarea>
                </div>
                <button type="submit" className="w-full bg-[#252359] hover:bg-[#1a1a40] text-white font-medium py-2 px-4 rounded-md transition-colors">
                  Enviar mensaje
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">Al enviar este formulario, aceptas nuestra <Link to="/politica-privacidad" className="text-[#252359] hover:underline">política de privacidad</Link></p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Similar Properties */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50">
        <h2 className="text-2xl font-bold text-[#0D0D0D] mb-8">Propiedades similares</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Similar properties would be displayed here */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="h-48 relative">
              <img 
                src="https://images.unsplash.com/photo-1683629357963-adf2b1fa9ad9" 
                alt="Propiedad similar" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Apartamento en Centro Histórico</h3>
              <p className="text-gray-600 mb-2">Centro, Zaragoza</p>
              <p className="text-[#252359] font-bold">245.000 €</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="h-48 relative">
              <img 
                src="https://images.unsplash.com/photo-1686056040167-1e3dead46d9a" 
                alt="Propiedad similar" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Piso reformado junto al Pilar</h3>
              <p className="text-gray-600 mb-2">Casco Antiguo, Zaragoza</p>
              <p className="text-[#252359] font-bold">295.000 €</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="h-48 relative">
              <img 
                src="https://images.unsplash.com/photo-1556597249-cd6a997737df" 
                alt="Propiedad similar" 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Ático con vistas en La Magdalena</h3>
              <p className="text-gray-600 mb-2">La Magdalena, Zaragoza</p>
              <p className="text-[#252359] font-bold">315.000 €</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default PropertyDetail;
