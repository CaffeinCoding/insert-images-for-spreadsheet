/**
 * Import Images Pattern - Google Apps Script Backend
 * Sidebar를 열고 선택된 셀을 감지하는 기본 기능 구현
 */

/**
 * 스프레드시트 메뉴 추가 및 Sidebar 열기
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu("이미지 패턴")
    .addItem("이미지 가져오기", "openSidebar")
    .addToUi();
}

/**
 * Sidebar 열기
 */
function openSidebar() {
  const html = HtmlService.createHtmlOutputFromFile("sidebar")
    .setWidth(350)
    .setHeight(700);
  SpreadsheetApp.getUi().showModelessDialog(html, "이미지 패턴 배치");
}

/**
 * 현재 선택된 셀 정보 반환
 */
function getSelectedCellInfo() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const range = sheet.getActiveRange();

    if (!range) {
      return { success: false, error: "셀을 선택해주세요" };
    }

    const row = range.getRow();
    const col = range.getColumn();
    const address = range.getA1Notation().split(":")[0]; // 범위 선택 시 첫 셀만

    return {
      success: true,
      row: row,
      col: col,
      address: address,
    };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * 격자형 배치에 따른 셀 좌표 계산
 * @param {Object} settings - 배치 설정
 * @returns {Array<{row, col}>} 계산된 좌표 배열
 */
function calculateLayoutPositions(settings) {
  const {
    startRow,
    startCol,
    rows,
    cols,
    rowGap = 0,
    colGap = 0,
    inactiveCells = [],
  } = settings;

  const positions = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // 실제 셀 좌표 계산 (간격 포함)
      const actualRow = startRow + r * (1 + rowGap);
      const actualCol = startCol + c * (1 + colGap);

      // 비활성 셀 확인
      const isInactive = inactiveCells[r] && inactiveCells[r][c];

      if (!isInactive) {
        positions.push({
          row: actualRow,
          col: actualCol,
          index: r * cols + c,
        });
      }
    }
  }

  return positions;
}

/**
 * 셀 배경색 설정
 * @param {Array<{row, col}>} cells - 셀 좌표 배열
 * @param {string} color - 색상 (16진수, 예: "#269444")
 */
function setCellBackgroundColors(cells, color) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();

    for (const cell of cells) {
      const range = sheet.getRange(cell.row, cell.col);
      range.setBackground(color);
    }

    return { success: true };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * 셀 배경색 초기화
 * @param {Array<{row, col, originalColor}>} cells - 원본 색상 정보 포함된 셀 배열
 */
function restoreOriginalColors(cells) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();

    for (const cell of cells) {
      const range = sheet.getRange(cell.row, cell.col);
      range.setBackground(cell.originalColor || "#ffffff");
    }

    return { success: true };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * Undo 기능 호출
 */
function undoLastAction() {
  try {
    SpreadsheetApp.getActiveSpreadsheet().undo();
    return { success: true };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}
