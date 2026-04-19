let iconPool = [
  "🐶",
  "🐱",
  "🐭",
  "🐹",
  "🐰",
  "🦊",
  "🐻",
  "🐼",
  "🐸",
  "🐵",
  "🦁",
  "🐯",
  "🐨",
  "🐔",
  "🐧",
  "🦉",
  "🐦",
  "🦋",
  "🐢",
  "🐙",
];

//מערך אובייקטים עם תכונות של האייקונים ומיקום
let bordMemoryGame = [];

let firstFlipped; // שומר את הרפרנס לכרטיס הראשון שנלחץ
let secondFlipped; // שומר את הרפרנס השני שנלחץ
let countFinds = 0;
let canPlay = true;
let level = 0;

// קבועים לרמות - הערך המספרי שווה לכמות סוגי האייקונים שיהיה
const EASY = 4;
const MEDIUM = 8;
const HARD = 10;

// קבוע לכמה כרטיסים יוצגו בכל פעם
const CARDS = 2;

const startOverGame = document.getElementById("startOverGame");
const bordGameDiv = document.getElementById("game-board-id");
const exitMsgBtn = document.getElementById("exitMsgBtn");
const overlay = document.getElementById("overlay");
const easyBtn = document.getElementById("easyBtn");
const mediumBtn = document.getElementById("mediumBtn");
const hardBtn = document.getElementById("hardBtn");

//============= מאזינים =============//
//מאזין באירועי בחירת הרמות- מפעיל את המשחק בכל אחד מהם//
easyBtn.addEventListener("click", () => {
  clear();
  overlay.classList.add("hidden");
  level = EASY;
  memoryGame();
});

mediumBtn.addEventListener("click", () => {
  clear();
  overlay.classList.add("hidden");
  level = MEDIUM;
  memoryGame();
});

hardBtn.addEventListener("click", () => {
  clear();
  overlay.classList.add("hidden");
  level = HARD;
  memoryGame();
});

// מאזין לאירועי הפעלת המשחק מחדש
startOverGame.addEventListener("click", () => {
  clear();
  overlay.classList.remove("hidden");
});

// מאזין באירועי לחיצה על כפתור הסגירה בהודעת המשתמש - ניצחון
exitMsgBtn.addEventListener("click", () => {
  hideMessage();
  overlay.classList.remove("hidden");
});

//============= פונקציות =============//

/**
 *  הפעלה של הUI
 */
function memoryGame() {
  iconPool = shuffleIcons(iconPool);
  setGameCards();
  createGameBordCards();
}

/**
 * עובר על מערך האובייקטים ומייצר כל כרטיס
 */
function createGameBordCards() {
  bordMemoryGame.forEach((cell) => {
    createOneCard(cell);
  });
}

/**
 *  יוצר כרטיס + מוסיף עיצוב ומאזין לכל כרטיס
 * @param {*} _cell  bordMemoryGame אובייקט מתוך מערך
 */
function createOneCard(_cell) {
  // יוצר את האלמנטים
  const card = document.createElement("div");
  const innerCard = document.createElement("div");
  const innerCardFront = document.createElement("button");
  const innerCardBack = document.createElement("button");

  // מוסיף מחלקת עיצוב לכל אלמנט
  card.classList.add("card");
  innerCard.classList.add("inner-card");
  innerCardFront.classList.add("front");
  innerCardBack.classList.add("back");

  // מוסיף את האייקונים לכרטיסים
  innerCardFront.innerText = "?";
  innerCardBack.innerText = _cell.icon;

  // מאזין לאירועי לחיצה - מפעיל את הלוגיקה של המשחק
  innerCardFront.addEventListener("click", () => {
    gameLogic(innerCard, card);
  });

  // מוסיף את כל האלמנטים לDOM על המסך
  innerCard.appendChild(innerCardFront);
  innerCard.appendChild(innerCardBack);
  card.appendChild(innerCard);
  bordGameDiv.appendChild(card);
}

/**
 * מופעל בלחיצה על כרטיס במטרה להפוך אותו
 * שומר על הכרטיס הראשון והשני שנלחץ ובודק האם עומד בתנאי הזיהוי
 * מפעיל בדיקת ניצחון בכל לחיצה
 * @param {*} _innerCard רפרנס האלמנט הפנימי של תוכן הכרטיס
 * @param {*} _card רפרנס לאלמנט של הכרטיס
 * @returns מחזיר את הפונקציה במצבים שאי אפשר להפוך את הכרטיס
 */
function gameLogic(_innerCard, _card) {
  if (!canPlay) return; // השחקן לא יכול לבחור כרטיסים כאשר נבחרו כבר שני כרטיסים

  _card.classList.add("flipped");

  if (!firstFlipped) {
    firstFlipped = _innerCard;
    return;
  }

  if (!secondFlipped) {
    secondFlipped = _innerCard;
  }

  if (secondFlipped && firstFlipped) {
    if (
      //מצב שבו שני הכרטיסים עם אייקון זהה
      firstFlipped.querySelector(".back").innerText ===
      secondFlipped.querySelector(".back").innerText
    ) {
      countFinds++;
      firstFlipped = null;
      secondFlipped = null;
    } else {
      // במקרה שלא נמצאה התאמה בין שני הכרטיסים
      canPlay = false;
      setTimeout(() => {
        firstFlipped.parentElement.classList.toggle("flipped");
        secondFlipped.parentElement.classList.toggle("flipped");
        firstFlipped = null;
        secondFlipped = null;
        canPlay = true;
      }, 400);
    }
    whenWinning();
  }
}

/**
 * בודק את תנאי הניצחון - במידה וכן מעלה הודעת ניצחון
 */
function whenWinning() {
  if (countFinds == level) {
    setTimeout(() => {
      clear();
      showMsg("כל הכבוד סיימת את המשחק!");
    }, 800);
  }
}

/**
 * הגדרת מערך לוח המשחק על פי הרמה
 */
function setGameCards() {
  const gameCards = []; // מערך של אובייקטים, תכונות: מיקום ואייקון
  let iconsByLevel = shuffleIcons(setIconsByLevel());

  const wantedLength = level * CARDS;
  const maxLength = Math.min(iconsByLevel.length, wantedLength);

  for (let i = 0; i < wantedLength; i++) {
    const card = {};
    card.icon = iconsByLevel[i];
    card.place = i;
    gameCards.push(card);
  }
  bordMemoryGame = [...gameCards];
}

/**
 * מייבא מהמערך אייקונים את כמות האייקונים למשחק
 * @returns מערך עם אייקונים כפולים
 */
function setIconsByLevel() {
  const firstIconsSet = [];
  for (let i = 0; i < level; i++) {
    firstIconsSet.push(iconPool[i]);
  }
  return [...firstIconsSet, ...firstIconsSet];
}

/**
 * פונקציה המאפסת את ערכי המשחק הקודם
 */
function clear() {
  bordGameDiv.innerHTML = "";
  bordMemoryGame.length = 0;
  firstFlipped = null;
  secondFlipped = null;
  countFinds = 0;
  canPlay = true;
}

// =============הודעות למשתמש===========//
/**
 * מציגה הודעה
 * @param {*} _text הטקסט שצריך להציג על המסך
 */
function showMsg(text) {
  const div = document.getElementById("divMsg");
  const p = document.getElementById("msg");

  p.textContent = text;
  div.classList.remove("hidden");
}

/**
 * מסתיר את ההודעה
 */
function hideMessage() {
  const div = document.getElementById("divMsg");
  div.classList.add("hidden"); // מסתיר
}

//=============פונקציות עזר=============//
/**
 * מגריל מספר שלם בטווח מסויים
 * @param {*} min טוח המינימום של ההגרלת המספר
 * @param {*} max טווח המקסימום של הגרלת המספר
 * @returns מחזיר מספר שלם בטווח
 */
function getRandomInt(min, max) {
  // מחזיר מספר שלם בין min ל־max כולל
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 * לערבב את המערך שממנו מושכים את האייקונים למשחק
 * @param {*} originalArray המערך ממנו מושכים אייקונים
 * @returns מערך "מבולגן" מבחינת מיקום הערכים
 */
function shuffleIcons(originalArray) {
  // יוצרים עותק כדי לא לשנות את המערך המקורי
  let shuffled = originalArray.slice();

  for (let i = shuffled.length - 1; i > 0; i--) {
    // בוחרים אינדקס אקראי בין 0 ל-i
    let j = Math.floor(Math.random() * (i + 1));
    // מחליפים את הערכים
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
