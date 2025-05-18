import React from 'react';
import { Link } from 'react-router-dom';

function PropertyCard({ property }) {
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
        <Link to={`/propiedades/${id}`}>
          <img 
            src={imageUrl} 
            alt={title} 
            className="h-full w-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <div className={`${getEnergyRatingColor(energyRating)} text-white text-sm font-bold px-2 py-1 rounded`}>
              {energyRating}
            </div>
          </div>
        </Link>
      </div>
      
      <div className="p-5">
        <Link to={`/propiedades/${id}`}>
          <h3 className="text-xl font-semibold text-[#0D0D0D] hover:text-[#252359] mb-2 line-clamp-1">{title}</h3>
        </Link>
        
        <div className="flex items-center mb-4">
          <svg className="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          <p className="text-gray-600 line-clamp-1">{location}</p>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-gray-700">
              <svg className="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <span>{bedrooms}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <svg className="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span>{bathrooms}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <svg className="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
              <span>{area} m²</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-[#252359]">{formattedPrice} €</div>
          <Link to={`/propiedades/${id}`} className="text-[#2D3773] hover:text-[#232a58] font-medium">
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;
