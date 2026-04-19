const beginner = [];
const advanced = [];
const expert = [];
const data = [
  {
    level: beginner,
    text: "👶רמת המשחק היא: מתחילים",
    id: 0,
    numbersAmount: 2,
    rangeMin: 0,
    rangeMax: 10,
    operatorsAmount: 1,
  },
  {
    level: advanced,
    text: "🎓רמת המשחק היא: מתקדמים",
    id: 1,
    numbersAmount: 3,
    rangeMin: 1,
    rangeMax: 10,
    operatorsAmount: 2,
  },
  {
    level: expert,
    text: "🧙‍♂️רמת המשחק היא: מומחים",
    id: 2,
    numbersAmount: 3,
    rangeMin: 1,
    rangeMax: 100,
    operatorsAmount: 2,
  },
];

let currentStage = 0; //הרמה הנוכחית בכל שלב
let counterQuestionRepeat = 0; // סופר את כמות הפעמים שיצא שאלון מרמה הנוכחית

const quizScreen = document.getElementById("quizScreen");
const sendBtn = document.getElementById("sendBtn");
const exitMsgBtn = document.getElementById("exitMsgBtn");
const nextLevel = document.getElementById("nextLevel");
nextLevel.disabled = false;

// קבועי מספרים
const QUETSION_AMOUNT = 5;
const QUETSION_REPEAT = 3;
calculatingGameMain();

/**
 * מסך ההתחלה ופתיחת המשחק
 */
function calculatingGameMain() {
  showMsg("✖️➕משחק למידת מתמטיקה➖➗", true);
  printLevel(data[currentStage]);
}

/**
 * מנהלת את תצוגת השלב הנוכחי.
 * במקרה של סיום כל השלבים, הפונקציה מאתחלת את המשחק באופן רקורסיבי.
 * @param {*} _level
 */
function printLevel(_level) {
  if (
    currentStage < data.length
  ) // בודק אם כמות הרמות שעלינו נמצאת עדיין בתחום הרמות שיש לנו להציע
  {
    cleanScreen();

    const sideText = document.getElementById("sideText");
    sideText.textContent = _level.text;
    // מייצר את האובייקט של השאלות לפי הרמה שניתנה לנו
    creatLevel(
      _level.id,
      _level.numbersAmount,
      _level.rangeMin,
      _level.rangeMax,
      _level.operatorsAmount,
    );
    //עובר על כל השאלות ומאתחל אותם על המסך
    setLevel(_level.level);
  } else {
    currentStage = 0;
    showMsg(
      `!סיימת את לומדת המתמטיקה בהצלחה <br>
      <sapn class="muted-text"> |המשחק יתחיל בצורה אוטומטית מחדש ברמת |מתחילים</span> `,
      true,
    );
    printLevel(data[currentStage]);
  }
}

/**
 * עובר על כל איברי המערך של הרמה - מכיל את כל השאלות -וקורא לפונקיה שתדפיס על המסך אחד אחד
 * @param {*} _level
 */
function setLevel(_level) {
  data[currentStage].level.forEach((question) => {
    printQuestion(question);
  });
}

//========= מאזינים ==========//

/**
 * יצירה של כל שאלה
 * @param {*} _question אובייקט שאלה המכיל את המשוואה, את התשובה, ותשובת המשתמש
 */
function printQuestion(_question) {
  const questionDiv = document.createElement("div");
  questionDiv.classList.add("questionDiv");

  const questionText = document.createElement("p");
  questionText.textContent = _question.equation;

  const answerInput = document.createElement("input");
  answerInput.type = "number";

  questionDiv.appendChild(questionText);
  questionDiv.appendChild(answerInput);
  quizScreen.appendChild(questionDiv);

  // אירוע הזנת תשובה
  answerInput.addEventListener("input", () => {
    _question.input = Number(answerInput.value);
  });
}

//אירוע של בדיקת השאלות
sendBtn.addEventListener("click", () => {
  let counter = 0;
  // מעבר על כל השאלות ובדיקה האם התשובה נכונה או לא והעלה של הודעת סיכום בסוף
  data[currentStage].level.forEach((question, i) => {
    const isCorrect = Math.abs(question.input - question.answer) < 0.01;
    const allInputs = quizScreen.querySelectorAll("input");
    const currentInput = allInputs[i];

    if (isCorrect) {
      counter++;
      currentInput.style.border = "2px solid #28a745"; // ירוק
    } else {
      currentInput.style.border = "2px solid #dc3545"; // אדום
    }
  });
  showMsg(
    `ענית על ${counter} שאלות נכון!
            הציון שלך הוא ${(counter / QUETSION_AMOUNT) * 100}`,
    false,
  );
});

//אירוע של יציאה ממסך הודעות
exitMsgBtn.addEventListener("click", () => {
  hideMessage();
});

// אירוע של מעבר לשאלון הבא/ רמה הבאה
nextLevel.addEventListener("click", () => {
  // אם כמות השאלות שהיו ברמה הנוכחית שוות לכמות השאלות שיש בכל רמה תעבור לרמה הבאה
  counterQuestionRepeat++;
  if (counterQuestionRepeat === QUETSION_REPEAT) {
    currentStage++;
    counterQuestionRepeat = 0;
  }
  printLevel(data[currentStage]);
});

/**
 * הפונקציה מבצעת יצירה של תרגיל, מחשבת את התשובה שלו, וקוראת לבונה אובייקטי השאלות
 * הערכים שמקבלת הפונקציה מגדירה באופן כללי את הדרישה של כל תרגיל,
 * @param {*} _level   מערך הרמה
 * @param {*} _numbersAmount כמה מספרים יהיה בתרגיל
 * @param {*} _rangeMin טווח המספרים שיוגרלו המינימלי
 * @param {*} _rangeMax טווח המספרים שיוגרלו המקסימלי
 * @param {*} _operatorsAmount כמה אופרטורים יהיה בתרגיל
 */
function creatLevel(
  _level,
  _numbersAmount,
  _rangeMin,
  _rangeMax,
  _operatorsAmount,
) {
  for (let i = 0; i < QUETSION_AMOUNT; i++) {
    let toUseNumbers = creatNumbersArray(_numbersAmount, _rangeMin, _rangeMax);
    let toUsOperators = getRandomOperator(_operatorsAmount);
    let equation = [toUseNumbers[0]];
    let answer = toUseNumbers[0];

    for (let i = 0; i < toUsOperators.length; i++) {
      equation.push(toUsOperators[i]);
      equation.push(toUseNumbers[i + 1]);
    }
    answer = solveExpression([...equation]);
    equation.push("=");
    buildQuation(equation, answer);
  }
}

/**
 *  יוצר את אובייקט השאלה ומכניס אותו למערך השאלות לפי רמה
 * @param {*} _equation משוואה שיצרנו
 * @param {*} _answer תשובה למשוואה
 */
function buildQuation(_equation, _answer) {
  let question = {};
  question = {
    equation: _equation.join(" "),

    answer: _answer,

    input: 0,
  };

  data[currentStage].level.push(question);
}

/**
 * פונקציה המחשבת מערך של תרגיל לפי סדר פעולות חשבון
 * @param {*} _question - מערך המכיל מספרים ואופרטורים
 * @returns {*} - התוצאה הסופית
 */
function solveExpression(_question) {
  const OUT_OF_RANGE = 999999;

  // פונקציית עזר למציאת האופרטור הבא לפי סדר חשיבות
  const getNextOperatorIndex = (operators) => {
    let indexes = operators.map((op) => {
      let idx = _question.indexOf(op);
      return idx !== -1 ? idx : OUT_OF_RANGE;
    });

    let first = Math.min(...indexes);
    return first !== OUT_OF_RANGE ? first : -1;
  };

  // שלב 1: כפל וחילוק (קודם כל)
  let opIndex;
  while ((opIndex = getNextOperatorIndex(["*", "/"])) !== -1) {
    const res = calculatingAnswer(
      _question[opIndex - 1],
      _question[opIndex],
      _question[opIndex + 1],
    );
    _question.splice(opIndex - 1, 3, res);
  }

  // שלב 2: חיבור וחיסור
  while ((opIndex = getNextOperatorIndex(["+", "-"])) !== -1) {
    const res = calculatingAnswer(
      _question[opIndex - 1],
      _question[opIndex],
      _question[opIndex + 1],
    );
    _question.splice(opIndex - 1, 3, res);
  }

  return _question[0];
}
/**
 * מבצע חישוב של שתי מספרים שמקבל לפי האופרטור שמתקבל
 * @param {*} _num1 מספר ראשון
 * @param {*} _operator הפעולה המתמטית
 * @param {*} _num2 מספר השני
 * @returns
 */
function calculatingAnswer(_num1, _operator, _num2) {
  switch (_operator) {
    case "+":
      return _num1 + _num2;
    case "-":
      return _num1 - _num2;
    case "/":
      return _num1 / _num2;
    case "*":
      return _num1 * _num2;
    default:
      return 0;
  }
}

// ========== פונקיות עזר ==========//

/**
 *יוצר מערך של מספרים מוגרלים לפי כמות המספרים שתהיה בתרגיל (על פי הנדרש ברמה )
 * @param {*} _amount כמות המספרים שתהיה בשאלה
 * @param {*} _rangeMin טווח המינימום למה יכול להיות המספר
 * @param {*} _rangeMax טווח המקסימום למה יכול להיות המספר
 * @returns מערך המספרים המוגרלים
 */
function creatNumbersArray(_amount, _rangeMin, _rangeMax) {
  let numbers = [];
  for (let i = 0; i < _amount; i++) {
    numbers.push(getRandomInt(_rangeMin, _rangeMax));
  }
  return numbers;
}

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
 *מגריל אופרטור לבניית המשוואה
 * @param {*} _amount כמה אופרטורים צריך במשוואה
 * @returns אופרטור רנדומלי
 */
function getRandomOperator(_amount) {
  const OPERATORS = ["+", "-", "*", "/"];
  const returnOperators = [];
  for (let i = 0; i < _amount; i++) {
    returnOperators.push(OPERATORS[getRandomInt(0, _amount)]);
  }
  return returnOperators;
}

/**
 *מציג הודעה למשתמש
 * @param {*} _text טקסט שרוצים להציג
 * @param {*} _removeBackround האם רוצים שמתחת להודעה ישאר המסך הקודם
 */
function showMsg(_text, _removeBackround) {
  const mainWrapper = document.getElementById("main-wrapper");
  const div = document.getElementById("divMsg");
  const p = document.getElementById("msg");
  if (_removeBackround) mainWrapper.classList.add("hidden");
  p.innerHTML = _text;

  div.classList.remove("hidden");
}

/**
 * מסתיר את ההודעה
 */
function hideMessage() {
  const mainWrapper = document.getElementById("main-wrapper");
  const div = document.getElementById("divMsg");
  div.classList.add("hidden");
  mainWrapper.classList.remove("hidden");
}

/**
 *מאפס את המסך והרמות
 */
function cleanScreen() {
  quizScreen.innerHTML = "";
  data.forEach((quiz) => {
    quiz.level.length = 0;
  });
}
