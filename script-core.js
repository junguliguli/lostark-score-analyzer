// 전역 변수
let characters = [];
let currentRenameIndex = -1;

// 페이지 로드 시 저장된 데이터 불러오기
window.onload = function() {
    loadCharacters();
    updateCharacterList();
    updateCharacterCards();
    
    // Enter 키로 이름 변경 확인
    document.getElementById('newNameInput').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            saveNewName();
        }
    });
    
    // 오버레이 클릭 시 모달 닫기
    document.getElementById('renameModalOverlay').addEventListener('click', closeRenameModal);
};

// 로컬 스토리지에 저장
function saveCharacters() {
    localStorage.setItem('loaCharacters', JSON.stringify(characters));
}

// 로컬 스토리지에서 불러오기
function loadCharacters() {
    const saved = localStorage.getItem('loaCharacters');
    if (saved) {
        try {
            characters = JSON.parse(saved);
        } catch (error) {
            console.error('저장된 데이터를 불러오는 중 오류가 발생했습니다:', error);
            characters = [];
        }
    }
}

// 캐릭터 목록 업데이트
function updateCharacterList() {
    const listElement = document.getElementById('characterList');
    listElement.innerHTML = '';
    
    if (characters.length === 0) {
        listElement.innerHTML = '<p>저장된 캐릭터가 없습니다.</p>';
        return;
    }
    
    characters.forEach((character, index) => {
        const item = document.createElement('div');
        item.className = 'character-item';
        if (character.selected) {
            item.classList.add('selected');
        }
        
        item.innerHTML = `
            <input type="checkbox" ${character.selected ? 'checked' : ''} 
                   onchange="toggleCharacterSelection(${index}, this.checked)">
            <span class="character-name" onclick="openRenameModal(${index})">${character.name}</span>
        `;
        
        // 삭제 버튼
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'small danger';
        deleteBtn.textContent = '삭제';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteCharacter(index);
        };
        
        item.appendChild(deleteBtn);
        
        listElement.appendChild(item);
    });
    
    // 분석 버튼 활성화/비활성화
    const selectedCharacters = characters.filter(char => char.selected);
    document.getElementById('analyzeBtn').disabled = selectedCharacters.length < 2;
}

// 캐릭터 카드 업데이트
function updateCharacterCards() {
    const cardsContainer = document.getElementById('characterCards');
    cardsContainer.innerHTML = '';
    
    const selectedCharacters = characters.filter(char => char.selected);
    
    if (selectedCharacters.length === 0) {
        document.getElementById('analysisEmpty').classList.remove('hidden');
    } else {
        document.getElementById('analysisEmpty').classList.add('hidden');
        
        selectedCharacters.forEach(character => {
            const card = document.createElement('div');
            card.className = 'character-card';
            
            // 총점 계산
            const totalScore = Object.values(character.stats).reduce((sum, val) => sum + val, 0);
            
            // 카드 내용 생성
            card.innerHTML = `
                <h3>${character.name}</h3>
                <div class="stat-row">
                    <span class="stat-name">초월:</span>
                    <span class="stat-value">${character.stats.transcendence.toFixed(2)}%</span>
                </div>
                <div class="stat-row">
                    <span class="stat-name">장비:</span>
                    <span class="stat-value">${character.stats.equipment.toFixed(2)}%</span>
                </div>
                <div class="stat-row">
                    <span class="stat-name">엘릭서:</span>
                    <span class="stat-value">${character.stats.elixir.toFixed(2)}%</span>
                </div>
                <div class="stat-row">
                    <span class="stat-name">진화, 깨달음, 도약:</span>
                    <span class="stat-value">${character.stats.evolution.toFixed(2)}%</span>
                </div>
                <div class="stat-row">
                    <span class="stat-name">각인:</span>
                    <span class="stat-value">${character.stats.engravings.toFixed(2)}%</span>
                </div>
                <div class="stat-row">
                    <span class="stat-name">보석:</span>
                    <span class="stat-value">${character.stats.gems.toFixed(2)}%</span>
                </div>
                <div class="stat-row">
                    <span class="stat-name">카드:</span>
                    <span class="stat-value">${character.stats.cards.toFixed(2)}%</span>
                </div>
                <div class="stat-row">
                    <span class="stat-name">악세 품질,특옵:</span>
                    <span class="stat-value">${character.stats.accessories.toFixed(2)}%</span>
                </div>
                <div class="stat-row">
                    <span class="stat-name">어빌리티 스톤:</span>
                    <span class="stat-value">${character.stats.abilityStone.toFixed(2)}%</span>
                </div>
                <div class="stat-row">
                    <span class="stat-name">팔찌:</span>
                    <span class="stat-value">${character.stats.bracelet.toFixed(2)}%</span>
                </div>
                <div class="stat-row">
                    <span class="stat-name">아바타:</span>
                    <span class="stat-value">${character.stats.avatar.toFixed(2)}%</span>
                </div>
                <div class="stat-row">
                    <span class="stat-name">펫,내실 치특신:</span>
                    <span class="stat-value">${character.stats.pet.toFixed(2)}%</span>
                </div>
                <div class="stat-row" style="margin-top: 10px; font-weight: bold; border-top: 1px solid #444; padding-top: 8px;">
                    <span class="stat-name">총 합계:</span>
                    <span class="stat-value">${totalScore.toFixed(2)}%</span>
                </div>
            `;
            
            cardsContainer.appendChild(card);
        });
    }
}