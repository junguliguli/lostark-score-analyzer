// 분석 관련 함수들

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
    
    // 분석 결과로 스크롤 이동
    // 약간의 지연을 두어 DOM이 업데이트된 후 스크롤되도록 함
    setTimeout(() => {
        document.getElementById('analysisContent').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }, 100);
}