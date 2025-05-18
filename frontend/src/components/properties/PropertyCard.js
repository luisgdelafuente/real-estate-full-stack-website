import Link from 'next/link';
import Image from 'next/image';
import { MapPinIcon, BedIcon, BathIcon, ArrowsRightLeftIcon } from '@/components/ui/Icons';

export default function PropertyCard({ property }) {
  const { id, title, description, price, location, bedrooms, bathrooms, area, energyRating, imageUrl } = property;
  
  // Formatear el precio con separador de miles
  const formattedPrice = new Intl.NumberFormat('es-ES').format(price);
  
  // Determinar color de certificación energética
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

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-64 w-full">
        <Link href={`/propiedades/${id}`}>
          <Image 
            src={imageUrl} 
            alt={title} 
            fill 
            className="object-cover"
          />
          <div className="absolute top-4 right-4">
            <div className={`${getEnergyRatingColor(energyRating)} text-white text-sm font-bold px-2 py-1 rounded`}>
              {energyRating}
            </div>
          </div>
        </Link>
      </div>
      
      <div className="p-5">
        <Link href={`/propiedades/${id}`}>
          <h3 className="text-xl font-semibold text-dark hover:text-primary mb-2 line-clamp-1">{title}</h3>
        </Link>
        
        <div className="flex items-center mb-4">
          <MapPinIcon className="h-5 w-5 text-gray-500 mr-1" />
          <p className="text-gray-600 line-clamp-1">{location}</p>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-700">
              <BedIcon className="h-5 w-5 text-gray-500 mr-1" />
              <span>{bedrooms}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <BathIcon className="h-5 w-5 text-gray-500 mr-1" />
              <span>{bathrooms}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <ArrowsRightLeftIcon className="h-5 w-5 text-gray-500 mr-1" />
              <span>{area} m²</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">{formattedPrice} €</div>
          <Link href={`/propiedades/${id}`} className="text-secondary hover:text-secondary-dark font-medium">
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  );
}
