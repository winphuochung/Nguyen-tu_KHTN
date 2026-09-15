/**
 * app.js: Bộ điều phối ứng dụng chính "Vũ Trụ Nguyên Tử"
 * Kết nối tri thức với cuộc sống - KHTN 7
 */

document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

function initApp() {
  // 1. Kiểm tra đăng nhập
  try { checkAuth(); } catch (e) { console.error("Lỗi checkAuth:", e); }

  // 2. Khởi tạo thanh 20 nguyên tố trong 3D Lab
  try { renderElementsBar(); } catch (e) { console.error("Lỗi renderElementsBar:", e); }

  // 3. Khởi tạo lý thuyết, micro-learning và "Em có biết"
  try { renderTheoryContent(); } catch (e) { console.error("Lỗi renderTheoryContent:", e); }
  try {
    if (window.MicroVideoPlayer) {
      window.microPlayer = new MicroVideoPlayer();
    }
    renderMicroLearning();
  } catch (e) { console.error("Lỗi MicroVideoPlayer / renderMicroLearning:", e); }
  try { renderDidYouKnow(); } catch (e) { console.error("Lỗi renderDidYouKnow:", e); }

  // 4. Khởi tạo 3D Atom Viewer
  try {
    if (document.getElementById("atom3dCanvas")) {
      window.atomViewer = new Atom3DViewer("atom3dCanvas");
    }
  } catch (e) { console.error("Lỗi Atom3DViewer:", e); }

  // 5. Khởi tạo Game Kéo Co
  try {
    if (document.getElementById("tug-of-war-container")) {
      window.tugGame = new TugOfWarGame("tug-of-war-container");
    }
  } catch (e) { console.error("Lỗi TugOfWarGame:", e); }

  // 6. Khởi tạo Quiz Engine
  try {
    if (document.getElementById("quiz-engine-container")) {
      window.quizEngine = new QuizEngine("quiz-engine-container");
      window.quizEngine.init();
    }
  } catch (e) { console.error("Lỗi QuizEngine:", e); }

  // 7. Khởi tạo Teacher Dashboard
  try {
    if (document.getElementById("teacher-dashboard-container")) {
      window.teacherDashboard = new TeacherDashboard("teacher-dashboard-container");
      window.teacherDashboard.init();
    }
  } catch (e) { console.error("Lỗi TeacherDashboard:", e); }

  // 8. Cập nhật Leaderboard & Badges
  try { renderLeaderboardTab(); } catch (e) { console.error("Lỗi renderLeaderboardTab:", e); }

  // 9. Lắng nghe sự kiện đổi tab
  try { setupNavigation(); } catch (e) { console.error("Lỗi setupNavigation:", e); }
}

// ==================== QUẢN LÝ ĐĂNG NHẬP & BẢO MẬT PHÂN QUYỀN ====================
function populateClassSelect() {
  const select = document.getElementById("auth-class-select");
  if (!select) return;
  const classes = window.appStorage.getAllClasses();
  select.innerHTML = classes.map(c => `
    <option value="${c.code}">${c.name} (${c.code})</option>
  `).join("");
}

function switchAuthRole(role) {
  const btnStudent = document.getElementById("btn-auth-tab-student");
  const btnTeacher = document.getElementById("btn-auth-tab-teacher");
  const formStudent = document.getElementById("form-login-student");
  const formTeacher = document.getElementById("form-login-teacher");

  if (role === "student") {
    btnStudent.classList.add("active");
    btnTeacher.classList.remove("active");
    formStudent.style.display = "block";
    formTeacher.style.display = "none";
  } else {
    btnStudent.classList.remove("active");
    btnTeacher.classList.add("active");
    formStudent.style.display = "none";
    formTeacher.style.display = "block";
  }
  if (window.soundFX) window.soundFX.playClick();
}

function checkAuth() {
  let user = window.appStorage.getCurrentUser();
  const authModal = document.getElementById("auth-modal-overlay");
  const userCard = document.getElementById("user-status-card");

  populateClassSelect();

  // Tự động khởi tạo phiên học sinh chuẩn nếu chưa có
  if (!user) {
    user = window.appStorage.loginStudent("Học sinh KHTN 7", "KHTN7A1");
  } else {
    if (!Array.isArray(user.exploredElements)) {
      user.exploredElements = [];
      window.appStorage.saveUserProfile(user);
    }
  }

  // Ẩn modal để màn hình hoàn toàn tương tác được
  if (authModal) authModal.style.display = "none";
  if (userCard) {
    userCard.style.display = "flex";
    const isTeacher = user.role === "teacher";
    const avatarEl = document.querySelector(".user-avatar");
    if (avatarEl) avatarEl.textContent = isTeacher ? "👩‍🏫" : "👨‍🎓";
    const nameEl = document.getElementById("user-display-name");
    if (nameEl) nameEl.textContent = user.fullName || user.username;
    const classEl = document.getElementById("user-display-class");
    if (classEl) classEl.textContent = isTeacher ? "Quản Trị Viên" : `Lớp: ${user.classCode}`;
  }
}

function handleStudentLogin(e) {
  if (e) e.preventDefault();
  const usernameInput = document.getElementById("auth-username");
  const classSelect = document.getElementById("auth-class-select");

  const username = usernameInput.value.trim();
  const classCode = classSelect.value.trim().toUpperCase();

  if (!username) {
    alert("Vui lòng nhập họ tên hoặc biệt danh học sinh!");
    return;
  }

  window.appStorage.loginStudent(username, classCode);
  if (window.soundFX) window.soundFX.playCorrect();
  checkAuth();
  renderLeaderboardTab();
}

function handleTeacherLogin(e) {
  if (e) e.preventDefault();
  const userInput = document.getElementById("auth-teacher-user").value.trim();
  const passInput = document.getElementById("auth-teacher-pass").value;

  const res = window.appStorage.loginTeacher(userInput, passInput);
  if (res.success) {
    if (window.soundFX) window.soundFX.playVictory();
    checkAuth();
    switchMainTab("teacher");
  } else {
    alert(res.message);
    if (window.soundFX) window.soundFX.playWrong();
  }
}

function handleVerifyTeacherPassword(e) {
  if (e) e.preventDefault();
  const pass = document.getElementById("verify-teacher-pass").value;
  const res = window.appStorage.loginTeacher("giaovien", pass);
  if (res.success) {
    document.getElementById("teacher-verify-modal").style.display = "none";
    if (window.soundFX) window.soundFX.playVictory();
    checkAuth();
    switchMainTab("teacher");
  } else {
    alert("Mật khẩu giáo viên không chính xác!");
    if (window.soundFX) window.soundFX.playWrong();
  }
}

function openTeacherLoginModal() {
  document.getElementById("teacher-verify-modal").style.display = "flex";
}

function handleLogout() {
  if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
    window.appStorage.logout();
    checkAuth();
    if (window.soundFX) window.soundFX.playClick();
  }
}

// ==================== ĐIỀU HƯỚNG TAB & KHÓA QUYỀN GIÁO VIÊN ====================
function setupNavigation() {
  const tabs = document.querySelectorAll(".nav-tab-btn");
  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      switchMainTab(tabId);
    });
  });
}

function switchMainTab(tabId) {
  // Active button
  document.querySelectorAll(".nav-tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
  });

  // Active Pane
  document.querySelectorAll(".tab-pane").forEach(pane => {
    pane.classList.toggle("active", pane.id === `pane-${tabId}`);
  });

  if (window.soundFX) window.soundFX.playClick();

  if (tabId === "lab" && window.atomViewer) {
    window.atomViewer.resetView();
  } else if (tabId === "leaderboard") {
    renderLeaderboardTab();
  } else if (tabId === "teacher" && window.teacherDashboard) {
    window.teacherDashboard.render();
  }
}

// ==================== THANH 20 NGUYÊN TỐ 3D LAB ====================
function renderElementsBar() {
  const container = document.getElementById("elements-scroll-bar");
  if (!container) return;

  container.innerHTML = ELEMENTS_DATA.map(el => `
    <button class="el-chip ${el.z === 6 ? 'active' : ''}" id="chip-el-${el.z}" onclick="selectElement(${el.z})">
      <span class="el-z">${el.z}</span>
      <span class="el-sym">${el.symbol}</span>
    </button>
  `).join("");
}

function selectElement(z) {
  document.querySelectorAll(".el-chip").forEach(c => c.classList.remove("active"));
  const chip = document.getElementById(`chip-el-${z}`);
  if (chip) chip.classList.add("active");

  if (window.atomViewer) {
    window.atomViewer.loadElement(z);
  }
  if (window.soundFX) window.soundFX.playClick();
}

// ==================== LÝ THUYẾT & MICRO-LEARNING ====================
function renderTheoryContent() {
  const container = document.getElementById("theory-cards-container");
  if (!container) return;

  container.innerHTML = DIDACTIC_CONTENT.theoryChapters.map(chap => `
    <div class="theory-card">
      <div class="badge-tag">CHƯƠNG TRÌNH KNTT</div>
      <h3>${chap.title}</h3>
      <p><strong>${chap.summary}</strong></p>
      <ul>
        ${chap.bullets.map(b => `<li>${b}</li>`).join("")}
      </ul>
      ${chap.analogy ? `
        <div class="app-box" style="margin-top: 0.8rem;">
          <strong>💡 Hình dung so sánh thực tế:</strong>
          ${chap.analogy}
        </div>
      ` : ''}
    </div>
  `).join("");
}

function parseStartSeconds(str) {
  if (!str) return 0;
  const parts = str.split("-")[0].trim().split(":");
  if (parts.length === 2) {
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
  }
  return 0;
}

function renderMicroLearning() {
  const container = document.getElementById("micro-learning-container");
  if (!container) return;

  const thumbGradients = {
    "rutherford-gold": "linear-gradient(135deg, #450a0a, #1c1917, #030712)",
    "electron-shells": "linear-gradient(135deg, #082f49, #0f172a, #030712)",
    "amu-scale": "linear-gradient(135deg, #1e1b4b, #0f172a, #030712)",
    "empty-space": "linear-gradient(135deg, #064e3b, #0f172a, #030712)"
  };

  const thumbIcons = {
    "rutherford-gold": "🔬 ⚛️ ✨",
    "electron-shells": "🪐 🔵 💫",
    "amu-scale": "⚖️ 🧪 📊",
    "empty-space": "🏟️ 🍬 🌌"
  };

  container.innerHTML = DIDACTIC_CONTENT.microLearnings.map(ml => {
    const bg = thumbGradients[ml.id] || "linear-gradient(135deg, #1e293b, #0f172a)";
    const icon = thumbIcons[ml.id] || "▶️";

    return `
      <div class="micro-card">
        <div class="micro-badge">${ml.badge} • ⏱️ ${ml.duration}</div>
        <h4>${ml.title}</h4>

        <!-- KHUNG PREVIEW VIDEO THUMBNAIL -->
        <div class="micro-video-thumb" style="background: ${bg};" onclick="if(window.microPlayer) window.microPlayer.openVideo('${ml.id}')" title="Nhấp để phát video ${ml.title}">
          <div style="font-size: 2.8rem; filter: drop-shadow(0 0 12px rgba(0,242,254,0.6));">${icon}</div>
          <div class="micro-play-btn-circle">▶</div>
          <div class="micro-video-tag">🎬 60FPS + YOUTUBE</div>
        </div>

        <button class="btn-watch-video" onclick="if(window.microPlayer) window.microPlayer.openVideo('${ml.id}')">
          <span>▶️</span> XEM VIDEO BÀI GIẢNG (${ml.duration})
        </button>

        <p style="font-size: 0.82rem; color: #cbd5e1; margin: 0.8rem 0 0.6rem;">${ml.overview}</p>

        <div class="micro-timeline">
          ${ml.scenes.map(s => {
            const startSec = parseStartSeconds(s.second);
            return `
              <div class="micro-step clickable" onclick="if(window.microPlayer){ window.microPlayer.openVideo('${ml.id}'); setTimeout(()=>window.microPlayer.jumpToScene(${startSec}), 120); }" title="Tua video tới [${s.second}]">
                <span style="color: var(--neon-cyan); font-weight:700;">▶ [${s.second}] ${s.title}:</span>
                <div>${s.desc}</div>
                <strong style="color: #cbd5e1; font-size: 0.74rem;">👉 ${s.takeaway}</strong>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }).join("");
}

function renderDidYouKnow() {
  const container = document.getElementById("did-you-know-container");
  if (!container) return;

  container.innerHTML = DIDACTIC_CONTENT.didYouKnow.map(item => `
    <div class="dyk-card">
      <div class="badge-tag">${item.tag}</div>
      <h4>${item.title}</h4>
      <p>${item.content}</p>
    </div>
  `).join("");
}

// ==================== BẢNG XẾP HẠNG & HUY HIỆU ====================
function renderLeaderboardTab() {
  const lbContainer = document.getElementById("leaderboard-list");
  const badgesContainer = document.getElementById("badges-list");
  if (!lbContainer || !badgesContainer) return;

  const lbData = window.appStorage.getLeaderboard();
  lbContainer.innerHTML = lbData.map((item, idx) => `
    <div class="lb-row ${idx === 0 ? 'top-1' : ''}">
      <div class="lb-rank">${idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}</div>
      <div class="lb-user-info">
        <div class="lb-username">${item.username}</div>
        <div class="lb-userclass">Lớp ${item.classCode} • Độ chính xác: ${item.accuracy}% • ${item.badgeCount} Huy hiệu</div>
      </div>
      <div class="lb-score">${item.score} XP</div>
    </div>
  `).join("");

  const user = window.appStorage.getCurrentUser();
  const badges = user ? user.badges : DEFAULT_BADGES;

  badgesContainer.innerHTML = badges.map(b => `
    <div class="badge-item ${b.unlocked ? 'unlocked' : 'locked'}">
      <div class="b-icon">${b.icon}</div>
      <div class="b-info">
        <div class="b-title">${b.title} ${b.unlocked ? '✅' : '🔒'}</div>
        <div class="b-desc">${b.description}</div>
      </div>
    </div>
  `).join("");
}

// Âm thanh bật tắt
function toggleGlobalAudio() {
  const isMuted = window.soundFX.toggleMute();
  const btn = document.getElementById("btn-audio-toggle");
  if (btn) {
    btn.textContent = isMuted ? "🔇 Tắt âm" : "🔊 Âm thanh";
  }
}

// Toàn cục cho HTML inline events
window.initApp = initApp;
window.switchAuthRole = switchAuthRole;
window.handleStudentLogin = handleStudentLogin;
window.handleTeacherLogin = handleTeacherLogin;
window.handleVerifyTeacherPassword = handleVerifyTeacherPassword;
window.openTeacherLoginModal = openTeacherLoginModal;
window.handleLogout = handleLogout;
window.switchMainTab = switchMainTab;
window.selectElement = selectElement;
window.toggleGlobalAudio = toggleGlobalAudio;
