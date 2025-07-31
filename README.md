<p align="center"> <img src="weblogo.png" alt="Encryptify Logo" width="120"/> </p>
🔐 Encryptify
Encryptify is a full-stack encrypted file manager. Effortlessly upload, share, and manage files with end-to-end security and maintain a full sharing and audit trail—built with React, Spring Boot, and JWT authentication.

🚀 Features
User Authentication: Secure login & registration via JWT tokens

Encrypted File Upload: Upload and manage sensitive files securely

One-Click Sharing:

Share files with other users and instantly see sharing details

Tags like "Shared by you" and "Shared by [username]" for clarity

Activity Logging:

Audit log tracking uploads, downloads, shares, deletes—viewable in an activity tab

Dashboard:

Real-time counters for encrypted and shared files

Username chip, stats cards, and responsive design

Independent scrollable panels for file list and audit activities

Modern UI:

Material UI theme with light/dark mode toggle and persistent preferences

Color-coded actions and professional icons

Robust Permissions:

Only owners can delete files; shared files indicate owner info

📸 Screenshots

The following screenshots showcase Encryptify in both Dark Mode and Light Mode:
<img width="1919" height="933" alt="image" src="https://github.com/user-attachments/assets/955c08fc-eae7-4ed8-99ca-95873297506e" />
<img width="1902" height="926" alt="image" src="https://github.com/user-attachments/assets/f1722f5f-14a8-4b71-ab41-3b7b808d323c" />

light mode
<img width="1919" height="931" alt="image" src="https://github.com/user-attachments/assets/31f1e30b-1f59-48b4-8379-1021947bbad0" />

<img width="1889" height="926" alt="image" src="https://github.com/user-attachments/assets/4a86db56-4ca3-4d4f-9e89-cc167901d2da" />




Stack

Frontend: React, Material UI, Axios

Backend: Spring Boot, Java 17+, Spring Security (JWT), JPA/Hibernate

Database: Default H2; can switch easily to MySQL or PostgreSQL

Build Tools: Maven (backend), npm (frontend)

⚙️ Getting Started
Prerequisites
Java 17+

Node.js 20+

Maven

Docker (optional, for dev container)

1. Clone the Repository
bash
git clone https://github.com/Abhxay/Encryptify.git
cd Encryptify
2. Backend Setup
Edit the backend configuration file:

text
src/main/resources/application.properties
Update your database connection and JWT secrets accordingly.

To build and run the backend:

bash
./mvnw spring-boot:run
OR run via your IDE’s Spring Boot run configuration.

3. Frontend Setup
Navigate to the frontend folder, install dependencies, and run:

bash
cd encryptify-frontend
npm install
npm start
The frontend will launch at http://localhost:3000 by default.

4. Production Build & Deployment
Build the React frontend:

bash
npm run build
Copy the contents of the generated /build folder (including any static assets like weblogo.png) into the backend’s static resources folder:

text
src/main/resources/static/
Restart the backend server after copying.

💻 Development with GitHub Codespaces
This project supports GitHub Codespaces for an easy-to-use, pre-configured development environment:

Dev Container:
Based on mcr.microsoft.com/devcontainers/java:21 image

Auto-installed VS Code Extensions:

Java Pack (vscjava.vscode-java-pack)

Docker (ms-azuretools.vscode-docker)

Prettier (esbenp.prettier-vscode)

ESLint (dbaeumer.vscode-eslint)

Installed tools: Node.js 20, Maven (installed post-create)

Exposed Ports:

8089: Spring Boot backend

3000: React frontend

3306: MySQL database

Database credentials (for dev purposes only) are configured in docker-compose.yml. Please do not use these in production.

🚀 Quick Start with GitHub Codespaces
On GitHub, click the Code button and choose Open with Codespaces.

Wait for the dev container to finish building (Java, Node.js, Maven, MySQL set up automatically).

The backend (Spring Boot) will be running on port 8089.

The frontend (React) runs on port 3000.

The database (MySQL) runs in its own container on port 3306, with development credentials pre-configured.

You can develop, test, and run Encryptify end-to-end without any local setup—just code in your browser!

🛡️ Security Considerations
Do not commit real credentials: Avoid hardcoding passwords or secrets in your config files. Use .env files or GitHub/Codespaces secrets instead.

Make sure your .gitignore includes:

text
.env
.env.*
*.env
docker-compose.override.yml
mysql-data/
.idea/
.vscode/
target/
*.class
node_modules/
Sensitive information like DB passwords (root/Abhay23 in dev) should be replaced with placeholders or environment variables before sharing.

📜 React Frontend Info
This React app was bootstrapped using Create React App, providing zero-config setup for modern web development.

Available Scripts
From the frontend directory (encryptify-frontend), you can run:

npm start
Runs the app in development mode at http://localhost:3000.

npm test
Launches the test runner in interactive watch mode.

npm run build
Builds the app for production in the /build folder.

npm run eject
Note: This is irreversible. Provides full control over build configs.

For more details, see the official Create React App documentation.

🙌 Contributing
Contributions, bug reports, and feature requests are welcome!

Please open issues or PRs if you want to help.

📚 License
MIT License © 2025 Abhxay

👋 Connect
GitHub: Abhxay

LinkedIn: Abhay Thakur
