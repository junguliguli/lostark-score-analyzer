// 캐릭터 관련 기본 작업들

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