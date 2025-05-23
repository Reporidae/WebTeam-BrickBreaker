// Player.js
export class Player {
  constructor(maxGauge = 3) {
    this.skillGauge = 0;
    this.maxGauge = maxGauge;
    this.skillReady = false;
  }

  chargeGauge() {
    if (this.skillGauge < this.maxGauge) {
      this.skillGauge++;
      if (this.skillGauge >= this.maxGauge) {
        this.skillReady = true;
      }
    }
  }

  canUseSkill() {
    return this.skillGauge >= this.maxGauge;
  }

  // Player.js의 useSkill 함수 수정
useSkill(bricks, damage = 3) {
  if (!this.canUseSkill()) return;
  
  let scoreGained = 0;
  
  bricks.forEach(brick => {
    if (!brick.visible) return;
    brick.health -= damage;
    if (brick.health <= 0) {
      brick.visible = false;
      // 파괴된 벽돌에 대한 점수 추가
      scoreGained += brick.maxHealth * 10;
    }
  });
  
  this.skillGauge = 0;
  this.skillReady = false;
  
  return scoreGained; // 획득한 점수 반환
}

  drawSkillGauge(ctx, canvasWidth, canvasHeight) {
    const barHeight = 200;
    const barWidth = 20;
    const x = canvasWidth - 10;
    const y = canvasHeight / 2 - barHeight / 2;
    const filledHeight = barHeight * (this.skillGauge / this.maxGauge);

    // 바 배경
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, barWidth, barHeight);

    // 채워진 부분
    ctx.fillStyle = "red";
    ctx.fillRect(x, y + (barHeight - filledHeight), barWidth, filledHeight);

    // 테두리
    ctx.strokeStyle = "white";
    ctx.strokeRect(x, y, barWidth, barHeight);

    // 텍스트
    ctx.font = "12px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText("필살기", x + barWidth / 2, y + barHeight + 16);
  }
}
