# Clasp 연동 가이드 - 완료 ✅

## 📋 개요

이 프로젝트는 clasp(Command Line Apps Script)를 사용하여 로컬 환경에서 Google Apps Script를 개발하고 배포합니다.

---

## ✅ 연동 완료 상태

### 1. 프로젝트 구조

```
import-image-pattern/
├── .clasp.json              # clasp 설정 파일 ✅
├── README.md
├── DEVELOPMENT_STATUS.md
├── CLASP_SETUP_GUIDE.md     # 이 파일
└── src/                     # 소스 코드 디렉토리
    ├── Code.gs              # Google Apps Script 백엔드
    ├── sidebar.html         # Sidebar (스타일 + 스크립트 포함)
    └── appsscript.json      # 매니페스트
```

### 2. 해결된 문제

**문제**: `clasp push` 실행 시 "A file with this name already exists: sidebar" 오류

**원인**:

- `sidebar.html`과 `sidebar.js`가 모두 "sidebar" 이름으로 인식됨
- Google Apps Script는 파일명의 확장자를 제거하고 이름으로만 관리

**해결책**:

1. ✅ `src` 디렉토리 생성 및 소스 파일 이동
2. ✅ `.clasp.json`에 `rootDir: "src"` 설정
3. ✅ `sidebar.html`에 `styles.css`와 `sidebar.js` 내용을 인라인화
4. ✅ 중복 파일(`sidebar.js`, `styles.css`) 삭제

---

## 🚀 사용 방법

### 초기 설정 (첫 번시만)

```bash
# 1. 전역으로 clasp 설치
npm install -g @google/clasp

# 2. Google 계정으로 인증
clasp login

# 3. 프로젝트 디렉토리로 이동
cd C:\Users\jinte\Desktop\projects\import-image-pattern
```

### 일일 개발 워크플로우

```bash
# 1. 로컬 변경사항 배포
clasp push

# 2. 온라인 편집기에서 변경한 사항 로컬로 가져오기
clasp pull

# 3. 파일 변경 감지하여 자동 배포
clasp push --watch
```

---

## 📝 .clasp.json 설정

```json
{
  "scriptId": "1iK6pOTqEJ6Drx-gG5B6DBIXFrtzjpPH2Vem_MCXhagrvjilXuEmvzKiZ",
  "rootDir": "src",
  "scriptExtensions": [".gs"],
  "htmlExtensions": [".html"],
  "jsonExtensions": [".json"],
  "filePushOrder": ["Code", "sidebar"],
  "skipSubdirectories": false
}
```

**주요 설정**:

- `rootDir: "src"` - 소스 디렉토리 지정
- `scriptExtensions: [".gs"]` - `.js` 제외 (GAS는 `.gs`만 지원)
- `filePushOrder` - 파일 배포 순서 (선택사항)

---

## 🔧 주요 Clasp 명령어

| 명령어               | 설명                           |
| -------------------- | ------------------------------ |
| `clasp login`        | Google 계정 인증               |
| `clasp push`         | 로컬 파일 → Google Apps Script |
| `clasp pull`         | Google Apps Script → 로컬 파일 |
| `clasp push --watch` | 파일 변경 감지하여 자동 배포   |
| `clasp deploy`       | 배포 버전 생성                 |
| `clasp versions`     | 버전 목록 조회                 |
| `clasp deployments`  | 배포된 버전 목록               |

---

## ⚠️ 주의사항

### 1. 파일명 충돌 방지

Google Apps Script는 파일명 충돌을 엄격하게 체크합니다:

- ❌ `sidebar.html` + `sidebar.js` (같은 이름 → 오류)
- ✅ `sidebar.html` (모두 포함) + `Code.gs`

### 2. 동기화 순서

온라인 편집기와 로컬을 동시에 수정하지 마세요:

```bash
# ✅ 권장: 항상 pull 후 작업
clasp pull
# (로컬에서 수정)
clasp push

# ❌ 주의: 온라인과 로컬 동시 수정 → 충돌 위험
```

### 3. .clasp.json 보안

`.clasp.json`에는 Script ID가 포함되어 있습니다:

```
# .gitignore
.clasp.json
~/.clasprc.json
node_modules/
```

---

## 📦 파일별 설명

### src/Code.gs

- Google Apps Script 백엔드
- 스프레드시트 메뉴 추가, 셀 처리, Undo 기능

### src/sidebar.html

- Sidebar UI의 모든 마크업
- `<style>` 태그: 모든 CSS 포함
- `<script>` 태그: 모든 JavaScript 로직 포함
- Google Apps Script와의 통신 (`google.script.run`)

### src/appsscript.json

- Google Apps Script 매니페스트
- 타임존, 권한, 런타임 설정

---

## 🔗 유용한 링크

- [Clasp GitHub](https://github.com/google/clasp)
- [Google Apps Script 공식 문서](https://developers.google.com/apps-script)
- [Sheets API](https://developers.google.com/sheets/api)

---

## 📊 배포 상태

✅ **현재 상태**: Clasp 연동 완료, push/pull 정상 작동

**마지막 배포**: 2025-11-03
**배포된 파일**:

- Code.gs (3.4 KB)
- sidebar.html (33.5 KB)
- appsscript.json (0.1 KB)

---

## 🎯 다음 단계

1. **Phase 2 개발**: 이미지 업로드 및 배치 로직 구현
2. **테스트**: Google Sheet에서 실제 동작 확인
3. **배포**: `clasp deploy`로 릴리스 버전 생성
