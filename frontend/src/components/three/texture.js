import * as THREE from "three";

import { SHEET_VARIANTS } from "./variants";

// Procedural resume textures (no network, crisp at any DPR)
const roundRect = (ctx, x, y, w, h, r) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

export function makeResumeTexture(variant = SHEET_VARIANTS[0], layout = 0) {
  const W = 1024;
  const H = 1448;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  const grad = ctx.createLinearGradient(0, 0, W, 0);
  grad.addColorStop(0, variant.a);
  grad.addColorStop(1, variant.b);

  const sidebar = layout % 2 === 1;
  const left = sidebar ? 360 : 80;

  if (sidebar) {
    ctx.fillStyle = variant.chip;
    ctx.fillRect(0, 0, 300, H);
  } else {
    ctx.globalAlpha = 0.14;
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, 330);
    ctx.globalAlpha = 1;
  }

  // avatar
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(sidebar ? 150 : 150, sidebar ? 170 : 165, 70, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,.85)";
  ctx.beginPath();
  ctx.arc(sidebar ? 150 : 150, sidebar ? 150 : 145, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(150, sidebar ? 205 : 200, 40, 24, 0, Math.PI, 0);
  ctx.fill();

  const nameX = sidebar ? left : 260;

  // name + title
  ctx.fillStyle = "#1c1f3d";
  roundRect(ctx, nameX, sidebar ? 110 : 120, 420, 44, 14);
  ctx.fill();
  ctx.fillStyle = grad;
  roundRect(ctx, nameX, sidebar ? 176 : 186, 280, 26, 13);
  ctx.fill();
  ctx.fillStyle = "#c8cde0";
  for (let i = 0; i < 3; i++) {
    roundRect(ctx, nameX + i * 150, sidebar ? 226 : 236, 130, 16, 8);
    ctx.fill();
  }

  const line = (x, y, w, c = "#e3e6f2") => {
    ctx.fillStyle = c;
    roundRect(ctx, x, y, w, 16, 8);
    ctx.fill();
  };

  const section = (x, y, w, rows) => {
    ctx.fillStyle = variant.a;
    roundRect(ctx, x, y, 170, 22, 11);
    ctx.fill();
    ctx.fillStyle = variant.chip;
    ctx.fillRect(x, y + 38, w, 3);
    let yy = y + 66;
    for (let i = 0; i < rows; i++) {
      line(x, yy, w * (0.62 + ((i * 37) % 30) / 100));
      yy += 34;
    }
    return yy + 26;
  };

  let y = sidebar ? 340 : 400;
  const colW = W - left - 80;
  y = section(left, y, colW, 4);
  y = section(left, y, colW, 5);
  y = section(left, y, colW, 3);

  // skill chips
  ctx.fillStyle = variant.a;
  roundRect(ctx, left, y, 120, 22, 11);
  ctx.fill();
  let cx = left;
  let cy = y + 56;
  const chips = [140, 110, 170, 120, 150, 100, 130];
  chips.forEach((cw) => {
    if (cx + cw > W - 80) {
      cx = left;
      cy += 62;
    }
    ctx.fillStyle = variant.chip;
    roundRect(ctx, cx, cy, cw, 44, 22);
    ctx.fill();
    ctx.fillStyle = variant.a;
    roundRect(ctx, cx + 22, cy + 16, cw - 44, 12, 6);
    ctx.fill();
    cx += cw + 16;
  });

  if (sidebar) {
    let sy = 340;
    for (let s = 0; s < 3; s++) {
      ctx.fillStyle = variant.a;
      roundRect(ctx, 50, sy, 120, 20, 10);
      ctx.fill();
      sy += 50;
      for (let i = 0; i < 4; i++) {
        line(50, sy, 160 + ((i * 29) % 40), "#ffffff");
        sy += 32;
      }
      sy += 40;
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}
