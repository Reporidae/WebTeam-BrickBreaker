// GaugeUI.js
export function updateGaugeUI(player) {
  const percent = (player.skillGauge / player.maxGauge) * 100;
  document.getElementById("gauge-fill").style.height = percent + "%";
}

/*
export function updateGaugePosition() {
  const canvas = document.getElementById("game-canvas");
  const gauge = document.getElementById("skill-gauge-wrapper");

  const canvasRect = canvas.getBoundingClientRect();
  const windowWidth = window.innerWidth;

  const canvasRight = canvasRect.right;
  const windowRight = windowWidth;
  const middle = canvasRight + (windowRight - canvasRight) / 2;

  gauge.style.left = `${middle - gauge.offsetWidth / 2}px`;
}
*/