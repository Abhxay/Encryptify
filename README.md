<<<<<<< HEAD
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
=======
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

<img width="1914" height="926" alt="image" src="https://github.com/user-attachments/assets/93e58dd1-12b4-4e76-af6f-718a409e7fd6" />
<img width="1820" height="947" alt="image" src="https://github.com/user-attachments/assets/4f63b6a2-e1b2-4281-9238-8e0dd081dc05" />
<img width="1896" height="949" alt="image" src="https://github.com/user-attachments/assets/f19b083a-d1d8-4a32-8eca-d46b9c1d6fc9" />



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
- LinkedIn: Abhay([https://www.linkedin.com/in/abhay-thakur23](https://www.linkedin.com/in/abhay-thakur23/))

---


>>>>>>> f1758eabb0b6cedf3d3874b93c16ad5addc11662
