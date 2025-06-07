let stage = 1;  // 변경 가능 (2, 3, 4) 스테이지 정보보
let maxHeart = 3;
let selectedCharacter = 'char1';

window.addEventListener('DOMContentLoaded', () => {
  setupCharacterModalEvents();
  setupShopPopupEvents();
  setupBackButtons();
  setsupStartButtons();
  itemPurchase();
  abilityHoverForVisibleCharacter();
  displayCoin();
  startLifeTimer();
  displayLife();
  initDefaultCharacterSelection();
  initDefaultPopupSelection();
  abilityShop_CharacterPopUp();
  characterLevelUp();
  chageStageNum();
  clickStageNum();
  
  // 게임 초기화 함수들 추가
  initializeGame();

  storyBoard();

});

let previousScreen = null;  // 이전에 보였던 화면 저장
var life = 2; //남은 생명 개수
var coin = 5000;//코인
let itemPurchased = [0, 0, 0, 0];//선택된 아이템
let lifeTimer = null; //시간 측정 변수 - 생명을 5분에 한 번씩 생성하기 위해 필요한 변수임
let character1_level = 1;
let character2_level = 0;
let character3_level = 0;
let character4_level = 0; //캐릭터 4명의 레벨 정보 -> 레벨이 0이라는 건 캐릭터를 사지 않았다는 말. 구매 후 바로 1레벨로 변경하기

// 스토리 데이터
const storyScenes = [
    {
        image: 'story1.png',
        text: `도서관, 평소처럼 조용한 오후.<br>
        책을 고르던 네 명의 학생은 먼지가 뿌옇게 쌓인 아주 낡은 책 한 권을 발견했다.`
    },
    {
        image: 'story2.png',
        text: `그 책은 제목도 없고 표지도 찢겨 있었지만<br>
        안에는 낡은 손그림 지도가 끼워져 있었다.<br>
        지도 한 곳에는 붉은 X 표시가 그려져 있었고…`
    },
    {
        image: 'story3.png',
        text: `“이건 뭔가 숨겨진 장소 아냐?”<br>
        호기심이 동한 주인공1은 책을 펼쳐 내용을 확인해보기로 한다.`
    },
    {
        image: 'story4.png',
        text: `그 순간—<br>
        책장이 바람에 휘날리며 책장 뒤 벽이 열리고<br>
        순간적인 빛과 함께 네 사람은 그 안으로 빨려 들어간다.`
    },
    {
        image: 'newRightImg.png',
        text: `눈을 떠보니,<br>
        그들은 익숙한 도서관이 아닌<br>
        어딘가 이상한… 조용하고 오래된 마을에 와 있었다.`
    },
    {
        image: 'story6.png',
        text: `놀란 마음에 주인공들은 책을 다시 펴보고 거기엔 이렇게 적혀있었다.<br>
        “시험을 통과하라. 돌아갈 수 있을 것이다.”`
    },
    {
        image: 'story7.png',
        text: `“돌아갈 수 있는 방법이 있다는 거네…”<br>
        그들은 책을 덮고,<br> 
        각자 마을 안으로 걸어 들어간다.`
    },
];

let currentSceneIndex = 0;

function storyBoard(){
  const overlay = document.getElementById('storyOverlay');
  const storyImage = document.getElementById('storyImage');
  const storyText = document.getElementById('storyText');
  const nextBtn = document.getElementById('nextStoryBtn');
  
  // 스킵 버튼 생성 및 추가
  let skipBtn = document.getElementById('skipStoryBtn');
  if (!skipBtn) {
    skipBtn = document.createElement('button');
    skipBtn.id = 'skipStoryBtn';
    skipBtn.textContent = 'Skip Story';
    skipBtn.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      padding: 10px 20px;
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      border: 2px solid white;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      z-index: 1001;
      transition: background-color 0.3s;
    `;
    
    // 호버 효과
    skipBtn.addEventListener('mouseenter', () => {
      skipBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    });
    skipBtn.addEventListener('mouseleave', () => {
      skipBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    });
    
    // 스킵 기능
    skipBtn.addEventListener('click', skipStory);
    
    overlay.appendChild(skipBtn);
  }

  // 스킵 함수
  function skipStory() {
    const storyContent = document.querySelector('.story-content');
    storyContent.classList.remove('fade-in');
    storyContent.classList.add('fade-out');
    
    setTimeout(() => {
      overlay.classList.add('fade-out');
      overlay.addEventListener('animationend', () => {
        overlay.style.display = 'none';
        document.querySelector('.village').style.display = 'block';
      }, { once: true });
    }, 300);
  }

  nextBtn.addEventListener('click', () => {
    const storyContent = document.querySelector('.story-content');

    // 현재 장면을 페이드 아웃
    storyContent.classList.remove('fade-in');
    storyContent.classList.add('fade-out');

    // 애니메이션이 끝나면 다음 장면으로 변경
    storyContent.addEventListener('animationend', function handleFadeOut() {
        storyContent.removeEventListener('animationend', handleFadeOut);

        currentSceneIndex++;

        if (currentSceneIndex < storyScenes.length) {
            storyImage.src = storyScenes[currentSceneIndex].image;
            storyText.innerHTML = storyScenes[currentSceneIndex].text;

            // 페이드 인으로 새 장면 보여주기
            storyContent.classList.remove('fade-out');
            storyContent.classList.add('fade-in');
        } else {
            // 마지막 장면이면 오버레이 제거 + 메인 게임 화면 보여주기
            const overlay = document.getElementById('storyOverlay');
            overlay.classList.add('fade-out');
            overlay.addEventListener('animationend', () => {
                overlay.style.display = 'none';
                document.querySelector('.village').style.display = 'block';

                // 음악 재생 추가
                const bgm = document.getElementById('bgmAudio'); // 오디오 요소 id 맞게 변경
                if (bgm) {
                    bgm.volume = 0.5;
                    bgm.play().catch(err => console.error('BGM play failed:', err));
                }
            }, { once: true });
        }
    });
  });

  // 처음에는 스토리 보여주기 (다른 화면은 숨기기)
  overlay.style.display = 'flex';
  document.querySelector('.village').style.display = 'none';
  document.querySelector('.main-game').style.display = 'none';
  document.querySelector('.itemShop').style.display = 'none';
}
function chageStageNum() {
  const hotspots = document.querySelectorAll('.hotspot');

  hotspots.forEach(hotspot => {
    hotspot.addEventListener('click', () => {
      const selectedStage = parseInt(hotspot.dataset.stage);
      if (!isNaN(selectedStage)) {
        stage = selectedStage;
        console.log("현재 선택된 stage:", stage);
        
        // 선택된 스테이지를 시각적으로 표시 (선택사항)
        document.querySelectorAll('.hotspot').forEach(h => h.classList.remove('selected'));
        hotspot.classList.add('selected');
      }
    });
  });
}
function clickStageNum(){
  const hotspots = document.querySelectorAll('.hotspot');

    hotspots.forEach(hotspot => {
      hotspot.addEventListener('click', () => {
        // 다른 모든 핫스팟에서 active 제거
        hotspots.forEach(h => h.classList.remove('active'));

        // 현재 클릭된 것에 active 추가
        hotspot.classList.add('active');
      });
    });
}// 화면 전환 함수
function showScreen(screenId) {
  const screens = ['village', 'characterShop', 'abilityShop', 'itemShop', 'shopPopup'];
  screens.forEach(id => {
    const el = id === 'shopPopup' ? document.getElementById('shopPopup') : document.querySelector('.' + id);
    if (el) el.style.display = 'none';
  });

  let screenElement;
  if (screenId === 'shopPopup') {
    screenElement = document.getElementById('shopPopup');
  } else {
    screenElement = document.querySelector('.' + screenId);
  }

  if (screenElement) {
    screenElement.style.display = (screenId === 'shopPopup') ? 'flex' : 'block';
  }

  const toggleBtn = document.getElementById("backVillageButton");
  if (screenId === 'village') {
    toggleBtn.textContent = "Go to Shop";
  } else {
    toggleBtn.textContent = "Village";
  }

  previousScreen = screenId;
}

function setupBackButtons() {
  const backVillageBtn = document.getElementById("backVillageButton");
  const village = document.querySelector('.village');
  const gameDiv = document.querySelector(".main-game");

  backVillageBtn.addEventListener("click", () => {
    if (previousScreen === 'village') {
      showScreen('shopPopup');
      village.style.display = 'none';
      gameDiv.style.display = 'none';
    } else {
      showScreen('village');
      village.style.display = 'block';
      gameDiv.style.display = 'none';
    }
  });

  document.getElementById("backButton").addEventListener("click", () => {
    if (previousScreen !== 'village') {
      showScreen('village');
      village.style.display = 'block';
      gameDiv.style.display = 'none';
    }
  });
}

const purchasedCharacters = {};

function setupCharacterModalEvents() {
  const infos = document.querySelectorAll('.character-info');
  const modal = document.getElementById('characterModal');
  const closeBtn = document.querySelector('.close-button');
  const nameEl = document.getElementById('modalCharacterName');
  const stat1El = document.getElementById('modalStat1');
  const stat2El = document.getElementById('modalStat2');
  const actionBtn = document.getElementById('modalActionButton');

  infos.forEach(info => {
    info.addEventListener('click', () => {
      const name = info.querySelector('.character-name').innerText;
      const stat1 = info.querySelectorAll('.stat-line')[0].innerText;
      const stat2 = info.querySelectorAll('.stat-line')[1].innerText;
      const imgEl = info.querySelector('.character-image-small').getAttribute('src');
      const characterId = info.dataset.character;  // 예: 'char2'

      nameEl.textContent = name;
      stat1El.textContent = stat1;
      stat2El.textContent = stat2;

      actionBtn.textContent = purchasedCharacters[name] ? '적용' : '구매';

      actionBtn.onclick = () => {
        if (!purchasedCharacters[name]) {
          purchasedCharacters[name] = true;
          console.log("[구매된 캐릭터 목록]", purchasedCharacters);

          actionBtn.textContent = '적용';
          updateCharacter();
          initDefaultCharacterSelection();
          alert(`${name}을(를) 구매했습니다!`);
        } else {
          // 기존 캐릭터 카드 업데이트
          const leftCard = document.querySelector('.character-card');
          leftCard.querySelector('.character-image').src = imgEl;
          leftCard.querySelector('.now-character-name').textContent = name;
          currentCharacter = name;

          selectedCharacter = characterId;
          console.log("선택된 캐릭터 ID:", selectedCharacter);

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
    abilitieShopNew();
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

function setsupStartButtons(){
  const startButton = document.getElementById("startButton");
  const gameDiv = document.querySelector(".main-game");

  const characterShop = document.querySelector('.characterShop');
  const abilityShop = document.querySelector('.abilityShop');
  const itemShop = document.querySelector('.itemShop');
  const village = document.querySelector('.village');

  const shopPopup = document.getElementById("shopPopup");
  const backVillageBtn = document.getElementById("backVillageButton");

  startButton.addEventListener("click", function () {
    gameDiv.style.display = "block"; // 게임 화면 보이기
    characterShop.style.display = 'none';
    abilityShop.style.display = 'none';
    if(itemShop) itemShop.style.display = 'none';
    village.style.display = 'none';
    shopPopup.style.display = 'none';
  });

  backVillageBtn.addEventListener("click", function () {
    if (gameDiv.style.display === "block") {
      gameDiv.style.display = 'none';
      characterShop.style.display = 'none';
      abilityShop.style.display = 'none';
      if (itemShop) itemShop.style.display = 'none';
      shopPopup.style.display = 'none';
      village.style.display = 'block';
    }
  });
}

//----------header
function updateCharacter() {
  if (purchasedCharacters['지훈']) character1_level = 1;
  if (purchasedCharacters['세연']) character2_level = 1;
  if (purchasedCharacters['준오']) character3_level = 1;
  if (purchasedCharacters['유나']) character4_level = 1;
}
function filterPurchasedPopupCharacters() {
  const charPopup1 = document.getElementById('character_hold1');
  const charPopup2 = document.getElementById('character_hold2');
  const charPopup3 = document.getElementById('character_hold3');
  const charPopup4 = document.getElementById('character_hold4');

  charPopup1.style.display = (character1_level > 0) ? 'block' : 'none';
  charPopup2.style.display = (character2_level > 0) ? 'block' : 'none';
  charPopup3.style.display = (character3_level > 0) ? 'block' : 'none';
  charPopup4.style.display = (character4_level > 0) ? 'block' : 'none';
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
  life++;
  let lifeIcon = document.getElementById(`lifeIcon_img${life}`);
  lifeIcon.style.display = "inline";
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
function abilityHoverForVisibleCharacter() {
  let visibleWrapper = null;
  for (let i = 1; i <= 4; i++) {
    const wrapper = document.querySelector(`#leftUpperWrapper${i}`);
    if (wrapper.style.display !== "none") {
      visibleWrapper = wrapper;
      break;
    }
  }

  if (!visibleWrapper) return;

  const abilities = visibleWrapper.querySelectorAll('.abilityView1, .abilityView2, .abilityView3');
  const popups = document.querySelectorAll('.abilityShop #descriptionPopUp1, .abilityShop #descriptionPopUp2, .abilityShop #descriptionPopUp3');

  // 전부 숨김
  popups.forEach(p => p.style.display = "none");
  abilities.forEach(a => a.style.border = "none");

  selectedIndex1 = null;

  abilities.forEach((ability, index) => {
    const popup = document.querySelector(`#descriptionPopUp${index + 1}`);

    ability.addEventListener("mouseenter", () => {
      if (selectedIndex1 === null && popup) {
        popup.style.display = "block";
      }
    });

    ability.addEventListener("mouseleave", () => {
      if (selectedIndex1 === null && popup) {
        popup.style.display = "none";
      }
    });

    ability.addEventListener("click", () => {
      // 기존 선택 해제
      if (selectedIndex1 !== null) {
        const prevAbility = abilities[selectedIndex1];
        prevAbility.style.transform = "none";
        const prevPopup = document.querySelector(`#descriptionPopUp${selectedIndex1 + 1}`);
        if (prevPopup) prevPopup.style.display = "none";
      }
      ability.style.transform = "scale(1.05)";
      ability.style.transition = "transform 0.2s ease";
      if (popup) popup.style.display = "block";
      selectedIndex1 = index;
    });
  });
}

let selectedIndex2 = null;
function itemPurchase() {
  let purchaseButton = document.querySelector(`#purchaseButton`);

  for (let i = 1; i <= 4; i++) {
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
        document.getElementById(`item${selectedIndex2}`).style.transform = "none";
        document.getElementById(`item${selectedIndex2}`).style.transition = "none";
        let prevPopup = document.querySelector(`.itemShop #descriptionPopUp${selectedIndex2}`);
        if (prevPopup) prevPopup.style.display = "none";
      }

      // 현재 선택 표시
      item.style.transform = "scale(1.05)";
      item.style.transition = "transform 0.2s ease";
      let popup = document.querySelector(`.itemShop #descriptionPopUp${i}`);
      if (popup) popup.style.display = "block";
      selectedIndex2 = i;
    });
  }

  purchaseButton.addEventListener("click", () => {
    if(selectedIndex2==1){
      if(itemPurchased[0] >= 1){
        alert("청소기 아이템은 최대 1개까지만 구매할 수 있습니다.");
        return;
      }
      if(coin>=1000){
        itemPurchased[selectedIndex2 - 1] += 1;
        alert(`아이템 ${selectedIndex2}번을 구매했습니다!`);
        coin -= 1000;
        displayCoin();
      }
      else{
        alert("코인이 부족합니다");
      }
    }else if(selectedIndex2==2){
      if(itemPurchased[1] >= 1){
        alert("시간 연장 아이템은 최대 1개까지만 구매할 수 있습니다.");
        return;
      }
      if(coin>=1500){
        itemPurchased[selectedIndex2 - 1] += 1;
        alert(`아이템 ${selectedIndex2}번을 구매했습니다!`);
        coin -= 1500;
        displayCoin();
      }
      else{
        alert("코인이 부족합니다");
      }
    }else if(selectedIndex2==3){
      if(coin>=2000){
        itemPurchased[selectedIndex2 - 1] += 1;
        alert(`아이템 ${selectedIndex2}번을 구매했습니다!`);
        coin -= 2000;
        displayCoin();
      }
      else{
        alert("코인이 부족합니다");
      }
    }else if(selectedIndex2==4){
      if(itemPurchased[3] >= 1){
        alert("보스 체력 감소 아이템은 최대 1개까지만 구매할 수 있습니다.");
        return;
      }
      if(coin>=3000){
        itemPurchased[selectedIndex2 - 1] += 1;
        alert(`아이템 ${selectedIndex2}번을 구매했습니다!`);
        coin -= 3000;
        displayCoin();
      }
      else{
        alert("코인이 부족합니다");
      }
    }else if(selectedIndex2 == null){
      alert("아이템을 먼저 선택해주세요!");
    }
  });
}

// 초기 캐릭터 설정 함수
function initDefaultCharacterSelection() {
  // 모든 캐릭터 감춤
  for (let i = 1; i <= 4; i++) {
    document.querySelector(`.abilityShop #leftUpperWrapper${i}`).style.display = "none";
  }
  // 기본으로 캐릭터 1 표시
  document.querySelector(`.abilityShop #leftUpperWrapper1`).style.display = "block";
}

function initDefaultPopupSelection() {
  document.querySelector(`#character_popup`).style.display = "none";
  for (let i = 1; i <= 4; i++) {
    document.querySelector(`.abilityShop #character_hold${i}`).style.display = "none";
  }
  if(character1_level!=0){
    document.querySelector(`.abilityShop  #character_hold1`).style.display = "block";
  }
  if(character2_level!=0){
    document.querySelector(`.abilityShop  #character_hold2`).style.display = "block";
  }
  if(character3_level!=0){
    document.querySelector(`.abilityShop  #character_hold3`).style.display = "block";
  }
  if(character4_level!=0){
    document.querySelector(`.abilityShop  #character_hold4`).style.display = "block";
  }
}
function abilitieShopNew(){
  let displayBlock1 = document.querySelector('.abilityShop #leftUpperWrapper1');
  let displayBlock2 = document.querySelector('.abilityShop #leftUpperWrapper2');
  let displayBlock3 = document.querySelector('.abilityShop #leftUpperWrapper3');
  let displayBlock4 = document.querySelector('.abilityShop #leftUpperWrapper4');
  if(selectedCharacter=='char1'){
    displayBlock1.style.display="block";
    displayBlock2.style.display="none";
    displayBlock3.style.display="none";
    displayBlock4.style.display="none";
  }else if(selectedCharacter=='char2'){
    displayBlock2.style.display="block";
    displayBlock1.style.display="none";
    displayBlock3.style.display="none";
    displayBlock4.style.display="none";
  }else if(selectedCharacter=='char3'){
    displayBlock3.style.display="block";
    displayBlock2.style.display="none";
    displayBlock1.style.display="none";
    displayBlock4.style.display="none";
  }else if(selectedCharacter=='char4'){
    displayBlock4.style.display="block";
    displayBlock2.style.display="none";
    displayBlock3.style.display="none";
    displayBlock1.style.display="none";
  }
  abilityHoverForVisibleCharacter();
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
  let descriptionPopUp1 = document.querySelector('.abilityShop #descriptionPopUp1');
  let descriptionPopUp2 = document.querySelector('.abilityShop #descriptionPopUp2');
  let descriptionPopUp3 = document.querySelector('.abilityShop #descriptionPopUp3');
  let selectedWrapper;

  characterButton.addEventListener("click", ()=>{
    filterPurchasedPopupCharacters();
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
  
    for (let i = 1; i <= 4; i++) {
      let wrapper = document.querySelector(`.abilityShop #leftUpperWrapper${i}`);
      if (wrapper.style.display == "block") {
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
    if (src.includes("player.png")) {
      pre = 1;
    } else if (src.includes("player_speed.png")) {
      pre = 2;
    } else if (src.includes("player_time.png")) {
      pre = 3;
    } else if (src.includes("player_shield.png")) {
      pre = 4;
    }

    for(let i=1; i<=4; i++){
      let temp = document.querySelector(`.abilityShop #leftUpperWrapper${i}`);
      temp.style.display = "none";
    }
    if (selectedIndex == null) {
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
    if(selectedIndex==1){
      leftUpperWrapper1.style.display = "block";
      characterPopUp.style.display = "none";
    }
    if(selectedIndex==2){
      leftUpperWrapper2.style.display = "block";
      characterPopUp.style.display = "none";
      descriptionPopUp1.innerHTML = "넓은 방어영역을 가진 세연는 적의 공격을 몸으로 막는다. 그 범위는 생각보다 넓고, 자신보다 약한 존재가 피해보는 걸 절대 용납하지 않는다.";
      descriptionPopUp2.innerHTML = "세연은 말수가 적다. 낯선 이들과 어울리기까지 시간이 오래 걸리지만, 일단 마음을 열면 그 어떤 위기에서도 등 뒤를 지켜주는 든든한 존재가 된다..";
      descriptionPopUp3.innerHTML = "팀원들의 작은 말과 표정도 놓치지 않는다. 누구보다 감정에 민감하고, 이를 토대로 위험을 감지하거나 분위기를 조절한다. 전투보다 회복과 지원에 더 특화되어 있다.";
    }
    if(selectedIndex==3){
      leftUpperWrapper3.style.display = "block";
      characterPopUp.style.display = "none";
      descriptionPopUp1.innerHTML = "물리학과 출신인 준오는 시간의 흐름에 집착했다. 이세계에서 그는 실제로 시간을 느리게 만들거나 멈추는 능력을 얻었다. 짧은 순간을 늘리고, 누구보다 많은 선택지를 가진다.";
      descriptionPopUp2.innerHTML = "이세계의 판타지적 상황에도 쉽게 몰입하지 못한다. 생존 확률, 자원 분배, 위험 관리... 그는 모든 것을 수치로 환산해 판단한다. 때론 비정해 보이지만, 가장 믿을 수 있다.";
      descriptionPopUp3.innerHTML = "이해력과 분석력은 타의 추종을 불허한다. 복잡한 장치나 수수께끼는 그가 한 번 보면 풀린다. 작전이 필요할 땐, 언제나 그의 입을 먼저 본다.";

    }
    if(selectedIndex==4){
      leftUpperWrapper4.style.display = "block";
      characterPopUp.style.display = "none";
      descriptionPopUp1.innerHTML = "체육교육과 출신인 유나은 항상 계주 마지막 주자였다. 날렵한 몸과 정확한 반사신경은 전투에서도 그대로 이어진다. 근접전을 유리하게 이끌 수 있다.";
      descriptionPopUp2.innerHTML = "신중하지는 않지만 망설임도 없다. 즉흥적으로 뛰어들어 상황을 만들고, 그 안에서 적을 휘젓는다. 이 성격은 위기를 기회로 바꾸기도, 때론 문제를 만들기도 한다.";
      descriptionPopUp3.innerHTML = "타고난 청각으로, 소리의 방향과 거리를 정확히 감지한다. 눈보다 귀가 먼저 반응하며, 이는 덫을 피하고 매복을 먼저 알아차리는 데 큰 도움이 된다.";
    }
    abilityHoverForVisibleCharacter();
    return;
  });
}

function characterLevelUp() {
  let levelupButton = document.getElementById('levelupButton');
  levelupButton.addEventListener("click", () => {
    let selectedWrapper;

    for (let i = 1; i <= 4; i++) {
      let wrapper = document.querySelector(`.abilityShop #leftUpperWrapper${i}`);
      if (wrapper.style.display == "block") {
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
    let level, name, characterId;

    if (src.includes("player.png")) {
      level = character1_level;
      name = "지훈";
      characterId = 'char1';
    } else if (src.includes("player_speed.png")) {
      level = character2_level;
      name = "세연";
      characterId = 'char2';
    } else if (src.includes("player_time.png")) {
      level = character3_level;
      name = "준오";
      characterId = 'char3';
    } else if (src.includes("player_shield.png")) {
      level = character4_level;
      name = "유나";
      characterId = 'char4';
    } else {
      alert("캐릭터 이미지를 인식하지 못했습니다.");
      return;
    }

    if (level >= 3) {
      alert("캐릭터 레벨은 Lv.3까지만 존재합니다.");
      return;
    }

    let cost = level * 1000;

    if (coin < cost) {
      alert(`현재 남은 코인은 ${coin}원입니다. 코인 부족으로 레벨업이 불가합니다.`);
      return;
    }

    let yn = confirm(`Lv.${level} → Lv.${level + 1}로 레벨업 하시겠습니까? (${cost}원 소모)`);
    if (yn) {
      coin -= cost;
      level++;

      // 전역 변수 업데이트
      if (src.includes("player.png")) {
        character1_level = level;
      } else if (src.includes("player_speed.png")) {
        character2_level = level;
      } else if (src.includes("player_time.png")) {
        character3_level = level;
      } else if (src.includes("player_shield.png")) {
        character4_level = level;
      }

      // UI 업데이트
      const levelText = selectedWrapper.querySelector('.characterLevel');
      levelText.innerText = `${name}[Lv.${level}]`;
      
      // 코인 표시 업데이트
      displayCoin();
      
      // 현재 선택된 캐릭터와 레벨업한 캐릭터가 같다면 즉시 능력치 적용
      if (selectedCharacter === characterId) {
        console.log(`현재 선택 캐릭터(${characterId})의 레벨이 ${level}로 업그레이드되었습니다.`);
        // 게임이 실행 중이라면 능력치를 즉시 적용할 수 있도록 이벤트 발생
        if (typeof applyCharacterAbilities === 'function') {
          applyCharacterAbilities();
        }
      }
      
      alert(`${name}이(가) Lv.${level}로 레벨업되었습니다!`);
    }
  });
}

function startLifeTimer() {
  // 이미 타이머 돌고 있거나 최대치면 시작 안 함
  if (lifeTimer || life >= 5) return;

  lifeTimer = setInterval(() => {
    if (life < 5) {
      increaseLife();  // 이미 정의된 함수라고 가정

      if (life >= 5) {
        clearInterval(lifeTimer);
        lifeTimer = null;
      }
    }
  }, 1 * 60 * 1000);
}

// GAME.JS 합치기------------------------

const sounds = {
  paddleHit: new Audio("../../assets/sounds/paddle_hit.mp3"),
  brickHit: new Audio("../../assets/sounds/brick_hit.mp3"),
  bossHit: new Audio("../../assets/sounds/boss_hit.mp3"),
  skill1: new Audio("../../assets/sounds/skill1.mp3"),
  bgm1: new Audio("../../assets/music/bgm1.mp3"),
  vacuum: new Audio("../../assets/sounds/vacuum_01.mp3")
};
sounds.bgm1.loop = true;

class Boss {
  constructor(canvasWidth, health = 10) {
      this.x = 0;
      this.y = 0;
      this.width = canvasWidth;
      this.height = 80;
      this.health = health;
      this.maxHealth = health;
      this.visible = true;
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
     
      ctx.font = "16px Arial";
      ctx.fillStyle = "#FFF";
      ctx.textAlign = "center";
      ctx.fillText(`BOSS HP: ${this.health}`, this.width / 2, this.y + this.height - 5);
  }

  checkCollision(ball) {
      if (!this.visible) return false;

      if (ball.y - ball.radius < this.y + this.height &&
          ball.x > this.x &&
          ball.x < this.x + this.width) {
          
          ball.dy = Math.abs(ball.dy);
          this.health -= ball.power;
          sounds.bossHit.play();

          if (this.health <= 0) {
              this.visible = false;
              return true; // 보스 처치됨
          }
      }
      return false;
  }

  spawnProjectiles() {
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
  constructor(maxGauge = 5) {
      this.skillGauge = 0;
      this.maxGauge = maxGauge;
      this.skillReady = false;
      this.width = 160; // 패들 너비를 120에서 160으로 증가
      this.height = 70; // 패들 높이를 40에서 60으로 증가
      this.characterType = 'char1'; // 기본 캐릭터
      
      // 플레이어 애니메이션 관련
      this.animationFrames = [];
      this.currentFrame = 0;
      this.frameTimer = 0;
      this.frameDelay = 15; // 3프레임마다 이미지 변경
      this.isAnimating = false;
      this.animationDuration = 45; // 30프레임 동안 애니메이션
      this.animationTimer = 0;
      
      // 캐릭터별 이미지들
      this.characterImages = {
          char1: {
              default: new Image(),
              animations: []
          },
          char2: {
              default: new Image(),
              animations: []
          },
          char3: {
              default: new Image(),
              animations: []
          },
          char4: {
              default: new Image(),
              animations: []
          }
      };
      
      // 모든 캐릭터 이미지 로딩
      this.loadCharacterImages();
  }
  
  loadCharacterImages() {
      // 캐릭터 1 (공격형) - 기존 player.png를 사용
      this.characterImages.char1.default.src = 'player.png';
      for (let i = 1; i <= 2; i++) {
          const img = new Image();
          img.src = `player_anim_${i}.png`;
          this.characterImages.char1.animations.push(img);
      }
      
      // 캐릭터 2 (속도형) - 빠른 느낌의 이미지
      this.characterImages.char2.default.src = 'player_speed.png';
      for (let i = 1; i <= 2; i++) {
          const img = new Image();
          img.src = `player_speed_anim_${i}.png`;
          this.characterImages.char2.animations.push(img);
      }
      
      // 캐릭터 3 (시간형) - 마법사 느낌의 이미지
      this.characterImages.char3.default.src = 'player_time.png';
      for (let i = 1; i <= 2; i++) {
          const img = new Image();
          img.src = `player_time_anim_${i}.png`;
          this.characterImages.char3.animations.push(img);
      }
      
      // 캐릭터 4 (방어형) - 방패 든 캐릭터 이미지
      this.characterImages.char4.default.src = 'player_shield.png';
      for (let i = 1; i <= 2; i++) {
          const img = new Image();
          img.src = `player_shield_anim_${i}.png`;
          this.characterImages.char4.animations.push(img);
      }
  }
  
  setCharacter(characterType) {
      this.characterType = characterType;
      this.animationFrames = this.characterImages[characterType].animations;
  }

  chargeGauge() {
      if (this.skillGauge < this.maxGauge) {
          this.skillGauge++;
          if (this.skillGauge >= this.maxGauge) {
              this.skillReady = true;
          }
      }
  }

  useSkill(bricks, damage = 2) {
      if (!this.skillReady) return 0;
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
      const currentCharacter = this.characterImages[this.characterType];
      
      if (this.isAnimating && currentCharacter.animations.length > 0) {
          const frame = currentCharacter.animations[this.currentFrame];
          if (frame && frame.complete && frame.naturalWidth > 0) {
              return frame;
          }
      }
      
      // 기본 이미지 반환
      if (currentCharacter.default.complete && currentCharacter.default.naturalWidth > 0) {
          return currentCharacter.default;
      }
      
      // 이미지 로드 실패 시 null 반환 (기존 방식으로 그리기)
      return null;
  }
}

// === 필살기 이펙트 클래스 (단순한 이미지 페이드아웃) ===
class PhoenixEffect {
  constructor(canvasWidth, canvasHeight) {
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
      this.active = false;
      this.duration = 45 // 1초 (60fps 기준)
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

// === 게임 초기화 함수 ===
function initializeGame() {
  // 게임 상수
  const CANVAS_WIDTH = 1000;
  const CANVAS_HEIGHT = 700;
  const PADDLE_WIDTH = 160; // 120에서 160으로 증가
  const PADDLE_HEIGHT = 70; // 40에서 60으로 증가
  const PADDLE_SPEED = 8; // 속도 줄임 (12 -> 8)
  const BALL_RADIUS = 10;
  const BRICK_ROWS = 5;
  const BRICK_COLUMNS = 11;
  const BRICK_WIDTH = 85;
  const BRICK_HEIGHT = 32;
  const BRICK_PADDING = 4;
  const BRICK_OFFSET_TOP = 100; // 60에서 100으로 증가 (보스 높이 증가로 인해)
  const BRICK_OFFSET_LEFT = 12;
  let maxLives = maxHeart; // const에서 let으로 변경
  const ITEM_FALL_SPEED = 2;

  // 스테이지별 공 속도 설정 (전체적으로 속도 줄임)
  const BASE_BALL_SPEED = { dx: 2.5, dy: 2.5 }; // 기본 속도 줄임 (3.5 -> 2.5)
  
  function getStageSpeed(stageNum) {
      const multiplier = 1 + (stageNum - 1) * 0.2; // 각 스테이지마다 10% 증가
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
  const boss = new Boss(CANVAS_WIDTH, 10);
  const phoenixEffect = new PhoenixEffect(CANVAS_WIDTH, CANVAS_HEIGHT);

  // 게임 상태
  let gameStarted = false;
  let gameOver = false;
  let score = 0;
  let lives = maxLives;
  let coins = 0;
  let gameStage = stage; // 전역 stage 변수와 구분하기 위해 gameStage 사용
  let stageTimer = 60;
  let stageTimerInterval = null;
  let bossAttackTimer = null;
  let brickRowTimer = null; // 벽돌 줄 추가 타이머

  // 캐릭터 선택 및 레벨 시스템
  let gameSelectedCharacter = selectedCharacter; // 전역 selectedCharacter 변수 사용
  let gameCharacterLevels = {
      char1: character1_level, // 전역 character1_level 변수 사용
      char2: character2_level, // 전역 character2_level 변수 사용
      char3: character3_level, // 전역 character3_level 변수 사용
      char4: character4_level  // 전역 character4_level 변수 사용
  };
  
  let characterAbilities = {
      char1: { 
          name: "공격형", 
          baseDescription: "공 데미지 증가",
          getLevelStats: (level) => ({
              power: 1 + level, // 레벨당 +1 공격력
              speed: 8,
              description: `공 데미지 +${level} (Lv.${level})`
          })
      },
      char2: { 
          name: "속도형", 
          baseDescription: "이동속도 증가",
          getLevelStats: (level) => ({
              power: 1,
              speed: 8 + (level * 2), // 레벨당 +2 속도
              description: `이동속도 +${level * 2} (Lv.${level})`
          })
      },
      char3: { 
          name: "시간형", 
          baseDescription: "시간정지 능력",
          timeStop: true,
          getLevelStats: (level) => ({
              power: 1,
              speed: 8,
              timeStopDuration: 600 + (level - 1) * 300, // 레벨당 +5초 (300프레임)
              timeStopCooldown: Math.max(900, 1800 - (level - 1) * 300), // 레벨당 -5초 쿨다운 (최소 15초)
              description: `시간정지 ${10 + (level - 1) * 5}초 (Lv.${level})`
          })
      },
      char4: { 
          name: "방어형", 
          baseDescription: "넓은 방어영역",
          shield: true,
          getLevelStats: (level) => ({
              power: 1,
              speed: 8,
              shieldSize: 150 + (level - 1) * 50, // 레벨당 +50 방어영역
              description: `방어영역 +${150 + (level - 1) * 50} (Lv.${level})`
          })
      }
  };
  
  // 캐릭터 능력치 적용 함수
  function applyCharacterAbilities() {
    if (!gameSelectedCharacter) return;
    
    // ===== 최신 캐릭터 레벨 정보 실시간 업데이트 =====
    gameCharacterLevels = {
        char1: character1_level,
        char2: character2_level, 
        char3: character3_level,
        char4: character4_level
    };
    
    const char = characterAbilities[gameSelectedCharacter];
    const level = gameCharacterLevels[gameSelectedCharacter];
    const stats = char.getLevelStats(level);
    
    ball.power = stats.power;
    paddle.speed = stats.speed;
    
    // 시간형 캐릭터 특수 능력
    if (char.timeStop) {
        // 시간정지 능력은 useTimeStop 함수에서 레벨을 참조
    }
    
    // 방어형 캐릭터 특수 능력
    if (char.shield) {
        paddle.shieldWidth = PADDLE_WIDTH + stats.shieldSize;
        paddle.shieldHeight = PADDLE_HEIGHT + 10;
    }
    
    // UI 업데이트
    const characterInfoEl = document.getElementById('character-info');
    if (characterInfoEl) {
        characterInfoEl.textContent = `${char.name}: ${stats.description}`;
    }
    
    console.log(`=== 캐릭터 능력치 적용 ===`);
    console.log(`캐릭터: ${char.name} (ID: ${gameSelectedCharacter})`);
    console.log(`레벨: ${level}`);
    console.log(`능력치 - 공격력: ${stats.power}, 속도: ${stats.speed}`);
    if (char.shield) {
        console.log(`방어영역 크기: ${stats.shieldSize}`);
    }
    if (char.timeStop) {
        console.log(`시간정지 지속시간: ${stats.timeStopDuration}프레임`);
    }
  }

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
  const itemTypes = ["heart", "coin"];

  // === 키보드 이벤트 ===
  document.addEventListener("keydown", function (e) {
      if (e.keyCode === 37) leftPressed = true;
      else if (e.keyCode === 39) rightPressed = true;
  });

  document.addEventListener("keyup", function (e) {
      if (e.keyCode === 37) leftPressed = false;
      else if (e.keyCode === 39) rightPressed = false;
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
      updateTimerDisplay();
      
      stageTimerInterval = setInterval(() => {
          if (!timeStopActive) {
              stageTimer--;
              updateTimerDisplay();
              
              if (stageTimer <= 0) {
                  clearInterval(stageTimerInterval);
                  gameOver = true;
                  showMenu("시간 초과! 게임 오버", false, true);
              }
          }
      }, 1000);
  }

  function startBrickRowTimer() {
      clearInterval(brickRowTimer);
      
      brickRowTimer = setInterval(() => {
          if (!timeStopActive && gameStarted && !gameOver) {
              addNewBrickRow();
          }
      }, 15000);
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
    if (gameSelectedCharacter !== 'char3' || timeStopActive || timeStopCooldown > 0) return;
    
    // ===== 최신 캐릭터 레벨 정보 실시간 반영 =====
    const currentLevel = character3_level; // 전역 변수에서 최신 레벨 가져오기
    
    const char = characterAbilities[gameSelectedCharacter];
    const stats = char.getLevelStats(currentLevel);
    
    timeStopActive = true;
    timeStopDuration = stats.timeStopDuration;
    timeStopCooldown = stats.timeStopCooldown;
    
    boss.projectiles = [];
    
    const overlay = document.getElementById('time-stop-overlay');
    if (overlay) {
        overlay.classList.remove('hidden');
    }
    
    console.log(`=== 시간정지 사용 ===`);
    console.log(`캐릭터 레벨: ${currentLevel}`);
    console.log(`지속시간: ${stats.timeStopDuration}프레임 (${(stats.timeStopDuration/60).toFixed(1)}초)`);
    console.log(`쿨다운: ${stats.timeStopCooldown}프레임 (${(stats.timeStopCooldown/60).toFixed(1)}초)`);
  }

  function useSkill() {
      if (player.skillReady) {
          phoenixEffect.activate();
          const gainedScore = player.useSkill(bricks);
          score += gainedScore;
          updateUI();
          sounds.skill1.play();
      }
  }

let shieldAvailable = false; // 보호막 아이템 상태 저장
let vacuumReady = false; // 청소기 아이템 사용 여부

//아이템 아이콘 표시 함수 추가
  function updateVacuumIconDisplay() {
    const icon = document.getElementById("vacuum-icon");
    if (vacuumReady) {
      icon.src = "itemIcon_img2.png"; // 실제 청소기 아이콘 경로로 교체
      icon.style.display = "block";
    } else {
      icon.style.display = "none";
    }
  }


  function startGame() {
    sounds.bgm1.play();
    hideTimeStopOverlay();
   
    if (life <= 0) {
      alert("생명이 부족합니다! 잠시 뒤 다시 시도해주세요.");
      return;
    }
    displayLife();
    decreaseLife();
    startLifeTimer();
   
    gameStarted = true;
    gameOver = false;
    
    // ===== 최신 전역 변수들에서 게임 정보 로드 =====
    gameStage = stage;
    gameSelectedCharacter = selectedCharacter;
    
    // ===== 최신 캐릭터 레벨 정보 실시간 로드 =====
    gameCharacterLevels = {
        char1: character1_level,
        char2: character2_level,
        char3: character3_level,
        char4: character4_level
    };
    
    console.log("=== 게임 시작 정보 ===");
    console.log("- 선택된 스테이지:", gameStage);
    console.log("- 선택된 캐릭터:", gameSelectedCharacter);
    console.log("- 현재 캐릭터 레벨들:", gameCharacterLevels);
    console.log("- 선택된 캐릭터의 레벨:", gameCharacterLevels[gameSelectedCharacter]);
    
    score = 0;
    coins = 0;
    
    // 🟢 아이템 효과를 기본값에서 계산
    let gameMaxLives = maxHeart; // 기본 최대 체력
    let gameStageTimer = 60; // 기본 스테이지 시간
    let gameVacuumReady = false;
    
    // 🟢 일회성 아이템 사용 (배열에서 차감)
    if (itemPurchased[0] > 0) {
      gameVacuumReady = true;
      itemPurchased[0]--; // 청소기 아이템 하나 차감
      console.log("청소기 아이템 사용됨, 남은 개수:", itemPurchased[0]);
    }
    if (itemPurchased[1] > 0) {
      gameStageTimer += 20; // 기본 시간에 추가
      itemPurchased[1]--; // 시간 증가 아이템 하나 차감
      console.log("시간 증가 아이템 사용됨, 남은 개수:", itemPurchased[1]);
    }
    
    // 🟢 최대 체력 아이템은 영구적 (차감하지 않음)
    if (itemPurchased[2] > 0) {
      gameMaxLives += itemPurchased[2]; // 구매한 개수만큼 추가
    }
    
    // 계산된 값들 적용
    maxLives = gameMaxLives;
    lives = maxLives;
    stageTimer = gameStageTimer;
    vacuumReady = gameVacuumReady;
    
    // 캐릭터 설정 및 능력치 적용
    player.setCharacter(gameSelectedCharacter);
    applyCharacterAbilities();
    
    setupBossForStage(gameStage);
    
    // 🟢 보스 체력 감소 아이템 사용 (일회성)
    if (itemPurchased[3] > 0) {
      boss.health = Math.max(0, boss.health - 5);
      itemPurchased[3]--; // 보스 체력 감소 아이템 하나 차감
      console.log("보스 체력 감소 아이템 사용됨, 남은 개수:", itemPurchased[3]);
    }
    
    initBricks();
    resetBall();
    setBallSpeedForStage(gameStage);
    updateUI();
    
    const overlay = document.getElementById('time-stop-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
    timeStopActive = false;
    timeStopCooldown = 0;
    timeStopDuration = 0;
   
    const gameMenu = document.getElementById("game-menu");
    if (gameMenu) {
        gameMenu.classList.add("hidden");
    }
    
    startStageTimer();
    startBrickRowTimer();
    
    bossAttackTimer = setInterval(() => {
        if (boss.visible && !timeStopActive) {
            boss.spawnProjectiles(gameStage);
        }
    }, boss.attackInterval);
    
    requestAnimationFrame(gameLoop);
   
    // 청소기 아이템 아이콘 업데이트
    if (gameVacuumReady) {
      updateVacuumIconDisplay();
    }
   }

document.addEventListener("keyup", function (e) {
  if (e.keyCode === 68) { // D 키
    if (vacuumReady) {
       if (sounds.vacuum) sounds.vacuum.play();
      let maxY = Math.max(...bricks.map(b => b.y));
      bricks.forEach(b => {
        if (b.y === maxY && b.visible) {
          b.visible = false;
        }
      });
      vacuumReady = false;
      //itemPurchased[3] = false; // 아이템 사용 완료 처리
      //renderItemIcons(); // 아이콘 갱신
      updateVacuumIconDisplay();
    }
  }
});

  function quitGame() {
    gameStarted = false;
    gameOver = false;
    clearInterval(stageTimerInterval);
    clearInterval(bossAttackTimer);
    clearInterval(brickRowTimer);
    
    // 게임에서 모은 코인을 전역 coin에 누적 저장
    coin += coins; // 게임 내에서 얻은 코인을 전역 코인에 더하기
    displayCoin(); // 헤더 코인 표시 업데이트
    
    // 게임 화면 숨기기
    const gameDiv = document.querySelector(".main-game");
    if (gameDiv) {
        gameDiv.style.display = "none";
    }
    
    // 마을 화면 보이기
    const village = document.querySelector('.village');
    if (village) {
        village.style.display = 'block';
    }
    
    // 다른 상점 화면들 숨기기
    const characterShop = document.querySelector('.characterShop');
    const abilityShop = document.querySelector('.abilityShop');
    const itemShop = document.querySelector('.itemShop');
    const shopPopup = document.getElementById('shopPopup');
    
    if (characterShop) characterShop.style.display = 'none';
    if (abilityShop) abilityShop.style.display = 'none';
    if (itemShop) itemShop.style.display = 'none';
    if (shopPopup) shopPopup.style.display = 'none';
    
    // 시간정지 오버레이 숨기기
    hideTimeStopOverlay();
    
    // BGM 정지
    if (sounds && sounds.bgm1) {
        sounds.bgm1.pause();
        sounds.bgm1.currentTime = 0;
    }
    
    // 게임 메뉴를 초기 상태로 되돌리기 (게임 시작 메뉴 표시)
    showMenu("게임 시작", true);
}

function showMenu(message, isStart = false, showScore = false) {
  // 게임 오버 시 코인을 전역 변수에 누적 저장
  if (showScore && !isStart) {
      displayCoin(); // 헤더 코인 표시 업데이트
  }
  
  let menuMessage = message;
  if (showScore) {
      menuMessage += `\n최종 점수: ${score}`;
      menuMessage += `\n획득 코인: ${coins}`;
  }
  
  const menuMessageEl = document.getElementById("menu-message");
  const gameMenuEl = document.getElementById("game-menu");
  const startBtnEl = document.getElementById("start-button");
  const quitBtnEl = document.getElementById("quit-button");
  
  if (menuMessageEl) menuMessageEl.textContent = menuMessage;
  if (gameMenuEl) gameMenuEl.classList.remove("hidden");
  if (startBtnEl) startBtnEl.style.display = isStart ? "block" : "none";
  if (quitBtnEl) quitBtnEl.style.display = "block";
}

function nextStage() {
  gameStage++;
  
  if (gameStage > 4) {
      // 모든 스테이지 완료 시 코인 누적 저장
      coin += coins;
      displayCoin();
      gameOver = true;
      showMenu("모든 스테이지 완료!", false, true);
      return;
  }
  
  // 스테이지 클리어 시마다 코인 누적 저장 (중간 저장)
  coin += coins;
  displayCoin();
  // 다음 스테이지를 위해 게임 내 코인은 다시 0으로 리셋
  coins = 0;
  
  setupBossForStage(gameStage);
  initBricks();
  resetBall();
  setBallSpeedForStage(gameStage);
  updateUI();
  
  startStageTimer();
  startBrickRowTimer();
  
  clearInterval(bossAttackTimer);
  bossAttackTimer = setInterval(() => {
      if (boss.visible && !timeStopActive) {
          boss.spawnProjectiles(gameStage);
      }
  }, boss.attackInterval);
}

  function updateUI() {
      const scoreEl = document.getElementById("score");
      const heartsEl = document.getElementById("hearts");
      const coinsEl = document.getElementById("coins");
      const stageEl = document.getElementById("stage");
      
      if (scoreEl) scoreEl.textContent = score;
      if (heartsEl) heartsEl.textContent = lives;
      if (coinsEl) coinsEl.textContent = coins;
      if (stageEl) stageEl.textContent = gameStage;
      updateGaugeUI();
  }

  function resetBall() {
      ball.x = paddle.x + paddle.width / 2;
      ball.y = CANVAS_HEIGHT - PADDLE_HEIGHT - BALL_RADIUS - 10;
      const speeds = getStageSpeed(gameStage);
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
            lives = Math.min(lives + 1, maxLives);
            break;
        case "coin":
            coins+= 1000; // 게임 내 코인 증가 (0부터 시작)
            // 전역 코인은 실시간으로 증가시키지 않고, 게임 종료/나가기/스테이지 클리어 시에만 누적
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
    if (gameSelectedCharacter === 'char4') {
        const shieldLeft = paddle.x - (paddle.shieldWidth - paddle.width) / 2;
        const shieldRight = shieldLeft + paddle.shieldWidth;
        const shieldTop = paddle.y - (paddle.shieldHeight - paddle.height) / 2;
        const shieldBottom = shieldTop + paddle.shieldHeight;
        
        if (ball.y + ball.radius > shieldTop &&
            ball.y - ball.radius < shieldBottom &&
            ball.x + ball.radius > shieldLeft &&
            ball.x - ball.radius < shieldRight) {
            
            player.startAnimation();
            sounds.paddleHit.play();
            
            const hitPos = (ball.x - shieldLeft) / paddle.shieldWidth;
            const angle = hitPos * Math.PI - Math.PI / 2;
            const speeds = getStageSpeed(gameStage);
            const targetSpeed = Math.sqrt(speeds.dx * speeds.dx + speeds.dy * speeds.dy);
            
            ball.dx = targetSpeed * Math.cos(angle);
            ball.dy = -Math.abs(targetSpeed * Math.sin(angle));
            
            return;
        }
    }
      
      if (ball.y + ball.radius > paddle.y &&
          ball.y + ball.radius < paddle.y + paddle.height &&
          ball.x > paddle.x &&
          ball.x < paddle.x + paddle.width) {
          
          player.startAnimation();
          sounds.paddleHit.play();
          
          const hitPos = (ball.x - paddle.x) / paddle.width;
          const angle = hitPos * Math.PI - Math.PI / 2;
          const speeds = getStageSpeed(gameStage);
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

          if (proj.y > CANVAS_HEIGHT || proj.x < 0 || proj.x > CANVAS_WIDTH) {
              projectilesToRemove.push(i);
              return;
          }

          if (gameSelectedCharacter === 'char4') {
            const shieldLeft = paddle.x - (paddle.shieldWidth - paddle.width) / 2;
            const shieldRight = shieldLeft + paddle.shieldWidth;
            const damageLeft = paddle.x;
            const damageRight = paddle.x + paddle.width;
            
            if (proj.y + proj.height >= paddle.y &&
                proj.x < shieldRight &&
                proj.x + proj.width > shieldLeft) {
                
                if (proj.x < damageRight && proj.x + proj.width > damageLeft) {
                    lives = Math.max(0, lives - 1);
                    updateUI();
                    if (lives <= 0) {
                      forceEndTimeStop();
                        gameOver = true;
                        showMenu("게임 오버", false, true);
                    }
                }
                projectilesToRemove.push(i);
            }
          } else {
              if (proj.y + proj.height >= paddle.y &&
                  proj.x < paddle.x + paddle.width &&
                  proj.x + proj.width > paddle.x) {
                  
                  projectilesToRemove.push(i);
                  lives = Math.max(0, lives - 1);
                  updateUI();
                  if (lives <= 0) {
                      forceEndTimeStop();
                      gameOver = true;
                      showMenu("게임 오버", false, true);
                  }
              }
          }
      });

      for (let i = projectilesToRemove.length - 1; i >= 0; i--) {
          boss.projectiles.splice(projectilesToRemove[i], 1);
      }
  }

  function forceEndTimeStop() {
    if (timeStopActive) {
        timeStopActive = false;
        const overlay = document.getElementById('time-stop-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }
  }

  function hideTimeStopOverlay() {
    const overlay = document.getElementById('time-stop-overlay');
    if (overlay) {
      overlay.classList.add('hidden');
    }
    timeStopActive = false;
    timeStopCooldown = 0;
    timeStopDuration = 0;
  }

  function drawPaddle() {
    if (gameSelectedCharacter === 'char4') {
        const shieldX = paddle.x - (paddle.shieldWidth - paddle.width) / 2;
        const shieldY = paddle.y - (paddle.shieldHeight - paddle.height) / 2;
        
        ctx.fillStyle = "rgba(0, 100, 255, 0.3)";
        ctx.fillRect(shieldX, shieldY, paddle.shieldWidth, paddle.shieldHeight);
        
        ctx.strokeStyle = "#0066FF";
        ctx.lineWidth = 2;
        ctx.strokeRect(shieldX, shieldY, paddle.shieldWidth, paddle.shieldHeight);
    }
    
    const currentImage = player.getCurrentImage();
    if (currentImage) {
        ctx.save();
        ctx.globalAlpha = 1.0;
        ctx.drawImage(currentImage, paddle.x, paddle.y, paddle.width, paddle.height);
        ctx.restore();
    } else {
        let paddleColor = "#4CAF50";
        switch (player.characterType) {
            case 'char1': paddleColor = "#FF5722"; break;
            case 'char2': paddleColor = "#2196F3"; break;
            case 'char3': paddleColor = "#9C27B0"; break;
            case 'char4': paddleColor = "#4CAF50"; break;
        }
        ctx.fillStyle = paddleColor;
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
          
          ctx.fillStyle = "#FFF";
          ctx.font = "8px Arial";
          ctx.textAlign = "center";
          if (proj.type === "fast") ctx.fillText("!", proj.x + proj.width/2, proj.y + proj.height/2);
          else if (proj.type === "parabola") ctx.fillText("~", proj.x + proj.width/2, proj.y + proj.height/2);
          else if (proj.type === "accel") ctx.fillText("↓", proj.x + proj.width/2, proj.y + proj.height/2);
      });
  }

  function update() {
      if (gameOver) return;

      if (timeStopActive) {
          timeStopDuration--;

          if (timeStopDuration <= 0) {
              timeStopActive = false;
              const overlay = document.getElementById('time-stop-overlay');
              if (overlay) {
                  overlay.classList.add('hidden');
              }
          }
      }

      if (timeStopCooldown > 0) {
          timeStopCooldown--;
      }

      player.updateAnimation();
      phoenixEffect.update();

      if (leftPressed && paddle.x > 0) {
          paddle.x -= paddle.speed;
      } else if (rightPressed && paddle.x + paddle.width < CANVAS_WIDTH) {
          paddle.x += paddle.speed;
      }

      ball.x += ball.dx;
      ball.y += ball.dy;

      if (!timeStopActive) {
          items.forEach(item => {
              item.y += ITEM_FALL_SPEED;
          });
      }

      if (ball.x - ball.radius < 0 || ball.x + ball.radius > CANVAS_WIDTH) {
          ball.dx = -ball.dx;
      }

      if (ball.y - ball.radius < 0) {
          ball.dy = -ball.dy;
      }

      if (ball.y + ball.radius > CANVAS_HEIGHT) {
          lives--;
          updateUI();

          if (lives <= 0) {
              gameOver = true;
              showMenu("게임 오버", false, true);
          } else {
              resetBall();
          }
      }

      checkPaddleCollision();
      checkBrickCollision();
      checkItemCollision();
      
      if (!timeStopActive) {
          updateBossProjectiles();
      }

      if (boss.checkCollision(ball)) {
          clearInterval(stageTimerInterval);
          clearInterval(bossAttackTimer);
          clearInterval(brickRowTimer);
          forceEndTimeStop();
          
          setTimeout(() => {
              nextStage();
          }, 2000);
      }

      for (let i = 0; i < bricks.length; i++) {
          if (bricks[i].visible && bricks[i].y + bricks[i].height >= CANVAS_HEIGHT - PADDLE_HEIGHT - 20) {
              forceEndTimeStop();
              gameOver = true;
              showMenu("게임 오버", false, true);
              break;
          }
      }
  }

  function draw() {
      ctx.fillStyle = "#222";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  
      const bgImage = new Image();
      bgImage.src = `background_stage_${gameStage}.jpg`;
      
      if (bgImage.complete && bgImage.naturalWidth > 0) {
          ctx.drawImage(bgImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }
  
      drawBricks();
      drawPaddle();
      drawBall();
      drawItems();
      boss.draw(ctx);
      drawBossProjectiles();
  
      phoenixEffect.draw(ctx);
  
      ctx.font = "20px Arial";
      ctx.fillStyle = "#FFF";
      ctx.textAlign = "left";
      ctx.fillText(`점수: ${score}`, 10, 30);
  
      ctx.textAlign = "center";
      ctx.fillText(`스테이지: ${gameStage}`, CANVAS_WIDTH / 2, 30);
  
      ctx.textAlign = "right";
      ctx.fillText(`생명: ${lives}`, CANVAS_WIDTH - 10, 30);
      ctx.fillText(`코인: ${coins}`, CANVAS_WIDTH - 10, 60);
  
      if (selectedCharacter === 'char3' && timeStopCooldown > 0) {
          ctx.textAlign = "left";
          ctx.fillStyle = "#00FFFF";
          const cooldownSeconds = Math.ceil(timeStopCooldown / 60);
          ctx.fillText(`시간정지 쿨다운: ${cooldownSeconds}초`, 10, 60);
      }
  }

  function gameLoop() {
      if (!gameStarted || gameOver) return;

      update();
      draw();

      requestAnimationFrame(gameLoop);
  }

  const startButton = document.getElementById("start-button");
  const quitButton = document.getElementById("quit-button");
  
  if (startButton) startButton.addEventListener("click", startGame);
  if (quitButton) quitButton.addEventListener("click", quitGame);

  updateGaugeUI();
  player.setCharacter(gameSelectedCharacter);
  applyCharacterAbilities();
  updateUI();
  
  showMenu("게임 시작", true);
}