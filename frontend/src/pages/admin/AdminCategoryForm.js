import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { blogAPI } from '../../utils/api';

function AdminCategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [category, setCategory] = useState({
    name: ''
  });
  
  // Verificar autenticación
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }
    
    document.title = isEditMode 
      ? 'Editar Categoría | Administración | Inmobiliaria Zaragoza'
      : 'Nueva Categoría | Administración | Inmobiliaria Zaragoza';
    
    // Cargar la categoría si estamos en modo edición
    if (isEditMode) {
      fetchCategory();
    }
  }, [isEditMode, navigate, id]);
  
  const fetchCategory = async () => {
    try {
      setLoading(true);
      const data = await blogAPI.getCategoryById(id);
      
      // Formatear los datos para el formulario
      setCategory({
        name: data.name || ''
      });
      
      setError(null);
    } catch (err) {
      console.error('Error al cargar la categoría:', err);
      setError('Error al cargar los datos de la categoría. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      if (isEditMode) {
        // Actualizar la categoría existente
        await blogAPI.updateCategory(id, category);
        setSuccessMessage('Categoría actualizada correctamente');
      } else {
        // Crear nueva categoría
        const newCategory = await blogAPI.createCategory(category);
        setSuccessMessage('Categoría creada correctamente');
        
        // Esperar un momento antes de redireccionar
        setTimeout(() => {
          navigate(`/admin/categorias/editar/${newCategory.id}`);
        }, 1500);
      }
    } catch (err) {
      console.error('Error al guardar la categoría:', err);
      setError('Error al guardar la categoría. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              {isEditMode ? 'Editar Categoría' : 'Nueva Categoría'}
            </h1>
            
            <button
              type="button"
              onClick={() => navigate('/admin/categorias')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#252359]"
            >
              Volver a categorías
            </button>
          </div>
          
          {/* Mensajes de error o éxito */}
          {loading && (
            <div className="mt-6 text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#252359]"></div>
              <p className="mt-2 text-gray-600">Cargando datos de la categoría...</p>
            </div>
          )}
          
          {error && (
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
          
          {successMessage && (
            <div className="mt-6 bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{successMessage}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Formulario de categoría */}
          {!loading && (
            <form className="mt-6 space-y-8" onSubmit={handleSubmit}>
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Información de la categoría
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Detalles de la categoría para el blog.
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nombre*
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          value={category.name}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-[#252359] focus:border-[#252359] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        El nombre de la categoría como aparecerá en el blog.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Botones de acción */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/admin/categorias')}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#252359]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#252359] hover:bg-[#1a1a40] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#252359] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {saving
                    ? 'Guardando...'
                    : isEditMode
                      ? 'Guardar cambios'
                      : 'Crear categoría'
                  }
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminCategoryForm;
