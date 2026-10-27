/* Animated silk-ribbon background drawn on a canvas.
   Original artwork generated with sine waves — no external assets. */
(() => {
  'use strict';
  const cv = document.getElementById('wave');
  if (!cv || !cv.getContext) return;
  const ctx = cv.getContext('2d');

  let w = 0, h = 0, dpr = 1, t = 0, last = 0, raf = 0;
  let hue = 210, hueTarget = 210, sat = 80, satTarget = 80;
  let motion = true;

  const dust = Array.from({ length: 64 }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 1.3 + 0.3,
    v: Math.random() * 0.012 + 0.004,
    p: Math.random() * Math.PI * 2
  }));

  const layers = [
    { off: 0.0, amp: 0.060, speed: 0.22, alpha: 0.16, y: 0.46, thick: 0.10 },
    { off: 1.7, amp: 0.075, speed: 0.17, alpha: 0.11, y: 0.54, thick: 0.15 },
    { off: 3.1, amp: 0.050, speed: 0.28, alpha: 0.09, y: 0.62, thick: 0.08 },
    { off: 4.6, amp: 0.085, speed: 0.13, alpha: 0.07, y: 0.38, thick: 0.18 }
  ];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = cv.clientWidth; h = cv.clientHeight;
    cv.width = Math.max(1, Math.floor(w * dpr));
    cv.height = Math.max(1, Math.floor(h * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!motion) draw();
  }

  function edge(L, k, shift) {
    return (
      L.y * h +
      Math.sin(k * 3.2 + t * L.speed + L.off + shift) * L.amp * h +
      Math.sin(k * 7.3 - t * L.speed * 0.6 + L.off * 2 + shift) * L.amp * 0.32 * h +
      (k - 0.5) * h * 0.16
    );
  }

  function ribbon(L) {
    const g = ctx.createLinearGradient(0, 0, w, 0);
    g.addColorStop(0, `hsla(${hue},${sat}%,70%,0)`);
    g.addColorStop(0.45, `hsla(${hue},${sat}%,76%,${L.alpha})`);
    g.addColorStop(1, `hsla(${hue + 24},${sat}%,68%,0)`);
    ctx.beginPath();
    const step = Math.max(6, Math.round(w / 140));
    for (let x = 0; x <= w + step; x += step) {
      const y = edge(L, x / w, 0);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    for (let x = w + step; x >= 0; x -= step) {
      ctx.lineTo(x, edge(L, x / w, 0.55) + L.thick * h);
    }
    ctx.closePath();
    ctx.fillStyle = g;
    ctx.fill();
    // crisp highlight along the upper edge
    ctx.beginPath();
    for (let x = 0; x <= w + step; x += step) {
      const y = edge(L, x / w, 0);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `hsla(${hue},${sat}%,82%,${L.alpha * 0.9})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    layers.forEach(ribbon);
    for (const d of dust) {
      const tw = 0.35 + 0.65 * Math.abs(Math.sin(t * 0.6 + d.p));
      const x = ((d.x + t * d.v * 0.2) % 1) * w;
      const y = (d.y + Math.sin(t * 0.2 + d.p) * 0.01) * h;
      ctx.beginPath();
      ctx.arc(x, y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${hue},${sat}%,88%,${0.35 * tw})`;
      ctx.fill();
    }
  }

  function frame(ts) {
    raf = requestAnimationFrame(frame);
    if (ts - last < 28) return; // ~35 fps is plenty for slow silk
    const dt = Math.min((ts - last) / 1000, 0.1) || 0.03;
    last = ts;
    t += dt;
    hue += (hueTarget - hue) * 0.06;
    sat += (satTarget - sat) * 0.06;
    draw();
  }

  function start() {
    cancelAnimationFrame(raf);
    if (motion && !document.hidden) { last = 0; raf = requestAnimationFrame(frame); }
    else { hue = hueTarget; sat = satTarget; t = t || 2.4; draw(); }
  }

  window.XMBWave = {
    setColor(h2, s2) { hueTarget = h2; satTarget = s2; if (!motion) { hue = h2; sat = s2; draw(); } },
    setMotion(on) { motion = !!on; start(); }
  };

  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', start);
  resize();
  start();
})();
