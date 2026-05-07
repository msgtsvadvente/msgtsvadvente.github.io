const examData = {
    "Algebra": [
        { img: "img/alg1.png", sub: ["1.1.", "1.2."] }, // 2 подвопроса
        { img: "img/alg2.png", sub: ["2.1.", "2.2.", "2.3.", "2.4."] }, // 4 подвопроса
        { img: "img/alg3.png", sub: ["3.1.", "3.2.", "3.3.", "3.4."] }, // 4 подвопроса
        { img: "img/alg4.png" }, // Стандарт
        { img: "img/alg5.png" }, // Стандарт
        { img: "img/alg6.png" }, // Стандарт
        { img: "img/alg7.png", type: "large" }, // Большое поле
        { img: "img/alg8.png" }, // Стандарт
        { img: "img/alg9.png" }, // Стандарт
        { img: "img/alg10.png", type: "large" }, // Большое поле
        { img: "img/alg11.png" }, // Стандарт
        { img: "img/alg12.png", type: "large" } // Большое поле
    ],
    "Geometry": [
        { img: "img/geo1.png" },
        { img: "img/geo2.png", sub: ["20.1.", "20.2.", "20.3. (nodot klātienē)"] },
        { img: "img/geo3.png", sub: ["21.1.", "21.2."], type: "large" },
        { img: "img/geo4.png" }
    ],
    "AnaliticalGeometry": [
        { img: "img/ana1.png", sub: ["13.1.", "13.2.", "13.3. (nodot klātienē)"] },
        { img: "img/ana2.png", sub: ["14.1.", "14.2.", "14.3."] },
        { img: "img/ana3.png" },
        { img: "img/ana4.png" },
        { img: "img/ana5.png", type: "large" },
        { img: "img/ana6.png", sub: ["18.1.", "18.2."] },
    ],
    "Combinatorics": [
        { img: "img/comb1.png", sub: ["28.1.", "28.2."] },
        { img: "img/comb2.png" },
        { img: "img/comb3.png" },
        { img: "img/comb4.png" },
        { img: "img/comb5.png", sub: ["32.1.", "32.2."], type: "large" },
        { img: "img/comb6.png", sub: ["33.1.", "33.2. (nodot klātienē)"] }
    ],
    "Trigonometry": [
        { img: "img/trig1.png" },
        { img: "img/trig2.png" },
        { img: "img/trig3.png" },
        { img: "img/trig4.png", sub: ["24.1.", "24.2.", "24.3. (nodot klātienē)"] },
        { img: "img/trig5.png", type: "large" }
    ],
    "SecondPart": [
        { img: "img/second1.png", type: "large" },
        { img: "img/second2.png", type: "large" },
        { img: "img/second3.png", sub: ["3.1.", "3.2."], type: "large" },
        { img: "img/second4.png", type: "large" },
        { img: "img/second5.png", type: "large" },
        { img: "img/second6.png", sub: ["6.1.", "6.2."], type: "large" }
    ]
};

let currentQuestions = [];
let currentIndex = 0;
let userAnswers = {};
let examStarted = false;
let isTransitioning = false;
const events = [];

// Элементы
const elements = {
    subjectSelection: document.getElementById("subjectSelection"),
    quizInterface: document.getElementById("quizInterface"),
    taskImage: document.getElementById("taskImage"),
    answerInput: document.getElementById("answerInput"),
    taskProgress: document.getElementById("taskProgress"),
    statusBox: document.getElementById("statusBox"),
    eventList: document.getElementById("eventList"),
    violationModal: document.getElementById("violationModal"),
    violationText: document.getElementById("violationText"),
    reasonInput: document.getElementById("reasonInput"),
    submitReasonBtn: document.getElementById("submitReasonBtn"),
    prevBtn: document.getElementById("prevBtn"),
    nextBtn: document.getElementById("nextBtn"),
    finishExamBtn: document.getElementById("finishExamBtn"),
    currentSubjectTitle: document.getElementById("currentSubjectTitle")
};

// =========================
// ЛОГИКА ТЕСТА
// =========================

async function startExam(subject) {
    if (!examData[subject]) return;

    isTransitioning = true;
    examStarted = true;
    currentQuestions = [
        { type: "name_field", title: "Ievadiet savu vārdu un uzvārdu" }, 
        ...examData[subject]
    ];
    currentIndex = 0;
    userAnswers = {};

    elements.subjectSelection.style.display = "none";
    elements.quizInterface.style.display = "block";
    elements.currentSubjectTitle.textContent = subject;

    updateStatus();
    renderTask();
    bindProtection();
    
    await enableFullscreen();
    addEvent("exam_started", `Sākts: ${subject}`);

    setTimeout(() => { isTransitioning = false; }, 1500);
}

function renderTask() {
    const task = currentQuestions[currentIndex];
    const container = document.getElementById("answerContainer");
    
    // 1. Очищаем старые поля
    container.innerHTML = "";
    elements.taskImage.src = task.img;
    elements.taskProgress.textContent = `Uzdevums ${currentIndex + 1} no ${currentQuestions.length}`;

    // Получаем сохраненные ответы для этого вопроса (если есть)
    const saved = userAnswers[currentIndex] || {};

    if (task.type === "name_field") {
        elements.taskImage.style.display = "none"; // Скрываем блок картинки
        
        const wrapper = document.createElement("div");
        wrapper.style.textAlign = "center";
        wrapper.innerHTML = `
            <h2 style="margin-bottom: 20px;">Tavs vārds un uzvārds:</h2>
            <input type="text" class="quiz-input" data-idx="0" 
                   placeholder="Vārds Uzvārds"
                   value="${saved[0] || ''}" 
                   style="width: 100%; padding: 15px; font-size: 1.2rem; border: 2px solid #3498db; border-radius: 8px;">
        `;
        container.appendChild(wrapper);
    } 
    // ИНАЧЕ: Обычная логика заданий (алгебра/геометрия)
    else {
        elements.taskImage.style.display = "block";
        elements.taskImage.src = task.img;
   // 2. Логика создания полей
        if (task.sub) {
            // Если есть подвопросы (1.1, 1.2 и т.д.)
            task.sub.forEach((label, index) => {
                const wrapper = document.createElement("div");
                wrapper.style.marginBottom = "20px"; // Увеличили отступ для красоты
                
                let inputHtml = "";
                
                if (task.type === "large") {
                    // Если подвопросы должны быть большими текстовыми полями
                    inputHtml = `
                        <textarea class="quiz-input" data-idx="${index}" 
                            placeholder="Ierakstiet plašu atbildi..."
                            style="width: 100%; height: 120px; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit; margin-top: 5px;"
                        >${saved[index] || ''}</textarea>`;
                } else {
                    // Стандартные поля для подвопросов
                    inputHtml = `
                        <input type="text" class="quiz-input" data-idx="${index}" 
                            value="${saved[index] || ''}" 
                            style="width: 70%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">`;
                }

                wrapper.innerHTML = `
                    <label style="font-weight: bold; display: block; margin-bottom: 5px;">${label}</label>
                    ${inputHtml}
                `;
                container.appendChild(wrapper);
            });
        } else {
            // Если подвопросов нет, но вопрос один
            const wrapper = document.createElement("div");
            if (task.type === "large") {
                const textarea = document.createElement("textarea");
                textarea.className = "quiz-input";
                textarea.dataset.idx = "0"; // Добавляем индекс для корректного сохранения
                textarea.placeholder = "Ierakstiet plašu atbildi...";
                textarea.value = saved[0] || "";
                textarea.style.cssText = "width: 100%; height: 150px; padding: 10px; border: 1px solid #ccc; border-radius: 4px; font-family: inherit;";
                wrapper.appendChild(textarea);
            } else {
                const input = document.createElement("input");
                input.type = "text";
                input.className = "quiz-input";
                input.dataset.idx = "0"; // Добавляем индекс для корректного сохранения
                input.placeholder = "Ierakstiet atbildi...";
                input.value = saved[0] || "";
                input.style.cssText = "width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;";
                wrapper.appendChild(input);
            }
            container.appendChild(wrapper);
        }
    }
    // 3. Обновляем кнопки
    elements.prevBtn.disabled = (currentIndex === 0);
    elements.nextBtn.textContent = (currentIndex === currentQuestions.length - 1) ? "Pārskatīt" : "Uz priekšu";
}

// Слушатели кнопок
document.getElementById("btnAlgebra").onclick = () => startExam("Algebra");
document.getElementById("btnGeometry").onclick = () => startExam("Geometry");
document.getElementById("btnAnaliticalGeometry").onclick = () => startExam("AnaliticalGeometry");
document.getElementById("btnTrigonometry").onclick = () => startExam("Trigonometry");
document.getElementById("btnCombinatorics").onclick = () => startExam("Combinatorics");
document.getElementById("btnSecondPart").onclick = () => startExam("SecondPart");

elements.nextBtn.onclick = () => {
    saveCurrentAnswers(); // Сохраняем все поля текущего вопроса
    if (currentIndex < currentQuestions.length - 1) {
        currentIndex++;
        renderTask();
    } else {
        alert("Jūs esat sasnieguši beigas! Pārbaudiet atbildes.");
    }
};

elements.prevBtn.onclick = () => {
    saveCurrentAnswers(); // Сохраняем перед уходом назад
    if (currentIndex > 0) {
        currentIndex--;
        renderTask();
    }
};

elements.finishExamBtn.onclick = () => {
    if (confirm("Vai tiešām vēlaties pabeigt?")) {
        examStarted = false;
        updateStatus();
        if (document.fullscreenElement) document.exitFullscreen();
        elements.quizInterface.style.display = "none";
        elements.subjectSelection.style.display = "block";
        addEvent("exam_finished", "Darbs pabeigts");
    }
};

// =========================
// ЗАЩИТА И МОДАЛКА
// =========================

// =========================
// ЗАЩИТА И МОДАЛКА
// =========================

let tabHiddenStartTime = null; // Время ухода с вкладки

function bindProtection() {
    window.onblur = () => registerViolation("window_blur", "Zaudēts fokuss!");
    
    document.onfullscreenchange = () => {
        if (!document.fullscreenElement && examStarted && !isTransitioning) {
            registerViolation("fullscreen_exit", "Iziet no pilnekrāna!");
        }
    };

    document.onvisibilitychange = () => {
        if (document.hidden && examStarted && !isTransitioning) {
            tabHiddenStartTime = Date.now();
            registerViolation("tab_hidden", "Pamesta cilne!");
        } else {
            if (tabHiddenStartTime) {
                const hiddenDuration = Math.round((Date.now() - tabHiddenStartTime) / 1000);
                addEvent("tab_returned", `Atgriezās cilnē pēc ${hiddenDuration} sekundēm`);
                tabHiddenStartTime = null;
            }
        }
    };

    // --- ВОССТАНОВЛЕННЫЙ БЛОК БЛОКИРОВКИ ---
    
    // Блокировка контекстного меню (правой кнопки мыши)
    document.oncontextmenu = (e) => {
        if (examStarted) e.preventDefault();
    };

    // Блокировка Copy/Paste через события
    document.oncopy = document.onpaste = document.oncut = (e) => {
        if (examStarted) {
            e.preventDefault();
            addEvent("blocked_action", `${e.type} bloķēts`);
        }
    };

    // Блокировка горячих клавиш
    document.onkeydown = handleKeydown;
}

// Вспомогательная функция для обработки клавиш
function handleKeydown(e) {
    if (!examStarted) return;

    const key = e.key.toLowerCase();
    const ctrl = e.ctrlKey || e.metaKey; // metaKey для пользователей Mac

    // Ctrl+C, Ctrl+V, Ctrl+U (исходный код), Ctrl+S, Ctrl+P
    if (ctrl && ['c', 'v', 'u', 's', 'p', 'x'].includes(key)) {
        e.preventDefault();
        addEvent("blocked_hotkey", `Hotkey Ctrl+${key.toUpperCase()} bloķēts`);
        return false;
    }

    // Блокировка F12
    if (e.key === "F12") {
        e.preventDefault();
        addEvent("blocked_hotkey", "F12 bloķēts");
        return false;
    }
}

function registerViolation(type, text) {
    if (!examStarted || isTransitioning) return;
    addEvent(type, text);
    elements.violationText.textContent = text;
    elements.violationModal.classList.add("active");
}

elements.submitReasonBtn.onclick = async () => {
    const reason = elements.reasonInput.value.trim();
    if (!reason) return alert("Ierakstiet iemeslu!");

    addEvent("student_reason", reason);
    elements.violationModal.classList.remove("active");
    elements.reasonInput.value = "";

    isTransitioning = true;
    await enableFullscreen();
    setTimeout(() => { isTransitioning = false; }, 1500);
};

// Вспомогательные функции
async function enableFullscreen() {
    try {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
        }
    } catch (e) {}
}

let examLogs = [];

function addEvent(type, message) {
    const timestamp = new Date().toISOString();

    examLogs.push({ type, message, timestamp });

    const div = document.createElement("div");
    div.className = "event-item";
    div.innerHTML = `<strong>${type}</strong>: ${message} <br><small>${timestamp}</small>`;
    if (elements.eventList) {
        elements.eventList.prepend(div);
    }
}

function updateStatus() {
    elements.statusBox.textContent = examStarted ? "Focus mode: ON" : "Focus mode: OFF";
    elements.statusBox.className = examStarted ? "status active" : "status";
}

function saveCurrentAnswers() {
    const container = document.getElementById("answerContainer");
    const inputs = container.querySelectorAll("input, textarea");
    
    // Создаем объект для хранения ответов этого вопроса
    userAnswers[currentIndex] = {};
    
    inputs.forEach((input, index) => {
        // Берем индекс из data-idx, если он есть, иначе просто порядковый номер
        const idx = input.dataset.idx || index;
        userAnswers[currentIndex][idx] = input.value;
    });
}

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyOOB2wbe1uyKJWOyiOp3lRRcohDjVd4ZG_sk2RVQKfIP0Csh01vsMqiojX13ESdZg/exec";

async function sendDataToGoogleSheets() {

    const studentName = userAnswers[0] && userAnswers[0][0] ? userAnswers[0][0] : "Nezināms";
    
    // Собираем данные
    const report = {
        student: studentName,
        subject: elements.currentSubjectTitle.textContent,
        answers: userAnswers,
        log: examLogs
    };

    try {
        // Отправляем данные методом POST
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors", // Важно для работы с Google Script со статики
            cache: "no-cache",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(report)
        });

        console.log("Данные отправлены!");
        alert("Darbs veiksmīgi iesniegts!");
        
    } catch (error) {
        console.error("Ошибка отправки:", error);
        alert("Kļūda nosūtot datus. Lūdzu, lejupielādējiet atskaiti manuāli.");
        downloadReport(); // Резервная функция скачивания файла
    }
}

// Обновляем обработчик кнопки завершения
elements.finishExamBtn.onclick = async () => {
    if (confirm("Vai tiešām vēlaties pabeigt un iesniegt darbu?")) {
        examStarted = false;
        updateStatus();
        
        // Показываем индикатор загрузки, если нужно
        elements.finishExamBtn.disabled = true;
        elements.finishExamBtn.textContent = "Sūta datus...";
        
        await sendDataToGoogleSheets();
        
        if (document.fullscreenElement) document.exitFullscreen();
        elements.quizInterface.style.display = "none";
        elements.subjectSelection.style.display = "block";
        elements.finishExamBtn.disabled = false;
        elements.finishExamBtn.textContent = "Beigt darbu";
    }
};


