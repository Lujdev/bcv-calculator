# BCV Calculator

<p align="center">
  <img src="/public/placeholder-logo.svg" alt="BCV Calculator Logo" width="220" />
</p>

[![Next.js](https://img.shields.io/badge/Built%20with-Next.js-blue?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/luis-molinas-projects/v0-bcv-calculador)

---

## 📈 ¿Qué es BCV Calculator?

**BCV Calculator** es una aplicación web moderna construida con Next.js y Tailwind CSS que permite consultar y comparar tasas de cambio USD/BS y EUR/BS en Venezuela, tanto oficiales (BCV) como de mercados secundarios (Binance). Incluye calculadoras rápidas, diferencias entre tasas y un aviso legal detallado.

---

## ✨ Características principales

- Consulta en tiempo real de tasas oficiales del BCV y tasas de Binance (compra/venta).
- Calculadora de conversión USD ↔️ BS y BS ↔️ USD/EUR.
- Diferencia entre tasas oficiales y paralelas.
- Aviso legal y exención de responsabilidad accesible desde la app.
- Interfaz responsiva, moderna y accesible.
- Notificaciones y feedback visual amigable.

---

## 🚀 Instalación y ejecución local

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/bcv-calculator.git
   cd bcv-calculator
   ```

2. **Instala las dependencias:**
   ```bash
   pnpm install
   # o
   npm install
   # o
   yarn install
   ```

3. **Ejecuta el servidor de desarrollo:**
   ```bash
   pnpm dev
   # o
   npm run dev
   # o
   yarn dev
   ```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🗂️ Estructura del proyecto

- `app/` — Páginas principales y rutas API (Next.js App Router)
  - `page.tsx` — Página principal con calculadoras y tasas
  - `legal/page.tsx` — Aviso legal y exención de responsabilidad
  - `api/` — Endpoints para obtener tasas BCV y Binance
- `components/` — Componentes reutilizables de UI
- `hooks/` — Custom hooks
- `lib/` — Utilidades compartidas
- `public/` — Imágenes y recursos estáticos
- `styles/` — Estilos globales

---

## 🛠️ Tecnologías principales

- [Next.js 15](https://nextjs.org/)
- [React 19](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide React Icons](https://lucide.dev/)
- [Sonner](https://sonner.emilkowal.ski/) (notificaciones)

---

## 📄 Aviso legal

La información de tasas BCV proviene del portal oficial del Banco Central de Venezuela ([https://www.bcv.org.ve/](https://www.bcv.org.ve/)). Las tasas de Binance y otras fuentes son informativas y no oficiales. Consulta el [Aviso Legal](/legal) para más detalles.

---

## 📬 Contacto y soporte

¿Tienes sugerencias, dudas o encontraste un bug? ¡Abre un issue o contacta al autor!

