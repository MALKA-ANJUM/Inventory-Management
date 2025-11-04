# Inventory Management System

A full-stack app built with **Laravel (backend)** and **React (frontend)**.

## 🚀 Quick Start

### Requirements
- PHP 8+
- Composer
- MySQL
- Node.js (optional, only if rebuilding frontend)

### Steps

1. Extract the zip.
2. Go to the backend folder:
   ```bash
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate
   php artisan serve
```