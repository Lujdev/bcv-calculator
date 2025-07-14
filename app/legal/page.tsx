"use client"
import React from "react";
import { useRouter } from "next/navigation";

export default function AvisoLegal() {
  // Fecha de última actualización (cambiar según necesidad)
  const ultimaActualizacion = "15 de Julio de 2025";
  const router = useRouter();

  return (
    <main className="max-w-3xl mx-auto py-8 md:py-12 px-4">
      {/* Botón de volver atrás */}
      <button
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium px-4 py-2 rounded transition-colors border border-blue-200 bg-blue-50 hover:bg-blue-100 shadow-sm"
        aria-label="Volver atrás"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Volver atrás
      </button>
      <section className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2 tracking-tight uppercase">
            AVISO LEGAL Y EXENCIÓN DE RESPONSABILIDAD - VENEZUELA
          </h1>
          <div className="h-1 w-24 bg-blue-700 mx-auto rounded-full"></div>
        </div>

        <div className="space-y-6 text-gray-800 text-base leading-relaxed">
          {/* Nota sobre datos BCV */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg mb-4">
            <p className="font-medium text-blue-800">
              <strong>NOTA SOBRE DATOS OFICIALES:</strong> La sección de 
              <strong className="mx-1">Tasas de Cambio BCV (USD y EUR)</strong>
              obtiene información directamente del portal oficial del Banco Central de Venezuela:
            </p>
            <a 
              href="https://www.bcv.org.ve/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-2 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm font-medium transition-colors"
            >
              https://www.bcv.org.ve/
            </a>
          </div>

          {/* Puntos legales */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-start">
              <span className="bg-blue-700 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">1</span>
              Carácter Informativo y Alcance
            </h3>
            <p>
              Los datos de tasas de cambio proporcionados tienen carácter <strong>meramente informativo y referencial</strong>. 
              Solamente los datos marcados como "BCV" representan tasas oficiales emitidas por el Banco Central de Venezuela. 
              Las demás tasas son obtenidas de mercados secundarios y fuentes públicas no oficiales.
            </p>
          </div>

          <div className="border-b pb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-start">
              <span className="bg-blue-700 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">2</span>
              Volatilidad del Mercado Venezolano
            </h3>
            <p>
              Reconozco que el mercado cambiario venezolano presenta <strong className="text-red-600">alta volatilidad y variaciones significativas</strong>. 
              Los valores mostrados pueden diferir sustancialmente de las tasas reales en operaciones concretas y no reflejan 
              necesariamente el valor del bolívar en transacciones específicas.
            </p>
          </div>

          <div className="border-b pb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-start">
              <span className="bg-blue-700 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">3</span>
              Validez Legal y Regulatoria
            </h3>
            <p>
              Los resultados de esta calculadora <strong>no tienen validez legal</strong> para:
            </p>
            <ul className="list-disc list-inside mt-2 ml-4 text-gray-700 space-y-1">
              <li>Transacciones formales y contratos</li>
              <li>Declaraciones fiscales ante el SENIAT</li>
              <li>Procesos aduaneros</li>
              <li>Cualquier trámite gubernamental</li>
            </ul>
            <p className="mt-2">
              Para operaciones con respaldo jurídico, consulte exclusivamente con instituciones financieras autorizadas 
              por la Superintendencia de las Instituciones del Sector Bancario (SUDEBAN).
            </p>
          </div>

          <div className="border-b pb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-start">
              <span className="bg-blue-700 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">4</span>
              Limitación de Responsabilidad
            </h3>
            <p>
              Renunciamos expresamente a toda responsabilidad por pérdidas o daños derivados del uso de esta herramienta, incluyendo:
            </p>
            <ul className="list-disc list-inside mt-2 ml-4 text-gray-700 space-y-1">
              <li>Fluctuaciones cambiarias abruptas</li>
              <li>Diferencias entre tasas paralelas y oficiales</li>
              <li>Decisiones económicas basadas en esta información</li>
              <li>Cambios regulatorios del gobierno venezolano</li>
              <li>Discrepancias con tasas de entidades bancarias</li>
            </ul>
          </div>

          <div className="border-b pb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-start">
              <span className="bg-blue-700 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">5</span>
              Propósito y Alcance
            </h3>
            <p>
              Este servicio tiene únicamente fines educativos e informativos. <strong>No está asociado</strong> al Gobierno de Venezuela, 
              al BCV, ni a ninguna entidad financiera regulada por la SUDEBAN. No busca influir en políticas económicas, 
              mercados cambiarios ni comportamientos financieros en Venezuela.
            </p>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mt-6">
            <h3 className="font-bold text-yellow-800 mb-1">Declaración de Independencia</h3>
            <p className="text-yellow-700">
              Esta plataforma es un servicio independiente. No tenemos afiliación, conexión ni respaldo oficial 
              del Banco Central de Venezuela (BCV), SUDEBAN, ni cualquier entidad gubernamental venezolana.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-4 border-t border-gray-200 text-sm text-gray-500">
            <p>
              <strong>Última actualización:</strong> {ultimaActualizacion}
            </p>
            <p className="mt-2 sm:mt-0">
              <strong>Jurisdicción:</strong> República Bolivariana de Venezuela
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}