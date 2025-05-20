import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { propertiesAPI } from '../../utils/api';

function AdminProperties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    location: '',
  });
  
  // Verificar autenticación
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }
    
    document.title = 'Propiedades | Administración | Inmobiliaria Zaragoza';
    
    // Cargar propiedades
    fetchProperties();
  }, [navigate]);
  
  const fetchProperties = async (filterParams = {}) => {
    try {
      setLoading(true);
      const data = await propertiesAPI.getAll({
        ...filterParams,
        limit: 50  // Límite más alto para la vista de administración
      });
      setProperties(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar propiedades:', err);
      setError('Error al cargar las propiedades. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const applyFilters = (e) => {
    e.preventDefault();
    
    // Preparar los filtros para la API
    const apiFilters = {};
    if (filters.status) apiFilters.status = filters.status;
    if (filters.propertyType) apiFilters.property_type = filters.propertyType;
    if (filters.minPrice) apiFilters.min_price = parseFloat(filters.minPrice);
    if (filters.maxPrice) apiFilters.max_price = parseFloat(filters.maxPrice);
    if (filters.location) apiFilters.location = filters.location;
    
    fetchProperties(apiFilters);
  };
  
  const resetFilters = () => {
    setFilters({
      status: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      location: '',
    });
    fetchProperties();
  };
  
  const handleDeleteProperty = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta propiedad? Esta acción no se puede deshacer.')) {
      try {
        await propertiesAPI.delete(id);
        // Recargar la lista
        fetchProperties();
      } catch (err) {
        console.error('Error al eliminar la propiedad:', err);
        setError('Error al eliminar la propiedad. Por favor, inténtalo de nuevo más tarde.');
      }
    }
  };
  
  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Propiedades</h1>
            <Link
              to="/admin/propiedades/nueva"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#252359] hover:bg-[#1a1a40] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#252359]"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Nueva propiedad
            </Link>
          </div>
          
          {/* Filtros */}
          <div className="mt-6 bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Filtrar propiedades</h3>
              <form className="mt-4 grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6" onSubmit={applyFilters}>
                <div className="sm:col-span-2">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Estado
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#252359] focus:border-[#252359] sm:text-sm rounded-md"
                  >
                    <option value="">Todos</option>
                    <option value="ACTIVE">Activa</option>
                    <option value="INACTIVE">Inactiva</option>
                    <option value="SOLD">Vendida</option>
                    <option value="RESERVED">Reservada</option>
                  </select>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
                    Tipo
                  </label>
                  <select
                    id="propertyType"
                    name="propertyType"
                    value={filters.propertyType}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#252359] focus:border-[#252359] sm:text-sm rounded-md"
                  >
                    <option value="">Todos</option>
                    <option value="APARTMENT">Apartamento</option>
                    <option value="HOUSE">Casa</option>
                    <option value="DUPLEX">Dúplex</option>
                    <option value="PENTHOUSE">Ático</option>
                    <option value="STUDIO">Estudio</option>
                    <option value="COMMERCIAL">Local Comercial</option>
                  </select>
                </div>
                
                <div className="sm:col-span-2">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="mt-1 focus:ring-[#252359] focus:border-[#252359] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="sm:col-span-1">
                  <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
                    Precio mínimo
                  </label>
                  <input
                    type="number"
                    name="minPrice"
                    id="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="mt-1 focus:ring-[#252359] focus:border-[#252359] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="sm:col-span-1">
                  <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
                    Precio máximo
                  </label>
                  <input
                    type="number"
                    name="maxPrice"
                    id="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="mt-1 focus:ring-[#252359] focus:border-[#252359] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="sm:col-span-4 flex items-end space-x-4">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#252359] hover:bg-[#1a1a40] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#252359]"
                  >
                    Aplicar filtros
                  </button>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Restablecer
                  </button>
                </div>
                
              </form>
            </div>
          </div>
          
          {/* Mensajes de error o carga */}
          {loading && (
            <div className="mt-6 text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#252359]"></div>
              <p className="mt-2 text-gray-600">Cargando propiedades...</p>
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
          
          {/* Lista de propiedades */}
          {!loading && !error && (
            <div className="mt-6 bg-white shadow overflow-hidden rounded-lg">
              {properties.length === 0 ? (
                <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
                  No se encontraron propiedades. Intenta con otros filtros o añade una nueva propiedad.
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
                          Tipo
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ubicación
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Precio
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {properties.map((property) => (
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
                            {property.propertyType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {property.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Intl.NumberFormat('es-ES').format(property.price)} €
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(property.createdAt).toLocaleDateString('es-ES')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link 
                              to={`/propiedades/${property.id}`} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 mr-4"
                            >
                              Ver
                            </Link>
                            <Link 
                              to={`/admin/propiedades/editar/${property.id}`} 
                              className="text-[#252359] hover:text-[#1a1a40] mr-4"
                            >
                              Editar
                            </Link>
                            <button
                              onClick={() => handleDeleteProperty(property.id)}
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
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminProperties;
