export class Bubble {
  x: number;
  y: number;
  r: number;
  color: string;
  vx: number;
  vy: number;
  constructor(private context: CanvasRenderingContext2D, private w: number, private h: number) {
    this.r = random(30, 80);
    this.x = random(this.r, w - this.r);
    this.y = random(this.r, h - this.r);
    this.color = randomColor();
    this.vx = random(-2, 2) || random(-2, 2);
    this.vy = random(-1, 1) || random(-1, 1);
  }
  draw() {
    const context = this.context
    context.beginPath();
    context.fillStyle = this.color;
    context.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    context.fill();
  }
  move() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < this.r || this.x + this.r > this.w) {
      this.vx = -this.vx;
    }
    if (this.y < this.r || this.y + this.r > this.h) {
      this.vy = -this.vy;
    }
    this.draw();
  }
  resize(w: number, h: number) {
    this.w = w
    this.h = h
  }
}
export function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}
// 随机颜色生成器
export function randomColor(): string {
  var r, g, b, a;
  r = random(0, 255);
  g = random(0, 255);
  b = random(0, 255);
  a = Math.random();
  return `rgba(${r},${g},${b},${a})`;
}
