import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  React.useEffect(() => {
    document.title = "Página no encontrada | Inmobiliaria Zaragoza";
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center">
      <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex-shrink-0 flex justify-center">
          <Link to="/" className="inline-flex">
            <span className="sr-only">Inmobiliaria Zaragoza</span>
            <h1 className="text-4xl font-bold text-[#252359]">InmobiliariaZaragoza</h1>
          </Link>
        </div>
        <div className="py-16">
          <div className="text-center">
            <p className="text-sm font-semibold text-[#252359] uppercase tracking-wide">Error 404</p>
            <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Página no encontrada</h1>
            <p className="mt-2 text-base text-gray-500">Lo sentimos, no podemos encontrar la página que estás buscando.</p>
            <div className="mt-6">
              <Link to="/" className="text-base font-medium text-[#252359] hover:text-[#1a1a40]">
                Volver a la página principal
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <footer className="flex-shrink-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-center space-x-4">
          <Link to="/contacto" className="text-sm font-medium text-gray-500 hover:text-gray-600">
            Contacto
          </Link>
          <span className="inline-block border-l border-gray-300" aria-hidden="true" />
          <Link to="/propiedades" className="text-sm font-medium text-gray-500 hover:text-gray-600">
            Propiedades
          </Link>
          <span className="inline-block border-l border-gray-300" aria-hidden="true" />
          <Link to="/blog" className="text-sm font-medium text-gray-500 hover:text-gray-600">
            Blog
          </Link>
        </nav>
      </footer>
    </div>
  );
}

export default NotFound;
