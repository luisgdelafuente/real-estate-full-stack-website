import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { propertiesAPI } from '../../utils/api';

function AdminPropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [property, setProperty] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    address: '',
    zipCode: '',
    city: 'Zaragoza',
    province: 'Zaragoza',
    latitude: '',
    longitude: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    yearBuilt: '',
    energyRating: 'A',
    propertyType: 'APARTMENT',
    featured: false,
    status: 'ACTIVE'
  });
  
  const [images, setImages] = useState([]);
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState('');
  const [newImages, setNewImages] = useState([]);
  
  // Verificar autenticación
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }
    
    document.title = isEditMode 
      ? 'Editar Propiedad | Administración | Inmobiliaria Zaragoza'
      : 'Nueva Propiedad | Administración | Inmobiliaria Zaragoza';
    
    // Cargar la propiedad si estamos en modo edición
    if (isEditMode) {
      fetchProperty();
    }
  }, [isEditMode, navigate, id]);
  
  const fetchProperty = async () => {
    try {
      setLoading(true);
      const data = await propertiesAPI.getById(id);
      
      // Formatear los datos para el formulario
      setProperty({
        title: data.title || '',
        description: data.description || '',
        price: data.price || '',
        location: data.location || '',
        address: data.address || '',
        zipCode: data.zipCode || '',
        city: data.city || 'Zaragoza',
        province: data.province || 'Zaragoza',
        latitude: data.latitude || '',
        longitude: data.longitude || '',
        bedrooms: data.bedrooms || '',
        bathrooms: data.bathrooms || '',
        area: data.area || '',
        yearBuilt: data.yearBuilt || '',
        energyRating: data.energyRating || 'A',
        propertyType: data.propertyType || 'APARTMENT',
        featured: data.featured || false,
        status: data.status || 'ACTIVE'
      });
      
      setImages(data.images || []);
      setFeatures(data.features || []);
      
      setError(null);
    } catch (err) {
      console.error('Error al cargar la propiedad:', err);
      setError('Error al cargar los datos de la propiedad. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProperty(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      const propertyData = {
        ...property,
        price: parseFloat(property.price),
        bedrooms: parseInt(property.bedrooms, 10),
        bathrooms: parseInt(property.bathrooms, 10),
        area: parseFloat(property.area),
        yearBuilt: property.yearBuilt ? parseInt(property.yearBuilt, 10) : null,
        latitude: property.latitude ? parseFloat(property.latitude) : null,
        longitude: property.longitude ? parseFloat(property.longitude) : null
      };
      
      let savedProperty;
      
      if (isEditMode) {
        // Actualizar la propiedad existente
        savedProperty = await propertiesAPI.update(id, propertyData);
        setSuccessMessage('Propiedad actualizada correctamente');
      } else {
        // Crear nueva propiedad
        savedProperty = await propertiesAPI.create(propertyData);
        setSuccessMessage('Propiedad creada correctamente');
        
        // Redireccionar al formulario de edición
        setTimeout(() => {
          navigate(`/admin/propiedades/editar/${savedProperty.id}`);
        }, 1500);
      }
      
      // Subir nuevas imágenes si hay
      if (newImages.length > 0 && savedProperty.id) {
        for (let i = 0; i < newImages.length; i++) {
          const file = newImages[i];
          try {
            await propertiesAPI.uploadImage(savedProperty.id, file, i === 0);
          } catch (uploadErr) {
            console.error('Error al subir imagen:', uploadErr);
          }
        }
        
        // Limpiar las imágenes nuevas después de subirlas
        setNewImages([]);
        
        // Recargar la propiedad para obtener las imágenes actualizadas
        if (isEditMode) {
          fetchProperty();
        }
      }
      
    } catch (err) {
      console.error('Error al guardar la propiedad:', err);
      setError('Error al guardar la propiedad. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setSaving(false);
    }
  };
  
  const handleImageChange = (e) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };
  
  const handleAddFeature = async () => {
    if (!newFeature.trim()) return;
    
    if (!isEditMode) {
      // En modo de creación, solo añadimos la característica al estado
      setFeatures(prev => [...prev, { id: `temp-${Date.now()}`, name: newFeature }]);
      setNewFeature('');
      return;
    }
    
    // En modo de edición, añadimos la característica a la API
    try {
      const response = await propertiesAPI.addFeature(id, newFeature);
      setFeatures(prev => [...prev, response]);
      setNewFeature('');
    } catch (err) {
      console.error('Error al añadir característica:', err);
      setError('Error al añadir característica. Por favor, inténtalo de nuevo más tarde.');
    }
  };
  
  const handleDeleteFeature = async (featureId) => {
    if (!isEditMode) {
      // En modo de creación, solo eliminamos la característica del estado
      setFeatures(prev => prev.filter(feature => feature.id !== featureId));
      return;
    }
    
    // En modo de edición, eliminamos la característica de la API
    try {
      await propertiesAPI.deleteFeature(id, featureId);
      setFeatures(prev => prev.filter(feature => feature.id !== featureId));
    } catch (err) {
      console.error('Error al eliminar característica:', err);
      setError('Error al eliminar característica. Por favor, inténtalo de nuevo más tarde.');
    }
  };
  
  // Lista de tipos de propiedad
  const propertyTypes = [
    { value: 'APARTMENT', label: 'Apartamento' },
    { value: 'HOUSE', label: 'Casa' },
    { value: 'DUPLEX', label: 'Dúplex' },
    { value: 'PENTHOUSE', label: 'Ático' },
    { value: 'STUDIO', label: 'Estudio' },
    { value: 'CHALET', label: 'Chalet' },
    { value: 'VILLA', label: 'Villa' },
    { value: 'COMMERCIAL', label: 'Local Comercial' },
    { value: 'OFFICE', label: 'Oficina' },
    { value: 'WAREHOUSE', label: 'Almacén' },
    { value: 'GARAGE', label: 'Garaje' },
    { value: 'LAND', label: 'Terreno' }
  ];
  
  // Lista de calificaciones energéticas
  const energyRatings = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  
  // Estados de la propiedad
  const statusOptions = [
    { value: 'ACTIVE', label: 'Activa' },
    { value: 'INACTIVE', label: 'Inactiva' },
    { value: 'SOLD', label: 'Vendida' },
    { value: 'RESERVED', label: 'Reservada' }
  ];
  
  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              {isEditMode ? 'Editar Propiedad' : 'Nueva Propiedad'}
            </h1>
            
            <button
              type="button"
              onClick={() => navigate('/admin/propiedades')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#252359]"
            >
              Volver a la lista
            </button>
          </div>
          
          {/* Mensajes de error o éxito */}
          {loading && (
            <div className="mt-6 text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#252359]"></div>
              <p className="mt-2 text-gray-600">Cargando datos de la propiedad...</p>
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
          
          {/* Formulario de propiedad */}
          {!loading && (
            <form className="mt-6 space-y-8" onSubmit={handleSubmit}>
              {/* Información básica */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Información básica
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Datos principales de la propiedad.
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
                          value={property.title}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-[#252359] focus:border-[#252359] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-6">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Descripción*
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="description"
                          name="description"
                          rows={5}
                          required
                          value={property.description}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-[#252359] focus:border-[#252359] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
                        Tipo de propiedad*
                      </label>
                      <div className="mt-1">
                        <select
                          id="propertyType"
                          name="propertyType"
                          required
                          value={property.propertyType}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-[#252359] focus:border-[#252359] block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          {propertyTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Precio (€)*
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="price"
                          id="price"
                          required
                          min="0"
                          step="1000"
                          value={property.price}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-[#252359] focus:border-[#252359] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Estado*
                      </label>
                      <div className="mt-1">
                        <select
                          id="status"
                          name="status"
                          required
                          value={property.status}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-[#252359] focus:border-[#252359] block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="featured"
                            name="featured"
                            type="checkbox"
                            checked={property.featured}
                            onChange={handleChange}
                            className="focus:ring-[#252359] h-4 w-4 text-[#252359] border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="featured" className="font-medium text-gray-700">Destacada</label>
                          <p className="text-gray-500">Marcar esta propiedad como destacada para mostrarla en la página principal.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Características de la propiedad */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Características
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Características básicas de la propiedad.
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-1">
                      <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
                        Habitaciones*
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="bedrooms"
                          id="bedrooms"
                          required
                          min="0"
                          value={property.bedrooms}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-[#252359] focus:border-[#252359] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-1">
                      <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
                        Baños*
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="bathrooms"
                          id="bathrooms"
                          required
                          min="0"
                          value={property.bathrooms}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-[#252359] focus:border-[#252359] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-1">
                      <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                        Área (m²)*
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="area"
                          id="area"
                          required
                          min="0"
                          value={property.area}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-[#252359] focus:border-[#252359] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-1">
                      <label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700">
                        Año construcción
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="yearBuilt"
                          id="yearBuilt"
                          min="1900"
                          max={new Date().getFullYear()}
                          value={property.yearBuilt}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-[#252359] focus:border-[#252359] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="energyRating" className="block text-sm font-medium text-gray-700">
                        Certificación energética*
                      </label>
                      <div className="mt-1">
                        <select
                          id="energyRating"
                          name="energyRating"
                          required
                          value={property.energyRating}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-[#252359] focus:border-[#252359] block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          {energyRatings.map(rating => (
                            <option key={rating} value={rating}>
                              {rating}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">
                        Características adicionales
                      </label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {features.map(feature => (
                          <span 
                            key={feature.id} 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {feature.name}
                            <button
                              type="button"
                              onClick={() => handleDeleteFeature(feature.id)}
                              className="ml-1.5 -mr-1 h-4 w-4 rounded-full inline-flex items-center justify-center text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none focus:bg-blue-500 focus:text-white"
                            >
                              <span className="sr-only">Eliminar {feature.name}</span>
                              <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 flex">
                        <input
                          type="text"
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          placeholder="Añadir característica"
                          className="shadow-sm focus:ring-[#252359] focus:border-[#252359] block w-full sm:text-sm border-gray-300 rounded-md rounded-r-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddFeature}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-l-none rounded-r-md text-white bg-[#252359] hover:bg-[#1a1a40] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#252359]"
                        >
                          Añadir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Ubicación */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Ubicación
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Datos de ubicación de la propiedad.
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Zona/Barrio*
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="location"
                          id="location"
                          required
                          value={property.location}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-[#252359] focus:border-[#252359] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Dirección
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="address"
                          id="address"
                          value={property.address}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-[#252359] focus:border-[#252359] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                        Código postal
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="zipCode"
                          id="zipCode"
                          value={property.zipCode}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-[#252359] focus:border-[#252359] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        Ciudad*
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="city"
                          id="city"
                          required
                          value={property.city}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-[#252359] focus:border-[#252359] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="province" className="block text-sm font-medium text-gray-700">
                        Provincia*
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="province"
                          id="province"
                          required
                          value={property.province}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-[#252359] focus:border-[#252359] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                        Latitud
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="latitude"
                          id="latitude"
                          step="any"
                          value={property.latitude}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-[#252359] focus:border-[#252359] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                        Longitud
                      </label>
                      <div className="mt-1">
                        <input
                          type="number"
                          name="longitude"
                          id="longitude"
                          step="any"
                          value={property.longitude}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-[#252359] focus:border-[#252359] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Imágenes */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Imágenes
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Imágenes de la propiedad. La primera imagen se usará como principal.
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  {/* Imágenes actuales */}
                  {isEditMode && images.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Imágenes actuales</h4>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {images.map((image) => (
                          <div key={image.id} className="relative group">
                            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100">
                              <img 
                                src={image.url} 
                                alt="Imagen de la propiedad" 
                                className="object-cover"
                              />
                              {image.main && (
                                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-1.5 py-0.5 m-1 rounded">
                                  Principal
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Subir nuevas imágenes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      {isEditMode ? 'Añadir nuevas imágenes' : 'Subir imágenes'}
                    </label>
                    <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-[#252359] hover:text-[#1a1a40] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#252359]"
                          >
                            <span>Subir archivos</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              multiple
                              accept="image/*"
                              className="sr-only"
                              onChange={handleImageChange}
                            />
                          </label>
                          <p className="pl-1">o arrastrar y soltar</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                        
                        {/* Preview de imágenes seleccionadas */}
                        {newImages.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-500 mb-2">{newImages.length} imágenes seleccionadas:</p>
                            <div className="flex flex-wrap gap-2">
                              {Array.from(newImages).map((file, index) => (
                                <div key={index} className="relative">
                                  <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={`Imagen ${index + 1}`}
                                      className="h-full w-full object-cover"
                                    />
                                  </div>
                                  <div className="absolute bottom-0 right-0 bg-white text-gray-800 text-xs px-1 rounded-tl-md">
                                    {index === 0 && !images.length && 'Principal'}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Botones de acción */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/admin/propiedades')}
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
                      : 'Crear propiedad'
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

export default AdminPropertyForm;
