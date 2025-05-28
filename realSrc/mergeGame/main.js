window.addEventListener('DOMContentLoaded', () => {
  setupCharacterModalEvents();
  setupShopPopupEvents();
  setupBackButtons();
  setsupStartButtons();
  itemPurchase();
  abilityHover();
  itemPurchase();
  abilityShop_CharacterPopUp();
  characterLevelUp();
  displayCoin();
  startLifeTimer();
  displayLife();

});

let previousScreen = null;  // 이전에 보였던 화면 저장

function showScreen(screenId) {
  // 화면 목록
  const screens = ['village', 'characterShop', 'abilityShop', 'itemShop', 'shopPopup'];
  screens.forEach(id => {
    const el = id === 'shopPopup' ? document.getElementById('shopPopup') : document.querySelector('.' + id);
    if (el) el.style.display = 'none';
  });

  let screenElement;
  if(screenId === 'shopPopup') {
    screenElement = document.getElementById('shopPopup');
  } else {
    screenElement = document.querySelector('.' + screenId);
  }
  if(screenElement) screenElement.style.display = (screenId === 'shopPopup') ? 'flex' : 'block';

  // 여기서 backVillageButton 텍스트 조절
  const backVillageBtn = document.getElementById("backVillageButton");
  if (screenId === 'village') {
    backVillageBtn.textContent = "Go to Shop";
  } else {
    backVillageBtn.textContent = "village";
  }
}


function setupCharacterModalEvents() {
  const infos = document.querySelectorAll('.character-info');
  const modal = document.getElementById('characterModal');
  const closeBtn = document.querySelector('.close-button');
  const nameEl = document.getElementById('modalCharacterName');
  const stat1El = document.getElementById('modalStat1');
  const stat2El = document.getElementById('modalStat2');
  const actionBtn = document.getElementById('modalActionButton');

  const purchasedCharacters = {};
  let currentCharacter = null;

  infos.forEach(info => {
    info.addEventListener('click', () => {
      const name = info.querySelector('.character-name').innerText;
      const stat1 = info.querySelectorAll('.stat-line')[0].innerText;
      const stat2 = info.querySelectorAll('.stat-line')[1].innerText;
      const imgEl = info.querySelector('.character-image-small').getAttribute('src');

      nameEl.textContent = name;
      stat1El.textContent = stat1;
      stat2El.textContent = stat2;

      actionBtn.textContent = purchasedCharacters[name] ? '적용' : '구매';

      actionBtn.onclick = () => {
        if (!purchasedCharacters[name]) {
          purchasedCharacters[name] = true;
          actionBtn.textContent = '적용';
          alert(`${name}을(를) 구매했습니다!`);
        } else {
          // 기존 캐릭터 카드 업데이트
          const leftCard = document.querySelector('.character-card');
          leftCard.querySelector('.character-image').src = imgEl;
          leftCard.querySelector('.now-character-name').textContent = name;
          currentCharacter = name;

          // 기존 캐릭터 이미지 제거 (필요하다면 먼저 이 작업 진행)
          const rightDisplay = document.getElementById('villageRightDisplay');

          const existingImage = rightDisplay.querySelector('#village-character');
          if (existingImage) {
            rightDisplay.removeChild(existingImage);
        }

        // 새로운 이미지 엘리먼트 생성
        const newImage = document.createElement('img');
        newImage.id = 'village-character';
        newImage.src = imgEl;
        newImage.alt = '캐릭터 이미지';
        newImage.style.marginTop = 'auto'; // 하단 정렬 (필요시)

        // 이미지만 추가
        rightDisplay.appendChild(newImage);


        modal.style.display = 'none';
      }
    };

    modal.style.display = 'block';
  });
});

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
}

function setupShopPopupEvents() {
  const shopPopup = document.getElementById('shopPopup');
  const characterBtn = document.getElementById('characterBtn');
  const abilityBtn = document.getElementById('abilityBtn');
  const itemBtn = document.getElementById('itemBtn');
  const closeShopPopup = document.getElementById('closeShopPopup');

  const characterShop = document.querySelector('.characterShop');
  const abilityShop = document.querySelector('.abilityShop');
  const itemShop = document.querySelector('.itemShop');
  const village = document.querySelector('.village');
  const gameDiv = document.querySelector(".main-game");

  characterBtn.addEventListener('click', () => {
    characterShop.style.display = 'block';
    abilityShop.style.display = 'none';
    if(itemShop) itemShop.style.display = 'none';
    village.style.display = 'none';
    shopPopup.style.display = 'none';
    gameDiv.style.display = "none";
  });

  abilityBtn.addEventListener('click', () => {
    characterShop.style.display = 'none';
    abilityShop.style.display = 'block';
    if(itemShop) itemShop.style.display = 'none';
    village.style.display = 'none';
    shopPopup.style.display = 'none';
    gameDiv.style.display = "none";
  });

  itemBtn.addEventListener('click', () => {
    characterShop.style.display = 'none';
    abilityShop.style.display = 'none';
    if(itemShop) itemShop.style.display = 'block';
    village.style.display = 'none';
    shopPopup.style.display = 'none';
    gameDiv.style.display = "none";
  });

  closeShopPopup.addEventListener('click', () => {
    shopPopup.style.display = 'none';
  });
}

function setupBackButtons() {
  const backVillageBtn = document.getElementById("backVillageButton");
  const village = document.querySelector('.village');

  backVillageBtn.addEventListener("click", () => {
    previousScreen = null;  // 마을로 이동하므로 이전 화면 초기화
    showScreen('shopPopup');
    village.style.display = 'block';
  });

  document.getElementById("backButton").addEventListener("click", () => {
    if (previousScreen) {
      showScreen(previousScreen);
      if (previousScreen === 'shopPopup') {
        village.style.display = 'none';
      }
      previousScreen = null;  // 한번 뒤로가면 초기화
    } else {
      // 이전 화면 없으면 기본 동작: 마을 보여주기
      showScreen('village');
      village.style.display = 'block';
    }
  });
}

function setsupStartButtons(){
  const startButton = document.getElementById("startButton");
  const gameDiv = document.querySelector(".main-game");

  const characterShop = document.querySelector('.characterShop');
  const abilityShop = document.querySelector('.abilityShop');
  const itemShop = document.querySelector('.itemShop');
  const village = document.querySelector('.village');

  startButton.addEventListener("click", function () {
    gameDiv.style.display = "block"; // 게임 화면 보이기
    characterShop.style.display = 'none';
    abilityShop.style.display = 'none';
    if(itemShop) itemShop.style.display = 'none';
    village.style.display = 'none';
    shopPopup.style.display = 'none';
  });
}
//----------header
var level = 1;
var life = 2;
var coin = 100000;
function increaseLevel() {
    level++;
    const bar = document.getElementById("levelFill");
    bar.style.width = `${Math.min(level * 90, 450)}px`; // 최대 450px
}
function displayLife(){
  for(let i = 1; i<=5; i++){
    document.getElementById(`lifeIcon_img${i}`).style.display ="none";
  }
  for(let i = 1; i<=life; i++){
    document.getElementById(`lifeIcon_img${i}`).style.display ="inline";
  }
}
function decreaseLife(){
  let lifeIcon = document.getElementById(`lifeIcon_img${life}`);
  lifeIcon.style.display = "none";
  life--;
}
function increaseLife(){
  let lifeIcon = document.getElementById(`lifeIcon_img${life}`);
  lifeIcon.style.display = "inline";
  life++;
}
function decreaseCoin(decreCoin){
  coin -= decreCoin;
  document.getElementById('coinView').textContent = `${coin}원`;

}
function increaseCoin(increCoin){
  coin += increCoin;
  document.getElementById('coinView').textContent = `${coin}원`;

}
function displayCoin(){
  document.getElementById('coinView').textContent = `${coin}원`;

}
let selectedIndex1 = null;
function abilityHover() {
  for (let i = 1; i <= 3; i++) {
    let ability = document.getElementById(`ability${i}`);
    let abilitydescriptionPopUp = document.querySelector(`.abilityShop #descriptionPopUp${i}`);

    // Hover 시 설명 표시 (단, 고정된 게 없을 때만)
    ability.addEventListener("mouseenter", () => {
      if (selectedIndex1 === null) {
        let popup = document.querySelector(`.abilityShop #descriptionPopUp${i}`);
        if (popup) popup.style.display = "block";
      }
    });

    ability.addEventListener("mouseleave", () => {
      if (selectedIndex1 === null) {
        let popup = document.querySelector(`.abilityShop #descriptionPopUp${i}`);
        if (popup) popup.style.display = "none";
      }
    });

    // 클릭 시 고정
    ability.addEventListener("click", () => {
      // 이전 선택 해제
      if (selectedIndex1 !== null) {
        document.getElementById(`ability${selectedIndex1}`).style.border = "none";
        let prevPopup = document.querySelector(`.abilityShop #descriptionPopUp${selectedIndex1}`);
        if (prevPopup) prevPopup.style.display = "none";
      }

      ability.style.border = "3px solid black";
      let popup = document.querySelector(`.abilityShop #descriptionPopUp${i}`);
      if (popup) popup.style.display = "block";
      selectedIndex1 = i;
    });
  }
}
let selectedIndex2 = null;
let itemPurchased = [false, false, false, false, false, false];

function itemPurchase() {
  let purchaseButton = document.querySelector(`#purchaseButton`);

  for (let i = 1; i <= 6; i++) {
    let item = document.getElementById(`item${i}`);

    // Hover 시 설명 표시 (단, 고정된 게 없을 때만)
    item.addEventListener("mouseenter", () => {
      if (selectedIndex2 === null) {
        let popup = document.querySelector(`.itemShop #descriptionPopUp${i}`);
        if (popup) popup.style.display = "block";
      }
    });

    item.addEventListener("mouseleave", () => {
      if (selectedIndex2 === null) {
        let popup = document.querySelector(`.itemShop #descriptionPopUp${i}`);
        if (popup) popup.style.display = "none";
      }
    });

    // 클릭 시 고정
    item.addEventListener("click", () => {
      // 이전 선택 해제
      if (selectedIndex2 !== null) {
        document.getElementById(`item${selectedIndex2}`).style.border = "none";
        let prevPopup = document.querySelector(`.itemShop #descriptionPopUp${selectedIndex2}`);
        if (prevPopup) prevPopup.style.display = "none";
      }

      // 현재 선택 표시
      item.style.border = "3px solid black";
      let popup = document.querySelector(`.itemShop #descriptionPopUp${i}`);
      if (popup) popup.style.display = "block";
      selectedIndex2 = i;
    });
  }

  purchaseButton.addEventListener("click", () => {
    if (selectedIndex2 !== null) {
      itemPurchased[selectedIndex2 - 1] = true;
      alert(`아이템 ${selectedIndex2}번을 구매했습니다!`);
    } else {
      alert("아이템을 먼저 선택해주세요!");
    }
  });
}
function abilityShop_CharacterPopUp(){
  let selectedIndex=null;
  let characterPopUp = document.getElementById('character_popup');
  let characterButton = document.getElementById('characterButton');
  let closePopupBtn = document.getElementById('closePopupBtn');
  let saveAndCloseBtn = document.getElementById('saveAndCloseBtn');
  let character_hold1 = document.querySelector('#character_hold1');
  let character_hold2 = document.querySelector('#character_hold2');
  let character_hold3 = document.querySelector('#character_hold3');
  let character_hold4 = document.querySelector('#character_hold4');
  let leftUpperWrapper1 = document.querySelector('.abilityShop #leftUpperWrapper1');
  let leftUpperWrapper2 = document.querySelector('.abilityShop #leftUpperWrapper2');
  let leftUpperWrapper3 = document.querySelector('.abilityShop #leftUpperWrapper3');
  let leftUpperWrapper4 = document.querySelector('.abilityShop #leftUpperWrapper4');
  let selectedWrapper;

  for (let i = 1; i <= 4; i++) {
    let wrapper = document.querySelector(`.abilityShop #leftUpperWrapper${i}`);
    if (wrapper.style.display === "block") {
      selectedWrapper = wrapper;
      break;
    }
  }

  if (!selectedWrapper) {
    alert("선택된 캐릭터가 없습니다.");
    return;
  }

  let img = selectedWrapper.querySelector("img");
  let src = img.src;
  let pre;
  if (src.includes("character_img1.png")) {
    pre = 1;
  } else if (src.includes("img2.jpg")) {
    pre = 2;
  } else if (src.includes("img1.jpg")) {
    pre = 3;
  } else if (src.includes("img3.jpg")) {
    pre = 4;
  }
  characterButton.addEventListener("click", ()=>{
    characterPopUp.style.display = "block";
  });
  closePopupBtn.addEventListener("click", ()=>{
    characterPopUp.style.display = "none";
  });
  character_hold1.addEventListener("click", ()=>{
    selectedIndex=1;
  });
  character_hold2.addEventListener("click", ()=>{
    selectedIndex=2;
  });
  character_hold3.addEventListener("click", ()=>{
    selectedIndex=3;
  });
  character_hold4.addEventListener("click", ()=>{
    selectedIndex=4;
  });
  saveAndCloseBtn.addEventListener("click", ()=>{
    
    for(let i=1; i<=4; i++){
      let temp = document.querySelector(`.abilityShop #leftUpperWrapper${i}`);
      temp.style.display = "none";
    }
    if (selectedIndex === null) {
      alert("캐릭터를 선택해주세요!");
      if(pre ==1){
        leftUpperWrapper1.style.display = "block";
      }
      else if(pre==2){
        leftUpperWrapper2.style.display = "block";
      }
      else if(pre==3){
        leftUpperWrapper3.style.display = "block";
      }
      else if(pre==4){
        leftUpperWrapper4.style.display = "block";
      }
      return;
    }
    if(selectedIndex===1){
      leftUpperWrapper1.style.display = "block";
      characterPopUp.style.display = "none";
      return;
    }
    if(selectedIndex===2){
      leftUpperWrapper2.style.display = "block";
      characterPopUp.style.display = "none";
      return
    }
    if(selectedIndex===3){
      leftUpperWrapper3.style.display = "block";
      characterPopUp.style.display = "none";
      return
    }
    if(selectedIndex===4){
      leftUpperWrapper4.style.display = "block";
      characterPopUp.style.display = "none";
      return
    }
  });
}
let character1_level = 1;
let character2_level = 1;
let character3_level = 1;
let character4_level = 1;
function characterLevelUp() {
  let levelupButton = document.getElementById('levelupButton');
  levelupButton.addEventListener("click", () => {
    let selectedWrapper;

    for (let i = 1; i <= 4; i++) {
      let wrapper = document.querySelector(`.abilityShop #leftUpperWrapper${i}`);
      if (wrapper.style.display === "block") {
        selectedWrapper = wrapper;
        break;
      }
    }

    if (!selectedWrapper) {
      alert("선택된 캐릭터가 없습니다.");
      return;
    }

    let img = selectedWrapper.querySelector("img");
    let src = img.src;
    let level, name;

    if (src.includes("character_img1.png")) {
      level = character1_level;
      name = "OOOOO";
    } else if (src.includes("img2.jpg")) {
      level = character2_level;
      name = "PPPPP";
    } else if (src.includes("img1.jpg")) {
      level = character3_level;
      name = "MMMMM";
    } else if (src.includes("img3.jpg")) {
      level = character4_level;
      name = "NNNNN";
    } else {
      alert("캐릭터 이미지를 인식하지 못했습니다.");
      return;
    }

    if (level >= 3) {
      alert("캐릭터 레벨은 Lv.3까지만 존재합니다.");
      return;
    }

    let cost = level * 10000;

    if (coin < cost) {
      alert(`현재 남은 코인은 ${coin}원입니다. 코인 부족으로 레벨업이 불가합니다.`);
      return;
    }

    let yn = confirm(`Lv.${level} → Lv.${level + 1}로 레벨업 하시겠습니까? (${cost}원 소모)`);
    if (yn) {
      coin -= cost;
      level++;

      if (src.includes("character_img1.png")) character1_level = level;
      else if (src.includes("img2.jpg")) character2_level = level;
      else if (src.includes("img1.jpg")) character3_level = level;
      else if (src.includes("img3.jpg")) character4_level = level;

      const levelText = selectedWrapper.querySelector('#characterLevel');
      levelText.innerText = `${name}[Lv.${level}]`;
    }
  });
}


let lifeTimer = null;

function startLifeTimer() {
  // 이미 타이머 돌고 있거나 최대치면 시작 안 함
  if (lifeTimer || life >= 5) return;

  lifeTimer = setInterval(() => {
    if (life < 5) {
      increaseLife();  // 이미 정의된 함수라고 가정

      if (life === 5) {
        clearInterval(lifeTimer);
        lifeTimer = null;
      }
    }
  }, 1 * 60 * 1000); // 5분
}

// GAME.JS 합치기-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


const sounds = {
  paddleHit: new Audio("../../assets/sounds/paddle_hit.mp3"),
  brickHit: new Audio("../../assets/sounds/brick_hit.mp3"),
  bossHit: new Audio("../../assets/sounds/boss_hit.mp3"),
  skill1: new Audio("../../assets/sounds/skill1.mp3"),
  bgm1: new Audio("../../assets/music/bgm1.mp3")
};
sounds.bgm1.loop = true;


class Boss {
  constructor(canvasWidth, health = 10, phasePercent = 20) {
      this.x = 0;
      this.y = 0;
      this.width = canvasWidth;
      this.height = 80; // 높이를 40에서 80으로 증가
      this.health = health;
      this.maxHealth = health;
      this.visible = true;
      this.phasePercent = phasePercent;
      this.phaseTriggerCount = 0;
      this.projectiles = [];
      this.attackInterval = 3000;
      this.pattern = "straight";
      // 보스 이미지 로딩
      this.image = new Image();
      this.image.src = 'Boss.png'; // 로컬 이미지 파일
  }

  draw(ctx) {
      if (!this.visible) return;
      const ratio = this.health / this.maxHealth;

      // 보스 이미지가 로드되었으면 이미지로, 아니면 기존 방식으로
      if (this.image.complete && this.image.naturalWidth > 0) {
          // 이미지를 상단 중앙에 배치하되, 상단 부분이 잘 보이도록 조정
          const imageWidth = this.width * 0.3; // 보스 영역의 30% 크기
          const imageHeight = this.height * 1.8; // 세로는 더 크게 (상단 부분 유지)
          const imageX = this.x + (this.width - imageWidth) / 2; // 중앙 정렬
          const imageY = this.y - this.height * 0.4; // 위쪽으로 올려서 상단 부분 강조
          
          // 불투명하게 그리기
          ctx.save();
          ctx.globalAlpha = 1.0; // 완전 불투명
          ctx.drawImage(this.image, imageX, imageY, imageWidth, imageHeight);
          ctx.restore();
          
          // 체력바를 이미지 아래에 오버레이
          ctx.fillStyle = "rgba(85, 0, 0, 0.8)";
          ctx.fillRect(this.x, this.y + this.height - 20, this.width, 20);

          ctx.fillStyle = "#FF3333";
          ctx.fillRect(this.x, this.y + this.height - 20, this.width * ratio, 20);

          ctx.strokeStyle = "#FFF";
          ctx.strokeRect(this.x, this.y + this.height - 20, this.width, 20);
      } else {
          // 기존 방식 (이미지 로드 실패 시)
          ctx.fillStyle = "#550000";
          ctx.fillRect(this.x, this.y, this.width, this.height);

          ctx.fillStyle = "#FF3333";
          ctx.fillRect(this.x, this.y, this.width * ratio, this.height);

          ctx.strokeStyle = "#FFF";
          ctx.strokeRect(this.x, this.y, this.width, this.height);
      }

      ctx.font = "16px Arial";
      ctx.fillStyle = "#FFF";
      ctx.textAlign = "center";
      ctx.fillText(`BOSS HP: ${this.health}`, this.width / 2, this.y + this.height - 5);
  }

  checkCollision(ball, onPhaseDown) {
      if (!this.visible) return false;

      if (ball.y - ball.radius < this.y + this.height &&
          ball.x > this.x &&
          ball.x < this.x + this.width) {
          
          ball.dy = Math.abs(ball.dy);
          this.health -= ball.power;
          sounds.bossHit.play();

          const percentLost = 1 - (this.health / this.maxHealth);
          const expectedTriggers = Math.floor((percentLost + 0.000001) * (100 / this.phasePercent));

          while (this.phaseTriggerCount < expectedTriggers) {
              this.phaseTriggerCount++;
              if (this.health > 0 && typeof onPhaseDown === "function") {
                  onPhaseDown();
              }
          }

          if (this.health <= 0) {
              this.visible = false;
              return true; // 보스 처치됨
          }
      }
      return false;
  }

  spawnProjectiles(stage = 1) {
      if (this.pattern === "straight") {
          for (let i = 0; i < 2; i++) {
              const x = Math.random() * (this.width - 20);
              this.projectiles.push({
                  x: x,
                  y: this.height,
                  width: 20,
                  height: 20,
                  dx: 0,
                  dy: 3, // 투사체 속도도 줄임 (4 -> 3)
                  type: "straight"
              });
          }
      } else if (this.pattern === "varied") {
          const patternType = Math.floor(Math.random() * 3);
          
          if (patternType === 0) {
              // 빠른 직선
              this.projectiles.push({
                  x: Math.random() * (this.width - 20),
                  y: this.height,
                  width: 20,
                  height: 20,
                  dx: 0,
                  dy: 5 + Math.random() * 2, // 속도 줄임 (7+3 -> 5+2)
                  type: "fast"
              });
          } else if (patternType === 1) {
              // 포물선
              const dir = Math.random() > 0.5 ? 1 : -1;
              this.projectiles.push({
                  x: Math.random() * (this.width - 20),
                  y: this.height,
                  width: 20,
                  height: 20,
                  dx: dir * (1.5 + Math.random() * 1.5), // 속도 줄임 (2+2 -> 1.5+1.5)
                  dy: 1.5 + Math.random() * 1.5, // 속도 줄임 (2+2 -> 1.5+1.5)
                  gravity: 0.2 + Math.random() * 0.1, // 중력 줄임
                  type: "parabola"
              });
          } else {
              // 가속 투사체
              this.projectiles.push({
                  x: Math.random() * (this.width - 20),
                  y: this.height,
                  width: 20,
                  height: 20,
                  dx: 0,
                  dy: 1.5, // 초기 속도 줄임 (2 -> 1.5)
                  accel: 0.15 + Math.random() * 0.15, // 가속도 줄임
                  type: "accel"
              });
          }
      }
  }
}

class Player {
  constructor(maxGauge = 3) {
      this.skillGauge = 0;
      this.maxGauge = maxGauge;
      this.skillReady = false;
      this.width = 160; // 패들 너비를 120에서 160으로 증가
      this.height = 70; // 패들 높이를 40에서 60으로 증가
      
      // 플레이어 애니메이션 관련
      this.animationFrames = [];
      this.currentFrame = 0;
      this.frameTimer = 0;
      this.frameDelay = 10; // 3프레임마다 이미지 변경
      this.isAnimating = false;
      this.animationDuration = 30; // 30프레임 동안 애니메이션
      this.animationTimer = 0;
      
      // 기본 플레이어 이미지와 애니메이션 이미지들 로딩
      this.defaultImage = new Image();
      this.defaultImage.src = 'player.png'; // 기본 이미지
      
      // 애니메이션 프레임 이미지들 (필요한 만큼 추가)
      for (let i = 1; i <= 2; i++) {
          const img = new Image();
          img.src = `player_anim_${i}.png`; // player_anim_1.png, player_anim_2.png 등
          this.animationFrames.push(img);
      }
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

  useSkill(bricks, damage = 3) {
      if (!this.canUseSkill()) return 0;
      let scoreGained = 0;
      bricks.forEach(brick => {
          if (!brick.visible) return;
          brick.health -= damage;
          if (brick.health <= 0) {
              brick.visible = false;
              scoreGained += brick.maxHealth * 10;
          }
      });
      this.skillGauge = 0;
      this.skillReady = false;
      return scoreGained;
  }

  // 애니메이션 시작
  startAnimation() {
      this.isAnimating = true;
      this.animationTimer = this.animationDuration;
      this.currentFrame = 0;
      this.frameTimer = 0;
  }

  // 애니메이션 업데이트
  updateAnimation() {
      if (!this.isAnimating) return;

      this.animationTimer--;
      if (this.animationTimer <= 0) {
          this.isAnimating = false;
          return;
      }

      this.frameTimer++;
      if (this.frameTimer >= this.frameDelay) {
          this.frameTimer = 0;
          this.currentFrame = (this.currentFrame + 1) % this.animationFrames.length;
      }
  }

  // 현재 표시할 이미지 반환
  getCurrentImage() {
      if (this.isAnimating && this.animationFrames.length > 0) {
          const frame = this.animationFrames[this.currentFrame];
          if (frame.complete && frame.naturalWidth > 0) {
              return frame;
          }
      }
      return this.defaultImage;
  }
}

// === 필살기 이펙트 클래스 (단순한 이미지 페이드아웃) ===
class PhoenixEffect {
  constructor(canvasWidth, canvasHeight) {
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
      this.active = false;
      this.duration = 60; // 1초 (60fps 기준)
      this.currentFrame = 0;
      
      // 필살기 이펙트 이미지 로딩
      this.image = new Image();
      this.image.src = 'phoenix_effect.png'; // 로컬 이미지 파일
  }

  activate() {
      this.active = true;
      this.currentFrame = 0;
  }

  update() {
      if (!this.active) return;

      this.currentFrame++;
      if (this.currentFrame > this.duration) {
          this.active = false;
      }
  }

  draw(ctx) {
      if (!this.active || !this.image.complete || this.image.naturalWidth === 0) return;

      const progress = this.currentFrame / this.duration;
      
      // 불투명하게 표시하고 크기를 더 크게
      ctx.save();
      ctx.globalAlpha = 1.0; // 완전 불투명
      
      // 이미지를 화면 중앙에 더 크게 그리기
      const imageWidth = 400; // 200에서 400으로 증가
      const imageHeight = 400; // 200에서 400으로 증가
      const x = (this.canvasWidth - imageWidth) / 2;
      const y = (this.canvasHeight - imageHeight) / 2;
      
      ctx.drawImage(this.image, x, y, imageWidth, imageHeight);
      ctx.restore();
  }
}

// === 게임 초기화 ===
document.addEventListener('DOMContentLoaded', function() {
  // 게임 상수
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 500;
  const PADDLE_WIDTH = 160; // 120에서 160으로 증가
  const PADDLE_HEIGHT = 70; // 40에서 60으로 증가
  const PADDLE_SPEED = 8; // 속도 줄임 (12 -> 8)
  const BALL_RADIUS = 10;
  const BRICK_ROWS = 5;
  const BRICK_COLUMNS = 12;
  const BRICK_WIDTH = 78;
  const BRICK_HEIGHT = 30;
  const BRICK_PADDING = 5;
  const BRICK_OFFSET_TOP = 100; // 60에서 100으로 증가 (보스 높이 증가로 인해)
  const BRICK_OFFSET_LEFT = 15;
  const MAX_LIVES = 3;
  const ITEM_FALL_SPEED = 2;

  // 스테이지별 공 속도 설정 (전체적으로 속도 줄임)
  const BASE_BALL_SPEED = { dx: 2.5, dy: 2.5 }; // 기본 속도 줄임 (3.5 -> 2.5)
  
  function getStageSpeed(stageNum) {
      const multiplier = 1 + (stageNum - 1) * 0.1; // 각 스테이지마다 10% 증가
      return {
          dx: BASE_BALL_SPEED.dx * multiplier,
          dy: BASE_BALL_SPEED.dy * multiplier
      };
  }

  // 캔버스 설정
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");

  // 게임 객체들
  const player = new Player();
  const boss = new Boss(CANVAS_WIDTH, 10, 20);
  const phoenixEffect = new PhoenixEffect(CANVAS_WIDTH, CANVAS_HEIGHT);

  // 게임 상태
  let gameStarted = false;
  let gamePaused = false;
  let gameOver = false;
  let score = 0;
  let lives = MAX_LIVES;
  let coins = 0;
  let stage = 1;
  let stageTimer = 60;
  let stageTimerInterval = null;
  let bossAttackTimer = null;

  // 캐릭터 선택
  let selectedCharacter = null;
  let characterAbilities = {
      char1: { name: "공격형", power: 2, speed: 8, description: "공 데미지 +1" }, // 속도 줄임
      char2: { name: "속도형", power: 1, speed: 12, description: "이동속도 증가" }, // 속도 줄임 (18 -> 12)
      char3: { name: "시간형", power: 1, speed: 8, timeStop: true, description: "시간정지 (Q키)" }, // 속도 줄임
      char4: { name: "방어형", power: 1, speed: 8, shield: true, description: "넓은 방어영역" } // 속도 줄임
  };

  // 시간정지 관련
  let timeStopActive = false;
  let timeStopDuration = 0;
  let timeStopCooldown = 0;

  // 입력 상태
  let leftPressed = false;
  let rightPressed = false;

  // 패들 설정
  const paddle = {
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      x: (CANVAS_WIDTH - PADDLE_WIDTH) / 2,
      y: CANVAS_HEIGHT - PADDLE_HEIGHT - 10,
      color: "#4CAF50",
      speed: PADDLE_SPEED,
      shieldWidth: PADDLE_WIDTH,
      shieldHeight: PADDLE_HEIGHT
  };

  // 공 설정
  const ball = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - PADDLE_HEIGHT - BALL_RADIUS - 10,
      radius: BALL_RADIUS,
      dx: 2.5, // 초기 속도 줄임
      dy: -2.5, // 초기 속도 줄임
      color: "#FFFFFF",
      power: 1
  };

  // 벽돌과 아이템 배열
  let bricks = [];
  let items = [];
  const itemTypes = ["heart", "coin"]; // 자석 아이템 제거

  // === 캐릭터 선택 이벤트 ===
  document.querySelectorAll('.character-button').forEach(button => {
      button.addEventListener('click', function() {
          document.querySelectorAll('.character-button').forEach(b => b.classList.remove('selected'));
          this.classList.add('selected');
          selectedCharacter = this.id;
      });
  });

  document.getElementById('character-confirm').addEventListener('click', function() {
      if (!selectedCharacter) {
          alert('캐릭터를 선택해주세요!');
          return;
      }
      
      document.getElementById('character-select-menu').classList.add('hidden');
      document.getElementById('stage-select-menu').classList.remove('hidden'); // 스테이지 선택 메뉴 표시
      
      // 캐릭터 능력 적용
      const char = characterAbilities[selectedCharacter];
      ball.power = char.power;
      paddle.speed = char.speed;
      
      if (char.shield) {
          paddle.shieldWidth = PADDLE_WIDTH + 40;
          paddle.shieldHeight = PADDLE_HEIGHT + 10;
      }
      
      document.getElementById('character-info').textContent = `${char.name}: ${char.description}`;
  });

  document.querySelectorAll('.stage-select').forEach(button => {
      button.addEventListener('click', function() {
          stage = parseInt(this.getAttribute('data-stage'));
          document.getElementById('stage-select-menu').classList.add('hidden');
          
          // 선택된 스테이지로 게임 시작
          gameStarted = true;
          gameOver = false;
          gamePaused = false;
          score = 0;
          lives = MAX_LIVES;
          coins = 0;
          
          setupBossForStage(stage);
          initBricks();
          resetBall();
          setBallSpeedForStage(stage);
          updateUI();
          
          startStageTimer();
          
          bossAttackTimer = setInterval(() => {
              if (boss.visible && !timeStopActive && !gamePaused) {
                  boss.spawnProjectiles(stage);
              }
          }, boss.attackInterval);
          
          requestAnimationFrame(gameLoop);
      });
  }); 

  // === 키보드 이벤트 ===
  document.addEventListener("keydown", function (e) {
      if (e.keyCode === 37) leftPressed = true;
      else if (e.keyCode === 39) rightPressed = true;
  });

  document.addEventListener("keyup", function (e) {
      if (e.keyCode === 37) leftPressed = false;
      else if (e.keyCode === 39) rightPressed = false;
      else if (e.keyCode === 27) togglePause();
      else if (e.keyCode === 70) useSkill(); // F키
      else if (e.keyCode === 81) useTimeStop(); // Q키
  });

  // === 게임 함수들 ===
  function updateGaugeUI() {
      const percent = (player.skillGauge / player.maxGauge) * 100;
      const gaugeElement = document.getElementById("gauge-fill");
      if (gaugeElement) {
          gaugeElement.style.height = percent + "%";
          gaugeElement.style.backgroundColor = percent >= 100 ? "#ffcc00" : "red";
      }
  }

  function initBricks() {
      bricks = [];
      for (let r = 0; r < BRICK_ROWS; r++) {
          for (let c = 0; c < BRICK_COLUMNS; c++) {
              const health = Math.floor(Math.random() * 5) + 1;
              bricks.push({
                  x: c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT,
                  y: r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP,
                  width: BRICK_WIDTH,
                  height: BRICK_HEIGHT,
                  health: health,
                  maxHealth: health,
                  visible: true
              });
          }
      }
  }

  function setupBossForStage(stageNum) {
      const baseHealth = 10;
      const healthMultiplier = 1 + (stageNum - 1) * 0.1; // 각 스테이지마다 10% 증가
      const targetHealth = Math.floor(baseHealth * healthMultiplier);
      
      boss.maxHealth = targetHealth;
      boss.health = targetHealth;
      
      if (stageNum <= 2) {
          boss.attackInterval = 3000;
          boss.pattern = "straight";
      } else if (stageNum === 3) {
          boss.attackInterval = 2000;
          boss.pattern = "straight";
      } else {
          boss.attackInterval = 1500;
          boss.pattern = "varied";
      }
      
      boss.visible = true;
      boss.phaseTriggerCount = 0;
      boss.projectiles = [];
  }

  function setBallSpeedForStage(stageNum) {
      const speeds = getStageSpeed(stageNum);
      const currentSpeed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
      const targetSpeed = Math.sqrt(speeds.dx * speeds.dx + speeds.dy * speeds.dy);
      
      // 현재 방향을 유지하면서 속도만 조정
      const ratio = targetSpeed / currentSpeed;
      ball.dx *= ratio;
      ball.dy *= ratio;
  }

  function startStageTimer() {
      clearInterval(stageTimerInterval);
      stageTimer = 60;
      updateTimerDisplay();
      
      stageTimerInterval = setInterval(() => {
          if (!timeStopActive && !gamePaused) {
              stageTimer--;
              updateTimerDisplay();
              
              if (stageTimer <= 0) {
                  clearInterval(stageTimerInterval);
                  gameOver = true;
                  showMenu("시간 초과! 게임 오버", false);
              }
          }
      }, 1000);
  }

  function updateTimerDisplay() {
      const minutes = Math.floor(stageTimer / 60);
      const seconds = stageTimer % 60;
      const timerElement = document.getElementById("stage-timer");
      if (timerElement) {
          timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
          timerElement.style.color = stageTimer < 10 ? '#FF0000' : '#FFD700';
      }
  }

  function useTimeStop() {
      if (selectedCharacter !== 'char3' || timeStopActive || timeStopCooldown > 0) return;
      
      timeStopActive = true;
      timeStopDuration = 600; // 10초 * 60fps
      timeStopCooldown = 1800; // 30초 쿨다운
      
      // 모든 보스 투사체 제거
      boss.projectiles = [];
      
      document.getElementById('time-stop-overlay').classList.remove('hidden');
  }

  function useSkill() {
      if (player.canUseSkill()) {
          phoenixEffect.activate();
          const gainedScore = player.useSkill(bricks);
          score += gainedScore;
          updateUI();
          sounds.skill1.play();
      }
  }

  function startGame() {
      sounds.bgm1.play();

      if (!selectedCharacter) return;
      
      gameStarted = true;
      gameOver = false;
      gamePaused = false;
      
      // 스테이지가 이미 선택되어 있지 않으면 기본값 1로 설정
      if (!stage) stage = 1;
      
      score = 0;
      lives = MAX_LIVES;
      coins = 0;
      
      setupBossForStage(stage);
      initBricks();
      resetBall();
      setBallSpeedForStage(stage);
      updateUI();
      
      document.getElementById("game-menu").classList.add("hidden");
      startStageTimer();
      
      bossAttackTimer = setInterval(() => {
          if (boss.visible && !timeStopActive && !gamePaused) {
              boss.spawnProjectiles(stage);
          }
      }, boss.attackInterval);
      
      requestAnimationFrame(gameLoop);
  }

  function togglePause() {
      if (!gameStarted || gameOver) return;
      
      gamePaused = !gamePaused;
      if (gamePaused) {
          showMenu("일시정지", false, true);
      } else {
          resumeGame();
      }
  }

  function resumeGame() {
      if (!gameStarted || gameOver) return;
      gamePaused = false;
      setBallSpeedForStage(stage); // 게임 재개 시 공 속도 재설정
      document.getElementById("game-menu").classList.add("hidden");
  }

  function restartGame() {
      clearInterval(stageTimerInterval);
      clearInterval(bossAttackTimer);
      startGame();
  }

  function quitGame() {
      gameStarted = false;
      gamePaused = false;
      gameOver = false;
      clearInterval(stageTimerInterval);
      clearInterval(bossAttackTimer);
      document.getElementById('character-select-menu').classList.remove('hidden');
      document.getElementById('game-menu').classList.add('hidden');
      document.getElementById('stage-clear-menu').classList.add('hidden');
  }

  function showMenu(message, isStart = false, isPaused = false) {
      document.getElementById("menu-message").textContent = message;
      document.getElementById("game-menu").classList.remove("hidden");

      document.getElementById("start-button").style.display = isStart ? "block" : "none";
      document.getElementById("resume-button").style.display = isPaused ? "block" : "none";
      document.getElementById("restart-button").style.display = !isStart ? "block" : "none";
      document.getElementById("quit-button").style.display = "block";
  }

  function updateUI() {
      document.getElementById("score").textContent = score;
      document.getElementById("hearts").textContent = lives;
      document.getElementById("coins").textContent = coins;
      document.getElementById("stage").textContent = stage;
      updateGaugeUI();
  }

  function resetBall() {
      ball.x = paddle.x + paddle.width / 2;
      ball.y = CANVAS_HEIGHT - PADDLE_HEIGHT - BALL_RADIUS - 10;
      const speeds = getStageSpeed(stage);
      ball.dx = Math.random() > 0.5 ? speeds.dx : -speeds.dx;
      ball.dy = -speeds.dy;
  }

  function createItem(x, y) {
      if (Math.random() < 0.3) {
          const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
          items.push({
              x: x,
              y: y,
              type: itemType,
              width: 20,
              height: 20
          });
      }
  }

  function collectItem(item) {
      switch (item.type) {
          case "heart":
              lives = Math.min(lives + 1, MAX_LIVES);
              break;
          case "coin":
              coins++;
              score += 10;
              break;
      }
      updateUI();
  }

  function addNewBrickRow() {
      bricks.forEach(brick => {
          if (brick.visible) {
              brick.y += BRICK_HEIGHT + BRICK_PADDING;
          }
      });

      for (let c = 0; c < BRICK_COLUMNS; c++) {
          const health = Math.floor(Math.random() * 5) + 1;
          bricks.push({
              x: c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT,
              y: BRICK_OFFSET_TOP,
              width: BRICK_WIDTH,
              height: BRICK_HEIGHT,
              health: health,
              maxHealth: health,
              visible: true
          });
      }
  }

  // === 충돌 감지 함수들 ===
  function checkBrickCollision() {
      for (let i = 0; i < bricks.length; i++) {
          const brick = bricks[i];
          if (brick.visible) {
              if (ball.x + ball.radius > brick.x &&
                  ball.x - ball.radius < brick.x + brick.width &&
                  ball.y + ball.radius > brick.y &&
                  ball.y - ball.radius < brick.y + brick.height) {
                  
                  const distX = Math.abs(ball.x - (brick.x + brick.width / 2));
                  const distY = Math.abs(ball.y - (brick.y + brick.height / 2));

                  if (distX > distY) {
                      ball.dx = -ball.dx;
                  } else {
                      ball.dy = -ball.dy;
                  }

                  brick.health -= ball.power;

                  if (brick.health <= 0) {
                      brick.visible = false;
                      score += brick.maxHealth * 10;
                      updateUI();
                      createItem(brick.x + brick.width / 2, brick.y + brick.height / 2);
                      player.chargeGauge();
                      updateGaugeUI();
                      sounds.brickHit.play();
                  }
                  break;
              }
          }
      }
  }

  function checkPaddleCollision() {
      if (ball.y + ball.radius > paddle.y &&
          ball.y + ball.radius < paddle.y + paddle.height &&
          ball.x > paddle.x &&
          ball.x < paddle.x + paddle.width) {
          
          // 플레이어 애니메이션 시작
          player.startAnimation();
          sounds.paddleHit.play();
          
          const hitPos = (ball.x - paddle.x) / paddle.width;
          const angle = hitPos * Math.PI - Math.PI / 2;
          const speeds = getStageSpeed(stage);
          const targetSpeed = Math.sqrt(speeds.dx * speeds.dx + speeds.dy * speeds.dy);
          
          ball.dx = targetSpeed * Math.cos(angle);
          ball.dy = -Math.abs(targetSpeed * Math.sin(angle));
      }
  }

  function checkItemCollision() {
      const itemsToRemove = [];

      items.forEach((item, index) => {
          if (item.y > CANVAS_HEIGHT) {
              itemsToRemove.push(index);
              return;
          }

          if (item.x < paddle.x + paddle.width &&
              item.x + item.width > paddle.x &&
              item.y < paddle.y + paddle.height &&
              item.y + item.height > paddle.y) {
              collectItem(item);
              itemsToRemove.push(index);
          }
      });

      for (let i = itemsToRemove.length - 1; i >= 0; i--) {
          items.splice(itemsToRemove[i], 1);
      }
  }

  function updateBossProjectiles() {
      const projectilesToRemove = [];
      
      boss.projectiles.forEach((proj, i) => {
          if (proj.type === "straight" || proj.type === "fast") {
              proj.y += proj.dy;
          } else if (proj.type === "parabola") {
              proj.x += proj.dx;
              proj.y += proj.dy;
              proj.dy += proj.gravity;
          } else if (proj.type === "accel") {
              proj.y += proj.dy;
              proj.dy += proj.accel;
          }

          // 화면 밖으로 나간 투사체 제거
          if (proj.y > CANVAS_HEIGHT || proj.x < 0 || proj.x > CANVAS_WIDTH) {
              projectilesToRemove.push(i);
              return;
          }

          // 패들과 충돌 체크
          if (selectedCharacter === 'char4') {
              // 방어형 캐릭터: 방어 영역과 데미지 영역 구분
              const shieldLeft = paddle.x - (paddle.shieldWidth - paddle.width) / 2;
              const shieldRight = shieldLeft + paddle.shieldWidth;
              const damageLeft = paddle.x;
              const damageRight = paddle.x + paddle.width;
              
              if (proj.y + proj.height >= paddle.y &&
                  proj.x < shieldRight &&
                  proj.x + proj.width > shieldLeft) {
                  
                  // 데미지 영역에 맞으면 생명 감소
                  if (proj.x < damageRight && proj.x + proj.width > damageLeft) {
                      lives = Math.max(0, lives - 1);
                      updateUI();
                      if (lives <= 0) {
                          gameOver = true;
                          showMenu("게임 오버", false);
                      }
                  }
                  // 어느 영역이든 투사체는 제거
                  projectilesToRemove.push(i);
              }
          } else {
              // 일반 충돌
              if (proj.y + proj.height >= paddle.y &&
                  proj.x < paddle.x + paddle.width &&
                  proj.x + proj.width > paddle.x) {
                  
                  projectilesToRemove.push(i);
                  lives = Math.max(0, lives - 1);
                  updateUI();
                  if (lives <= 0) {
                      gameOver = true;
                      showMenu("게임 오버", false);
                  }
              }
          }
      });

      // 제거할 투사체들 처리
      for (let i = projectilesToRemove.length - 1; i >= 0; i--) {
          boss.projectiles.splice(projectilesToRemove[i], 1);
      }
  }

  // === 그리기 함수들 ===
  function drawPaddle() {
      // 방어형 캐릭터의 경우 방어 영역 표시
      if (selectedCharacter === 'char4') {
          const shieldX = paddle.x - (paddle.shieldWidth - paddle.width) / 2;
          const shieldY = paddle.y - (paddle.shieldHeight - paddle.height) / 2;
          
          // 방어 영역 (투명한 파란색)
          ctx.fillStyle = "rgba(0, 100, 255, 0.3)";
          ctx.fillRect(shieldX, shieldY, paddle.shieldWidth, paddle.shieldHeight);
          
          // 방어 영역 테두리
          ctx.strokeStyle = "#0066FF";
          ctx.lineWidth = 2;
          ctx.strokeRect(shieldX, shieldY, paddle.shieldWidth, paddle.shieldHeight);
      }
      
      // 플레이어 이미지 (애니메이션 포함)
      const currentImage = player.getCurrentImage();
      if (currentImage.complete && currentImage.naturalWidth > 0) {
          // 전체 비율을 유지하면서 불투명하게 표시
          ctx.save();
          ctx.globalAlpha = 1.0; // 완전 불투명
          ctx.drawImage(currentImage, paddle.x, paddle.y, paddle.width, paddle.height);
          ctx.restore();
      } else {
          // 기존 방식 (이미지 로드 실패 시)
          ctx.fillStyle = paddle.color;
          ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
      }
  }

  function drawBall() {
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = ball.color;
      ctx.fill();
      ctx.closePath();
  }

  function drawBricks() {
      bricks.forEach(brick => {
          if (brick.visible) {
              const healthPercent = brick.health / brick.maxHealth;
              const r = Math.floor(255 * healthPercent);
              const g = Math.floor(100 * healthPercent + 50);
              const b = Math.floor(50 * healthPercent);

              ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
              ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
              
              ctx.strokeStyle = "#333";
              ctx.lineWidth = 2;
              ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);

              ctx.font = "12px Arial";
              ctx.fillStyle = "#FFF";
              ctx.textAlign = "center";
              ctx.fillText(
                  brick.health.toString(),
                  brick.x + brick.width / 2,
                  brick.y + brick.height / 2 + 4
              );
          }
      });
  }

  function drawItems() {
      items.forEach(item => {
          ctx.beginPath();

          switch (item.type) {
              case "heart":
                  ctx.fillStyle = "#FF5555";
                  break;
              case "coin":
                  ctx.fillStyle = "#FFD700";
                  break;
          }

          ctx.arc(item.x, item.y, 10, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = "10px Arial";
          ctx.fillStyle = "#000";
          ctx.textAlign = "center";
          
          let symbol = "";
          switch (item.type) {
              case "heart": symbol = "♥"; break;
              case "coin": symbol = "$"; break;
          }

          ctx.fillText(symbol, item.x, item.y + 3);
      });
  }

  function drawBossProjectiles() {
      boss.projectiles.forEach(proj => {
          let color = "#FFAA00";
          if (proj.type === "fast") color = "#FF0000";
          else if (proj.type === "parabola") color = "#00FF00";
          else if (proj.type === "accel") color = "#FF00FF";
          
          ctx.fillStyle = color;
          ctx.fillRect(proj.x, proj.y, proj.width, proj.height);
          
          // 투사체 종류별 추가 표시
          ctx.fillStyle = "#FFF";
          ctx.font = "8px Arial";
          ctx.textAlign = "center";
          if (proj.type === "fast") ctx.fillText("!", proj.x + proj.width/2, proj.y + proj.height/2);
          else if (proj.type === "parabola") ctx.fillText("~", proj.x + proj.width/2, proj.y + proj.height/2);
          else if (proj.type === "accel") ctx.fillText("↓", proj.x + proj.width/2, proj.y + proj.height/2);
      });
  }

  // === 게임 업데이트 ===
  function update() {
      if (gameOver || gamePaused) return;

      // 시간정지 처리
      if (timeStopActive) {
          timeStopDuration--;
          if (timeStopDuration <= 0) {
              timeStopActive = false;
              document.getElementById('time-stop-overlay').classList.add('hidden');
          }
          // 시간정지 중에도 캐릭터와 공은 움직임
      }

      // 시간정지 쿨다운
      if (timeStopCooldown > 0) {
          timeStopCooldown--;
      }

      // 플레이어 애니메이션 업데이트
      player.updateAnimation();

      // 필살기 이펙트 업데이트
      phoenixEffect.update();

      // 패들 이동
      if (leftPressed && paddle.x > 0) {
          paddle.x -= paddle.speed;
      } else if (rightPressed && paddle.x + paddle.width < CANVAS_WIDTH) {
          paddle.x += paddle.speed;
      }

      // 공 이동
      ball.x += ball.dx;
      ball.y += ball.dy;

      // 아이템 이동 (시간정지 중에는 멈춤)
      if (!timeStopActive) {
          items.forEach(item => {
              item.y += ITEM_FALL_SPEED;
          });
      }

      // 벽 충돌
      if (ball.x - ball.radius < 0 || ball.x + ball.radius > CANVAS_WIDTH) {
          ball.dx = -ball.dx;
      }

      if (ball.y - ball.radius < 0) {
          ball.dy = -ball.dy;
      }

      // 바닥 충돌
      if (ball.y + ball.radius > CANVAS_HEIGHT) {
          lives--;
          updateUI();

          if (lives <= 0) {
              gameOver = true;
              showMenu("게임 오버", false);
          } else {
              resetBall();
          }
      }

      // 충돌 감지
      checkPaddleCollision();
      checkBrickCollision();
      checkItemCollision();
      
      // 보스 투사체 업데이트 (시간정지 중에는 멈춤)
      if (!timeStopActive) {
          updateBossProjectiles();
      }

      // 보스 충돌 체크
      if (boss.checkCollision(ball, addNewBrickRow)) {
          // 보스 처치됨
          clearInterval(stageTimerInterval);
          clearInterval(bossAttackTimer);
          gamePaused = true;
          
          if (stage >= 4) {
              document.getElementById('stage-clear-message').textContent = '모든 스테이지 클리어!';
              document.getElementById('stage-clear-info').textContent = `최종 점수: ${score}점`;
              document.getElementById('next-stage-button').style.display = 'none';
          } else {
              document.getElementById('stage-clear-message').textContent = `스테이지 ${stage} 클리어!`;
              document.getElementById('stage-clear-info').textContent = `점수: ${score}점 | 남은 시간: ${stageTimer}초`;
              document.getElementById('next-stage-button').style.display = 'block';
          }
          
          document.getElementById('stage-clear-menu').classList.remove('hidden');
      }

      // 벽돌이 너무 아래로 내려오면 게임 오버
      for (let i = 0; i < bricks.length; i++) {
          if (bricks[i].visible && bricks[i].y + bricks[i].height >= CANVAS_HEIGHT - PADDLE_HEIGHT - 20) {
              gameOver = true;
              showMenu("게임 오버", false);
              break;
          }
      }
  }

  // === 그리기 ===
  function draw() {
      // 배경 색상으로 먼저 클리어
      ctx.fillStyle = "#222";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  
      // 배경 이미지 그리기 (선택사항)
      const bgImage = new Image();
      bgImage.src = `background_stage_${stage}.jpg`;
      
      // 이미지가 로드되었으면 배경으로 사용, 아니면 기본 배경색 유지
      if (bgImage.complete && bgImage.naturalWidth > 0) {
          ctx.drawImage(bgImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }
  
      // 게임 요소들 그리기
      drawBricks();
      drawPaddle();
      drawBall();
      drawItems();
      boss.draw(ctx);
      drawBossProjectiles();
  
      // 필살기 이펙트
      phoenixEffect.draw(ctx);
  
      // UI 정보
      ctx.font = "20px Arial";
      ctx.fillStyle = "#FFF";
      ctx.textAlign = "left";
      ctx.fillText(`점수: ${score}`, 10, 30);
  
      ctx.textAlign = "center";
      ctx.fillText(`스테이지: ${stage}`, CANVAS_WIDTH / 2, 30);
  
      ctx.textAlign = "right";
      ctx.fillText(`생명: ${lives}`, CANVAS_WIDTH - 10, 30);
      ctx.fillText(`코인: ${coins}`, CANVAS_WIDTH - 10, 60);
  
      // 시간정지 쿨다운 표시
      if (selectedCharacter === 'char3' && timeStopCooldown > 0) {
          ctx.textAlign = "left";
          ctx.fillStyle = "#00FFFF";
          ctx.fillText(`시간정지 쿨다운: ${Math.ceil(timeStopCooldown / 60)}초`, 10, 60);
      }
  }

  // === 게임 루프 ===
  function gameLoop() {
      if (!gameStarted || gameOver) return;

      if (!gamePaused) {
          update();
          draw();
      }

      requestAnimationFrame(gameLoop);
  }

  // === 이벤트 리스너들 ===
  document.getElementById("pause-button").addEventListener("click", togglePause);
  document.getElementById("start-button").addEventListener("click", startGame);
  document.getElementById("resume-button").addEventListener("click", resumeGame);
  document.getElementById("restart-button").addEventListener("click", restartGame);
  document.getElementById("quit-button").addEventListener("click", quitGame);

  // 스테이지 클리어 메뉴
  document.getElementById("next-stage-button").addEventListener("click", function() {
      quitGame(); // 다음 스테이지로 넘어가지 않고 게임 종료 처리
  });

  document.getElementById("quit-stage-button").addEventListener("click", quitGame);

  // 초기화
  updateGaugeUI();
});