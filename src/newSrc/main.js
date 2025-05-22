window.addEventListener('DOMContentLoaded', () => {
  setupCharacterModalEvents();
  setupShopPopupEvents();
  setupBackButtons();
});

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

    // Village의 오른쪽 하단에 캐릭터 카드 생성 또는 교체
          const rightDisplay = document.getElementById('villageRightDisplay');

    // 이전 캐릭터 카드 있으면 제거 (필요 시)
          const existingCard = rightDisplay.querySelector('.village-character-card');
          if (existingCard) {
            existingCard.remove();
          }

    // 새 카드 요소 생성
          const newCard = document.createElement('div');
          newCard.className = 'village-character-card';
    newCard.style.marginTop = 'auto'; // 하단 정렬
    newCard.innerHTML = `
      <img class="character-image" src="${imgEl}" alt="캐릭터 이미지" />
    `;

    // 추가
    rightDisplay.appendChild(newCard);

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

  characterBtn.addEventListener('click', () => {
    characterShop.style.display = 'block';
    abilityShop.style.display = 'none';
    if(itemShop) itemShop.style.display = 'none';
    village.style.display = 'none';
    shopPopup.style.display = 'none';
  });

  abilityBtn.addEventListener('click', () => {
    characterShop.style.display = 'none';
    abilityShop.style.display = 'block';
    if(itemShop) itemShop.style.display = 'none';
    village.style.display = 'none';
    shopPopup.style.display = 'none';
  });

  itemBtn.addEventListener('click', () => {
    characterShop.style.display = 'none';
    abilityShop.style.display = 'none';
    if(itemShop) itemShop.style.display = 'block';
    village.style.display = 'none';
    shopPopup.style.display = 'none';
  });

  closeShopPopup.addEventListener('click', () => {
    shopPopup.style.display = 'none';
  });
}

function setupBackButtons() {
  const backVillageBtn = document.getElementById("backVillageButton");
  const characterShop = document.querySelector('.characterShop');
  const abilityShop = document.querySelector('.abilityShop');
  const itemShop = document.querySelector('.itemShop');
  const village = document.querySelector('.village');
  const shopPopup = document.getElementById('shopPopup');

  backVillageBtn.addEventListener("click", function () {
    shopPopup.style.display = 'flex';
    village.style.display = 'block';
    characterShop.style.display = 'none';
    abilityShop.style.display = 'none';
    if (itemShop) itemShop.style.display = 'none';
    backVillageBtn.textContent = "Go to Shop";
  });

  document.getElementById("backButton").addEventListener("click", function () {
    village.style.display = 'none';
    characterShop.style.display = 'block';
    backVillageBtn.textContent = "Back to the Village";
  });
}
//----------header

var level = 0;

function increaseLevel() {
    level++;
    const bar = document.getElementById("levelFill");
    bar.style.width = `${Math.min(level * 90, 450)}px`; // 최대 450px
}
