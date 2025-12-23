# DeskBooker System 🖥️

A modern, full-stack application for managing office desk reservations. Built with .NET Core and React, this system features overlapping reservation prevention, user-specific permissions, and a sleek dark-mode interface.

## ✨ Features
- **Smart Booking**: Select specific date and time ranges for your reservation.
- **Conflict Prevention**: Backend validation ensures no overlapping bookings for the same desk.
- **Account Management**: Support for multiple users with state persistence using `localStorage`.
- **User Permissions**: Secure cancellation logic - only the user who made the reservation can cancel it.
- **Live Updates**: The grid refreshes automatically to show the latest availability.
- **Premium UI**: Modern Glassmorphism design with responsive layouts and smooth animations.

## 🛠️ Tech Stack

### Backend
- **Framework**: .NET 9.0 (ASP.NET Core Web API)
- **Database**: SQLite (via Entity Framework Core)
- **Architecture**: Service-based pattern with DTOs.
- **Documentation**: Swagger/OpenAPI support.

### Frontend
- **Library**: React 18
- **Language**: TypeScript
- **Tooling**: Vite
- **Styling**: Vanilla CSS (Custom Design System)
- **Icons**: Custom SVG icons & UI Avatars API.

## 🚀 Getting Started

### Prerequisites
- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/)

### 1. Running the Backend
1. Navigate to the API folder:
   ```bash
   cd SharedDeskBooking.API
   ```
2. Run the application:
   ```bash
   dotnet run
   ```
   *Note: The database (`desks.db`) will be created and seeded with sample desks automatically on the first start.*

### 2. Running the Frontend
1. Navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser at `http://localhost:5173`.

## 📂 Project Structure
```text
├── SharedDeskBooking.API/  # ASP.NET Core Backend
│   ├── Controllers/        # API Endpoints
│   ├── Services/           # Business Logic (Booking rules)
│   ├── Models/             # DB Entities
│   ├── DTOs/               # Data Transfer Objects
│   └── Data/               # EF Core Context
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # React components & CSS
│   │   ├── api/            # Axios API client
│   │   └── types/          # TypeScript interfaces
│   └── public/             # Static Assets
```

## 📜 Assignment Context
This project was developed as part of a technical internship assignment, focusing on full-stack development, API reliability (handling overlaps), and modern frontend user experience.

---
Developed by **Ignas** 🚀
