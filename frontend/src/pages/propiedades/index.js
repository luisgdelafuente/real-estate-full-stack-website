import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';
import PropertyCard from '@/components/properties/PropertyCard';
import { AdjustmentsHorizontalIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Datos de ejemplo para propiedades
const properties = [
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
  },
  {
    id: '4',
    title: 'Piso reformado en Universidad',
    description: 'Luminoso piso totalmente reformado en zona Universidad, cerca de todos los servicios.',
    price: 175000,
    location: 'Universidad, Zaragoza',
    bedrooms: 3,
    bathrooms: 1,
    area: 85,
    energyRating: 'D',
    imageUrl: 'https://images.unsplash.com/photo-1661883624308-e38907b202cc'
  },
  {
    id: '5',
    title: 'Chalet independiente en Montecanal',
    description: 'Exclusivo chalet independiente con parcela de 500m² en Montecanal, con piscina privada y jardín.',
    price: 495000,
    location: 'Montecanal, Zaragoza',
    bedrooms: 5,
    bathrooms: 3,
    area: 250,
    energyRating: 'B',
    imageUrl: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f'
  },
  {
    id: '6',
    title: 'Dúplex en Actur',
    description: 'Espectacular dúplex con gran terraza en Actur, zona Expo, cerca de centro comercial.',
    price: 265000,
    location: 'Actur, Zaragoza',
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    energyRating: 'C',
    imageUrl: 'https://images.unsplash.com/photo-1602872029708-84d970d3382b'
  }
];

// Opciones para los filtros
const propertyTypes = [
  { value: 'all', label: 'Todos los tipos' },
  { value: 'apartment', label: 'Piso/Apartamento' },
  { value: 'house', label: 'Casa/Chalet' },
  { value: 'penthouse', label: 'Ático' },
  { value: 'duplex', label: 'Dúplex' },
  { value: 'studio', label: 'Estudio' },
  { value: 'office', label: 'Oficina' },
  { value: 'commercial', label: 'Local comercial' },
  { value: 'land', label: 'Terreno' },
];

const locations = [
  { value: 'all', label: 'Todas las zonas' },
  { value: 'casco-antiguo', label: 'Casco Antiguo' },
  { value: 'centro', label: 'Centro' },
  { value: 'universidad', label: 'Universidad' },
  { value: 'delicias', label: 'Delicias' },
  { value: 'actur', label: 'Actur' },
  { value: 'rabal', label: 'El Rabal' },
  { value: 'valdespartera', label: 'Valdespartera' },
  { value: 'montecanal', label: 'Montecanal' },
  { value: 'casablanca', label: 'Casablanca' },
];

const priceRanges = [
  { value: 'all', label: 'Cualquier precio' },
  { value: '0-100000', label: 'Hasta 100.000 €' },
  { value: '100000-200000', label: 'De 100.000 € a 200.000 €' },
  { value: '200000-300000', label: 'De 200.000 € a 300.000 €' },
  { value: '300000-400000', label: 'De 300.000 € a 400.000 €' },
  { value: '400000-500000', label: 'De 400.000 € a 500.000 €' },
  { value: '500000-1000000', label: 'De 500.000 € a 1.000.000 €' },
  { value: '1000000-9999999', label: 'Más de 1.000.000 €' },
];

const bedroomOptions = [
  { value: 'all', label: 'Cualquiera' },
  { value: '1', label: '1 o más' },
  { value: '2', label: '2 o más' },
  { value: '3', label: '3 o más' },
  { value: '4', label: '4 o más' },
  { value: '5', label: '5 o más' },
];

export default function PropertiesPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    propertyType: 'all',
    location: 'all',
    priceRange: 'all',
    bedrooms: 'all',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Aquí iría la lógica de filtrado real con la API
  const filteredProperties = properties;

  return (
    <Layout>
      <Head>
        <title>Propiedades en venta | Inmobiliaria Zaragoza</title>
        <meta name="description" content="Explora nuestra selección de propiedades en venta en Zaragoza. Pisos, casas, chalets y apartamentos en las mejores zonas de la ciudad." />
      </Head>

      {/* Hero Section */}
      <section className="relative h-[40vh] w-full">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1662398961441-91d2f443895f"
            alt="Propiedades en Zaragoza"
            fill
            priority
            className="object-cover brightness-[0.7]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:max-w-3xl xl:max-w-4xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Propiedades en venta
          </h1>
          <p className="text-lg text-white mb-0 max-w-2xl">
            Encuentra la vivienda que buscas en Zaragoza. Filtra por zona, precio o características.
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-16 z-20 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-dark">
              {filteredProperties.length} propiedades encontradas
            </h2>
            <button
              className="flex items-center space-x-2 text-primary hover:text-primary-dark"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              <span className="font-medium">Filtros</span>
            </button>
          </div>

          {/* Filters Panel */}
          <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 ${filterOpen ? 'block' : 'hidden'}`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de propiedad</label>
              <select
                name="propertyType"
                value={filters.propertyType}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {propertyTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zona</label>
              <select
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {locations.map((location) => (
                  <option key={location.value} value={location.value}>{location.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <select
                name="priceRange"
                value={filters.priceRange}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {priceRanges.map((range) => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dormitorios</label>
              <select
                name="bedrooms"
                value={filters.bedrooms}
                onChange={handleFilterChange}
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                {bedroomOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-4 mt-4 flex justify-end">
              <button
                className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md"
              >
                <div className="flex items-center">
                  <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                  <span>Buscar</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>
    </Layout>
  );
}
