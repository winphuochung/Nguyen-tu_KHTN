/**
 * AdaptiveEngine: Thuật toán Học tập Thích ứng & Lặp lại Ngắt quãng (Spaced Repetition)
 * - Adaptive Learning: Tự động điều chỉnh độ khó (NB -> TH -> VD -> VDC) dựa trên tỷ lệ trả lời đúng và tốc độ
 * - Xáo trộn câu hỏi thông minh, chống gian lận
 * - Spaced Repetition: Mô hình Leitner 3 hộp (Hộp 1: Ôn sau 1 ngày, Hộp 2: Sau 3 ngày, Hộp 3: Sau 7 ngày)
 */

class AdaptiveEngine {
  constructor() {
    this.levels = ["NB", "TH", "VD", "VDC"];
    this.levelMultipliers = {
      "NB": 1.0,
      "TH": 1.3,
      "VD": 1.7,
      "VDC": 2.2
    };
  }

  /**
   * Tính năng lực người học hiện tại (Ability Theta: từ 0.0 đến 3.0)
   * @param {Object} user Hồ sơ người học
   * @returns {number} Chỉ số năng lực
   */
  getUserTheta(user) {
    if (!user || !user.history || user.history.length === 0) {
      return 1.0; // Mặc định ở mức TH (Thông hiểu)
    }

    const recent = user.history.slice(-10); // Xem 10 lần gần nhất
    let correctWeights = 0;
    let totalWeights = 0;

    recent.forEach(h => {
      const weight = this.levelMultipliers[h.level] || 1.0;
      totalWeights += weight;
      if (h.isCorrect) {
        correctWeights += weight;
      }
    });

    const ratio = totalWeights > 0 ? (correctWeights / totalWeights) : 0.5;
    // Chuyển sang thang từ 0.5 (NB) đến 2.8 (VDC)
    const theta = 0.5 + ratio * 2.3;
    return theta;
  }

  /**
   * Chọn cấp độ câu hỏi tiếp theo dựa trên năng lực và kết quả câu trước
   * @param {number} currentTheta Chỉ số năng lực
   * @param {boolean} lastCorrect Kết quả câu vừa làm (nếu có)
   * @returns {string} Cấp độ câu hỏi ('NB', 'TH', 'VD', 'VDC')
   */
  getNextDifficultyLevel(currentTheta, lastCorrect = null) {
    let targetIndex = 1; // Mặc định TH

    if (currentTheta < 1.0) targetIndex = 0; // NB
    else if (currentTheta < 1.8) targetIndex = 1; // TH
    else if (currentTheta < 2.4) targetIndex = 2; // VD
    else targetIndex = 3; // VDC

    // Tinh chỉnh thích ứng ngay lập tức
    if (lastCorrect === true && targetIndex < 3) {
      // Đúng -> có cơ hội thử thách lên 1 bậc
      if (Math.random() > 0.4) targetIndex = Math.min(3, targetIndex + 1);
    } else if (lastCorrect === false && targetIndex > 0) {
      // Sai -> giảm 1 bậc để củng cố nền tảng
      targetIndex = Math.max(0, targetIndex - 1);
    }

    return this.levels[targetIndex];
  }

  /**
   * Trích xuất câu hỏi thích ứng từ kho Big Data
   * Xáo trộn câu hỏi và các phương án trả lời để chống gian lận
   * @param {string} targetLevel Cấp độ mong muốn ('NB', 'TH', 'VD', 'VDC' hoặc 'ANY')
   * @param {Array} excludeIds Danh sách ID câu hỏi đã làm để tránh trùng lặp
   * @returns {Object} Câu hỏi đã được xáo trộn
   */
  selectAdaptiveQuestion(targetLevel = "ANY", excludeIds = []) {
    // Chỉ chọn các câu hỏi có nội dung văn bản câu hỏi hợp lệ (loại trừ dạng kéo thả hạt và mindmap chuyên biệt)
    let pool = QUESTION_BANK.filter(q => q && q.question && (q.type === "mcq" || q.type === "short_answer" || q.type === "problem_solving"));

    if (targetLevel !== "ANY") {
      const filtered = pool.filter(q => q.level === targetLevel);
      if (filtered.length > 0) {
        pool = filtered;
      }
    }

    // Lọc bỏ những câu đã làm trong phiên
    let available = pool.filter(q => !excludeIds.includes(q.id));
    if (available.length === 0) {
      available = pool; // Đã làm hết thì tái sử dụng
    }

    // Nếu pool rỗng vì lý do bất thường, fallback về bất kỳ câu nào có câu hỏi
    if (available.length === 0) {
      available = QUESTION_BANK.filter(q => q && q.question);
    }

    // Chọn ngẫu nhiên 1 câu
    const original = available[Math.floor(Math.random() * available.length)];
    // Clone sâu và xáo trộn các phương án trả lời (đối với câu trắc nghiệm MCQ)
    return this._shuffleQuestionOptions(JSON.parse(JSON.stringify(original)));
  }

  /**
   * Xáo trộn các phương án trả lời của câu hỏi trắc nghiệm mà vẫn giữ đúng đáp án
   */
  _shuffleQuestionOptions(question) {
    if (question.type !== "mcq" || !question.options) {
      return question;
    }

    const originalCorrectText = question.options[question.correct];
    // Thuật toán Fisher-Yates xáo trộn mảng phương án
    const shuffled = [...question.options];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    question.options = shuffled;
    question.correct = shuffled.indexOf(originalCorrectText);
    return question;
  }

  /**
   * Tính điểm số dựa trên độ chính xác, độ khó và tốc độ phản hồi
   * @param {boolean} isCorrect Đúng hay sai
   * @param {string} level Độ khó
   * @param {number} responseTimeSeconds Thời gian trả lời (giây)
   * @param {number} currentStreak Chuỗi trả lời đúng liên tiếp
   * @returns {number} Điểm nhận được
   */
  calculateScore(isCorrect, level, responseTimeSeconds, currentStreak = 0) {
    if (!isCorrect) return 0;

    const baseScore = 100;
    const levelFactor = this.levelMultipliers[level] || 1.0;
    
    // Thưởng tốc độ: trả lời dưới 5s được thưởng tối đa 50 điểm
    let speedBonus = 0;
    if (responseTimeSeconds < 5) {
      speedBonus = Math.round((5 - responseTimeSeconds) * 10);
    }

    // Thưởng streak liên tiếp
    const streakBonus = Math.min(100, currentStreak * 15);

    const total = Math.round(baseScore * levelFactor + speedBonus + streakBonus);
    return total;
  }

  // ==================== KỸ THUẬT LẶP LẠI NGẮT QUÃNG (SPACED REPETITION) ====================

  /**
   * Ghi nhận kết quả làm bài vào hệ thống Spaced Repetition (Leitner 3 Hộp)
   * @param {string} questionId ID câu hỏi
   * @param {boolean} isCorrect Đúng hay sai
   */
  recordSpacedRepetition(questionId, isCorrect) {
    const data = window.appStorage.getSpacedRepetitionData();
    const now = Date.now();

    // Tìm xem câu hỏi đang ở hộp nào
    let currentBox = null;
    let foundIndex = -1;

    for (let boxNum = 1; boxNum <= 3; boxNum++) {
      const boxKey = `box${boxNum}`;
      const idx = data[boxKey].findIndex(item => item.id === questionId);
      if (idx !== -1) {
        currentBox = boxNum;
        foundIndex = idx;
        break;
      }
    }

    if (isCorrect) {
      // Nếu đúng: Thăng hạng lên hộp cao hơn để ôn sau thời gian dài hơn
      if (currentBox !== null) {
        const item = data[`box${currentBox}`].splice(foundIndex, 1)[0];
        const nextBox = Math.min(3, currentBox + 1);
        item.lastReviewed = now;
        item.box = nextBox;
        // Hộp 1: 1 ngày (86400s), Hộp 2: 3 ngày (259200s), Hộp 3: 7 ngày (604800s)
        const intervalsDays = { 1: 1, 2: 3, 3: 7 };
        item.nextReviewDate = now + intervalsDays[nextBox] * 24 * 3600 * 1000;
        item.consecutiveCorrect = (item.consecutiveCorrect || 0) + 1;
        data[`box${nextBox}`].push(item);
      }
    } else {
      // Nếu sai: Rớt ngay về Hộp 1 (Ôn lại sau 1 ngày) để củng cố trí nhớ
      if (currentBox !== null) {
        const item = data[`box${currentBox}`].splice(foundIndex, 1)[0];
        item.lastReviewed = now;
        item.box = 1;
        item.nextReviewDate = now + 1 * 24 * 3600 * 1000;
        item.consecutiveCorrect = 0;
        item.failCount = (item.failCount || 0) + 1;
        data.box1.push(item);
      } else {
        // Lần đầu sai: Thêm vào Hộp 1
        const qInfo = QUESTION_BANK.find(q => q.id === questionId);
        data.box1.push({
          id: questionId,
          topic: qInfo ? qInfo.topic : "general",
          box: 1,
          lastReviewed: now,
          nextReviewDate: now + 1 * 24 * 3600 * 1000,
          consecutiveCorrect: 0,
          failCount: 1
        });
      }
    }

    window.appStorage.saveSpacedRepetitionData(data);
  }

  /**
   * Lấy danh sách các câu hỏi đã đến hạn cần ôn tập hôm nay
   */
  getDueReviewQuestions() {
    const data = window.appStorage.getSpacedRepetitionData();
    const now = Date.now();
    const dueList = [];

    [1, 2, 3].forEach(boxNum => {
      const boxKey = `box${boxNum}`;
      data[boxKey].forEach(item => {
        // Nếu đã quá hạn ôn tập hoặc là câu trong Hộp 1 chưa thành thạo
        if (item.nextReviewDate <= now || boxNum === 1) {
          const q = QUESTION_BANK.find(qb => qb.id === item.id);
          if (q) {
            dueList.push({
              ...q,
              srInfo: item
            });
          }
        }
      });
    });

    return dueList;
  }
}

window.adaptiveEngine = new AdaptiveEngine();
