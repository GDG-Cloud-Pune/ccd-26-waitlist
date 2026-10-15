import type * as THREE from "three";

/**
 * Geometry for the hero's Shaniwar Wada, ported from the design's ccd-hero3d.js.
 * Built from the uploaded STL: 225×85×100 units → scale 0.14, Z-up → Y-up, front (+x) → +Z.
 */

type Three = typeof THREE;

const B = { b: 0x4285f4, g: 0x34a853, y: 0xf9ab00, r: 0xea4335, w: 0xf0f0f0, k: 0x2a2a2a };
export const DARK = 0x1e1e1e;
export const DOOR = 0x3a2a1c;

export type Palette = { tl: number; tr: number; gate: number; drum: number; roof: number; step: number; trim: number };

export const PALETTES = {
  classic: { tl: B.b, tr: B.b, gate: B.y, drum: B.y, roof: B.w, step: B.w, trim: B.w },
  four: { tl: B.b, tr: B.r, gate: B.y, drum: B.g, roof: B.w, step: B.w, trim: B.w },
  blue: { tl: B.b, tr: B.b, gate: B.b, drum: B.b, roof: B.b, step: B.b, trim: B.b },
  white: { tl: B.w, tr: B.w, gate: B.w, drum: B.w, roof: B.w, step: B.w, trim: B.w },
  charcoal: { tl: B.k, tr: B.k, gate: B.k, drum: B.k, roof: B.y, step: B.k, trim: B.y },
  green: { tl: B.g, tr: B.g, gate: B.y, drum: B.b, roof: B.w, step: B.w, trim: B.w },
  red: { tl: B.r, tr: B.r, gate: B.w, drum: B.y, roof: B.b, step: B.w, trim: B.b },
  yellow: { tl: B.y, tr: B.y, gate: B.b, drum: B.r, roof: B.w, step: B.w, trim: B.w },
  sandstone: { tl: 0xc79a6b, tr: 0xc79a6b, gate: 0xd9b48a, drum: 0xa8784e, roof: 0xe8d6bb, step: 0xe8d6bb, trim: 0xe8d6bb },
} satisfies Record<string, Palette>;

export type PaletteName = keyof typeof PALETTES;

export type View = { target: [number, number, number]; dir: [number, number, number]; width: number; height: number };

export const VIEWS = {
  low: { target: [1.2, 7.6, 0.5], dir: [0.24, -0.1, 1], width: 19.5, height: 10 },
  front: { target: [0, 7, 0.5], dir: [0, 0.03, 1], width: 17, height: 9.5 },
  frontlow: { target: [0, 8, 0.5], dir: [0, -0.2, 1], width: 17.5, height: 10 },
  left: { target: [-1.2, 7.4, 0.5], dir: [-0.3, -0.05, 1], width: 19.5, height: 10 },
  right: { target: [1.3, 7.4, 0.5], dir: [0.3, -0.05, 1], width: 19.5, height: 10 },
  high: { target: [1.5, 5.5, 0.5], dir: [0.45, 0.5, 1], width: 20, height: 10 },
  bird: { target: [0, 4, 0], dir: [0.15, 1.2, 1], width: 19, height: 12 },
  worm: { target: [0, 9, 0.5], dir: [0.15, -0.38, 1], width: 19, height: 11 },
  gate: { target: [0, 6.5, 2.5], dir: [0.12, -0.04, 1], width: 9, height: 7 },
} satisfies Record<string, View>;

export type ViewName = keyof typeof VIEWS;

export type Part = { geometry: THREE.BufferGeometry; color: number; depth: number };

const SIDES = 16;
const STEP = (Math.PI * 2) / SIDES;

function polygon(T: Three, radius: number, sides: number) {
  const shape = new T.Shape();
  for (let k = 0; k < sides; k++) {
    const a = ((k + 0.5) * Math.PI * 2) / sides;
    const x = Math.cos(a) * radius;
    const y = Math.sin(a) * radius;
    if (k) shape.lineTo(x, y);
    else shape.moveTo(x, y);
  }
  shape.closePath();
  return shape;
}

function prism(T: Three, radius: number, height: number, hole?: number) {
  const shape = polygon(T, radius, SIDES);
  if (hole) {
    const path = new T.Path();
    path.setFromPoints(polygon(T, hole, SIDES).getPoints().reverse());
    shape.holes.push(path);
  }
  const geometry = new T.ExtrudeGeometry(shape, { depth: height, bevelEnabled: false });
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

function archBlock(T: Three, w: number, h: number, archW: number, archH: number, d: number) {
  const r = archW / 2;
  const springLine = archH - r * 1.05;
  const shape = new T.Shape();
  shape.moveTo(-w / 2, 0);
  shape.lineTo(-r, 0);
  shape.lineTo(-r, springLine);
  shape.absarc(0, springLine, r, Math.PI, 0, true);
  shape.lineTo(r, 0);
  shape.lineTo(w / 2, 0);
  shape.lineTo(w / 2, h);
  shape.lineTo(-w / 2, h);
  shape.closePath();
  const geometry = new T.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false, curveSegments: 10 });
  geometry.translate(0, 0, -d / 2);
  return geometry;
}

function archPanel(T: Three, w: number, h: number, d: number) {
  const r = w / 2;
  const shape = new T.Shape();
  shape.moveTo(-r, 0);
  shape.lineTo(r, 0);
  shape.lineTo(r, h - r);
  shape.absarc(0, h - r, r, 0, Math.PI, false);
  shape.closePath();
  const geometry = new T.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false, curveSegments: 8 });
  geometry.translate(0, 0, -d / 2);
  return geometry;
}

function gable(T: Three, w: number, h: number, len: number) {
  const shape = new T.Shape();
  shape.moveTo(-w / 2, 0);
  shape.lineTo(w / 2, 0);
  shape.lineTo(0, h);
  shape.closePath();
  const geometry = new T.ExtrudeGeometry(shape, { depth: len, bevelEnabled: false });
  geometry.translate(0, 0, -len / 2);
  return geometry;
}

function hipRoof(T: Three, w: number, d: number, h: number, ridgeW: number, ridgeD: number) {
  const geometry = new T.BufferGeometry();
  const a = w / 2;
  const b = d / 2;
  const c = ridgeW / 2;
  const e = ridgeD / 2;
  const v = [
    [-a, 0, -b], [a, 0, -b], [a, 0, b], [-a, 0, b],
    [-c, h, -e], [c, h, -e], [c, h, e], [-c, h, e],
  ];
  const faces = [
    [3, 2, 6], [3, 6, 7], [1, 0, 4], [1, 4, 5], [2, 1, 5], [2, 5, 6],
    [0, 3, 7], [0, 7, 4], [4, 7, 6], [4, 6, 5], [0, 1, 2], [0, 2, 3],
  ];
  const positions: number[] = [];
  faces.forEach((face) => face.forEach((i) => positions.push(...v[i])));
  geometry.setAttribute("position", new T.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return geometry;
}

/** `lite` drops the smaller ornaments on phones and other low-power devices. */
export function buildWada(T: Three, lite: boolean, K: Palette): Part[] {
  const parts: Part[] = [];
  const add = (geometry: THREE.BufferGeometry, color: number, x: number, y: number, z: number, depth: number, ry?: number) => {
    if (ry) geometry.rotateY(ry);
    geometry.translate(x, y, z);
    parts.push({ geometry, color, depth });
  };

  const R = 5.39;
  const TX = 9.8;
  const apothem = Math.cos(Math.PI / SIDES);

  // The two flanking towers
  [-1, 1].forEach((s, i) => {
    const x = s * TX;
    const d0 = i * 0.12;
    const tc = s < 0 ? K.tl : K.tr;
    add(prism(T, 5.7, 0.98), tc, x, 0, 0, d0);
    add(prism(T, R, 8.3), tc, x, 0.98, 0, d0 + 0.08);
    add(prism(T, 5.85, 0.28), tc, x, 9.24, 0, d0 + 0.32);
    add(prism(T, 5.75, 1.3, 5.15), tc, x, 9.52, 0, d0 + 0.4);
    add(prism(T, 5.2, 0.06), tc, x, 10.2, 0, d0 + 0.4);
    add(prism(T, 5.9, 0.14, 5.1), tc, x, 10.82, 0, d0 + 0.46);
    for (let k = 0; k < SIDES; k++) {
      const a = k * STEP;
      add(new T.BoxGeometry(0.13, 1.0, 0.12), DARK, x + Math.cos(a) * R * apothem, 6.9, Math.sin(a) * R * apothem, d0 + 0.08, Math.PI / 2 - a);
      if (!lite && k % 2 === 0) {
        add(archPanel(T, 0.38, 0.6, 0.1), DARK, x + Math.cos(a) * 5.75 * apothem, 9.85, Math.sin(a) * 5.75 * apothem, d0 + 0.4, Math.PI / 2 - a);
      }
      if (!lite && k % 2 === 1) {
        add(new T.BoxGeometry(0.1, 0.7, 0.1), DARK, x + Math.cos(a) * R * apothem, 3.6, Math.sin(a) * R * apothem, d0 + 0.08, Math.PI / 2 - a);
      }
    }
  });

  // Gate (Delhi-facing main gate): block with arch, recessed inner arch, doors
  add(new T.BoxGeometry(12, 0.98, 5), K.gate, 0, 0.49, 1.0, 0.2);
  add(archBlock(T, 11, 8.4, 3.2, 6.3, 4.4), K.gate, 0, 0.98, 1.15, 0.24);
  add(archBlock(T, 4.6, 7.2, 2.5, 5.6, 0.3), K.gate, 0, 0.98, 3.45, 0.28);
  add(new T.BoxGeometry(3.2, 6.3, 0.2), DOOR, 0, 4.13, -0.4, 0.24);
  add(new T.BoxGeometry(11.4, 0.2, 4.7), K.trim, 0, 9.4, 1.15, 0.34);
  for (let k = -4; k <= 4; k++) add(archPanel(T, 0.36, 0.5, 0.1), DARK, k * 0.62, 8.55, 3.38, 0.28);

  // Steps
  ([[5.4, 1.6], [4.8, 1.0], [4.2, 0.45]] as const).forEach(([w, z], j) =>
    add(new T.BoxGeometry(w, 0.33, 1.9 - z + 0.2), K.step, 0, 0.16 + j * 0.33, 3.35 + (1.9 - z + 0.2) / 2, 0),
  );

  // Nagarkhana (drum house): arcade of five arches between two projecting wings
  add(new T.BoxGeometry(7.2, 2.9, 2.8), K.drum, 0, 10.95, -0.3, 0.5);
  for (let k = -2; k <= 2; k++) add(archPanel(T, 0.72, 1.9, 0.12), DARK, k * 1.2, 9.9, 1.12, 0.5);
  add(new T.BoxGeometry(7.4, 0.18, 3.0), K.trim, 0, 9.62, -0.2, 0.5);
  [-1, 1].forEach((s) => {
    add(new T.BoxGeometry(2.5, 3.1, 4.2), K.drum, s * 4.85, 11.05, 0.1, 0.56);
    add(archPanel(T, 0.7, 1.4, 0.1), DARK, s * 4.85, 10.4, 2.22, 0.56);
    add(gable(T, 2.9, 1.15, 4.7), K.roof, s * 4.85, 12.6, 0.1, 0.78);
  });
  add(hipRoof(T, 7.6, 3.4, 1.25, 4.6, 0.5), K.roof, 0, 12.4, -0.3, 0.72);
  add(new T.BoxGeometry(12.6, 0.14, 4.6), K.roof, 0, 12.46, 0.1, 0.7);

  return parts;
}

export function cloudGeometries(T: Three) {
  return ([[0, 0, 0, 1.1], [1.15, -0.25, 0.1, 0.8], [-1.1, -0.3, 0, 0.78], [0.5, 0.5, -0.1, 0.82], [-0.5, 0.42, 0.25, 0.7]] as const).map(
    ([x, y, z, r]) => {
      const geometry = new T.IcosahedronGeometry(r, 1);
      geometry.translate(x, y, z);
      return geometry;
    },
  );
}

export const CLOUD_BLUE = B.b;
export const EDGE_LIGHT = 0xf0f0f0;
export const EDGE_DARK = 0x8a8a8a;
