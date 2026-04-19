let tasks = JSON.parse(localStorage.getItem("tasks")) || []; //מייבא מהזיכרון את המטלות שהוזנו או מגדיר מחדש מערך ריק
const addButton = document.getElementById("addButton");

/**
 * בנייה הוספת מאזינים והעלאה שלהם על המסך
 */
function printTasks() {
  const tasksList = document.getElementById("tasksList");
  tasksList.innerHTML = "";
  tasks.forEach((_task) => {
    const li = document.createElement("li");
    const row = document.createElement("div");
    const text = document.createElement("p");
    const deleteButton = document.createElement("button");
    const finishButton = document.createElement("input");

    // קלאסים ל-CSS
    row.classList.add("task-row");
    text.classList.add("task-text");
    deleteButton.classList.add("delete");
    finishButton.classList.add("task-checkbox");

    // הגדרות כפתורים
    deleteButton.innerText = "DELETE";
    finishButton.type = "checkbox";
    finishButton.checked = _task.done;
    if (_task.done) text.classList.add("done");
    text.innerText = _task.text;

    // הכנסת אלמנטים ל-div ו-li
    row.appendChild(text);
    row.appendChild(deleteButton);
    row.appendChild(finishButton);
    li.appendChild(row);
    tasksList.appendChild(li);

    // אירועי checkbox
    finishButton.addEventListener("change", () => {
      text.classList.toggle("done");
      _task.done = finishButton.checked;
    });

    // אירוע מחיקה
    deleteButton.addEventListener("click", () => {
      deleteTask(_task.id);
      tasksList.removeChild(li);
    });

    // אירוע עריכה inline
    text.addEventListener("click", () => {
      const inputEdit = document.createElement("input");
      inputEdit.type = "text";
      inputEdit.value = _task.text;
      inputEdit.style.flex = "1";

      row.replaceChild(inputEdit, text);
      inputEdit.focus();

      inputEdit.addEventListener("blur", () => {
        if (inputEdit.value.trim() !== "") {
          _task.text = inputEdit.value;
          text.innerText = _task.text;
          localStorage.setItem("tasks", JSON.stringify(tasks));
        }
        row.replaceChild(text, inputEdit);
      });

      inputEdit.addEventListener("keydown", (e) => {
        if (e.key === "Enter") inputEdit.blur();
      });
    });
  });
}

// אירוע של הוספת איבר לרשימה
addButton.addEventListener("click", () => {
  const input = document.getElementById("taskInput");

  addNewTask(input.value);

  input.value = "";
  input.focus();

  printTasks();
});

/**
 * הוספת איבר לרשימה
 * @param {*} taskName שם המשימה
 * @returns אם אין שם למשימה תחזיר כלום
 */
function addNewTask(taskName) {
  if (taskName == "") {
    return;
  }

  tasks.push({
    id: crypto.randomUUID(),
    text: taskName,
    done: false,
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/**
 * מחיקת איבר ברשימה
 * @param {*} _taskId מזהה המשימה
 */
function deleteTask(_taskId) {
  tasks = tasks.filter((task) => task.id !== _taskId);

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

printTasks();
