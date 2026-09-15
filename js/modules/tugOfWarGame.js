/**
 * TugOfWarGame: Trò chơi "Kéo Co Kiến Thức" Real-Time PvP
 * - Đồ họa nhóm người kéo co hai bên chân thực, sinh động (Animated SVG Teams)
 * - Chế độ Đấu Online giữa 2 máy tính khác nhau qua WebRTC (PeerJS)
 * - Chế độ Đấu AI Bot & Chế độ 2 người cùng máy
 * - Hệ thống Power-ups chiến thuật: Khiên Hạt Nhân, Tia Sét Điện Tích, Sóng Xung Kích
 */

class TugOfWarGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.mode = "bot"; // 'bot', 'online', 'pvp2p'
    this.playerSide = "proton"; // 'proton' hoặc 'electron'
    this.botDifficulty = "normal"; // 'easy', 'normal', 'hard'

    // Trạng thái trực tuyến WebRTC PeerJS
    this.peer = null;
    this.peerConn = null;
    this.isHost = false;
    this.roomCode = "";
    this.onlineStatusText = "";

    // Trạng thái dây kéo: ropePosition từ -100 (Proton thắng) đến +100 (Electron thắng)
    this.ropePosition = 0;
    this.maxRope = 100;
    this.gameActive = false;
    this.timer = null;
    this.timeLeft = 60;

    // Chỉ số hai phe
    this.proton = {
      name: "Phe Proton (+)",
      score: 0,
      streak: 0,
      shieldActive: false,
      doublePowerActive: false,
      powerUps: { shield: 1, lightning: 1, shockwave: 1 }
    };

    this.electron = {
      name: "Phe Electron (-)",
      score: 0,
      streak: 0,
      shieldActive: false,
      doublePowerActive: false,
      powerUps: { shield: 1, lightning: 1, shockwave: 1 }
    };

    this.currentQuestions = {
      proton: null,
      electron: null
    };

    this.botTimer = null;
    this._initUI();
  }

  _initUI() {
    if (!this.container) return;
    this.renderLobby();
  }

  // ==================== SẢNH CHỜ (LOBBY) ====================
  renderLobby() {
    this.gameActive = false;
    if (this.timer) clearInterval(this.timer);
    if (this.botTimer) clearTimeout(this.botTimer);
    if (this.peerConn) {
      try { this.peerConn.close(); } catch(e) {}
      this.peerConn = null;
    }

    this.container.innerHTML = `
      <div class="tug-lobby">
        <div class="lobby-header">
          <div class="badge-tag">⚔️ ĐẤU TRƯỜNG ĐỐI KHÁNG THỜI GIAN THỰC</div>
          <h2 class="glow-title">KÉO CO NGUYÊN TỬ: PROTON VS ELECTRON</h2>
          <p class="lobby-desc">Thi đấu kéo co kiến thức cực đỉnh! Đồ họa hai đội kéo dây sinh động, trả lời đúng và dùng Power-ups để kéo đứt dây về phía mình. Hỗ trợ <strong>đấu Online giữa 2 máy tính khác nhau</strong>!</p>
        </div>

        <div class="lobby-setup-grid">
          <!-- 1. Chọn Phe -->
          <div class="setup-card">
            <h3 class="setup-title">1. Chọn Phe Đại Diện</h3>
            <div class="side-selector">
              <button class="side-btn proton-btn ${this.playerSide === 'proton' ? 'active' : ''}" id="btn-select-proton" onclick="window.tugGame.selectSide('proton')">
                <div class="side-icon">🔴</div>
                <div class="side-info">
                  <strong>PHE PROTON</strong>
                  <span>Điện tích +1 • Sức mạnh Hạt nhân</span>
                </div>
              </button>
              <button class="side-btn electron-btn ${this.playerSide === 'electron' ? 'active' : ''}" id="btn-select-electron" onclick="window.tugGame.selectSide('electron')">
                <div class="side-icon">🔵</div>
                <div class="side-info">
                  <strong>PHE ELECTRON</strong>
                  <span>Điện tích -1 • Tốc độ Lượng tử</span>
                </div>
              </button>
            </div>
          </div>

          <!-- 2. Chọn Chế Độ Chơi -->
          <div class="setup-card">
            <h3 class="setup-title">2. Chế Độ Thi Đấu</h3>
            <div class="mode-selector">
              <button class="mode-btn ${this.mode === 'online' ? 'active' : ''}" id="mode-online" onclick="window.tugGame.selectMode('online')">
                🌐 Đấu Online Giữa Các Máy Tính (Mã Phòng)
              </button>
              <button class="mode-btn ${this.mode === 'bot' ? 'active' : ''}" id="mode-bot" onclick="window.tugGame.selectMode('bot')">
                🤖 Đấu Với AI Bot Siêu Cấp
              </button>
              <button class="mode-btn ${this.mode === 'pvp2p' ? 'active' : ''}" id="mode-pvp" onclick="window.tugGame.selectMode('pvp2p')">
                👥 2 Người Cùng Máy (Split Screen)
              </button>
            </div>

            <!-- Tùy chọn cho Online Mode -->
            <div id="online-setup-box" class="online-box" style="display: ${this.mode === 'online' ? 'block' : 'none'};">
              <div class="online-tabs-row">
                <button class="online-sub-btn active" id="btn-tab-host" onclick="window.tugGame.switchOnlineTab('host')">👑 Tạo Phòng Mới (Host)</button>
                <button class="online-sub-btn" id="btn-tab-join" onclick="window.tugGame.switchOnlineTab('join')">🚀 Tham Gia Phòng (Join)</button>
              </div>

              <!-- Tab Host -->
              <div id="online-host-pane" class="online-pane">
                <p class="online-hint">Tạo phòng và gửi Mã Phòng cho bạn ở máy tính khác để vào thi đấu:</p>
                <div class="room-code-display">
                  <span class="room-label">MÃ PHÒNG:</span>
                  <strong id="display-host-code" class="code-val">Đang tạo...</strong>
                  <button class="btn-copy-code" onclick="window.tugGame.copyRoomCode()">📋 Sao chép</button>
                </div>
                <div class="online-waiting-status" id="host-status-msg">
                  <div class="pulsing-radar"></div>
                  <span>Đang đợi đối thủ ở máy tính khác nhập mã phòng...</span>
                </div>
              </div>

              <!-- Tab Join -->
              <div id="online-join-pane" class="online-pane" style="display: none;">
                <p class="online-hint">Nhập Mã Phòng từ máy tính của bạn bạn:</p>
                <div class="room-input-row">
                  <input type="text" id="input-join-code" placeholder="Ví dụ: ATOM-7A1-88" class="dash-input" style="text-transform: uppercase;" />
                  <button class="btn-cosmic-glow" style="padding: 0.6rem 1.2rem;" onclick="window.tugGame.joinOnlineRoom()">
                    KẾT NỐI NGAY ⚡
                  </button>
                </div>
                <div id="join-status-msg" style="font-size: 0.85rem; margin-top: 0.5rem; color: #cbd5e1;"></div>
              </div>
            </div>

            <!-- Tùy chọn cho Bot Mode -->
            <div id="bot-difficulty-wrap" class="bot-diff-wrap" style="display: ${this.mode === 'bot' ? 'block' : 'none'};">
              <label>Cấp độ AI Bot:</label>
              <div class="diff-options">
                <button class="diff-btn ${this.botDifficulty === 'easy' ? 'active' : ''}" onclick="window.tugGame.setBotDiff('easy', this)">Hạt Cơ Bản (Dễ)</button>
                <button class="diff-btn ${this.botDifficulty === 'normal' ? 'active' : ''}" onclick="window.tugGame.setBotDiff('normal', this)">Hạt Nhân (Vừa)</button>
                <button class="diff-btn ${this.botDifficulty === 'hard' ? 'active' : ''}" onclick="window.tugGame.setBotDiff('hard', this)">Lượng Tử (Khó)</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Trưng bày Power-ups -->
        <div class="powerup-showcase">
          <div class="powerup-chip">
            <span class="p-icon">🛡️</span>
            <div><strong>Khiên Hạt Nhân:</strong> Bảo vệ điểm số và năng lượng dây khi trả lời sai câu kế tiếp.</div>
          </div>
          <div class="powerup-chip">
            <span class="p-icon">⚡</span>
            <div><strong>Tia Sét Điện Tích:</strong> x2 lực kéo khi trả lời đúng câu hỏi tiếp theo!</div>
          </div>
          <div class="powerup-chip">
            <span class="p-icon">🌀</span>
            <div><strong>Sóng Xung Kích:</strong> Đẩy lùi đối thủ tức thì 15% lực kéo về phía đội mình.</div>
          </div>
        </div>

        <div class="start-action-wrap" id="start-btn-container">
          <button class="btn-cosmic-glow start-battle-btn" onclick="window.tugGame.startGame()">
            🔥 VÀO TRẬN QUYẾT ĐẤU (60 GIÂY)
          </button>
        </div>
      </div>
    `;

    if (this.mode === "online") {
      this.initHostRoom();
    }
  }

  selectSide(side) {
    this.playerSide = side;
    document.querySelectorAll(".side-btn").forEach(b => b.classList.remove("active"));
    const activeBtn = document.getElementById(`btn-select-${side}`);
    if (activeBtn) activeBtn.classList.add("active");
    if (window.soundFX) window.soundFX.playClick();
  }

  selectMode(mode) {
    this.mode = mode;
    document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
    const activeBtn = document.getElementById(mode === "online" ? "mode-online" : mode === "bot" ? "mode-bot" : "mode-pvp");
    if (activeBtn) activeBtn.classList.add("active");

    const onlineBox = document.getElementById("online-setup-box");
    const botWrap = document.getElementById("bot-difficulty-wrap");
    const startWrap = document.getElementById("start-btn-container");

    if (onlineBox) onlineBox.style.display = mode === "online" ? "block" : "none";
    if (botWrap) botWrap.style.display = mode === "bot" ? "block" : "none";
    if (startWrap) startWrap.style.display = mode === "online" ? "none" : "block";

    if (mode === "online") {
      this.initHostRoom();
    }
    if (window.soundFX) window.soundFX.playClick();
  }

  setBotDiff(diff, btn) {
    this.botDifficulty = diff;
    document.querySelectorAll(".diff-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    if (window.soundFX) window.soundFX.playClick();
  }

  // ==================== CƠ CHẾ ONLINE MULTIPLAYER (WEBRTC / PEERJS) ====================
  switchOnlineTab(tab) {
    document.getElementById("btn-tab-host").classList.toggle("active", tab === "host");
    document.getElementById("btn-tab-join").classList.toggle("active", tab === "join");
    document.getElementById("online-host-pane").style.display = tab === "host" ? "block" : "none";
    document.getElementById("online-join-pane").style.display = tab === "join" ? "block" : "none";
    if (window.soundFX) window.soundFX.playClick();

    if (tab === "host") {
      this.initHostRoom();
    }
  }

  initHostRoom() {
    this.isHost = true;
    const randId = Math.floor(1000 + Math.random() * 9000);
    const user = window.appStorage.getCurrentUser();
    const classTag = (user && user.classCode) ? user.classCode.replace(/[^A-Z0-9]/gi, '') : "7A1";
    this.roomCode = `ATOM-${classTag}-${randId}`;

    const codeEl = document.getElementById("display-host-code");
    if (codeEl) codeEl.textContent = this.roomCode;

    // Khởi tạo PeerJS kết nối WebRTC
    const peerId = `atom-room-${this.roomCode.toLowerCase()}`;
    if (window.Peer) {
      try {
        if (this.peer) this.peer.destroy();
        this.peer = new window.Peer(peerId);

        this.peer.on("open", (id) => {
          const status = document.getElementById("host-status-msg");
          if (status) status.innerHTML = `<span style="color:#00ff87;">✅ Phòng đã sẵn sàng! Chờ bạn máy khác nhập mã <strong>${this.roomCode}</strong>...</span>`;
        });

        this.peer.on("connection", (conn) => {
          this.peerConn = conn;
          this._setupPeerConnectionListeners();
          // Báo cho đối thủ biết game bắt đầu
          setTimeout(() => {
            this.peerConn.send({ type: "START_GAME", hostSide: this.playerSide });
            this.startGame();
          }, 600);
        });

        this.peer.on("error", (err) => {
          console.warn("PeerJS warning:", err);
        });
      } catch (e) {
        console.error("PeerJS init error:", e);
      }
    }
  }

  copyRoomCode() {
    if (!this.roomCode) return;
    navigator.clipboard.writeText(this.roomCode).then(() => {
      alert(`Đã sao chép Mã Phòng: ${this.roomCode}\nHãy gửi mã này cho bạn ở máy tính khác!`);
      if (window.soundFX) window.soundFX.playCorrect();
    }).catch(() => {
      prompt("Mã phòng của bạn là (nhấn Ctrl+C để sao chép):", this.roomCode);
    });
  }

  joinOnlineRoom() {
    const input = document.getElementById("input-join-code");
    if (!input || !input.value.trim()) {
      alert("Vui lòng nhập Mã Phòng thi đấu!");
      return;
    }

    const code = input.value.trim().toUpperCase();
    const statusMsg = document.getElementById("join-status-msg");
    if (statusMsg) statusMsg.innerHTML = "⏳ Đang kết nối tới máy đối thủ qua WebRTC...";

    const targetPeerId = `atom-room-${code.toLowerCase()}`;
    this.isHost = false;

    if (!window.Peer) {
      alert("Trình duyệt chưa tải được thư viện WebRTC. Vui lòng kiểm tra kết nối mạng!");
      return;
    }

    try {
      if (this.peer) this.peer.destroy();
      this.peer = new window.Peer();

      this.peer.on("open", () => {
        this.peerConn = this.peer.connect(targetPeerId);
        this._setupPeerConnectionListeners();

        this.peerConn.on("open", () => {
          if (statusMsg) statusMsg.innerHTML = "<span style='color:#00ff87;'>✅ Đã kết nối thành công! Đang vào trận...</span>";
          if (window.soundFX) window.soundFX.playVictory();
        });
      });

      this.peer.on("error", (err) => {
        if (statusMsg) statusMsg.innerHTML = `<span style='color:#f43f5e;'>❌ Không tìm thấy phòng hoặc mã phòng sai: ${err.type}</span>`;
      });
    } catch (e) {
      if (statusMsg) statusMsg.innerHTML = `<span style='color:#f43f5e;'>❌ Lỗi kết nối: ${e.message}</span>`;
    }
  }

  _setupPeerConnectionListeners() {
    if (!this.peerConn) return;

    this.peerConn.on("data", (data) => {
      if (!data) return;

      if (data.type === "START_GAME") {
        // Đối thủ là host, mình tự động chọn phe ngược lại
        this.playerSide = data.hostSide === "proton" ? "electron" : "proton";
        this.startGame();
      } else if (data.type === "ANSWER_RESULT") {
        // Đồng bộ kết quả trả lời của đối thủ
        this._applyOpponentAnswer(data.side, data.isCorrect, data.pullPower);
      } else if (data.type === "USE_POWERUP") {
        // Đồng bộ khi đối thủ dùng powerup
        this._applyOpponentPowerup(data.side, data.powerType);
      } else if (data.type === "SYNC_ROPE") {
        this.ropePosition = data.ropePosition;
        this._updateRopeVisual();
      }
    });

    this.peerConn.on("close", () => {
      if (this.gameActive) {
        alert("Đối thủ đã ngắt kết nối!");
        this.endGame("Đối thủ rời trận!");
      }
    });
  }

  // ==================== BẮT ĐẦU VÀO TRẬN (BATTLE) ====================
  startGame() {
    this.gameActive = true;
    this.ropePosition = 0;
    this.timeLeft = 60;

    const user = window.appStorage.getCurrentUser();
    const myName = user ? user.username : "Người chơi";

    if (this.mode === "online") {
      this.proton = {
        name: this.playerSide === "proton" ? myName : "Đối thủ Online",
        score: 0,
        streak: 0,
        shieldActive: false,
        doublePowerActive: false,
        powerUps: { shield: 1, lightning: 1, shockwave: 1 }
      };
      this.electron = {
        name: this.playerSide === "electron" ? myName : "Đối thủ Online",
        score: 0,
        streak: 0,
        shieldActive: false,
        doublePowerActive: false,
        powerUps: { shield: 1, lightning: 1, shockwave: 1 }
      };
    } else if (this.mode === "bot") {
      this.proton = {
        name: this.playerSide === "proton" ? myName : `AI Bot (${this.botDifficulty})`,
        score: 0,
        streak: 0,
        shieldActive: false,
        doublePowerActive: false,
        powerUps: { shield: 1, lightning: 1, shockwave: 1 }
      };
      this.electron = {
        name: this.playerSide === "electron" ? myName : `AI Bot (${this.botDifficulty})`,
        score: 0,
        streak: 0,
        shieldActive: false,
        doublePowerActive: false,
        powerUps: { shield: 1, lightning: 1, shockwave: 1 }
      };
    } else {
      // 2 Người cùng máy
      this.proton = {
        name: "Phe Proton (+)",
        score: 0,
        streak: 0,
        shieldActive: false,
        doublePowerActive: false,
        powerUps: { shield: 1, lightning: 1, shockwave: 1 }
      };
      this.electron = {
        name: "Phe Electron (-)",
        score: 0,
        streak: 0,
        shieldActive: false,
        doublePowerActive: false,
        powerUps: { shield: 1, lightning: 1, shockwave: 1 }
      };
    }

    if (window.soundFX) window.soundFX.playLightning();
    this.renderBattleArena();

    this._nextQuestion("proton");
    this._nextQuestion("electron");

    // Đếm ngược 60s
    this.timer = setInterval(() => {
      this.timeLeft--;
      const timeEl = document.getElementById("arena-timer-value");
      if (timeEl) timeEl.textContent = `${this.timeLeft}s`;

      if (this.timeLeft <= 0) {
        this.endGame("Hết thời gian thi đấu!");
      }
    }, 1000);

    // Kích hoạt AI Bot nếu chế độ Bot
    if (this.mode === "bot") {
      const botSide = this.playerSide === "proton" ? "electron" : "proton";
      this._scheduleBotAnswer(botSide);
    }
  }

  // ==================== VẼ SÂN KHẤU KÉO CO SINH ĐỘNG ====================
  renderBattleArena() {
    const isSingleFocus = (this.mode === "bot" || this.mode === "online");
    const mySide = this.playerSide;
    const oppSide = mySide === "proton" ? "electron" : "proton";

    this.container.innerHTML = `
      <div class="battle-arena">
        <!-- Header thông tin hai bên -->
        <div class="arena-header">
          <div class="team-badge proton-tag">🔴 ${this.proton.name}: <span id="p-score">0</span> XP</div>
          <div class="arena-timer" id="arena-timer-value">${this.timeLeft}s</div>
          <div class="team-badge electron-tag">🔵 ${this.electron.name}: <span id="e-score">0</span> XP</div>
        </div>

        <!-- SÂN KHẤU KÉO CO VỚI ĐỒ HỌA NHÓM NGƯỜI SỐNG ĐỘNG -->
        <div class="vivid-tug-stage" id="tug-vivid-stage">
          <div class="stage-field-lines">
            <span class="field-mark mark-left">🔴 VẠCH THẮNG PROTON</span>
            <span class="field-mark mark-center">⚡ VẠCH TÂM SÂN</span>
            <span class="field-mark mark-right">🔵 VẠCH THẮNG ELECTRON</span>
          </div>

          <!-- KHUNG HỌA HÌNH SVG HAI NHÓM NGƯỜI KÉO DÂY -->
          <div class="tug-scene-container" id="tug-scene-wrap">
            <svg id="tug-svg" viewBox="0 0 1000 240" class="tug-svg-canvas">
              <defs>
                <!-- Gradient Dây Thừng Năng Lượng -->
                <linearGradient id="ropeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stop-color="#ff007a" />
                  <stop offset="50%" stop-color="#ffffff" />
                  <stop offset="100%" stop-color="#00f2fe" />
                </linearGradient>

                <!-- Glow phát sáng hào quang -->
                <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <!-- Mặt sàn năng lượng trường hạt nhân -->
              <line x1="20" y1="215" x2="980" y2="215" stroke="rgba(255,255,255,0.18)" stroke-width="3" stroke-dasharray="8 6" />
              <line x1="500" y1="20" x2="500" y2="225" stroke="rgba(250,204,21,0.4)" stroke-width="2" stroke-dasharray="6 4" />

              <!-- SỢI DÂY KÉO THỪNG NỐI HAI ĐỘI -->
              <path id="svg-rope-path" d="M 230 148 Q 500 152 770 148" stroke="url(#ropeGrad)" stroke-width="12" fill="none" stroke-linecap="round" filter="url(#neonGlow)" />

              <!-- CỜ TÂM VÀ KHỐI NĂNG LƯỢNG TRUNG TÂM -->
              <g id="svg-center-knot" transform="translate(500, 150)">
                <circle cx="0" cy="0" r="18" fill="#ffffff" filter="url(#neonGlow)" />
                <circle cx="0" cy="0" r="11" fill="#facc15" />
                <text x="0" y="5" font-size="14" font-weight="bold" fill="#000" text-anchor="middle">⚡</text>
                <!-- Cờ đỏ rủ xuống vạch sân -->
                <polygon points="-6,15 6,15 0,38" fill="#ef4444" />
              </g>

              <!-- NHÓM 1: PHE PROTON (BÊN TRÁI - ĐỎ NEON) -->
              <g id="team-proton-group" class="team-group pulling" transform="translate(0, 0)">
                <!-- Hào quang Aura khi bứt tốc -->
                <ellipse cx="140" cy="190" rx="90" ry="18" fill="rgba(255, 0, 122, 0.18)" />

                <!-- Người 3: Neo đuôi (Cầu thủ to khỏe gồng mình) -->
                <g class="char-proton char-p3" transform="translate(45, 75)">
                  <!-- Chân trụ sau -->
                  <path d="M 35 70 L 15 130" stroke="#f43f5e" stroke-width="10" stroke-linecap="round" />
                  <path d="M 45 70 L 40 130" stroke="#f43f5e" stroke-width="10" stroke-linecap="round" />
                  <!-- Thân ngả 45 độ về sau -->
                  <path d="M 40 70 L 60 25" stroke="#f43f5e" stroke-width="20" stroke-linecap="round" />
                  <!-- Đầu -->
                  <circle cx="68" cy="12" r="14" fill="#f87171" />
                  <!-- Băng đô Proton -->
                  <rect x="54" y="8" width="28" height="6" fill="#ff007a" rx="2" />
                  <!-- Tay nắm chặt dây -->
                  <path d="M 50 38 L 85 70" stroke="#fca5a5" stroke-width="8" stroke-linecap="round" />
                  <text x="50" y="42" font-size="9" fill="#fff" font-weight="bold">+1</text>
                </g>

                <!-- Người 2: Đồng đội giữa (Gồng hết sức) -->
                <g class="char-proton char-p2" transform="translate(110, 78)">
                  <path d="M 35 68 L 12 128" stroke="#f43f5e" stroke-width="10" stroke-linecap="round" />
                  <path d="M 45 68 L 38 128" stroke="#f43f5e" stroke-width="10" stroke-linecap="round" />
                  <path d="M 40 68 L 62 25" stroke="#f43f5e" stroke-width="18" stroke-linecap="round" />
                  <circle cx="68" cy="12" r="14" fill="#f87171" />
                  <path d="M 50 38 L 88 70" stroke="#fca5a5" stroke-width="8" stroke-linecap="round" />
                  <text x="50" y="42" font-size="9" fill="#fff" font-weight="bold">+1</text>
                </g>

                <!-- Người 1: Đội trưởng dẫn đầu (Hô hào, dồn toàn lực) -->
                <g class="char-proton char-p1" transform="translate(175, 75)">
                  <path d="M 38 70 L 10 130" stroke="#ff007a" stroke-width="11" stroke-linecap="round" />
                  <path d="M 48 70 L 42 130" stroke="#ff007a" stroke-width="11" stroke-linecap="round" />
                  <!-- Thân ngả sâu tạo thế đòn bẩy -->
                  <path d="M 42 70 L 68 22" stroke="#ff007a" stroke-width="22" stroke-linecap="round" />
                  <circle cx="76" cy="8" r="15" fill="#fca5a5" />
                  <!-- Mũ chiến binh nguyên tử -->
                  <path d="M 64 2 Q 76 -8 88 2 Z" fill="#ff007a" />
                  <!-- Hai tay ghì chặt dây -->
                  <path d="M 52 35 L 90 70" stroke="#fca5a5" stroke-width="9" stroke-linecap="round" />
                  <path d="M 58 40 L 98 70" stroke="#fca5a5" stroke-width="9" stroke-linecap="round" />
                  <text x="52" y="38" font-size="10" fill="#fff" font-weight="bold">p+</text>
                </g>
              </g>

              <!-- NHÓM 2: PHE ELECTRON (BÊN PHẢI - XANH NEON) -->
              <g id="team-electron-group" class="team-group pulling" transform="translate(0, 0)">
                <ellipse cx="860" cy="190" rx="90" ry="18" fill="rgba(0, 242, 254, 0.18)" />

                <!-- Người 1: Đội trưởng dẫn đầu Electron -->
                <g class="char-electron char-e1" transform="translate(735, 75)">
                  <!-- Chân cắm vững đất -->
                  <path d="M 42 70 L 70 130" stroke="#00f2fe" stroke-width="11" stroke-linecap="round" />
                  <path d="M 32 70 L 38 130" stroke="#00f2fe" stroke-width="11" stroke-linecap="round" />
                  <!-- Thân ngả sang phải 45 độ -->
                  <path d="M 38 70 L 12 22" stroke="#00f2fe" stroke-width="22" stroke-linecap="round" />
                  <circle cx="4" cy="8" r="15" fill="#93c5fd" />
                  <path d="M -8 2 Q 4 -8 16 2 Z" fill="#0284c7" />
                  <!-- Tay bám chặt dây kéo ngược lại -->
                  <path d="M 28 35 L -10 70" stroke="#bfdbfe" stroke-width="9" stroke-linecap="round" />
                  <path d="M 22 40 L -18 70" stroke="#bfdbfe" stroke-width="9" stroke-linecap="round" />
                  <text x="24" y="38" font-size="10" fill="#000" font-weight="bold">e-</text>
                </g>

                <!-- Người 2: Đồng đội giữa -->
                <g class="char-electron char-e2" transform="translate(800, 78)">
                  <path d="M 45 68 L 68 128" stroke="#0284c7" stroke-width="10" stroke-linecap="round" />
                  <path d="M 35 68 L 42 128" stroke="#0284c7" stroke-width="10" stroke-linecap="round" />
                  <path d="M 40 68 L 18 25" stroke="#0284c7" stroke-width="18" stroke-linecap="round" />
                  <circle cx="12" cy="12" r="14" fill="#93c5fd" />
                  <path d="M 30 38 L -8 70" stroke="#bfdbfe" stroke-width="8" stroke-linecap="round" />
                  <text x="28" y="42" font-size="9" fill="#fff" font-weight="bold">-1</text>
                </g>

                <!-- Người 3: Neo đuôi Electron -->
                <g class="char-electron char-e3" transform="translate(865, 75)">
                  <path d="M 45 70 L 65 130" stroke="#0284c7" stroke-width="10" stroke-linecap="round" />
                  <path d="M 35 70 L 40 130" stroke="#0284c7" stroke-width="10" stroke-linecap="round" />
                  <path d="M 40 70 L 20 25" stroke="#0284c7" stroke-width="20" stroke-linecap="round" />
                  <circle cx="12" cy="12" r="14" fill="#93c5fd" />
                  <rect x="-2" y="8" width="28" height="6" fill="#00f2fe" rx="2" />
                  <path d="M 30 38 L -5 70" stroke="#bfdbfe" stroke-width="8" stroke-linecap="round" />
                  <text x="28" y="42" font-size="9" fill="#fff" font-weight="bold">-1</text>
                </g>
              </g>
            </svg>
          </div>

          <!-- Thanh lực kéo mini định lượng phía dưới sân khấu -->
          <div class="rope-progress-bar">
            <div class="fill-proton" id="bar-fill-p" style="width: 50%;"></div>
            <div class="fill-electron" id="bar-fill-e" style="width: 50%;"></div>
          </div>
        </div>

        <!-- KHUNG THI ĐẤU CÂU HỎI -->
        ${isSingleFocus ? `
          <!-- Chế độ Đấu Online hoặc Đấu Bot: Tập trung 1 Panel của chính người chơi, hiển thị to rõ -->
          <div class="battle-single-focus-panel">
            <div class="battle-panel ${mySide === 'proton' ? 'proton-theme' : 'electron-theme'}" id="panel-${mySide}">
              <div class="panel-header">
                <h3>${mySide === 'proton' ? '🔴 PHE CỦA BẠN (PROTON +)' : '🔵 PHE CỦA BẠN (ELECTRON -)'}</h3>
                <div class="powerup-bar" id="${mySide[0]}-powerups">
                  <button class="p-btn" id="${mySide[0]}-btn-shield" onclick="window.tugGame.usePowerUp('${mySide}', 'shield')">🛡️ Khiên (1)</button>
                  <button class="p-btn" id="${mySide[0]}-btn-lightning" onclick="window.tugGame.usePowerUp('${mySide}', 'lightning')">⚡ Sét x2 (1)</button>
                  <button class="p-btn" id="${mySide[0]}-btn-shockwave" onclick="window.tugGame.usePowerUp('${mySide}', 'shockwave')">🌀 Sóng Đẩy (1)</button>
                </div>
              </div>
              <div class="panel-q-box" id="${mySide[0]}-q-content">
                <!-- Nội dung câu hỏi của người chơi -->
              </div>
            </div>
          </div>
        ` : `
          <!-- Chế độ 2 người cùng máy (Split screen) -->
          <div class="battle-question-panels split-active">
            <div class="battle-panel proton-theme" id="panel-proton">
              <div class="panel-header">
                <h3>🔴 ${this.proton.name}</h3>
                <div class="powerup-bar" id="p-powerups">
                  <button class="p-btn" id="p-btn-shield" onclick="window.tugGame.usePowerUp('proton', 'shield')">🛡️ (1)</button>
                  <button class="p-btn" id="p-btn-lightning" onclick="window.tugGame.usePowerUp('proton', 'lightning')">⚡ (1)</button>
                  <button class="p-btn" id="p-btn-shockwave" onclick="window.tugGame.usePowerUp('proton', 'shockwave')">🌀 (1)</button>
                </div>
              </div>
              <div class="panel-q-box" id="p-q-content"></div>
            </div>

            <div class="battle-panel electron-theme" id="panel-electron">
              <div class="panel-header">
                <h3>🔵 ${this.electron.name}</h3>
                <div class="powerup-bar" id="e-powerups">
                  <button class="p-btn" id="e-btn-shield" onclick="window.tugGame.usePowerUp('electron', 'shield')">🛡️ (1)</button>
                  <button class="p-btn" id="e-btn-lightning" onclick="window.tugGame.usePowerUp('electron', 'lightning')">⚡ (1)</button>
                  <button class="p-btn" id="e-btn-shockwave" onclick="window.tugGame.usePowerUp('electron', 'shockwave')">🌀 (1)</button>
                </div>
              </div>
              <div class="panel-q-box" id="e-q-content"></div>
            </div>
          </div>
        `}
      </div>
    `;

    this._updateRopeVisual();
  }

  // ==================== CẬP NHẬT HOẠT HỌA NHÓM KÉO DÂY VÀ VỊ TRÍ DÂY ====================
  _updateRopeVisual() {
    const centerKnot = document.getElementById("svg-center-knot");
    const ropePath = document.getElementById("svg-rope-path");
    const teamP = document.getElementById("team-proton-group");
    const teamE = document.getElementById("team-electron-group");
    const fillP = document.getElementById("bar-fill-p");
    const fillE = document.getElementById("bar-fill-e");

    if (!centerKnot || !ropePath) return;

    // ropePosition: -100 là Proton thắng, +100 là Electron thắng
    // Tọa độ X tâm: 500 + (ropePosition / 100) * 180 (dải di chuyển từ 320 đến 680)
    const shiftX = (this.ropePosition / this.maxRope) * 180;
    const knotX = 500 + shiftX;

    // Dịch chuyển cờ tâm
    centerKnot.setAttribute("transform", `translate(${knotX}, 150)`);

    // Dịch chuyển cả hai nhóm nhân vật theo lực kéo
    const teamPShift = shiftX * 0.75;
    const teamEShift = shiftX * 0.75;

    if (teamP) teamP.setAttribute("transform", `translate(${teamPShift}, 0)`);
    if (teamE) teamE.setAttribute("transform", `translate(${teamEShift}, 0)`);

    // Cập nhật đường cong sợi dây nối tay người dẫn đầu 2 đội qua nút cờ tâm
    const pHandX = 230 + teamPShift;
    const eHandX = 770 + teamEShift;
    ropePath.setAttribute("d", `M ${pHandX} 148 Q ${knotX} ${150 + Math.abs(shiftX) * 0.05} ${eHandX} 148`);

    // Cập nhật thanh lực kéo mini
    if (fillP && fillE) {
      const pPercent = 50 - (this.ropePosition / 2);
      fillP.style.width = `${pPercent}%`;
      fillE.style.width = `${100 - pPercent}%`;
    }

    // Kiểm tra chạm vạch quyết định thắng thua
    if (this.ropePosition <= -this.maxRope) {
      this.endGame("Phe Proton đã kéo bật tung đối thủ!");
    } else if (this.ropePosition >= this.maxRope) {
      this.endGame("Phe Electron đã kéo bật tung đối thủ!");
    }
  }

  _triggerPullAnimation(side) {
    const teamEl = document.getElementById(side === "proton" ? "team-proton-group" : "team-electron-group");
    const oppEl = document.getElementById(side === "proton" ? "team-electron-group" : "team-proton-group");
    if (!teamEl) return;

    // Đội thắng thế giật mạnh dây
    teamEl.classList.add("heaving-pull");
    if (oppEl) oppEl.classList.add("slipping-forward");

    setTimeout(() => {
      teamEl.classList.remove("heaving-pull");
      if (oppEl) oppEl.classList.remove("slipping-forward");
    }, 450);
  }

  // ==================== XỬ LÝ CÂU HỎI TRONG TRẬN ĐẤU ====================
  _nextQuestion(side) {
    // LỌC KỸ NGÂN HÀNG CÂU HỎI: CHỈ LẤY CÂU CÓ question HỢP LỆ (KHÔNG LẤY CLOZE/MINDMAP ĐỂ TRÁNH undefined)
    const validQuestions = QUESTION_BANK.filter(q => 
      q.question && 
      (q.type === "mcq" || q.type === "short_answer" || q.type === "problem_solving")
    );

    const randomQ = validQuestions[Math.floor(Math.random() * validQuestions.length)];
    const qClone = JSON.parse(JSON.stringify(randomQ));

    // Xáo trộn phương án nếu là trắc nghiệm
    if (qClone.type === "mcq" && qClone.options) {
      const correctVal = qClone.options[qClone.correct];
      for (let i = qClone.options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [qClone.options[i], qClone.options[j]] = [qClone.options[j], qClone.options[i]];
      }
      qClone.correct = qClone.options.indexOf(correctVal);
    }

    this.currentQuestions[side] = {
      ...qClone,
      startTime: Date.now()
    };

    const isSingle = (this.mode === "bot" || this.mode === "online");
    // Nếu ở chế độ 1 màn hình và không phải phe mình, không cần render UI câu hỏi của đối thủ
    if (isSingle && side !== this.playerSide) {
      return;
    }

    const containerId = `${side[0]}-q-content`;
    const box = document.getElementById(containerId);
    if (!box) return;

    let optionsHtml = "";
    if (qClone.type === "mcq" && qClone.options) {
      optionsHtml = `
        <div class="battle-options-grid">
          ${qClone.options.map((opt, idx) => `
            <button class="battle-opt-btn" onclick="window.tugGame.handleAnswer('${side}', ${idx})">
              <span class="opt-key">${["A", "B", "C", "D"][idx]}</span>
              <span class="opt-text">${opt}</span>
            </button>
          `).join("")}
        </div>
      `;
    } else {
      optionsHtml = `
        <div class="battle-short-ans">
          <input type="text" id="${side}-ans-input" placeholder="Nhập đáp án số hoặc chữ..." class="battle-input" />
          <button class="battle-submit-btn" onclick="window.tugGame.handleAnswer('${side}', document.getElementById('${side}-ans-input').value)">
            GỬI ĐÁP ÁN 🚀
          </button>
        </div>
      `;
    }

    box.innerHTML = `
      <div class="battle-q-card">
        <div class="q-meta">
          <span class="q-level-tag ${qClone.level}">${qClone.level}</span>
          <span class="q-topic-tag">🔬 ${qClone.topicName || "Cấu tạo nguyên tử"}</span>
        </div>
        <p class="battle-q-text">${qClone.question}</p>
        ${optionsHtml}
      </div>
    `;
  }

  handleAnswer(side, answer) {
    if (!this.gameActive) return;
    const qData = this.currentQuestions[side];
    if (!qData) return;

    let isCorrect = false;
    if (qData.type === "mcq") {
      isCorrect = (answer === qData.correct);
    } else {
      const userStr = String(answer || "").trim().toLowerCase();
      const correctStr = String(qData.correctAnswer || "").trim().toLowerCase();
      const accepts = (qData.acceptAnswers || []).map(a => String(a).toLowerCase());
      isCorrect = (userStr === correctStr) || accepts.includes(userStr);
    }

    const team = side === "proton" ? this.proton : this.electron;
    let pullPower = 0;

    if (isCorrect) {
      team.streak++;
      pullPower = 12 + Math.min(10, team.streak * 3);

      if (team.doublePowerActive) {
        pullPower *= 2;
        team.doublePowerActive = false;
        if (window.soundFX) window.soundFX.playLightning();
      } else {
        if (window.soundFX) window.soundFX.playTugRope();
      }

      team.score += Math.round(pullPower * 10);

      // Kéo dây: Proton kéo sang trái (-), Electron kéo sang phải (+)
      if (side === "proton") {
        this.ropePosition = Math.max(-this.maxRope, this.ropePosition - pullPower);
      } else {
        this.ropePosition = Math.min(this.maxRope, this.ropePosition + pullPower);
      }

      this._triggerPullAnimation(side);
      this._showFloatingFeedback(side, `+${pullPower} LỰC KÉO!`, "correct");
    } else {
      team.streak = 0;
      if (team.shieldActive) {
        team.shieldActive = false;
        this._showFloatingFeedback(side, "🛡️ KHIÊN HẠT NHÂN BẢO VỆ!", "shield");
        if (window.soundFX) window.soundFX.playShield();
      } else {
        const backPower = 6;
        if (side === "proton") {
          this.ropePosition = Math.min(this.maxRope, this.ropePosition + backPower);
        } else {
          this.ropePosition = Math.max(-this.maxRope, this.ropePosition - backPower);
        }
        this._showFloatingFeedback(side, "SAI RỒI! BỊ THỤT LÙI!", "wrong");
        if (window.soundFX) window.soundFX.playWrong();
      }
    }

    // Gửi qua WebRTC nếu đang chơi Online
    if (this.mode === "online" && this.peerConn) {
      this.peerConn.send({
        type: "ANSWER_RESULT",
        side: side,
        isCorrect: isCorrect,
        pullPower: pullPower
      });
      this.peerConn.send({
        type: "SYNC_ROPE",
        ropePosition: this.ropePosition
      });
    }

    // Cập nhật điểm
    const pScoreEl = document.getElementById("p-score");
    const eScoreEl = document.getElementById("e-score");
    if (pScoreEl) pScoreEl.textContent = this.proton.score;
    if (eScoreEl) eScoreEl.textContent = this.electron.score;

    this._updateRopeVisual();
    this._nextQuestion(side);
  }

  _applyOpponentAnswer(oppSide, isCorrect, pullPower) {
    const oppTeam = oppSide === "proton" ? this.proton : this.electron;
    if (isCorrect) {
      oppTeam.score += Math.round(pullPower * 10);
      if (oppSide === "proton") {
        this.ropePosition = Math.max(-this.maxRope, this.ropePosition - pullPower);
      } else {
        this.ropePosition = Math.min(this.maxRope, this.ropePosition + pullPower);
      }
      this._triggerPullAnimation(oppSide);
      this._showFloatingFeedback(oppSide, `ĐỐI THỦ +${pullPower} LỰC!`, "correct");
      if (window.soundFX) window.soundFX.playTugRope();
    } else {
      const backPower = 6;
      if (oppSide === "proton") {
        this.ropePosition = Math.min(this.maxRope, this.ropePosition + backPower);
      } else {
        this.ropePosition = Math.max(-this.maxRope, this.ropePosition - backPower);
      }
    }

    const pScoreEl = document.getElementById("p-score");
    const eScoreEl = document.getElementById("e-score");
    if (pScoreEl) pScoreEl.textContent = this.proton.score;
    if (eScoreEl) eScoreEl.textContent = this.electron.score;

    this._updateRopeVisual();
  }

  _applyOpponentPowerup(oppSide, powerType) {
    if (powerType === "shockwave") {
      const shock = 15;
      if (oppSide === "proton") {
        this.ropePosition = Math.max(-this.maxRope, this.ropePosition - shock);
      } else {
        this.ropePosition = Math.min(this.maxRope, this.ropePosition + shock);
      }
      this._showFloatingFeedback(oppSide, "🌀 ĐỐI THỦ BẮN SÓNG ĐẨY!", "shockwave");
      this._updateRopeVisual();
    }
  }

  _showFloatingFeedback(side, text, type) {
    const panel = document.getElementById(`panel-${side}`) || document.getElementById("tug-vivid-stage");
    if (!panel) return;
    const badge = document.createElement("div");
    badge.className = `floating-feedback ${type}`;
    badge.textContent = text;
    panel.appendChild(badge);
    setTimeout(() => badge.remove(), 1300);
  }

  usePowerUp(side, type) {
    if (!this.gameActive) return;
    const team = side === "proton" ? this.proton : this.electron;
    if (team.powerUps[type] <= 0) return;

    team.powerUps[type]--;
    const btn = document.getElementById(`${side[0]}-btn-${type}`);
    if (btn) {
      btn.textContent = `${btn.textContent.split(" ")[0]} (0)`;
      btn.classList.add("disabled");
      btn.disabled = true;
    }

    if (type === "shield") {
      team.shieldActive = true;
      this._showFloatingFeedback(side, "🛡️ KHIÊN HẠT NHÂN BẢO HỘ!", "shield");
      if (window.soundFX) window.soundFX.playShield();
    } else if (type === "lightning") {
      team.doublePowerActive = true;
      this._showFloatingFeedback(side, "⚡ TIA SÉT X2 LỰC KÉO!", "lightning");
      if (window.soundFX) window.soundFX.playLightning();
    } else if (type === "shockwave") {
      const shockPower = 15;
      if (side === "proton") {
        this.ropePosition = Math.max(-this.maxRope, this.ropePosition - shockPower);
      } else {
        this.ropePosition = Math.min(this.maxRope, this.ropePosition + shockPower);
      }
      this._showFloatingFeedback(side, "🌀 SÓNG XUNG KÍCH ĐẨY LÙI 15%!", "shockwave");
      if (window.soundFX) window.soundFX.playLightning();
      this._triggerPullAnimation(side);
      this._updateRopeVisual();
    }

    // Gửi qua WebRTC
    if (this.mode === "online" && this.peerConn) {
      this.peerConn.send({
        type: "USE_POWERUP",
        side: side,
        powerType: type
      });
      this.peerConn.send({
        type: "SYNC_ROPE",
        ropePosition: this.ropePosition
      });
    }
  }

  _scheduleBotAnswer(botSide) {
    if (!this.gameActive || this.mode !== "bot") return;

    const delays = { easy: 6000, normal: 4000, hard: 2500 };
    const accuracy = { easy: 0.55, normal: 0.78, hard: 0.95 };

    const delay = delays[this.botDifficulty] + (Math.random() * 800 - 400);
    this.botTimer = setTimeout(() => {
      if (!this.gameActive) return;

      const q = this.currentQuestions[botSide];
      if (!q) {
        this._nextQuestion(botSide);
        this._scheduleBotAnswer(botSide);
        return;
      }

      const willBeCorrect = Math.random() < accuracy[this.botDifficulty];
      let answer;
      if (q.type === "mcq") {
        answer = willBeCorrect ? q.correct : (q.correct + 1) % (q.options ? q.options.length : 4);
      } else {
        answer = willBeCorrect ? q.correctAnswer : "999";
      }

      this.handleAnswer(botSide, answer);
      this._scheduleBotAnswer(botSide);
    }, delay);
  }

  endGame(reason) {
    this.gameActive = false;
    clearInterval(this.timer);
    if (this.botTimer) clearTimeout(this.botTimer);

    let winner = "Hòa";
    let winnerSide = null;

    if (this.ropePosition < 0) {
      winner = this.proton.name;
      winnerSide = "proton";
    } else if (this.ropePosition > 0) {
      winner = this.electron.name;
      winnerSide = "electron";
    }

    const isUserWinner = (winnerSide === this.playerSide);
    if (isUserWinner) {
      window.appStorage.unlockBadge("tug_champion");
      const user = window.appStorage.getCurrentUser();
      if (user) {
        user.score += 350;
        window.appStorage.saveUserProfile(user);
      }
      if (window.soundFX) window.soundFX.playVictory();
    } else {
      if (window.soundFX) window.soundFX.playWrong();
    }

    this.container.innerHTML = `
      <div class="battle-result-modal">
        <div class="result-card">
          <div class="result-crown">${isUserWinner ? "👑 CHIẾN THẮNG HUY HOÀNG!" : "⚡ KẾT THÚC TRẬN ĐẤU"}</div>
          <h2 class="result-winner-title">${winner.toUpperCase()}</h2>
          <p class="result-reason">${reason}</p>

          <div class="result-score-summary">
            <div class="score-col proton-col">
              <h4>🔴 ${this.proton.name}</h4>
              <div class="col-score">${this.proton.score} XP</div>
            </div>
            <div class="score-vs">VS</div>
            <div class="score-col electron-col">
              <h4>🔵 ${this.electron.name}</h4>
              <div class="col-score">${this.electron.score} XP</div>
            </div>
          </div>

          <div class="result-actions">
            <button class="btn-cosmic-glow" onclick="window.tugGame.renderLobby()">
              🔄 TRẬN ĐẤU MỚI
            </button>
            <button class="btn-secondary" onclick="window.switchMainTab('quiz')">
              🎯 LUYỆN TẬP THÊM
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

window.TugOfWarGame = TugOfWarGame;
