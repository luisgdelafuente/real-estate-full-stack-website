import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { usersAPI } from '../../utils/api';

function AdminUserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'AGENT',
    active: true
  });
  
  // Verificar autenticación
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }
    
    document.title = isEditMode 
      ? 'Editar Usuario | Administración | Inmobiliaria Zaragoza'
      : 'Nuevo Usuario | Administración | Inmobiliaria Zaragoza';
    
    // Cargar el usuario si estamos en modo edición
    if (isEditMode) {
      fetchUser();
    }
  }, [isEditMode, navigate, id]);
  
  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await usersAPI.getById(id);
      
      // Formatear los datos para el formulario
      setUser({
        name: data.name || '',
        email: data.email || '',
        password: '',
        confirmPassword: '',
        role: data.role || 'AGENT',
        active: data.active
      });
      
      setError(null);
    } catch (err) {
      console.error('Error al cargar el usuario:', err);
      setError('Error al cargar los datos del usuario. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const validateForm = () => {
    // Validar correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      setError('Por favor, introduce un correo electrónico válido.');
      return false;
    }
    
    // Validar contraseña en modo creación
    if (!isEditMode && user.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return false;
    }
    
    // Validar coincidencia de contraseñas
    if (user.password && user.password !== user.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    setError(null);
    setSuccessMessage('');
    
    try {
      // Preparar los datos para enviar
      const userData = {
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active
      };
      
      // Añadir contraseña solo si se ha introducido
      if (user.password) {
        userData.password = user.password;
      }
      
      if (isEditMode) {
        // Actualizar el usuario existente
        await usersAPI.update(id, userData);
        setSuccessMessage('Usuario actualizado correctamente');
      } else {
        // Crear nuevo usuario
        const newUser = await usersAPI.create(userData);
        setSuccessMessage('Usuario creado correctamente');
        
        // Esperar un momento antes de redireccionar
        setTimeout(() => {
          navigate(`/admin/usuarios/editar/${newUser.id}`);
        }, 1500);
      }
    } catch (err) {
      console.error('Error al guardar el usuario:', err);
      setError('Error al guardar el usuario. Por favor, inténtalo de nuevo más tarde.');
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
              {isEditMode ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h1>
            
            <button
              type="button"
              onClick={() => navigate('/admin/usuarios')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#252359]"
            >
              Volver a usuarios
            </button>
          </div>
          
          {/* Mensajes de error o éxito */}
          {loading && (
            <div className="mt-6 text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#252359]"></div>
              <p className="mt-2 text-gray-600">Cargando datos del usuario...</p>
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
          
          {/* Formulario de usuario */}
          {!loading && (
            <form className="mt-6 space-y-8" onSubmit={handleSubmit}>
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Información del usuario
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Detalles personales y credenciales.
                  </p>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nombre completo*
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          value={user.name}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-[#252359] focus:border-[#252359] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Correo electrónico*
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          required
                          value={user.email}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-[#252359] focus:border-[#252359] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        {isEditMode ? 'Contraseña (dejar en blanco para mantener)' : 'Contraseña*'}
                      </label>
                      <div className="mt-1">
                        <input
                          type="password"
                          name="password"
                          id="password"
                          required={!isEditMode}
                          value={user.password}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-[#252359] focus:border-[#252359] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      {!isEditMode && (
                        <p className="mt-1 text-sm text-gray-500">
                          La contraseña debe tener al menos 6 caracteres.
                        </p>
                      )}
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirmar contraseña{!isEditMode && '*'}
                      </label>
                      <div className="mt-1">
                        <input
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          required={!isEditMode}
                          value={user.confirmPassword}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-[#252359] focus:border-[#252359] block w-full sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Rol*
                      </label>
                      <div className="mt-1">
                        <select
                          id="role"
                          name="role"
                          required
                          value={user.role}
                          onChange={handleChange}
                          className="shadow-sm focus:ring-[#252359] focus:border-[#252359] block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="ADMIN">Administrador</option>
                          <option value="AGENT">Agente</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <div className="flex items-start mt-6">
                        <div className="flex items-center h-5">
                          <input
                            id="active"
                            name="active"
                            type="checkbox"
                            checked={user.active}
                            onChange={handleChange}
                            className="focus:ring-[#252359] h-4 w-4 text-[#252359] border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="active" className="font-medium text-gray-700">Usuario activo</label>
                          <p className="text-gray-500">Los usuarios inactivos no pueden iniciar sesión en el sistema.</p>
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
                  onClick={() => navigate('/admin/usuarios')}
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
                      : 'Crear usuario'
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

export default AdminUserForm;
