# Tea Factory Management System

A full-stack recreation of a second-year university group project, rebuilt for my GitHub portfolio. The original system covered staff, buyers, vehicles, production and machinery. **This recreation implements the User Management module end-to-end; the other modules are intentionally visual placeholders.**

Built with React, Express, MongoDB and Mongoose.

![Status](https://img.shields.io/badge/status-portfolio%20recreation-2a6137)
![Frontend](https://img.shields.io/badge/frontend-React%2018-2a6137)
![Backend](https://img.shields.io/badge/backend-Express%204-2a6137)
![Database](https://img.shields.io/badge/database-MongoDB-2a6137)

---

## Project Overview

The Tea Factory Management System is a traditional admin dashboard for a tea factory. It contains:

- A dashboard with user statistics and a module overview.
- A fully functional **User Management** module with separate **Staff** and **Buyer / Non-Staff** management.
- Placeholder pages for the remaining modules from the original group project.

Every staff and buyer record is stored in MongoDB and managed through REST APIs. The interface uses a simple green-and-white tea factory theme, a left sidebar, a top bar and data tables.

> **Honesty note:** only User Management has working CRUD operations, validation and database persistence. Vehicle, Production, Machinery and Other Management do not have APIs, database collections or CRUD features. They exist to show the structure of the original complete group project.

---

## Academic Project Background

The original Tea Factory Management System was developed around **2022–2023** as a **second-year university group project**. It was designed as a multi-module system covering several areas of factory administration.

This repository is **not the original group submission**. It is a portfolio recreation built by the student who was responsible for the **User Management module**. The goal was to present the overall system concept while reproducing only the module I personally contributed to, using the same general stack.

No code, data or credentials from the original group project are included.

---

## Main System Modules

| Module | Status in this repository |
| --- | --- |
| Dashboard | Implemented (statistics overview) |
| User Management | **Fully implemented** |
| Vehicle Management | Placeholder only |
| Production Management | Placeholder only |
| Machinery Management | Placeholder only |
| Other Management | Placeholder only |

Placeholder modules show a clear "This module is currently under development" page. They do not call the backend.

---

## My Contribution

My personal contribution to the original group project was the **User Management module**.

In this recreation, that contribution includes:

- Staff management: add, view, list, edit, delete, search, account activation and deactivation.
- Buyer / non-staff management: the same complete set of operations.
- User Management dashboard with staff and buyer statistics.
- Server-side and client-side validation, including unique username and email checks.
- Password hashing with bcrypt.
- REST APIs with MongoDB persistence.
- Responsive green-and-white admin interface and dashboard integration.

The other modules in the sidebar represent work completed by other group members in the original project and are not included functionally here.

---

## Screenshots

### Dashboard

![Dashboard](docs/screenshots/dashboard.png)

### User Management

![User Management](docs/screenshots/user-management.png)

### Add / Edit Staff Form

![Add Staff Form](docs/screenshots/staff-form.png)

### Staff Details

![Staff Details](docs/screenshots/staff-details.png)

### Placeholder Module

![Placeholder Module](docs/screenshots/placeholder.png)

---

## Key Features

### Staff Management

- Add, view, edit and delete staff members.
- Search by staff ID, name, username, email, contact number, position or department.
- Filter by account status and department.
- Activate or deactivate accounts from the list or details page.
- View all staff details, with password values never returned by the API.
- Automatic staff IDs such as `STF-0001`.

### Buyer / Non-Staff Management

- Add, view, edit and delete buyers.
- Search by buyer ID, name, username, email, contact number or address.
- Filter by account status.
- Activate or deactivate buyer accounts.
- Automatic buyer IDs such as `BUY-0001`.

### User Management Dashboard

- Total staff members.
- Total buyers.
- Active staff.
- Active buyers.
- Separate staff and buyer tables with search and filtering.
- Add, view, edit, delete and status actions in each table.

### Validation and Data Integrity

- Required field validation on the client and server.
- Email format validation.
- Username format and uniqueness (checked across staff and buyers).
- Email uniqueness (checked across staff and buyers).
- Contact number validation (9–15 digits, optional `+`, spaces and `-`).
- Minimum password length of 6 characters.
- Password confirmation on the client.
- Duplicate record prevention with readable error messages.
- Empty password on edit keeps the existing password.

### Security and API Behaviour

- Passwords hashed with bcrypt before storage.
- Passwords excluded from all API responses.
- Update endpoints only accept whitelisted fields.
- Consistent JSON responses and HTTP status codes.
- Central error handling for validation, duplicate keys and missing records.

### Interface

- Green-and-white tea factory theme.
- Fixed sidebar, top navigation bar and traditional dashboard layout.
- Responsive layout: off-canvas sidebar, stacked cards and scrollable tables on small screens.
- Loading, empty, success and error states.
- Confirmation dialog before deleting records.

---

## Technologies Used

| Layer | Technology |
| --- | --- |
| Frontend | React 18, JavaScript (ES6+), HTML5, CSS3 |
| Routing | React Router v6 |
| HTTP client | Axios |
| Build tool | Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Passwords | bcryptjs |
| Configuration | dotenv |
| Development | nodemon, morgan |

---

## Project Structure

```text
tea-factory-management-system/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── staffController.js
│   │   ├── buyerController.js
│   │   └── dashboardController.js
│   ├── middleware/
│   │   ├── asyncHandler.js
│   │   ├── errorHandler.js
│   │   ├── notFound.js
│   │   └── validateUser.js
│   ├── models/
│   │   ├── Staff.js
│   │   ├── Buyer.js
│   │   └── Counter.js
│   ├── routes/
│   │   ├── staffRoutes.js
│   │   ├── buyerRoutes.js
│   │   └── dashboardRoutes.js
│   ├── utils/
│   │   ├── generateId.js
│   │   ├── helpers.js
│   │   ├── uniqueness.js
│   │   └── validateUser.js
│   ├── .env.example
│   ├── package.json
│   ├── seed.js
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── tea-leaf.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Alert.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── DetailItem.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── FormField.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── ToastProvider.jsx
│   │   │   ├── Topbar.jsx
│   │   │   └── icons.jsx
│   │   ├── hooks/
│   │   │   └── useDebounce.js
│   │   ├── pages/
│   │   │   ├── buyers/
│   │   │   │   ├── BuyerDetails.jsx
│   │   │   │   ├── BuyerForm.jsx
│   │   │   │   └── BuyerList.jsx
│   │   │   ├── staff/
│   │   │   │   ├── StaffDetails.jsx
│   │   │   │   ├── StaffForm.jsx
│   │   │   │   └── StaffList.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── Placeholder.jsx
│   │   │   └── UserManagement.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── buyerService.js
│   │   │   ├── dashboardService.js
│   │   │   └── staffService.js
│   │   ├── styles/
│   │   │   ├── components.css
│   │   │   └── theme.css
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   ├── format.js
│   │   │   ├── pageMeta.js
│   │   │   └── validation.js
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── docs/
│   └── screenshots/
├── .gitignore
└── README.md
```

---

## Installation Instructions

### Prerequisites

- Node.js 18 or newer
- npm
- A free MongoDB Atlas account (or a local MongoDB server)

Clone the repository:

```bash
git clone https://github.com/your-username/tea-factory-management-system.git
cd tea-factory-management-system
```

### 1. Backend setup

```bash
cd backend
npm install
```

Create the environment file:

```bash
# macOS / Linux
cp .env.example .env

# Windows
copy .env.example .env
```

Open `backend/.env` and paste your MongoDB Atlas connection string (see the next section).

Seed the demo data:

```bash
npm run seed
```

Run the backend:

```bash
npm run dev
```

The API runs at `http://localhost:5000`. Check it with:

```text
http://localhost:5000/api/health
```

### 2. Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

The Vite development server proxies `/api` requests to `http://localhost:5000`, so the frontend works without extra configuration. To use a different API URL, create `frontend/.env` and set `VITE_API_URL`.

---

## MongoDB Configuration

1. Sign in to [MongoDB Atlas](https://cloud.mongodb.com) and create a **free M0 cluster**.
2. Create a database user under **Database Access** (for example `tea_admin`).
3. Under **Network Access**, add your current IP address. For temporary local development you may allow `0.0.0.0/0`, but do not leave it open permanently.
4. Click **Connect → Drivers** and copy the connection string.
5. Add the database name `tea_factory_db` and paste the URI into `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://tea_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/tea_factory_db?retryWrites=true&w=majority
CLIENT_URL=http://localhost:5173
```

If your password contains special characters such as `@`, `:`, `/`, `?`, `#`, `[` or `]`, URL-encode them first. For example, `@` becomes `%40`.

`backend/.env` is git-ignored. Only `backend/.env.example` is committed.

The application creates these collections automatically:

- `staff`
- `buyers`
- `counters` (used for readable IDs such as `STF-0001`)

No collections are created for the placeholder modules.

---

## Demo Data

`npm run seed` clears the staff, buyer and counter collections and inserts:

- 6 staff members
- 4 buyers
- Active and inactive accounts

All seeded accounts use the demo password:

```text
Password@123
```

Passwords are stored as bcrypt hashes. Authentication/login is intentionally outside the scope of this recreation, so there is no login screen. The password fields and hashing are included because they are part of the user account records in the original User Management module.

The seed script is destructive for these collections, so do not run it against a database containing data you want to keep.

---

## API Endpoints

Base URL: `http://localhost:5000/api`

### Staff

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/staff` | Create a staff member |
| GET | `/staff` | List staff (supports `search`, `status`, `department`) |
| GET | `/staff/:id` | Get one staff member |
| PUT | `/staff/:id` | Update a staff member (partial updates supported) |
| DELETE | `/staff/:id` | Delete a staff member |

### Buyers

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/buyers` | Create a buyer |
| GET | `/buyers` | List buyers (supports `search`, `status`) |
| GET | `/buyers/:id` | Get one buyer |
| PUT | `/buyers/:id` | Update a buyer (partial updates supported) |
| DELETE | `/buyers/:id` | Delete a buyer |

### Dashboard

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/dashboard/stats` | Total, active and inactive staff and buyer counts |
| GET | `/health` | API and database connection status |

Example response:

```json
{
  "success": true,
  "message": "Staff member added successfully.",
  "data": {
    "_id": "665f1c2a9f1b2c0012a34567",
    "staffId": "STF-0007",
    "fullName": "Nimal Perera",
    "username": "nimal.perera",
    "email": "nimal.perera@teafactory.lk",
    "contactNumber": "0771234567",
    "address": "10 Main Street, Kandy",
    "gender": "Male",
    "position": "Clerk",
    "department": "Administration",
    "accountStatus": "Active",
    "createdAt": "2026-10-30T09:00:00.000Z",
    "updatedAt": "2026-10-30T09:00:00.000Z"
  }
}
```

Validation errors return `400`, duplicate usernames or emails return `409`, and missing records return `404`.

---

## Available Scripts

### Backend

| Command | Description |
| --- | --- |
| `npm start` | Start the API server |
| `npm run dev` | Start the API with nodemon |
| `npm run seed` | Reset and insert demo staff and buyers |

### Frontend

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build |

---

## Validation Rules

| Field | Rule |
| --- | --- |
| Full name | Required, 3–80 characters |
| Username | Required, 4–20 characters, letters/numbers/dots/underscores, unique across staff and buyers |
| Email | Required, valid format, unique across staff and buyers |
| Contact number | Required, 9–15 digits, allows `+`, spaces, `-` and parentheses |
| Address | Required, 5–200 characters |
| Gender | Required for staff (Male / Female / Other) |
| Position | Required for staff |
| Department | Required for staff |
| Password | Required on create, minimum 6 characters, optional on edit |
| Confirm password | Must match the password |
| Account status | Active or Inactive |

---

## Future Improvements

- Add authentication with JWT and role-based access control.
- Add pagination and sorting for large staff and buyer lists.
- Add profile photos and document uploads.
- Add audit logs for account changes.
- Add CSV/PDF export for staff and buyer records.
- Add automated unit and integration tests.
- Add rate limiting and stronger production security headers.
- Deploy the frontend and backend with a managed MongoDB cluster.
- Optionally recreate the Vehicle, Production and Machinery modules if the original team members agree.

---

## Notes and Limitations

- This is a portfolio recreation, not the original university submission.
- Only User Management is functional. The remaining modules are visual placeholders.
- No vehicle, production, machinery or "other" API routes or database collections exist.
- There is no login gate; account status and passwords are managed as user record data.
- The seed script is for demonstration only and clears the relevant collections.
- The project is intended for educational and portfolio use.
