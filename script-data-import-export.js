// 데이터 가져오기/내보내기 관련 함수들

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

// 데이터 불러오기 모달 열기
function openImportModal() {
    document.getElementById('importInput').value = '';
    document.getElementById('importModal').classList.remove('hidden');
}

// 데이터 불러오기 처리
function importData() {
    const importInput = document.getElementById('importInput').value.trim();
    if (!importInput) {
        alert('데이터를 입력해주세요.');
        return;
    }
    
    try {
        const importedData = JSON.parse(importInput);
        
        if (!Array.isArray(importedData)) {
            alert('유효한 캐릭터 데이터가 아닙니다. 배열 형식이어야 합니다.');
            return;
        }
        
        // 데이터 검증
        for (const char of importedData) {
            if (!char.name || !char.stats) {
                alert('일부 캐릭터 데이터가 유효하지 않습니다. 이름과 스탯 정보가 있어야 합니다.');
                return;
            }
        }
        
        // 데이터 통합 방식 선택
        const importChoice = confirm(
            '데이터 불러오기 방식을 선택하세요:\n\n' +
            '확인: 기존 데이터에 추가 (같은 이름의 캐릭터는 업데이트)\n' +
            '취소: 모든 기존 데이터를 지우고 완전히 새로운 데이터로 대체'
        );
        
        let addedCount = 0;
        let updatedCount = 0;
        
        if (importChoice) {
            // 기존 데이터에 추가 (같은 이름은 업데이트)
            importedData.forEach(importChar => {
                const existingIndex = characters.findIndex(c => c.name === importChar.name);
                if (existingIndex >= 0) {
                    // 기존에 있던 캐릭터 선택 상태 유지
                    importChar.selected = characters[existingIndex].selected;
                    characters[existingIndex] = importChar;
                    updatedCount++;
                } else {
                    characters.push(importChar);
                    addedCount++;
                }
            });
            
            alert(`데이터 불러오기 완료!\n${addedCount}개 캐릭터 추가, ${updatedCount}개 캐릭터 업데이트됨`);
        } else {
            // 모든 기존 데이터를 지우고 새로운 데이터로 대체
            characters = importedData;
            alert(`데이터 불러오기 완료!\n모든 기존 데이터를 지우고 ${importedData.length}개의 새로운 캐릭터 데이터로 대체됨`);
        }
        
        saveCharacters();
        updateCharacterList();
        updateCharacterCards();
        document.getElementById('importModal').classList.add('hidden');
        
    } catch (error) {
        alert('데이터 형식이 잘못되었습니다. 올바른 JSON 형식인지 확인하세요.');
        console.error('데이터 불러오기 오류:', error);
    }
}