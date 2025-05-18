import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '@/components/layout/Layout';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: '',
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // En una implementación real, aquí enviaríamos los datos a la API
    console.log('Form data:', formData);
    
    // Simulación de respuesta exitosa
    setFormStatus({
      submitted: true,
      success: true,
      message: 'Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto contigo lo antes posible.',
    });
    
    // Limpiar el formulario
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  return (
    <Layout>
      <Head>
        <title>Contacto | Inmobiliaria Zaragoza</title>
        <meta name="description" content="Contacta con nuestro equipo inmobiliario en Zaragoza. Estamos aquí para ayudarte a encontrar tu hogar ideal o a vender tu propiedad." />
      </Head>

      {/* Hero Section */}
      <section className="relative h-[40vh] w-full">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1645441937235-f93d717e6485"
            alt="Contacto Inmobiliaria Zaragoza"
            fill
            priority
            className="object-cover brightness-[0.8]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-transparent" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:max-w-3xl xl:max-w-4xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Contacto
          </h1>
          <p className="text-lg text-white mb-0 max-w-2xl">
            Estamos aquí para ayudarte en todo lo que necesites
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-6 sm:px-8 md:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-dark mb-6">Envíanos un mensaje</h2>
            
            {formStatus.submitted && (
              <div className={`mb-8 p-4 rounded-md ${formStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {formStatus.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Asunto *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensaje *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full rounded-md border border-gray-300 py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                ></textarea>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="privacy"
                  required
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="privacy" className="ml-2 block text-sm text-gray-700">
                  He leído y acepto la <a href="/politica-privacidad" className="text-primary hover:underline">política de privacidad</a> *
                </label>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white font-medium py-3 px-6 rounded-md transition-colors"
                >
                  Enviar mensaje
                </button>
              </div>
            </form>
          </div>
          
          {/* Contact Information */}
          <div className="lg:pl-10">
            <h2 className="text-2xl font-bold text-dark mb-6">Información de contacto</h2>
            
            <div className="space-y-8 mb-10">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <MapPinIcon className="h-6 w-6 text-primary mt-1" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-dark">Dirección</h3>
                  <p className="text-gray-600 mt-1">
                    Paseo Independencia, 24<br />
                    50004 Zaragoza, España
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <PhoneIcon className="h-6 w-6 text-primary mt-1" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-dark">Teléfono</h3>
                  <p className="text-gray-600 mt-1">
                    <a href="tel:+34976123456" className="hover:text-primary">+34 976 123 456</a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <EnvelopeIcon className="h-6 w-6 text-primary mt-1" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-dark">Email</h3>
                  <p className="text-gray-600 mt-1">
                    <a href="mailto:info@inmobiliariazaragoza.com" className="hover:text-primary">info@inmobiliariazaragoza.com</a>
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-6 w-6 text-primary mt-1" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-dark">Horario</h3>
                  <p className="text-gray-600 mt-1">
                    Lunes a Viernes: 9:30 - 14:00 / 17:00 - 20:00<br />
                    Sábados: 10:00 - 13:30<br />
                    Domingos y festivos: Cerrado
                  </p>
                </div>
              </div>
            </div>
            
            {/* Map */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-dark mb-4">Encuéntranos</h3>
              <div className="h-[350px] bg-gray-200 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Mapa de ubicación (integración futura con Google Maps o similar)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-6 sm:px-8 md:px-12 lg:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-dark mb-8 text-center">Preguntas frecuentes</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">¿Cuáles son los servicios que ofrecéis?</h3>
              <p className="text-gray-600">
                Ofrecemos servicios completos de compraventa, alquiler, tasación, asesoramiento legal y financiero, y gestión inmobiliaria tanto para particulares como para empresas.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">¿Qué zonas de Zaragoza cubrís?</h3>
              <p className="text-gray-600">
                Trabajamos en todas las zonas de Zaragoza y alrededores, con especialistas para cada distrito de la ciudad.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">¿Qué documentación necesito para vender mi propiedad?</h3>
              <p className="text-gray-600">
                Necesitarás el título de propiedad, la referencia catastral, el certificado energético, y la última factura de suministros. Nuestro equipo te guiará en todo el proceso.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">¿Cómo puedo solicitar una visita a una propiedad?</h3>
              <p className="text-gray-600">
                Puedes solicitarla a través de nuestro formulario de contacto, llamándonos por teléfono o enviándonos un email con los detalles de la propiedad que te interesa.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">¿Ofrecéis asesoramiento hipotecario?</h3>
              <p className="text-gray-600">
                Sí, contamos con asesores financieros que te ayudarán a encontrar la mejor opción hipotecaria según tus necesidades y capacidad económica.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">¿Cuánto tiempo tarda el proceso de compraventa?</h3>
              <p className="text-gray-600">
                El tiempo medio es de 2-3 meses desde que se acepta la oferta hasta la firma de la escritura, dependiendo de varios factores como la financiación y los trámites legales.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
