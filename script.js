// 전역 변수
let currentUser = 'siou'; // 기본 사용자

let timer = {
    minutes: 30,
    seconds: 0,
    isRunning: false,
    interval: null,
    totalSeconds: 30 * 60
};

let homeworkData = {
    items: [
        { id: 'math', text: '📐 수학 3장', completed: false },
        { id: 'korean', text: '📖 국어 2장', completed: false },
        { id: 'english', text: '🔤 영어 1장', completed: false },
        { id: 'science', text: '🔬 과학 실험보고서', completed: false }
    ]
};

let weeklyProgress = {
    days: [false, false, false, false, false, false, false],
    currentWeek: getWeekNumber(new Date()),
    streakDays: 0
};

// 유틸리티 함수
function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return {
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
    };
}

function getTodayDay() {
    return new Date().getDay();
}

function formatDate() {
    const today = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    return today.toLocaleDateString('ko-KR', options);
}

// 로컬 스토리지 관리
function saveToLocalStorage() {
    const storageKey = `homeworkTimer_${currentUser}`;
    localStorage.setItem(storageKey, JSON.stringify({
        timer: {
            totalSeconds: timer.totalSeconds,
            isRunning: timer.isRunning
        },
        homework: homeworkData,
        weekly: weeklyProgress,
        lastSaved: new Date().toISOString()
    }));
    
    // 현재 사용자 저장
    localStorage.setItem('currentUser', currentUser);
}

function loadFromLocalStorage() {
    const storageKey = `homeworkTimer_${currentUser}`;
    const saved = localStorage.getItem(storageKey);
    
    if (saved) {
        try {
            const data = JSON.parse(saved);
            
            // 타이머 데이터 복원
            if (data.timer) {
                timer.totalSeconds = data.timer.totalSeconds || 30 * 60;
                timer.isRunning = false; // 페이지 로드 시 항상 정지 상태로 시작
                updateTimerDisplay();
            }
            
            // 숙제 데이터 복원
            if (data.homework) {
                homeworkData = data.homework;
                updateHomeworkDisplay();
            }
            
            // 주간 진행 상황 복원
            if (data.weekly) {
                const currentWeek = getWeekNumber(new Date());
                if (data.weekly.currentWeek === currentWeek) {
                    weeklyProgress = data.weekly;
                } else {
                    // 새로운 주가 시작되면 리셋
                    weeklyProgress = {
                        days: [false, false, false, false, false, false, false],
                        currentWeek: currentWeek,
                        streakDays: data.weekly.streakDays || 0
                    };
                }
                updateWeeklyCalendar();
                updateAchievementStats();
            }
        } catch (error) {
            console.error('로컬 스토리지 데이터 로드 실패:', error);
            resetToDefaults();
        }
    } else {
        resetToDefaults();
    }
    
    // 현재 탭 복원
    const currentTab = localStorage.getItem('currentTab') || 'timer-homework';
    switchTab(currentTab);
}

function resetToDefaults() {
    timer.totalSeconds = 30 * 60;
    timer.isRunning = false;
    homeworkData = {
        items: [
            { id: 'math', text: '📐 수학 3장', completed: false },
            { id: 'korean', text: '📖 국어 2장', completed: false },
            { id: 'english', text: '🔤 영어 1장', completed: false },
            { id: 'science', text: '🔬 과학 실험보고서', completed: false }
        ]
    };
    weeklyProgress = {
        days: [false, false, false, false, false, false, false],
        currentWeek: getWeekNumber(new Date()),
        streakDays: 0
    };
    
    updateTimerDisplay();
    updateHomeworkDisplay();
    updateWeeklyCalendar();
    updateAchievementStats();
}

// 타이머 관련 함수
function updateTimerDisplay() {
    const time = formatTime(timer.totalSeconds);
    document.getElementById('timer-minutes').textContent = time.minutes;
    document.getElementById('timer-seconds').textContent = time.seconds;
}

function startTimer() {
    if (!timer.isRunning && timer.totalSeconds > 0) {
        timer.isRunning = true;
        timer.interval = setInterval(() => {
            timer.totalSeconds--;
            updateTimerDisplay();
            
            if (timer.totalSeconds <= 0) {
                stopTimer();
                showNotification('⏰', '자유시간이 끝났어요!', '이제 숙제를 확인해보세요 📚');
            }
            
            saveToLocalStorage();
        }, 1000);
        
        updateTimerButtons();
        saveToLocalStorage();
    }
}

function pauseTimer() {
    if (timer.isRunning) {
        timer.isRunning = false;
        clearInterval(timer.interval);
        updateTimerButtons();
        saveToLocalStorage();
    }
}

function resetTimer() {
    timer.isRunning = false;
    clearInterval(timer.interval);
    const inputMinutes = parseInt(document.getElementById('timer-input').value) || 30;
    timer.totalSeconds = inputMinutes * 60;
    updateTimerDisplay();
    updateTimerButtons();
    saveToLocalStorage();
}

function setTimer() {
    const inputMinutes = parseInt(document.getElementById('timer-input').value);
    if (inputMinutes && inputMinutes > 0 && inputMinutes <= 180) {
        pauseTimer();
        timer.totalSeconds = inputMinutes * 60;
        updateTimerDisplay();
        saveToLocalStorage();
        showNotification('⏰', '타이머 설정 완료!', `${inputMinutes}분으로 설정되었습니다.`);
    } else {
        alert('1분에서 180분 사이의 값을 입력해주세요.');
    }
}

function updateTimerButtons() {
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    
    if (timer.isRunning) {
        startBtn.style.opacity = '0.5';
        startBtn.disabled = true;
        pauseBtn.style.opacity = '1';
        pauseBtn.disabled = false;
    } else {
        startBtn.style.opacity = '1';
        startBtn.disabled = false;
        pauseBtn.style.opacity = '0.5';
        pauseBtn.disabled = true;
    }
}

function stopTimer() {
    timer.isRunning = false;
    clearInterval(timer.interval);
    timer.totalSeconds = 0;
    updateTimerDisplay();
    updateTimerButtons();
}

// 숙제 관련 함수
function updateHomeworkDisplay() {
    const homeworkList = document.querySelector('.homework-list');
    homeworkList.innerHTML = '';
    
    homeworkData.items.forEach(item => {
        const homeworkDiv = document.createElement('div');
        homeworkDiv.className = `homework-item ${item.completed ? 'completed' : ''}`;
        
        homeworkDiv.innerHTML = `
            <input type="checkbox" id="${item.id}" class="homework-checkbox" ${item.completed ? 'checked' : ''}>
            <label for="${item.id}">${item.text}</label>
            <button class="btn btn-small btn-delete" onclick="deleteHomework('${item.id}')">🗑️</button>
        `;
        
        homeworkList.appendChild(homeworkDiv);
        
        // 체크박스 이벤트 리스너 추가
        const checkbox = homeworkDiv.querySelector(`#${item.id}`);
        checkbox.addEventListener('change', (e) => {
            toggleHomework(item.id, e.target.checked);
        });
    });
}

function toggleHomework(id, completed) {
    const item = homeworkData.items.find(item => item.id === id);
    if (item) {
        item.completed = completed;
        updateHomeworkDisplay();
        checkDailyCompletion();
        saveToLocalStorage();
        
        if (completed) {
            showNotification('✅', '과제 완료!', '훌륭해요! 계속 화이팅! 💪');
        }
    }
}

function deleteHomework(id) {
    if (confirm('이 과제를 삭제하시겠습니까?')) {
        homeworkData.items = homeworkData.items.filter(item => item.id !== id);
        updateHomeworkDisplay();
        saveToLocalStorage();
    }
}

function addHomework() {
    const text = prompt('새로운 과제를 입력하세요:');
    if (text && text.trim()) {
        const newId = 'homework_' + Date.now();
        homeworkData.items.push({
            id: newId,
            text: text.trim(),
            completed: false
        });
        updateHomeworkDisplay();
        saveToLocalStorage();
        showNotification('➕', '과제 추가!', '새로운 과제가 추가되었습니다.');
    }
}

function checkDailyCompletion() {
    const completedCount = homeworkData.items.filter(item => item.completed).length;
    const totalCount = homeworkData.items.length;
    
    if (completedCount === totalCount && totalCount > 0) {
        const today = getTodayDay();
        if (!weeklyProgress.days[today]) {
            weeklyProgress.days[today] = true;
            weeklyProgress.streakDays++;
            updateWeeklyCalendar();
            updateAchievementStats();
            saveToLocalStorage();
            
            // 보너스 시간 추가
            timer.totalSeconds += 10 * 60; // 10분 추가
            updateTimerDisplay();
            
            showCelebration('🎉 오늘 과제 완료! 🎉', '추가 자유시간 +10분!');
            
            // 일주일 완성 체크
            checkWeeklyCompletion();
        }
    }
}

function checkWeeklyCompletion() {
    const completedDays = weeklyProgress.days.filter(day => day).length;
    if (completedDays === 7) {
        showCelebration('🏆 일주일 개근 달성! 🏆', '정말 대단해요! 추가 자유시간 +30분!');
        timer.totalSeconds += 30 * 60; // 30분 추가
        updateTimerDisplay();
        saveToLocalStorage();
    }
}

// 주간 달력 관련 함수
function updateWeeklyCalendar() {
    const today = getTodayDay();
    
    for (let i = 0; i < 7; i++) {
        const dayElement = document.getElementById(`day-${i}`);
        const calendarDay = document.querySelector(`[data-day="${i}"]`);
        
        // 오늘 표시
        if (i === today) {
            calendarDay.classList.add('today');
        } else {
            calendarDay.classList.remove('today');
        }
        
        // 완료 상태 표시
        if (weeklyProgress.days[i]) {
            dayElement.textContent = '✅';
            calendarDay.classList.add('completed');
        } else {
            dayElement.textContent = '⭕';
            calendarDay.classList.remove('completed');
        }
    }
}

// 성취 관련 함수
function updateAchievementStats() {
    // 주간 완료율
    const weeklyCompleted = weeklyProgress.days.filter(day => day).length;
    const weeklyPercentage = Math.round((weeklyCompleted / 7) * 100);
    document.getElementById('weekly-completion').textContent = `${weeklyPercentage}%`;
    
    // 월간 완료율 (임시로 주간 완료율 사용)
    document.getElementById('monthly-completion').textContent = `${weeklyPercentage}%`;
    
    // 연속 달성일
    document.getElementById('streak-days').textContent = `${weeklyProgress.streakDays}일`;
    
    // 성취 메시지 업데이트
    updateAchievementMessage(weeklyPercentage);
}

function updateAchievementMessage(percentage) {
    const messageElement = document.getElementById('achievement-message');
    let message = '🌟 오늘도 화이팅! 🌟';
    
    if (percentage === 100) {
        message = '🏆 완벽한 한 주! 정말 대단해요! 🏆';
    } else if (percentage >= 80) {
        message = '🎖️ 거의 다 왔어요! 조금만 더! 🎖️';
    } else if (percentage >= 60) {
        message = '💪 절반 이상 달성! 화이팅! 💪';
    } else if (percentage >= 40) {
        message = '🌱 좋은 시작이에요! 계속해요! 🌱';
    } else if (percentage > 0) {
        message = '✨ 첫 걸음을 내딛었네요! ✨';
    }
    
    messageElement.textContent = message;
}

// 사용자 관련 함수
function switchUser(userId) {
    // 현재 데이터 저장
    saveToLocalStorage();
    
    // 사용자 변경
    currentUser = userId;
    
    // 모든 사용자 버튼에서 active 클래스 제거
    document.querySelectorAll('.user-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 선택된 사용자 버튼에 active 클래스 추가
    document.querySelector(`[data-user="${userId}"]`).classList.add('active');
    
    // 새 사용자 데이터 로드
    loadFromLocalStorage();
    
    // 화면 업데이트
    updateAllDisplays();
    
    // 알림 표시
    const userName = userId === 'siou' ? '문시우' : '문서아';
    showNotification('👋', '사용자 변경!', `${userName}님의 데이터를 불러왔습니다.`);
}

function updateAllDisplays() {
    updateTimerDisplay();
    updateTimerButtons();
    updateHomeworkDisplay();
    updateWeeklyCalendar();
    updateAchievementStats();
}

// 탭 관련 함수
function switchTab(tabId) {
    // 모든 탭 버튼에서 active 클래스 제거
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 모든 탭 컨텐츠에서 active 클래스 제거
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 선택된 탭 버튼에 active 클래스 추가
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    
    // 선택된 탭 컨텐츠에 active 클래스 추가
    document.getElementById(tabId).classList.add('active');
    
    // 로컬 스토리지에 현재 탭 저장
    localStorage.setItem('currentTab', tabId);
}

// 알림 및 팝업 함수
function showNotification(icon, title, message) {
    // 간단한 알림 (실제 앱에서는 더 예쁜 토스트 알림 구현 가능)
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #00b894, #00a085);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        z-index: 1001;
        max-width: 300px;
        font-size: 0.9em;
    `;
    notification.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 5px;">${icon} ${title}</div>
        <div>${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

function showCelebration(title, message) {
    const popup = document.getElementById('celebration-popup');
    const messageElement = document.getElementById('celebration-message');
    
    messageElement.innerHTML = `
        <p style="font-size: 1.2em; margin-bottom: 10px;">${title}</p>
        <p>${message}</p>
    `;
    
    popup.classList.remove('hidden');
    
    // 애니메이션 효과
    const content = popup.querySelector('.popup-content');
    content.classList.add('bounce');
    
    setTimeout(() => {
        content.classList.remove('bounce');
    }, 1000);
}

function closeCelebrationPopup() {
    document.getElementById('celebration-popup').classList.add('hidden');
}

// 초기화 함수
function initializeApp() {
    // 현재 날짜 표시
    document.getElementById('current-date').textContent = formatDate();
    
    // 저장된 사용자 불러오기
    const savedUser = localStorage.getItem('currentUser') || 'siou';
    currentUser = savedUser;
    
    // 사용자 버튼 활성화
    document.querySelectorAll('.user-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-user="${currentUser}"]`).classList.add('active');
    
    // 로컬 스토리지에서 데이터 로드
    loadFromLocalStorage();
    
    // 초기 디스플레이 업데이트
    updateAllDisplays();
    
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 자동 저장 (30초마다)
    setInterval(saveToLocalStorage, 30000);
}

function setupEventListeners() {
    // 사용자 버튼들
    document.querySelectorAll('.user-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const userId = btn.getAttribute('data-user');
            switchUser(userId);
        });
    });
    
    // 탭 버튼들
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // 타이머 버튼들
    document.getElementById('start-btn').addEventListener('click', startTimer);
    document.getElementById('pause-btn').addEventListener('click', pauseTimer);
    document.getElementById('reset-btn').addEventListener('click', resetTimer);
    document.getElementById('set-timer-btn').addEventListener('click', setTimer);
    
    // 타이머 입력 엔터키
    document.getElementById('timer-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            setTimer();
        }
    });
    
    // 과제 추가 버튼
    document.getElementById('add-homework-btn').addEventListener('click', addHomework);
    
    // 팝업 닫기 버튼
    document.getElementById('close-popup-btn').addEventListener('click', closeCelebrationPopup);
    
    // 팝업 배경 클릭으로 닫기
    document.getElementById('celebration-popup').addEventListener('click', (e) => {
        if (e.target.id === 'celebration-popup') {
            closeCelebrationPopup();
        }
    });
    
    // 페이지 언로드 시 데이터 저장
    window.addEventListener('beforeunload', saveToLocalStorage);
    
    // 페이지 포커스 시 데이터 새로고침
    window.addEventListener('focus', () => {
        loadFromLocalStorage();
        document.getElementById('current-date').textContent = formatDate();
    });
}

// 추가 CSS 클래스 동적 적용
document.addEventListener('DOMContentLoaded', () => {
    // 삭제 버튼 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        .btn-delete {
            background: linear-gradient(135deg, #ff6b6b, #ee5a52) !important;
            padding: 5px 10px !important;
            font-size: 0.8em !important;
            margin-left: auto !important;
            min-width: auto !important;
        }
        
        .homework-item {
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
        }
        
        .homework-item label {
            flex: 1 !important;
        }
    `;
    document.head.appendChild(style);
});

// 앱 시작
document.addEventListener('DOMContentLoaded', initializeApp);