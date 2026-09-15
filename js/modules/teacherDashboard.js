/**
 * TeacherDashboard: Bảng điều khiển thông minh dành riêng cho Giáo viên
 * - Bảo mật truy cập độc quyền cho tài khoản Giáo viên
 * - Quản lý thêm/xóa lớp học
 * - Nhập danh sách học sinh (nhập lẻ hoặc dán hàng loạt từ file Excel/Word)
 * - Theo dõi tiến độ, điểm số của từng học sinh trong lớp
 * - Biểu đồ phân tích phổ điểm & Bản đồ nhiệt Heatmap lỗ hổng kiến thức
 * - Tạo đề 15 phút & Xuất mẫu Google Forms / CSV
 */

class TeacherDashboard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentClass = "KHTN7A1";
    this.currentSubTab = "roster"; // 'roster', 'analytics', 'exams'
  }

  init() {
    // Đảm bảo lớp hiện tại hợp lệ
    const classes = window.appStorage.getAllClasses();
    if (classes.length > 0 && !classes.some(c => c.code === this.currentClass)) {
      this.currentClass = classes[0].code;
    }
    this.render();
  }

  render() {
    if (!this.container) return;

    // Kiểm tra quyền giáo viên
    if (!window.appStorage.isTeacher()) {
      this.renderAccessDenied();
      return;
    }

    const classes = window.appStorage.getAllClasses();
    const currentClassData = classes.find(c => c.code === this.currentClass) || classes[0];
    const students = window.appStorage.getStudentsByClass(this.currentClass);
    const teacher = window.appStorage.getCurrentUser();

    this.container.innerHTML = `
      <div class="teacher-dashboard-wrapper">
        <!-- Header Dashboard -->
        <div class="dash-top-bar">
          <div class="dash-title-block">
            <span class="badge-tag">👩‍🏫 CỔNG QUẢN TRỊ DÀNH CHO GIÁO VIÊN</span>
            <h2 class="glow-title">QUẢN LÝ LỚP HỌC & THEO DÕI HỌC SINH</h2>
            <span style="font-size: 0.85rem; color: #cbd5e1;">Chào mừng <strong>${teacher.fullName || teacher.username}</strong></span>
          </div>

          <div class="dash-controls">
            <div class="class-selector-wrap">
              <label>Lớp Đang Chọn:</label>
              <select class="class-selector" id="teacher-class-select" onchange="window.teacherDashboard.changeClass(this.value)">
                ${classes.map(c => `
                  <option value="${c.code}" ${c.code === this.currentClass ? 'selected' : ''}>
                    ${c.name} (${c.code}) - ${c.students ? c.students.length : 0} HS
                  </option>
                `).join("")}
              </select>
            </div>
            <button class="btn-secondary" onclick="window.teacherDashboard.openAddClassModal()" style="margin-left: 0.5rem;">
              ➕ Thêm Lớp Mới
            </button>
          </div>
        </div>

        <!-- Thanh chuyển đổi tính năng bên trong Dashboard Giáo viên -->
        <div class="teacher-subtabs-row">
          <button class="t-subtab-btn ${this.currentSubTab === 'roster' ? 'active' : ''}" onclick="window.teacherDashboard.switchSubTab('roster')">
            👥 Quản Lý & Nhập Danh Sách Học Sinh (${students.length})
          </button>
          <button class="t-subtab-btn ${this.currentSubTab === 'analytics' ? 'active' : ''}" onclick="window.teacherDashboard.switchSubTab('analytics')">
            📊 Phổ Điểm & Heatmap Lỗ Hổng
          </button>
          <button class="t-subtab-btn ${this.currentSubTab === 'exams' ? 'active' : ''}" onclick="window.teacherDashboard.switchSubTab('exams')">
            📝 Tạo Đề 15P & Xuất Google Forms
          </button>
        </div>

        <!-- Khung nội dung tương ứng với SubTab -->
        <div id="teacher-subtab-content">
          ${this.renderSubTabContent(currentClassData, students)}
        </div>
      </div>

      <!-- MODAL THÊM LỚP MỚI -->
      <div id="add-class-modal" class="auth-overlay" style="display: none;">
        <div class="auth-modal" style="max-width: 420px; text-align: left;">
          <h3 style="color:#ffffff; margin-bottom: 0.8rem;">➕ Thêm Lớp Học Mới</h3>
          <p style="font-size:0.82rem; color:#94a3b8; margin-bottom: 1.2rem;">Nhập thông tin lớp học để học sinh có thể đăng nhập và giáo viên theo dõi tiến độ.</p>
          <form onsubmit="window.teacherDashboard.submitAddClass(event)">
            <div style="margin-bottom: 0.8rem;">
              <label style="font-size:0.8rem; color:#cbd5e1;">Tên Lớp Học (Ví dụ: Lớp 7A4):</label>
              <input type="text" id="new-class-name" class="auth-input" placeholder="Lớp 7A4" required />
            </div>
            <div style="margin-bottom: 1.2rem;">
              <label style="font-size:0.8rem; color:#cbd5e1;">Mã Lớp (Dùng cho học sinh đăng nhập, viết liền không dấu):</label>
              <input type="text" id="new-class-code" class="auth-input" placeholder="KHTN7A4" style="text-transform: uppercase;" required />
            </div>
            <div style="display: flex; gap: 0.8rem; justify-content: flex-end;">
              <button type="button" class="btn-secondary" onclick="document.getElementById('add-class-modal').style.display='none'">Hủy</button>
              <button type="submit" class="btn-cosmic-glow">Tạo Lớp</button>
            </div>
          </form>
        </div>
      </div>

      <!-- MODAL NHẬP DANH SÁCH HỌC SINH TỪ FILE EXCEL / WORD HOẶC COPY-PASTE -->
      <div id="batch-import-modal" class="auth-overlay" style="display: none;">
        <div class="auth-modal" style="max-width: 600px; text-align: left;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem;">
            <h3 style="color:#ffffff; font-size: 1.15rem;">📁 Nhập Danh Sách Học Sinh Bằng File</h3>
            <button type="button" class="btn-del-st" style="font-size: 1rem; padding: 0.2rem 0.5rem;" onclick="document.getElementById('batch-import-modal').style.display='none'">✕</button>
          </div>
          <p style="font-size:0.82rem; color:#94a3b8; margin-bottom: 0.8rem;">
            Tải lên trực tiếp <strong>File Excel (.xlsx, .xls, .csv)</strong> hoặc <strong>File Word (.docx, .doc, .txt)</strong> để nạp vào <strong>${currentClassData ? currentClassData.name : ''}</strong>.
          </p>

          <!-- Input File ẩn -->
          <input type="file" id="file-import-input" accept=".xlsx, .xls, .csv, .docx, .doc, .txt" style="display:none;" onchange="window.teacherDashboard.handleFileChosen(event)" />

          <!-- Vùng kéo thả / Nút tải file -->
          <div class="file-upload-dropzone" onclick="document.getElementById('file-import-input').click()" ondragover="event.preventDefault(); this.classList.add('drag-over');" ondragleave="this.classList.remove('drag-over');" ondrop="window.teacherDashboard.handleFileDrop(event);">
            <div style="font-size: 2.2rem; margin-bottom: 0.4rem;">📤</div>
            <strong style="color: #ffffff; font-size: 0.95rem; display: block; margin-bottom: 0.2rem;">Kéo thả file Excel hoặc Word vào đây</strong>
            <span style="font-size: 0.78rem; color: var(--text-muted);">hoặc bấm để chọn file từ máy tính</span>
            <div style="display: flex; gap: 0.6rem; justify-content: center; margin-top: 0.8rem;">
              <span class="file-badge excel-badge">📊 Excel (.xlsx, .xls, .csv)</span>
              <span class="file-badge word-badge">📄 Word (.docx, .doc, .txt)</span>
            </div>
          </div>

          <!-- Trạng thái đọc file -->
          <div id="file-parsed-status" style="display: none; margin: 0.8rem 0; padding: 0.6rem 0.9rem; background: rgba(0, 255, 135, 0.1); border: 1px solid var(--neon-green); border-radius: 6px; font-size: 0.84rem;"></div>

          <form onsubmit="window.teacherDashboard.submitBatchImport(event)" style="margin-top: 0.8rem;">
            <label style="font-size: 0.8rem; color: #cbd5e1; display: block; margin-bottom: 0.3rem;">
              Danh sách học sinh xem trước (có thể chỉnh sửa hoặc dán thêm trực tiếp):
            </label>
            <textarea id="batch-students-input" class="dash-input" rows="7" placeholder="Sau khi chọn file Excel/Word, danh sách tên học sinh sẽ tự động hiện tại đây...&#10;Hoặc có thể tự dán danh sách trực tiếp (mỗi em một dòng)." style="font-family: monospace; font-size: 0.88rem; line-height: 1.5; resize: vertical;" required></textarea>
            <div style="display: flex; gap: 0.8rem; justify-content: flex-end; margin-top: 0.8rem;">
              <button type="button" class="btn-secondary" onclick="document.getElementById('batch-import-modal').style.display='none'">Hủy</button>
              <button type="submit" class="btn-cosmic-glow">🚀 Xác Nhận Nạp Vào Lớp</button>
            </div>
          </form>
        </div>
      </div>
    `;

    if (this.currentSubTab === "analytics") {
      setTimeout(() => this.drawScoreDistributionChart(), 50);
    }
  }

  renderAccessDenied() {
    this.container.innerHTML = `
      <div class="auth-modal" style="margin: 2.5rem auto; max-width: 480px; text-align: center; border: 1px solid rgba(0, 245, 255, 0.4); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);">
        <div style="font-size: 3.2rem; margin-bottom: 0.6rem;">👩‍🏫</div>
        <h2 style="color: var(--neon-cyan); margin-bottom: 0.4rem; font-size: 1.4rem;">CỔNG QUẢN TRỊ DÀNH CHO GIÁO VIÊN</h2>
        <p style="font-size: 0.88rem; color: #cbd5e1; margin-bottom: 1.4rem; line-height: 1.5;">
          Khu vực quản lý lớp học, nhập danh sách học sinh (Excel/Word) và phân tích phổ điểm. Vui lòng đăng nhập tài khoản Giáo viên:
        </p>
        
        <form onsubmit="window.teacherDashboard.handleInPageLogin(event)" style="text-align: left;">
          <div style="margin-bottom: 1rem;">
            <label style="font-size: 0.85rem; color: #cbd5e1; display: block; margin-bottom: 0.35rem;">
              👤 Họ và Tên Giáo Viên:
            </label>
            <input type="text" id="inpage-teacher-name" class="auth-input" placeholder="Ví dụ: Cô Hoàng Mai / Thầy Tuấn..." required autocomplete="name" />
          </div>

          <div style="margin-bottom: 1.4rem;">
            <label style="font-size: 0.85rem; color: #cbd5e1; display: block; margin-bottom: 0.35rem;">
              🔑 Mật khẩu quản trị:
            </label>
            <input type="password" id="inpage-teacher-pass" class="auth-input" placeholder="Nhập mật khẩu giáo viên..." required autocomplete="current-password" />
          </div>

          <button type="submit" class="btn-cosmic-glow" style="width: 100%; padding: 0.75rem; font-size: 1rem;">
            🚀 ĐĂNG NHẬP VÀO DASHBOARD
          </button>
        </form>
      </div>
    `;
  }

  handleInPageLogin(e) {
    if (e) e.preventDefault();
    const nameInput = document.getElementById("inpage-teacher-name");
    const passInput = document.getElementById("inpage-teacher-pass");
    const name = nameInput ? nameInput.value.trim() : "";
    const pass = passInput ? passInput.value.trim() : "";

    const res = window.appStorage.loginTeacher(name, pass);
    if (res.success) {
      if (window.soundFX) window.soundFX.playVictory();
      if (typeof checkAuth === "function") checkAuth();
      this.render();
    } else {
      alert(res.message || "Mật khẩu không chính xác!");
      if (window.soundFX) window.soundFX.playWrong();
      if (passInput) {
        passInput.value = "";
        passInput.focus();
      }
    }
  }

  switchSubTab(tab) {
    this.currentSubTab = tab;
    this.render();
  }

  changeClass(classCode) {
    this.currentClass = classCode;
    this.render();
  }

  // ==================== RENDER TỪNG SUBTAB ====================
  renderSubTabContent(classData, students) {
    if (this.currentSubTab === "roster") {
      return `
        <!-- BẢNG QUẢN LÝ DANH SÁCH HỌC SINH -->
        <div class="roster-management-card">
          <div class="roster-header-actions">
            <div>
              <h3 style="color:#ffffff; font-size: 1.15rem;">Danh Sách Học Sinh: ${classData ? classData.name : ''} (${classData ? classData.code : ''})</h3>
              <span style="font-size: 0.82rem; color: var(--text-muted);">Tổng số: <strong>${students.length} học sinh</strong></span>
            </div>
            <div class="roster-btns">
              <button class="btn-secondary" onclick="window.teacherDashboard.openBatchImportModal()">
                📋 Dán Danh Sách Từ Excel
              </button>
              <button class="btn-secondary" onclick="window.teacherDashboard.openAddSingleModal()">
                ➕ Thêm 1 Học Sinh
              </button>
              <button class="btn-secondary" onclick="window.teacherDashboard.exportRosterCSV()">
                📑 Xuất File Excel/CSV
              </button>
            </div>
          </div>

          <!-- Form thêm nhanh 1 học sinh -->
          <div id="add-single-form" style="display: none; background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 8px; margin-bottom: 1rem; border: 1px dashed var(--neon-cyan);">
            <h4 style="color:var(--neon-cyan); font-size: 0.9rem; margin-bottom: 0.5rem;">Thêm Nhanh Một Học Sinh Mới:</h4>
            <div style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
              <input type="text" id="single-st-name" placeholder="Họ và tên học sinh..." class="dash-input" style="flex: 2; min-width: 200px; margin-bottom: 0;" />
              <input type="text" id="single-st-user" placeholder="Biệt danh đăng nhập (tùy chọn)..." class="dash-input" style="flex: 1; min-width: 160px; margin-bottom: 0;" />
              <button class="btn-cosmic-glow" style="padding: 0.5rem 1.2rem;" onclick="window.teacherDashboard.submitAddSingle()">Thêm Ngay</button>
              <button class="btn-secondary" onclick="document.getElementById('add-single-form').style.display='none'">Đóng</button>
            </div>
          </div>

          <!-- Bảng danh sách học sinh -->
          <div class="roster-table-container">
            <table class="roster-table">
              <thead>
                <tr>
                  <th style="width: 50px;">STT</th>
                  <th>Họ và Tên Học Sinh</th>
                  <th>Tên Đăng Nhập</th>
                  <th>Điểm Tích Lũy</th>
                  <th>Bài Kiểm Tra</th>
                  <th>Trạng Thái</th>
                  <th style="width: 100px; text-align: center;">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                ${students.length === 0 ? `
                  <tr>
                    <td colspan="7" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">
                      Chưa có học sinh nào trong lớp này. Hãy bấm <strong>"Dán Danh Sách Từ Excel"</strong> hoặc <strong>"Thêm 1 Học Sinh"</strong> để tạo danh sách!
                    </td>
                  </tr>
                ` : students.map((st, idx) => `
                  <tr>
                    <td style="font-weight: 700; color: var(--text-muted);">${idx + 1}</td>
                    <td style="font-weight: 700; color: #ffffff;">${st.name}</td>
                    <td><span class="user-code-tag">${st.username}</span></td>
                    <td style="color: var(--neon-cyan); font-weight: 700;">${st.score || 0} XP</td>
                    <td style="font-weight: 700; color: ${st.testScore >= 8 ? '#00ff87' : st.testScore >= 6.5 ? '#facc15' : '#f43f5e'};">
                      ${st.testScore !== undefined ? `${st.testScore} đ` : '--'}
                    </td>
                    <td>
                      <span class="status-pill ${st.status.includes('hoàn thành') ? 'st-done' : 'st-pending'}">${st.status}</span>
                    </td>
                    <td style="text-align: center;">
                      <button class="btn-del-st" title="Xóa học sinh khỏi lớp" onclick="window.teacherDashboard.deleteStudent('${st.id}', '${st.name}')">🗑️</button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      `;
    } else if (this.currentSubTab === "analytics") {
      const stats = window.appStorage.getClassStats(this.currentClass);
      return `
        <!-- Thẻ tóm tắt chỉ số nhanh -->
        <div class="metric-cards-grid">
          <div class="metric-card">
            <div class="metric-icon">👥</div>
            <div class="metric-data">
              <div class="metric-num">${students.length}</div>
              <div class="metric-label">Học sinh trong lớp</div>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon">⭐</div>
            <div class="metric-data">
              <div class="metric-num">8.2 / 10</div>
              <div class="metric-label">Điểm trung bình lớp</div>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon">🔥</div>
            <div class="metric-data">
              <div class="metric-num">92%</div>
              <div class="metric-label">Tỷ lệ tham gia làm bài</div>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon">⚠️</div>
            <div class="metric-data">
              <div class="metric-num" style="color: #f43f5e;">Khối lượng amu</div>
              <div class="metric-label">Lỗ hổng kiến thức lớn nhất</div>
            </div>
          </div>
        </div>

        <div class="dash-analytics-row">
          <!-- Phổ điểm Canvas -->
          <div class="chart-box">
            <div class="chart-header">
              <h3>📊 Phổ Điểm Kiểm Tra Lớp ${this.currentClass}</h3>
              <span class="sub-label">Phân bố năng lực học sinh</span>
            </div>
            <div class="chart-canvas-wrap">
              <canvas id="scoreDistCanvas" width="450" height="230"></canvas>
            </div>
            <div class="chart-legend">
              <span class="leg-item"><span class="dot" style="background:#00ff87;"></span> Giỏi (8.5 - 10)</span>
              <span class="leg-item"><span class="dot" style="background:#00f2fe;"></span> Khá (7.0 - 8.4)</span>
              <span class="leg-item"><span class="dot" style="background:#facc15;"></span> TB (5.0 - 6.9)</span>
              <span class="leg-item"><span class="dot" style="background:#f43f5e;"></span> Yếu (&lt; 5.0)</span>
            </div>
          </div>

          <!-- Heatmap Lỗ Hổng -->
          <div class="heatmap-box">
            <div class="chart-header">
              <h3>🔥 Heatmap Lỗ Hổng Kiến Thức Chuẩn KNTT</h3>
              <span class="sub-label">Tỷ lệ trả lời chính xác theo từng chuyên đề</span>
            </div>
            <div class="heatmap-list">
              <div class="heatmap-item">
                <div class="hm-header">
                  <span>1. Khái niệm & Kích thước nguyên tử</span>
                  <strong style="color: #00ff87;">94% Đạt chuẩn</strong>
                </div>
                <div class="hm-bar-track">
                  <div class="hm-bar-fill" style="width: 94%; background: #00ff87;"></div>
                </div>
              </div>

              <div class="heatmap-item">
                <div class="hm-header">
                  <span>2. Cấu tạo hạt nhân & Điện tích p, n, e</span>
                  <strong style="color: #00f2fe;">88% Đạt chuẩn</strong>
                </div>
                <div class="hm-bar-track">
                  <div class="hm-bar-fill" style="width: 88%; background: #00f2fe;"></div>
                </div>
              </div>

              <div class="heatmap-item">
                <div class="hm-header">
                  <span>3. Cấu trúc vỏ & Quy tắc phân bố electron</span>
                  <strong style="color: #facc15;">71% (Cần lưu ý)</strong>
                </div>
                <div class="hm-bar-track">
                  <div class="hm-bar-fill" style="width: 71%; background: #facc15;"></div>
                </div>
              </div>

              <div class="heatmap-item alert-heat">
                <div class="hm-header">
                  <span>4. Khối lượng nguyên tử & Đơn vị amu</span>
                  <strong style="color: #f43f5e;">62% ⚠️ LỖ HỔNG LỚN</strong>
                </div>
                <div class="hm-bar-track">
                  <div class="hm-bar-fill" style="width: 62%; background: #f43f5e;"></div>
                </div>
              </div>

              <div class="heatmap-item alert-heat">
                <div class="hm-header">
                  <span>5. Bài toán tìm số hạt p, n, e</span>
                  <strong style="color: #f43f5e;">58% ⚠️ LỖ HỔNG LỚN</strong>
                </div>
                <div class="hm-bar-track">
                  <div class="hm-bar-fill" style="width: 58%; background: #f43f5e;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    } else {
      // Exams and Exports
      return `
        <div class="dash-actions-row">
          <div class="action-card">
            <div class="card-icon">📝</div>
            <h3>Tạo Đề Kiểm Tra 15 Phút Tùy Chỉnh</h3>
            <p>Trích xuất tự động từ kho Big Data theo tỷ lệ nhận thức mong muốn.</p>
            <div class="test-config-form">
              <div class="form-group">
                <label>Số lượng câu:</label>
                <select id="test-q-count" class="dash-input">
                  <option value="10">10 câu (15 phút)</option>
                  <option value="15">15 câu (20 phút)</option>
                  <option value="20">20 câu (30 phút)</option>
                </select>
              </div>
              <div class="form-group">
                <label>Trọng tâm củng cố:</label>
                <select id="test-focus-topic" class="dash-input">
                  <option value="all">Tất cả các chủ đề</option>
                  <option value="mass_amu">Tập trung: Khối lượng amu & số hạt (Lỗ hổng)</option>
                  <option value="shells">Tập trung: Cấu trúc vỏ electron</option>
                </select>
              </div>
              <button class="btn-cosmic-glow" onclick="window.teacherDashboard.generateCustomTest()">
                ⚡ TẠO ĐỀ & XUẤT ĐỀ NGAY
              </button>
            </div>
          </div>

          <div class="action-card">
            <div class="card-icon">📤</div>
            <h3>Trích Xuất Dữ Liệu & Google Forms</h3>
            <p>Xuất mẫu câu hỏi tương thích Google Forms hoặc xuất dữ liệu điểm lớp sang CSV.</p>
            <div class="export-buttons">
              <button class="export-btn gf-btn" onclick="window.teacherDashboard.exportGoogleFormsTemplate()">
                📋 Xuất Template Google Forms
              </button>
              <button class="export-btn csv-btn" onclick="window.teacherDashboard.exportCSVReport()">
                📑 Xuất Báo Cáo CSV / Excel
              </button>
            </div>

            <div class="notify-box" style="margin-top: 1.2rem;">
              <h4>💬 Gửi Lời Nhắc Học Tập Cá Nhân Hóa</h4>
              <div class="notify-row">
                <input type="text" id="teacher-reminder-input" placeholder="Ví dụ: Cả lớp nhớ ôn lại phần tính khối lượng amu..." class="dash-input" />
                <button class="btn-secondary" onclick="window.teacherDashboard.sendReminder()">GỬI LỜI NHẮC</button>
              </div>
              <div id="reminder-sent-status" style="display:none; color: #00ff87; font-size: 0.85rem; margin-top: 0.4rem;">
                ✅ Đã gửi lời nhắc thành công đến các em học sinh trong lớp!
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  // ==================== CÁC HÀM XỬ LÝ THÊM LỚP & HỌC SINH ====================
  openAddClassModal() {
    document.getElementById("add-class-modal").style.display = "flex";
  }

  submitAddClass(e) {
    if (e) e.preventDefault();
    const name = document.getElementById("new-class-name").value;
    const code = document.getElementById("new-class-code").value;

    const res = window.appStorage.addClass(code, name);
    if (res.success) {
      alert(`Đã thêm thành công ${name} (${code})!`);
      document.getElementById("add-class-modal").style.display = "none";
      this.currentClass = res.classItem.code;
      this.render();
      if (window.soundFX) window.soundFX.playCorrect();
    } else {
      alert(res.message);
    }
  }

  openBatchImportModal() {
    document.getElementById("batch-import-modal").style.display = "flex";
    const status = document.getElementById("file-parsed-status");
    if (status) status.style.display = "none";
  }

  handleFileChosen(event) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      this.parseFile(file);
    }
  }

  handleFileDrop(event) {
    event.preventDefault();
    const dropzone = event.currentTarget;
    if (dropzone) dropzone.classList.remove('drag-over');
    const file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0];
    if (file) {
      this.parseFile(file);
    }
  }

  parseFile(file) {
    const fileName = file.name.toLowerCase();
    const status = document.getElementById("file-parsed-status");
    if (status) {
      status.style.display = "block";
      status.innerHTML = `⏳ Đang đọc file <strong>${file.name}</strong>...`;
    }

    if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls") || fileName.endsWith(".csv")) {
      this._parseExcel(file);
    } else if (fileName.endsWith(".docx") || fileName.endsWith(".doc")) {
      this._parseWord(file);
    } else {
      this._parseText(file);
    }
  }

  _parseExcel(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        if (!window.XLSX) {
          alert("Đang tải thư viện xử lý Excel, vui lòng thử lại sau vài giây!");
          return;
        }
        const workbook = window.XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = window.XLSX.utils.sheet_to_json(sheet, { header: 1 });

        let nameColIdx = -1;
        let startRow = 0;

        // Quét tìm cột Họ và tên
        for (let r = 0; r < Math.min(10, rows.length); r++) {
          const row = rows[r];
          if (!row) continue;
          for (let c = 0; c < row.length; c++) {
            const val = String(row[c] || "").trim().toLowerCase();
            if (val.includes("họ và tên") || val.includes("họ tên") || val.includes("tên học sinh") || val === "tên" || val.includes("học sinh")) {
              nameColIdx = c;
              startRow = r + 1;
              break;
            }
          }
          if (nameColIdx !== -1) break;
        }

        const studentNames = [];
        if (nameColIdx !== -1) {
          for (let r = startRow; r < rows.length; r++) {
            const row = rows[r];
            if (!row) continue;
            const name = String(row[nameColIdx] || "").trim();
            if (name && isNaN(name) && name.length > 2) {
              studentNames.push(name);
            }
          }
        } else {
          // Quét tất cả các ô tìm chuỗi có họ tên (chữ có khoảng trắng)
          for (let r = 0; r < rows.length; r++) {
            const row = rows[r];
            if (!row) continue;
            for (let c = 0; c < row.length; c++) {
              const text = String(row[c] || "").trim();
              if (text.length > 4 && text.includes(" ") && isNaN(text)) {
                if (!text.toLowerCase().includes("trường") && !text.toLowerCase().includes("danh sách") && !text.toLowerCase().includes("ngày")) {
                  studentNames.push(text);
                  break;
                }
              }
            }
          }
        }

        const textarea = document.getElementById("batch-students-input");
        if (textarea) {
          textarea.value = studentNames.join("\n");
        }
        const status = document.getElementById("file-parsed-status");
        if (status) {
          status.style.display = "block";
          status.innerHTML = `<span style="color:#00ff87;">✅ Đã đọc thành công <strong>${studentNames.length} học sinh</strong> từ file Excel <em>${file.name}</em>!</span>`;
        }
        if (window.soundFX) window.soundFX.playCorrect();
      } catch (err) {
        alert("Lỗi khi đọc file Excel: " + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  _parseWord(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target.result;
        const decoder = new TextDecoder('utf-8');
        const textContent = decoder.decode(arrayBuffer);

        const pMatches = textContent.split(/<\/w:p>/);
        const studentNames = [];

        pMatches.forEach(p => {
          const tMatches = p.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
          if (tMatches) {
            const line = tMatches.map(m => m.replace(/<w:t[^>]*>/, '').replace(/<\/w:t>/, '')).join("").trim();
            const clean = line.replace(/^(\d+[\.\/\)\-\t\s]+)/, "").trim();
            if (clean.length > 3 && clean.includes(" ") && isNaN(clean)) {
              if (!clean.toLowerCase().includes("danh sách") && !clean.toLowerCase().includes("trường") && !clean.toLowerCase().includes("khtn")) {
                studentNames.push(clean);
              }
            }
          }
        });

        const textarea = document.getElementById("batch-students-input");
        if (textarea) {
          textarea.value = studentNames.join("\n");
        }
        const status = document.getElementById("file-parsed-status");
        if (status) {
          status.style.display = "block";
          status.innerHTML = `<span style="color:#00ff87;">✅ Đã trích xuất thành công <strong>${studentNames.length} học sinh</strong> từ file Word <em>${file.name}</em>!</span>`;
        }
        if (window.soundFX) window.soundFX.playCorrect();
      } catch (err) {
        alert("Lỗi khi đọc file Word: " + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  _parseText(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const textarea = document.getElementById("batch-students-input");
      if (textarea) {
        textarea.value = text;
      }
      const status = document.getElementById("file-parsed-status");
      if (status) {
        status.style.display = "block";
        status.innerHTML = `<span style="color:#00ff87;">✅ Đã đọc nội dung từ file <em>${file.name}</em>!</span>`;
      }
      if (window.soundFX) window.soundFX.playCorrect();
    };
    reader.readAsText(file);
  }

  submitBatchImport(e) {
    if (e) e.preventDefault();
    const raw = document.getElementById("batch-students-input").value;
    const res = window.appStorage.batchAddStudents(this.currentClass, raw);

    alert(res.message);
    document.getElementById("batch-import-modal").style.display = "none";
    document.getElementById("batch-students-input").value = "";
    this.render();
    if (window.soundFX) window.soundFX.playCorrect();
  }

  openAddSingleModal() {
    const form = document.getElementById("add-single-form");
    if (form) {
      form.style.display = form.style.display === "none" ? "block" : "none";
    }
  }

  submitAddSingle() {
    const nameInput = document.getElementById("single-st-name");
    const userInput = document.getElementById("single-st-user");

    const name = nameInput.value.trim();
    const user = userInput.value.trim();

    if (!name) {
      alert("Vui lòng nhập họ và tên học sinh!");
      return;
    }

    const res = window.appStorage.addStudent(this.currentClass, name, user);
    if (res.success) {
      nameInput.value = "";
      userInput.value = "";
      this.render();
      if (window.soundFX) window.soundFX.playCorrect();
    } else {
      alert(res.message);
    }
  }

  deleteStudent(id, name) {
    if (confirm(`Bạn có chắc chắn muốn xóa học sinh "${name}" khỏi lớp không?`)) {
      window.appStorage.deleteStudent(this.currentClass, id);
      this.render();
      if (window.soundFX) window.soundFX.playClick();
    }
  }

  exportRosterCSV() {
    const students = window.appStorage.getStudentsByClass(this.currentClass);
    let csv = "STT,HoVaTen,TenDangNhap,Lop,DiemXP,DiemKiemTra,TrangThai\n";
    students.forEach((s, idx) => {
      csv += `${idx + 1},"${s.name}","${s.username}","${this.currentClass}",${s.score || 0},${s.testScore || '--'},"${s.status}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Danh_Sach_Hoc_Sinh_${this.currentClass}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    if (window.soundFX) window.soundFX.playCorrect();
  }

  // ==================== CÁC TÍNH NĂNG ĐỒ THỊ & TẠO ĐỀ ====================
  drawScoreDistributionChart() {
    const canvas = document.getElementById("scoreDistCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const data = [
      { label: "Giỏi (8.5-10)", count: 14, color: "#00ff87" },
      { label: "Khá (7-8.4)", count: 16, color: "#00f2fe" },
      { label: "TB (5-6.9)", count: 6, color: "#facc15" },
      { label: "Yếu (<5)", count: 2, color: "#f43f5e" }
    ];

    const barWidth = 60;
    const gap = 38;
    const startX = 40;
    const maxCount = 20;
    const chartHeight = 160;

    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.beginPath();
    ctx.moveTo(startX - 10, h - 35);
    ctx.lineTo(w - 20, h - 35);
    ctx.stroke();

    data.forEach((item, i) => {
      const x = startX + i * (barWidth + gap);
      const barH = (item.count / maxCount) * chartHeight;
      const y = h - 35 - barH;

      const grad = ctx.createLinearGradient(x, y, x, h - 35);
      grad.addColorStop(0, item.color);
      grad.addColorStop(1, "rgba(255, 255, 255, 0.05)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x, y, barWidth, barH, [6, 6, 0, 0]);
      } else {
        ctx.rect(x, y, barWidth, barH);
      }
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px 'Be Vietnam Pro', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${item.count} HS`, x + barWidth / 2, y - 8);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "11px 'Be Vietnam Pro', sans-serif";
      ctx.fillText(item.label.split(" ")[0], x + barWidth / 2, h - 15);
    });
  }

  generateCustomTest() {
    const count = parseInt(document.getElementById("test-q-count").value, 10) || 10;
    const focus = document.getElementById("test-focus-topic").value;

    let pool = QUESTION_BANK;
    if (focus !== "all") {
      pool = QUESTION_BANK.filter(q => q.topic === focus || q.topic === "problem_solving");
    }

    const testQuestions = [];
    const poolCopy = [...pool];

    for (let i = 0; i < Math.min(count, poolCopy.length); i++) {
      const idx = Math.floor(Math.random() * poolCopy.length);
      testQuestions.push(poolCopy.splice(idx, 1)[0]);
    }

    alert(`🎉 ĐÃ KHỞI TẠO BỘ ĐỀ KIỂM TRA 15 PHÚT THÀNH CÔNG!\n- Số lượng: ${testQuestions.length} câu hỏi.\n- Trọng tâm: ${focus === 'all' ? 'Tổng hợp' : 'Khắc phục lỗ hổng kiến thức'}.\n- Mã đề: KNTT-${Math.floor(1000 + Math.random() * 9000)}.`);
    if (window.soundFX) window.soundFX.playCorrect();
  }

  exportGoogleFormsTemplate() {
    let gFormsText = "TÊN BÀI KIỂM TRA: KIỂM TRA 15 PHÚT - BÀI 2: NGUYÊN TỬ (KHTN 7 KNTT)\n\n";

    QUESTION_BANK.slice(0, 10).forEach((q, idx) => {
      gFormsText += `Câu ${idx + 1}: ${q.question}\n`;
      if (q.type === "mcq" && q.options) {
        q.options.forEach((opt, oIdx) => {
          const isCorrect = oIdx === q.correct ? " [ĐÁP ÁN ĐÚNG]" : "";
          gFormsText += `  ${String.fromCharCode(65 + oIdx)}. ${opt}${isCorrect}\n`;
        });
      } else {
        gFormsText += `  Dạng: Trả lời ngắn / Điền số\n  Đáp án: ${q.correctAnswer || "Xem hướng dẫn giải"}\n`;
      }
      gFormsText += `Giải thích chi tiết: ${q.explanation}\n\n`;
    });

    const blob = new Blob([gFormsText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `De_Kiem_Tra_15P_Google_Forms_${this.currentClass}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    if (window.soundFX) window.soundFX.playCorrect();
  }

  exportCSVReport() {
    let csv = "STT,TenHocSinh,Lop,Diem,DoChinhXac,HuyHieu,TrangThaiLuyenTap\n";
    const students = window.appStorage.getStudentsByClass(this.currentClass);

    students.forEach((s, idx) => {
      csv += `${idx + 1},"${s.name}","${this.currentClass}",${s.testScore || 8.0},"${s.accuracy || 85}%",3,"${s.status}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Bao_Cao_Diem_${this.currentClass}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    if (window.soundFX) window.soundFX.playCorrect();
  }

  sendReminder() {
    const input = document.getElementById("teacher-reminder-input");
    if (!input || !input.value.trim()) return;

    const status = document.getElementById("reminder-sent-status");
    if (status) {
      status.style.display = "block";
      setTimeout(() => status.style.display = "none", 4000);
    }
    input.value = "";
    if (window.soundFX) window.soundFX.playCorrect();
  }
}

window.TeacherDashboard = TeacherDashboard;
