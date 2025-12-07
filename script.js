// ==== Практика 9. Задание 1 ====
function handleRegistrationQuestion() {
  const wantRegister = confirm("Желаете пройти регистрацию на сайте?");
  if (wantRegister) {
    alert("Отлично! Регистрация успешно выполнена (учебный пример).");
  } else {
    alert("Хорошо, вы можете продолжить как гость.");
  }
}

// ==== Практика 9. Задание 2 ====
function handleAdminLogin() {
  const login = prompt("Введите логин администратора:");
  if (login === null) return;

  const password = prompt("Введите пароль:");
  if (password === null) return;

  if (login === "admin" && password === "1234") {
    alert("Добро пожаловать, администратор!");
  } else {
    alert("Неверный логин или пароль.");
  }
}

// ==== Практика 10. Лайки вместо корзины ====

function Accumulator(startingValue) {
  this.value = startingValue;

  // Формальный метод из задания (можно вызвать из консоли)
  this.read = function () {
    const str = prompt("На сколько изменить счётчик?", "1");
    if (str === null) return;
    const num = Number(str);
    if (!Number.isNaN(num)) {
      this.value += num;
    } else {
      alert("Это не число");
    }
  };
}

// общий счётчик понравившихся фото
const likesAccumulator = new Accumulator(0);

document.addEventListener("DOMContentLoaded", function () {
  setupRegistrationButtons();
  setupRegisterModal();
  setupLikes();
});

// Подключаем кнопки из практики 9 (задание 1) и форму регистрации
function setupRegistrationButtons() {
  const regForm = document.getElementById("register-form");
  const regBtn = document.getElementById("btn-register");

  if (regForm) {
    regForm.addEventListener("submit", function (e) {
      e.preventDefault();
      handleRegistrationQuestion();
    });
  }

  if (regBtn) {
    regBtn.addEventListener("click", function (e) {
      e.preventDefault();
      handleRegistrationQuestion();
    });
  }

  // кнопка входа администратора убрана из интерфейса,
  // но сама функция handleAdminLogin оставлена для истории практики
}

function setupRegisterModal() {
  const modal = document.getElementById("register-modal");
  const toggleBtn = document.getElementById("register-toggle");

  if (!modal || !toggleBtn) return;

  const closeBtn = modal.querySelector(".register-modal-close");
  const backdrop = modal.querySelector(".register-modal-backdrop");

  function openModal() {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  }

  toggleBtn.addEventListener("click", openModal);

  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeModal);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });
}

// ==== Лайки у фотографий + окно избранного + выпадающее меню ====
function setupLikes() {
  // Блок под галереей на главной
  const likedSection = document.querySelector(".liked-section");
  let likedGrid = null;
  let likedEmpty = null;
  let likedCounter = null;

  if (likedSection) {
    likedGrid = likedSection.querySelector(".liked-grid");
    likedEmpty = likedSection.querySelector(".liked-empty");
    likedCounter = likedSection.querySelector(".liked-counter");
  }

  // Меню-уведомление (верхний значок с сердечком)
  const likedPanel = document.querySelector(".liked-panel");
  let likedPanelList = null;
  let likedPanelEmpty = null;
  const likedToggle = document.getElementById("liked-toggle");
  const likedBadge = document.getElementById("liked-count-badge");

  if (likedPanel) {
    likedPanelList = likedPanel.querySelector(".liked-panel-list");
    likedPanelEmpty = likedPanel.querySelector(".liked-panel-empty");
  }

  // запоминаем понравившиеся фото
  const likedMap = new Map(); // ключ = src, значение = { alt }

  function scrollToLikedPhoto(src) {
    // Работает только на странице галереи, где есть .photo-grid
    const grid = document.querySelector(".photo-grid");
    if (!grid) return;
    const img = grid.querySelector('img[src="' + src + '"]');
    if (!img) return;
    const item = img.closest(".photo-item") || img.closest("figure");
    if (!item) return;
    item.scrollIntoView({ behavior: "smooth", block: "center" });
    item.classList.add("photo-item--highlight");
    setTimeout(function () {
      item.classList.remove("photo-item--highlight");
    }, 900);
  }

  function updateLikedUI() {
    const count = likedMap.size;

    // --- блок под галереей ---
    if (likedSection) {
      if (likedCounter) {
        likedCounter.textContent = "Отмечено: " + count + " фото";
      }

      if (likedEmpty) {
        likedEmpty.style.display = count === 0 ? "block" : "none";
      }

      if (likedGrid) {
        likedGrid.innerHTML = "";
        likedMap.forEach(function (info, src) {
          const thumb = document.createElement("div");
          thumb.className = "liked-thumb";

          const img = document.createElement("img");
          img.src = src;
          img.alt = info.alt || "Понравившееся фото";

          thumb.appendChild(img);
          likedGrid.appendChild(thumb);
        });
      }
    }

    // --- выпадающее меню избранного ---
    if (likedPanel && likedPanelList && likedPanelEmpty) {
      likedPanelList.innerHTML = "";
      if (count === 0) {
        likedPanelEmpty.style.display = "block";
      } else {
        likedPanelEmpty.style.display = "none";
        likedMap.forEach(function (info, src) {
          const item = document.createElement("button");
          item.type = "button";
          item.className = "liked-panel-item";

          const imgEl = document.createElement("img");
          imgEl.src = src;
          imgEl.alt = info.alt || "Понравившееся фото";

          const caption = document.createElement("span");
          caption.className = "liked-panel-caption";
          caption.textContent = info.alt || "Фото из галереи";

          item.appendChild(imgEl);
          item.appendChild(caption);

          item.addEventListener("click", function () {
            // Переход к оригинальному фото только на странице галереи
            const galleryRoot = document.querySelector(".photo-grid");
            if (!galleryRoot) return;

            const targetImg = galleryRoot.querySelector('img[src="' + src + '"]');
            if (!targetImg) return;

            const targetFigure = targetImg.closest(".photo-item") || targetImg;
            targetFigure.scrollIntoView({ behavior: "smooth", block: "center" });

            targetFigure.classList.add("photo-item--highlight");
            setTimeout(function () {
              targetFigure.classList.remove("photo-item--highlight");
            }, 900);
          });

          likedPanelList.appendChild(item);
        });
      }
    }

    // --- значок в шапке ---
    if (likedBadge) {
      likedBadge.textContent = count;
      if (count === 0) {
        likedBadge.classList.add("is-empty");
      } else {
        likedBadge.classList.remove("is-empty");
      }
    }

    // для наглядности выведем текущее значение Accumulator в консоль
    console.log("Всего лайков (Accumulator.value):", likesAccumulator.value);
  }

  function toggleLike(img, button) {
    const src = img.currentSrc || img.src;
    const alt = img.alt || "";
    const isLiked = !button.classList.contains("liked");

    if (isLiked) {
      button.classList.add("liked");
      const textSpan = button.querySelector(".text");
      if (textSpan) textSpan.textContent = "В избранном";

      likedMap.set(src, { alt: alt });
      likesAccumulator.value += 1;
    } else {
      button.classList.remove("liked");
      const textSpan = button.querySelector(".text");
      if (textSpan) textSpan.textContent = "Нравится";

      likedMap.delete(src);
      likesAccumulator.value = Math.max(0, likesAccumulator.value - 1);
    }

    updateLikedUI();
  }

  function attachButtonToImage(img) {
    const container =
      img.closest(".photo-item") ||
      img.closest(".gallery-item") ||
      img.parentElement;

    if (!container) return;

    // если кнопка уже есть — ничего не делаем
    if (container.querySelector(".like-btn")) return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "like-btn";
    btn.innerHTML = '<span class="heart">♥</span><span class="text">Нравится</span>';

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleLike(img, btn);
    });

    container.appendChild(btn);
  }

  // Галерея на главной
  document.querySelectorAll(".photo-grid img").forEach(function (img) {
    attachButtonToImage(img);
  });
// Обработчики для меню-уведомления
  if (likedToggle && likedPanel) {
    likedToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      const isOpen = likedPanel.classList.toggle("open");
      likedPanel.setAttribute("aria-hidden", isOpen ? "false" : "true");
    });

    // Закрытие по крестику
    const closeBtn = likedPanel.querySelector(".liked-panel-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        likedPanel.classList.remove("open");
        likedPanel.setAttribute("aria-hidden", "true");
      });
    }

    // Закрытие по клику вне панели
    document.addEventListener("click", function (e) {
      if (!likedPanel.classList.contains("open")) return;

      const target = e.target;
      const clickedToggle = likedToggle.contains(target);
      const clickedPanel = likedPanel.contains(target);

      if (!clickedToggle && !clickedPanel) {
        likedPanel.classList.remove("open");
        likedPanel.setAttribute("aria-hidden", "true");
      }
    });
  }

  updateLikedUI();
}
