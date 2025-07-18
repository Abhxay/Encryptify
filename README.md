# 🔐 Encryptify

A **Java Spring Boot-based encrypted file storage and sharing platform** that allows users to upload, store, and share files securely using AES encryption and JWT-based authentication.

---

## 🚀 Features

✅ User registration and login (JWT authentication)  
✅ Upload files securely with AES encryption before storage  
✅ Download files with on-the-fly decryption  
✅ File listing dashboard with filtering  
✅ Secure sharing via expiring token-based links  
✅ REST API with integrated Swagger UI for instant testing  
✅ MySQL database integration  
✅ Ready for deployment on Render/Railway

---

## 🛠️ Tech Stack

- **Java 17**
- **Spring Boot 3.x**
- **Spring Security (JWT)**
- **Spring Data JPA**
- **MySQL**
- **Java Cryptography (AES)**
- **Swagger (springdoc-openapi)**
- **Postman (for manual testing)**

---

## ⚙️ Setup Instructions

1️⃣ **Clone the repository:**

```bash
git clone https://github.com/Abhxay/Encryptify.git
cd Encryptify
2️⃣ Create MySQL database:

sql
Copy
Edit
CREATE DATABASE encryptify_db;
3️⃣ Configure database in src/main/resources/application.properties:

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
POST	/api/auth/login	User login (returns JWT)
POST	/api/files/upload	Upload and encrypt a file
GET	/api/files/download/{id}	Download and decrypt a file
DELETE	/api/files/{id}	Delete a file
GET	/api/files/	List user files
POST	/api/files/share/{id}	Generate secure share link
GET	/api/files/share/{token}	Download via share link

🚀 API Testing with Swagger
Encryptify includes Swagger UI for instant API testing without Postman.

1️⃣ Access Swagger UI:

Open http://localhost:8080/swagger-ui/index.html after starting your server.

2️⃣ Test Endpoints:

Click “Try it out” on any endpoint.

Fill in the request details and execute.

Instantly view requests, payloads, and responses.

3️⃣ Authentication:

Click “Authorize” in Swagger.

Enter:

php-template
Copy
Edit
Bearer <your_jwt_token>
To obtain a token, call POST /api/auth/login with user credentials and copy the token from the response.

✅ Validate encryption flows end-to-end, error handling, and authentication using Swagger easily.

🚧 Roadmap
✅ Project setup and DB connection

✅ JWT-based user authentication

✅ AES encryption integration

✅ Upload/download APIs

✅ Secure sharing with expiring links

✅ Deployment readiness

🚀 Frontend (React/Next) in Phase 2

🤝 Contributing
Contributions are welcome for:

Frontend implementation

UI improvements

Performance enhancements

Open a pull request or create an issue to discuss improvements.

📜 License
This project is licensed under the MIT License.

✨ Acknowledgements
Built with ❤️ by Abhxay as part of backend Java portfolio projects for practical encryption, JWT, and Spring Boot architecture learning.

If you found this project helpful, feel free to ⭐️ star the repository to support the work!

yaml
Copy
Edit

---

✅ **Action:**  
- Replace your current `README.md` with this version in your repo.  
- Commit and push with:

```bash
git add README.md
git commit -m "Clean and professional README for Encryptify"
git push origin main
