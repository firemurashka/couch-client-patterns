// Функция для загрузки JSON-данных
async function loadPatterns() {
  try {
    // Загружаем json-файл
    const response = await fetch("./patterns_data.json");
    const data = await response.json();

    // Отображаем данные
    renderPatterns(data);

    // Запускаем анимацию после отрисовки данных
    animateOnScroll();

    // Выводим тестовые паттерны
    renderTestPatterns(data);
  } catch (error) {
    console.error("Ошибка при загрузке JSON:", error);
  }
}

// Функция отрисовки паттернов
function renderPatterns(data) {
  const patternsGroup = document.getElementById("patterns-group");
  const categories = data.categories; // Получаем категории из JSON
  let categoryIndex = 1; // Счётчик для уникального класса категории

  // Обрабатываем каждую категорию
  for (const category of categories) {
    // Создаем обертку для категории
    const categoryWrapper = document.createElement("div");
    categoryWrapper.classList.add("client-patterns__category");

    // Добавляем уникальный класс
    const uniqueCategoryClass = `client-patterns__category_${String(categoryIndex).padStart(2, "0")}`;
    categoryWrapper.classList.add(uniqueCategoryClass);

    // Заголовок категории
    const categoryTitle = document.createElement("h2");
    categoryTitle.classList.add("client-patterns__title");
    categoryTitle.textContent = category.title.ru; // Используем русский заголовок
    categoryWrapper.appendChild(categoryTitle);

    const patternsBlock = document.createElement("div");

    // Складываем уникальный класс-категории на основе id категории
    const categoryClass = `patterns-${category.id}`;
    patternsBlock.classList.add("client-patterns__block", categoryClass);

    // Обрабатываем каждую подкатегорию в категории
    category.subcategories.forEach((subcategory) => {
      // Подсчитываем общее количество упоминаний для паттернов в данной подкатегории
      const totalMentions = subcategory.patterns.reduce((sum, pattern) => sum + pattern.mentions, 0);

      // Проверяем, есть ли хотя бы один ненулевой процент среди паттернов подкатегории
      const hasVisiblePatterns = subcategory.patterns.filter((pattern) => pattern.mentions > 0).length;

      // Если хотя бы один паттерн имеет значение больше 0, создаем группу
      if (hasVisiblePatterns > 0) {
        // Создаем контейнер для группы паттернов
        const patternGroupContainer = document.createElement("div");
        patternGroupContainer.classList.add("client-patterns__pattern-group");

        // Добавляем заголовок группы паттернов только один раз
        const groupLabel = document.createElement("h3");
        groupLabel.classList.add("client-patterns__label");
        groupLabel.textContent = subcategory.title.ru; // Используем русский заголовок подкатегории
        patternGroupContainer.appendChild(groupLabel);

        // Проходим по каждому паттерну в подкатегории
        subcategory.patterns.forEach((pattern) => {
          // Создаем элемент для паттерна
          const patternItem = document.createElement("div");
          patternItem.classList.add("client-patterns__item");

          const mentions = pattern.mentions;
          let computedPercentage = 0;

          // Вычисляем процент упоминаний для каждого паттерна
          if (totalMentions > 0) {
            computedPercentage = Math.round((mentions / totalMentions) * 100); // Округляем до целого
          }

          // Основной заголовок с вычисленным процентом
          const barTitle = document.createElement("div");
          barTitle.classList.add("client-patterns__bar-title");
          barTitle.innerHTML = `${pattern.pattern.ru} <span>${computedPercentage}%</span>`;
          patternItem.appendChild(barTitle);

          // Создаем прогресс-бар
          const progressContainer = document.createElement("div");
          progressContainer.classList.add("client-patterns__progress");

          const progressBar = document.createElement("div");
          progressBar.classList.add("client-patterns__progress-bar");
          progressBar.style.width = `${computedPercentage}%`;

          progressContainer.appendChild(progressBar);
          patternItem.appendChild(progressContainer);

          // Добавляем элемент паттерна в контейнер группы
          patternGroupContainer.appendChild(patternItem);
        });

        // Добавляем группу паттернов в блок паттернов
        patternsBlock.appendChild(patternGroupContainer);
      }
    });

    // Добавляем блок паттернов в обертку категории, только если он не пуст
    if (patternsBlock.children.length > 0) {
      categoryWrapper.appendChild(patternsBlock);
      patternsGroup.appendChild(categoryWrapper);
    }

    categoryIndex++; // Увеличиваем счётчик для следующей категории
  }
}

// Функция для анимации при прокрутке
function animateOnScroll() {
  // Находим все элементы для анимации
  const animBlocks = document.querySelectorAll(".client-patterns__title, .client-patterns__block");

  // Проверяем, найдены ли элементы на странице
  if (animBlocks.length === 0) {
    console.warn("No elements found to animate!");
    return;
  }

  // Опции для наблюдателя
  const observerOptions = {
    root: null, // Наблюдение в пределах viewport (области просмотра)
    rootMargin: "0px", // Без отступов
    threshold: 0.2, // Запустить при 40% видимости элемента
  };

  // Функция срабатывания для отдельных элементов
  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Добавляем класс, чтобы запускать анимацию
        entry.target.classList.add("_anim-active");
        // Убираем элемент из наблюдения
        observer.unobserve(entry.target);
      }
    });
  };

  // Создаем наблюдатель
  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Отслеживаем каждый блок
  animBlocks.forEach((block) => observer.observe(block));
}

// Запуск загрузки данных и показывание загрузки
setTimeout(() => {
  loadPatterns(); // Загрузка паттернов
  const loadingIndicator = document.querySelector(".loading-indicator");
  if (loadingIndicator) {
    loadingIndicator.remove(); // Удаляем индикатор загрузки после загрузки
  }
}, 500); // Задержка в 500 миллисекунд

// Функция для тестового вывода паттернов
function renderTestPatterns(data) {
  const testOutputContainer = document.getElementById("test-output"); // Контейнер для вывода тестовых данных

  // Очищаем контейнер перед выводом
  testOutputContainer.innerHTML = "";

  const categories = data.categories; // Получаем категории из JSON

  // Обрабатываем каждую категорию
  categories.forEach((category) => {
    // Заголовок категории
    const categoryElement = document.createElement("div");
    const categoryTitle = document.createElement("h3");
    categoryTitle.textContent = `${category.title.ru}`;
    categoryElement.appendChild(categoryTitle);

    // Создаем таблицу для отображения паттернов
    const table = document.createElement("table");
    const tableHeader = document.createElement("thead");
    const headerRow = document.createElement("tr");

    // Заголовки таблицы
    const patternHeader = document.createElement("th");
    patternHeader.textContent = "Паттерн";
    headerRow.appendChild(patternHeader);

    const mentionsHeader = document.createElement("th");
    mentionsHeader.textContent = "Упоминания";
    headerRow.appendChild(mentionsHeader);

    const percentageHeader = document.createElement("th");
    percentageHeader.textContent = "Процент";
    headerRow.appendChild(percentageHeader);

    tableHeader.appendChild(headerRow);
    table.appendChild(tableHeader);

    const tableBody = document.createElement("tbody");

    // Обрабатываем подкатегории
    category.subcategories.forEach((subcategory) => {
      // Создаем подзаголовок для подкатегории
      const subcategoryRow = document.createElement("tr");
      const subcategoryTitleCell = document.createElement("td");
      subcategoryTitleCell.colSpan = 3; // Занять все три колонки
      subcategoryTitleCell.textContent = subcategory.title.ru; // Заголовок подкатегории
      subcategoryTitleCell.className = 'subcategory';

      subcategoryRow.appendChild(subcategoryTitleCell);
      tableBody.appendChild(subcategoryRow);

      // Подсчитываем общее количество упоминаний для паттернов в данной подкатегории
      const totalMentions = subcategory.patterns.reduce((sum, p) => sum + p.mentions, 0);

      // Паттерны в подкатегории
      subcategory.patterns.forEach((pattern) => {
        const row = document.createElement("tr");

        // Паттерн
        const patternCell = document.createElement("td");
        patternCell.textContent = pattern.pattern.ru; // Отображаем паттерн
        row.appendChild(patternCell);

        // Упоминания
        const mentionsCell = document.createElement("td");
        mentionsCell.textContent = pattern.mentions; // Отображаем количество упоминаний
        row.appendChild(mentionsCell);

        // Процент
        const percentageCell = document.createElement("td");
        percentageCell.textContent = totalMentions > 0 ? `${Math.round((pattern.mentions / totalMentions) * 100)}%` : "0%"; // Проверка на деление на 0
        row.appendChild(percentageCell);

        // Добавляем строку в тело таблицы
        tableBody.appendChild(row);
      });
    });

    // Добавляем тело таблицы в таблицу
    table.appendChild(tableBody);

    // Добавляем таблицу в элемент категории
    categoryElement.appendChild(table);

    // Добавляем категорию в контейнер вывода
    testOutputContainer.appendChild(categoryElement);
  });
}
