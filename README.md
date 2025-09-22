# 📚 아이들 숙제 타이머

아이들이 숙제를 재미있게 관리할 수 있는 모바일 웹 애플리케이션입니다!

## 🔗 빠른 접속

- **문시우**: https://reomoon.github.io/homework/#siwoo
- **문서아**: https://reomoon.github.io/homework/#seoa
- **기본 접속**: https://reomoon.github.io/homework/

URL 뒤에 `#사용자명`을 붙여서 바로 해당 사용자로 접속할 수 있습니다!

## ✨ 주요 기능

### 🏠 자유시간 타이머
- 커다란 숫자로 남은 시간 표시
- ⏳ 시작 / ⏸️ 일시정지 / 🔄 리셋 버튼
- 시간 설정 가능 (1-180분)
- 자동으로 localStorage에 저장

### 📝 과제 체크리스트
- 과제 완료 시 체크박스로 표시
- 새로운 과제 추가/삭제 가능
- 체크 상태 자동 저장
- 완료 시 귀여운 알림과 보너스 시간 지급

### 📅 주간 달력
- 월~일 완료 상황 시각화
- 오늘 날짜 하이라이트
- 과제 완료 시 자동으로 ✅ 표시
- 일주일 개근 달성 시 🎉 축하 팝업

### 🏆 성취감 보상 시스템
- 주간/월간 완료율 표시
- 연속 달성일 카운트
- 동기부여 메시지
- 완료 시 추가 자유시간 보너스

### 💾 데이터 저장
- 브라우저 localStorage 사용
- 자동 저장 (30초마다)
- 페이지 새로고침 시에도 데이터 유지
- 주간 데이터 자동 리셋

## 🎨 디자인 특징

- 📱 모바일 우선 반응형 디자인
- 🌈 아이들이 좋아할 밝고 귀여운 색상
- 😊 이모티콘을 활용한 친근한 UI
- 🌙 다크 모드 지원
- ✨ 부드러운 애니메이션 효과

## 🚀 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **스타일링**: CSS Grid, Flexbox, CSS Variables
- **데이터 저장**: localStorage Web API
- **배포**: GitHub Pages
- **CI/CD**: GitHub Actions

## 📋 설치 및 실행

### 로컬 개발 환경

1. 저장소 클론
```bash
git clone https://github.com/your-username/children-homework-app.git
cd children-homework-app
```

2. 로컬 서버 실행 (선택사항)
```bash
# Python이 설치된 경우
python -m http.server 8000

# Node.js가 설치된 경우
npx serve .

# 또는 단순히 index.html을 브라우저에서 열기
```

3. 브라우저에서 `http://localhost:8000` 접속

### GitHub Pages 배포

1. GitHub 저장소 생성
2. 코드 푸시
3. Settings > Pages에서 Source를 "GitHub Actions"로 설정
4. 자동으로 배포됨!

## 📁 프로젝트 구조

```
children-homework-app/
├── index.html          # 메인 HTML 파일
├── styles.css          # CSS 스타일시트
├── script.js           # JavaScript 로직
├── README.md           # 프로젝트 설명
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions 워크플로우
└── .gitignore          # Git 무시 파일
```

## 🔧 주요 기능 구현

### 타이머 시스템
- `setInterval`을 사용한 실시간 타이머
- localStorage를 통한 상태 저장
- 시작/정지/리셋 기능

### 체크리스트 관리
- 동적 DOM 조작으로 과제 추가/삭제
- 체크 상태 추적 및 저장
- 완료율 계산

### 주간 달력
- 날짜 계산 및 주간 진행상황 추적
- 자동 주간 리셋 기능
- 달성률 시각화

### 보상 시스템
- 과제 완료 시 보너스 시간 지급
- 연속 달성일 추적
- 축하 팝업 및 알림

## 🎯 사용법

1. **타이머 설정**: 원하는 자유시간을 분 단위로 입력
2. **과제 등록**: 오늘 할 과제들을 체크리스트에 추가
3. **과제 완료**: 과제를 끝낼 때마다 체크박스 클릭
4. **보너스 획득**: 모든 과제 완료 시 추가 자유시간 획득!
5. **주간 목표**: 일주일 개근 달성 시 특별 보너스!

## 🌟 개선 아이디어

- [ ] PWA(Progressive Web App) 지원
- [ ] 푸시 알림 기능
- [ ] 과제 카테고리 분류
- [ ] 부모 계정 연동
- [ ] 성취 배지 시스템
- [ ] 친구와 경쟁 기능
- [ ] 음성 알림 추가
- [ ] 테마 변경 기능

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새로운 기능 브랜치를 만듭니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 연락처

프로젝트에 대한 질문이나 제안사항이 있으시면 언제든지 연락주세요!

---

아이들이 숙제를 즐겁게 할 수 있도록 도와주는 작은 도구가 되길 바랍니다! 📚✨