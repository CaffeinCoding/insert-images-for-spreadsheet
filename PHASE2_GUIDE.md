# Phase 2: 이미지 관리 및 기본 배치 로직

**목표**: 이미지 입력, 관리, 기본 배치 로직 구현  
**예상 기간**: 1주  
**상태**: 🚀 구현 중

---

## 📋 개요

Phase 2는 세 가지 핵심 작업으로 구성됩니다:

1. **2.1 이미지 업로드 및 리스트 관리** ✅
2. **2.2 셀 선택 및 패턴 기본 설정** ✅
3. **2.3 격자형 배치 로직** ✅

---

## 2.1 이미지 업로드 및 리스트 관리 ✅

### 구현 내용

#### 이미지 메타데이터 추출 (Phase 2 핵심)

```javascript
// 이전: 파일 정보만 저장
const image = {
  id: string,
  name: string,
  data: ArrayBuffer,
  file: File,
  size: number,
};

// Phase 2: 메타데이터 추가
const image = {
  id: string,
  name: string,
  data: ArrayBuffer,
  file: File,
  size: number,
  // ✨ Phase 2 추가
  width: number, // 원본 너비 (픽셀)
  height: number, // 원본 높이 (픽셀)
  ratio: number, // 가로세로 비율 (width/height)
};
```

#### 개선된 이미지 업로드 프로세스

```javascript
function handleFileSelect(e) {
  const files = Array.from(e.target.files);

  files.forEach((file) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      // ✨ Phase 2: Image 객체로 메타데이터 추출
      const img = new Image();
      img.onload = function () {
        const image = {
          id: `img_${Date.now()}`,
          name: file.name,
          width: img.width, // 추출됨!
          height: img.height, // 추출됨!
          ratio: img.width / img.height, // 계산됨!
          data: event.target.result,
          file: file,
          size: file.size,
        };

        appState.images.push(image);
        updateImageList();
      };
      img.src = URL.createObjectURL(file);
    };
    reader.readAsArrayBuffer(file);
  });
}
```

### 주요 함수

| 함수                  | 설명                      | 추가됨          |
| --------------------- | ------------------------- | --------------- |
| `handleFileSelect(e)` | 파일 선택 처리            | 메타데이터 추출 |
| `updateImageList()`   | 이미지 리스트 UI 업데이트 | -               |
| `removeImage(id)`     | 이미지 삭제               | -               |

### 개선 사항

- ✅ 이미지 메타데이터 자동 추출
- ✅ 이미지 로드 성공/실패 처리
- ✅ 에러 핸들링 (이미지 로드 실패)
- ✅ 콘솔 로그 (디버깅)

---

## 2.2 셀 선택 및 패턴 기본 설정 ✅

### 구현 내용

#### 선택된 셀 정보 확장

Phase 2에서는 선택된 셀의 **크기 정보**도 함께 조회합니다:

```javascript
// 이전: 위치만 저장
selectedCell: {
  row: number,
  col: number,
  address: string  // "A1"
}

// Phase 2: 크기 정보 추가
selectedCell: {
  row: number,
  col: number,
  address: string,
  // ✨ Phase 2 추가
  width: number,   // 픽셀 단위 너비
  height: number   // 픽셀 단위 높이
}
```

#### Google Apps Script 새 함수

```javascript
// Code.gs
function getSelectedCellDimensions() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const range = sheet.getActiveRange();

  const defaultRowHeight = 21; // 기본 행 높이 (픽셀)
  const defaultColWidth = 88; // 기본 열 너비 (픽셀)

  const rowHeight = range.getRowHeight() || defaultRowHeight;
  const colWidth = range.getColumnWidth() || defaultColWidth;

  return {
    success: true,
    width: colWidth,
    height: rowHeight,
  };
}
```

#### 선택 셀 업데이트 개선

```javascript
function updateSelectedCell() {
  google.script.run
    .withSuccessHandler(function (result) {
      appState.selectedCell = {
        row: result.row,
        col: result.col,
        address: result.address,
      };

      // ✨ Phase 2: 선택 셀의 크기 정보 조회
      google.script.run
        .withSuccessHandler(function (dimResult) {
          appState.selectedCell.width = dimResult.width;
          appState.selectedCell.height = dimResult.height;
        })
        .getSelectedCellDimensions();
    })
    .getSelectedCellInfo();
}
```

### 주요 함수

| 함수 (Frontend)           | 설명                         |
| ------------------------- | ---------------------------- |
| `updateSelectedCell()`    | 선택 셀 정보 + 크기 업데이트 |
| `debounceSettingChange()` | 설정값 변경 감지 (debounce)  |
| `handleSettingChange()`   | 설정값 적용                  |

| 함수 (Backend)                | 설명                          |
| ----------------------------- | ----------------------------- |
| `getSelectedCellInfo()`       | 선택 셀의 위치/주소 조회      |
| `getSelectedCellDimensions()` | 선택 셀의 크기 조회 (Phase 2) |

---

## 2.3 격자형 배치 로직 ✅

### 구현 내용

#### 배치 검증 시스템 (Phase 2 핵심)

새로운 검증 함수를 추가하여 배치 가능 여부를 사전에 확인:

```javascript
function validateLayoutAndImages() {
  // 1. 셀 선택 확인
  if (!appState.selectedCell) {
    return { valid: false, error: "셀을 먼저 선택해주세요." };
  }

  // 2. 이미지 확인
  if (appState.images.length === 0) {
    return { valid: false, error: "이미지를 먼저 선택해주세요." };
  }

  // 3. 배치 설정 검증
  const layoutSettings = {
    startRow: appState.selectedCell.row,
    startCol: appState.selectedCell.col,
    rows: appState.patternSettings.rows,
    cols: appState.patternSettings.cols,
    rowGap: appState.patternSettings.rowGap,
    colGap: appState.patternSettings.colGap,
    inactiveCells: appState.inactiveCells,
  };

  // Google Apps Script에서 검증
  let validationResult = { valid: true };
  google.script.run
    .withSuccessHandler((result) => (validationResult = result))
    .validateLayoutSettings(layoutSettings);

  // 4. 배치 위치 계산
  const positions = calculateLayoutPositions();
  const availableCells = positions.length;

  if (validationResult.valid && availableCells > 0) {
    return {
      valid: true,
      positions: positions,
      message: `${appState.images.length}개 이미지를 ${availableCells}개 셀에 배치 예정`,
    };
  }

  return {
    valid: false,
    error:
      validationResult.errors?.join(", ") || "배치 설정이 유효하지 않습니다.",
  };
}
```

#### Google Apps Script 검증 함수

```javascript
// Code.gs
function validateLayoutSettings(settings) {
  const errors = [];

  // 범위 검증
  if (!settings.rows || settings.rows < 1 || settings.rows > 50) {
    errors.push("행 개수는 1~50 사이여야 합니다.");
  }
  if (!settings.cols || settings.cols < 1 || settings.cols > 50) {
    errors.push("열 개수는 1~50 사이여야 합니다.");
  }
  if (settings.rowGap < 0 || settings.rowGap > 20) {
    errors.push("행 간격은 0~20 사이여야 합니다.");
  }
  if (settings.colGap < 0 || settings.colGap > 20) {
    errors.push("열 간격은 0~20 사이여야 합니다.");
  }

  // 사용 가능한 셀 확인
  const availableCells = calculateAvailablePositions(settings);
  if (availableCells === 0) {
    errors.push("사용 가능한 셀이 없습니다.");
  }

  return {
    valid: errors.length === 0,
    errors: errors,
  };
}

function calculateAvailablePositions(settings) {
  const { rows, cols, inactiveCells = [] } = settings;
  let count = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isInactive = inactiveCells[r] && inactiveCells[r][c];
      if (!isInactive) count++;
    }
  }

  return count;
}
```

#### 배치 위치 계산

```javascript
function calculateLayoutPositions() {
  const { rows, cols, rowGap, colGap } = appState.patternSettings;
  const { row: startRow, col: startCol } = appState.selectedCell;

  const positions = [];
  let imageIndex = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // 간격을 포함한 실제 셀 좌표 계산
      const actualRow = startRow + r * (1 + rowGap);
      const actualCol = startCol + c * (1 + colGap);

      // 비활성 셀 확인
      const isInactive =
        appState.inactiveCells[r] && appState.inactiveCells[r][c];

      // 비활성이 아니고 이미지가 남아 있으면 추가
      if (!isInactive && imageIndex < appState.images.length) {
        positions.push({
          imageIndex,
          row: actualRow,
          col: actualCol,
        });
        imageIndex++;
      }
    }
  }

  return positions;
}
```

#### 배치 정보 로깅

```javascript
function logImagePlacementInfo() {
  const positions = calculateLayoutPositions();

  if (positions.length === 0) {
    console.warn("사용 가능한 배치 위치가 없습니다.");
    return;
  }

  console.group("📍 이미지 배치 정보");
  console.log(
    `패턴: ${appState.patternSettings.rows}행 x ${appState.patternSettings.cols}열`
  );
  console.log(
    `간격: 행 ${appState.patternSettings.rowGap}, 열 ${appState.patternSettings.colGap}`
  );
  console.log(`이미지 개수: ${appState.images.length}`);
  console.log(`배치 가능 셀: ${positions.length}`);
  console.log("배치 위치:", positions);
  console.groupEnd();
}
```

### 주요 함수

| 함수 (Frontend)              | 설명                     |
| ---------------------------- | ------------------------ |
| `calculateLayoutPositions()` | 배치 위치 계산           |
| `validateLayoutAndImages()`  | 배치 검증 (Phase 2)      |
| `logImagePlacementInfo()`    | 배치 정보 로깅 (Phase 2) |

| 함수 (Backend)                          | 설명                               |
| --------------------------------------- | ---------------------------------- |
| `calculateLayoutPositions(settings)`    | 배치 좌표 계산                     |
| `validateLayoutSettings(settings)`      | 배치 설정 검증 (Phase 2)           |
| `calculateAvailablePositions(settings)` | 사용 가능한 셀 개수 계산 (Phase 2) |

---

## 📊 배치 예시

### 예시 1: 기본 배치 (간격 없음)

```
선택 셀: B1
패턴: 2x2 (행 2, 열 2)
간격: 0

배치 결과:
| A1 | B1 | C1 |
|----|----|-----|
|    |[1]|    |
|----|[2]|-----|
|    |[3]|    |
|----|[4]|-----|
```

### 예시 2: 간격 포함

```
선택 셀: B1
패턴: 2x2
간격: 행 1, 열 1

배치 결과:
| A1 | B1 | C1 | D1 | E1 |
|----|----|----|----|----|
|    |[1]|    |[2]|    |
|----|----|----|----|----|
|    |    |    |    |    |
|----|----|----|----|----|
|    |[3]|    |[4]|    |
|----|----|----|----|----|
```

### 예시 3: 비활성 셀 포함

```
선택 셀: B1
패턴: 2x2
비활성 셀: (1, 2) 표시

배치 결과 (3개 이미지):
| A1 | B1 | C1 |
|----|----|----|
|    |[1]|    |
|----|  X |----|  ← 비활성 (X)
|    |[2]|    |
|----|[3]|----|
```

---

## 🔍 테스트 케이스

### TC-2.1: 이미지 업로드

```
✅ 단일 이미지 업로드
✅ 다중 이미지 업로드
✅ 메타데이터 추출
✅ 이미지 삭제
✅ 잘못된 파일 타입 거부
```

### TC-2.2: 셀 선택

```
✅ 셀 선택 감지
✅ 선택 셀 주소 표시
✅ 선택 셀 크기 조회
✅ 범위 선택 (첫 셀만)
```

### TC-2.3: 배치 로직

```
✅ 기본 배치 (간격 0)
✅ 간격 포함 배치
✅ 비활성 셀 제외
✅ 이미지 초과 처리 (무시)
✅ 이미지 부족 처리 (빈 셀)
✅ 배치 불가능 감지
```

---

## 🐛 디버깅 팁

### 콘솔 로그 확인

```javascript
// 이미지 로드 로그
이미지 로드: photo.jpg (1920x1080)

// 배치 분석 로그
배치 분석: 사용 가능한 셀 4개, 이미지 3개

// 배치 정보 로그
📍 이미지 배치 정보
패턴: 2행 x 2열
간격: 행 0, 열 0
이미지 개수: 3
배치 가능 셀: 4
배치 위치: [{imageIndex: 0, row: 1, col: 2}, ...]
```

### Google Chrome DevTools 사용

```
1. Ctrl+Shift+J 또는 Cmd+Option+J로 DevTools 열기
2. Console 탭에서 로그 확인
3. `appState` 변수 확인: console에서 appState 입력
4. 배치 계산 직접 테스트: calculateLayoutPositions() 실행
```

---

## ✅ Phase 2 체크리스트

### 2.1 이미지 관리

- [x] 파일 선택 다이얼로그
- [x] 이미지 유효성 검증
- [x] 메타데이터 추출 (width, height, ratio)
- [x] 이미지 리스트 렌더링
- [x] 이미지 삭제 기능
- [x] 에러 처리

### 2.2 셀 선택 및 설정

- [x] 선택 셀 감지
- [x] 셀 주소 표시
- [x] 셀 크기 조회 (새로 추가!)
- [x] 행/열 개수 입력
- [x] 간격 설정
- [x] 범위 검증

### 2.3 배치 로직

- [x] 배치 좌표 계산
- [x] 간격 적용
- [x] 비활성 셀 제외
- [x] 배치 검증 함수 (새로 추가!)
- [x] 배치 정보 로깅 (새로 추가!)
- [x] 에러 처리

---

## 🎯 다음 단계 (Phase 3)

Phase 3에서는 **프리뷰 시스템**을 구현합니다:

- 실시간 배치 프리뷰
- 색상 우선순위 관리
- 선택 셀 프리뷰
- 배경색 저장 및 복구

---

**상태**: ✅ Phase 2 구현 완료  
**다음**: Phase 3 프리뷰 시스템 시작
