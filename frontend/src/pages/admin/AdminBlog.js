import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { blogAPI } from '../../utils/api';

function AdminBlog() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    published: '',
    categoryId: ''
  });
  
  // Verificar autenticación
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }
    
    document.title = 'Blog | Administración | Inmobiliaria Zaragoza';
    
    // Cargar posts y categorías
    fetchData();
  }, [navigate]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Cargar categorías
      const categoriesData = await blogAPI.getCategories();
      setCategories(categoriesData);
      
      // Cargar posts
      await fetchPosts();
    } catch (err) {
      console.error('Error al cargar datos del blog:', err);
      setError('Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchPosts = async (filterParams = {}) => {
    try {
      const data = await blogAPI.getPosts({
        ...filterParams,
        limit: 50  // Límite más alto para la vista de administración
      });
      setPosts(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar posts:', err);
      setError('Error al cargar los posts. Por favor, inténtalo de nuevo más tarde.');
      setPosts([]);
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
    if (filters.published !== '') apiFilters.published = filters.published === 'true';
    if (filters.categoryId) apiFilters.category_id = filters.categoryId;
    
    fetchPosts(apiFilters);
  };
  
  const resetFilters = () => {
    setFilters({
      published: '',
      categoryId: ''
    });
    fetchPosts();
  };
  
  const handleDeletePost = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este artículo? Esta acción no se puede deshacer.')) {
      try {
        await blogAPI.delete(id);
        // Recargar la lista
        fetchPosts();
      } catch (err) {
        console.error('Error al eliminar el artículo:', err);
        setError('Error al eliminar el artículo. Por favor, inténtalo de nuevo más tarde.');
      }
    }
  };
  
  const togglePublishStatus = async (post) => {
    try {
      const newStatus = !post.published;
      await blogAPI.update(post.id, { published: newStatus });
      // Actualizar la lista
      fetchPosts();
    } catch (err) {
      console.error('Error al cambiar el estado de publicación:', err);
      setError('Error al cambiar el estado de publicación. Por favor, inténtalo de nuevo más tarde.');
    }
  };
  
  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Blog</h1>
            <div className="flex space-x-3">
              <Link
                to="/admin/categorias"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#252359]"
              >
                <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Categorías
              </Link>
              <Link
                to="/admin/blog/nuevo"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#252359] hover:bg-[#1a1a40] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#252359]"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Nuevo artículo
              </Link>
            </div>
          </div>
          
          {/* Filtros */}
          <div className="mt-6 bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Filtrar artículos</h3>
              <form className="mt-4 grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6" onSubmit={applyFilters}>
                <div className="sm:col-span-2">
                  <label htmlFor="published" className="block text-sm font-medium text-gray-700">
                    Estado
                  </label>
                  <select
                    id="published"
                    name="published"
                    value={filters.published}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#252359] focus:border-[#252359] sm:text-sm rounded-md"
                  >
                    <option value="">Todos</option>
                    <option value="true">Publicado</option>
                    <option value="false">Borrador</option>
                  </select>
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                    Categoría
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={filters.categoryId}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-[#252359] focus:border-[#252359] sm:text-sm rounded-md"
                  >
                    <option value="">Todas las categorías</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
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
              <p className="mt-2 text-gray-600">Cargando artículos...</p>
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
          
          {/* Lista de posts */}
          {!loading && !error && (
            <div className="mt-6 bg-white shadow overflow-hidden rounded-lg">
              {posts.length === 0 ? (
                <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
                  No se encontraron artículos. Intenta con otros filtros o añade un nuevo artículo.
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
                          Categorías
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
                      {posts.map((post) => (
                        <tr key={post.id}>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {post.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                            `}>
                              {post.published ? 'Publicado' : 'Borrador'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <div className="flex flex-wrap gap-1">
                              {post.categories.length === 0 ? (
                                <span className="text-gray-400">Sin categorías</span>
                              ) : (
                                post.categories.map(category => (
                                  <span 
                                    key={category.id} 
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700"
                                  >
                                    {category.name}
                                  </span>
                                ))
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString('es-ES')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => togglePublishStatus(post)}
                              className={`${
                                post.published 
                                  ? 'text-yellow-600 hover:text-yellow-800' 
                                  : 'text-green-600 hover:text-green-800'
                              } mr-4`}
                            >
                              {post.published ? 'Pasar a borrador' : 'Publicar'}
                            </button>
                            <Link 
                              to={`/blog/${post.slug}`} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 mr-4"
                            >
                              Ver
                            </Link>
                            <Link 
                              to={`/admin/blog/editar/${post.id}`} 
                              className="text-[#252359] hover:text-[#1a1a40] mr-4"
                            >
                              Editar
                            </Link>
                            <button
                              onClick={() => handleDeletePost(post.id)}
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

export default AdminBlog;
