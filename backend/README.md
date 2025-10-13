# Backend for Sample University Project

Environment variables (create a `.env` file in `backend/`):

- PORT (optional, default 5000)
- MONGODB_URI (e.g., `mongodb://localhost:27017/sampleuniproject`)
- JWT_SECRET (a strong secret used to sign tokens)
- FRONTEND_URL or NEXT_PUBLIC_API_URL (optional) - frontend origin for CORS
- FRONTEND_URLS (optional) - comma-separated frontend origins for CORS (e.g. `http://localhost:3000,http://localhost:9002`).
	Note: this project runs the Next dev server on port 9002 by default, so include `http://localhost:9002` when testing locally.

Available endpoints:

- POST /api/admin/register - Register a new admin. Body: { name, email, password }
- POST /api/admin/login - Login an admin. Body: { email, password } -> returns { token }
- GET /api/admin/me - Get current admin info (protected). Provide token in `x-auth-token` header or `Authorization: Bearer <token>`.

Run locally:

```powershell
cd backend
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_URL` in the frontend to point to the backend (e.g., `http://localhost:5000`) or edit `src/app/admin/login/page.tsx` which defaults to `http://localhost:5000` when `NEXT_PUBLIC_API_URL` is not set.
