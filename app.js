// כאן אפשר להוסיף פרוייקטים וזה יתעדכן אוטומטית על דף הפורטפוליו
const projects = [
  {
    name: "רשימת מטלות",
    address: "to_do_list_project",
    downloadPath: "to_do_list_project\\to_do_list_download.zip",
    tag: "זיכרון ושימוש בנתונים",
    id: "to-do-list",
    technologies: ["html5", "css3", "javascript", "sqlite"], // sqlite מייצג כאן את ה-Database/Storage
    desc: `פרוייקט אשר משתמש בזיכרון המקומי של המחשב,<br>
     תוכנה פשוטה אך שימושית לתיעוד משימות הבית או בבית הספר,<br>
    ניתן להוסיף בקלות משימות ובלחיצה על המלל לשנות אם טעיתם :), <br>
    כמובן שגם פה ישנה האפשרות לתעד סיום משימה או מחיקתה ,<br>
    עכשיו רק נשאר לנסות !
    `,
    img: "info_img\\to_do_list_project_photo.png",
  },

  {
    name: "איקס עיגול",
    address: "tic_tac_to_project",
    downloadPath: "tic_tac_to_project\\tic_tac_to_download.zip",
    tag: "משחקי לוח",
    id: "tic-tac-to",
    technologies: ["html5", "css3", "javascript"],
    desc: `פרוייקט משחקי בהשראת המשחק המוכר איקס עיגול,<br>
    מטרת המשחק היא ליצור שורה, טור, או אלכסון בעזרת האייקון X/O  לפני השחקן המתחרה <br>
    כל שנישאר עכשיו זה רק לנסות, להנות ולנצח! `,
    img: "info_img\\tic_tac_to_project_photo.png",
  },

  {
    name: "משחק הזיכרון",
    address: "memory_game_project",
    downloadPath: "memory_game_project\\memory_game_download.zip",
    tag: "משחקי לוח",
    id: "memory_game",
    technologies: ["html5", "css3", "javascript"],
    desc: `פרוייקט משחקי המבוסס על המשחק המוכר "משחק הזיכרון"<br>
    למשחק שלוש רמות קושי ללא זמן!<br>
   קחו את הזמן, תרגעו, וגם על הדרך יצא לכם לאמן קצת את שריר הזיכרון, יש יותר טוב מזה?! `,
    img: "info_img\\memory_game_project_photo.png",
  },

  {
    name: "לומדת מחשבון",
    address: "calculator_project",
    downloadPath: "calculator_project\\calculator_download.zip",
    tag: "משחקי מילים ולומדות",
    id: "calculator",
    technologies: ["html5", "css3", "javascript"],
    desc: ` פרוייקט לומדת המתטיקה אשר מייצר שאלות רנדומליות על פי הרמה שבה אתה נמצא!
    <br> בין אם תרגול עצמי או הפגת השיעמום הלומדה קלילה ומהנה 
    <br> תהנו ובהצלחה!`,
    img: "info_img\\calculator_project_photo.png",
  },
  {
    name: "תוכנה להצגת מזג האוויר",
    address: "api_weather_project",
    downloadPath: "api_weather_project\\api_weather_download.zip",
    tag: "שימוש בשרתים חיצונים - API",
    id: "api_weather",
    technologies: ["html5", "css3", "javascript", "json"], // json מייצג את ה-API Data
    desc: `תוכנה אשר מייבאת מסוכן API את נתוני מזג האוויר <br>
    מדידת מזג האוויר בתוכנה זו מתבצעת כל 15 דקות לכן ייתכנו אי דיוקים קלים<br>
    ניתן לבחור עיר מרשימת הערים הפופולאריות בארץ, <br>
    או להניח את הסמן על המפה - 
    <br>טיפ: זה יעבוד על כל מקום בעולם תנסו!  `,
    img: "info_img\\api_weather_project_photo.png",
  },
  {
    name: " תוכנת חיפוש מדינות בעולם",
    address: "api_countries_project",
    downloadPath: "api_countries_project\\api_countries_download.zip",
    tag: "שימוש בשרתים חיצונים - API",
    id: "api_countries",
    technologies: ["html5", "css3", "javascript", "json"],
    desc: `תוכנית אשר מתחברת לסוכן API של מדינות בעולם,<br>
   תוכנה אשר מאפשרת חיפוש קל על פי עיר הבירה או שם המדינה, <br>
   אחרי שימוש בתוכנה הזו מי יוכל עליכם בארץ עיר!?<br>
   טיפ: זה יעבוד גם אם תרשמו רק חלק משם המדינה או עיר הבירה. `,
    img: "info_img\\api_countries_project_photo.png",
  },
  {
    name: "Smart Quiz - טריוויה באנגלית",
    address: "trivia_project",
    downloadPath: "trivia_project\\trivya_download.zip",
    tag: "שימוש בשרתים חיצוניים - API",
    id: "trivia_game",
    technologies: ["html5", "css3", "javascript", "json"],
    desc: `בחן את הידע הכללי שלך במשחק טריוויה מהיר ומעוצב!<br>
    השאלות נמשכות בזמן אמת ממאגר שאלות בינלאומי (API),<br>
    המשחק כולל טיימר מאתגר לכל שאלה, מערכת פסילות (חיים) וחווית משתמש מודרנית.<br>
    האם תצליחו לענות על כל השאלות לפני שייגמר הזמן?`,
    img: "info_img\\trivia_project_photo.png",
  },
];

//המקום שבו נמצאים כרטיסי הפרוייקט //
const projectsGrid = document.getElementById("projects-grid");

//הכרטיס מידע הקופץ//
const modal = document.getElementById("project-modal");
const modalBody = document.getElementById("modal-body");
const closeBtn = document.querySelector(".close-btn");

//  עובר על כל פרוייקט שהזנו במערך אובייקטי הפרוייקטים
projects.forEach((projectCard) => {
  const card = document.createElement("div");
  createProjectCard(card, projectCard);
  addInfoInProjectCard(card, projectCard);
});

// סגירת החלונית בלחיצה על ה-X
closeBtn.onclick = () => (modal.style.display = "none");

// סגירה בלחיצה על הרקע הכהה
window.onclick = (event) => {
  if (event.target == modal) modal.style.display = "none";
};

/**
 *  הפונקציה מבצעת - ייצור של כל כרטיס ומעלה אותו על המסך
 * @param {*} _card רפרנס לכרטיס הפרוייקט על המסך
 * @param {*} _projectCard אובייקט מידע על הפרוייקט הספציפי
 */
function createProjectCard(_card, _projectCard) {
  _card.id = _projectCard.id;
  _card.className = "card";
  _card.innerHTML = `
  <div>
    <span class="project-tag">${_projectCard.tag}</span>
    <h3>${_projectCard.name}</h3>
  </div>`;
  projectsGrid.appendChild(_card);
}

/**
 *  הפונקציה מבצעת- את ההשמה של המידע בהודעת המידע הקופצת
 * @param {*} _card  רפרנס לכרטיס הפרוייקט על המסך
 * @param {*} _projectCard אובייקט מידע על הפרוייקט הספציפי
 */
function addInfoInProjectCard(_card, _projectCard) {
  //מייבא את האייקונים לפי הנתונים מספריית האייקונים שייבאנו //
  const techIcons = _projectCard.technologies
    .map(
      (tech) =>
        `<i class="devicon-${tech}-plain colored" style="font-size: 2rem; margin: 5px;"></i>`,
    )
    .join("");

  //בכל לחיצה על הכרטיס יופיע המידע שמתאים לכרטיס הרלוונטי//
  _card.addEventListener("click", () => {
    modalBody.innerHTML = `
        <div class="modal-flex-container">
            <div class="modal-content-col">
                <h2 style="margin-top: 0; margin-bottom: 10px;">${_projectCard.name}</h2>
                <div class="tech-stack">${techIcons}</div>  
                <p class="modal-desc">${_projectCard.desc}</p>
                
            </div>
            <div style = "flex">
                <img src="${_projectCard.img}" alt="${_projectCard.name}" class="modal-img">
                <div class="modal-buttons">
                    <a href="${_projectCard.address}/index.html" class="contact-btn small-btn">כניסה לפרויקט</a>
                    <a href="${_projectCard.downloadPath}" download class="contact-btn small-btn secondary-btn">הורד ZIP</a>
                </div>
              </div>
            </div>
        </div>
    `;
    modal.style.display = "block";
  });
}
