#  Frontend

React + Vite frontend for microservices backend.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
```

App runs at → http://localhost:5173

---

## Backend URLs expected

| Service  | URL                    |
|----------|------------------------|
| USER     | http://localhost:8000  |
| GAME     | http://localhost:8001  |
| ORDER    | http://localhost:8002  |
| PAYMENT  | http://localhost:8003  |

---

## Auth

- JWT stored in `localStorage` as `token`
- Login endpoint: `POST http://localhost:8000/api/login/`  
  → must return `{ access: "<jwt>" }`
- Register endpoint: `POST http://localhost:8000/api/register/`

---

## Folder structure

```
src/
├── context/
│   └── AuthContext.jsx       # token, user, role, login/logout
├── services/
│   ├── profileService.js     # USER service calls
│   ├── gameService.js        # GAME service calls
│   └── cartService.js        # ORDER + PAYMENT calls
├── components/
│   ├── Header.jsx
│   ├── Dropdown.jsx
│   ├── ProtectedRoute.jsx    # PrivateRoute + AdminRoute
│   └── ProfileView.jsx       # shared profile display
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Shop.jsx              # /
│   ├── MyProfile.jsx         # /my-profile
│   ├── OtherProfile.jsx      # /profile/:id
│   ├── EditProfile.jsx       # /edit-profile
│   ├── ProfilesList.jsx      # /profiles
│   ├── Cart.jsx              # /cart
│   ├── AdminDashboard.jsx    # /admin/dashboard
│   └── About.jsx             # /about
├── App.jsx
├── main.jsx
└── index.css
```
