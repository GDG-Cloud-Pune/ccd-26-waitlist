import type * as THREE from "three";
import { boxWithin } from "@/lib/layout-box";
import {
  buildWada,
  cloudGeometries,
  CLOUD_BLUE,
  DARK,
  DOOR,
  EDGE_DARK,
  EDGE_LIGHT,
  PALETTES,
  VIEWS,
  type PaletteName,
  type ViewName,
} from "./wada";

/**
 * Renders the hero scene, ported from the design's ccd-hero3d.js:
 * pieces rise into place, a cloud drops in, the model drifts with the pointer
 * and can be dragged to spin, easing back to the front when let go.
 */

export type HeroSceneOptions = {
  view: ViewName;
  /**
   * The area the Wada is framed within. The scene still draws across the whole
   * container, so the grid and clouds carry on past it instead of being cut off.
   */
  focus?: HTMLElement | null;
  colors: PaletteName;
  /** While this returns true (the loader is up) the entrance animation waits. */
  isHeld?: () => boolean;
  /** Fired once the first frame has been drawn. */
  onReady?: () => void;
};

export type HeroScene = {
  setView: (view: ViewName) => void;
  dispose: () => void;
};

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** Slight overshoot, as in the original. */
const backOut = (t: number) => {
  const c = 1.4;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

const BASE_FOV = 34;
/** Upper bound on drawn pixels, since the canvas can now cover the whole hero. */
const MAX_PIXELS = 4_500_000;

export async function createHeroScene(container: HTMLElement, options: HeroSceneOptions): Promise<HeroScene | null> {
  const T = await import("three");

  const lite = matchMedia("(max-width: 760px), (pointer: coarse)").matches;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new T.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  } catch {
    return null; // No WebGL — the caller shows the flat drawing instead.
  }

  const maxPixelRatio = Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 2);
  if (!lite) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
  }

  const canvas = renderer.domElement;
  canvas.style.cssText = `position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:pan-y;outline:none;cursor:${
    reducedMotion ? "default" : "grab"
  };`;
  container.replaceChildren(canvas);

  const scene = new T.Scene();
  scene.background = new T.Color(0x1e1e1e);
  scene.fog = new T.Fog(0x1e1e1e, 60, 120);

  const camera = new T.PerspectiveCamera(BASE_FOV, 1, 0.1, 300);
  const root = new T.Group();
  scene.add(root);

  // Wide enough to run under the whole hero; the fog fades it out with distance.
  const grid = new T.GridHelper(240, 120, 0x3a3a3a, 0x2a2a2a);
  const gridMaterial = grid.material as THREE.Material;
  gridMaterial.transparent = true;
  gridMaterial.opacity = 0.55;
  root.add(grid);

  scene.add(new T.HemisphereLight(0xdfe8ff, 0x202020, 1.15));
  const key = new T.DirectionalLight(0xffffff, 2.3);
  key.position.set(-14, 20, 20);
  if (renderer.shadowMap.enabled) {
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    const sc = key.shadow.camera;
    sc.left = -22;
    sc.right = 22;
    sc.top = 22;
    sc.bottom = -12;
    sc.near = 1;
    sc.far = 90;
    key.shadow.bias = -0.0006;
    key.shadow.normalBias = 0.02;
  }
  scene.add(key);

  const rim = new T.DirectionalLight(0xffd08a, 1.2);
  rim.position.set(16, 8, -18);
  scene.add(rim);

  const ground = new T.Mesh(new T.PlaneGeometry(300, 300), new T.ShadowMaterial({ opacity: 0.5 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  root.add(ground);

  const materials = new Map<number, THREE.MeshStandardMaterial>();
  const lineMaterials = new Map<number, THREE.LineBasicMaterial>();
  const palette = PALETTES[options.colors] ?? PALETTES.classic;
  const luminance = (c: number) => {
    const r = ((c >> 16) & 255) / 255;
    const g = ((c >> 8) & 255) / 255;
    const b = (c & 255) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const material = (c: number) => {
    let m = materials.get(c);
    if (!m) {
      m = new T.MeshStandardMaterial({ color: c, flatShading: true, roughness: 0.78, metalness: 0 });
      materials.set(c, m);
    }
    return m;
  };
  const lineMaterial = (c: number) => {
    const edge = luminance(c) > 0.7 ? EDGE_DARK : EDGE_LIGHT;
    let m = lineMaterials.get(edge);
    if (!m) {
      m = new T.LineBasicMaterial({ color: edge });
      lineMaterials.set(edge, m);
    }
    return m;
  };

  // Pieces are grouped by their entrance depth so they rise in waves.
  const waves = new Map<number, THREE.Group>();
  const parts: THREE.Group[] = [];
  buildWada(T, lite, palette).forEach(({ geometry, color, depth }) => {
    let group = waves.get(depth);
    if (!group) {
      group = new T.Group();
      group.userData.depth = depth;
      waves.set(depth, group);
      root.add(group);
      parts.push(group);
    }
    const mesh = new T.Mesh(geometry, material(color));
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    if (color !== DARK && color !== DOOR) {
      group.add(new T.LineSegments(new T.EdgesGeometry(geometry, 20), lineMaterial(color)));
    }
  });

  const makeCloud = (scale: number, solid: boolean) => {
    const group = new T.Group();
    cloudGeometries(T).forEach((geometry) => {
      const mesh = new T.Mesh(
        geometry,
        new T.MeshStandardMaterial({ color: CLOUD_BLUE, flatShading: true, roughness: 0.6, transparent: !solid, opacity: solid ? 1 : 0.5 }),
      );
      mesh.castShadow = solid;
      group.add(
        mesh,
        new T.LineSegments(
          new T.EdgesGeometry(geometry, 15),
          new T.LineBasicMaterial({ color: EDGE_LIGHT, transparent: !solid, opacity: solid ? 1 : 0.45 }),
        ),
      );
    });
    group.scale.setScalar(scale);
    return group;
  };

  const heroCloud = makeCloud(1.15, true);
  root.add(heroCloud);
  const CLOUD_WRAP = 110;
  const driftingClouds = (
    [
      [-74, 19, -32, 2.2, 0.2],
      [-40, 24, -46, 2.6, 0.16],
      [-12, 15, -24, 1.8, 0.25],
      [6, 22, -34, 2.4, 0.18],
      [34, 19, -40, 2.1, 0.14],
      [66, 23, -50, 2.8, 0.12],
    ] as const
  ).map(
    ([x, y, z, scale, speed]) => {
      const cloud = makeCloud(scale, false);
      cloud.position.set(x, y, z);
      cloud.userData.speed = speed;
      root.add(cloud);
      return cloud;
    },
  );

  const state = {
    view: options.view,
    t0: performance.now(),
    last: performance.now(),
    mx: 0,
    my: 0,
    tx: 0,
    ty: 0,
    rot: 0,
    vel: 0,
    dragging: false,
    lastDrag: 0,
    lastX: 0,
    visible: true,
    width: 0,
    height: 0,
    ready: false,
    raf: 0,
  };

  /** Last pointer activity, so the scene only runs at full frame rate while someone is interacting. */
  let lastInput = 0;
  let idleTick = 0;

  const onPointerMove = (e: PointerEvent) => {
    lastInput = performance.now();
    state.mx = (e.clientX / window.innerWidth) * 2 - 1;
    state.my = (e.clientY / window.innerHeight) * 2 - 1;
    if (state.dragging) {
      const dx = e.clientX - state.lastX;
      state.lastX = e.clientX;
      state.vel = dx * 0.006;
      state.rot += state.vel;
    }
  };
  const onPointerDown = (e: PointerEvent) => {
    if (reducedMotion) return;
    state.dragging = true;
    state.lastX = e.clientX;
    state.vel = 0;
    canvas.style.cursor = "grabbing";
  };
  const onPointerUp = () => {
    if (!state.dragging) return;
    state.dragging = false;
    state.lastDrag = performance.now();
    canvas.style.cursor = "grab";
  };

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  canvas.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);

  const target = new T.Vector3();
  const direction = new T.Vector3();

  const fit = () => {
    const v = VIEWS[state.view] ?? VIEWS.low;
    target.fromArray(v.target);
    direction.fromArray(v.dir).normalize();
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    state.width = w;
    state.height = h;
    renderer.setPixelRatio(Math.max(1, Math.min(maxPixelRatio, Math.sqrt(MAX_PIXELS / (w * h)))));
    renderer.setSize(w, h, false);

    // Frame the Wada within the focus area, as if the canvas were only that big...
    const focus = options.focus ? boxWithin(options.focus, container) : { x: 0, y: 0, width: w, height: h };
    const fw = Math.max(1, focus.width);
    const fh = Math.max(1, focus.height);
    const halfV = Math.tan((BASE_FOV * Math.PI) / 360);
    const distance = Math.max(v.width / (halfV * (fw / fh)), v.height / halfV);
    camera.position.copy(target).addScaledVector(direction, distance);
    camera.lookAt(target);

    // ...then widen the frustum to the full canvas, keeping the focus centre on the camera axis.
    const cx = focus.x + fw / 2;
    const cy = focus.y + fh / 2;
    const fullW = 2 * Math.max(cx, w - cx);
    const fullH = 2 * Math.max(cy, h - cy);
    camera.fov = Math.min(170, (2 * Math.atan(halfV * (fullH / fh)) * 180) / Math.PI);
    camera.aspect = fullW / fullH;
    camera.setViewOffset(fullW, fullH, fullW / 2 - cx, fullH / 2 - cy, w, h);
    camera.far = distance + 140;
    camera.updateProjectionMatrix();
    scene.fog = new T.Fog(0x1e1e1e, distance + 14, distance + 80);
    if (reducedMotion || !state.raf) frame(performance.now());
  };

  function frame(now: number) {
    if (options.isHeld?.()) state.t0 = now;
    const t = (now - state.t0) / 1000;
    const dt = Math.min(0.05, (now - state.last) / 1000);
    state.last = now;

    parts.forEach((group) => {
      const k = reducedMotion ? 1 : clamp01((t - 0.2 - (group.userData.depth as number) * 1.4) / 0.85);
      group.visible = k > 0;
      group.position.y = (1 - backOut(k)) * 18;
    });

    const ck = reducedMotion ? 1 : clamp01((t - 1.6) / 0.9);
    heroCloud.position.set(0.3 + Math.sin(t * 0.5) * 0.35, 15.6 + (1 - backOut(ck)) * 10 + Math.sin(t * 1.1) * 0.3, 0.4);
    heroCloud.scale.setScalar(1.15 * Math.max(0.001, ck));
    heroCloud.rotation.y = reducedMotion ? 0.3 : Math.sin(t * 0.3) * 0.4;

    if (!reducedMotion) {
      state.tx += (state.mx - state.tx) * 0.05;
      state.ty += (state.my - state.ty) * 0.05;
      if (!state.dragging) {
        state.rot += state.vel;
        state.vel *= 0.93;
        if (now - state.lastDrag > 1600) {
          const home = Math.round(state.rot / (Math.PI * 2)) * Math.PI * 2;
          state.rot += (home - state.rot) * 0.02;
        }
      }
      root.rotation.y = state.rot + state.tx * 0.2 + Math.sin(t * 0.25) * 0.04;
      // Kept small: the grid runs under the whole hero, so its far edge swings a long way per degree.
      root.rotation.x = state.ty * 0.0018;
      driftingClouds.forEach((cloud) => {
        cloud.position.x += (cloud.userData.speed as number) * dt;
        if (cloud.position.x > CLOUD_WRAP) cloud.position.x = -CLOUD_WRAP;
      });
    }

    renderer.render(scene, camera);

    if (!state.ready) {
      state.ready = true;
      options.onReady?.();
    }
  }

  const resizeObserver = new ResizeObserver(fit);
  resizeObserver.observe(container);
  if (options.focus) resizeObserver.observe(options.focus);
  fit();

  const intersectionObserver = new IntersectionObserver((entries) => {
    state.visible = entries[0].isIntersecting;
  });
  intersectionObserver.observe(container);

  if (!reducedMotion) {
    const loop = (now: number) => {
      state.raf = requestAnimationFrame(loop);
      if (!state.visible) return;
      // Full rate during the entrance, a drag, its inertia and recent pointer movement;
      // otherwise only the clouds drift, which looks the same at half the GPU work.
      const busy =
        now - state.t0 < 5000 ||
        state.dragging ||
        Math.abs(state.vel) > 1e-4 ||
        now - state.lastDrag < 3000 ||
        now - lastInput < 1500;
      if (busy || idleTick++ % 2 === 0) frame(now);
    };
    state.raf = requestAnimationFrame(loop);
  }

  return {
    setView(view) {
      state.view = view;
      fit();
    },
    dispose() {
      cancelAnimationFrame(state.raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("pointerdown", onPointerDown);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose?.();
        const mat = mesh.material;
        if (mat) (Array.isArray(mat) ? mat : [mat]).forEach((m) => m.dispose());
      });
      renderer.dispose();
      canvas.remove();
    },
  };
}
