import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Páginas
import Home from './pages/Home';
import PropertyList from './pages/PropertyList';
import PropertyDetail from './pages/PropertyDetail';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProperties from './pages/admin/AdminProperties';
import AdminPropertyForm from './pages/admin/AdminPropertyForm';
import AdminBlog from './pages/admin/AdminBlog';
import AdminPostForm from './pages/admin/AdminPostForm';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserForm from './pages/admin/AdminUserForm';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCategoryForm from './pages/admin/AdminCategoryForm';
import AdminSettings from './pages/admin/AdminSettings';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/propiedades" element={<PropertyList />} />
        <Route path="/propiedades/:id" element={<PropertyDetail />} />
        <Route path="/quienes-somos" element={<AboutUs />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/propiedades" element={<AdminProperties />} />
        <Route path="/admin/propiedades/nueva" element={<AdminPropertyForm />} />
        <Route path="/admin/propiedades/editar/:id" element={<AdminPropertyForm />} />
        <Route path="/admin/blog" element={<AdminBlog />} />
        <Route path="/admin/blog/nuevo" element={<AdminPostForm />} />
        <Route path="/admin/blog/editar/:id" element={<AdminPostForm />} />
        <Route path="/admin/usuarios" element={<AdminUsers />} />
        <Route path="/admin/usuarios/nuevo" element={<AdminUserForm />} />
        <Route path="/admin/usuarios/editar/:id" element={<AdminUserForm />} />
        <Route path="/admin/categorias" element={<AdminCategories />} />
        <Route path="/admin/categorias/nueva" element={<AdminCategoryForm />} />
        <Route path="/admin/categorias/editar/:id" element={<AdminCategoryForm />} />
        <Route path="/admin/configuracion" element={<AdminSettings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
