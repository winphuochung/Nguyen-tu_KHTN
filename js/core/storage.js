/**
 * Storage: Quản lý trạng thái, lưu trữ dữ liệu người dùng, lớp học & gamification
 * - Hỗ trợ tài khoản riêng cho Giáo viên với mật khẩu quản trị bảo mật
 * - Quản lý thêm/xóa lớp học và danh sách học sinh (nhập lẻ hoặc dán hàng loạt từ Excel)
 * - Cập nhật điểm số tự động từ các bài kiểm tra và game kéo co
 */

const STORAGE_KEYS = {
  CURRENT_USER: "atom_user",
  TEACHER_ACCOUNT: "atom_teacher_account",
  CLASS_ROSTER: "atom_class_roster",
  LEADERBOARD: "atom_leaderboard",
  SPACED_REPETITION: "atom_spaced_repetition",
  TEACHER_TESTS: "atom_teacher_tests",
  CLASS_STATS: "atom_class_stats",
  SETTINGS: "atom_settings"
};

const DEFAULT_BADGES = [
  {
    id: "first_step",
    title: "Nhà khoa học nhí",
    description: "Hoàn thành bài tập hoặc xem bài giảng đầu tiên",
    icon: "🌱",
    unlocked: false
  },
  {
    id: "atom_master",
    title: "Bậc thầy nguyên tử",
    description: "Đạt điểm tuyệt đối trong một bài kiểm tra kiến thức",
    icon: "👑",
    unlocked: false
  },
  {
    id: "tug_champion",
    title: "Chiến thần Kéo co",
    description: "Chiến thắng trận đối kháng Kéo co kiến thức",
    icon: "⚡",
    unlocked: false
  },
  {
    id: "shell_architect",
    title: "Kiến trúc sư vỏ Electron",
    description: "Kéo thả chính xác 100% các lớp vỏ electron",
    icon: "🪐",
    unlocked: false
  },
  {
    id: "explorer_20",
    title: "Nhà thám hiểm 20 nguyên tố",
    description: "Khám phá toàn bộ 20 nguyên tố đầu tiên trong bảng tuần hoàn",
    icon: "🔬",
    unlocked: false
  }
];

class AppStorage {
  constructor() {
    this._initData();
  }

  _initData() {
    // 1. Khởi tạo tài khoản Giáo viên mặc định nếu chưa có
    if (!localStorage.getItem(STORAGE_KEYS.TEACHER_ACCOUNT)) {
      const defaultTeacher = {
        username: "giaovien",
        password: "kntt2026", // Mật khẩu quản trị mặc định
        fullName: "Cô Hoàng Mai (Giáo viên KHTN)",
        school: "Trường THCS Kết Nối Tri Thức"
      };
      localStorage.setItem(STORAGE_KEYS.TEACHER_ACCOUNT, JSON.stringify(defaultTeacher));
    }

    // 2. Khởi tạo danh sách lớp & học sinh mẫu (Roster)
    if (!localStorage.getItem(STORAGE_KEYS.CLASS_ROSTER)) {
      const initialRoster = {
        "KHTN7A1": {
          code: "KHTN7A1",
          name: "Lớp 7A1",
          createdAt: new Date().toISOString(),
          students: [
            { id: "st_1", name: "Nguyễn Minh Triết", username: "MinhTriet_7A1", score: 2850, accuracy: 96, testScore: 10, status: "Đã hoàn thành" },
            { id: "st_2", name: "Trần Bảo Ngọc", username: "BaoNgoc_Quantum", score: 2640, accuracy: 92, testScore: 9.5, status: "Đã hoàn thành" },
            { id: "st_3", name: "Lê Quang Huy", username: "QuangHuy_Electron", score: 2420, accuracy: 88, testScore: 8.8, status: "Đã hoàn thành" },
            { id: "st_4", name: "Phạm Thanh Mai", username: "ThanhMai_Proton", score: 2310, accuracy: 85, testScore: 8.5, status: "Cần ôn tập amu" },
            { id: "st_5", name: "Hoàng Đức Anh", username: "DucAnh_Bohr", score: 2150, accuracy: 82, testScore: 7.8, status: "Cần ôn tập amu" },
            { id: "st_6", name: "Đỗ Hà Linh", username: "HaLinh_KNTT", score: 1980, accuracy: 80, testScore: 7.5, status: "Đã hoàn thành" }
          ]
        },
        "KHTN7A2": {
          code: "KHTN7A2",
          name: "Lớp 7A2",
          createdAt: new Date().toISOString(),
          students: [
            { id: "st_21", name: "Vũ Gia Bảo", username: "GiaBao_7A2", score: 2100, accuracy: 84, testScore: 8.0, status: "Đã hoàn thành" },
            { id: "st_22", name: "Nguyễn Ngọc Ánh", username: "NgocAnh_7A2", score: 1950, accuracy: 81, testScore: 7.5, status: "Cần ôn tập vỏ e" }
          ]
        },
        "KHTN7A3": {
          code: "KHTN7A3",
          name: "Lớp 7A3",
          createdAt: new Date().toISOString(),
          students: [
            { id: "st_31", name: "Phan Tuấn Kiệt", username: "TuanKiet_7A3", score: 2200, accuracy: 86, testScore: 8.5, status: "Đã hoàn thành" }
          ]
        }
      };
      localStorage.setItem(STORAGE_KEYS.CLASS_ROSTER, JSON.stringify(initialRoster));
    }

    // 3. Khởi tạo Bảng xếp hạng mẫu
    if (!localStorage.getItem(STORAGE_KEYS.LEADERBOARD)) {
      const initialLeaderboard = [
        { username: "MinhTriet_7A1", classCode: "KHTN7A1", score: 2850, accuracy: 96, speedAvg: "2.1s", badgeCount: 4, season: "Mùa 1" },
        { username: "BaoNgoc_Quantum", classCode: "KHTN7A1", score: 2640, accuracy: 92, speedAvg: "2.5s", badgeCount: 3, season: "Mùa 1" },
        { username: "QuangHuy_Electron", classCode: "KHTN7A2", score: 2420, accuracy: 88, speedAvg: "3.0s", badgeCount: 3, season: "Mùa 1" },
        { username: "ThanhMai_Proton", classCode: "KHTN7A3", score: 2310, accuracy: 85, speedAvg: "3.2s", badgeCount: 2, season: "Mùa 1" },
        { username: "DucAnh_Bohr", classCode: "KHTN7A2", score: 2150, accuracy: 82, speedAvg: "3.5s", badgeCount: 2, season: "Mùa 1" }
      ];
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(initialLeaderboard));
    }

    // 4. Khởi tạo Thống kê cho Giáo viên
    if (!localStorage.getItem(STORAGE_KEYS.CLASS_STATS)) {
      const initialStats = {
        classCode: "KHTN7A1",
        studentCount: 38,
        averageScore: 8.2,
        distribution: {
          excellent: 14, // 8.5 - 10
          good: 16,      // 7.0 - 8.4
          average: 6,    // 5.0 - 6.9
          weak: 2        // < 5.0
        },
        topicAccuracy: {
          concept: 94,
          nucleus: 88,
          shells: 71,
          mass_amu: 62,
          problem_solving: 58
        }
      };
      localStorage.setItem(STORAGE_KEYS.CLASS_STATS, JSON.stringify(initialStats));
    }
  }

  // ==================== XÁC THỰC GIÁO VIÊN & HỌC SINH ====================
  getCurrentUser() {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!data) return null;
    try {
      const user = JSON.parse(data);
      if (user && typeof user === "object") {
        if (!Array.isArray(user.exploredElements)) user.exploredElements = [];
        if (!Array.isArray(user.badges)) user.badges = [];
        if (!Array.isArray(user.history)) user.history = [];
      }
      return user;
    } catch (e) {
      return null;
    }
  }

  isTeacher() {
    const user = this.getCurrentUser();
    return user && user.role === "teacher";
  }

  getTeacherAccount() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.TEACHER_ACCOUNT));
    } catch (e) {
      return { username: "giaovien", password: "kntt2026" };
    }
  }

  loginTeacher(username, password) {
    const cleanUser = String(username || "").trim();
    const cleanPass = String(password || "").trim();

    // Mật khẩu xác thực giáo viên (hỗ trợ cả kntt2026 và 1234567)
    const savedTeacherPass = (this.getTeacherAccount() || {}).password || "kntt2026";
    if (cleanPass === "1234567" || cleanPass === "kntt2026" || cleanPass === savedTeacherPass) {
      const teacherName = cleanUser || "Giáo viên KHTN";
      const teacherUser = {
        username: teacherName,
        fullName: teacherName,
        role: "teacher",
        classCode: "ALL",
        score: 9999,
        level: 99,
        badges: DEFAULT_BADGES.map(b => ({ ...b, unlocked: true })),
        exploredElements: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        history: []
      };
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(teacherUser));
      return { success: true, user: teacherUser };
    }
    return { success: false, message: "Mật khẩu giáo viên không chính xác!" };
  }

  loginStudent(username, classCode) {
    const cleanUsername = username.trim();
    const cleanClassCode = classCode.trim().toUpperCase();

    const userKey = `atom_profile_${cleanClassCode}_${cleanUsername}`;
    let user;
    const savedProfile = localStorage.getItem(userKey);

    if (savedProfile) {
      user = JSON.parse(savedProfile);
    } else {
      user = {
        username: cleanUsername,
        classCode: cleanClassCode,
        role: "student",
        score: 100,
        level: 1,
        exp: 100,
        side: "proton",
        badges: DEFAULT_BADGES.map(b => ({ ...b })),
        history: [],
        exploredElements: [],
        createdDate: new Date().toISOString()
      };
    }

    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    this.saveUserProfile(user);

    // Đảm bảo học sinh có trong danh sách lớp của giáo viên
    this._ensureStudentInRoster(cleanClassCode, cleanUsername);

    return user;
  }

  saveUserProfile(user) {
    if (!user) return;
    const userKey = `atom_profile_${user.classCode}_${user.username}`;
    localStorage.setItem(userKey, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));

    if (user.role === "student") {
      this.updateLeaderboard(user);
    }
  }

  logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  // ==================== QUẢN LÝ LỚP HỌC (CLASSES) ====================
  getClassRosterMap() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CLASS_ROSTER)) || {};
    } catch (e) {
      return {};
    }
  }

  saveClassRosterMap(rosterMap) {
    localStorage.setItem(STORAGE_KEYS.CLASS_ROSTER, JSON.stringify(rosterMap));
  }

  getAllClasses() {
    const map = this.getClassRosterMap();
    return Object.values(map);
  }

  addClass(code, name) {
    const cleanCode = code.trim().toUpperCase();
    const cleanName = name.trim();
    if (!cleanCode || !cleanName) return { success: false, message: "Vui lòng nhập đầy đủ Mã lớp và Tên lớp!" };

    const map = this.getClassRosterMap();
    if (map[cleanCode]) {
      return { success: false, message: `Mã lớp ${cleanCode} đã tồn tại!` };
    }

    map[cleanCode] = {
      code: cleanCode,
      name: cleanName,
      createdAt: new Date().toISOString(),
      students: []
    };

    this.saveClassRosterMap(map);
    return { success: true, classItem: map[cleanCode] };
  }

  deleteClass(code) {
    const map = this.getClassRosterMap();
    if (!map[code]) return false;
    delete map[code];
    this.saveClassRosterMap(map);
    return true;
  }

  // ==================== QUẢN LÝ DANH SÁCH HỌC SINH (STUDENTS) ====================
  getStudentsByClass(classCode) {
    const map = this.getClassRosterMap();
    const classData = map[classCode];
    return classData ? classData.students : [];
  }

  addStudent(classCode, fullName, username = "") {
    const map = this.getClassRosterMap();
    if (!map[classCode]) return { success: false, message: "Lớp học không tồn tại!" };

    const cleanName = fullName.trim();
    if (!cleanName) return { success: false, message: "Vui lòng nhập tên học sinh!" };

    let cleanUsername = username.trim();
    if (!cleanUsername) {
      // Tự sinh username không dấu
      const normalized = cleanName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "");
      cleanUsername = `${normalized}_${classCode}`;
    }

    const newStudent = {
      id: `st_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: cleanName,
      username: cleanUsername,
      score: 100,
      accuracy: 0,
      testScore: "--",
      status: "Chưa làm bài"
    };

    map[classCode].students.push(newStudent);
    this.saveClassRosterMap(map);
    return { success: true, student: newStudent };
  }

  batchAddStudents(classCode, rawText) {
    const map = this.getClassRosterMap();
    if (!map[classCode]) return { success: false, count: 0, message: "Lớp học không tồn tại!" };

    const lines = rawText.split("\n");
    let addedCount = 0;

    lines.forEach(line => {
      let trimmed = line.trim();
      if (!trimmed) return;

      // Xóa số thứ tự đầu dòng (ví dụ "1. ", "1/ ", "1\t")
      trimmed = trimmed.replace(/^(\d+[\.\/\)\-\t\s]+)/, "").trim();
      if (!trimmed) return;

      // Tách tên nếu có tab phân cách (copy từ excel)
      const parts = trimmed.split("\t");
      const name = parts[0].trim();
      if (name.length < 2) return;

      const normalized = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "");
      const username = `${normalized}_${classCode}`;

      // Kiểm tra xem đã có học sinh này chưa
      const exists = map[classCode].students.some(s => s.username === username || s.name.toLowerCase() === name.toLowerCase());
      if (!exists) {
        map[classCode].students.push({
          id: `st_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
          name: name,
          username: username,
          score: 100,
          accuracy: 0,
          testScore: "--",
          status: "Mới thêm"
        });
        addedCount++;
      }
    });

    this.saveClassRosterMap(map);
    return { success: true, count: addedCount, message: `Đã thêm thành công ${addedCount} học sinh vào lớp ${classCode}!` };
  }

  deleteStudent(classCode, studentId) {
    const map = this.getClassRosterMap();
    if (!map[classCode]) return false;

    map[classCode].students = map[classCode].students.filter(s => s.id !== studentId);
    this.saveClassRosterMap(map);
    return true;
  }

  _ensureStudentInRoster(classCode, username) {
    const map = this.getClassRosterMap();
    if (!map[classCode]) {
      // Tự tạo lớp nếu chưa có
      map[classCode] = {
        code: classCode,
        name: `Lớp ${classCode}`,
        createdAt: new Date().toISOString(),
        students: []
      };
    }

    const exists = map[classCode].students.some(s => s.username === username);
    if (!exists) {
      map[classCode].students.push({
        id: `st_${Date.now()}`,
        name: username,
        username: username,
        score: 100,
        accuracy: 0,
        testScore: "--",
        status: "Đang tham gia"
      });
      this.saveClassRosterMap(map);
    }
  }

  updateStudentScore(username, classCode, scoreToAdd, accuracy = null) {
    const map = this.getClassRosterMap();
    if (!map[classCode]) return;

    const student = map[classCode].students.find(s => s.username === username);
    if (student) {
      student.score += scoreToAdd;
      if (accuracy !== null) {
        student.accuracy = accuracy;
      }
      student.status = "Đang hoạt động tích cực";
      this.saveClassRosterMap(map);
    }
  }

  // ==================== GAMIFICATION & BADGES ====================
  unlockBadge(badgeId) {
    const user = this.getCurrentUser();
    if (!user) return null;

    const badge = user.badges.find(b => b.id === badgeId);
    if (badge && !badge.unlocked) {
      badge.unlocked = true;
      user.exp += 150;
      user.score += 150;
      this.saveUserProfile(user);
      if (window.soundFX) window.soundFX.playBadgeUnlock();
      return badge;
    }
    return null;
  }

  updateLeaderboard(user) {
    try {
      let list = JSON.parse(localStorage.getItem(STORAGE_KEYS.LEADERBOARD) || "[]");
      const idx = list.findIndex(item => item.username === user.username && item.classCode === user.classCode);
      const unlockedBadges = (user.badges || []).filter(b => b.unlocked).length;

      const record = {
        username: user.username,
        classCode: user.classCode,
        score: user.score,
        accuracy: user.accuracy || 90,
        speedAvg: user.speedAvg || "2.8s",
        badgeCount: unlockedBadges,
        season: "Mùa 1"
      };

      if (idx >= 0) {
        list[idx] = { ...list[idx], ...record };
      } else {
        list.push(record);
      }

      list.sort((a, b) => b.score - a.score);
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(list));
    } catch (e) {
      console.error("Error updating leaderboard:", e);
    }
  }

  getLeaderboard() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.LEADERBOARD) || "[]");
    } catch (e) {
      return [];
    }
  }

  // ==================== SPACED REPETITION ====================
  getSpacedRepetitionData() {
    const user = this.getCurrentUser();
    if (!user) return { box1: [], box2: [], box3: [] };
    const key = `atom_sr_${user.classCode}_${user.username}`;
    try {
      return JSON.parse(localStorage.getItem(key)) || { box1: [], box2: [], box3: [] };
    } catch (e) {
      return { box1: [], box2: [], box3: [] };
    }
  }

  saveSpacedRepetitionData(data) {
    const user = this.getCurrentUser();
    if (!user) return;
    const key = `atom_sr_${user.classCode}_${user.username}`;
    localStorage.setItem(key, JSON.stringify(data));
  }

  getClassStats(classCode) {
    try {
      const stats = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLASS_STATS));
      return stats;
    } catch (e) {
      return null;
    }
  }
}

window.appStorage = new AppStorage();
window.DEFAULT_BADGES = DEFAULT_BADGES;
