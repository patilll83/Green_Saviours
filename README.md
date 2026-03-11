# 🌿 Green Saviour

A full-stack web application for managing a **plantation/tree-planting NGO**. It handles nurseries, plantation areas, plants, volunteers, donors, and admins — all in one platform.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Templating | EJS + express-ejs-layouts |
| Auth | Passport.js (Local Strategy) + bcryptjs |
| Email | Nodemailer (Gmail) |
| File Uploads | Multer |

---

## 👥 User Roles

| Role | Dashboard Route | Description |
|---|---|---|
| `admin` | `/admin/dashboard` | Full control — manages nurseries, plantations, volunteers |
| `donor` | `/donor/dashboard` | Browse plantations, upload photos, report issues |
| `volunteer` | `/volunteer/dashboard` | View assigned plantations, record work done |
| `agent` | `/agent/dashboard` | Field-level operations |
| `ngo` | `/ngo/dashboard` | NGO-level access |

---

## ⚙️ Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/greebSav194.git
cd greebSav194
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` and fill in your values:
```env
MONGO_URL=mongodb://localhost:27017/db_green
MY_SECRET_EMAILID=your_email@gmail.com
MY_SECRET_PASSWORD=your_gmail_app_password
SESSION_SECRET=your_random_secret_string
BASE_URL=http://localhost:5000
PORT=5000
```

> **Gmail Note:** Use a [Gmail App Password](https://support.google.com/accounts/answer/185833), not your real password.

### 4. Run the development server
```bash
npm run dev
```
App will be running at: **http://localhost:5000**

---

## 📁 Project Structure

```
greebSav194/
├── app.js              # Express app entry point
├── .env.example        # Environment variable template
├── config/
│   ├── dbConnection.js # MongoDB connection
│   └── passport.js     # Auth strategy
├── middleware/
│   └── index.js        # Role-based access guards
├── models/             # Mongoose schemas (9 models)
├── routes/             # Route handlers
├── views/              # EJS templates
└── assets/             # CSS, JS, images
```

---

## 🔐 Authentication Flow

1. **Email Verification** → Sends a verification email before signup
2. **Signup** → Password hashed with bcrypt, role selected on form
3. **Login** → Passport Local Strategy → redirects to role dashboard
4. **Password Reset** → Token-based, sent via email link
5. **Logout** → Clears session

---

## ☁️ Deployment

See the [Deployment Guide](docs/deployment.md) for instructions on deploying to **Render.com** with **MongoDB Atlas**.

---

## 📄 License

ISC — Built with ❤️ for a greener planet.
