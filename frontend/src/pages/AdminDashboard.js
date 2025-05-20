import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import { statsAPI, propertiesAPI } from '../utils/api';

function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentProperties, setRecentProperties] = useState([]);
  
  // Verificar autenticación
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin');
    }
    
    document.title = 'Dashboard | Administración | Inmobiliaria Zaragoza';
    
    // Cargar estadísticas del dashboard
    fetchDashboardData();
  }, [navigate]);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Obtener estadísticas del dashboard
      const dashboardStats = await statsAPI.getDashboardStats();
      
      // Formatear los datos para mostrarlos en el dashboard
      const formattedStats = [
        { 
          name: 'Propiedades activas', 
          value: dashboardStats.activeProperties.toString(), 
          icon: (
            <svg className="h-6 w-6 text-[#252359]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          ), 
          change: dashboardStats.activeProperties > 0 ? '+12%' : '0%', 
          changeType: dashboardStats.activeProperties > 0 ? 'increase' : 'neutral' 
        },
        { 
          name: 'Total propiedades', 
          value: dashboardStats.totalProperties.toString(), 
          icon: (
            <svg className="h-6 w-6 text-[#252359]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          ), 
          change: dashboardStats.totalProperties > 0 ? '+5%' : '0%', 
          changeType: dashboardStats.totalProperties > 0 ? 'increase' : 'neutral' 
        },
        { 
          name: 'Propiedades vendidas', 
          value: dashboardStats.soldProperties.toString(), 
          icon: (
            <svg className="h-6 w-6 text-[#252359]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ), 
          change: dashboardStats.soldProperties > 0 ? '+5%' : '0%', 
          changeType: dashboardStats.soldProperties > 0 ? 'increase' : 'neutral' 
        },
        { 
          name: 'Artículos publicados', 
          value: dashboardStats.publishedPosts.toString(), 
          icon: (
            <svg className="h-6 w-6 text-[#252359]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          ), 
          change: dashboardStats.publishedPosts > 0 ? '+8%' : '0%', 
          changeType: dashboardStats.publishedPosts > 0 ? 'increase' : 'neutral' 
        },
      ];
      
      setStats(formattedStats);
      
      // Obtener propiedades recientes
      const properties = await propertiesAPI.getAll({ limit: 5, skip: 0 });
      setRecentProperties(properties);
      
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar datos del dashboard:', err);
      setError('Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.');
      setLoading(false);
    }
  };
  
  // Datos de ejemplo para cuando no hay datos reales
  const placeholderStats = [
    { 
      name: 'Propiedades activas', 
      value: '0', 
      icon: (
        <svg className="h-6 w-6 text-[#252359]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ), 
      change: '0%', 
      changeType: 'neutral' 
    },
    { 
      name: 'Total propiedades', 
      value: '0', 
      icon: (
        <svg className="h-6 w-6 text-[#252359]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ), 
      change: '0%', 
      changeType: 'neutral' 
    },
    { 
      name: 'Propiedades vendidas', 
      value: '0', 
      icon: (
        <svg className="h-6 w-6 text-[#252359]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ), 
      change: '0%', 
      changeType: 'neutral' 
    },
    { 
      name: 'Artículos publicados', 
      value: '0', 
      icon: (
        <svg className="h-6 w-6 text-[#252359]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ), 
      change: '0%', 
      changeType: 'neutral' 
    },
  ];
  
  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Bienvenida */}
          <div className="mt-6 bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-[#252359] text-white">
              <h3 className="text-lg leading-6 font-medium">
                ¡Bienvenido, Administrador!
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

          {/* Mensajes de error o carga */}
          {loading && (
            <div className="mt-6 text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#252359]"></div>
              <p className="mt-2 text-gray-600">Cargando datos...</p>
            </div>
          )}
          
          {error && !loading && (
            <div className="mt-6 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Cards estadísticas */}
          {!loading && !error && (
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {(stats || placeholderStats).map((stat) => (
                <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {stat.icon}
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
          )}

          {/* Propiedades recientes */}
          {!loading && !error && (
            <div className="mt-8">
              <div className="flex justify-between items-center">
                <h2 className="text-lg leading-6 font-medium text-gray-900">Propiedades recientes</h2>
                <Link to="/admin/propiedades/nueva" className="flex items-center text-sm font-medium text-[#252359] hover:text-[#1a1a40]">
                  <svg className="-ml-1 mr-1 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Añadir propiedad
                </Link>
              </div>
              <div className="mt-2 bg-white shadow overflow-hidden rounded-lg">
                {recentProperties.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    No hay propiedades disponibles. ¡Añade tu primera propiedad!
                  </div>
                ) : (
                  <div className="overflow-x-auto">
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
                            Tipo
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
                              {property.propertyType}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link to={`/admin/propiedades/editar/${property.id}`} className="text-[#252359] hover:text-[#1a1a40] mr-4">Editar</Link>
                              <button 
                                onClick={() => {
                                  if (window.confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) {
                                    propertiesAPI.delete(property.id)
                                      .then(() => fetchDashboardData())
                                      .catch(err => console.error('Error al eliminar propiedad:', err));
                                  }
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

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

export default AdminDashboard;
