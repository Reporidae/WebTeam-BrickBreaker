export class Boss {
  constructor(canvasWidth, health = 10, phasePercent = 20) {
    this.x = 0;
    this.y = 0;
    this.width = canvasWidth;
    this.height = 40;
    this.health = health;
    this.maxHealth = health;
    this.visible = true;
    this.phasePercent = phasePercent;
    this.phaseTriggerCount = 0;
  }

  draw(ctx) {
    if (!this.visible) return;
    const ratio = this.health / this.maxHealth;

    ctx.fillStyle = "#550000";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.fillStyle = "#FF3333";
    ctx.fillRect(this.x, this.y, this.width * ratio, this.height);

    ctx.strokeStyle = "#FFF";
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFF";
    ctx.textAlign = "center";
    ctx.fillText(`BOSS HP: ${this.health}`, this.width / 2, this.height - 10);
  }

  checkCollision(ball, onPhaseDown) {
    if (!this.visible) return;

    if
    (
      ball.y - ball.radius < this.y + this.height &&
      ball.x > this.x &&
      ball.x < this.x + this.width
    )
    {
      ball.dy = Math.abs(ball.dy);
      this.health -= ball.power;

      const percentLost = 1 - (this.health / this.maxHealth);
      const expectedTriggers = Math.floor((percentLost + 0.000001) * (100 / this.phasePercent));

      while (this.phaseTriggerCount < expectedTriggers)
      {
        this.phaseTriggerCount++;

        if (this.health > 0) {
          console.log(`📢 [${this.health}/${this.maxHealth}] 보스 체력 ${this.phasePercent * this.phaseTriggerCount}% 깎임 → 벽돌 추가`);
          if (typeof onPhaseDown === "function") {
            onPhaseDown();
          }
        }
      }
      if (this.health <= 0) this.visible = false;
    }
  }
}

      /*
      const prevPercent = Math.floor(this.health / 20);
      this.health -= ball.power;
      const nowPercent = Math.floor(this.health / 20);

      if (prevPercent > nowPercent && typeof onPhaseDown === "function") {
        onPhaseDown();
      }*/
      /*
       const before = Math.floor(this.health / this.maxHealth * 100);
       this.health -= ball.power;
       const after = Math.floor(this.health / this.maxHealth * 100);
 
       if (Math.floor(before / 20) > Math.floor(after / 20)) {
         onPhaseDown();
       }
 */
      //console.log(`보스 체력 감소됨: ${this.health} / ${this.maxHealth}`);