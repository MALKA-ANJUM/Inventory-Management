🧾 Inventory Management System
--
A full-stack Inventory Management web application built using Laravel  and React.
This system allows users to manage products, including adding, updating, deleting, and viewing stock quantities with real-time updates.

🚀 Features
--
🔐 Token-based Authentication – Register, Login, and Logout securely

📦 Product Management (CRUD) – Create, Read, Update, Delete products

📊 Stock Management – Track stock levels and product availability

🧩 Dynamic Variant Support – Handle multiple product variants with separate stock quantities

🎨 Responsive UI – Built with Bootstrap 5

🔄 Token-based API communication between React and Laravel

🛠️ Tech Stack
Layer	Technology
Frontend	React, Bootstrap 5, Axios, Vite
Backend	Laravel 10 (PHP 8+), Sanctum
Database	MySQL


⚙️ Installation Guide
🔹 1. Clone the Repository
```bash
git clone https://github.com/MALKA-ANJUM/Inventory-Management.git
cd Inventory-Management
```

🔹 2. Backend Setup (Laravel)
```bash
cd backend
composer install
php artisan key:generate
```


Then update your .env file:

```bash
DB_DATABASE=inventory_management
DB_USERNAME=root
DB_PASSWORD=
```


Run migrations:
```bash
php artisan migrate
```


Start the Laravel server:
```bash
php artisan serve
```

By default, the backend will run at:
```bash
👉 http://127.0.0.1:8000
```

💡 Developer

👩‍💻 Malka Anjum
Full Stack Developer (Laravel + React)
