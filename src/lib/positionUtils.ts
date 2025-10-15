export function clampToViewport(x: number, popW: number, padding = 8): number {
  return Math.max(padding, Math.min(x, window.innerWidth - popW - padding));
}

export function clampToViewportY(y: number, popH: number, padding = 8): number {
  return Math.max(padding, Math.min(y, window.innerHeight - popH - padding));
}
