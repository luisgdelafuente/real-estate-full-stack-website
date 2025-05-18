import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';

// Datos de ejemplo para un artículo de blog
const blogPostData = {
  id: '1',
  title: 'Guía para comprar tu primera vivienda en Zaragoza',
  slug: 'guia-comprar-primera-vivienda-zaragoza',
  excerpt: 'Todo lo que necesitas saber antes de embarcarte en la compra de tu primera vivienda en la capital aragonesa.',
  content: `
    <p>Comprar una vivienda es probablemente una de las decisiones financieras más importantes que tomarás en tu vida. Si estás pensando en adquirir tu primera propiedad en Zaragoza, esta guía te ayudará a navegar por todo el proceso, desde la planificación inicial hasta la firma de la escritura.</p>

    <h2>1. Planificación financiera</h2>
    
    <p>Antes de empezar a buscar vivienda, es fundamental tener claras tus posibilidades económicas:</p>
    
    <ul>
      <li><strong>Presupuesto disponible:</strong> Calcula cuánto puedes permitirte gastar considerando tus ahorros y capacidad de endeudamiento.</li>
      <li><strong>Gastos asociados:</strong> Además del precio de compra, deberás hacer frente a impuestos (IVA o ITP), gastos de notaría, registro y, en su caso, comisiones inmobiliarias.</li>
      <li><strong>Financiación:</strong> Consulta con diferentes entidades bancarias para conocer las condiciones hipotecarias que te ofrecen (interés, plazo, comisiones).</li>
    </ul>

    <h2>2. Define tus prioridades</h2>
    
    <p>Antes de empezar a visitar propiedades, piensa en qué es lo que realmente necesitas:</p>
    
    <ul>
      <li><strong>Ubicación:</strong> ¿Prefieres vivir en el centro o en barrios residenciales más tranquilos?</li>
      <li><strong>Tamaño:</strong> Determina el número de habitaciones y metros cuadrados que necesitas.</li>
      <li><strong>Estado:</strong> ¿Buscas una vivienda lista para entrar a vivir o estás dispuesto a reformar?</li>
      <li><strong>Servicios cercanos:</strong> Valora la proximidad a transporte público, colegios, comercios, zonas verdes, etc.</li>
    </ul>

    <h2>3. Conoce los barrios de Zaragoza</h2>
    
    <p>Zaragoza ofrece una gran variedad de zonas, cada una con sus propias características:</p>
    
    <ul>
      <li><strong>Centro:</strong> Gran ambiente, todos los servicios, pero precios más elevados y menos zonas verdes.</li>
      <li><strong>Actur-Rey Fernando:</strong> Barrio moderno, bien comunicado y con amplias zonas verdes.</li>
      <li><strong>Delicias:</strong> El barrio más poblado, con precios más asequibles y buena oferta comercial.</li>
      <li><strong>Universidad:</strong> Ideal para inversores o familias jóvenes, cerca del campus y con buena vida cultural.</li>
      <li><strong>Valdespartera/Montecanal:</strong> Zonas nuevas, amplias avenidas y espacios verdes, ideales para familias.</li>
      <li><strong>La Almozara:</strong> Bien comunicado, con buena relación calidad-precio.</li>
    </ul>

    <h2>4. Inicia la búsqueda</h2>
    
    <p>Ahora que tienes claras tus necesidades y posibilidades, es momento de empezar a buscar:</p>
    
    <ul>
      <li>Consulta portales inmobiliarios online.</li>
      <li>Contacta con agencias inmobiliarias locales.</li>
      <li>Utiliza tus redes sociales y contactos personales.</li>
      <li>Visita la zona que te interesa para identificar carteles de venta.</li>
    </ul>

    <h2>5. Visitas y valoración de las propiedades</h2>
    
    <p>Al visitar viviendas, presta atención a estos aspectos:</p>
    
    <ul>
      <li>Orientación y luminosidad.</li>
      <li>Estado de la fachada y zonas comunes.</li>
      <li>Antigüedad de las instalaciones (electricidad, fontanería, calefacción).</li>
      <li>Calidad de los acabados.</li>
      <li>Posibles humedades o grietas.</li>
      <li>Certificación energética.</li>
      <li>Ruidos del entorno o vecinos.</li>
    </ul>

    <h2>6. Negociación y compra</h2>
    
    <p>Una vez hayas encontrado la vivienda ideal:</p>
    
    <ul>
      <li>Negocia el precio basándote en comparativas de la zona y posibles deficiencias.</li>
      <li>Firma un contrato de arras, estableciendo un período y condiciones para la compraventa definitiva.</li>
      <li>Solicita la hipoteca si es necesario.</li>
      <li>Revisa detenidamente la documentación de la vivienda (nota simple, certificado energético, etc.).</li>
      <li>Firma la escritura ante notario y registra la propiedad a tu nombre.</li>
    </ul>

    <h2>7. Después de la compra</h2>
    
    <p>No olvides estos trámites posteriores:</p>
    
    <ul>
      <li>Cambio de titularidad de los suministros (agua, luz, gas).</li>
      <li>Notificación del cambio de domicilio en documentos oficiales.</li>
      <li>Domiciliación de los recibos de la comunidad de propietarios.</li>
      <li>Contratación de un seguro de hogar adecuado.</li>
    </ul>

    <p>En <strong>InmobiliariaZaragoza</strong> contamos con asesores especializados que pueden guiarte durante todo este proceso, ofreciéndote las mejores opciones según tus necesidades y ayudándote con todos los trámites necesarios. No dudes en contactarnos para comenzar la búsqueda de tu hogar ideal en Zaragoza.</p>
  `,
  coverImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
  author: {
    name: 'Elena Martínez',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
    position: 'Consultora Inmobiliaria'
  },
  publishedAt: '2023-04-15',
  categories: ['Compra', 'Guías', 'Principiantes'],
  relatedPosts: [
    {
      id: '2',
      title: 'Los mejores barrios para vivir en Zaragoza en 2025',
      slug: 'mejores-barrios-vivir-zaragoza-2025',
      coverImage: 'https://images.unsplash.com/photo-1662398960296-b58d8f7d589b',
      publishedAt: '2025-01-23',
    },
    {
      id: '3',
      title: 'Cómo preparar tu piso para la venta y conseguir el mejor precio',
      slug: 'como-preparar-piso-venta-mejor-precio',
      coverImage: 'https://images.unsplash.com/photo-1594408065362-379a5b60910b',
      publishedAt: '2024-09-05',
    },
    {
      id: '4',
      title: 'Las últimas tendencias en diseño de interiores para 2025',
      slug: 'tendencias-diseno-interiores-2025',
      coverImage: 'https://images.unsplash.com/photo-1683629357963-adf2b1fa9ad9',
      publishedAt: '2025-02-10',
    }
  ]
};

function BlogPost() {
  const { slug } = useParams();
  
  React.useEffect(() => {
    document.title = `${blogPostData.title} | Inmobiliaria Zaragoza`;
  }, []);
  
  // Formatear fecha
  const formattedDate = new Date(blogPostData.publishedAt).toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <Layout>
      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link to="/" className="text-gray-500 hover:text-[#252359]">
                  Inicio
                </Link>
              </li>
              <li className="text-gray-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li>
                <Link to="/blog" className="text-gray-500 hover:text-[#252359]">
                  Blog
                </Link>
              </li>
              <li className="text-gray-500">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-[#252359] font-medium truncate max-w-xs">
                {blogPostData.title}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <article className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Post Header */}
          <header className="mb-8">
            <div className="flex items-center mb-4">
              {blogPostData.categories.map((category, index) => (
                <Link key={index} to={`/blog/categoria/${category.toLowerCase()}`} className="bg-[#252359]/10 text-[#252359] text-sm font-medium px-3 py-1 rounded mr-2 hover:bg-[#252359]/20">
                  {category}
                </Link>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-[#0D0D0D] mb-4">
              {blogPostData.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6">
              {blogPostData.excerpt}
            </p>
            
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
                <img 
                  src={blogPostData.author.image} 
                  alt={blogPostData.author.name} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-[#0D0D0D]">{blogPostData.author.name}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{blogPostData.author.position}</span>
                  <span className="mx-2">•</span>
                  <time dateTime={blogPostData.publishedAt}>{formattedDate}</time>
                </div>
              </div>
            </div>
          </header>
          
          {/* Featured Image */}
          <div className="relative h-[400px] rounded-lg overflow-hidden mb-10">
            <img 
              src={blogPostData.coverImage} 
              alt={blogPostData.title} 
              className="h-full w-full object-cover"
            />
          </div>
          
          {/* Post Content */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: blogPostData.content }}
          />
          
          {/* Tags and Share */}
          <div className="mt-12 flex flex-wrap justify-between items-center py-6 border-t border-b border-gray-200">
            <div className="flex flex-wrap items-center mb-4 md:mb-0">
              <span className="text-gray-700 mr-2">Etiquetas:</span>
              {blogPostData.categories.map((category, index) => (
                <Link key={index} to={`/blog/categoria/${category.toLowerCase()}`} className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded mr-2 hover:bg-gray-200">
                  {category}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center">
              <span className="text-gray-700 mr-3">Compartir:</span>
              <div className="flex space-x-2">
                <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-400 hover:bg-blue-500 text-white">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-green-600 hover:bg-green-700 text-white">
                  <span className="sr-only">WhatsApp</span>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-800 hover:bg-blue-900 text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Author Bio */}
          <div className="mt-12 bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center">
              <div className="w-20 h-20 rounded-full overflow-hidden mr-6 flex-shrink-0">
                <img 
                  src={blogPostData.author.image} 
                  alt={blogPostData.author.name} 
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#0D0D0D] mb-1">Sobre {blogPostData.author.name}</h3>
                <p className="text-[#252359] font-medium mb-2">{blogPostData.author.position}</p>
                <p className="text-gray-600">
                  Especialista en propiedades de lujo y con profundo conocimiento del mercado local en Zaragoza. Con más de 10 años de experiencia en el sector inmobiliario, Elena se dedica a encontrar la vivienda perfecta para cada cliente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0D0D0D] mb-8">Artículos relacionados</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPostData.relatedPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                <Link to={`/blog/${post.slug}`} className="block relative h-48 w-full">
                  <img 
                    src={post.coverImage} 
                    alt={post.title} 
                    className="h-full w-full object-cover"
                  />
                </Link>
                
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#0D0D0D] mb-2 line-clamp-2">
                    <Link to={`/blog/${post.slug}`} className="hover:text-[#252359]">
                      {post.title}
                    </Link>
                  </h3>
                  
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
        </div>
      </section>
    </Layout>
  );
}

export default BlogPost;
