import { useState } from 'react';
import Head from 'next/head';
import { useSession, signOut } from 'next-auth/react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  HomeIcon, 
  BuildingOffice2Icon, 
  BookOpenIcon, 
  UserGroupIcon,
  ChartBarIcon 
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  
  // Datos de ejemplo para el dashboard
  const stats = [
    { name: 'Propiedades activas', value: '46', icon: BuildingOffice2Icon, change: '+12%', changeType: 'increase' },
    { name: 'Visitas este mes', value: '432', icon: UserGroupIcon, change: '+18%', changeType: 'increase' },
    { name: 'Propiedades vendidas', value: '8', icon: ChartBarIcon, change: '+5%', changeType: 'increase' },
    { name: 'Artículos publicados', value: '24', icon: BookOpenIcon, change: '0%', changeType: 'neutral' },
  ];
  
  const recentProperties = [
    { id: '1', title: 'Apartamento de lujo en Casco Antiguo', status: 'ACTIVE', price: 285000, views: 128 },
    { id: '2', title: 'Ático con terraza en El Rabal', status: 'ACTIVE', price: 325000, views: 96 },
    { id: '3', title: 'Casa adosada en Valdespartera', status: 'ACTIVE', price: 245000, views: 87 },
    { id: '4', title: 'Piso reformado en Universidad', status: 'RESERVED', price: 175000, views: 64 },
    { id: '5', title: 'Chalet independiente en Montecanal', status: 'ACTIVE', price: 495000, views: 56 },
  ];
  
  // Si está cargando o no hay sesión, mostrar estado de carga
  if (status === 'loading') {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  }
  
  return (
    <AdminLayout>
      <Head>
        <title>Dashboard | Administración | Inmobiliaria Zaragoza</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Bienvenida */}
          <div className="mt-6 bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-primary text-white">
              <h3 className="text-lg leading-6 font-medium">
                ¡Bienvenido, {session?.user?.name || 'Administrador'}!
              </h3>
              <p className="mt-1 max-w-2xl text-sm">
                Panel de administración de Inmobiliaria Zaragoza
              </p>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <p className="text-gray-700">
                Desde aquí puedes gestionar las propiedades, blog, usuarios y más. Utiliza el menú lateral para navegar por las diferentes secciones.
              </p>
            </div>
          </div>

          {/* Cards estadísticas */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <stat.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                      </dd>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <div className={`flex items-center ${
                      stat.changeType === 'increase' ? 'text-green-600' : 
                      stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {stat.changeType === 'increase' && (
                        <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      )}
                      {stat.changeType === 'decrease' && (
                        <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      )}
                      <span>{stat.change} respecto al mes anterior</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Propiedades recientes */}
          <div className="mt-8">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Propiedades recientes</h2>
            <div className="mt-2 bg-white shadow overflow-hidden rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Título
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vistas
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentProperties.map((property) => (
                    <tr key={property.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {property.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${property.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                            property.status === 'RESERVED' ? 'bg-yellow-100 text-yellow-800' : 
                            property.status === 'SOLD' ? 'bg-blue-100 text-blue-800' : 
                            'bg-gray-100 text-gray-800'}
                        `}>
                          {property.status === 'ACTIVE' ? 'Activa' : 
                            property.status === 'RESERVED' ? 'Reservada' : 
                            property.status === 'SOLD' ? 'Vendida' : 'Inactiva'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Intl.NumberFormat('es-ES').format(property.price)} €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {property.views}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href="#" className="text-primary hover:text-primary-dark mr-4">Editar</a>
                        <a href="#" className="text-red-600 hover:text-red-800">Eliminar</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gráficos (placeholder) */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Vistas por propiedad</h3>
                <div className="mt-2 flex justify-center">
                  <div className="h-64 w-full bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
                    Gráfico de visualizaciones (placeholder)
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Contactos por mes</h3>
                <div className="mt-2 flex justify-center">
                  <div className="h-64 w-full bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
                    Gráfico de contactos (placeholder)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

// Proteger la ruta para usuarios autenticados
export async function getServerSideProps(context) {
  // En una implementación real, aquí verificaríamos la sesión del servidor
  return {
    props: {}, // Pasará los props a la página
  };
}
