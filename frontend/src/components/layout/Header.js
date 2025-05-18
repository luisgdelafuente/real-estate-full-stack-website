import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Propiedades', href: '/propiedades' },
  { name: 'Quiénes Somos', href: '/quienes-somos' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contacto', href: '/contacto' },
];

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-4 flex items-center justify-between border-b border-gray-200 lg:border-none">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-[#252359]">Inmobiliaria<span className="text-[#2D3773]">Zaragoza</span></span>
            </Link>
            <div className="hidden ml-10 space-x-8 lg:block">
              {navigation.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href}
                  className={`${
                    isActive(link.href)
                      ? 'text-[#252359] font-medium border-b-2 border-[#252359]'
                      : 'text-[#0D0D0D] hover:text-[#252359]'
                  } text-base font-medium px-1 py-2`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex items-center">
            <Link
              to="/admin"
              className="inline-block bg-[#252359] hover:bg-[#1a1a40] py-2 px-4 rounded-md font-medium text-sm text-white"
            >
              Acceso Agentes
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-[#0D0D0D]"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Abrir menú principal</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile menu */}
      <div className={`lg:hidden ${mobileMenuOpen ? 'fixed inset-0 z-50' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/25" aria-hidden="true" onClick={() => setMobileMenuOpen(false)} />
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white py-6 px-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              <span className="text-2xl font-bold text-[#252359]">Inmobiliaria<span className="text-[#2D3773]">Zaragoza</span></span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Cerrar menú</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`${
                      isActive(link.href)
                        ? 'bg-gray-50 text-[#252359]'
                        : 'text-[#0D0D0D] hover:bg-gray-50'
                    } -mx-3 block rounded-lg px-3 py-2 text-base font-medium`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <Link
                  to="/admin"
                  className="inline-block w-full bg-[#252359] hover:bg-[#1a1a40] py-2.5 px-4 rounded-md font-medium text-sm text-white text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Acceso Agentes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
