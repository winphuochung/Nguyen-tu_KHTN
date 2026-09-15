# CODEBASE.md - Sơ đồ Hệ Thống Ứng Dụng "Nguyên tử" (KHTN 7)

## 1. Tổng quan Dự án
- **Tên app**: Nguyên tử
- **Nội dung**: Bài 2 - Cấu tạo nguyên tử (Bộ sách Kết nối tri thức với cuộc sống)
- **Công nghệ**: HTML5, Vanilla JavaScript (ES6+), Canvas 2D/3D (Three.js/Custom 3D Engine), CSS3 Neon Glow Cyberpunk, WebRTC PvP (PeerJS), Xử lý bảng tính (SheetJS xlsx.full.min.js), Hệ thống âm thanh Web Audio API (`soundEffects.js`).

## 2. Cấu trúc Module
- `index.html`: Giao diện SPA (Single Page Application) điều phối 5 tab chính.
- `logo.png`: Huy hiệu Trường TH & THCS Phước Hưng (An Giang).
- `css/`:
  - `style.css`: Nền vũ trụ, Top Navigation, Header, Auth Modal, Font chữ Neon.
  - `components.css`: Thẻ bài học, Bàn kéo co PvP, Bảng vàng, Dashboard Giáo viên.
- `js/data/`:
  - `elementsData.js`: Dữ liệu 20 nguyên tố đầu bảng tuần hoàn (Z, Kí hiệu, Lớp e, Khối lượng amu).
  - `didacticContent.js`: Lý thuyết chuẩn SGK KNTT, Micro-learning, Mục "Em có biết".
  - `questionBank.js`: Ngân hàng câu hỏi đa tầng (NB, TH, VD, VDC).
- `js/core/`:
  - `storage.js`: LocalStorage quản lý Học sinh, Giáo viên (mật khẩu 1234567), Lớp học, Điểm.
  - `adaptiveEngine.js`: Thuật toán thích ứng AI tự động đổi độ khó theo năng lực & Spaced Repetition Leitner.
  - `soundEffects.js`: Hiệu ứng âm thanh sinh động (click, đúng, sai, chiến thắng).
- `js/modules/`:
  - `atom3dViewer.js`: Mô phỏng 3D tương tác nguyên tử xoay 360 độ, phóng to thu nhỏ.
  - `tugOfWarGame.js`: Trò chơi Kéo co kiến thức PvP thời gian thực (đồ họa kéo co sinh động, WebRTC Peer-to-Peer).
  - `quizEngine.js`: Trắc nghiệm thích ứng AI, đo tốc độ phản xạ và combo streak.
  - `teacherDashboard.js`: Bảng điều khiển Giáo viên, quản lý học sinh, kéo thả file Excel/Word, phổ điểm Heatmap, tạo đề 15P.
  - `app.js`: Bộ điều phối chung toàn bộ ứng dụng.

## 3. Thư mục Agent
- `.agent/`: Bộ công cụ siêu Agent Antigravity Kit (20 agents, 36 skills, quy tắc rules).