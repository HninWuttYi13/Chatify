# 💬 Chatify

Chatify is a full-stack real-time chat web application that allows users to communicate through messaging and audio calling features. The project focuses on building scalable client-server communication using modern frontend technologies and backend web services.

---

## ✨ Features

### 💬 Real-Time Messaging
- Instant message delivery using Socket.IO
- Optimistic UI updates
- Unread message tracking
- Message history storage

### 🖼 Media Sharing
- Image upload support
- Cloudinary cloud storage integration
- Image preview inside chat

### 📞 Audio Calling
- Peer-to-peer audio calls using WebRTC
- Incoming / outgoing call interface
- Call duration tracking
- Call history logging
- Call status handling (missed, rejected, completed)

### 🔐 Authentication & Security
- JWT authentication
- Protected routes
- Secure HTTP-only cookies
- User session management

### 👤 User Experience
- Online / offline user status
- Profile image upload
- Sound notification toggle
- Modern responsive UI
- Beautiful fuchsia-themed design

---

## 🛠 Tech Stack

### Frontend
- React.js
- Zustand (State Management)
- Tailwind CSS
- Socket.IO Client
- WebRTC
- DaisyUI

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.IO
- JWT Authentication

### Cloud & Deployment
- Cloudinary (Media Storage)
- Render (Backend Hosting)
- Vercel (Frontend Hosting)

---
### Tools
- Git & GitHub
- Vercel(frontend Deployment)
- Render (Backend Deployment)
- VS Code

---

## 🏗 Project Structure

```
chatify/
│
├── frontend/
│   ├── components/
│   ├── store/
│   ├── pages/
│   └── utils/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   └── middleware/
│
└── README.md

```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/HninWuttYi13/Chatify
```

---

### 2️⃣ Navigate to project folder

```bash
cd chatify
```

---

### 3️⃣ Install dependencies

### Install Backend Dependencies
cd server
npm install

### Install Frontend Dependencies
cd client
npm install

---

### 4️⃣ Run 

### Run Backend Server
cd server
npm start

### Run Frontend Client
cd client
npm run dev


## 🌐 Deployment

The backend service is deployed using Render hosting platform.
The frontend service is deployed using Vercel hosting platform.

---

## 📚 What I Learned

- Building full-stack applications using React and Express.js
- Implementing real-time communication using Socket.IO
- Managing global state using Zustand
- Designing REST API routes
- Handling client-server communication
- Debugging deployment issues
- Understanding asynchronous programming
- Understanding how Web API works
- Managing project version control using Git

---

## 🔮 Future Improvements

- Add user authentication system
- Implement database message storage
- Improve UI/UX design
- Add socket-based real-time communication
- Add user profile features

---
## 🎥 Live Demo

[Link Text]https://chatify-safety.vercel.app
## 📸 Screenshots

### 📩 Message Notification Count
Displays unread message count when a new message is received.

<img width="679" height="673" alt="Message Notification Count" src="https://github.com/user-attachments/assets/d5f5d315-46c0-4080-a2e7-38f280a5e2b6" />

---

### 🗑 Message Deletion Options
Users can delete messages either for themselves or for both participants in the conversation.

<img width="679" height="673" alt="Message Deletion Options" src="https://github.com/user-attachments/assets/4604aa17-0398-492c-8918-cebaef65d735" />

---

### ✔ Message Read Status
Single tick indicates message sent but not read.  
Double tick indicates message successfully read by recipient.

<img width="1365" height="672" alt="Message Read Status" src="https://github.com/user-attachments/assets/9cfb5c10-1d32-4ad0-a03e-96fe57d3779d" />

---

### 📞 Audio Call Feature
Supports real-time audio calling between users.

<img width="1365" height="672" alt="Audio Call Interface" src="https://github.com/user-attachments/assets/d09251cb-ac85-44a1-b982-1b4c7d603338" />

---

### 🎧 In-Call Interface
Displays active call screen with call controls and connection status.

<img width="1365" height="672" alt="In Call Interface" src="https://github.com/user-attachments/assets/3c4ba94c-a68a-4622-9c4b-d8f90adb669f" />


## 🤝 Contribution

This project was created as a personal learning project. Suggestions and improvements are welcome.

---

## 📬 Contact

GitHub: https://github.com/HninWuttYi13

---

⭐ If you like this project, feel free to give it a star!
