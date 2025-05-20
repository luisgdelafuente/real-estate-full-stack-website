/**
 * Módulo para centralizar las llamadas a la API
 */

// Obtenemos la URL base de la API del .env
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001/api';

// Token de autenticación
let authToken = localStorage.getItem('authToken');

/**
 * Configurar el token de autenticación
 * @param {string} token - El token JWT
 */
export const setAuthToken = (token) => {
  authToken = token;
  localStorage.setItem('authToken', token);
};

/**
 * Eliminar el token de autenticación
 */
export const clearAuthToken = () => {
  authToken = null;
  localStorage.removeItem('authToken');
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userData');
};

/**
 * Función para realizar peticiones a la API
 * @param {string} endpoint - Endpoint de la API
 * @param {Object} options - Opciones de fetch
 * @returns {Promise<any>} - Promesa con la respuesta
 */
export const fetchApi = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  // Preparar headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  // Añadir token si existe
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  // Configuración de la petición
  const config = {
    ...options,
    headers
  };
  
  try {
    const response = await fetch(url, config);
    
    // Si es una respuesta 204 (No Content), devolvemos un objeto vacío
    if (response.status === 204) {
      return {};
    }
    
    // Intentamos parsear la respuesta como JSON
    const data = await response.json();
    
    // Si la respuesta no es exitosa, lanzamos un error
    if (!response.ok) {
      const error = new Error(data.detail || 'Ha ocurrido un error');
      error.status = response.status;
      error.data = data;
      throw error;
    }
    
    return data;
  } catch (error) {
    if (!error.status) {
      // Error de red o de parsing
      console.error('Error de conexión:', error);
      throw new Error('Error de conexión con el servidor');
    }
    throw error;
  }
};

// Métodos para facilitar las peticiones
export const get = (endpoint, options = {}) => fetchApi(endpoint, { ...options, method: 'GET' });
export const post = (endpoint, body, options = {}) => fetchApi(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
export const put = (endpoint, body, options = {}) => fetchApi(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
export const patch = (endpoint, body, options = {}) => fetchApi(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) });
export const del = (endpoint, options = {}) => fetchApi(endpoint, { ...options, method: 'DELETE' });

/**
 * Función para subir archivos
 * @param {string} endpoint - Endpoint de la API
 * @param {FormData} formData - Datos del formulario
 * @returns {Promise<any>} - Promesa con la respuesta
 */
export const uploadFile = async (endpoint, formData) => {
  const url = `${API_URL}${endpoint}`;
  
  const headers = {};
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      const error = new Error(data.detail || 'Error al subir el archivo');
      error.status = response.status;
      error.data = data;
      throw error;
    }
    
    return data;
  } catch (error) {
    if (!error.status) {
      console.error('Error de conexión:', error);
      throw new Error('Error de conexión con el servidor');
    }
    throw error;
  }
};

// Autenticación
export const authAPI = {
  login: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    try {
      const response = await fetch(`${API_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        const error = new Error(data.detail || 'Error de autenticación');
        error.status = response.status;
        throw error;
      }

      // Guardar el token
      setAuthToken(data.access_token);
      localStorage.setItem('isAuthenticated', 'true');

      return data;
    } catch (error) {
      console.error('Error de login:', error);
      throw error;
    }
  },
  
  logout: () => {
    clearAuthToken();
  },
  
  getCurrentUser: () => get('/users/me')
};

// Propiedades
export const propertiesAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    
    // Añadir filtros a la URL
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return get(`/properties${queryString}`);
  },
  
  getById: (id) => get(`/properties/${id}`),
  
  create: (propertyData) => post('/properties', propertyData),
  
  update: (id, propertyData) => patch(`/properties/${id}`, propertyData),
  
  delete: (id) => del(`/properties/${id}`),
  
  uploadImage: (propertyId, file, isMain = false) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('main', isMain);
    
    return uploadFile(`/properties/${propertyId}/images`, formData);
  },
  
  addFeature: (propertyId, name) => post(`/properties/${propertyId}/features`, { feature_name: name }),
  
  deleteFeature: (propertyId, featureId) => del(`/properties/${propertyId}/features/${featureId}`),
  
  getFeatured: (limit = 6) => get(`/featured-properties?limit=${limit}`)
};

// Blog
export const blogAPI = {
  getPosts: (filters = {}) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value);
      }
    });
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return get(`/posts${queryString}`);
  },
  
  getById: (id) => get(`/posts/${id}`),
  
  create: (postData) => post('/posts', postData),
  
  update: (id, postData) => put(`/posts/${id}`, postData),
  
  delete: (id) => del(`/posts/${id}`),
  
  uploadCoverImage: (postId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return uploadFile(`/posts/${postId}/cover-image`, formData);
  },
  
  getCategories: () => get('/categories'),
  
  getCategoryById: (id) => get(`/categories/${id}`),
  
  createCategory: (categoryData) => post('/categories', categoryData),
  
  updateCategory: (id, categoryData) => put(`/categories/${id}`, categoryData),
  
  deleteCategory: (id) => del(`/categories/${id}`)
};

// Usuarios
export const usersAPI = {
  getAll: () => get('/users'),
  
  getById: (id) => get(`/users/${id}`),
  
  create: (userData) => post('/users', userData),
  
  update: (id, userData) => put(`/users/${id}`, userData),
  
  delete: (id) => del(`/users/${id}`)
};

// Estadísticas para el dashboard
export const statsAPI = {
  getDashboardStats: () => get('/stats/dashboard')
};
