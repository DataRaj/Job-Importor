# 🚀 Quick Commerce Admin Dashboard (Frontend)

This is the **frontend** for the Quick Commerce Admin Dashboard — a responsive and interactive admin interface built using **Next.js**, **Tailwind CSS**, and **shadcn/ui**. It allows administrators to manage products, categories, shopkeepers, and orders.

---

## 🔗 Live Demo

👉 [https://quick-ecom-vert.vercel.app](https://quick-ecom-vert.vercel.app)

---

## 🔧 Tech Stack

- **Framework**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **API Communication**: Axios
- **Authentication**: Mock login (`admin@example.com / password123`)
- **Debounced Search**: Custom hook or lodash.debounce

---

## 📁 Features

- 🔐 Mock Login Authentication
- 📊 Dashboard Overview with mock stats
- 📦 Product Management (Add, View, Filter)
- 🗂️ Category Management (In-memory)
- 🛍️ Shopkeepers & Orders (Read-only mock data)
- 🔍 Debounced search on product list
- ✅ Responsive UI with reusable components

---

## 🚀 Getting Started with frontend

### 1. Clone the repository
```bash
git clone https://github.com/Rhythm-Aphale/quick-ecom.git
cd quick-ecom
```
2. Install dependencies
```
npm install
```
3. Run the development server
```
npm run dev
```
🌐 Backend API
This frontend connects to the Express.js backend hosted on Render.

🔗 Live Backend: https://quick-ecom-server.onrender.com
🔗 Backend Repo: https://github.com/Rhythm-Aphale/quick-ecom-server.git

🛠️ Running Backend Locally
If you'd like to run the backend locally instead of using the hosted Render API:

1. Clone the backend inside your frontend project

```
cd quick-ecom
git clone https://github.com/Rhythm-Aphale/quick-ecom-server.git
```
2. Install backend dependencies

```
cd quick-ecom-server
npm install
```
3. Start the backend server
```
npm start
```



