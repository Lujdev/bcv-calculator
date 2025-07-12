# AI Development Rules for BCV_Calculador

This document outlines the technical stack and specific guidelines for developing features within this application.

## Tech Stack Overview

*   **Framework:** Next.js (React)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI Components:** shadcn/ui (built on Radix UI)
*   **Icons:** Lucide React
*   **Toasts/Notifications:** Sonner
*   **Form Management:** React Hook Form with Zod for validation
*   **Data Fetching:** Native Fetch API for client-side, Next.js API Routes for server-side.
*   **Utility Functions:** `clsx` and `tailwind-merge` (via `cn` helper) for combining CSS classes.
*   **Other Libraries:** Embla Carousel (for carousels), React Day Picker (for date pickers), Input OTP (for OTP inputs), Recharts (for charts), Vaul (for drawers), Next Themes (for theme management).

## Library Usage Guidelines

To maintain consistency and efficiency, please adhere to the following rules when implementing new features or modifying existing ones:

*   **UI Components:** Always prioritize using components from `shadcn/ui`. These components are pre-styled with Tailwind CSS and provide accessibility features. If a required component is not available in `shadcn/ui`, consider building a custom component using Radix UI primitives and Tailwind CSS.
*   **Styling:** All styling must be done using **Tailwind CSS classes**. Avoid inline styles or separate CSS files unless absolutely necessary for dynamic values that cannot be expressed with Tailwind.
*   **Icons:** Use icons from the `lucide-react` library.
*   **Notifications:** For any toast or notification messages, use the `sonner` library.
*   **Forms:** Implement forms using `react-hook-form` for state management and `zod` for schema validation.
*   **Data Fetching:**
    *   For client-side data fetching (e.g., fetching exchange rates from external APIs), use the native `fetch` API.
    *   For server-side logic or sensitive operations (like the Binance rate fetching), utilize Next.js API Routes (e.g., `app/api/binance-rate/route.ts`).
*   **File Structure:**
    *   React components should be placed in the `components/ui/` or `components/` directories.
    *   Pages should reside in the `app/` directory as per Next.js conventions (e.g., `app/page.tsx`).
    *   Custom React hooks should be in the `hooks/` directory.
    *   General utility functions should be in the `lib/` directory.
*   **Responsiveness:** All new UI elements and layouts must be designed to be fully responsive across different screen sizes using Tailwind's responsive utilities.
*   **Simplicity:** Keep the code simple and elegant. Avoid over-engineering solutions. Implement only what is requested, focusing on functionality and maintainability.
