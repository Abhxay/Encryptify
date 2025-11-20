<p align="center">
<a href="https://www.google.com/search?q=https://github.com/Abhxay/Encryptify" target="_blank">
<img src="weblogo.png" alt="Encryptify Logo" width="120"/>
</a>
<h1 align="center">🔐 Encryptify: Secure File Manager</h1>
</p>

Encryptify is a full-stack, secure file management platform that allows users to effortlessly upload, share, and manage files with end-to-end security and a full sharing/audit trail.

This project demonstrates strong capabilities in modern Java Backend Development, REST API security, and responsive Frontend design.

💡 Key Features & Demonstrations

Feature Category

Description

Backend Stack Highlight

🛡️ User Authentication

Secure login and registration powered by JWT (JSON Web Tokens) for stateless authentication.

Spring Security

🔒 Encrypted File Upload

Upload and manage sensitive files with AES Algorithm encryption on the server side.

Java Cryptography

🔗 One-Click Sharing

Easily share files with other users and instantly track sharing details and permissions.

JPA/Hibernate Relations

⏱️ Activity Logging

A complete Audit Trail tracks all user actions (uploads, downloads, shares, deletes) and is viewable in a dedicated tab.

MySQL/H2 Persistance

💻 Modern UI/UX

Responsive Dashboard with Material UI, stats cards, color-coded actions, and light/dark mode persistence.

React, Material UI

🛠️ Tech Stack

Component

Technologies

Backend (API & Logic)

Spring Boot (Java 17+), Spring Security (JWT), JPA/Hibernate

Frontend (UI)

React, Material UI, Axios

Database

Default H2 (in-memory) for development; easily switchable to MySQL or PostgreSQL.

Build Tools

Maven (Backend), npm (Frontend)

📸 Screenshots

The following screenshots showcase the Encryptify dashboard in both Dark Mode and Light Mode, highlighting the responsive design and activity log features.

Dark Mode

Light Mode

<img width="100%" alt="Encryptify Dark Mode Screenshot" src="https://github.com/user-attachments/assets/955c08fc-eae7-4ed8-99ca-95873297506e" />

<img width="100%" alt="Encryptify Light Mode Screenshot" src="https://github.com/user-attachments/assets/31f1e30b-1f59-48b4-8379-1021947bbad0" />

🚀 Getting Started

This project is configured for a Quick Start using GitHub Codespaces (recommended) or a standard local setup.

Prerequisites

Java 17+

Node.js 20+

Maven

Local Setup

Clone the Repository:

git clone [https://github.com/Abhxay/Encryptify.git](https://github.com/Abhxay/Encryptify.git)
cd Encryptify


Backend Setup (Spring Boot):

Configuration: Edit src/main/resources/application.properties to update your database connection and JWT secrets (essential for security).

Run:

./mvnw spring-boot:run


Frontend Setup (React):

Navigate to the frontend folder, install dependencies, and run:

cd encryptify-frontend
npm install
npm start  # Launches at http://localhost:3000


⚙️ Development with GitHub Codespaces (Recommended)

This project supports Codespaces for a zero-config, pre-configured development environment, ensuring you can start coding instantly in your browser.

Setup: The dev container includes Node.js 20, Java 17, Maven, and MySQL (running on port 3306).

Ready: The Backend (Spring Boot) runs on Port 8089, and the Frontend (React) runs on Port 3000.

To launch, click the 'Code' button on the repository and select 'Open with Codespaces'.

🛡️ Security Best Practices

Crucial Note: Never commit real credentials. Utilize environment variables or secrets management for sensitive data.

Ensure your .gitignore includes: .env, *.env, target/, node_modules/, and any IDE-specific files.

👋 Connect & License

Connect

License

GitHub: Abhxay

License: MIT License © 2025 Abhxay

LinkedIn: Abhay Thakur

