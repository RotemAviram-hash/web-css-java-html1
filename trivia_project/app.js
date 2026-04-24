const AMOUNT_OF_QUESTIONS = 10;
const LIFE_AMOUNT = 5;
const TIME_PER_QUESTION = 15;
const START_POINT = 0;

const positiveFeedbackContainer = document.getElementById(
  "positive-feedback-container",
);
const timerText = document.getElementById("timer-text");
const progressFill = document.getElementById("progress-fill");
const currentQuestion = document.getElementById("question");
const answersContainer = document.getElementById("answers");
const livesContainer = document.getElementById("lives-container");
const exitMsgBtn = document.getElementById("exitMsgBtn");

let falseAnswerCounter = 0; // סופר כמות פסילות
let correctAnswerCounter = 0; //סופר את הרצף תשובות נכונות
const quiz = []; //מערך מסודר של השאלות שלקחנו מהAPI
let progress = 0; // מעקב של שהשאלות
let timer;
let timeLeft = TIME_PER_QUESTION;

start();
/**
 * פונקציה שמאתחלת את המשחק מפעילה הודעת פתיחה
 * לאחר סגירת ההודעה המשחק הטריוויה יתחיל
 */
function start() {
  showMsg(`Hello and welcome to my trivia game!<br>
    Wishing you lots of luck!`);
}

/**
 * try - מייבא לי את השאלות ושולח אותם למשחק הטריוויה 
 * 
 * catch -   מנסה להתמודד עם השגיאה בעזרת קריאה חדשה לפונקציה עם עדכון סטטוס -
   לאחר כמות הניסיונות מפעיל הודעת שגיאה 
 * @param {*} _retries - סטטוס השגיאות מתחיל דיפולטיבית בכמות ניסיונות שמוגדר 
 */
async function getTriviaQuestions(_retries = 2) {
  try {
    const res = await fetch(
      `https://opentdb.com/api.php?amount=${AMOUNT_OF_QUESTIONS}&type=multiple`,
    );

    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      throw new Error("Empty or invalid API response");
    }

    for (let index = 0; index < data.results.length; index++) {
      let currentQuestion = data.results[index];

      quiz.push({
        questionText: currentQuestion.question,
        possibleAnswers: shuffle([
          ...currentQuestion.incorrect_answers,
          currentQuestion.correct_answer,
        ]),
        correctAnswer: currentQuestion.correct_answer,
        difficulty: currentQuestion.difficulty,
      });
    }

    trivia();
  } catch (_error) {
    // כמות הניסיונות שמנסים לייבא מחדש יורד עד שמגיעים ל0
    if (_retries > 0) setTimeout(() => getTriviaQuestions(_retries - 1), 1000);
    else {
      // מאפס הכול ומפעיל הודעת שגיאה
      quiz.length = 0;
      console.log(_error);
      showMsg("Oops… we ran into a problem 😕");
    }
  }
}

/**
 * בודקת האם תנאי המשחק מאפשרים המשך משחק.
 * @returns {*} true אם לשחקן נשארו חיים ונותרו שאלות בחידון, אחרת false.
 */
function canPlay() {
  return falseAnswerCounter < LIFE_AMOUNT && progress < AMOUNT_OF_QUESTIONS;
}

/**
 * מנהלת את זרימת המשחק (Game Loop).
 * בודקת אם ניתן להמשיך לשחק, ואם כן - מציגה את השאלה הבאה ומפעילה את הטיימר.
 * במידה והמשחק הסתיים, מציגה את הודעת הסיכום.
 */
function trivia() {
  if (!canPlay()) {
    return finishMsg();
  }

  appendQuestionAndAnswers(quiz[progress]);
  startTimer();
}

/**
 * מציגה את השאלה ואת התשובות האפשריות על המסך.
 * הפונקציה מנקה את התשובות הקודמות, מייצרת כפתורים חדשים לכל תשובה,
 * ומצמידה לכל כפתור מאזין אירועים לבדיקת התשובה בזמן לחיצה.
 * @param {*} _question - אובייקט השאלה הכולל את הטקסט, התשובות והתשובה הנכונה
 */
function appendQuestionAndAnswers(_question) {
  // אתחול טקסט השאלה //
  currentQuestion.innerHTML = _question.questionText;

  let correctAnswer = _question.correctAnswer;
  let allAnswers = _question.possibleAnswers;
  answersContainer.innerHTML = "";

  allAnswers.forEach((possibleAnswer) => {
    const answer = document.createElement("button");
    answer.innerText = possibleAnswer;
    answer.className = "answer";

    answersContainer.append(answer);

    // הוספת מאזין בדיקה לכל תשובה //
    console.log(correctAnswer);
    answer.addEventListener("click", () => {
      if (canPlay()) checkAnswer(answer, possibleAnswer, correctAnswer);
    });
  });
}

/**
 * מפעילה את טיימר הספירה לאחור של השאלה.
 * הפונקציה מאפסת טיימרים קודמים, מעדכנת את התצוגה באופן מיידי,
 * ומנהלת את הורדת החיים והמעבר לשאלה הבאה במקרה של סיום הזמן.
 */
function startTimer() {
  if (canPlay()) {
    clearTimer(); // מוודא שאין טיימרים קודמים שרצים ברקע

    timerText.innerText = timeLeft;

    timer = setInterval(() => {
      timeLeft--;

      if (timeLeft < 0) {
        clearInterval(timer);
        loseLife();
        nextQuestion();
      } else {
        timerText.innerText = timeLeft;
      }
    }, 1000);
  }
}

/**
 * מאפס את טיימר
 */
function clearTimer() {
  clearInterval(timer);
}

/**
 * בודק האם התשובה שנבחרה היא התשובה            הנכונה
 * במידה ונוחש לא נכון מעלה את הפסילה באחד
 * מסמן את השאלה לפי התשובה - נכון ירוק , לא נכון אדום
 * @param {*} _answer אלמנט השאלה על המסך
 * @param {*} _possibleAnswer התשובה שנלחצת
 * @param {*} _correctAnswer התשובה הנכונה
 */
function checkAnswer(_answer, _possibleAnswer, _correctAnswer) {
  clearTimer();
  if (_possibleAnswer === _correctAnswer) {
    _answer.className = "answer correct";
    correctAnswerProgress();
  } else {
    _answer.className = "answer wrong";
    loseLife();
  }

  // 2. מחכים שה-CSS יסיים את השינוי ורק אז עוברים שאלה
  _answer.addEventListener(
    "transitionend",
    () => {
      nextQuestion();
    },
    { once: true },
  ); // once מבטיח שזה יקרה רק פעם אחת
}

/**
 מאפס את הזמן,

 מעדכן את בר ההתקדמות, ואת עוקב המשחק 

 חוזר חזרה 
 */
function nextQuestion() {
  clearTimer();
  progressFill.style.width = `${((progress + 1) / AMOUNT_OF_QUESTIONS) * 100}%`;
  progress++;
  timeLeft = TIME_PER_QUESTION;
  trivia();
}

/**
 * מדפיס הודעת הפסד או ניצחון
 */
function finishMsg() {
  clearTimer();
  if (progress === AMOUNT_OF_QUESTIONS) showMsg("You Win! 🎉", "victory");
  else showMsg("Game Over 😢", "lose");
}

//========== פונקציות חיווי הטריוויה ==========//
/**
 *מייצר ומוסיף לאבא את האלמנט עם האייקון הנדרש
 * @param {*} _icon - אייקון נבחר
 * @param {*} _dad - קונטיינר האבא שבו אמור להיות האייקון
 */
function appendFeedbackIcon(_icon, _dad) {
  const icon = document.createElement("span");

  icon.textContent = _icon;
  icon.style.transition = "0.3s";
  icon.style.transform = "scale(1.2)";
  _dad.append(icon);
}

/**
 *מאפס את האבא של האלמנטים \
 הקונטיינר 
 * @param {*} _dad
 */
function removeFeedbackIcons(_dad) {
  _dad.innerHTML = "";
}

/**
 * מאתחלת את תצוגת הלבבות על המסך.
 * הפונקציה מנקה את התצוגה הקיימת ומייצרת לבבות חדשים לפי הכמות המוגדרת ב-LIFE_AMOUNT.
 */
function addHearts() {
  removeFeedbackIcons(livesContainer);
  for (let i = 0; i < LIFE_AMOUNT; i++) {
    appendFeedbackIcon("❤️", livesContainer);
  }
}

/**
 *מעדכן ברגע של טעות את מצב הלבבות והסטרייק תשובות נכונות
 */
function loseLife() {
  falseAnswerCounter++;
  const first = livesContainer.firstElementChild;

  if (first) {
    first.remove();
    appendFeedbackIcon("💔", livesContainer);
  }
  livesContainer.classList.add("hearts-shake");
  setTimeout(() => {
    livesContainer.classList.remove("hearts-shake");
  }, 500);
  correctAnswerCounter = 0;
  removeFeedbackIcons(positiveFeedbackContainer);
}

/**
 * מעדכנת את מונה התשובות הנכונות ומוסיפה פידבק ויזואלי למשתמש
 * (מוסיפה אייקון אש עד למקסימום של 3 תשובות נכונות)
 */
function correctAnswerProgress() {
  correctAnswerCounter++;

  if (correctAnswerCounter <= 3) {
    appendFeedbackIcon("🔥", positiveFeedbackContainer);
  }
}

// ============= הודעות למשתמש =============

/**
 * מציגה הודעה למשתמש לפי סוג ההודעה שנבחר
 * @param {*} _text - הטקסט שיוצג בתוך ההודעה
 * @param {*} _type - סוג ההודעה: normal, victory, או lose
 */
function showMsg(_text, _type = "normal") {
  const box = document.getElementById("msgBox");
  const msg = document.getElementById("msg");
  const wrapper = document.getElementById("divMsg");

  msg.innerHTML = _text;

  // ניקוי מלא של מצב קודם
  box.className = "";

  // הוספת type רק אם קיים
  const validTypes = ["normal", "victory", "lose"];
  if (validTypes.includes(_type)) {
    box.classList.add(_type);
  } else {
    box.classList.add("normal");
  }

  wrapper.classList.remove("hidden");

  // קונפטי
  if (_type === "victory") {
    launchConfetti("🎉", 80);
  }

  if (_type === "lose") {
    launchConfetti("😢", 60);
  }
}

/**
 * מסתיר הודעה
 */
function hideMessage() {
  const wrapper = document.getElementById("divMsg");

  wrapper.classList.add("hidden");
}

exitMsgBtn.addEventListener("click", () => {
  hideMessage();
  clear();
  getTriviaQuestions();
});

// פונקציות עזר //

/**
 *איפוס של אלמנטי הטריוויה
 */
function clear() {
  progressFill.style.width = `${START_POINT}%`; // איפוס הבר

  addHearts();
  removeFeedbackIcons(positiveFeedbackContainer);
  clearTimer();
  falseAnswerCounter = START_POINT;
  correctAnswerCounter = START_POINT;
  quiz.length = START_POINT;
  progress = START_POINT;
  timeLeft = TIME_PER_QUESTION;
}

/**
 *מייצרת קונפטי
 * @param {*} symbol - האייקון שמתפזר
 * @param {*} amount -  כמות האייקונים שמתפזרים
 */
function launchConfetti(symbol = "🎉", amount = 80) {
  for (let i = 0; i < amount; i++) {
    setTimeout(() => {
      const el = document.createElement("div");
      el.textContent = symbol;

      // מיקום התחלתי (מעל המסך)
      el.style.position = "fixed";
      el.style.top = "-10vh";
      el.style.left = Math.random() * 100 + "vw";

      // עיצוב בסיסי
      el.style.fontSize = Math.random() * 18 + 10 + "px";
      el.style.zIndex = 9999;
      el.style.pointerEvents = "none";

      // אנימציה
      el.style.animation = `fall ${Math.random() * 2 + 2}s linear forwards`;

      document.body.appendChild(el);

      // ניקוי בסוף
      setTimeout(() => el.remove(), 5000);
    }, i * 20);
  }
}

/**
 * לערבב את המערך שממנו מושכים את השאלות לטריוויה
 * @param {*} originalArray מערך המקור
 * @returns מערך "מבולגן" מבחינת מיקום הערכים
 */
function shuffle(originalArray) {
  let shuffled = originalArray.slice();

  for (let i = shuffled.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
