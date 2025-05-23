// GaugeUI.js
export function updateGaugeUI(player) {
  if (!player) return;
  
  const percent = (player.skillGauge / player.maxGauge) * 100;
  const gaugeElement = document.getElementById("gauge-fill");
  
  if (gaugeElement) {
    gaugeElement.style.height = percent + "%";
    
    // 게이지가 가득 차면 색상 변경 (시각적 효과)
    if (percent >= 100) {
      gaugeElement.style.backgroundColor = "#ffcc00"; // 노란색 (준비됨)
    } else {
      gaugeElement.style.backgroundColor = "red"; // 기본 색상
    }
  }
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