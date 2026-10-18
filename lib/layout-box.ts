/** An element's position in page layout, ignoring transforms such as a parallax offset. */
export function layoutBox(el: HTMLElement) {
  let x = 0;
  let y = 0;
  for (let node: HTMLElement | null = el; node; node = node.offsetParent as HTMLElement | null) {
    x += node.offsetLeft;
    y += node.offsetTop;
  }
  return { x, y, width: el.offsetWidth, height: el.offsetHeight };
}

/** Where `el` sits inside `container`, in the container's own layout coordinates. */
export function boxWithin(el: HTMLElement, container: HTMLElement) {
  const box = layoutBox(el);
  const origin = layoutBox(container);
  return { x: box.x - origin.x, y: box.y - origin.y, width: box.width, height: box.height };
}
