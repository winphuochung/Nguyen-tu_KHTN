# ⚛️ Ứng dụng Học tập Tương tác: Cấu tạo Nguyên tử (KHTN 7)

> **Phần mềm Học tập & Giảng dạy Khoa học tự nhiên 7 - Bài 2: Cấu tạo nguyên tử**  
> *Bộ sách Kết nối tri thức với cuộc sống (KNTT)*  
> **Đơn vị phát triển:** Trường TH & THCS Phước Hưng

---

## 🌟 Tính Năng Nổi Bật

### 1. 🪐 Phòng Thí Nghiệm 3D Lab (Interactive 3D Atom Viewer)
- Mô hình nguyên tử 3D chân thực, tương tác cảm ứng xoay 360°, phóng to/thu nhỏ (Zoom).
- Mô phỏng chuyển động hạt electron trên các lớp vỏ theo quỹ đạo Rutherford - Bohr ở tốc độ 60 FPS.
- Hỗ trợ xem thông số chi tiết (Proton, Neutron, Electron, khối lượng amu, cấu hình vỏ) của đầy đủ **20 nguyên tố hóa học đầu tiên**.

### 2. 🎬 Hệ Thống Micro-learning Video 60 FPS & Tư Liệu Khoa Học
- Video hoạt họa mô phỏng vật lý trực quan thời gian thực:
  - **Thí nghiệm Rutherford**: Bắn phá lá vàng mỏng, khám phá bí ẩn hạt nhân.
  - **Vũ điệu các lớp vỏ Electron**: Quy tắc vàng 2 - 8 - 8.
  - **Khối lượng amu là gì?**: Khám phá chiếc cân thế giới siêu vi.
  - **Nguyên tử rỗng đến mức nào?**: So sánh với sân vận động khổng lồ và viên đường nén toàn bộ nhân loại.
- Tích hợp giọng đọc thuyết minh tiếng Việt tự động (AI Narration) và phụ đề đồng bộ.

### 3. ⚔️ Game Đối Kháng Kéo Co Tri Thức (Tug of War PvP)
- Trận đấu đối kháng kéo co thời gian thực giữa 2 phe (Proton vs Electron).
- Hỗ trợ chế độ chơi với Máy thông minh (PvE) và đấu qua mạng nội bộ P2P (PvP).

### 4. 🎯 Hệ Thống Luyện Tập Đa Tầng (Adaptive Quiz Engine)
- Ngân hàng câu hỏi trắc nghiệm phân hóa 4 cấp độ nhận thức: Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao.
- Bài tập kéo thả electron vào các lớp vỏ theo thời gian thực (20 bài).
- Bài tập nối sơ đồ tư duy khái niệm (20 bài).
- Bài tập tính toán khối lượng nguyên tử amu (20 bài).

### 5. 📊 Bảng Xếp Hạng & Bảng Điều Khiển Giáo Viên (Teacher Dashboard)
- Hệ thống danh hiệu, huy hiệu Gamification kích thích tinh thần học tập.
- Quản lý danh sách lớp học, phân tích phổ điểm, tỷ lệ độ chính xác từng chuyên đề.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### Cách 1: Chạy trực tiếp qua trình duyệt (Không cần cài đặt)
Mở trực tiếp file index.html bằng trình duyệt Google Chrome, Microsoft Edge hoặc Cốc Cốc.

### Cách 2: Chạy qua Localhost Server (Khuyên dùng)
Nếu máy tính đã cài đặt Python:
`ash
python server.py
`
Sau đó mở trình duyệt và truy cập: **http://localhost:8080**

Hoặc nhấp đúp chuột vào file start_server.bat trên Windows.

---

## 🛠️ Công Nghệ Sử Dụng
- **HTML5, CSS3, Modern JavaScript (ES6+)**
- **HTML5 Canvas 2D/3D Context** (Kết xuất 60 FPS không cần thư viện nặng)
- **Web Speech API** (Giọng đọc thuyết minh tiếng Việt)
- **Local Storage API** (Lưu trữ ngoại tuyến an toàn)
- **SheetJS (xlsx.full.min.js)** (Xuất / nhập dữ liệu Excel học sinh)
- **PeerJS** (Kết nối đối kháng kéo co ngang hàng P2P)

---

## 📄 Bản Quyền & Giấy Phép
Dự án được xây dựng phục vụ mục đích giáo dục phi lợi nhuận cho học sinh và giáo viên môn Khoa học tự nhiên 7.
