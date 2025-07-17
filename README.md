# 🔐 Encryptify

A **Java Spring Boot-based encrypted file storage and sharing platform** allowing users to upload, store, and share files securely using AES encryption.

---

## 🚀 Features

✅ User registration and login (session-based authentication with Spring Security)  
✅ Upload files securely with AES encryption before storage  
✅ Download files with on-the-fly decryption  
✅ File listing dashboard with filtering  
✅ Secure sharing via expiring links (token-based)  
✅ REST API structure, frontend planned for later

---

## 🛠️ Tech Stack

- Java 17 + Spring Boot 3.x
- Spring Security (session-based auth)
- Spring Data JPA
- MySQL
- AES encryption (Java Cryptography)
- REST APIs
- Postman for testing
- Deployment planned on Render/Railway

---

## ⚙️ Setup Instructions

1️⃣ Clone the repo:
```bash
git clone https://github.com/Abhxay/Encryptify.git
cd Encryptify
2️⃣ Create a MySQL database:

sql
Copy
Edit
CREATE DATABASE encryptify_db;
3️⃣ Add your DB credentials in src/main/resources/application.properties:

properties
Copy
Edit
spring.datasource.url=jdbc:mysql://localhost:3306/encryptify_db
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
server.port=8080
4️⃣ Build and run the project:

bash
Copy
Edit
./mvnw spring-boot:run
📑 API Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login user
POST	/api/files/upload	Upload and encrypt file
GET	/api/files/download/{id}	Download and decrypt file
DELETE	/api/files/{id}	Delete file
GET	/api/files/	List user files
POST	/api/files/share/{id}	Generate secure share link
GET	/api/files/share/{token}	Download file via share link

🚧 Roadmap
✅ Project setup and DB connection
✅ User auth (register/login/logout)
✅ AES encryption utility integration
✅ Upload/download file APIs
✅ Secure sharing via token-based links
✅ Deployment
✅ Frontend (Phase 2)

🤝 Contributing
Open to contributions for frontend, UI improvements, and performance enhancements.

📜 License
This project is licensed under the MIT License.

✨ Acknowledgements
Built by Abhxay as part of backend Java portfolio projects.
