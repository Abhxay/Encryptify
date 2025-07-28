<p align="center">
  <img src="weblogo.png" alt="Encryptify Logo" width="120"/>
</p>

# 🔐 Encryptify

**Encryptify** is a full-stack encrypted file manager. Effortlessly upload, share, and manage files with end-to-end security and a full sharing/audit trail—built with React, Spring Boot, and JWT authentication.

---

## 🚀 Features

- **User Authentication:** Secure login & registration via JWT tokens.
- **Encrypted File Upload:** Upload and manage sensitive files securely.
- **One-Click Sharing:**  
  - Share files with other users and see instantly who each file was shared with or by.
  - Clearly tagged files: `"Shared by you"` for files you've shared, `"Shared by [username]"` for incoming shares.
- **Activity Logging:**  
  - Audit log tracks uploads, downloads, shares, deletes—visible in a separate activity tab.
- **Dashboard:**  
  - Real-time, auto-updating counters for encrypted and shared files.
  - Username chip, stats cards, and responsive design.
  - Independent scrollable panels for files and audit activity.
- **Modern UI:**  
  - Material UI theme, beautiful layouts, color-coded actions, and professional icons.
  - Fully themed with light/dark mode toggle and persistent theme preference.
- **Robust Permissions:**  
  - Only file owners can delete their files.
  - Files shared with you indicate the sharing user.

---

## 📸 Screenshots

> *(Add UI screenshots here)*  
> Dashboard, audit log, file cards with "Shared by you", dark mode.

---

## 🛠️ Tech Stack

- **Frontend:** React, Material UI, Axios
- **Backend:** Spring Boot, Java 17+, Spring Security (JWT), JPA/Hibernate
- **Database:** (Default H2; easily swapped for MySQL/Postgres)
- **Build:** Maven, npm

---

## ⚙️ Getting Started

### 1. Clone the Repo

git clone https://github.com/Abhxay/Encryptify.git
cd Encryptify

text

### 2. Backend Setup

- Edit `/src/main/resources/application.properties` to match your DB/JWT setup.
- Build and run backend:
./mvnw spring-boot:run

or use your IDE's run config
text

### 3. Frontend Setup

cd encryptify-frontend
npm install
npm start

text
- App runs on `localhost:3000` (by default).

### 4. Production/Deployment

- **Build frontend:** `npm run build`
- **Copy `/build` contents** (plus any static assets like `pic.png`, `weblogo.png`) into your backend’s `/src/main/resources/static/` directory.  
- Restart your backend Spring Boot server.

---

## 💡 Architecture & Design

- **Spring Security**: JWT token filter, stateless, secure endpoints.
- **SPA Routing:** React with client-side routes (protected/private pages).
- **Live State Sync:** Refresh logic (`refreshFlag`) means UI auto-updates on file changes.
- **Customizable Theme:** Easily extendable Material-UI dark/light mode with persistent preference.
- **Static Asset Handling:** Logos and favicon reliably load in all environments with robust static resource config.

---

## 🙌 Contributing

- PRs and feedback are welcome!
- Please open issues for bugs, features, or ideas.

---

## 📚 License

[MIT License](LICENSE) © 2025 Abhxay

---

## 👋 Connect

- GitHub: [Abhxay](https://github.com/Abhxay)
- LinkedIn: [Your LinkedIn](#) *(add your profile!)*

---

**Tip:**  
Showcase Encryptify on LinkedIn with screenshots and a link to this repo.  
Hiring? Open to collaborating—send a message!
