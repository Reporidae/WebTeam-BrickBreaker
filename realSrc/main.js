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

          const existingImage = rightDisplay.querySelector('.village-character');
          if (existingImage) {
            rightDisplay.removeChild(existingImage);
        }

        // 새로운 이미지 엘리먼트 생성
        const newImage = document.createElement('img');
        newImage.className = 'stage-image';
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
  let characterView = document.querySelector('#characterView img');
  let character_hold1 = document.querySelector('#character_hold1');
  let character_hold2 = document.querySelector('#character_hold2');
  let character_hold3 = document.querySelector('#character_hold3');
  let character_hold4 = document.querySelector('#character_hold4');
  let leftUpperWrapper1 = document.querySelector('.abilityShop #leftUpperWrapper1');
  let leftUpperWrapper2 = document.querySelector('.abilityShop #leftUpperWrapper2');
  let leftUpperWrapper3 = document.querySelector('.abilityShop #leftUpperWrapper3');
  let leftUpperWrapper4 = document.querySelector('.abilityShop #leftUpperWrapper4');
  characterButton.addEventListener("click", ()=>{
    characterPopUp.style.display = "block";
  })
  closePopupBtn.addEventListener("click", ()=>{
    characterPopUp.style.display = "none";
  })
  character_hold1.addEventListener("click", ()=>{
    selectedIndex=1;
  })
  character_hold2.addEventListener("click", ()=>{
    selectedIndex=2;
  })
  character_hold3.addEventListener("click", ()=>{
    selectedIndex=3;
  })
  character_hold4.addEventListener("click", ()=>{
    selectedIndex=4;
  })
  saveAndCloseBtn.addEventListener("click", ()=>{
  if(selectedIndex===1){
    for(let i=1; i<=4; i++){
      let temp = document.querySelector(`.abilityShop #leftUpperWrapper${i}`);
      temp.style.display = "none";
    }
    leftUpperWrapper1.style.display = "block";
  }
  if(selectedIndex===2){
    for(let i=1; i<=4; i++){
      let temp = document.querySelector(`.abilityShop #leftUpperWrapper${i}`);
      temp.style.display = "none";
    }
    leftUpperWrapper2.style.display = "block";
  }
  if(selectedIndex===3){
    for(let i=1; i<=4; i++){
      let temp = document.querySelector(`.abilityShop #leftUpperWrapper${i}`);
      temp.style.display = "none";
    }
    leftUpperWrapper3.style.display = "block";
  }
  if(selectedIndex===4){
    for(let i=1; i<=4; i++){
      let temp = document.querySelector(`.abilityShop #leftUpperWrapper${i}`);
      temp.style.display = "none";
    }
    leftUpperWrapper4.style.display = "block";
  }
  characterPopUp.style.display = "none";
  });
}
let character1_level = 1;
let character2_level = 1;
let character3_level = 1;
let character4_level = 1;
function characterLevelUp() {
  let characterLevel = document.getElementById('characterLevel');
  let characterImg = document.getElementById('characterImg');
  let levelupButton = document.getElementById('levelupButton');
 
  levelupButton.addEventListener("click", () => {
    let src = characterImg.src;
    let level, cost, name;

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

    cost = level * 10000;

    if (coin < cost) {
      alert(`현재 남은 코인은 ${coin}원입니다. 코인 부족으로 레벨업이 불가합니다.`);
      return;
    }

    let yn = confirm(`Lv.${level} → Lv.${level + 1}로 레벨업 하시겠습니까? (${cost}원 소모)`);
    if (yn) {
      coin -= cost;
      level++;
      if (src.includes("character_img1.png")) character1_level = level;
      if (src.includes("img2.jpg")) character2_level = level;
      if (src.includes("img1.jpg")) character3_level = level;

      characterLevel.textContent = `${name} [Lv.${level}]`;
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