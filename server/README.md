# School Bus System

- **Frontend:** ReactJS (Vite)
- **Backend:** Node.js + Express + MongoDB

---

## 1. Clone Project

```bash
git clone https://github.com/HuangKha097/school-bus-system.git
cd school-bus-system
```

---

## 2. Cấu trúc thư mục

```
school-bus-system/
│
├── backend/
│   ├── server.js
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   └── .env
│
└── client/
    ├── src/
    ├── public/
    └── vite.config.js
```

---

## 3. Cài đặt và chạy Backend

```bash
cd backend
npm install
```

Tạo file `.env` trong thư mục `backend`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/schoolbus
JWT_SECRET=your_secret_key
```

Chạy server:

```bash
npm run dev
```

> Server chạy tại: [http://localhost:5000](http://localhost:5000)

---

## 4. Cài đặt và chạy Frontend

```bash
cd frontend
npm install
npm run dev
```

> Ứng dụng chạy tại: [http://localhost:5173](http://localhost:5173)

---

## 5. Cấu hình API

Trong file `frontend/src/service/UserService.js`, đảm bảo baseURL trỏ đúng đến backend local:

```js
const API_URL = "http://localhost:5000/api";
```

---

## 6. Yêu cầu môi trường

- Node.js >= 18
- MongoDB (chạy local hoặc MongoDB Atlas)
- npm >= 9

---

## 7. Ghi chú

- Nếu MongoDB không chạy local, hãy cập nhật `MONGO_URI` sang URI của Atlas.

---

## 8. Liên hệ

Người phát triển: nhom2
Email: quachhoangkha097@gmail.com
