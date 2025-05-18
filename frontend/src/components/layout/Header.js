import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Propiedades', href: '/propiedades' },
  { name: 'Quiénes Somos', href: '/quienes-somos' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contacto', href: '/contacto' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  
  const isActive = (path) => {
    return router.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="w-full py-4 flex items-center justify-between border-b border-gray-200 lg:border-none">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">Inmobiliaria<span className="text-secondary">Zaragoza</span></span>
            </Link>
            <div className="hidden ml-10 space-x-8 lg:block">
              {navigation.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`${
                    isActive(link.href)
                      ? 'text-primary font-medium border-b-2 border-primary'
                      : 'text-dark hover:text-primary'
                  } text-base font-medium px-1 py-2`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden lg:flex items-center">
            <Link
              href="/admin"
              className="inline-block bg-primary hover:bg-primary-dark py-2 px-4 rounded-md font-medium text-sm text-white"
            >
              Acceso Agentes
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-dark"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Abrir menú principal</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile menu */}
      <div className={`lg:hidden ${mobileMenuOpen ? 'fixed inset-0 z-50' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/25" aria-hidden="true" onClick={() => setMobileMenuOpen(false)} />
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white py-6 px-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              <span className="text-2xl font-bold text-primary">Inmobiliaria<span className="text-secondary">Zaragoza</span></span>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Cerrar menú</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`${
                      isActive(link.href)
                        ? 'bg-gray-50 text-primary'
                        : 'text-dark hover:bg-gray-50'
                    } -mx-3 block rounded-lg px-3 py-2 text-base font-medium`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <Link
                  href="/admin"
                  className="inline-block w-full bg-primary hover:bg-primary-dark py-2.5 px-4 rounded-md font-medium text-sm text-white text-center"
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
