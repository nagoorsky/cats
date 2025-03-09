# 🐱 Cat Facts App

A modern Angular application that displays endless cat facts using virtual scrolling. Built with Angular Material and styled with Tailwind CSS.

## ✨ Features

- 🔄 Infinite scrolling of cat facts
- 📱 Responsive design
- 🎨 Modern UI with Material Design
- 🔒 Authentication system
- 📜 Virtual scrolling for performance
- 🔄 "Start Over" functionality
- 🧪 Comprehensive test coverage

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/nagoorsky/cats.git

# Install dependencies
npm install
```

## 🛠️ Available Commands

### Development

```bash
# Start development server (opens automatically in browser)
npm start
```
The application will be available at `http://localhost:4200`

### Testing

```bash
# Run unit tests with coverage report
npm test

# Run end-to-end tests in Cypress GUI
npm run e2e

# Run end-to-end tests in headless mode
npm run e2e:run
```

## 🏗️ Project Structure

```
.
├── src/
│   ├── app/
│   │   ├── components/     # Application components
│   │   ├── services/       # Services for data fetching and auth
│   │   ├── guards/         # Route guards
│   │   └── shared/         # Shared resources
│   │       └── interfaces/ # TypeScript interfaces
│   ├── assets/            # Static assets
│   └── styles/           # Global styles
│
└── cypress/
    ├── e2e/              # End-to-end tests
    └── fixtures/         # Test data and mocks
```

## 🧪 Testing

### Unit Tests
- Using Jest as the test runner

### E2E Tests
- Using Cypress
- Tests located in `cypress/e2e/`
- Testing key user flows:
  - Authentication
  - Infinite scrolling
  - Error handling
  - Start Over functionality

## 🔒 Authentication

The application includes a simple authentication system:
- Login required to view cat facts
- Session management
- Protected routes
- Automatic redirect to login

## 🎯 Key Features Implementation

### Virtual Scrolling
- Implemented using `@angular/cdk/scrolling`
- Optimized performance for large lists
- Maintains scroll position

### Error Handling
- Duplicate fact detection
- User-friendly error messages
- Aborting retrieving new facts after 5 tries
  
## 🎨 Styling

- Material Design components from `@angular/material`
- Responsive design using Tailwind CSS
- Custom theme support
- Mobile-first approach

## 📱 Responsive Design

The application is fully responsive and tested on:
- Desktop browsers
- Tablets
- Mobile devices
