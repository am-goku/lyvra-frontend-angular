# Lyvra - E-commerce Frontend

Lyvra is a modern, high-performance e-commerce frontend built with **Angular 20** and **Tailwind CSS 4**. It features a clean, responsive design and is optimized for speed and developer experience.

## ✨ Features

- **🛍️ Product Discovery**: Advanced product filtering and sorting in a responsive product list.
- **🔍 Quick View & Details**: Detailed product views with image galleries, size/color selectors, and stock alerts.
- **🛒 Cart Management**: Seamless "Add to Cart" functionality with persistent state.
- **🔐 Secure Authentication**: Integrated OIDC-based authentication and user account management.
- **🛡️ Admin Dashboard**: Dedicated administrative interface for managing products, orders, and users.
- **💳 Checkout Flow**: Streamlined checkout process for improved conversion.
- **🎨 Modern UI/UX**: Designed with Tailwind CSS 4 and Lucide-Angular icons for a premium feel.

## 🛠️ Tech Stack

- **Framework**: [Angular 20](https://angular.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [RxJS](https://rxjs.dev/)
- **Icons**: [Lucide Angular](https://lucide.dev/guide/packages/lucide-angular)
- **Auth**: [angular-oauth2-oidc](https://github.com/manfredsteyer/angular-oauth2-oidc)

## 📂 Project Structure

```text
src/
├── app/
│   ├── core/           # Interceptors, guards, services, and core utilities.
│   ├── features/       # Feature-based modules (Admin, Auth, Cart, Products, etc.).
│   ├── layouts/        # Page layouts (UserLayout, AdminLayout).
│   ├── models/         # TypeScript interfaces and type definitions.
│   ├── shared/         # Reusable components, pipes, and directives.
│   └── app.routes.ts   # Main application routing configuration.
├── environments/       # Environment-specific configurations.
├── public/             # Static assets.
└── styles.css          # Global styles and Tailwind imports.
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [Angular CLI](https://angular.dev/tools/cli)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd lyvra
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development Server

Run the development server using:

```bash
npm start
```

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

To build the project for production, run:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 📜 Available Scripts

- `npm start`: Runs the development server.
- `npm run build`: Builds the application for production.
- `npm test`: Executes unit tests via [Karma](https://karma-runner.github.io).
- `npm run watch`: Builds and watches for changes (development).
