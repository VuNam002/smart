<!-- Optional: Add a project banner here -->
<div align="center">
  <h1 align="center">SmartMart - Hệ thống Quản lý Bán hàng</h1>
  <p align="center">
    Một hệ thống quản lý mạnh mẽ được xây dựng bằng Node.js, Express, và MongoDB.
  </p>
</div>

<div align="center">
  <!-- License -->
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-ISC-blue.svg" alt="License">
  </a>
  <!-- Node.js Version -->
  <a href="https://nodejs.org/en/">
    <img src="https://img.shields.io/badge/node.js-v18%2B-green.svg" alt="Node.js v18+">
  </a>
  <!-- GitHub issues -->
  <a href="https://github.com/VuNam002/smart/issues">
    <img src="https://img.shields.io/github/issues/VuNam002/smart" alt="Issues">
  </a>
  <!-- GitHub forks -->
   <a href="https://github.com/VuNam002/smart/network/members">
    <img src="https://img.shields.io/github/forks/VuNam002/smart" alt="Forks">
  </a>
  <!-- GitHub stars -->
  <a href="https://github.com/VuNam002/smart/stargazers">
    <img src="https://img.shields.io/github/stars/VuNam002/smart" alt="Stars">
  </a>
</div>

<br>

> SmartMart là một dự án quản lý sản phẩm, danh mục, bài viết và người dùng cho hệ thống bán hàng, được xây dựng bằng Node.js (Express), MongoDB, và Pug.

## 📸 Ảnh chụp màn hình

### 🔐 Giao diện đăng nhập
<div align="center">
  <img src="screenshots/login.png" alt="Giao diện đăng nhập" width="600">
  <p><em>Giao diện đăng nhập với thiết kế hiện đại và bảo mật</em></p>
</div>

### 🛍️ Giao diện người dùng - Trang chủ
<div align="center">
  <img src="screenshots/trangchu.png" alt="Danh sách sản phẩm" width="800">
  <p><em>Trang hiển thị sản phẩm với giao diện thân thiện người dùng</em></p>
</div>

### ⚙️ Giao diện quản trị - Danh sách tài khoản
<div align="center">
  <img src="screenshots/admin-page.png" alt="Quản lý sản phẩm" width="800">
  <p><em>Giao diện quản trị với đầy đủ tính năng CRUD cho sản phẩm</em></p>
</div>

## ✨ Tính năng nổi bật

-   **🛍️ Quản lý sản phẩm**: Thêm, sửa, xóa và xem chi tiết sản phẩm.
-   **📚 Quản lý danh mục**: Phân loại sản phẩm theo danh mục một cách linh hoạt.
-   **📝 Quản lý bài viết**: Tạo và quản lý các bài viết, tin tức liên quan.
-   **👤 Quản lý người dùng**: Quản lý tài khoản và phân quyền người dùng.
-   **🖼️ Upload ảnh**: Tích hợp Cloudinary để lưu trữ hình ảnh sản phẩm.
-   **🔐 Xác thực & Phân quyền**: Hệ thống đăng nhập và quản lý phiên an toàn.
-   **...**

## 🚀 Bắt đầu

Để cài đặt và chạy dự án trên máy của bạn, hãy làm theo các bước dưới đây.

### Yêu cầu

-   **Node.js**: `v18+`
-   **MongoDB**: Có thể dùng phiên bản local hoặc MongoDB Atlas
-   **Git**

### Cài đặt

1.  **Clone dự án:**
    ```sh
    git clone https://github.com/VuNam002/smart.git
    ```

2.  **Di chuyển vào thư mục dự án:**
    ```sh
    cd smart
    ```

3.  **Cài đặt các gói phụ thuộc:**
    ```sh
    npm install
    ```

4.  **Cấu hình biến môi trường:**
    
    Tạo một tệp `.env` ở thư mục gốc và điền các giá trị sau:
    
    ```env
    # Cổng ứng dụng
    PORT=3002

    # Chuỗi kết nối MongoDB 
    MONGO_URI=mongodb+srv://namvu7702:5go1WutvKcx4mGN8@cluster0.j08llyg.mongodb.net/product-management?retryWrites=true&w=majority&appName=Cluster0

5.  **Khởi động ứng dụng:**
    ```sh
    npm start
    ```
    Mở trình duyệt và truy cập `http://localhost:3002` để xem ứng dụng.

## 🛠️ Công nghệ sử dụng

-   **Backend**: Node.js, Express.js
-   **Frontend**: Pug, HTML, CSS, JavaScript
-   **Database**: MongoDB với Mongoose
-   **View Engine**: Pug
-   **File Upload**: Multer & Cloudinary
-   **Authentication**: Express Session
-   **Utilities**: Method Override, Moment.js
-   **Editor**: TinyMCE


## 🤝 Đóng góp

Sự đóng góp của bạn làm cho cộng đồng open source trở nên tuyệt vời hơn. Mọi đóng góp của bạn đều được **trân trọng**.

Nếu bạn có đề xuất để cải thiện dự án, vui lòng fork repo và tạo một pull request. Bạn cũng có thể mở một issue với tag "enhancement".

1.  Fork dự án
2.  Tạo Feature Branch của bạn (`git checkout -b feature/AmazingFeature`)
3.  Commit các thay đổi của bạn (`git commit -m 'Add some AmazingFeature'`)
4.  Push lên Branch (`git push origin feature/AmazingFeature`)
5.  Mở một Pull Request

## 📝 Changelog

### v1.0.0 (2024-01-01)
- ✨ Tính năng quản lý sản phẩm cơ bản
- 🔐 Hệ thống xác thực người dùng
- 📱 Giao diện responsive

### v1.1.0 (2024-02-01)
- 🖼️ Tích hợp Cloudinary cho upload ảnh
- 🔍 Tính năng tìm kiếm và lọc sản phẩm
- 🛒 Giỏ hàng cơ bản

## 📄 Giấy phép

Dự án này được cấp phép theo Giấy phép ISC. Xem tệp `LICENSE` để biết thêm chi tiết.

## 👨‍💻 Tác giả

**Vũ Hà Nam (VuNam002)**
- GitHub: [@VuNam002](https://github.com/VuNam002)
- Email: namvu7702@gmail.com

<div align="center">
  <p>⭐ Đừng quên star repo nếu bạn thấy hữu ích! ⭐</p>
  <p>Cảm ơn bạn đã ghé thăm!</p>
</div>