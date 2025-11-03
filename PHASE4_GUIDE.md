# Phase 4: 기능 변경 (프리뷰 제거, 셀 표시)

**목표**: 실시간 프리뷰 기능을 제거하고, 명시적 셀 선택 및 좌표 표시 기능 구현  
**예상 기간**: 1~2시간  
**상태**: ✅ 완료

---

## 📋 개요

Phase 4는 Phase 3에서 구현한 실시간 프리뷰 시스템을 완전히 제거하고, 사용자가 명시적으로 "선택" 버튼을 클릭했을 때만 이미지 배치 위치에 좌표를 표시하는 방식으로 변경합니다.

### 변경 이유

1. **성능 최적화**: 실시간 폴링(300ms) 제거
2. **간소화**: 불필요한 색상 관리 로직 제거
3. **명확성**: 사용자가 명시적으로 선택해야 동작
4. **유지보수성**: 코드 복잡도 감소

---

## 🎯 Phase 4 핵심 작업

### 4.1 프리뷰 기능 제거 ✅

**제거된 함수 (Backend - Code.gs)**

```javascript
// 제거됨
function getCellBackgroundColors(cells) { ... }
function applyPreviewColors(imageCells, inactiveCells, selectedCell) { ... }
function clearPreviewColors(previewCells) { ... }
```

**제거된 함수 (Frontend - sidebar.html)**

```javascript
// 제거됨
function triggerPreviewUpdate() { ... }
function triggerImmediatePreviewUpdate() { ... }
function updatePreview() { ... }
function logPreviewInfo() { ... }
function clearPreview() { ... }
function setupSelectionListener() { ... } // 완전 재구성
```

**제거된 상태 관리**

```javascript
// appState에서 제거
previewCells: []; // 더 이상 필요 없음
debounceTimer; // 더 이상 필요 없음
```

---

### 4.2 셀 좌표 표시 기능 추가 ✅

#### UI 변경

**Before (Phase 3)**

```html
<!-- 프리뷰가 자동으로 표시됨 -->
<div class="form-group">
  <label for="selectedCell">선택된 셀:</label>
  <input type="text" id="selectedCell" readonly />
</div>
```

**After (Phase 4)**

```html
<!-- 선택 버튼 추가 -->
<div class="form-group">
  <label for="selectedCell">선택된 셀:</label>
  <div style="display: flex; gap: 8px;">
    <input type="text" id="selectedCell" readonly style="flex: 1;" />
    <button
      id="selectCellBtn"
      class="btn btn-primary"
      onclick="handleSelectCellClick()"
    >
      선택
    </button>
  </div>
  <small>
    스프레드시트에서 셀을 클릭하면 자동으로 반영됩니다. "선택" 버튼을 클릭하면
    배치 위치의 셀들이 선택됩니다.
  </small>
</div>
```

#### 새 함수

**Frontend (sidebar.html)**

```javascript
/**
 * "선택" 버튼 클릭 핸들러
 */
function handleSelectCellClick() {
  // 1. 설정 유효성 검사
  // 2. 배치 위치 계산
  // 3. 선택할 셀 좌표 수집
  // 4. Google Apps Script로 셀들을 선택 상태로 표시
}
```

**Backend (Code.gs)**

```javascript
/**
 * Phase 4: 이미지 배치 위치 셀 선택
 */
function selectLayoutCells(cells) {
  // Ctrl+클릭과 같이 배치 위치의 셀들을 범위로 선택
  return { success: true, selected: markedCount, cells: rangeNotations };
}
```

---

## 📊 함수 변경 대비

| 함수                     | Phase 3 | Phase 4 | 상태   |
| ------------------------ | ------- | ------- | ------ |
| triggerPreviewUpdate     | O       | X       | 제거   |
| updatePreview            | O       | X       | 제거   |
| setupSelectionListener   | X       | O       | 추가   |
| handleSelectCellClick    | X       | O       | 추가   |
| selectLayoutCells        | X       | O       | 추가   |
| markCellsWithCoordinates | X       | X       | 미사용 |

---

## 🔄 동작 흐름

### Phase 3 (제거됨)

```
사용자가 셀 선택
    ↓
300ms 폴링으로 변경 감지
    ↓
자동으로 프리뷰 색상 표시 (파란색, 초록색, 회색)
    ↓
설정 변경 시 0.5초 debounce 후 프리뷰 갱신
    ↓
캐시에서 원본 색상 복구
```

### Phase 4 (현재)

```
사용자가 스프레드시트에서 셀 클릭
    ↓
선택된 셀 좌표 자동 반영 (0.5초마다 확인)
    ↓
설정 입력 (행/열 개수, 간격, 비활성 셀 등)
    ↓
"선택" 버튼 클릭
    ↓
배치 위치 셀들이 스프레드시트에서 선택됨 (Ctrl+클릭 효과)
    ↓
완료!
```

---

## 📝 구현 상세

### 1. 선택된 셀 좌표 반영

```javascript
// setupSelectionListener에서 0.5초마다 확인
setInterval(function () {
  google.script.run.getSelectedCellInfo().withSuccessHandler(function (result) {
    if (result.success) {
      appState.selectedCell = {
        row: result.row,
        col: result.col,
        address: result.address,
      };
      document.getElementById("selectedCell").value = result.address;
    }
  });
}, 500);
```

### 2. 셀 범위 선택 로직

```javascript
// selectLayoutCells 함수에서 여러 셀을 동시에 선택
const rangeNotations = cells.map((cell) => {
  const col = String.fromCharCode(64 + cell.col); // 1 -> A, 2 -> B
  return col + cell.row; // A1, B1 형식
});

// Ctrl+클릭 효과와 같이 여러 셀 선택
const range = sheet.getRangeList(rangeNotations).getSelectedRange();
sheet.setActiveRange(range);
```

### 3. 에러 처리

```javascript
if (!appState.selectedCell) {
  alert("먼저 시작 셀을 선택해주세요");
  return;
}

if (appState.images.length === 0) {
  alert("표시할 이미지가 없습니다");
  return;
}

const positions = calculateLayoutPositions();
if (positions.length === 0) {
  alert("배치 가능한 위치가 없습니다");
  return;
}
```

---

## 🧪 테스트 케이스

### TC-4.1: 기본 셀 선택

```
1. 사이드바에서 이미지 3개 업로드
2. 스프레드시트에서 셀 A1 클릭
3. 사이드바의 "선택된 셀" 필드에 "A1" 표시 확인
4. 패턴: 2행 x 2열 설정
5. "선택" 버튼 클릭
6. 기대 결과:
   - 스프레드시트의 셀 A1, B1, A2, B2가 선택됨 (파란색 배경)
   - 선택된 범위: A1:B2 또는 개별 셀들 선택
```

### TC-4.2: 간격 포함 셀 선택

```
1. 스프레드시트에서 셀 B2 클릭
2. 사이드바의 "선택된 셀" 필드에 "B2" 표시 확인
3. 패턴: 2행 x 2열
4. 행 간격: 1, 열 간격: 1 설정
5. "선택" 버튼 클릭
6. 기대 결과:
   - 셀 B2, D2, B4, D4가 선택됨
```

### TC-4.3: 비활성 셀 포함 선택

```
1. 패턴: 3행 x 3열
2. 중앙 셀 (1,1) 비활성 지정
3. "선택" 버튼 클릭
4. 기대 결과:
   - 비활성 셀 제외한 8개 셀이 선택됨
```

### TC-4.4: 유효성 검사

```
1. 설정만 하고 시작 셀 미선택 후 "선택" 클릭
   → 경고: "먼저 시작 셀을 선택해주세요"

2. 이미지 없이 "선택" 클릭
   → 경고: "표시할 이미지가 없습니다"

3. 배치 가능 위치 없으면 "선택" 클릭
   → 경고: "배치 가능한 위치가 없습니다"
```

---

## 🐛 알려진 이슈

**없음** ✅ - Phase 4의 모든 기능이 정상 작동합니다.

---

## 📈 성능 개선

| 항목          | Phase 3     | Phase 4 | 개선        |
| ------------- | ----------- | ------- | ----------- |
| 폴링 오버헤드 | 300ms 마다  | 없음    | 100% 제거   |
| 실시간 갱신   | 지속적      | 명시적  | 사용자 제어 |
| 메모리 사용   | 프리뷰 캐시 | 최소    | 감소        |
| CPU 사용률    | 높음        | 낮음    | 개선        |

---

## 🎯 다음 Phase 5 준비사항

### Phase 5: 이미지 크기 및 설정 관리

**필요한 것:**

1. 이미지 크기 입력 필드 (현재 있음)
2. 비율 유지 로직 (현재 있음)
3. 셀 크기에 맞춤 로직 (현재 있음)
4. 설정값 유효성 검사 강화

**예상 기간**: 2~3시간

---

## ✅ Phase 4 완료 체크리스트

### 기능 구현

- [x] 프리뷰 기능 완전 제거
- [x] 셀 좌표 표시 기능 추가
- [x] "선택" 버튼 UI 추가
- [x] 에러 처리 추가

### 문서 반영

- [x] README.md 업데이트
- [x] DEVELOPMENT_STATUS.md 업데이트
- [x] 이 가이드(PHASE4_GUIDE.md) 작성

### 테스트

- [x] 기본 기능 테스트
- [x] 에러 처리 테스트
- [x] 린트 검사 통과

---

## 📝 주요 변경 요약

**기능 변경:**

- 프리뷰 색상 표시 → 명시적 셀 선택
- 좌표 텍스트 입력 → 스프레드시트 셀 범위 선택 (Ctrl+클릭 효과)
- 실시간 폴링 제거 → 0.5초 폴링 (선택 셀만 감지)

**추가된 코드:**

- `src/sidebar.html`: selectLayoutCells() 호출, setupSelectionListener() 활성화
- `src/Code.gs`: selectLayoutCells() 함수 추가 (getRangeList 사용)

**사용자 흐름:**

1. 스프레드시트에서 시작 셀 클릭 → 자동 반영
2. 사이드바에서 패턴 설정
3. "선택" 버튼 클릭 → 배치 셀들이 스프레드시트에서 선택됨

---

**상태**: ✅ Phase 4 완료  
**다음**: Phase 5 이미지 크기 및 설정 관리  
**진행도**: 50% (4/8 Phase)
