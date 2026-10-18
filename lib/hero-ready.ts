/** Tiny signal between the first-visit loader and the 3D hero. */

let ready = false;
let held = false;
const waiting = new Set<() => void>();

export function markHeroReady() {
  if (ready) return;
  ready = true;
  waiting.forEach((cb) => cb());
  waiting.clear();
}

export function isHeroReady() {
  return ready;
}

/** While held, the hero's entrance animation waits for the loader to finish. */
export function setHeroHold(value: boolean) {
  held = value;
}

export function isHeroHeld() {
  return held;
}

export function onHeroReady(cb: () => void) {
  if (ready) {
    cb();
    return () => {};
  }
  waiting.add(cb);
  return () => waiting.delete(cb);
}
