# Task Management Web Application

This is a modern, responsive **Task Management Web Application** built using **React (Vite)** for the frontend and **Node.js + Express + MongoDB** for the backend.

The application helps users organize daily tasks, track completion progress visually, manage current tasks, and review tasks completed on the previous day using an intuitive dashboard.

---

---

## Project Overview

The website provides a simple and efficient interface to manage todos and daily responsibilities.

Users can:

- Add new tasks
- Mark tasks as completed
- View pending vs completed task counts
- Track daily productivity using a circular progress indicator
- Navigate between **Current Tasks** and **Previous Tasks**
- Review tasks completed yesterday
- Use the application comfortably across desktop, tablet, and mobile devices

The UI is fully responsive and optimized for multiple screen sizes using Tailwind CSS breakpoints.

---

---

## Features

### Frontend (React + Vite)

- Fast development and build using Vite
- Fully responsive and modern UI
- Real-time task updates without reload
- Circular progress visualization
- Routing between Current Tasks and Previous Tasks pages
- Smooth and clean user experience

### Backend (Node.js + Express)

- REST API built with Express
- MongoDB database using Mongoose
- CORS enabled for frontend-backend communication
- Date filtering logic for fetching only yesterday’s completed tasks
- Task schema including:
  - Task description
  - Task status (Pending or Completed)
  - Task creation date

---

## Installation Guide

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/RamakotireddyGuttikonda/To-Do-List.git

```
## step 2: Run Frontend

```bash
cd To-Do-List
npm run dev
```

## step 3: Run Backend

```bash
npm install express mongoose cors
cd To-Do-List
cd backend
node server.js
```
