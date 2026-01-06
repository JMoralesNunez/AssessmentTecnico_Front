# Course Platform Frontend

A modern, responsive frontend for a course management platform built with **Vue.js 3**, **Tailwind CSS**, and **Pinia**.

## 🚀 Features

### 🔐 Authentication
- **Secure Login & Register**: Integrated with JWT authentication.
- **Token Management**: Automatic handling of `accessToken` and `refreshToken` using cookies and Axios interceptors.
- **Protected Routes**: Navigation guards to prevent unauthorized access to the dashboard.
- **Persistent Sessions**: Seamless token refresh logic to keep users logged in.

### 📚 Course Management
- **CRUD Operations**: Create, Read, Update, and Soft-Delete courses.
- **Enhanced Listing**: Course filtering by title and status (Draft/Published) and full pagination.
- **Publishing Safeguards**: Prevents publishing courses without assigned lessons.
- **Visual Feedback**: Modern "glassmorphism" cards with real-time status updates.

### 📝 Lesson Management
- **Detailed Content**: Manage lessons for each specific course.
- **Smart Reordering**: Intuitively move lessons up or down with instant backend synchronization.
- **Validation**: Prevents duplicate lesson orders to maintain consistency.

## 🛠️ Tech Stack

- **Core**: [Vue 3](https://vuejs.org/) (Composition API)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Routing**: [Vue Router](https://router.vuejs.org/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Utility**: `js-cookie` for secure token storage.

## 📦 Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- Backend API running at `http://localhost:5028`

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/JMoralesNunez/AssessmentTecnico_Front.git
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the development server:
   ```sh
   npm run dev
   ```

### 🐳 Docker
Alternatively, you can run the application using Docker:

1. **Build the image**:
   ```sh
   docker build -t course-platform-front .
   ```
2. **Run the container**:
   ```sh
   docker run -d -p 8080:80 course-platform-front
   ```
   The app will be available at `http://localhost:8080`.

## 🏗️ Architecture

- **`src/api/axios.js`**: Centralized API configuration with global error handling and token refresh interceptors.
- **`src/stores/`**: Pinia stores for decoupled state management (`auth`, `courses`, `lessons`).
- **`src/views/`**: Page-level components for major features.
- **`src/components/`**: Reusable UI elements (Modals, Pagination, etc.).

---
