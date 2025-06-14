/* ========= Константы правильных данных ========= */
const CORRECT_EMAIL = "student@example.com";
const CORRECT_PASSWORD = "Passw0rd!";

/* ========= DOM-элементы ========= */
const form = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");
const rememberCheckbox = document.getElementById("remember");
const messageBox = document.getElementById("message");
const submitBtn = document.getElementById("submit-btn");

/* ========= Инициализация сохранённых данных ========= */
(() => {
  const savedEmail = localStorage.getItem("savedEmail");
  if (savedEmail) {
    emailInput.value = savedEmail;
    rememberCheckbox.checked = true;
  }
})();

/* ========= Валидация формы ========= */
function validateForm() {
  let valid = true;
  messageBox.textContent = "";
  emailInput.removeAttribute("data-error");
  passInput.removeAttribute("data-error");

  if (!emailInput.checkValidity()) {
    emailInput.setAttribute("data-error", "true");
    valid = false;
  }

  if (passInput.value.length < 8) {
    passInput.setAttribute("data-error", "true");
    valid = false;
  }
  return valid;
}

/* ========= Обработчик отправки формы ========= */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validateForm()) {
    showMessage("Проверьте правильность введённых данных", "error");
    return;
  }

  // имитация загрузки
  toggleLoading(true);

  setTimeout(() => {
    const email = emailInput.value.trim();
    const password = passInput.value;

    if (email === CORRECT_EMAIL && password === CORRECT_PASSWORD) {
      showMessage("Успешный вход!", "success");
      if (rememberCheckbox.checked) {
        localStorage.setItem("savedEmail", email);
      } else {
        localStorage.removeItem("savedEmail");
      }
    } else {
      showMessage("Неверная почта или пароль", "error");
      passInput.value = "";
    }
    toggleLoading(false);
  }, 1200); // задержка для демонстрации эффекта
});

/* ========= Условный вывод сообщений ========= */
const showMessage = (msg, type = "info") => {
  messageBox.className = `message ${type}`;
  messageBox.textContent = msg;
};

/* ========= Переключаем кнопку в состояние загрузки ========= */
const toggleLoading = (isLoading) => {
  submitBtn.classList.toggle("loading", isLoading);
  submitBtn.disabled = isLoading;
};

/* ========= Снежинки / конфетти ========= */
const createSnowflake = () => {
  const snowflake = document.createElement("span");
  snowflake.className = "snowflake";
  snowflake.textContent = "❄";
  snowflake.style.left = Math.random() * 100 + "vw";
  snowflake.style.animationDuration = 5 + Math.random() * 5 + "s";
  snowflake.style.opacity = Math.random();
  document.body.appendChild(snowflake);
  setTimeout(() => snowflake.remove(), 10000);
};

// каждые 300мс добавляем снежинку, если вкладка активна
setInterval(() => {
  if (document.hasFocus()) createSnowflake();
}, 300);

/* ========= Пасхалка ========= */
function createConfettiPiece() {
  const piece = document.createElement("span");
  piece.className = "snowflake"; // переиспользуем стили снежинки
  piece.textContent = "🎉";
  piece.style.left = Math.random() * 100 + "vw";
  piece.style.animationDuration = 3 + Math.random() * 3 + "s";
  piece.style.fontSize = "1.2rem";
  document.body.appendChild(piece);
  setTimeout(() => piece.remove(), 8000);
}

document.querySelector(".logo").addEventListener("click", () => {
  for (let i = 0; i < 30; i++) {
    createConfettiPiece();
  }
});

/* ========= Демонстрация стрелочной функции ========= */
emailInput.addEventListener("input", () => {
  messageBox.textContent = "";
}); 