# Admin Console

Admin Console is a React + Vite web application designed for managing **Users**, **Permissions**, **Roles**, and **Hierarchy**. It features a left sidebar navigation and interactive tables with sorting, filtering, and pagination.

## Features

- Sidebar navigation to switch between **Users**, **Permissions**, **Roles**, and **Hierarchy** pages.
- Each page shows a data table loaded from JSON files.
- Sort data by any column.
- Filter/search records dynamically.
- Paginate large datasets for easy browsing.
- Built with React 18 and Vite for a fast, modern frontend experience.

## Project Structure

- `/src/pages/` — Contains pages: `Users.tsx`, `Permissions.tsx`, `Roles.tsx`, and `Hierarchy.tsx`.
- `/src/data/` — JSON files with data for each page.
- `/src/components/` — Layout, DataTable, UI.
- `/src/App.tsx` — Main app 

## Getting Started

### Prerequisites

- Node.js v14 or later
- npm (comes with Node.js)

### Installation

1. Clone the repo:

```bash
git clone https://github.com/mazen-younes/admin-console.git
cd file-name
npm install
npm run dev
