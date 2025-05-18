import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

function NotFound() {
  React.useEffect(() => {
    document.title = 'Página no encontrada | Inmobiliaria Zaragoza';
  }, []);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-[#252359]">404</div>
          <h1 className="text-3xl font-bold mt-4 text-[#0D0D0D]">¡Página no encontrada!</h1>
          <p className="text-gray-600 mt-4 max-w-md mx-auto">
            La página que estás buscando parece que no existe o ha sido trasladada.
          </p>
        </div>
        
        <div className="relative h-64 w-full max-w-lg mb-8">
          <img 
            src="https://images.unsplash.com/photo-1662398960296-b58d8f7d589b"
            alt="Zaragoza"
            className="h-full w-full object-cover rounded-lg"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/" className="bg-[#252359] hover:bg-[#1a1a40] text-white px-6 py-3 rounded-md font-medium text-center">
            Volver al inicio
          </Link>
          <Link to="/propiedades" className="bg-white border border-[#252359] text-[#252359] hover:bg-gray-50 px-6 py-3 rounded-md font-medium text-center">
            Ver propiedades
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default NotFound;
