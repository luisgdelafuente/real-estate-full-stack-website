import Head from 'next/head';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';

const teamMembers = [
  {
    name: 'Antonio García',
    role: 'Director General',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a',
    bio: 'Con más de 20 años de experiencia en el sector inmobiliario, Antonio lidera nuestro equipo con pasión y dedicación.'
  },
  {
    name: 'Elena Martínez',
    role: 'Consultora Inmobiliaria',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
    bio: 'Especialista en propiedades de lujo y con profundo conocimiento del mercado local en Zaragoza.'
  },
  {
    name: 'Carlos Rodríguez',
    role: 'Asesor Financiero',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    bio: 'Experto en financiación hipotecaria y asesoramiento a clientes para encontrar las mejores condiciones del mercado.'
  },
  {
    name: 'Laura Sánchez',
    role: 'Gestora de Marketing',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
    bio: 'Responsable de las estrategias de promoción y comunicación de nuestras propiedades y servicios.'
  },
];

const milestones = [
  { year: '2010', title: 'Fundación', description: 'Apertura de nuestra primera oficina en el centro de Zaragoza.' },
  { year: '2013', title: 'Expansión', description: 'Ampliación del equipo y especialización en diferentes áreas del mercado inmobiliario.' },
  { year: '2016', title: 'Digitalización', description: 'Lanzamiento de nuestra plataforma online para mejorar la experiencia de nuestros clientes.' },
  { year: '2020', title: 'Reconocimiento', description: 'Premio a la mejor agencia inmobiliaria local por la Asociación de Empresarios de Aragón.' },
  { year: '2023', title: 'Innovación', description: 'Implementación de tours virtuales y nuevas tecnologías para la visualización de propiedades.' },
];

export default function AboutUs() {
  return (
    <Layout>
      <Head>
        <title>Quiénes Somos | Inmobiliaria Zaragoza</title>
        <meta name="description" content="Conoce nuestro equipo de profesionales inmobiliarios en Zaragoza. Más de 10 años de experiencia ofreciendo un servicio personalizado y de calidad." />
      </Head>

      {/* Hero Section */}
      <section className="relative h-[40vh] w-full">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1622240241336-90c92e89c38c"
            alt="Zaragoza City Skyline"
            fill
            priority
            className="object-cover brightness-[0.8]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:max-w-3xl xl:max-w-4xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Quiénes Somos
          </h1>
          <p className="text-lg text-white mb-0 max-w-2xl">
            Conoce a nuestro equipo de profesionales inmobiliarios en Zaragoza
          </p>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-16 px-6 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-dark mb-6">Nuestra Historia</h2>
            <p className="text-gray-700 mb-4">
              Desde nuestra fundación en 2010, <span className="font-semibold text-primary">InmobiliariaZaragoza</span> se ha convertido en un referente del sector inmobiliario en la capital aragonesa, ofreciendo un servicio personalizado y de calidad a todos nuestros clientes.
            </p>
            <p className="text-gray-700 mb-4">
              Nuestro objetivo es hacer que el proceso de comprar, vender o alquilar una propiedad sea lo más sencillo y satisfactorio posible, acompañando a nuestros clientes en cada paso del camino.
            </p>
            <p className="text-gray-700">
              Contamos con un equipo de profesionales con amplia experiencia en el mercado inmobiliario local, comprometidos con ofrecer un asesoramiento honesto y transparente para conseguir los mejores resultados.
            </p>
          </div>
          <div className="lg:pl-10">
            <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-lg">
              <Image 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxhbGx8fHx8fHx8fHwxNjE0MzM5ODIy&ixlib=rb-1.2.1&q=80&w=1080&utm_source=unsplash_source&utm_medium=referral&utm_campaign=api-credit"
                alt="Equipo de Inmobiliaria Zaragoza"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 px-6 sm:px-8 md:px-12 lg:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark mb-4">Nuestros Valores</h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              Estos principios guían nuestro trabajo diario y definen nuestra forma de relacionarnos con nuestros clientes y colaboradores.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Profesionalidad</h3>
              <p className="text-gray-600">
                Aplicamos nuestros conocimientos y experiencia para ofrecer un servicio de máxima calidad.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Confianza</h3>
              <p className="text-gray-600">
                Construimos relaciones duraderas basadas en la honestidad y la transparencia.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Comunicación</h3>
              <p className="text-gray-600">
                Mantenemos una comunicación clara y constante durante todo el proceso.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovación</h3>
              <p className="text-gray-600">
                Incorporamos las últimas tecnologías para mejorar constantemente nuestro servicio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-6 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-dark mb-4">Nuestra Trayectoria</h2>
          <p className="text-gray-700 max-w-3xl mx-auto">
            Estos son algunos de los hitos más importantes en nuestra historia como empresa.
          </p>
        </div>
        
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-[9px] md:left-1/2 md:ml-[-1px] top-0 bottom-0 w-[2px] bg-gray-200"></div>
          
          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div key={index} className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="md:w-1/2 p-6 md:p-10">
                  <div className="bg-white p-6 rounded-lg shadow-sm md:mx-6">
                    <div className="flex items-center mb-4">
                      <span className="text-3xl font-bold text-primary">{milestone.year}</span>
                      <div className="ml-4 h-[2px] flex-grow bg-primary"></div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
                
                <div className="absolute left-0 md:left-1/2 top-10 md:top-[calc(50%-10px)] transform md:translate-x-[-50%] w-5 h-5 bg-primary rounded-full z-10"></div>
                
                <div className="md:w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 px-6 sm:px-8 md:px-12 lg:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark mb-4">Nuestro Equipo</h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              Contamos con profesionales experimentados en diferentes áreas del sector inmobiliario.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="h-64 relative">
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 sm:px-8 md:px-12 lg:px-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Quieres formar parte de nuestro equipo?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Siempre estamos buscando profesionales con talento y pasión por el sector inmobiliario.
          </p>
          <a href="/contacto" className="inline-block bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-md font-medium">
            Envíanos tu CV
          </a>
        </div>
      </section>
    </Layout>
  );
}
