import Link from 'next/link';
import { Suspense } from 'react';
import {
  Search,
  TrendingDown,
  CheckCircle,
  Users,
  DollarSign,
  Award,
  MapPin,
  Car,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';
import HomeClient from '../HomeClient';
import FAQSchema from '../components/FAQSchema';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Autos Nuevos y Usados en Venta | IQ Auto Deals',
  description: 'Compra autos usados de calidad en línea. Compara precios de concesionarios locales, recibe ofertas competitivas. ✓ Sin regateo ✓ Gratis ✓ Concesionarios verificados.',
  alternates: {
    canonical: 'https://iqautodeals.com/es',
    languages: {
      'en': 'https://iqautodeals.com',
      'es': 'https://iqautodeals.com/es',
    },
  },
};

export default function HomePageES() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <HomeClient
        lang="es"
        howItWorksSection={
          <section className="container mx-auto px-4 py-10">
            <div className="text-center max-w-3xl mx-auto mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-2">Cómo Comprar Vehículos Nuevos y Usados en Línea</h2>
              <p className="text-base text-text-secondary">Busca vehículos, solicita ofertas competitivas de concesionarios verificados y ahorra.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div className="bg-black p-5 rounded-xl shadow-card hover:shadow-card-hover transition-all group">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-base font-bold mb-2 text-white">1. Busca Localmente</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Explora miles de vehículos de concesionarios cerca de ti.
                </p>
              </div>

              <div className="bg-black p-5 rounded-xl shadow-card hover:shadow-card-hover transition-all group">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                  <TrendingDown className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-base font-bold mb-2 text-white">2. Solicita Ofertas</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Selecciona hasta 4 autos y haz que los concesionarios compitan por tu negocio.
                </p>
              </div>

              <div className="bg-black p-5 rounded-xl shadow-card hover:shadow-card-hover transition-all group">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <h3 className="text-base font-bold mb-2 text-white">3. Elige y Reserva</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Acepta la mejor oferta y reserva tu vehículo.
                </p>
              </div>
            </div>
          </section>
        }

        benefitsSection={
          <section className="bg-white py-20 border-t border-border">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">¿Por Qué Elegir Nuestro Mercado Nacional de Autos?</h2>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                  El mercado en línea confiable para vehículos nuevos, certificados pre-usados y de calidad. Compara precios de concesionarios verificados que compiten por tu negocio.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                <div className="bg-black p-8 rounded-xl shadow-card hover:shadow-card-hover transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Para Compradores</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex gap-3 items-start">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Busca miles de vehículos de concesionarios locales</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Selecciona hasta 4 autos y mira cómo los concesionarios compiten</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Recibe hasta 4 ofertas competitivas por vehículo</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Reserva tu auto al mejor precio</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-black p-8 rounded-xl shadow-card hover:shadow-card-hover transition-all">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Para Concesionarios</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex gap-3 items-start">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Prueba gratuita de 90 días - Paquetes Silver, Gold, Platinum</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Conecta con compradores serios y motivados</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Envía ofertas competitivas para ganar tratos</span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">Cierra más ventas más rápido</span>
                    </li>
                  </ul>
                  <Link
                    href="/for-dealers"
                    className="mt-6 inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-light transition-colors"
                  >
                    Más Sobre Beneficios para Concesionarios
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        }

        resourcesSection={
          <section className="bg-white py-20 border-t border-border">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Guías y Recursos para Comprar Autos</h2>
                <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                  Consejos de expertos para ayudarte a tomar decisiones informadas sobre la compra de tu próximo auto
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <Link href="/blog/how-to-finance-used-car-2025" className="bg-black rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all group">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <DollarSign className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white group-hover:text-primary transition-colors">
                    Cómo Financiar un Auto Usado
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Guía completa para obtener las mejores tasas y términos de préstamo
                  </p>
                  <span className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Leer Artículo <ArrowRight className="w-4 h-4" /></span>
                </Link>

                <Link href="/blog/new-vs-used-cars-first-time-buyers" className="bg-black rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all group">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white group-hover:text-primary transition-colors">
                    Autos Nuevos vs Usados
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    ¿Cuál es la mejor opción para compradores primerizos? Compara costos y beneficios
                  </p>
                  <span className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Leer Artículo <ArrowRight className="w-4 h-4" /></span>
                </Link>

                <Link href="/blog/best-used-cars-under-20k" className="bg-black rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all group">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <Award className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white group-hover:text-primary transition-colors">
                    Mejores Autos Usados Menos de $20k
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Nuestras selecciones de expertos para vehículos confiables y asequibles
                  </p>
                  <span className="text-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Leer Artículo <ArrowRight className="w-4 h-4" /></span>
                </Link>
              </div>
            </div>
          </section>
        }

        browseSection={
          <section className="bg-white py-20 border-t border-border">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                  Busca Autos por Ubicación o Modelo
                </h2>
                <p className="text-lg text-text-secondary">Encuentra el vehículo perfecto en tu área o busca por tu marca y modelo favorito</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                <Link href="/locations" className="bg-black rounded-xl p-8 shadow-card hover:shadow-card-hover transition-all group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center">
                      <MapPin className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Buscar por Ubicación</h3>
                  </div>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    Encuentra autos usados de concesionarios confiables en tu ciudad. Cubrimos los 50 estados y más de 180 ciudades principales en EE.UU.
                  </p>
                  <div className="flex items-center text-primary font-semibold group-hover:gap-3 transition-all">
                    Ver Todas las Ubicaciones
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>

                <Link href="/models" className="bg-black rounded-xl p-8 shadow-card hover:shadow-card-hover transition-all group">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center">
                      <Car className="w-10 h-10 text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Buscar por Modelo</h3>
                  </div>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    Compra autos usados por tu marca y modelo favorito. Encuentra vehículos populares de Toyota, Honda, Ford, Chevrolet y más.
                  </p>
                  <div className="flex items-center text-accent font-semibold group-hover:gap-3 transition-all">
                    Ver Todos los Modelos
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>
            </div>
          </section>
        }

        faqSection={
          <section className="bg-light-dark py-20 border-t border-border">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 flex items-center justify-center gap-3">
                  <HelpCircle className="w-10 h-10 text-primary" />
                  Preguntas Frecuentes
                </h2>
                <p className="text-lg text-text-secondary">Todo lo que necesitas saber sobre comprar y vender autos en IQ Auto Deals</p>
              </div>

              <div className="max-w-3xl mx-auto space-y-4">
                <div className="bg-black p-6 rounded-xl shadow-card">
                  <h3 className="text-lg font-bold text-white mb-3">¿Cómo funciona la plataforma?</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Nuestro mercado nacional te conecta con las mejores ofertas en autos usados de calidad. Busca miles de vehículos de concesionarios locales dentro de 50 millas, selecciona hasta 4 autos que te gusten y solicita ofertas competitivas. Los concesionarios compiten para ganar tu negocio ofreciendo sus precios más bajos.
                  </p>
                </div>

                <div className="bg-black p-6 rounded-xl shadow-card">
                  <h3 className="text-lg font-bold text-white mb-3">¿Es gratis para los compradores?</h3>
                  <p className="text-gray-400 leading-relaxed">
                    ¡Sí! Buscar autos y solicitar ofertas de concesionarios es completamente gratis. No hay tarifas ocultas, no hay costos de membresía y no hay obligaciones. Solo pagas cuando decides comprar un vehículo.
                  </p>
                </div>

                <div className="bg-black p-6 rounded-xl shadow-card">
                  <h3 className="text-lg font-bold text-white mb-3">¿Cuántas ofertas recibiré?</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Puedes recibir hasta 4 ofertas competitivas por vehículo de diferentes concesionarios. Esto te da múltiples opciones para comparar y asegura que obtengas la mejor oferta disponible en tu área.
                  </p>
                </div>

                <div className="bg-black p-6 rounded-xl shadow-card">
                  <h3 className="text-lg font-bold text-white mb-3">¿Los concesionarios son certificados y legítimos?</h3>
                  <p className="text-gray-400 leading-relaxed">
                    ¡Sí! Todos los concesionarios en nuestro mercado son concesionarios automotrices licenciados y certificados. Verificamos las credenciales, licencia comercial y reputación de cada concesionario antes de aprobarlos.
                  </p>
                </div>
              </div>

              <FAQSchema faqs={[
                {
                  question: '¿Cómo funciona la plataforma?',
                  answer: 'Nuestro mercado nacional te conecta con las mejores ofertas en autos usados de calidad. Busca miles de vehículos de concesionarios locales, selecciona hasta 4 autos y solicita ofertas competitivas.'
                },
                {
                  question: '¿Es gratis para los compradores?',
                  answer: '¡Sí! Buscar autos y solicitar ofertas es completamente gratis. No hay tarifas ocultas ni obligaciones.'
                },
                {
                  question: '¿Cuántas ofertas recibiré?',
                  answer: 'Puedes recibir hasta 4 ofertas competitivas por vehículo de diferentes concesionarios.'
                },
                {
                  question: '¿Los concesionarios son certificados?',
                  answer: 'Sí, todos los concesionarios son licenciados y certificados. Verificamos credenciales y reputación antes de aprobarlos.'
                }
              ]} />
            </div>
          </section>
        }
      />
    </Suspense>
  );
}
