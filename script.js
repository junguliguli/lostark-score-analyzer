// 전역 변수
let characters = [];
let currentRenameIndex = -1;

// 페이지 로드 시 저장된 데이터 불러오기
window.onload = function() {
    loadCharacters();
    updateCharacterList();
    updateCharacterCards();
};

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

// 캐릭터 선택 토글
function toggleCharacterSelection(index, selected) {
    characters[index].selected = selected;
    saveCharacters();
    updateCharacterList();
    updateCharacterCards();
}

// 모든 캐릭터 선택
function selectAll() {
    characters.forEach(char => {
        char.selected = true;
    });
    saveCharacters();
    updateCharacterList();
    updateCharacterCards();
}

// 모든 캐릭터 선택 해제
function deselectAll() {
    characters.forEach(char => {
        char.selected = false;
    });
    saveCharacters();
    updateCharacterList();
    updateCharacterCards();
}

// 캐릭터 삭제
function deleteCharacter(index) {
    if (confirm('이 캐릭터를 삭제하시겠습니까?')) {
        characters.splice(index, 1);
        saveCharacters();
        updateCharacterList();
        updateCharacterCards();
    }
}

// 모든 캐릭터 삭제
function deleteAllCharacters() {
    if (confirm('모든 캐릭터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        characters = [];
        saveCharacters();
        updateCharacterList();
        updateCharacterCards();
        
        document.getElementById('analysisContent').classList.add('hidden');
        document.getElementById('analysisEmpty').classList.remove('hidden');
    }
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

// 캐릭터 분석
function analyzeCharacters() {
    const selectedCharacters = characters.filter(char => char.selected);
    
    if (selectedCharacters.length < 2) {
        alert('비교를 위해서는 최소 2개 이상의 캐릭터를 선택해야 합니다.');
        return;
    }
    
    const analysisContent = document.getElementById('analysisContent');
    
    // 분석을 위한 카테고리와 속성 정의
    const categories = [
        '초월', '장비', '엘릭서', '진화/깨달음/도약', 
        '각인', '보석', '카드', '악세 품질,특옵', 
        '어빌리티 스톤', '팔찌', '아바타', '펫,내실'
    ];
    
    const statProps = [
        'transcendence', 'equipment', 'elixir', 'evolution',
        'engravings', 'gems', 'cards', 'accessories',
        'abilityStone', 'bracelet', 'avatar', 'pet'
    ];
    
    // 분석 HTML 생성
    let analysisHTML = '<div class="analysis-section"><h3>항목별 최소값 분석</h3><ul style="padding-left:20px;">';
    
    categories.forEach((category, index) => {
        const statValues = selectedCharacters.map(character => {
            return {
                name: character.name,
                value: character.stats[statProps[index]]
            };
        });
        
        // 최소값 찾기
        statValues.sort((a, b) => a.value - b.value);
        const minChar = statValues[0];
        const maxChar = statValues[statValues.length - 1];
        
        // 절대적 차이 계산 (단순 뺄셈)
        const difference = (maxChar.value - minChar.value).toFixed(2);
        
        // 결과 추가
        analysisHTML += `<li style="margin-bottom:8px;"><strong>${category}:</strong> 
            <span style="color:#ff9999;">${minChar.name}</span>이(가) 가장 낮음 (${minChar.value.toFixed(2)}%)`;
        
        if (statValues.length > 1) {
            analysisHTML += ` - 최고값 ${maxChar.value.toFixed(2)}%와의 차이: ${difference}% 포인트`;
        }
        
        analysisHTML += `</li>`;
    });
    
    // 총점 비교
    const totalScores = selectedCharacters.map(character => {
        return {
            name: character.name,
            value: Object.values(character.stats).reduce((sum, val) => sum + val, 0)
        };
    });
    
    totalScores.sort((a, b) => a.value - b.value);
    const minTotalChar = totalScores[0];
    const maxTotalChar = totalScores[totalScores.length - 1];
    const totalDifference = (maxTotalChar.value - minTotalChar.value).toFixed(2);
    
    analysisHTML += `</ul><div style="margin-top:20px;"><h3>총점 비교</h3>`;
    analysisHTML += `<p><strong>${minTotalChar.name}</strong>이(가) 가장 낮은 총점 (${minTotalChar.value.toFixed(2)}%)`;
    
    if (totalScores.length > 1) {
        analysisHTML += ` - 최고값 ${maxTotalChar.value.toFixed(2)}%와의 차이: ${totalDifference}% 포인트`;
    }
    
    analysisHTML += `</p></div>`;
    
    // 개선 우선순위 제안
    if (selectedCharacters.length > 1) {
        const lowestChar = selectedCharacters.reduce((prev, current) => {
            const prevTotal = Object.values(prev.stats).reduce((sum, val) => sum + val, 0);
            const currentTotal = Object.values(current.stats).reduce((sum, val) => sum + val, 0);
            return prevTotal < currentTotal ? prev : current;
        });
        
        const statEntries = Object.entries(lowestChar.stats)
            .map(([key, value]) => ({ key, value }))
            .sort((a, b) => {
                // 점수가 낮을수록, 최대값과의 차이가 클수록 우선순위 높음
                const maxA = Math.max(...selectedCharacters.map(char => char.stats[a.key] || 0));
                const maxB = Math.max(...selectedCharacters.map(char => char.stats[b.key] || 0));
                const diffA = maxA - a.value;
                const diffB = maxB - b.value;
                
                // 차이가 큰 것이 우선, 같으면 현재 값이 작은 것이 우선
                return diffB - diffA || a.value - b.value;
            });
        
        const statMapping = {
            transcendence: '초월',
            equipment: '장비',
            elixir: '엘릭서',
            evolution: '진화, 깨달음, 도약',
            engravings: '각인',
            gems: '보석',
            cards: '카드',
            accessories: '악세 품질,특옵',
            abilityStone: '어빌리티 스톤',
            bracelet: '팔찌',
            avatar: '아바타',
            pet: '펫,내실 치특신'
        };
        
        analysisHTML += `<div class="analysis-section" style="margin-top: 20px;">
        <h3>개선 우선순위 제안 (${lowestChar.name})</h3>
        <p>다음 항목을 순서대로 개선하면 효과적입니다:</p>
        <ol>`;
        
        // 상위 3개 항목만 추출
        statEntries.slice(0, 3).forEach(stat => {
            const maxVal = Math.max(...selectedCharacters.map(char => char.stats[stat.key] || 0));
            const diff = maxVal - stat.value;
            
            analysisHTML += `<li><strong>${statMapping[stat.key]}</strong>: 현재 ${stat.value.toFixed(2)}% → 
                최고값 ${maxVal.toFixed(2)}% (차이: ${diff.toFixed(2)}% 포인트)</li>`;
        });
        
        analysisHTML += `</ol></div>`;
    }
    
    analysisHTML += `</div>`;
    
    // 분석 결과 표시
    analysisContent.innerHTML = analysisHTML;
    analysisContent.classList.remove('hidden');
}

// 데이터 내보내기
function exportData() {
    const exportOutput = document.getElementById('exportOutput');
    exportOutput.value = JSON.stringify(characters, null, 2);
    
    document.getElementById('exportModal').classList.remove('hidden');
}

// 클립보드에 복사
function copyToClipboard() {
    const exportOutput = document.getElementById('exportOutput');
    exportOutput.select();
    document.execCommand('copy');
    
    alert('클립보드에 복사되었습니다.');
}

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

// 이름 변경 모달 열기
function openRenameModal(index) {
    currentRenameIndex = index;
    document.getElementById('newNameInput').value = characters[index].name;
    document.getElementById('renameModalOverlay').classList.remove('hidden');
    document.getElementById('renameModal').classList.remove('hidden');
    document.getElementById('newNameInput').focus();
}

// 이름 변경 모달 닫기
function closeRenameModal() {
    document.getElementById('renameModalOverlay').classList.add('hidden');
    document.getElementById('renameModal').classList.add('hidden');
    currentRenameIndex = -1;
}

// 새 이름 저장
function saveNewName() {
    if (currentRenameIndex >= 0) {
        const newName = document.getElementById('newNameInput').value.trim();
        if (newName) {
            characters[currentRenameIndex].name = newName;
            saveCharacters();
            updateCharacterList();
            updateCharacterCards();
            closeRenameModal();
        } else {
            alert('이름을 입력해주세요.');
        }
    }
}

// 대량 데이터 가져오기
function importBulkData() {
    const bulkInput = document.getElementById('bulkInput').value.trim();
    if (!bulkInput) {
        alert('데이터를 입력해주세요.');
        return;
    }
    
    // 캐릭터별로 데이터 분리 (빈 줄로 구분)
    const characterBlocks = bulkInput.split(/\n\s*\n/).filter(block => block.trim() !== '');
    
    let importedCount = 0;
    let updatedCount = 0;
    let characterCount = 0; // 자동 이름 지정을 위한 카운터
    
    // 현재 존재하는 캐릭터 수에서 시작
    characters.forEach(char => {
        if (/^캐릭터\d+$/.test(char.name)) {
            const num = parseInt(char.name.replace('캐릭터', ''));
            if (num > characterCount) characterCount = num;
        }
    });
    
    // 각 캐릭터 블록 처리
    characterBlocks.forEach(block => {
        const lines = block.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) return;
        
        // 첫 번째 줄 확인: 캐릭터 이름 또는 첫 번째 스탯
        let characterName = '';
        let startLine = 0;
        
        // 첫 번째 줄이 스탯 줄인지 확인 (초월, 장비 등의 키워드가 있는지)
        const isStatLine = /초월|장비|엘릭서|진화|각인|보석|카드|악세|어빌리티|팔찌|아바타|펫/.test(lines[0]);
        
        if (isStatLine) {
            // 첫 번째 줄이 스탯이면 자동으로 이름 생성
            characterCount++;
            characterName = `캐릭터${characterCount}`;
            startLine = 0;
        } else {
            // 첫 번째 줄을 이름으로 사용
            characterName = lines[0].trim();
            startLine = 1;
        }
        
        // 환산 점수 데이터 파싱
        const stats = {
            transcendence: 0,       // 초월
            equipment: 0,           // 장비
            elixir: 0,              // 엘릭서
            evolution: 0,           // 진화, 깨달음, 도약
            engravings: 0,          // 각인
            gems: 0,                // 보석
            cards: 0,               // 카드
            accessories: 0,         // 악세 품질,특옵
            abilityStone: 0,        // 어빌리티 스톤
            bracelet: 0,            // 팔찌
            avatar: 0,              // 아바타
            pet: 0                  // 펫,내실 치특신
        };
        
        // 스탯 줄 처리
        for (let i = startLine; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // 값 추출을 위한 정규식 패턴
            const valueMatch = line.match(/(\d+(?:\.\d+)?)/);
            const value = valueMatch ? parseFloat(valueMatch[0]) : 0;
            
            // 각 항목 식별 및 값 저장
            if (line.includes('초월')) {
                stats.transcendence = value;
            } else if (line.includes('장비')) {
                stats.equipment = value;
            } else if (line.includes('엘릭서')) {
                stats.elixir = value;
            } else if (line.includes('진화') || line.includes('깨달음') || line.includes('도약')) {
                stats.evolution = value;
            } else if (line.includes('각인')) {
                stats.engravings = value;
            } else if (line.includes('보석')) {
                stats.gems = value;
            } else if (line.includes('카드')) {
                stats.cards = value;
            } else if (line.includes('악세')) {
                stats.accessories = value;
            } else if (line.includes('어빌리티') || line.includes('스톤')) {
                stats.abilityStone = value;
            } else if (line.includes('팔찌')) {
                stats.bracelet = value;
            } else if (line.includes('아바타')) {
                stats.avatar = value;
            } else if (line.includes('펫') || line.includes('치특신')) {
                stats.pet = value;
            }
        }
        
        // 캐릭터 객체 생성
        const character = {
            name: characterName,
            stats,
            selected: true
        };
        
        // 중복 이름 확인
        const existingIndex = characters.findIndex(c => c.name === characterName);
        if (existingIndex >= 0) {
            // 기존 캐릭터 수정
            character.selected = characters[existingIndex].selected;
            characters[existingIndex] = character;
            updatedCount++;
        } else {
            // 새 캐릭터 추가
            characters.push(character);
            importedCount++;
        }
    });
    
    saveCharacters();
    updateCharacterList();
    updateCharacterCards();
    
    alert(`데이터 가져오기 완료: ${importedCount}개 캐릭터 추가, ${updatedCount}개 캐릭터 업데이트`);
    document.getElementById('bulkInput').value = '';
}

// Enter 키로 이름 변경 확인
document.getElementById('newNameInput').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        saveNewName();
    }
});

// 오버레이 클릭 시 모달 닫기
document.getElementById('renameModalOverlay').addEventListener('click', closeRenameModal);