# 🔐 Encryptify

A **full-stack encrypted file manager**—securely upload, share, and manage files with an auditable sharing trail, built with React (frontend) and Spring Boot (backend).

## 🚀 Features

- **User Authentication:** Secure login & session management using JWT.
- **Encrypted File Upload:** Safely upload files; data is securely handled server-side.
- **Sharing:**  
  - Share uploaded files with other users.
  - Recipients see exactly who shared with them (with badge: e.g. `Shared by maya`).  
  - Uploaders see files they shared out as `Shared by me`.
- **Audit Logging:** Every action (upload, share, download, delete) is tracked and viewable in the "My Activity History" tab.
- **Instant UI Updates:** React dashboard state syncs instantly after sharing or deleting files, with auto-updated stats and activity logs.
- **User Dashboard:**  
  - See total encrypted/uploaded files.
  - "Shared" counter reflects files you have shared.
  - Username badge at top for context.
  - Visual badges in the file panel to clarify ownership and sharing.
- **Responsive, Modern UI:**  
  - Material UI.
  - Equal-height main panels, smooth scroll, clear feedback via snackbars.

## 📸 Screenshots

*(Insert demo screenshots/gifs here for "Your Files", "Shared by me", "Shared by maya/other", and the activity tab UI!)*

## 🛠️ Tech Stack

- **Frontend:** React, Material UI
- **Backend:** Spring Boot, Java 17+, Spring Security (JWT), Hibernate/JPA
- **Database:** (e.g. H2, MySQL — configure as you prefer)
- **APIs:** RESTful
- **Other:** Maven/Gradle, Axios, etc

## ⚙️ Quick Start

### 1. Clone the repo

git clone https://github.com/Abhxay/Encryptify.git
cd Encryptify

text

### 2. Backend Setup

- Edit `/src/main/resources/application.properties` (DB URL, JWT secret, etc)
- Build & run:
./mvnw spring-boot:run

text
or use your preferred IDE.

### 3. Frontend Setup

cd encryptify-frontend
npm install
npm start

text

- The app will run on `localhost:3000` by default.

### 4. Try It Out

- Register or log in.
- Upload files, share with other users, and see activity logs update in real time.
- File panel badges clarify if files are "Shared by me" or "Shared by [username]".

## 💡 Architecture Overview

- **Modular Back-end:** Clean separation of concerns, JPA entities, services, controllers.
- **Extensible Audit:** Easily add new audit actions.
- **Frontend UI/UX:** Designed for clarity, responsiveness, and a polished professional look.
- **Robust Permission Logic:** Only uploaders (owners) can delete; unsharing removes shared access for the recipient only.

## 🙌 Contributing

Pull requests and issues are welcome! See [`CONTRIBUTING.md`](CONTRIBUTING.md) if present, or open an issue to suggest features/fixes.

## 📚 License

This project is open-source and available under the MIT License.

## 💬 Find Me

- GitHub: [Abhxay](https://github.com/Abhxay)
- LinkedIn: (add your link here for recruiters!)

---

**Tip:**  
When you share on LinkedIn, include a few choice screenshots, highlight the sharing + audit log features, and link to this repo!

If you want me to further add a setup FAQ, extended usage instructions, tech explanation, or recruiter-facing project summary, let me know!
