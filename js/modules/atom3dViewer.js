/**
 * Atom3DViewer: Mô hình tương tác 3D nguyên tử 60 FPS
 * Cho phép học sinh "chạm", kéo xoay 360 độ các lớp vỏ electron, phóng to/thu nhỏ,
 * hiển thị chi tiết hạt nhân (proton, neutron) và electron quay theo quỹ đạo Rutherford - Bohr.
 * Hỗ trợ chuyển đổi tức thì giữa 20 nguyên tố đầu tiên.
 */

class Atom3DViewer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");

    this.currentElement = ELEMENTS_DATA[5]; // Mặc định Carbon (C)
    this.rotationX = 0.35;
    this.rotationY = 0.45;
    this.zoom = 1.0;
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.animationTime = 0;
    this.isPaused = false;
    this.showOrbits = true;
    this.showLabels = true;
    this.selectedParticle = null;

    this.protons = [];
    this.neutrons = [];
    this.electrons = [];

    this._setupCanvasResolution();
    this._bindEvents();
    try {
      this.loadElement(this.currentElement.z);
    } catch (err) {
      console.warn("Lỗi tải nguyên tố ban đầu:", err);
    }
    this._startRenderLoop();
  }

  _setupCanvasResolution() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = (rect.width || 600) * dpr;
    this.canvas.height = (rect.height || 460) * dpr;
    this.ctx.scale(dpr, dpr);
    this.logicalWidth = rect.width || 600;
    this.logicalHeight = rect.height || 460;
  }

  _bindEvents() {
    window.addEventListener("resize", () => this._setupCanvasResolution());

    // Chuột
    this.canvas.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      this._checkParticleClick(e.offsetX, e.offsetY);
    });

    window.addEventListener("mousemove", (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.lastMouseX;
      const dy = e.clientY - this.lastMouseY;
      this.rotationY += dx * 0.008;
      this.rotationX += dy * 0.008;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });

    window.addEventListener("mouseup", () => {
      this.isDragging = false;
    });

    // Cuộn chuột zoom
    this.canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      this.zoom = Math.max(0.5, Math.min(2.2, this.zoom + delta));
    }, { passive: false });

    // Cảm ứng Touch (Điện thoại, Máy tính bảng)
    let touchStartDist = 0;
    this.canvas.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.lastMouseX = e.touches[0].clientX;
        this.lastMouseY = e.touches[0].clientY;
        const rect = this.canvas.getBoundingClientRect();
        this._checkParticleClick(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
      } else if (e.touches.length === 2) {
        touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    });

    this.canvas.addEventListener("touchmove", (e) => {
      if (e.touches.length === 1 && this.isDragging) {
        const dx = e.touches[0].clientX - this.lastMouseX;
        const dy = e.touches[0].clientY - this.lastMouseY;
        this.rotationY += dx * 0.01;
        this.rotationX += dy * 0.01;
        this.lastMouseX = e.touches[0].clientX;
        this.lastMouseY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = (dist - touchStartDist) * 0.005;
        this.zoom = Math.max(0.5, Math.min(2.2, this.zoom + factor));
        touchStartDist = dist;
      }
    });

    this.canvas.addEventListener("touchend", () => {
      this.isDragging = false;
    });
  }

  loadElement(z) {
    const el = ELEMENTS_DATA.find(e => e.z === z) || ELEMENTS_DATA[0];
    this.currentElement = el;
    this.selectedParticle = null;

    // Khởi tạo các hạt trong hạt nhân
    this.protons = [];
    this.neutrons = [];
    const nucleusRadius = Math.max(12, Math.min(32, Math.sqrt(el.p + el.n) * 5.2));

    for (let i = 0; i < el.p; i++) {
      const phi = Math.acos(-1 + (2 * i) / Math.max(1, el.p));
      const theta = Math.sqrt(el.p * Math.PI) * phi;
      const r = nucleusRadius * Math.cbrt((i + 1) / el.p) * 0.85;
      this.protons.push({
        type: "p",
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        radius: 4.5,
        color: "#ff3366", // Đỏ Neon
        name: "Proton (+1)"
      });
    }

    for (let i = 0; i < el.n; i++) {
      const phi = Math.acos(-1 + (2 * i) / Math.max(1, el.n));
      const theta = Math.sqrt(el.n * Math.PI) * phi + 1.2;
      const r = nucleusRadius * Math.cbrt((i + 1) / el.n) * 0.85;
      this.neutrons.push({
        type: "n",
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        radius: 4.5,
        color: "#eab308", // Vàng hổ phách
        name: "Neutron (0)"
      });
    }

    // Khởi tạo electron theo từng lớp vỏ
    this.electrons = [];
    const shellBaseRadii = [65, 115, 165, 205]; // Lớp 1, 2, 3, 4

    el.shells.forEach((count, shellIdx) => {
      const shellRadius = shellBaseRadii[shellIdx];
      // Góc nghiêng mặt phẳng quỹ đạo 3D khác nhau tạo cảm giác không gian vũ trụ
      const inclinationX = (shellIdx * 0.45 + 0.2);
      const inclinationZ = (shellIdx * 0.35);

      for (let i = 0; i < count; i++) {
        const baseAngle = (i / count) * Math.PI * 2;
        this.electrons.push({
          type: "e",
          shell: shellIdx + 1,
          shellRadius: shellRadius,
          baseAngle: baseAngle,
          speed: (1.8 / (shellIdx + 1)) * 0.8,
          inclinationX: inclinationX,
          inclinationZ: inclinationZ,
          radius: 3.8,
          color: "#00f2fe", // Xanh Neon rực rỡ
          name: `Electron (-1) - Lớp ${shellIdx + 1}`
        });
      }
    });

    // Cập nhật thông tin UI ngoài
    this._updateExternalUI();

    // Ghi nhận thành tích khám phá
    try {
      const user = window.appStorage.getCurrentUser();
      if (user) {
        if (!Array.isArray(user.exploredElements)) {
          user.exploredElements = [];
        }
        if (!user.exploredElements.includes(z)) {
          user.exploredElements.push(z);
          if (user.exploredElements.length >= 20) {
            window.appStorage.unlockBadge("explorer_20");
          }
          window.appStorage.saveUserProfile(user);
        }
      }
    } catch (err) {
      console.warn("Lỗi ghi nhận exploredElements:", err);
    }
  }

  _updateExternalUI() {
    const el = this.currentElement;
    const nameEl = document.getElementById("atom-display-name");
    const formulaEl = document.getElementById("atom-display-formula");
    const pCountEl = document.getElementById("atom-p-count");
    const nCountEl = document.getElementById("atom-n-count");
    const eCountEl = document.getElementById("atom-e-count");
    const amuEl = document.getElementById("atom-mass-amu");
    const shellsEl = document.getElementById("atom-shells-dist");
    const appTextEl = document.getElementById("atom-application-text");

    if (nameEl) nameEl.textContent = `${el.nameVi} (${el.symbol})`;
    if (formulaEl) formulaEl.textContent = `Số hiệu nguyên tử Z = ${el.z} | ${el.category}`;
    if (pCountEl) pCountEl.textContent = el.p;
    if (nCountEl) nCountEl.textContent = el.n;
    if (eCountEl) eCountEl.textContent = el.e;
    if (amuEl) amuEl.textContent = `${el.massAmu} amu`;
    if (shellsEl) shellsEl.textContent = el.shells.join(" - ");
    if (appTextEl) appTextEl.textContent = el.application;
  }

  _checkParticleClick(mx, my) {
    // Tìm hạt gần vị trí click trong hệ tọa độ chiếu
    const cx = this.logicalWidth / 2;
    const cy = this.logicalHeight / 2;
    let closest = null;
    let minDist = 18;

    // Kiểm tra electrons
    for (const e of this.projectedElectrons || []) {
      const d = Math.hypot(e.screenX - mx, e.screenY - my);
      if (d < minDist) {
        minDist = d;
        closest = e.data;
      }
    }

    // Kiểm tra protons/neutrons
    if (!closest) {
      for (const p of this.projectedNucleus || []) {
        const d = Math.hypot(p.screenX - mx, p.screenY - my);
        if (d < minDist) {
          minDist = d;
          closest = p.data;
        }
      }
    }

    this.selectedParticle = closest;
    if (closest && window.soundFX) {
      window.soundFX.playClick();
    }
  }

  _project3D(x, y, z, cx, cy) {
    // Xoay quanh trục Y
    let x1 = x * Math.cos(this.rotationY) + z * Math.sin(this.rotationY);
    let z1 = -x * Math.sin(this.rotationY) + z * Math.cos(this.rotationY);

    // Xoay quanh trục X
    let y2 = y * Math.cos(this.rotationX) - z1 * Math.sin(this.rotationX);
    let z2 = y * Math.sin(this.rotationX) + z1 * Math.cos(this.rotationX);

    // Phép chiếu phối cảnh Perspective
    const fov = 420;
    const scale = (fov / (fov + z2 * this.zoom)) * this.zoom;
    return {
      x: cx + x1 * scale,
      y: cy + y2 * scale,
      scale: scale,
      depth: z2
    };
  }

  _startRenderLoop() {
    const render = () => {
      if (!this.isPaused) {
        this.animationTime += 0.025;
      }
      this._drawScene();
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  _drawScene() {
    const ctx = this.ctx;
    const w = this.logicalWidth;
    const h = this.logicalHeight;
    const cx = w / 2;
    const cy = h / 2;

    ctx.clearRect(0, 0, w, h);

    // Vẽ hiệu ứng vầng sáng vũ trụ ở tâm (Atomic Core Glow)
    const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 260 * this.zoom);
    bgGrad.addColorStop(0, "rgba(56, 189, 248, 0.12)");
    bgGrad.addColorStop(0.5, "rgba(139, 92, 246, 0.06)");
    bgGrad.addColorStop(1, "rgba(11, 12, 27, 0)");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // Vẽ các vòng quỹ đạo electron (3D Orbits)
    if (this.showOrbits) {
      const shellBaseRadii = [65, 115, 165, 205];
      this.currentElement.shells.forEach((count, sIdx) => {
        const r = shellBaseRadii[sIdx];
        const incX = (sIdx * 0.45 + 0.2);
        const incZ = (sIdx * 0.35);

        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.1) {
          let ox = r * Math.cos(a);
          let oy = r * Math.sin(a) * Math.sin(incX);
          let oz = r * Math.sin(a) * Math.cos(incX);

          const p = this._project3D(ox, oy, oz, cx, cy);
          if (a === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.strokeStyle = `rgba(0, 242, 254, ${0.22 - sIdx * 0.04})`;
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      });
    }

    // Tính toán vị trí electron
    this.projectedElectrons = [];
    this.electrons.forEach(e => {
      const angle = e.baseAngle + this.animationTime * e.speed;
      const ex = e.shellRadius * Math.cos(angle);
      const ey = e.shellRadius * Math.sin(angle) * Math.sin(e.inclinationX);
      const ez = e.shellRadius * Math.sin(angle) * Math.cos(e.inclinationX);

      const proj = this._project3D(ex, ey, ez, cx, cy);
      this.projectedElectrons.push({
        screenX: proj.x,
        screenY: proj.y,
        depth: proj.depth,
        scale: proj.scale,
        data: e
      });
    });

    // Tính toán vị trí các hạt proton & neutron trong hạt nhân
    this.projectedNucleus = [];
    [...this.protons, ...this.neutrons].forEach(n => {
      const proj = this._project3D(n.x, n.y, n.z, cx, cy);
      this.projectedNucleus.push({
        screenX: proj.x,
        screenY: proj.y,
        depth: proj.depth,
        scale: proj.scale,
        data: n
      });
    });

    // Gom toàn bộ đối tượng để vẽ theo thứ tự độ sâu Z-depth (Z-sorting)
    const renderList = [
      ...this.projectedNucleus,
      ...this.projectedElectrons
    ].sort((a, b) => b.depth - a.depth);

    // Vẽ từng hạt
    renderList.forEach(item => {
      const d = item.data;
      const drawRadius = Math.max(1.8, d.radius * item.scale);

      ctx.save();
      ctx.beginPath();
      ctx.arc(item.screenX, item.screenY, drawRadius, 0, Math.PI * 2);

      // Hiệu ứng bóng đổ và phát sáng Neon
      ctx.shadowColor = d.color;
      ctx.shadowBlur = d.type === "e" ? 14 : 8;

      const grad = ctx.createRadialGradient(
        item.screenX - drawRadius * 0.3,
        item.screenY - drawRadius * 0.3,
        drawRadius * 0.1,
        item.screenX,
        item.screenY,
        drawRadius
      );
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.4, d.color);
      grad.addColorStop(1, d.color);

      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();

      // Vẽ đuôi vệt sáng cho electron chuyển động nhanh
      if (d.type === "e") {
        ctx.beginPath();
        const prevAngle = (d.baseAngle + (this.animationTime - 0.08) * d.speed);
        const pex = d.shellRadius * Math.cos(prevAngle);
        const pey = d.shellRadius * Math.sin(prevAngle) * Math.sin(d.inclinationX);
        const pez = d.shellRadius * Math.sin(prevAngle) * Math.cos(d.inclinationX);
        const prevP = this._project3D(pex, pey, pez, cx, cy);

        ctx.strokeStyle = "rgba(0, 242, 254, 0.4)";
        ctx.lineWidth = drawRadius * 0.8;
        ctx.moveTo(prevP.x, prevP.y);
        ctx.lineTo(item.screenX, item.screenY);
        ctx.stroke();
      }
    });

    // Vẽ nhãn hạt nhân ở tâm nếu được bật
    if (this.showLabels) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.font = "11px 'Be Vietnam Pro', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`Hạt nhân (+${this.currentElement.p})`, cx, cy - 26 * this.zoom);
    }

    // Hiển thị bóng thoại Tooltip nếu người học click chọn 1 hạt
    if (this.selectedParticle) {
      this._drawParticleTooltip(ctx, cx, cy);
    }
  }

  _drawParticleTooltip(ctx, cx, cy) {
    const p = this.selectedParticle;
    const boxW = 200;
    const boxH = 68;
    const bx = 16;
    const by = 16;

    ctx.save();
    ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(bx, by, boxW, boxH, 10);
    } else {
      ctx.rect(bx, by, boxW, boxH);
    }
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 13px 'Be Vietnam Pro', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(p.name, bx + 12, by + 24);

    let info = "";
    if (p.type === "p") info = "Điện tích: +1 | Khối lượng: ~1 amu";
    else if (p.type === "n") info = "Điện tích: 0 | Khối lượng: ~1 amu";
    else if (p.type === "e") info = "Điện tích: -1 | Khối lượng: ~0.00055 amu";

    ctx.fillStyle = "#cbd5e1";
    ctx.font = "11px 'Be Vietnam Pro', sans-serif";
    ctx.fillText(info, bx + 12, by + 46);
    ctx.restore();
  }

  resetView() {
    this.rotationX = 0.35;
    this.rotationY = 0.45;
    this.zoom = 1.0;
    this.selectedParticle = null;
  }

  toggleAnimation() {
    this.isPaused = !this.isPaused;
    return this.isPaused;
  }

  toggleOrbits() {
    this.showOrbits = !this.showOrbits;
    return this.showOrbits;
  }
}

window.Atom3DViewer = Atom3DViewer;
