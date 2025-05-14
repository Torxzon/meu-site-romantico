let highestZ = 1;
class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;
  activePaper = null;

  init(paper) {
    document.addEventListener('mousemove', (e) => this.onMove(e));
    document.addEventListener('touchmove', (e) => this.onMove(e));

    paper.addEventListener('mousedown', (e) => this.onStart(e, paper));
    paper.addEventListener('touchstart', (e) => this.onStart(e, paper));

    window.addEventListener('mouseup', () => this.onEnd());
    window.addEventListener('touchend', () => this.onEnd());
  }

  getEventPosition(e) {
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    } else {
      return {
        x: e.clientX,
        y: e.clientY
      };
    }
  }

  onMove(e) {
    const pos = this.getEventPosition(e);
    this.mouseX = pos.x;
    this.mouseY = pos.y;

    if (!this.rotating) {
      this.velX = this.mouseX - this.prevMouseX;
      this.velY = this.mouseY - this.prevMouseY;
    }

    const dirX = this.mouseX - this.mouseTouchX;
    const dirY = this.mouseY - this.mouseTouchY;
    const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
    const dirNormalizedX = dirX / dirLength;
    const dirNormalizedY = dirY / dirLength;
    const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
    let degrees = (360 + Math.round(180 * angle / Math.PI)) % 360;

    if (this.rotating) {
      this.rotation = degrees;
    }

    if (this.holdingPaper) {
      if (!this.rotating) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }
      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;
      this.activePaper.style.transform =
        `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    }

    if (e.cancelable) e.preventDefault();
  }

  onStart(e, paper) {
    const pos = this.getEventPosition(e);
    if (this.holdingPaper) return;
    this.holdingPaper = true;
    this.activePaper = paper;

    paper.style.zIndex = highestZ;
    highestZ += 1;

    this.mouseTouchX = pos.x;
    this.mouseTouchY = pos.y;
    this.prevMouseX = pos.x;
    this.prevMouseY = pos.y;

    if (e.touches && e.touches.length > 1) {
      this.rotating = true;
    }

    if (e.cancelable) e.preventDefault();
  }

  onEnd() {
    this.holdingPaper = false;
    this.rotating = false;
    this.activePaper = null;
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
