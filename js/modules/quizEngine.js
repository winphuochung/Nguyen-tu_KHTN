/**
 * QuizEngine: Bộ luyện tập kiến thức đa tầng & Bài tập tương tác
 * Hỗ trợ các dạng:
 * 1. Luyện tập thích ứng AI (Adaptive Learning)
 * 2. 20 Bài tập Kéo thả hạt nguyên tử (20 nguyên tố đầu bảng tuần hoàn)
 * 3. 20 Bài tập Sơ đồ tư duy điền khuyết (Cấu tạo, điện tích, mô hình, khối lượng)
 * 4. 20 Bài toán tính toán khối lượng amu & xác định số hạt
 * 5. Sổ tay Lặp lại ngắt quãng (Spaced Repetition Notebook)
 */

class QuizEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.currentMode = "adaptive"; // 'adaptive', 'drag_drop', 'mindmap', 'problem_solving', 'spaced_rep'
    
    // Quản lý phiên thích ứng
    this.sessionQuestions = [];
    this.currentIndex = 0;
    this.userAnswers = [];
    this.sessionScore = 0;
    this.sessionStreak = 0;
    this.startTime = null;
    this.isAnswered = false;

    // Chỉ số câu cho 3 dạng bài tập (mỗi dạng 20 câu)
    this.dragIndex = 0;
    this.dragCompleted = {};
    this.mindmapIndex = 0;
    this.mindmapCompleted = {};
    this.problemIndex = 0;
    this.problemCompleted = {};

    // Bộ nhớ tạm cho tương tác kéo thả hạt (hỗ trợ đến 4 lớp)
    this.dragState = {
      p: 0,
      n: 0,
      shell1: 0,
      shell2: 0,
      shell3: 0,
      shell4: 0
    };
  }

  init() {
    this.renderHeaderNav();
    this.startAdaptiveSession();
  }

  renderHeaderNav() {
    const nav = document.getElementById("quiz-subnav");
    if (!nav) return;
    nav.innerHTML = `
      <div class="quiz-tabs">
        <button class="q-tab-btn active" id="tab-adaptive" onclick="window.quizEngine.switchMode('adaptive')">
          🧠 Luyện Tập Thích Ứng (AI)
        </button>
        <button class="q-tab-btn" id="tab-drag" onclick="window.quizEngine.switchMode('drag_drop')">
          🪐 Kéo Thả Hạt Nguyên Tử (20 Câu)
        </button>
        <button class="q-tab-btn" id="tab-mindmap" onclick="window.quizEngine.switchMode('mindmap')">
          🌲 Sơ Đồ Tư Duy Điền Khuyết (20 Câu)
        </button>
        <button class="q-tab-btn" id="tab-problem" onclick="window.quizEngine.switchMode('problem_solving')">
          🧮 Bài Toán Khối Lượng amu (20 Câu)
        </button>
        <button class="q-tab-btn" id="tab-sr" onclick="window.quizEngine.switchMode('spaced_rep')">
          📚 Sổ Tay Lặp Lại Ngắt Quãng
        </button>
      </div>
    `;
  }

  switchMode(mode) {
    this.currentMode = mode;
    document.querySelectorAll(".q-tab-btn").forEach(b => b.classList.remove("active"));
    const activeBtn = document.getElementById(`tab-${mode === 'spaced_rep' ? 'sr' : mode === 'drag_drop' ? 'drag' : mode === 'problem_solving' ? 'problem' : mode}`);
    if (activeBtn) activeBtn.classList.add("active");
    if (window.soundFX) window.soundFX.playClick();

    if (mode === "adaptive") {
      this.startAdaptiveSession();
    } else if (mode === "drag_drop") {
      this.startDragDropSession();
    } else if (mode === "mindmap") {
      this.startMindmapSession();
    } else if (mode === "problem_solving") {
      this.startProblemSolvingSession();
    } else if (mode === "spaced_rep") {
      this.renderSpacedRepetitionNotebook();
    }
  }

  // ==================== 1. LUYỆN TẬP THÍCH ỨNG (ADAPTIVE LEARNING) ====================
  startAdaptiveSession() {
    this.sessionQuestions = [];
    this.currentIndex = 0;
    this.sessionScore = 0;
    this.sessionStreak = 0;

    const user = window.appStorage.getCurrentUser();
    const theta = window.adaptiveEngine.getUserTheta(user);
    const firstLevel = window.adaptiveEngine.getNextDifficultyLevel(theta);

    this.loadNextAdaptiveQuestion(firstLevel);
  }

  loadNextAdaptiveQuestion(targetLevel) {
    const excludeIds = this.sessionQuestions.map(q => q.id);
    let nextQ = window.adaptiveEngine.selectAdaptiveQuestion(targetLevel, excludeIds);
    if (!nextQ || !nextQ.question) {
      const candidates = QUESTION_BANK.filter(q => q && q.question && (q.type === "mcq" || q.type === "short_answer"));
      nextQ = candidates[Math.floor(Math.random() * candidates.length)];
    }
    this.sessionQuestions.push(nextQ);
    this.currentIndex = this.sessionQuestions.length - 1;
    this.isAnswered = false;
    this.startTime = Date.now();
    this.renderCurrentQuestion();
  }

  renderCurrentQuestion() {
    let q = this.sessionQuestions[this.currentIndex];
    if (!q || !q.question) {
      const candidates = QUESTION_BANK.filter(item => item && item.question && (item.type === "mcq" || item.type === "short_answer"));
      q = candidates[0];
      this.sessionQuestions[this.currentIndex] = q;
    }

    const questionTitle = q.question || q.title || q.description || "Câu hỏi luyện tập trọng tâm:";
    let bodyHtml = "";

    if (q.type === "mcq" && q.options && q.options.length > 0) {
      bodyHtml = `
        <div class="quiz-options-container">
          ${q.options.map((opt, i) => `
            <button class="quiz-opt-btn" id="opt-btn-${i}" onclick="window.quizEngine.handleMCQAnswer(${i})">
              <span class="quiz-opt-letter">${["A", "B", "C", "D"][i]}</span>
              <span class="quiz-opt-text">${opt}</span>
            </button>
          `).join("")}
        </div>
      `;
    } else {
      bodyHtml = `
        <div class="quiz-input-box">
          <label class="input-label">${q.inputPrompt || "Nhập câu trả lời của bạn:"}</label>
          <div class="input-row">
            <input type="text" id="short-answer-input" placeholder="Ví dụ: 8 hoặc Carbon..." class="quiz-text-input" />
            <button class="btn-cosmic-glow" onclick="window.quizEngine.handleShortAnswer()">XÁC NHẬN</button>
          </div>
        </div>
      `;
    }

    this.container.innerHTML = `
      <div class="quiz-card">
        <div class="quiz-card-header">
          <div class="q-badge-row">
            <span class="level-pill ${q.level || 'TH'}">${q.level || 'TH'} • ${q.level === 'NB' ? 'Nhận biết' : q.level === 'VD' ? 'Vận dụng' : q.level === 'VDC' ? 'Vận dụng cao' : 'Thông hiểu'}</span>
            <span class="topic-pill">🔬 ${q.topicName || 'Cấu tạo nguyên tử'}</span>
            <span class="streak-pill">🔥 Combo: ${this.sessionStreak}</span>
          </div>
          <div class="score-display">Điểm: <strong>${this.sessionScore} XP</strong></div>
        </div>

        <div class="quiz-body">
          <h3 class="question-title">${questionTitle}</h3>
          ${bodyHtml}
          <div id="quiz-feedback-box" class="quiz-feedback" style="display: none;"></div>
        </div>

        <div class="quiz-card-footer">
          <span class="adaptive-hint">💡 Thuật toán AI tự động điều chỉnh câu hỏi tiếp theo theo năng lực của bạn</span>
          <button id="btn-next-q" class="btn-secondary" style="display: none;" onclick="window.quizEngine.proceedNextAdaptive()">
            CÂU TIẾP THEO ➔
          </button>
        </div>
      </div>
    `;
  }

  handleMCQAnswer(selectedIdx) {
    if (this.isAnswered) return;
    this.isAnswered = true;
    const responseTime = (Date.now() - this.startTime) / 1000;
    const q = this.sessionQuestions[this.currentIndex];
    const isCorrect = selectedIdx === q.correct;

    const selectedBtn = document.getElementById(`opt-btn-${selectedIdx}`);
    const correctBtn = document.getElementById(`opt-btn-${q.correct}`);

    if (isCorrect) {
      if (selectedBtn) selectedBtn.classList.add("correct");
      if (window.soundFX) window.soundFX.playCorrect();
      this.sessionStreak++;
    } else {
      if (selectedBtn) selectedBtn.classList.add("wrong");
      if (correctBtn) correctBtn.classList.add("correct");
      if (window.soundFX) window.soundFX.playWrong();
      this.sessionStreak = 0;
    }

    const points = window.adaptiveEngine.calculateScore(isCorrect, q.level, responseTime, this.sessionStreak);
    this.sessionScore += points;

    this.showFeedback(isCorrect, q.explanation, points, responseTime);
    this.updateUserProgress(q, isCorrect, responseTime);
  }

  handleShortAnswer() {
    if (this.isAnswered) return;
    const input = document.getElementById("short-answer-input");
    const val = input ? input.value.trim().toLowerCase() : "";
    if (!val) return;

    this.isAnswered = true;
    const responseTime = (Date.now() - this.startTime) / 1000;
    const q = this.sessionQuestions[this.currentIndex];

    let isCorrect = false;
    if (q.correctAnswer && String(q.correctAnswer).toLowerCase() === val) {
      isCorrect = true;
    } else if (q.acceptedAnswers && q.acceptedAnswers.map(a => String(a).toLowerCase()).includes(val)) {
      isCorrect = true;
    }

    if (isCorrect) {
      if (window.soundFX) window.soundFX.playCorrect();
      this.sessionStreak++;
    } else {
      if (window.soundFX) window.soundFX.playWrong();
      this.sessionStreak = 0;
    }

    const points = window.adaptiveEngine.calculateScore(isCorrect, q.level, responseTime, this.sessionStreak);
    this.sessionScore += points;

    this.showFeedback(isCorrect, q.explanation, points, responseTime);
    this.updateUserProgress(q, isCorrect, responseTime);
  }

  showFeedback(isCorrect, explanation, points, timeSec) {
    const box = document.getElementById("quiz-feedback-box");
    if (!box) return;
    box.style.display = "block";
    box.className = `quiz-feedback ${isCorrect ? 'fb-correct' : 'fb-wrong'}`;

    box.innerHTML = `
      <div class="fb-header">
        <span>${isCorrect ? '🎉 CHÍNH XÁC!' : '❌ CHƯA CHÍNH XÁC'}</span>
        <span class="fb-points">${isCorrect ? `+${points} XP (${timeSec.toFixed(1)}s)` : '0 XP'}</span>
      </div>
      <div class="fb-body">
        <strong>Giải thích chi tiết:</strong> ${explanation}
      </div>
    `;

    const nextBtn = document.getElementById("btn-next-q");
    if (nextBtn) {
      nextBtn.style.display = "inline-flex";
      nextBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  updateUserProgress(q, isCorrect, responseTime) {
    const user = window.appStorage.getCurrentUser();
    if (!user) return;

    user.history = user.history || [];
    user.history.push({
      questionId: q.id,
      level: q.level,
      topic: q.topic,
      isCorrect: isCorrect,
      time: responseTime,
      timestamp: Date.now()
    });

    if (isCorrect) {
      user.score = (user.score || 0) + 100;
      user.exp = (user.exp || 0) + 100;
    }
    if (user.history.length >= 1) {
      window.appStorage.unlockBadge("first_step");
    }
    window.appStorage.saveUserProfile(user);
  }

  proceedNextAdaptive() {
    const lastHist = (window.appStorage.getCurrentUser()?.history || []).slice(-1)[0];
    const lastCorrect = lastHist ? lastHist.isCorrect : true;
    const theta = window.adaptiveEngine.getUserTheta(window.appStorage.getCurrentUser());
    const nextLevel = window.adaptiveEngine.getNextDifficultyLevel(theta, lastCorrect);
    this.loadNextAdaptiveQuestion(nextLevel);
  }

  // ==================== 2. KÉO THẢ HẠT NGUYÊN TỬ (20 CÂU) ====================
  getDragDropList() {
    if (typeof DRAG_DROP_BANK !== 'undefined' && DRAG_DROP_BANK.length > 0) {
      return DRAG_DROP_BANK;
    }
    return QUESTION_BANK.filter(q => q.type === "drag_drop_particles");
  }

  nextDragQuestion() {
    const list = this.getDragDropList();
    if (this.dragIndex < list.length - 1) {
      this.dragIndex++;
      this.startDragDropSession();
      if (window.soundFX) window.soundFX.playClick();
    }
  }

  prevDragQuestion() {
    if (this.dragIndex > 0) {
      this.dragIndex--;
      this.startDragDropSession();
      if (window.soundFX) window.soundFX.playClick();
    }
  }

  jumpDragQuestion(idx) {
    this.dragIndex = idx;
    this.startDragDropSession();
    if (window.soundFX) window.soundFX.playClick();
  }

  startDragDropSession() {
    const list = this.getDragDropList();
    const total = list.length;
    if (this.dragIndex >= total) this.dragIndex = 0;
    const dragQ = list[this.dragIndex] || list[0];

    // Reset trạng thái hạt về 0
    this.dragState = { p: 0, n: 0, shell1: 0, shell2: 0, shell3: 0, shell4: 0 };

    const hasShell3 = dragQ.targetShell3 > 0;
    const hasShell4 = dragQ.targetShell4 > 0;

    this.container.innerHTML = `
      <!-- THANH ĐIỀU HƯỚNG 20 CÂU HỎI -->
      <div class="question-nav-container">
        <div class="q-nav-top-row">
          <div class="q-nav-counter">
            <span class="q-badge-current">🪐 KÉO THẢ HẠT NGUYÊN TỬ</span>
            <span>Câu <strong>${this.dragIndex + 1} / ${total}</strong></span>
          </div>
          <div class="q-nav-controls">
            <button class="q-nav-btn" onclick="window.quizEngine.prevDragQuestion()" ${this.dragIndex === 0 ? 'disabled' : ''}>
              ⬅ CÂU TRƯỚC
            </button>
            <button class="q-nav-btn btn-next-active" onclick="window.quizEngine.nextDragQuestion()" ${this.dragIndex === total - 1 ? 'disabled' : ''}>
              CÂU TIẾP THEO ➡
            </button>
          </div>
        </div>
        <div class="q-pills-row">
          ${list.map((item, i) => `
            <button class="q-pill ${i === this.dragIndex ? 'active' : ''} ${this.dragCompleted[i] ? 'completed' : ''}" 
                    title="${item.elementName}" 
                    onclick="window.quizEngine.jumpDragQuestion(${i})">
              ${i + 1}
            </button>
          `).join("")}
        </div>
      </div>

      <!-- WORKSPACE BÀI TẬP KÉO THẢ -->
      <div class="drag-quiz-wrapper">
        <div class="drag-header">
          <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.4rem;">
            <span class="level-pill ${dragQ.level}">${dragQ.level} • Thực Hành Mô Hình</span>
            <span class="topic-pill">Kí hiệu: <strong>${dragQ.elementSymbol}</strong></span>
          </div>
          <h2 class="drag-title">${dragQ.elementName}</h2>
          <p class="drag-instruction">${dragQ.instruction}</p>
        </div>

        <div class="drag-workspace">
          <!-- Hộp hạt dự trữ để nạp -->
          <div class="particles-supply">
            <h3>KHO HẠT CƠ BẢN</h3>
            <div class="supply-item" onclick="window.quizEngine.addParticle('p')">
              <div class="particle-orb proton-orb">p+</div>
              <div>
                <strong>Proton (+1)</strong>
                <span>Cần: ${dragQ.targetP} hạt</span>
              </div>
            </div>
            <div class="supply-item" onclick="window.quizEngine.addParticle('n')">
              <div class="particle-orb neutron-orb">n0</div>
              <div>
                <strong>Neutron (0)</strong>
                <span>Cần: ${dragQ.targetN} hạt</span>
              </div>
            </div>
            <div class="supply-item" onclick="window.quizEngine.addParticle('shell1')">
              <div class="particle-orb electron-orb">e-</div>
              <div>
                <strong>Electron (Lớp 1)</strong>
                <span>Cần: ${dragQ.targetShell1} e (Max 2)</span>
              </div>
            </div>
            <div class="supply-item" onclick="window.quizEngine.addParticle('shell2')">
              <div class="particle-orb electron-orb">e-</div>
              <div>
                <strong>Electron (Lớp 2)</strong>
                <span>Cần: ${dragQ.targetShell2} e (Max 8)</span>
              </div>
            </div>
            ${hasShell3 ? `
              <div class="supply-item" onclick="window.quizEngine.addParticle('shell3')">
                <div class="particle-orb electron-orb">e-</div>
                <div>
                  <strong>Electron (Lớp 3)</strong>
                  <span>Cần: ${dragQ.targetShell3} e (Max 8)</span>
                </div>
              </div>
            ` : ''}
            ${hasShell4 ? `
              <div class="supply-item" onclick="window.quizEngine.addParticle('shell4')">
                <div class="particle-orb electron-orb">e-</div>
                <div>
                  <strong>Electron (Lớp 4)</strong>
                  <span>Cần: ${dragQ.targetShell4} e (Max 2)</span>
                </div>
              </div>
            ` : ''}

            <div class="reset-supply">
              <button class="btn-secondary" onclick="window.quizEngine.resetDragState()">🔄 XÓA LÀM LẠI</button>
            </div>
          </div>

          <!-- Sơ đồ nguyên tử tương tác -->
          <div class="atom-drag-target">
            <div class="drag-rings">
              <!-- Vòng Lớp 2 -->
              <div class="drag-shell-ring ring-2" id="drop-shell2">
                <span class="ring-label">Lớp 2: <strong id="drag-count-s2">0</strong> / ${dragQ.targetShell2}</span>
                <div class="orbit-particles-container" id="s2-particles"></div>

                <!-- Vòng Lớp 1 -->
                <div class="drag-shell-ring ring-1" id="drop-shell1">
                  <span class="ring-label">Lớp 1: <strong id="drag-count-s1">0</strong> / ${dragQ.targetShell1}</span>
                  <div class="orbit-particles-container" id="s1-particles"></div>

                  <!-- Hạt nhân ở tâm -->
                  <div class="drag-nucleus" id="drop-nucleus">
                    <div class="nuc-title">HẠT NHÂN</div>
                    <div class="nuc-stats">
                      <span class="p-stat">p: <strong id="drag-count-p">0</strong> / ${dragQ.targetP}</span>
                      <span class="n-stat">n: <strong id="drag-count-n">0</strong> / ${dragQ.targetN}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="drag-actions">
              <button class="btn-cosmic-glow" onclick="window.quizEngine.verifyDragDrop('${dragQ.id}')">
                ✨ KIỂM TRA MÔ HÌNH NGUYÊN TỬ
              </button>
              <button class="btn-secondary" style="margin-left: 0.6rem;" onclick="window.quizEngine.nextDragQuestion()">
                CÂU TIẾP THEO ➔
              </button>
            </div>
          </div>
        </div>

        <div id="drag-feedback" class="quiz-feedback" style="display: none; margin-top: 1.5rem;"></div>
      </div>
    `;
  }

  addParticle(type) {
    if (type === "p") {
      this.dragState.p++;
    } else if (type === "n") {
      this.dragState.n++;
    } else if (type === "shell1") {
      if (this.dragState.shell1 >= 2) {
        alert("Lớp 1 chỉ chứa tối đa 2 electron theo quy tắc phân bố!");
        return;
      }
      this.dragState.shell1++;
    } else if (type === "shell2") {
      if (this.dragState.shell2 >= 8) {
        alert("Lớp 2 chỉ chứa tối đa 8 electron theo quy tắc phân bố!");
        return;
      }
      this.dragState.shell2++;
    } else if (type === "shell3") {
      if (this.dragState.shell3 >= 8) {
        alert("Lớp 3 chỉ chứa tối đa 8 electron theo quy tắc KHTN 7!");
        return;
      }
      this.dragState.shell3++;
    } else if (type === "shell4") {
      if (this.dragState.shell4 >= 2) {
        alert("Lớp 4 chỉ chứa tối đa 2 electron!");
        return;
      }
      this.dragState.shell4++;
    }

    if (window.soundFX) window.soundFX.playClick();
    this._updateDragCounters();
  }

  resetDragState() {
    this.dragState = { p: 0, n: 0, shell1: 0, shell2: 0, shell3: 0, shell4: 0 };
    this._updateDragCounters();
    const fb = document.getElementById("drag-feedback");
    if (fb) fb.style.display = "none";
  }

  _updateDragCounters() {
    const pEl = document.getElementById("drag-count-p");
    const nEl = document.getElementById("drag-count-n");
    const s1El = document.getElementById("drag-count-s1");
    const s2El = document.getElementById("drag-count-s2");

    if (pEl) pEl.textContent = this.dragState.p;
    if (nEl) nEl.textContent = this.dragState.n;
    if (s1El) s1El.textContent = this.dragState.shell1;
    if (s2El) s2El.textContent = this.dragState.shell2;
  }

  verifyDragDrop(qId) {
    const list = this.getDragDropList();
    const q = list.find(item => item.id === qId) || list[this.dragIndex];
    if (!q) return;

    const isPCorrect = this.dragState.p === q.targetP;
    const isNCorrect = this.dragState.n === q.targetN;
    const isS1Correct = this.dragState.shell1 === q.targetShell1;
    const isS2Correct = this.dragState.shell2 === q.targetShell2;
    const isS3Correct = (q.targetShell3 || 0) === this.dragState.shell3;
    const isS4Correct = (q.targetShell4 || 0) === this.dragState.shell4;

    const allCorrect = isPCorrect && isNCorrect && isS1Correct && isS2Correct && isS3Correct && isS4Correct;
    const fb = document.getElementById("drag-feedback");
    if (!fb) return;
    fb.style.display = "block";

    if (allCorrect) {
      this.dragCompleted[this.dragIndex] = true;
      fb.className = "quiz-feedback fb-correct";
      fb.innerHTML = `
        <div class="fb-header">🎉 CHÍNH XÁC HOÀN HẢO! (+150 XP)</div>
        <div class="fb-body">
          Bạn đã lắp ráp mô hình nguyên tử <strong>${q.elementName}</strong> hoàn toàn chính xác!
          <br>${q.explanation}
          <div style="margin-top: 0.8rem;">
            <button class="btn-cosmic-glow" onclick="window.quizEngine.nextDragQuestion()">
              TIẾP TỤC CÂU TIẾP THEO (${this.dragIndex + 2} / ${list.length}) ➔
            </button>
          </div>
        </div>
      `;
      if (window.soundFX) window.soundFX.playCorrect();
      window.appStorage.unlockBadge("shell_architect");
    } else {
      fb.className = "quiz-feedback fb-wrong";
      let errorMsg = [];
      if (!isPCorrect) errorMsg.push(`Proton cần ${q.targetP} hạt (hiện có ${this.dragState.p})`);
      if (!isNCorrect) errorMsg.push(`Neutron cần ${q.targetN} hạt (hiện có ${this.dragState.n})`);
      if (!isS1Correct) errorMsg.push(`Lớp 1 cần ${q.targetShell1} electron (hiện có ${this.dragState.shell1})`);
      if (!isS2Correct) errorMsg.push(`Lớp 2 cần ${q.targetShell2} electron (hiện có ${this.dragState.shell2})`);

      fb.innerHTML = `
        <div class="fb-header">⚠️ CẦN ĐIỀU CHỈNH LẠI:</div>
        <div class="fb-body">${errorMsg.join(" • ")}</div>
      `;
      if (window.soundFX) window.soundFX.playWrong();
    }
  }

  // ==================== 3. SƠ ĐỒ TƯ DUY ĐIỀN KHUYẾT (20 CÂU) ====================
  getMindmapList() {
    if (typeof MINDMAP_BANK !== 'undefined' && MINDMAP_BANK.length > 0) {
      return MINDMAP_BANK;
    }
    return [QUESTION_BANK.find(q => q.id === "q_mindmap_01") || QUESTION_BANK[12]];
  }

  nextMindmapQuestion() {
    const list = this.getMindmapList();
    if (this.mindmapIndex < list.length - 1) {
      this.mindmapIndex++;
      this.startMindmapSession();
      if (window.soundFX) window.soundFX.playClick();
    }
  }

  prevMindmapQuestion() {
    if (this.mindmapIndex > 0) {
      this.mindmapIndex--;
      this.startMindmapSession();
      if (window.soundFX) window.soundFX.playClick();
    }
  }

  jumpMindmapQuestion(idx) {
    this.mindmapIndex = idx;
    this.startMindmapSession();
    if (window.soundFX) window.soundFX.playClick();
  }

  startMindmapSession() {
    const list = this.getMindmapList();
    const total = list.length;
    if (this.mindmapIndex >= total) this.mindmapIndex = 0;
    const mapQ = list[this.mindmapIndex] || list[0];

    this.container.innerHTML = `
      <!-- THANH ĐIỀU HƯỚNG 20 CÂU HỎI -->
      <div class="question-nav-container">
        <div class="q-nav-top-row">
          <div class="q-nav-counter">
            <span class="q-badge-current">🌲 SƠ ĐỒ TƯ DUY ĐIỀN KHUYẾT</span>
            <span>Câu <strong>${this.mindmapIndex + 1} / ${total}</strong></span>
          </div>
          <div class="q-nav-controls">
            <button class="q-nav-btn" onclick="window.quizEngine.prevMindmapQuestion()" ${this.mindmapIndex === 0 ? 'disabled' : ''}>
              ⬅ CÂU TRƯỚC
            </button>
            <button class="q-nav-btn btn-next-active" onclick="window.quizEngine.nextMindmapQuestion()" ${this.mindmapIndex === total - 1 ? 'disabled' : ''}>
              CÂU TIẾP THEO ➡
            </button>
          </div>
        </div>
        <div class="q-pills-row">
          ${list.map((item, i) => `
            <button class="q-pill ${i === this.mindmapIndex ? 'active' : ''} ${this.mindmapCompleted[i] ? 'completed' : ''}" 
                    title="${item.title}" 
                    onclick="window.quizEngine.jumpMindmapQuestion(${i})">
              ${i + 1}
            </button>
          `).join("")}
        </div>
      </div>

      <!-- WORKSPACE SƠ ĐỒ TƯ DUY -->
      <div class="mindmap-wrapper">
        <div class="drag-header">
          <span class="level-pill TH">Thông Hiểu • Sơ Đồ Khái Niệm</span>
          <h2 class="drag-title">${mapQ.title}</h2>
          <p class="drag-instruction">${mapQ.description}</p>
        </div>

        <div class="mindmap-visual">
          <div class="map-root">
            <div class="root-node">⚛️ TRỌNG TÂM KIẾN THỨC</div>
            <div class="branch-connector"></div>

            <div class="map-branches" style="display: flex; flex-direction: column; gap: 1rem;">
              ${mapQ.slots.map((slot, sIdx) => `
                <div class="map-subbranch" style="background: rgba(255,255,255,0.03); padding: 0.9rem 1.2rem; border-radius: 8px; border: 1px solid rgba(0,242,254,0.2);">
                  <div class="slot-box">
                    <label style="font-weight: 700; color: var(--neon-cyan); display: block; margin-bottom: 0.4rem;">${slot.label}</label>
                    <select class="mindmap-select" id="mm-slot-${sIdx}" style="width: 100%; max-width: 420px; padding: 0.6rem; background: #0f172a; color: #ffffff; border: 1px solid #334155; border-radius: 6px;">
                      <option value="">-- Chọn đáp án chính xác --</option>
                      ${slot.options.map(opt => `<option value="${opt}">${opt}</option>`).join("")}
                    </select>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>

        <div class="drag-actions" style="margin-top: 1.8rem; display: flex; gap: 0.8rem; flex-wrap: wrap;">
          <button class="btn-cosmic-glow" onclick="window.quizEngine.verifyMindmap()">
            ✅ NỘP BÀI SƠ ĐỒ TƯ DUY
          </button>
          <button class="btn-secondary" onclick="window.quizEngine.nextMindmapQuestion()">
            CÂU TIẾP THEO ➔
          </button>
        </div>

        <div id="mindmap-feedback" class="quiz-feedback" style="display: none; margin-top: 1.5rem;"></div>
      </div>
    `;
  }

  verifyMindmap() {
    const list = this.getMindmapList();
    const mapQ = list[this.mindmapIndex] || list[0];
    let allCorrect = true;
    let wrongCount = 0;

    mapQ.slots.forEach((slot, sIdx) => {
      const selectEl = document.getElementById(`mm-slot-${sIdx}`);
      const val = selectEl ? selectEl.value : "";
      if (val !== slot.correctText) {
        allCorrect = false;
        wrongCount++;
      }
    });

    const fb = document.getElementById("mindmap-feedback");
    if (!fb) return;
    fb.style.display = "block";

    if (allCorrect) {
      this.mindmapCompleted[this.mindmapIndex] = true;
      fb.className = "quiz-feedback fb-correct";
      fb.innerHTML = `
        <div class="fb-header">🌟 TUYỆT VỜI! ĐIỀN ĐÚNG TOÀN BỘ SƠ ĐỒ TƯ DUY! (+120 XP)</div>
        <div class="fb-body">
          ${mapQ.explanation}
          <div style="margin-top: 0.8rem;">
            <button class="btn-cosmic-glow" onclick="window.quizEngine.nextMindmapQuestion()">
              TIẾP TỤC CÂU TIẾP THEO (${this.mindmapIndex + 2} / ${list.length}) ➔
            </button>
          </div>
        </div>
      `;
      if (window.soundFX) window.soundFX.playCorrect();
    } else {
      fb.className = "quiz-feedback fb-wrong";
      fb.innerHTML = `
        <div class="fb-header">❌ CÒN ${wrongCount} Ô CHƯA CHÍNH XÁC:</div>
        <div class="fb-body">
          ${mapQ.explanation}
        </div>
      `;
      if (window.soundFX) window.soundFX.playWrong();
    }
  }

  // ==================== 4. BÀI TOÁN KHỐI LƯỢNG AMU (20 CÂU) ====================
  getProblemList() {
    if (typeof PROBLEM_BANK !== 'undefined' && PROBLEM_BANK.length > 0) {
      return PROBLEM_BANK;
    }
    return [QUESTION_BANK.find(q => q.id === "q_vd_02") || QUESTION_BANK[10]];
  }

  nextProblemQuestion() {
    const list = this.getProblemList();
    if (this.problemIndex < list.length - 1) {
      this.problemIndex++;
      this.startProblemSolvingSession();
      if (window.soundFX) window.soundFX.playClick();
    }
  }

  prevProblemQuestion() {
    if (this.problemIndex > 0) {
      this.problemIndex--;
      this.startProblemSolvingSession();
      if (window.soundFX) window.soundFX.playClick();
    }
  }

  jumpProblemQuestion(idx) {
    this.problemIndex = idx;
    this.startProblemSolvingSession();
    if (window.soundFX) window.soundFX.playClick();
  }

  startProblemSolvingSession() {
    const list = this.getProblemList();
    const total = list.length;
    if (this.problemIndex >= total) this.problemIndex = 0;
    const probQ = list[this.problemIndex] || list[0];

    this.container.innerHTML = `
      <!-- THANH ĐIỀU HƯỚNG 20 CÂU HỎI -->
      <div class="question-nav-container">
        <div class="q-nav-top-row">
          <div class="q-nav-counter">
            <span class="q-badge-current">🧮 BÀI TOÁN KHỐI LƯỢNG AMU</span>
            <span>Câu <strong>${this.problemIndex + 1} / ${total}</strong></span>
          </div>
          <div class="q-nav-controls">
            <button class="q-nav-btn" onclick="window.quizEngine.prevProblemQuestion()" ${this.problemIndex === 0 ? 'disabled' : ''}>
              ⬅ CÂU TRƯỚC
            </button>
            <button class="q-nav-btn btn-next-active" onclick="window.quizEngine.nextProblemQuestion()" ${this.problemIndex === total - 1 ? 'disabled' : ''}>
              CÂU TIẾP THEO ➡
            </button>
          </div>
        </div>
        <div class="q-pills-row">
          ${list.map((item, i) => `
            <button class="q-pill ${i === this.problemIndex ? 'active' : ''} ${this.problemCompleted[i] ? 'completed' : ''}" 
                    title="${item.title}" 
                    onclick="window.quizEngine.jumpProblemQuestion(${i})">
              ${i + 1}
            </button>
          `).join("")}
        </div>
      </div>

      <!-- WORKSPACE BÀI TOÁN -->
      <div class="problem-wrapper">
        <div class="drag-header">
          <span class="level-pill VD">Vận Dụng • Tính Toán Hóa Học</span>
          <h2 class="drag-title">${probQ.title}</h2>
        </div>

        <div class="problem-body">
          <div class="problem-desc-card">
            <p class="problem-text" style="font-size: 1.05rem; line-height: 1.6; color: #f8fafc;">${probQ.question}</p>
          </div>

          <div class="problem-hints" style="margin: 1.2rem 0; background: rgba(0, 242, 254, 0.05); padding: 1rem; border-radius: 8px; border-left: 3px solid var(--neon-cyan);">
            <h4 style="color: var(--neon-cyan); margin-bottom: 0.5rem;">💡 Gợi ý phương pháp giải:</h4>
            <ul style="padding-left: 1.2rem; color: #cbd5e1; font-size: 0.9rem;">
              ${probQ.steps.map(s => `<li style="margin-bottom: 0.3rem;">${s}</li>`).join("")}
            </ul>
          </div>

          <div class="problem-solve-action">
            <label style="display: block; font-weight: 700; color: #cbd5e1; margin-bottom: 0.4rem;">${probQ.inputPrompt}</label>
            <div class="input-row" style="display: flex; gap: 0.6rem; flex-wrap: wrap;">
              <input type="text" id="prob-ans-input" class="quiz-text-input" placeholder="Nhập đáp án số..." style="flex: 1; min-width: 180px;" />
              <button class="btn-cosmic-glow" onclick="window.quizEngine.verifyProblemAnswer()">XÁC NHẬN KẾT QUẢ</button>
              <button class="btn-secondary" onclick="window.quizEngine.nextProblemQuestion()">CÂU TIẾP THEO ➔</button>
            </div>
          </div>

          <div id="prob-feedback" class="quiz-feedback" style="display: none; margin-top: 1.5rem;"></div>
        </div>
      </div>
    `;
  }

  verifyProblemAnswer() {
    const list = this.getProblemList();
    const probQ = list[this.problemIndex] || list[0];
    const input = document.getElementById("prob-ans-input");
    const val = input ? input.value.trim().toLowerCase() : "";
    const fb = document.getElementById("prob-feedback");
    if (!fb) return;
    fb.style.display = "block";

    const expected = String(probQ.correctAnswer).trim().toLowerCase();
    const isCorrect = (val === expected) || (val.replace(",", ".") === expected.replace(",", "."));

    if (isCorrect) {
      this.problemCompleted[this.problemIndex] = true;
      fb.className = "quiz-feedback fb-correct";
      fb.innerHTML = `
        <div class="fb-header">🎉 XUẤT SẮC! ĐÁP ÁN CHÍNH XÁC: ${probQ.correctAnswer}! (+150 XP)</div>
        <div class="fb-body">
          ${probQ.explanation}
          <div style="margin-top: 0.8rem;">
            <button class="btn-cosmic-glow" onclick="window.quizEngine.nextProblemQuestion()">
              TIẾP TỤC CÂU TIẾP THEO (${this.problemIndex + 2} / ${list.length}) ➔
            </button>
          </div>
        </div>
      `;
      if (window.soundFX) window.soundFX.playCorrect();
    } else {
      fb.className = "quiz-feedback fb-wrong";
      fb.innerHTML = `
        <div class="fb-header">❌ CHƯA CHÍNH XÁC</div>
        <div class="fb-body">
          Hãy đọc kĩ các bước gợi ý phía trên và thử lại nhé!
        </div>
      `;
      if (window.soundFX) window.soundFX.playWrong();
    }
  }

  // ==================== 5. SỔ TAY LẶP LẠI NGẮT QUÃNG ====================
  renderSpacedRepetitionNotebook() {
    const data = window.appStorage.getSpacedRepetitionData();
    const dueList = window.adaptiveEngine.getDueReviewQuestions();

    this.container.innerHTML = `
      <div class="sr-notebook-wrapper">
        <div class="sr-header">
          <div class="badge-tag">🧠 PHƯƠNG PHÁP HỌC TẬP THÔNG MINH</div>
          <h2 class="glow-title">SỔ TAY KHẮC PHỤC LỖ HỔNG KIẾN THỨC</h2>
          <p class="sr-desc">Áp dụng thuật toán Lặp lại ngắt quãng (Spaced Repetition). Những câu hỏi bạn từng trả lời sai sẽ được hệ thống xếp vào các Hộp Nhớ và nhắc lại đúng thời điểm vàng giúp ghi nhớ dài hạn vào vỏ não!</p>
        </div>

        <div class="sr-boxes-grid">
          <div class="sr-box-card box-1">
            <div class="box-icon">📦 HỘP 1</div>
            <div class="box-count">${data.box1.length} câu</div>
            <div class="box-interval">Ôn lại: 1 ngày / lần</div>
            <p>Các khái niệm vừa mới sai, cần củng cố ngay tức khắc.</p>
          </div>

          <div class="sr-box-card box-2">
            <div class="box-icon">📦 HỘP 2</div>
            <div class="box-count">${data.box2.length} câu</div>
            <div class="box-interval">Ôn lại: 3 ngày / lần</div>
            <p>Kiến thức đã nhớ tương đối vững, ôn lại để tránh quên.</p>
          </div>

          <div class="sr-box-card box-3">
            <div class="box-icon">📦 HỘP 3</div>
            <div class="box-count">${data.box3.length} câu</div>
            <div class="box-interval">Ôn lại: 7 ngày / lần</div>
            <p>Kiến thức đã trở thành trí nhớ dài hạn (Mastery).</p>
          </div>
        </div>

        <div class="sr-action-area">
          <div class="due-status">
            Hôm nay bạn có <strong>${dueList.length} câu hỏi</strong> cần ôn tập củng cố.
          </div>
          ${dueList.length > 0 ? `
            <button class="btn-cosmic-glow" onclick="window.quizEngine.startSpacedReviewSession()">
              🚀 BẮT ĐẦU ÔN TẬP NGAY (${dueList.length} CÂU)
            </button>
          ` : `
            <div class="all-done-msg">🎉 Tuyệt vời! Bạn không còn câu hỏi nào bị tồn đọng hôm nay! Hãy thử sức với game Kéo Co Kiến Thức nhé!</div>
          `}
        </div>
      </div>
    `;
  }

  startSpacedReviewSession() {
    const dueList = window.adaptiveEngine.getDueReviewQuestions();
    if (dueList.length === 0) return;

    this.sessionQuestions = dueList;
    this.currentIndex = 0;
    this.sessionScore = 0;
    this.sessionStreak = 0;
    this.isAnswered = false;
    this.startTime = Date.now();
    this.renderCurrentQuestion();
  }
}

window.QuizEngine = QuizEngine;