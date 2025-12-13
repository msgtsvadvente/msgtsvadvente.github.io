const loginContainer = document.getElementById("login-screen");
const calendarContainer = document.getElementById("calendar-container");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const studentSelect = document.getElementById("student-select");
const studentName = document.getElementById("student-name");
const calendar = document.getElementById("calendar");

const modal = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");
const questionTitle = document.getElementById("question-title");
const questionContainer = document.getElementById("question-container");
const submitBtn = document.getElementById("submit-answer");
const feedback = document.getElementById("feedback");

let currentDay = null;
let currentStudent = null;

// --- Авторизация ---
const savedStudent = localStorage.getItem("student");
if (savedStudent) showCalendar(savedStudent);

loginBtn.addEventListener("click", () => {
  const name = studentSelect.value;
  if (!name) return alert("Izvēlies vārdu!");
  localStorage.setItem("student", name);
  showCalendar(name);
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("student");
  loginContainer.classList.remove("hidden");
  calendarContainer.classList.add("hidden");
});

// --- Показ календаря ---
function showCalendar(name) {
  currentStudent = name;
  loginContainer.classList.add("hidden");
  calendarContainer.classList.remove("hidden");
  studentName.textContent = `Sveicināti, ${name}!`;

  calendar.innerHTML = "";
  const totalDays = 18;
  const today = new Date().getDate();
  const studentData = JSON.parse(localStorage.getItem(`answers_${name}`)) || {};

  for (let day = 1; day <= totalDays; day++) {
    const cell = document.createElement("div");
    cell.classList.add("day");
    cell.textContent = day;

    if (studentData[day]) cell.classList.add("opened");

// Разрешён только сегодняшний день
if (day === today) {
  cell.classList.add("available");
  cell.addEventListener("click", () => openQuestion(day, cell));
} 
// Все остальные дни — заблокированы
else {
  cell.style.opacity = "0.5";
  cell.style.cursor = "not-allowed";
}


    calendar.appendChild(cell);
  }

  updatePointsUI(name);
}

// --- Открытие вопросов ---
function openQuestion(day, element) {
  const studentData = JSON.parse(localStorage.getItem(`answers_${currentStudent}`)) || {};

  // --- Блокировка повторного открытия ---
  if (studentData[day] && (day === 6 || day === 7 || day === 8 || day === 13 || day === 14 || day === 2 || day === 12 || day === 17 || day === 18)) {
    document.getElementById("submit-answer").classList.add("hidden");
  } else if (studentData[day]) {
    alert("Šī diena jau ir atvērta! 🎁 Punkti par to tiek piešķirti tikai vienu reizi.");
    return;
  }

  currentDay = day;
  questionContainer.innerHTML = "";
  feedback.textContent = "";

  const qList = questions[day];

  // если для дня нет вопросов → просто подарок
  if (!qList) {
    element.classList.add("opened");
    element.style.backgroundColor = "#2ecc71"; // зелёный
    element.style.cursor = "default";
    saveAnswer(currentStudent, day, { info: "Jautājumu nav!" });
    alert(`🎁 Diena ${day}: šodien tikai dāvana!`);
    if (!studentData[day]) {
      addPoints(currentStudent, 5);
      logOpenToDB(currentStudent, currentDay, false, "", getPoints(currentStudent));
    }
    return;
  }

  // формируем модальное окно
  questionTitle.textContent = `Diena ${day}`;
  qList.forEach((q, index) => {
    const block = document.createElement("div");
    block.classList.add("question-block");
    const label = document.createElement("p");
    label.textContent = q.question;
    block.appendChild(label);

    if (q.type === "text") {
      const input = document.createElement("textarea");
      input.id = `answer_${index}`;
      input.placeholder = "Jūsu atbilde...";
      input.rows = 2;
      block.appendChild(input);
    } else if (q.type === "choice") {
      q.options.forEach((opt) => {
        const lbl = document.createElement("label");
        lbl.innerHTML = `<input type="radio" name="answer_${index}" value="${opt}"> ${opt}`;
        block.appendChild(lbl);
        block.appendChild(document.createElement("br"));
      });
    } else if (q.type === "info") {
      const info = document.createElement("p");
      info.textContent = q.content;
      block.appendChild(info);
      document.getElementById("submit-answer").textContent = "Labi!";
    }

    questionContainer.appendChild(block);
  });

  // показать окно
  modal.classList.remove("hidden");
}

// --- Отправка ответов ---
submitBtn.addEventListener("click", () => {
  submitBtn.classList.add("hidden");
  if (!currentDay || !currentStudent) return;

  const qList = questions[currentDay];
  const answers = {};

  qList.forEach((q, index) => {
    if (q.type === "text") {
      answers[q.question] =
        document.getElementById(`answer_${index}`).value.trim();
    } else if (q.type === "choice") {
      const selected = document.querySelector(
        `input[name="answer_${index}"]:checked`
      );
      answers[q.question] = selected ? selected.value : "";
    }
  });

// Загружаем данные до сохранения!
const studentData = JSON.parse(localStorage.getItem(`answers_${currentStudent}`)) || {};

// Сохраняем ответ
saveAnswer(currentStudent, currentDay, answers);

// Начисляем очки только при первом открытии
if (!studentData[currentDay]) {
  addPoints(currentStudent, 10);
}

  sendToGoogleSheet(currentStudent, currentDay, answers);

  feedback.textContent = "✅ Paldies! Tev ir piešķirti punkti 🎁";
  feedback.style.color = "green";

  // отмечаем день открытым
  const currentCell = Array.from(document.querySelectorAll(".day")).find(
    (d) => d.textContent == currentDay
  );
  if (currentCell) {
    currentCell.classList.add("opened");
    currentCell.style.backgroundColor = "#2ecc71"; // зелёный
    currentCell.style.cursor = "default";
    currentCell.replaceWith(currentCell.cloneNode(true)); // убирает все обработчики
  }


  // закрываем окно через 1.2с
  setTimeout(() => {
    modal.classList.add("hidden");
    questionContainer.innerHTML = "";
    feedback.textContent = "";
  }, 1);
});

// --- Закрытие модалки ---
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
  questionContainer.innerHTML = "";
  feedback.textContent = "";
});

// --- Сохранение ответов ---
function saveAnswer(student, day, answers) {
  const key = `answers_${student}`;
  const data = JSON.parse(localStorage.getItem(key)) || {};
  data[day] = answers;
  localStorage.setItem(key, JSON.stringify(data));
  logOpenToDB(currentStudent, currentDay, true, "", getPoints(currentStudent));
}

// --- Отправка данных в Google Sheets ---
function sendToGoogleSheet(student, day, answers) {
  const url = "https://script.google.com/macros/s/AKfycbxmMmOsXi9pcScNoFSUbDgmIy92GDHZO5sl_XpnjOYvdeZo4x_P7-gKYS50vh26zVJ8/exec";

  // Преобразуем объект ответов в массив
  const answersArray = Object.entries(answers).map(([question, answer]) => ({
    question,
    answer
  }));

  const payload = {
    student,
    day,
    answers: answersArray
  };

  fetch(url, {
    method: "POST",
    mode: "no-cors", // важно, чтобы браузер не блокировал запрос
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
  .then(() => console.log("Atbildes sekmīgi nosūtītas"))
  .catch(err => console.error("Augšupielādes kļūda:", err));
}

function getPoints(student) {
  return Number(localStorage.getItem(`points_${student}`)) || 0;
}

function addPoints(student, amount) {
  const current = getPoints(student);
  const updated = current + amount;
  localStorage.setItem(`points_${student}`, updated);
  updatePointsUI(student);
}

function updatePointsUI(student) {
  const pointsEl = document.getElementById("student-points");
  if (pointsEl) {
    pointsEl.textContent = `Tava punktu kaste: ${getPoints(student)}`;
  }
}

// --- Открытие/закрытие магазина ---
const storeBtn = document.getElementById("open-store");
const giftStore = document.getElementById("gift-store");
const giftFeedback = document.getElementById("gift-feedback");

storeBtn.addEventListener("click", () => {
  giftStore.classList.toggle("hidden");
});

let selectedGift = null;
let selectedGiftCost = 0;

document.querySelectorAll(".gift").forEach(gift => {
  gift.addEventListener("click", () => {
    const cost = Number(gift.dataset.cost);
    const giftName = gift.dataset.gift;
    const points = getPoints(currentStudent);

    if (points < cost) {
      giftFeedback.textContent = "❌ Nepietiek punktu!";
      giftFeedback.style.color = "red";
      return;
    }

    // сохраняем выбранный подарок
    selectedGift = giftName;
    selectedGiftCost = cost;

    // открываем окно для ввода почты
    document.getElementById("gift-modal").classList.remove("hidden");
  });
});

const giftModal = document.getElementById("gift-modal");
const closeGiftModal = document.getElementById("close-gift-modal");
const confirmGift = document.getElementById("confirm-gift");
const giftEmailInput = document.getElementById("gift-email");
const giftModalFeedback = document.getElementById("gift-modal-feedback");

// закрытие
closeGiftModal.addEventListener("click", () => {
  giftModal.classList.add("hidden");
  giftModalFeedback.textContent = "";
});

// генерация случайного кода
function generateGiftCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 10; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

confirmGift.addEventListener("click", () => {
  const email = giftEmailInput.value.trim();
  if (!email) {
    giftModalFeedback.textContent = "❌ Lūdzu ievadiet e-pastu!";
    giftModalFeedback.style.color = "red";
    return;
  }

  const giftCode = generateGiftCode();

  // создаём QR код (ссылку)
  const qrAPI = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${giftCode}`;

  // отправляем в Google Script
  sendGiftToEmail(currentStudent, email, selectedGift, selectedGiftCost, giftCode, qrAPI);

  // уменьшаем очки
  addPoints(currentStudent, -selectedGiftCost);

  // сохраняем покупку локально
  saveGift(currentStudent, selectedGift, giftCode);

  giftModalFeedback.textContent = "🎁 Dāvana nosūtīta uz e-pastu!";
  giftModalFeedback.style.color = "green";

  setTimeout(() => {
    giftModal.classList.add("hidden");
    giftEmailInput.value = "";
    giftModalFeedback.textContent = "";
  }, 1500);
});

function saveGift(student, giftName, code) {
  const key = `gifts_${student}`;
  const list = JSON.parse(localStorage.getItem(key)) || [];
  list.push({
    gift: giftName,
    code,
    date: new Date().toLocaleString("lv-LV")
  });
  localStorage.setItem(key, JSON.stringify(list));
}

function sendGiftToEmail(student, email, gift, cost, code, qrURL) {
  const url = "https://script.google.com/macros/s/AKfycbz8rihCssvjOpySamQ-INVCCpxSDt86a78_OOH6eR5bxI55yYXTtfjtrbXGwytv1JzFrA/exec"; // Заменить!!!

  const payload = {
    student,
    email,
    gift,
    cost,
    code,
    qrURL
  };

  fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

async function logOpenToDB(student, day, completed, email, points) {
    try {
        await fetch("https://script.google.com/macros/s/AKfycbzYXLA2fI3PHvrtpjLJ2_MygGj5UTpIiLT5KxbMDY9fLbZG5v-37y6lhgQdi58szPFZ/exec", {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                student,
                day,
                completed,
                email,
                points
            })
        });
    } catch (e) {
        console.log("Kļūda, sūtot datus uz DB:", e);
    }
}

const papildu = document.getElementById("papildu-davana");
let balaba = 3;

papildu.addEventListener("click", () => {
  const noReward = ["Eduards", "Ervīns", "Inese", "Markuss", "Mārtiņš", "Mihails", "Ralfs", "Teodors", "Valters"];
  const group25 = ["Arnolds", "Aurelija", "Bruno", "Elizabete", "Kārlis", "Sofija"];
  const group18 = ["Kristers", "Kristiāns"];
  const recovery = ["Madars"];

  const bonusTaken = JSON.parse(localStorage.getItem("lietas")) === balaba;

  if (bonusTaken) {
    alert("Jūs jau ieguvāt balvu!");
    papildu.classList.add("hidden");
    return;
  }

  if (noReward.includes(currentStudent)) {
    alert("Piedodiet, bet Jūs neizpildījāt dienas aktivitātes! Jums nav piešķirts apbalvojums!");
  } else if (group25.includes(currentStudent)) {
    addPoints(currentStudent, 25);
    logOpenToDB(currentStudent, currentDay, false, "", getPoints(currentStudent));
  } else if (group18.includes(currentStudent)) {
    addPoints(currentStudent, 18);
    logOpenToDB(currentStudent, currentDay, false, "", getPoints(currentStudent));
  } else if (recovery.includes(currentStudent)) {
    addPoints(currentStudent, 146);
    logOpenToDB(currentStudent, currentDay, false, "", getPoints(currentStudent));
  }

  localStorage.setItem("lietas", balaba);
  papildu.classList.add("hidden");
});