import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { blogAPI } from '../../utils/api';

function AdminPostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [post, setPost] = useState({
    title: '',
    content: '',
    excerpt: '',
    published: false,
    categoryIds: []
  });
  
  const [categories, setCategories] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  
  // Verificar autenticación
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }
    
    document.title = isEditMode 
      ? 'Editar Artículo | Administración | Inmobiliaria Zaragoza'
      : 'Nuevo Artículo | Administración | Inmobiliaria Zaragoza';
    
    // Cargar categorías
    fetchCategories();
    
    // Cargar el post si estamos en modo edición
    if (isEditMode) {
      fetchPost();
    }
  }, [isEditMode, navigate, id]);
  
  const fetchCategories = async () => {
    try {
      const data = await blogAPI.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
      setError('Error al cargar las categorías. Por favor, inténtalo de nuevo más tarde.');
    }
  };
  
  const fetchPost = async () => {
    try {
      setLoading(true);
      const data = await blogAPI.getById(id);
      
      // Formatear los datos para el formulario
      setPost({
        title: data.title || '',
        content: data.content || '',
        excerpt: data.excerpt || '',
        published: data.published || false,
        categoryIds: data.categories.map(cat => cat.id) || []
      });
      
      setError(null);
    } catch (err) {
      console.error('Error al cargar el artículo:', err);
      setError('Error al cargar los datos del artículo. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPost(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setPost(prev => ({
      ...prev,
      categoryIds: selectedOptions
    }));
  };
  
  const handleCoverImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      let savedPost;
      
      if (isEditMode) {
        // Actualizar el post existente
        savedPost = await blogAPI.update(id, post);
        setSuccessMessage('Artículo actualizado correctamente');
      } else {
        // Crear nuevo post
        savedPost = await blogAPI.create(post);
        setSuccessMessage('Artículo creado correctamente');
        
        // Esperar un momento antes de redireccionar
        setTimeout(() => {
          navigate(`/admin/blog/editar/${savedPost.id}`);
        }, 1500);
      }
      
      // Subir imagen de portada si se ha seleccionado
      if (coverImage && savedPost.id) {
        try {
          await blogAPI.uploadCoverImage(savedPost.id, coverImage);
          setCoverImage(null);
        } catch (uploadErr) {
          console.error('Error al subir imagen de portada:', uploadErr);
          setError('El artículo se guardó correctamente, pero hubo un error al subir la imagen de portada.');
        }
      }
      
    } catch (err) {
      console.error('Error al guardar el artículo:', err);
      setError('Error al guardar el artículo. Por favor, inténtalo de nuevo más tarde.');
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
              {isEditMode ? 'Editar Artículo' : 'Nuevo Artículo'}
            </h1>
            
            <button
              type="button"
              onClick={() => navigate('/admin/blog')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#252359]"
            >
              Volver al blog
            </button>
          </div>
          
          {/* Mensajes de error o éxito */}
          {loading && (
            <div className="mt-6 text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#252359]"></div>
              <p className="mt-2 text-gray-600">Cargando datos del artículo...</p>
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
          
          {/* Formulario del artículo */}
          {!loading && (
            <form className="mt-6 space-y-8" onSubmit={handleSubmit}>
              {/* Información básica */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Información del artículo
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Detalles básicos del artículo de blog.
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Título*
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="title"
                          id="title"
                          required
                          value={post.title}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-[#252359] focus:border-[#252359] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-6">
                      <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                        Extracto (resumen breve)
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="excerpt"
                          name="excerpt"
                          rows={2}
                          value={post.excerpt}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-[#252359] focus:border-[#252359] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Breve resumen del artículo. Si se deja vacío, se generará automáticamente.
                      </p>
                    </div>
                    
                    <div className="sm:col-span-6">
                      <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                        Contenido*
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="content"
                          name="content"
                          rows={15}
                          required
                          value={post.content}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-[#252359] focus:border-[#252359] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="categories" className="block text-sm font-medium text-gray-700">
                        Categorías
                      </label>
                      <div className="mt-1">
                        <select
                          id="categories"
                          name="categories"
                          multiple
                          value={post.categoryIds}
                          onChange={handleCategoryChange}
                          className="shadow-sm focus:ring-[#252359] focus:border-[#252359] block w-full sm:text-sm border-gray-300 rounded-md h-32"
                        >
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Mantén presionado Ctrl (o Cmd en Mac) para seleccionar múltiples categorías.
                      </p>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Imagen de portada
                      </label>
                      <div className="mt-1 flex items-center">
                        <input
                          type="file"
                          id="coverImage"
                          accept="image/*"
                          onChange={handleCoverImageChange}
                          className="sr-only"
                        />
                        <label
                          htmlFor="coverImage"
                          className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#252359]"
                        >
                          Seleccionar imagen
                        </label>
                        <span className="ml-3 text-sm text-gray-500">
                          {coverImage ? coverImage.name : 'Ninguna imagen seleccionada'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="published"
                            name="published"
                            type="checkbox"
                            checked={post.published}
                            onChange={handleChange}
                            className="focus:ring-[#252359] h-4 w-4 text-[#252359] border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="published" className="font-medium text-gray-700">Publicar</label>
                          <p className="text-gray-500">Si está marcada, el artículo será visible para los visitantes del sitio web.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Botones de acción */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/admin/blog')}
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
                      : 'Crear artículo'
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

export default AdminPostForm;
