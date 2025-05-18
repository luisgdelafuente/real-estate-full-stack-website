import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

// Datos de ejemplo para el blog
const blogPosts = [
  {
    id: '1',
    title: 'Guía para comprar tu primera vivienda en Zaragoza',
    slug: 'guia-comprar-primera-vivienda-zaragoza',
    excerpt: 'Todo lo que necesitas saber antes de embarcarte en la compra de tu primera vivienda en la capital aragonesa.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
    author: 'Elena Martínez',
    publishedAt: '2023-04-15',
    categories: ['Compra', 'Guías', 'Principiantes']
  },
  {
    id: '2',
    title: 'Los mejores barrios para vivir en Zaragoza en 2025',
    slug: 'mejores-barrios-vivir-zaragoza-2025',
    excerpt: 'Analizamos las zonas con mejor calidad de vida, servicios y conexiones de transporte en Zaragoza.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1662398960296-b58d8f7d589b',
    author: 'Carlos Rodríguez',
    publishedAt: '2025-01-23',
    categories: ['Barrios', 'Lifestyle', 'Tendencias']
  },
  {
    id: '3',
    title: 'Cómo preparar tu piso para la venta y conseguir el mejor precio',
    slug: 'como-preparar-piso-venta-mejor-precio',
    excerpt: 'Consejos prácticos para acondicionar tu vivienda y maximizar su valor de mercado antes de ponerla a la venta.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1594408065362-379a5b60910b',
    author: 'Laura Sánchez',
    publishedAt: '2024-09-05',
    categories: ['Venta', 'Home Staging', 'Tips']
  },
  {
    id: '4',
    title: 'Las últimas tendencias en diseño de interiores para 2025',
    slug: 'tendencias-diseno-interiores-2025',
    excerpt: 'Descubre qué materiales, colores y estilos marcarán tendencia este año en la decoración de viviendas.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1683629357963-adf2b1fa9ad9',
    author: 'Antonio García',
    publishedAt: '2025-02-10',
    categories: ['Diseño', 'Tendencias', 'Interiores']
  },
  {
    id: '5',
    title: 'Novedades fiscales que afectan al sector inmobiliario en 2025',
    slug: 'novedades-fiscales-sector-inmobiliario-2025',
    excerpt: 'Repasamos los cambios legislativos y fiscales más importantes que afectan a la compraventa y alquiler de viviendas.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
    author: 'Carlos Rodríguez',
    publishedAt: '2025-03-02',
    categories: ['Legal', 'Fiscalidad', 'Actualidad']
  },
  {
    id: '6',
    title: 'El mercado del alquiler en Zaragoza: análisis y previsiones',
    slug: 'mercado-alquiler-zaragoza-analisis-previsiones',
    excerpt: 'Estudiamos la evolución de los precios y la oferta de alquiler en la ciudad, con previsiones para los próximos años.',
    content: '',
    coverImage: 'https://images.unsplash.com/photo-1556597249-cd6a997737df',
    author: 'Elena Martínez',
    publishedAt: '2024-11-18',
    categories: ['Alquiler', 'Mercado', 'Análisis']
  }
];

// Filtrar categorías únicas
const allCategories = [...new Set(blogPosts.flatMap(post => post.categories))];

function Blog() {
  React.useEffect(() => {
    document.title = 'Blog Inmobiliario | Inmobiliaria Zaragoza';
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[40vh] w-full">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1662398961441-91d2f443895f"
            alt="Blog Inmobiliario Zaragoza"
            className="h-full w-full object-cover brightness-[0.8]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#252359]/70 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:max-w-3xl xl:max-w-4xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Blog Inmobiliario
          </h1>
          <p className="text-lg text-white mb-0 max-w-2xl">
            Artículos, guías y consejos sobre el mercado inmobiliario en Zaragoza
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-gray-700">Categorías:</span>
            <Link to="/blog" className="inline-block bg-[#252359] text-white px-3 py-1 rounded-md text-sm">
              Todas
            </Link>
            {allCategories.map((category, index) => (
              <Link 
                key={index} 
                to={`/blog/categoria/${category.toLowerCase()}`}
                className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative h-[400px] lg:h-full rounded-lg overflow-hidden">
            <img 
              src={blogPosts[0].coverImage} 
              alt={blogPosts[0].title}
              className="h-full w-full object-cover"
            />
          </div>
          
          <div className="flex flex-col justify-center">
            <div className="flex items-center mb-3">
              {blogPosts[0].categories.map((category, index) => (
                <span key={index} className="bg-[#252359]/10 text-[#252359] text-xs font-medium px-2 py-1 rounded mr-2">
                  {category}
                </span>
              ))}
            </div>
            
            <h2 className="text-3xl font-bold text-[#0D0D0D] mb-4">
              <Link to={`/blog/${blogPosts[0].slug}`} className="hover:text-[#252359]">
                {blogPosts[0].title}
              </Link>
            </h2>
            
            <p className="text-gray-600 mb-6 text-lg">
              {blogPosts[0].excerpt}
            </p>
            
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <span>Por {blogPosts[0].author}</span>
              <span className="mx-2">•</span>
              <span>{new Date(blogPosts[0].publishedAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            
            <Link to={`/blog/${blogPosts[0].slug}`} className="inline-block bg-[#252359] hover:bg-[#1a1a40] text-white font-medium py-2 px-4 rounded-md w-fit">
              Leer artículo
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-[#0D0D0D] mb-8">Artículos recientes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map(post => (
            <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
              <Link to={`/blog/${post.slug}`} className="block relative h-48 w-full">
                <img 
                  src={post.coverImage} 
                  alt={post.title} 
                  className="h-full w-full object-cover"
                />
              </Link>
              
              <div className="p-6">
                <div className="flex items-center mb-3">
                  {post.categories.slice(0, 2).map((category, index) => (
                    <span key={index} className="bg-[#252359]/10 text-[#252359] text-xs font-medium px-2 py-1 rounded mr-2">
                      {category}
                    </span>
                  ))}
                  {post.categories.length > 2 && (
                    <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded">
                      +{post.categories.length - 2}
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-[#0D0D0D] mb-3 line-clamp-2">
                  <Link to={`/blog/${post.slug}`} className="hover:text-[#252359]">
                    {post.title}
                  </Link>
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {new Date(post.publishedAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                  
                  <Link to={`/blog/${post.slug}`} className="text-[#252359] hover:text-[#1a1a40] font-medium text-sm">
                    Leer más →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className="mt-12 flex justify-center">
          <button className="border border-[#252359] text-[#252359] hover:bg-[#252359] hover:text-white font-medium py-2 px-4 rounded-md transition-colors">
            Cargar más artículos
          </button>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#0D0D0D] mb-3">Suscríbete a nuestra newsletter</h2>
          <p className="text-gray-600 mb-6">
            Recibe las últimas noticias del mercado inmobiliario y artículos de nuestro blog directamente en tu correo.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu email"
              className="flex-grow rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#252359] focus:border-[#252359]"
              required
            />
            <button
              type="submit"
              className="bg-[#252359] hover:bg-[#1a1a40] text-white font-medium py-2 px-4 rounded-md"
            >
              Suscribirme
            </button>
          </form>
          
          <p className="text-xs text-gray-500 mt-4">
            Al suscribirte, aceptas nuestra <Link to="/politica-privacidad" className="text-[#252359] hover:underline">política de privacidad</Link>.
            No compartiremos tu email con terceros y podrás darte de baja en cualquier momento.
          </p>
        </div>
      </section>
    </Layout>
  );
}

export default Blog;
