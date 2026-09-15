/**
 * microVideoPlayer.js: Trình phát Video Học tập Vi mô (Micro-learning Video Player)
 * Cung cấp 2 chế độ học tập trực quan:
 * 1. Animated Simulation Player 60 FPS trên Canvas với chuyển động vật lý, hạt tương tác, phụ đề đồng bộ
 * 2. YouTube Educational Video Player tích hợp tư liệu khoa học chuẩn SGK KNTT
 */

class MicroVideoPlayer {
  constructor() {
    this.currentVideoId = null;
    this.isPlaying = false;
    this.currentTime = 0; // Đơn vị: giây
    this.playbackRate = 1.0;
    this.mode = "canvas"; // "canvas" hoặc "youtube"
    this.enableVoice = true;
    this.enableSubtitles = true;
    this.lastFrameTime = 0;
    this.animFrameId = null;
    this.synth = window.speechSynthesis;
    this.lastSpokenSceneIdx = -1;

    // Định nghĩa dữ liệu 4 video micro-learning chuẩn SGK KNTT
    this.videoLibrary = {
      "rutherford-gold": {
        id: "rutherford-gold",
        title: "Thí nghiệm Rutherford: Khám phá bí ẩn hạt nhân",
        duration: 105, // 1:45
        badge: "Lịch sử khám phá",
        youtubeId: "1EdTw44649E",
        overview: "Năm 1911, Ernest Rutherford bắn chùm hạt alpha qua lá vàng siêu mỏng và phát hiện bí mật chấn động thế giới!",
        scenes: [
          {
            start: 0,
            end: 25,
            title: "Bắn phá lá vàng mỏng",
            text: "Rutherford phóng một chùm hạt alpha (hạt mang điện tích dương +2) thẳng vào một lá vàng mỏng chỉ dày vài trăm nguyên tử. Hầu hết các hạt đi thẳng xuyên qua như không có vật cản!",
            draw: (ctx, w, h, t, p) => this._drawRutherfordScene1(ctx, w, h, t, p)
          },
          {
            start: 25,
            end: 55,
            title: "Hiện tượng bất ngờ: Tán xạ góc lớn",
            text: "Cứ khoảng 8.000 hạt thì có 1 hạt bị lệch góc lớn, thậm chí bật ngược 180 độ trở lại! Rutherford ví nó như bắn đại bác vào tờ giấy lụa mà viên đạn dội ngược lại!",
            draw: (ctx, w, h, t, p) => this._drawRutherfordScene2(ctx, w, h, t, p)
          },
          {
            start: 55,
            end: 105,
            title: "Kết luận vĩ đại: Mô hình hành tinh nguyên tử",
            text: "Nguyên tử có cấu tạo rỗng! Toàn bộ điện tích dương và 99.9% khối lượng tập trung ở một tâm cực nhỏ: Hạt nhân nguyên tử. Các electron chuyển động xung quanh.",
            draw: (ctx, w, h, t, p) => this._drawRutherfordScene3(ctx, w, h, t, p)
          }
        ]
      },
      "electron-shells": {
        id: "electron-shells",
        title: "Vũ điệu của các lớp vỏ Electron",
        duration: 90, // 1:30
        badge: "Cấu trúc vỏ e",
        youtubeId: "cpBb2bgFO6I",
        overview: "Các electron không bay hỗn loạn mà phân bố có trật tự trên các lớp vỏ như những hành tinh quanh Mặt Trời!",
        scenes: [
          {
            start: 0,
            end: 30,
            title: "Quy tắc lấp đầy từ trong ra ngoài",
            text: "Electron luôn chiếm giữ các mức năng lượng thấp nhất ở lớp gần hạt nhân nhất (lớp 1) trước khi nhảy ra các lớp ngoài. Lớp 1 chứa tối đa 2 electron!",
            draw: (ctx, w, h, t, p) => this._drawShellScene1(ctx, w, h, t, p)
          },
          {
            start: 30,
            end: 60,
            title: "Quy tắc vàng 2 - 8 - 8",
            text: "Lớp 1: tối đa 2e. Lớp 2: tối đa 8e. Lớp 3: tối đa 8e (với 20 nguyên tố đầu). Nắm chắc quy tắc này giúp học sinh giải quyết mọi bài tập cấu tạo nguyên tử!",
            draw: (ctx, w, h, t, p) => this._drawShellScene2(ctx, w, h, t, p)
          },
          {
            start: 60,
            end: 90,
            title: "Bí mật của lớp vỏ ngoài cùng bền vững",
            text: "Khí hiếm (He 2e, Ne 8e, Ar 8e) có lớp vỏ ngoài cùng bền vững hoàn hảo. Các nguyên tố khác luôn có xu hướng nhường, nhận hoặc dùng chung electron để bền như khí hiếm.",
            draw: (ctx, w, h, t, p) => this._drawShellScene3(ctx, w, h, t, p)
          }
        ]
      },
      "amu-scale": {
        id: "amu-scale",
        title: "amu là gì? Đo lường thế giới siêu vi",
        duration: 80, // 1:20
        badge: "Khối lượng nguyên tử",
        youtubeId: "1xSQLUP44x8",
        overview: "Tại sao không dùng gam hay kilôgam để cân nguyên tử? Khám phá đơn vị đo lường nguyên tử kỳ diệu!",
        scenes: [
          {
            start: 0,
            end: 25,
            title: "Số 0 bất tận trong khối lượng gam",
            text: "Một nguyên tử Carbon chỉ nặng 0,00000000000000000000001992 gam (22 chữ số 0 sau dấu phẩy). Con số này quá dài và bất tiện để tính toán hàng ngày!",
            draw: (ctx, w, h, t, p) => this._drawAmuScene1(ctx, w, h, t, p)
          },
          {
            start: 25,
            end: 55,
            title: "Đơn vị amu ra đời",
            text: "Các nhà khoa học quy ước: 1 amu bằng 1/12 khối lượng của một nguyên tử Carbon-12. Khi đó, 1 proton ≈ 1 amu, 1 neutron ≈ 1 amu, số khối trở nên rất tròn trịa!",
            draw: (ctx, w, h, t, p) => this._drawAmuScene2(ctx, w, h, t, p)
          },
          {
            start: 55,
            end: 80,
            title: "Electron nhẹ như sợi lông chim",
            text: "1 proton nặng bằng 1836 electron. Khối lượng electron chỉ bằng 0,00055 amu, quá nhỏ bé nên coi như toàn bộ khối lượng nguyên tử tập trung tại hạt nhân!",
            draw: (ctx, w, h, t, p) => this._drawAmuScene3(ctx, w, h, t, p)
          }
        ]
      },
      "empty-space": {
        id: "empty-space",
        title: "Nguyên tử rỗng đến mức nào?",
        duration: 75, // 1:15
        badge: "Khám phá bất ngờ",
        youtubeId: "bUfWc_v9q7E",
        overview: "Bạn có biết cơ thể bạn và mọi vật chất xung quanh thực chất được tạo nên từ 99,9999999% khoảng không trống rỗng?",
        scenes: [
          {
            start: 0,
            end: 28,
            title: "Phép so sánh sân vận động khổng lồ",
            text: "Nếu phóng to nguyên tử bằng một sân vận động bóng đá khổng lồ, thì hạt nhân chỉ nhỏ bằng một quả bóng bàn đặt ở chấm giao bóng giữa sân!",
            draw: (ctx, w, h, t, p) => this._drawEmptyScene1(ctx, w, h, t, p)
          },
          {
            start: 28,
            end: 75,
            title: "Nếu ép hết khoảng trống của 8 tỷ người...",
            text: "Nếu loại bỏ hoàn toàn khoảng trống trong tất cả các nguyên tử cấu tạo nên 8 tỷ người trên Trái Đất, toàn bộ nhân loại sẽ bị nén lại chỉ bằng kích thước... MỘT VIÊN ĐƯỜNG siêu nặng!",
            draw: (ctx, w, h, t, p) => this._drawEmptyScene2(ctx, w, h, t, p)
          }
        ]
      }
    };

    this._initModalDOM();
  }

  _initModalDOM() {
    if (document.getElementById("micro-video-modal")) return;

    const modalHTML = `
      <div class="video-modal-overlay" id="micro-video-modal" style="display: none;">
        <div class="video-modal-container">
          <div class="video-modal-header">
            <div class="video-header-info">
              <span class="video-badge-pill" id="mv-header-badge">VIDEO KHOA HỌC</span>
              <h3 id="mv-header-title">Tiêu Đề Video</h3>
            </div>
            <div class="video-modal-actions">
              <div class="video-mode-switch">
                <button class="v-mode-btn active" id="btn-mode-canvas" onclick="window.microPlayer.switchMode('canvas')">🎬 Mô Phỏng 60FPS</button>
                <button class="v-mode-btn" id="btn-mode-youtube" onclick="window.microPlayer.switchMode('youtube')">📺 Video Tư Liệu</button>
              </div>
              <button class="btn-close-modal" onclick="window.microPlayer.closeModal()" title="Đóng Video">✕</button>
            </div>
          </div>

          <div class="video-player-body">
            <!-- VÙNG PHÁT VIDEO CANVAS 60FPS -->
            <div class="video-screen-wrap" id="mv-screen-canvas">
              <canvas id="mv-canvas" width="880" height="495"></canvas>
              
              <!-- Lớp phủ phụ đề (Subtitles) -->
              <div class="video-subtitles-bar" id="mv-subtitles-bar">
                <span id="mv-subtitle-text">Đang tải thuyết minh trực quan...</span>
              </div>

              <!-- Lớp phủ khi tạm dừng -->
              <div class="video-pause-overlay" id="mv-pause-overlay" style="display: none;" onclick="window.microPlayer.togglePlay()">
                <div class="pause-icon-big">▶</div>
                <div class="pause-text">Nhấp để tiếp tục xem</div>
              </div>
            </div>

            <!-- VÙNG PHÁT YOUTUBE EMBED -->
            <div class="video-screen-wrap" id="mv-screen-youtube" style="display: none;">
              <iframe id="mv-youtube-iframe" width="100%" height="100%" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>

            <!-- THANH ĐIỀU KHIỂN VIDEO PLAYER -->
            <div class="video-controls-bar">
              <div class="video-seek-wrap">
                <input type="range" id="mv-seekbar" min="0" max="100" value="0" step="0.1" oninput="window.microPlayer.onSeek(this.value)" />
                <div class="video-progress-fill" id="mv-progress-fill"></div>
              </div>

              <div class="video-controls-row">
                <div class="controls-left">
                  <button class="v-ctrl-btn" id="mv-btn-play" onclick="window.microPlayer.togglePlay()" title="Phát / Dừng">▶</button>
                  <button class="v-ctrl-btn" onclick="window.microPlayer.seekRelative(-10)" title="Lùi 10 giây">⏪ 10s</button>
                  <button class="v-ctrl-btn" onclick="window.microPlayer.seekRelative(10)" title="Tiến 10 giây">10s ⏩</button>
                  <span class="video-time-display">
                    <span id="mv-current-time">00:00</span> / <span id="mv-total-time">01:45</span>
                  </span>
                </div>

                <div class="controls-right">
                  <button class="v-ctrl-btn active" id="mv-btn-voice" onclick="window.microPlayer.toggleVoice()" title="Thuyết minh tiếng Việt (AI Voice)">🗣️ Giọng đọc</button>
                  <button class="v-ctrl-btn active" id="mv-btn-cc" onclick="window.microPlayer.toggleSubtitles()" title="Phụ đề tiếng Việt">💬 Phụ đề</button>
                  <select class="v-rate-select" onchange="window.microPlayer.setSpeed(this.value)">
                    <option value="0.75">0.75x</option>
                    <option value="1.0" selected>1.0x</option>
                    <option value="1.25">1.25x</option>
                    <option value="1.5">1.5x</option>
                  </select>
                  <button class="v-ctrl-btn" onclick="window.microPlayer.restart()" title="Xem lại từ đầu">🔄 Xem lại</button>
                </div>
              </div>
            </div>
          </div>

          <!-- DANH SÁCH CÁC PHÂN CẢNH (CHAPTERS) DƯỚI VIDEO -->
          <div class="video-chapters-shelf" id="mv-chapters-container"></div>
        </div>
      </div>
    `;

    const div = document.createElement("div");
    div.innerHTML = modalHTML;
    document.body.appendChild(div.firstElementChild);

    this.canvas = document.getElementById("mv-canvas");
    if (this.canvas) {
      this.ctx = this.canvas.getContext("2d");
    }
  }

  openVideo(videoId) {
    const video = this.videoLibrary[videoId];
    if (!video) return;

    this.currentVideoId = videoId;
    this.currentTime = 0;
    this.isPlaying = true;
    this.lastSpokenSceneIdx = -1;

    document.getElementById("mv-header-badge").textContent = `${video.badge} • ⏱️ ${this._formatTime(video.duration)}`;
    document.getElementById("mv-header-title").textContent = video.title;
    document.getElementById("mv-total-time").textContent = this._formatTime(video.duration);

    const chapContainer = document.getElementById("mv-chapters-container");
    if (chapContainer) {
      chapContainer.innerHTML = video.scenes.map((s, idx) => `
        <div class="v-chapter-card" id="mv-chap-${idx}" onclick="window.microPlayer.jumpToScene(${s.start})">
          <div class="chap-time">[${this._formatTime(s.start)} - ${this._formatTime(s.end)}]</div>
          <div class="chap-title">${s.title}</div>
        </div>
      `).join("");
    }

    const modal = document.getElementById("micro-video-modal");
    if (modal) modal.style.display = "flex";

    this.switchMode("canvas");
    this._startPlaybackLoop();
  }

  closeModal() {
    this.isPlaying = false;
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    if (this.synth) this.synth.cancel();

    const iframe = document.getElementById("mv-youtube-iframe");
    if (iframe) iframe.src = "";

    const modal = document.getElementById("micro-video-modal");
    if (modal) modal.style.display = "none";
  }

  switchMode(mode) {
    this.mode = mode;
    const canvasWrap = document.getElementById("mv-screen-canvas");
    const ytWrap = document.getElementById("mv-screen-youtube");
    const btnCanvas = document.getElementById("btn-mode-canvas");
    const btnYt = document.getElementById("btn-mode-youtube");
    const video = this.videoLibrary[this.currentVideoId];

    if (mode === "canvas") {
      canvasWrap.style.display = "block";
      ytWrap.style.display = "none";
      btnCanvas.classList.add("active");
      btnYt.classList.remove("active");
      document.getElementById("mv-youtube-iframe").src = "";
      this.isPlaying = true;
      this._startPlaybackLoop();
    } else {
      canvasWrap.style.display = "none";
      ytWrap.style.display = "block";
      btnCanvas.classList.remove("active");
      btnYt.classList.add("active");
      this.isPlaying = false;
      if (this.synth) this.synth.cancel();
      if (video && video.youtubeId) {
        document.getElementById("mv-youtube-iframe").src = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`;
      }
    }
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    const btn = document.getElementById("mv-btn-play");
    const pauseOverlay = document.getElementById("mv-pause-overlay");

    if (this.isPlaying) {
      if (btn) btn.textContent = "⏸";
      if (pauseOverlay) pauseOverlay.style.display = "none";
      if (this.synth && this.synth.paused) this.synth.resume();
      this.lastFrameTime = performance.now();
      this._startPlaybackLoop();
    } else {
      if (btn) btn.textContent = "▶";
      if (pauseOverlay) pauseOverlay.style.display = "flex";
      if (this.synth && this.synth.speaking) this.synth.pause();
    }
  }

  seekRelative(delta) {
    const video = this.videoLibrary[this.currentVideoId];
    if (!video) return;
    this.currentTime = Math.max(0, Math.min(video.duration, this.currentTime + delta));
    this.lastSpokenSceneIdx = -1;
    if (this.synth) this.synth.cancel();
  }

  onSeek(percent) {
    const video = this.videoLibrary[this.currentVideoId];
    if (!video) return;
    this.currentTime = (percent / 100) * video.duration;
    this.lastSpokenSceneIdx = -1;
    if (this.synth) this.synth.cancel();
  }

  jumpToScene(seconds) {
    this.currentTime = seconds;
    this.lastSpokenSceneIdx = -1;
    if (this.synth) this.synth.cancel();
    if (!this.isPlaying) this.togglePlay();
  }

  setSpeed(speed) {
    this.playbackRate = parseFloat(speed) || 1.0;
  }

  toggleVoice() {
    this.enableVoice = !this.enableVoice;
    const btn = document.getElementById("mv-btn-voice");
    if (btn) btn.classList.toggle("active", this.enableVoice);
    if (!this.enableVoice && this.synth) {
      this.synth.cancel();
    } else {
      this.lastSpokenSceneIdx = -1;
    }
  }

  toggleSubtitles() {
    this.enableSubtitles = !this.enableSubtitles;
    const btn = document.getElementById("mv-btn-cc");
    const subBar = document.getElementById("mv-subtitles-bar");
    if (btn) btn.classList.toggle("active", this.enableSubtitles);
    if (subBar) subBar.style.display = this.enableSubtitles ? "flex" : "none";
  }

  restart() {
    this.currentTime = 0;
    this.lastSpokenSceneIdx = -1;
    if (this.synth) this.synth.cancel();
    this.isPlaying = true;
    const btn = document.getElementById("mv-btn-play");
    if (btn) btn.textContent = "⏸";
    document.getElementById("mv-pause-overlay").style.display = "none";
    this._startPlaybackLoop();
  }

  _startPlaybackLoop() {
    this.lastFrameTime = performance.now();
    const renderLoop = (now) => {
      if (!this.isPlaying || this.mode !== "canvas") return;

      const deltaSeconds = ((now - this.lastFrameTime) / 1000) * this.playbackRate;
      this.lastFrameTime = now;

      const video = this.videoLibrary[this.currentVideoId];
      if (video) {
        this.currentTime += deltaSeconds;
        if (this.currentTime >= video.duration) {
          this.currentTime = video.duration;
          this.isPlaying = false;
          const btn = document.getElementById("mv-btn-play");
          if (btn) btn.textContent = "🔄";
          if (window.soundFX) window.soundFX.playVictory();
        }
        this._renderCurrentFrame(video);
      }

      this.animFrameId = requestAnimationFrame(renderLoop);
    };

    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.animFrameId = requestAnimationFrame(renderLoop);
  }

  _renderCurrentFrame(video) {
    if (!this.ctx || !this.canvas) return;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const t = this.currentTime;

    let activeScene = video.scenes[0];
    let sceneIdx = 0;
    for (let i = 0; i < video.scenes.length; i++) {
      if (t >= video.scenes[i].start && t <= video.scenes[i].end) {
        activeScene = video.scenes[i];
        sceneIdx = i;
        break;
      }
    }

    const curTimeEl = document.getElementById("mv-current-time");
    const seekbar = document.getElementById("mv-seekbar");
    const fillEl = document.getElementById("mv-progress-fill");
    const pct = (t / video.duration) * 100;

    if (curTimeEl) curTimeEl.textContent = this._formatTime(t);
    if (seekbar) seekbar.value = pct;
    if (fillEl) fillEl.style.width = `${pct}%`;

    const subText = document.getElementById("mv-subtitle-text");
    if (subText) subText.textContent = activeScene.text;

    document.querySelectorAll(".v-chapter-card").forEach((card, i) => {
      card.classList.toggle("active", i === sceneIdx);
    });

    if (this.enableVoice && sceneIdx !== this.lastSpokenSceneIdx) {
      this.lastSpokenSceneIdx = sceneIdx;
      this._speakNarration(activeScene.text);
    }

    this.ctx.fillStyle = "#070913";
    this.ctx.fillRect(0, 0, w, h);
    this._drawStarsBackground(this.ctx, w, h, t);

    const sceneProgress = Math.max(0, Math.min(1, (t - activeScene.start) / (activeScene.end - activeScene.start)));

    if (typeof activeScene.draw === "function") {
      activeScene.draw(this.ctx, w, h, t, sceneProgress);
    }

    this._drawSceneOverlayHeader(this.ctx, w, h, activeScene.title, sceneIdx + 1, video.scenes.length);
  }

  _drawStarsBackground(ctx, w, h, t) {
    ctx.save();
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    for (let i = 0; i < 40; i++) {
      const x = (Math.sin(i * 99 + t * 0.05) * 0.5 + 0.5) * w;
      const y = (Math.cos(i * 33 + t * 0.03) * 0.5 + 0.5) * h;
      const r = (i % 3) * 0.8 + 0.6;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  _drawSceneOverlayHeader(ctx, w, h, title, curIdx, totalIdx) {
    ctx.save();
    ctx.fillStyle = "rgba(10, 15, 30, 0.75)";
    ctx.fillRect(20, 20, w - 40, 42);
    ctx.strokeStyle = "rgba(56, 189, 248, 0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, w - 40, 42);

    ctx.fillStyle = "#00f2fe";
    ctx.font = "bold 13px 'Be Vietnam Pro', sans-serif";
    ctx.fillText(`PHÂN CẢNH ${curIdx}/${totalIdx}:`, 36, 46);

    ctx.fillStyle = "#ffffff";
    ctx.font = "600 14px 'Be Vietnam Pro', sans-serif";
    ctx.fillText(title, 160, 46);
    ctx.restore();
  }

  _drawRutherfordScene1(ctx, w, h, t, p) {
    const gunX = 120;
    const gunY = h / 2;
    const goldX = w / 2;
    const screenX = w - 120;

    ctx.fillStyle = "#334155";
    ctx.fillRect(gunX - 50, gunY - 30, 50, 60);
    ctx.fillStyle = "#ff3366";
    ctx.font = "bold 11px sans-serif";
    ctx.fillText("Nguồn Alpha (α)", gunX - 60, gunY - 38);

    ctx.fillStyle = "rgba(245, 158, 11, 0.4)";
    ctx.fillRect(goldX - 6, 80, 12, h - 160);
    ctx.strokeStyle = "#fbbf24";
    ctx.lineWidth = 2;
    ctx.strokeRect(goldX - 6, 80, 12, h - 160);
    ctx.fillStyle = "#fbbf24";
    ctx.fillText("Lá vàng mỏng (vài trăm nguyên tử)", goldX - 70, 70);

    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(screenX, gunY, 150, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.stroke();
    ctx.fillStyle = "#10b981";
    ctx.fillText("Màn huỳnh quang ZnS", screenX - 50, gunY - 160);

    for (let i = 0; i < 15; i++) {
      const offset = (t * 220 + i * 45) % (screenX - gunX);
      const curX = gunX + offset;
      const curY = gunY + (i - 7) * 12;

      ctx.fillStyle = "#ff3366";
      ctx.shadowColor = "#ff3366";
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(curX, curY, 4, 0, Math.PI * 2);
      ctx.fill();

      if (curX > screenX - 30) {
        ctx.fillStyle = "rgba(16, 185, 129, 0.6)";
        ctx.beginPath();
        ctx.arc(screenX, curY, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.shadowBlur = 0;
    this._drawFloatBadge(ctx, w / 2, h - 45, "Hầu hết hạt alpha đi thẳng xuyên qua lá vàng!");
  }

  _drawRutherfordScene2(ctx, w, h, t, p) {
    const cx = w / 2;
    const cy = h / 2;

    const pulse = Math.sin(t * 8) * 3;
    ctx.fillStyle = "rgba(234, 179, 8, 0.2)";
    ctx.beginPath();
    ctx.arc(cx, cy, 45 + pulse, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#eab308";
    ctx.beginPath();
    ctx.arc(cx, cy, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#000000";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("+79 (Hạt nhân)", cx, cy + 4);
    ctx.textAlign = "left";

    ctx.strokeStyle = "rgba(0, 242, 254, 0.2)";
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.arc(cx, cy, 180, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#38bdf8";
    ctx.fillText("Khoảng không gian rỗng giữa hạt nhân và lớp vỏ", cx - 140, cy - 190);

    const a1Progress = (t * 0.8) % 1;
    const x1 = 80 + a1Progress * (cx - 80);
    const y1 = cy - 70;
    if (a1Progress < 0.7) {
      ctx.fillStyle = "#ff3366";
      ctx.beginPath();
      ctx.arc(x1, y1, 5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const defX = cx + (a1Progress - 0.7) * 300;
      const defY = y1 - (a1Progress - 0.7) * 200;
      ctx.fillStyle = "#ff3366";
      ctx.beginPath();
      ctx.arc(defX, defY, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    const bounceProg = (t * 0.6) % 1;
    let bX = 80;
    if (bounceProg < 0.5) {
      bX = 80 + (bounceProg / 0.5) * (cx - 35 - 80);
    } else {
      bX = (cx - 35) - ((bounceProg - 0.5) / 0.5) * (cx - 35 - 80);
    }

    ctx.fillStyle = "#ff0055";
    ctx.shadowColor = "#ff0055";
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(bX, cy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    if (bounceProg > 0.46 && bounceProg < 0.54) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.beginPath();
      ctx.arc(cx - 30, cy, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ff0055";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText("BẬT NGƯỢC 180°!", cx - 110, cy - 20);
    }

    this._drawFloatBadge(ctx, w / 2, h - 45, "Cứ 8.000 hạt thì có 1 hạt bật ngược lại chứng minh hạt nhân cực đặc!");
  }

  _drawRutherfordScene3(ctx, w, h, t, p) {
    const cx = w / 2;
    const cy = h / 2;

    ctx.fillStyle = "#ff3366";
    ctx.beginPath();
    ctx.arc(cx, cy, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("HẠT NHÂN", cx, cy + 4);
    ctx.textAlign = "left";

    const shells = [80, 130, 180];
    shells.forEach((r, idx) => {
      ctx.strokeStyle = "rgba(0, 242, 254, 0.35)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      const angle = t * (2 - idx * 0.4);
      const ex = cx + Math.cos(angle) * r;
      const ey = cy + Math.sin(angle) * r;
      ctx.fillStyle = "#00f2fe";
      ctx.shadowColor = "#00f2fe";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(ex, ey, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    this._drawFloatBadge(ctx, w / 2, h - 45, "Mô hình hành tinh nguyên tử: Hạt nhân ở giữa, electron quay quanh");
  }

  _drawShellScene1(ctx, w, h, t, p) {
    const cx = w / 2;
    const cy = h / 2;

    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("+", cx, cy + 4);

    ctx.strokeStyle = "rgba(0, 242, 254, 0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 80, 0, Math.PI * 2);
    ctx.stroke();

    const angle1 = t * 2.5;
    const angle2 = angle1 + Math.PI;
    const e1X = cx + Math.cos(angle1) * 80;
    const e1Y = cy + Math.sin(angle1) * 80;
    const e2X = cx + Math.cos(angle2) * 80;
    const e2Y = cy + Math.sin(angle2) * 80;

    ctx.fillStyle = "#00f2fe";
    ctx.shadowBlur = 8;
    ctx.shadowColor = "#00f2fe";
    ctx.beginPath();
    ctx.arc(e1X, e1Y, 6, 0, Math.PI * 2);
    ctx.arc(e2X, e2Y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    this._drawFloatBadge(ctx, cx, h - 45, "Lớp 1 (gần hạt nhân nhất): Tối đa đúng 2 electron!");
    ctx.textAlign = "left";
  }

  _drawShellScene2(ctx, w, h, t, p) {
    const cx = w / 2;
    const cy = h / 2;

    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(cx, cy, 20, 0, Math.PI * 2);
    ctx.fill();

    const rShells = [65, 120, 175];
    const counts = [2, 8, 8];

    rShells.forEach((r, sIdx) => {
      ctx.strokeStyle = "rgba(56, 189, 248, 0.4)";
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      const numE = counts[sIdx];
      for (let i = 0; i < numE; i++) {
        const a = t * (1.8 / (sIdx + 1)) + (i * Math.PI * 2) / numE;
        const ex = cx + Math.cos(a) * r;
        const ey = cy + Math.sin(a) * r;

        ctx.fillStyle = "#00f2fe";
        ctx.beginPath();
        ctx.arc(ex, ey, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    this._drawFloatBadge(ctx, cx, h - 45, "Quy tắc vàng KHTN 7: Lớp 1 (max 2e) • Lớp 2 (max 8e) • Lớp 3 (max 8e)");
  }

  _drawShellScene3(ctx, w, h, t, p) {
    const cx = w / 2;
    const cy = h / 2;

    const glow = Math.sin(t * 4) * 15;
    ctx.fillStyle = "rgba(16, 185, 129, 0.2)";
    ctx.beginPath();
    ctx.arc(cx, cy, 140 + glow, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, 130, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 0; i < 8; i++) {
      const a = t * 1.2 + (i * Math.PI * 2) / 8;
      const ex = cx + Math.cos(a) * 130;
      const ey = cy + Math.sin(a) * 130;
      ctx.fillStyle = "#34d399";
      ctx.beginPath();
      ctx.arc(ex, ey, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("VỎ BỀN VỮNG KHÍ HIẾM (8e)", cx, cy);
    ctx.textAlign = "left";

    this._drawFloatBadge(ctx, cx, h - 45, "Lớp ngoài cùng 8e giúp khí hiếm trơ bền, các nguyên tố khác học theo!");
  }

  _drawAmuScene1(ctx, w, h, t, p) {
    ctx.save();
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(w / 2 - 240, h / 2 - 80, 480, 130);
    ctx.strokeStyle = "#f43f5e";
    ctx.lineWidth = 2;
    ctx.strokeRect(w / 2 - 240, h / 2 - 80, 480, 130);

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("⚖️ KHỐI LƯỢNG 1 NGUYÊN TỬ CARBON TÍNH THEO GAM:", w / 2 - 210, h / 2 - 50);

    ctx.fillStyle = "#f43f5e";
    ctx.font = "bold 17px monospace";
    ctx.fillText("0,00000000000000000000001992 g", w / 2 - 210, h / 2 - 10);

    ctx.fillStyle = "#fbbf24";
    ctx.font = "italic 13px sans-serif";
    ctx.fillText("👉 22 chữ số 0 sau dấu phẩy! Cần một đơn vị mới tiện lợi hơn: amu!", w / 2 - 210, h / 2 + 25);
    ctx.restore();

    this._drawFloatBadge(ctx, w / 2, h - 45, "Dùng gam đo nguyên tử như dùng thước mét đo kích thước vi khuẩn!");
  }

  _drawAmuScene2(ctx, w, h, t, p) {
    const cx = w / 2;
    const cy = h / 2 - 20;

    const r = 85;
    for (let i = 0; i < 12; i++) {
      const aStart = (i * Math.PI * 2) / 12;
      const aEnd = ((i + 1) * Math.PI * 2) / 12;
      ctx.fillStyle = i === 0 ? "#00f2fe" : "rgba(100, 116, 139, 0.4)";
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, aStart, aEnd);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#0f172a";
      ctx.stroke();
    }

    ctx.fillStyle = "#00f2fe";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("1 miếng = 1/12 khối lượng C-12 = 1 amu", cx - 130, cy + 120);

    this._drawFloatBadge(ctx, cx, h - 45, "1 amu = 1/12 khối lượng Carbon-12 => Proton = 1 amu, Neutron = 1 amu");
  }

  _drawAmuScene3(ctx, w, h, t, p) {
    const cx = w / 2;
    const cy = h / 2 + 20;

    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx - 160, cy);
    ctx.lineTo(cx + 160, cy);
    ctx.stroke();

    ctx.fillStyle = "#64748b";
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx - 20, cy + 40);
    ctx.lineTo(cx + 20, cy + 40);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#ff3366";
    ctx.beginPath();
    ctx.arc(cx - 160, cy - 25, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("1 PROTON", cx - 160, cy - 22);

    ctx.fillStyle = "#00f2fe";
    for (let i = 0; i < 35; i++) {
      const rx = cx + 160 + (Math.sin(i * 12) * 28);
      const ry = cy - 25 + (Math.cos(i * 7) * 20);
      ctx.beginPath();
      ctx.arc(rx, ry, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#38bdf8";
    ctx.fillText("1836 ELECTRON", cx + 160, cy - 55);
    ctx.textAlign = "left";

    this._drawFloatBadge(ctx, cx, h - 45, "1 proton nặng gấp 1836 lần electron => Bỏ qua khối lượng electron!");
  }

  _drawEmptyScene1(ctx, w, h, t, p) {
    const cx = w / 2;
    const cy = h / 2;

    ctx.fillStyle = "rgba(16, 185, 129, 0.2)";
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 240, 140, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
    ctx.beginPath();
    ctx.ellipse(cx, cy, 270, 160, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#94a3b8";
    ctx.font = "12px sans-serif";
    ctx.fillText("Khán đài (Electron như hạt bụi)", cx - 80, cy - 170);

    ctx.fillStyle = "#ff3366";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#ff3366";
    ctx.beginPath();
    ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#ff3366";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("Hạt nhân = Hạt đậu ở giữa sân!", cx + 10, cy - 8);

    this._drawFloatBadge(ctx, cx, h - 45, "Đường kính nguyên tử lớn gấp 10.000 đến 100.000 lần đường kính hạt nhân!");
  }

  _drawEmptyScene2(ctx, w, h, t, p) {
    const cx = w / 2;
    const cy = h / 2 - 10;

    const pulse = Math.sin(t * 6) * 4;
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = 20;
    ctx.fillRect(cx - 30 - pulse / 2, cy - 30 - pulse / 2, 60 + pulse, 60 + pulse);
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - 30 - pulse / 2, cy - 30 - pulse / 2, 60 + pulse, 60 + pulse);
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#000000";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("VIÊN ĐƯỜNG", cx, cy);
    ctx.fillText("1 cm³", cx, cy + 14);

    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("⚖️ Nặng 500.000.000 tấn (= Cả 8 tỷ người cộng lại!)", cx, cy + 60);
    ctx.textAlign = "left";

    this._drawFloatBadge(ctx, cx, h - 45, "Nếu ép hết khoảng trống nguyên tử, 8 tỷ người chỉ nhỏ bằng 1 viên đường!");
  }

  _drawFloatBadge(ctx, x, y, text) {
    ctx.save();
    ctx.font = "bold 13px 'Be Vietnam Pro', sans-serif";
    const textW = ctx.measureText(text).width;
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.fillRect(x - textW / 2 - 16, y - 16, textW + 32, 32);
    ctx.strokeStyle = "#00f2fe";
    ctx.lineWidth = 1;
    ctx.strokeRect(x - textW / 2 - 16, y - 16, textW + 32, 32);

    ctx.fillStyle = "#00f2fe";
    ctx.textAlign = "center";
    ctx.fillText(text, x, y + 5);
    ctx.restore();
  }

  _speakNarration(text) {
    if (!this.synth || !this.enableVoice) return;
    this.synth.cancel();

    try {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "vi-VN";
      utter.rate = this.playbackRate;
      this.synth.speak(utter);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  }

  _formatTime(seconds) {
    const s = Math.floor(seconds || 0);
    const m = Math.floor(s / 60);
    const remS = s % 60;
    return `${m.toString().padStart(2, '0')}:${remS.toString().padStart(2, '0')}`;
  }
}

window.MicroVideoPlayer = MicroVideoPlayer;