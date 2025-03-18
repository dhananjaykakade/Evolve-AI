# Evolve-AI Evaluation Portal

Evolve-AI is an AI-driven coding evaluation portal designed for stress-free coding practice. This document provides instructions on setting up the project, installing dependencies, and configuring Redis using Memurai on Windows.

---

## Prerequisites

Before setting up the project, ensure that you have the following installed:

- **Node.js (LTS version recommended)**: [Download Node.js](https://nodejs.org/)
- **NPM (Package Manager)**: Comes with Node.js
- **Chocolatey (Windows Package Manager)**: [Installation Guide](https://chocolatey.org/install)
- **Git**: [Download Git](https://git-scm.com/)

---

## 1️⃣ Install Chocolatey (Windows Users Only)

If you haven’t installed **Chocolatey**, run the following command in **PowerShell (Administrator Mode)**:

Run automation script or install manually
Here is automation script

```powershell
npm run install:redis
```

For manual installation follow the commands given below

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

After installation, restart your terminal and verify it using:

```powershell
choco -v
```

---

## 2️⃣ Install Memurai (Redis Alternative for Windows) & Redis CLI

Since **Redis does not natively support Windows**, we use **Memurai** as a drop-in replacement.

Run the following command to install Memurai and Redis CLI using Chocolatey:

```powershell
choco install memurai-developer -y
```

Once installed, start Memurai:

```powershell
memurai
```

### Verify Memurai Installation
To check if Memurai (Redis) is running, execute:

```powershell
tasklist | findstr memurai
```

Or connect using Redis CLI:

```powershell
redis-cli
ping
```

If the response is `PONG`, Redis is successfully running.

---

## 3️⃣ Clone the Repository

```bash
git clone https://github.com/dhananjaykakade/Evolve-AI.git
cd Evolve-AI
```

---

## 4️⃣ Install Dependencies

Run the following script to install frontend and backend dependencies simultaneously:

```bash
npm run install-all
```

### Alternative (Manual Installation)

#### Install Backend Dependencies
```bash
npm install
```

#### Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

---

## 5️⃣ Run the Application

### Start Frontend & Backend Concurrently
```bash
npm run dev
```

### Start the Backend Server Only
```bash
npm start
```

### Start the Frontend Only
```bash
cd client
npm run dev
```

---

## 6️⃣ Running Tests

Run backend tests:
```bash
npm test
```

Run frontend tests:
```bash
cd client
npm test
```

---

## 7️⃣ Environment Variables Setup

Create a `.env` file in the project root and add the required environment variables:

```
NODE_ENV=development
DATABASE_URL=your_prisma_database_url
JWT_SECRET=your_jwt_secret
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

For production, update these values accordingly.

---

## 8️⃣ Setup & Migrate Prisma Database

Run the following commands to apply Prisma migrations and seed the database:

```bash
npx prisma migrate deploy
npx prisma db seed
```

If running for the first time, initialize Prisma:
```bash
npx prisma generate
```

---

## 9️⃣ Stop Memurai (Redis) If Needed

To stop Memurai, run:

```powershell
Stop-Process -Name memurai -Force
```

To disable Memurai auto-start on Windows:
```powershell
sc config MemuraiServer start=disabled
```

---

## 🎯 Conclusion

You should now have **Evolve-AI** up and running! If you face any issues, check the logs or raise an issue in the [GitHub repository](https://github.com/dhananjaykakade/Evolve-AI/issues). 🚀




documentation by - Dhananjay kakade 

