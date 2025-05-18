import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';

export default function Custom404() {
  return (
    <Layout>
      <Head>
        <title>Página no encontrada | Inmobiliaria Zaragoza</title>
        <meta name="description" content="La página que buscas no existe." />
      </Head>
      
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary">404</div>
          <h1 className="text-3xl font-bold mt-4 text-dark">¡Página no encontrada!</h1>
          <p className="text-gray-600 mt-4 max-w-md mx-auto">
            La página que estás buscando parece que no existe o ha sido trasladada.
          </p>
        </div>
        
        <div className="relative h-64 w-full max-w-lg mb-8">
          <Image 
            src="https://images.unsplash.com/photo-1662398960296-b58d8f7d589b"
            alt="Zaragoza"
            fill
            className="object-cover rounded-lg"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md font-medium text-center">
            Volver al inicio
          </Link>
          <Link href="/propiedades" className="bg-white border border-primary text-primary hover:bg-gray-50 px-6 py-3 rounded-md font-medium text-center">
            Ver propiedades
          </Link>
        </div>
      </div>
    </Layout>
  );
}
