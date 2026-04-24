const bordCells = Array.from(document.getElementsByClassName("cell"));
const exitGameMsgBtn = document.getElementById("exitGameMsgBtn");
const clearBtn = document.getElementById("clearBtn");

const WIN_OPTIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
const bord = ["", "", "", "", "", "", "", "", ""];
let turn = "X";

//======= מאזיני אירועים =======//
bordCells.forEach((cell, index) => {
  //עבור כל תא שיש בלוח תוסיף מאזין שאחריו תבדוק את סטטוס המשחק
  cell.addEventListener("click", () => {
    addToScreen(cell, index);
    isWin();
    isEven();
  });
});

// אירוע של איפוס לוח המשחק
clearBtn.addEventListener("click", () => {
  clearBord();
});

// אירוע של סגירת חלון הודעות קופצות
exitGameMsgBtn.addEventListener("click", () => {
  hideMessage();
});

//======= פעולות לחצנים= ======//
/**
 * מוסיף את סימן של השחקן ללוח המחשק 
 * @param {*} _cell רפרנס של התא על המסך
 * @param {*} _index מיקום במערך הפנימי של לוח המשחק
 * @returns אם הוא מסומן כבר אל תמשיך 
 */
function addToScreen(_cell, _index) {
  if (_cell.innerHTML) return;
  bord[_index] = turn;
  _cell.innerHTML = '<span class="mark"></span>';

  _cell.classList.add(turn === "X" ? "x-player" : "o-player");
  turn = turn == "X" ? "O" : "X";
}

/**
 * מאפס את ערכי המחשק הקודם 
 */
function clearBord() {
  bordCells.forEach((cell) => {
    cell.innerHTML = "";
    cell.classList.remove("x-player", "o-player"); // ניקוי צבעים
  });
  for (let i = 0; i < bord.length; i++) {
    bord[i] = "";
  }
  turn = "X"; // איפוס תור ל-X
}

//======= בדיקת סטטוס המשחק =======//
/**
 * מחשב ניצחון 
 * @returns אם יש ניצחון אמת אחרת שקר 
 */
function calculateWINS() {
  for (let i = 0; i < WIN_OPTIONS.length; i++) {
    let a = bord[WIN_OPTIONS[i][0]];
    let b = bord[WIN_OPTIONS[i][1]];
    let c = bord[WIN_OPTIONS[i][2]];

    if (a === b && b === c && a !== "") {
      return true;
    }
  }
  return false;
}

/**
 * בודק האם המחשחק נמצאר במצב של ניצחון
 * ומפעיל בהתאם הודעה
 */
function isWin() {
  const player = turn == "X" ? "O" : "X";
  if (calculateWINS()) {
    showMsg(`🎉שחקן ${player}  ניצח!🎉`);
  }
}
/**
 * בודק האם המשחק נמצא במצב של תיקו
 * ומפעיל בהתאם הודעה
 * @returns אם מצב תיקו מתקיים אמת אחרת שקר
 */
function isEven() {
  if (calculateWINS()) return false;
  for (let i = 0; i < bord.length; i++) {
    if (bord[i] === "") return false;
  }

  showMsg("🤝תיקו !!🤝");
  return true;
}

//======= הודעה שקופצת =======//
/**
 * מציגה הודעה
 * @param {*} _text הטקסט שצריך להציג על המסך
 */
function showMsg(_text) {
  const div = document.getElementById("gameMessage");
  const p = document.getElementById("gameMsg");

  p.textContent = _text;
  div.classList.remove("hidden");
}

/**
 * מסתיר את ההודעה
 */
function hideMessage() {
  clearBord();
  const div = document.getElementById("gameMessage");
  div.classList.add("hidden"); // מסתיר
}
