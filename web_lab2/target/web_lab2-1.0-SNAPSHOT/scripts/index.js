let statusOfValidation = '';

function validateX() {
  const checkboxes = document.querySelectorAll('input[name="x"]:checked');
  const allowedValues = ["-2", "-1.5", "-1", "-0.5", "0", "0.5", "1", "1.5", "2"];

    // Получаем массив выбранных значений
    const selectedValues = Array.from(checkboxes).map(checkbox => checkbox.value);
    // Проверяем, входят ли все выбранные значения в допустимые
    const isValid = selectedValues.every(value => allowedValues.includes(value));

  if (!isValid) {
    statusOfValidation = 'Выбраны неверные данные по какой то причине, возможно изменен исходный документ. Значение должны быть в ["-2", "-1.5", "-1", "-0.5", "0", "0.5", "1", "1.5", "2"]'
    return false;
  }
  if (checkboxes.length < 1) {
    statusOfValidation = 'Пожалуйста, выберите хотя бы одно значение X из предложенных вариантов'
    return false;
  }
  else {
    return true;
  }
}

function validateY() {
    let y = getY();

    if (y === '') {
        statusOfValidation = 'Введите значение Y (число с плавающей точкой, без пробелов)';
        return false;
    }

    const yNum = parseFloat(y);
    if (!isNaN(yNum)) {
        if (yNum > -5 && yNum < 5) {
            return true;
        } else {
            statusOfValidation = 'Y должно быть в диапазоне (-5, 5)';
            return false;
        }
    } else {
        statusOfValidation = 'Y должно быть числом с плавающей точкой!';
        return false;
    }
}

function validateR() {
  let r = getR();

  if (r === '') {
      statusOfValidation = 'Введите значение R (число с плавающей точкой, без пробелов)';
      return false;
  }

  const rNum = parseFloat(r);
  if (!isNaN(rNum)) {
      if (rNum > 2 && rNum < 5) {
          return true;
      } else {
          statusOfValidation = 'R должно быть в диапазоне (2, 5)';
          return false;
      }
  } else {
      statusOfValidation = 'R должно быть числом с плавающей точкой!';
      return false;
  }
}

// Общая валидация
function validateAll() {
    return validateX() && validateY() && validateR();
}

// Получение значений
function getX() {
    const checkboxes = document.querySelectorAll('input[name="x"]');
    const selectedValues = [];

    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            selectedValues.push(checkbox.value); // Добавляем выбранное значение в массив
        }
    });

    return selectedValues; // Возвращаем массив выбранных значений
}


function getY() {
    return document.getElementById('y-coord-input').value.trim().replace(',', '.');
}

function getR() {
    return document.getElementById('r-coord-input').value.trim().replace(',', '.');
}

// Элемент для отображения сообщений валидации
const validationMessage = document.querySelector('.js-validation-message');

// Обработка отправки формы
document.getElementById('js-submit-button').addEventListener('click', function (event) {
    event.preventDefault();

    if (validateAll()) {
        statusOfValidation = 'Валидация пройдена успешно';
        validationMessage.classList.add('validation-successed');
        validationMessage.classList.remove('validation-failed');
        validationMessage.innerHTML = statusOfValidation;
        validationMessage.style.color = 'green';

        const xValues = getX(); // Массив выбранных значений X
        const y = getY();
        const r = getR();

        const queryString = xValues.map(x => `x=${encodeURIComponent(x)}`).join('&') + `&y=${encodeURIComponent(y)}&r=${encodeURIComponent(r)}`;

        fetch(`/web_lab2-1.0-SNAPSHOT/controller?${queryString}`, {
            method: 'GET'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Ошибка ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                updateTable(data); // Обновляем таблицу с результатами

                // Рисуем точки на графике
                const rValue = parseFloat(r); // Получаем текущий R
                data.forEach(result => {
                    const x = parseFloat(result.x);
                    const y = parseFloat(result.y);
                    const isHit = result.isHit;

                    // Преобразуем координаты точки в пиксели
                    const centerX = canvas.width / 2;
                    const centerY = canvas.height / 2;
                    const scale = canvas.width / (4 * rValue); // Масштаб графика

                    const clickX = centerX + x * scale;
                    const clickY = centerY - y * scale;

                    // Рисуем точку
                    ctx.fillStyle = isHit ? 'green' : 'red'; // Цвет точки в зависимости от попадания
                    ctx.beginPath();
                    ctx.arc(clickX, clickY, 5, 0, 2 * Math.PI);
                    ctx.fill();

                    // Сохраняем точку в массив для последующего использования
                    points.push({ x, y });
                });
            })
            .catch(error => {
                console.error('Ошибка:', error);
                validationMessage.textContent = 'Ошибка при запросе.';
                validationMessage.style.color = 'red';
            });
    } else {
        validationMessage.classList.add('validation-failed');
        validationMessage.classList.remove('validation-successed');
        validationMessage.innerHTML = statusOfValidation;
        validationMessage.style.color = 'red';
    }
});


// Обновление таблицы с результатами
function updateTable(data) {
    const tableBody = document.getElementById("response-table").getElementsByTagName("tbody")[0];

    // Проходим по массиву результатов
    data.forEach(result => {
        const newRow = tableBody.insertRow();
        newRow.insertCell(0).textContent = result.isHit ? "Попадание" : "Промах";
        newRow.insertCell(1).textContent = result.x;
        newRow.insertCell(2).textContent = result.y;
        newRow.insertCell(3).textContent = result.r;
        newRow.insertCell(4).textContent = result.currentTime;
        newRow.insertCell(5).textContent = result.executionTime;
    });
}

// Работа с графиком
const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
let points = []; // Массив для хранения точек, которые были выбраны

// Функция для рисования графика
function drawGraph(r = 1) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = canvas.width / (4 * r); // Масштаб графика

    // Рисуем закрашенную область
    ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';

    // Четверть круга
    ctx.beginPath();
    ctx.arc(centerX, centerY, scale * r, 0.5 * Math.PI, Math.PI);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fill();

    // Прямоугольник
    ctx.beginPath();
    ctx.rect(centerX - scale * r, centerY - scale * r / 2, scale * r, scale * r / 2);
    ctx.closePath();
    ctx.fill();

    // Треугольник
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX, centerY - scale * r);
    ctx.lineTo(centerX + scale * r / 2, centerY);
    ctx.closePath();
    ctx.fill();

    // Оси координат
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();

    // Метки
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';

    drawTick(centerX + scale * r, centerY, 'R');
    drawTick(centerX + scale * r / 2, centerY, 'R/2');
    drawTick(centerX - scale * r, centerY, '-R');
    drawTick(centerX - scale * r / 2, centerY, '-R/2');

    drawTick(centerX, centerY - scale * r, 'R');
    drawTick(centerX, centerY - scale * r / 2, 'R/2');
    drawTick(centerX, centerY + scale * r, '-R');
    drawTick(centerX, centerY + scale * r / 2, '-R/2');
}

// Вспомогательная функция для рисования меток
function drawTick(x, y, label) {
    const tickSize = 5;

    if (y === canvas.height / 2) {
        ctx.beginPath();
        ctx.moveTo(x, y - tickSize);
        ctx.lineTo(x, y + tickSize);
        ctx.stroke();
        ctx.fillText(label, x - 15, y + 20);
    } else if (x === canvas.width / 2) {
        ctx.beginPath();
        ctx.moveTo(x - tickSize, y);
        ctx.lineTo(x + tickSize, y);
        ctx.stroke();
        ctx.fillText(label, x + 10, y + 5);
    }
}

// Обработка клика на графике
canvas.addEventListener('click', (event) => {
    if (validateR()) {
        statusOfValidation = 'Валидация пройдена успешно';
        validationMessage.classList.add('validation-successed');
        validationMessage.classList.remove('validation-failed');
        validationMessage.innerHTML = statusOfValidation;
        validationMessage.style.color = 'green';

    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const r = parseFloat(getR()); // Получаем R из формы
    if (!r || isNaN(r) || r <= 0) {
        statusOfValidation = 'Сначала выберите корректное значение R!';
        validationMessage.classList.add('validation-failed');
        validationMessage.classList.remove('validation-successed');
        validationMessage.innerHTML = statusOfValidation;
        validationMessage.style.color = 'red';
        return;
    }

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = canvas.width / (4 * r); // Масштаб графика

    // Преобразуем координаты клика в логические координаты графика
    const graphX = (clickX - centerX) / scale;
    const graphY = -(clickY - centerY) / scale;

    // Добавляем точку в массив
    points.push({ x: graphX, y: graphY });

    // Отправляем запрос на сервер
    fetch(`/web_lab2-1.0-SNAPSHOT/controller?x=${graphX.toFixed(2)}&y=${graphY.toFixed(2)}&r=${r}`, {
        method: 'GET',
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Ошибка ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // Цвет точки в зависимости от попадания
            ctx.fillStyle = data[0].isHit ? 'green' : 'red';
            ctx.beginPath();
            ctx.arc(clickX, clickY, 5, 0, 2 * Math.PI);
            ctx.fill();
            updateTable(data); // Обновляем таблицу
        })
        .catch((error) => {
            console.error('Ошибка:', error);
        });
    } else {
            validationMessage.classList.add('validation-failed');
            validationMessage.classList.remove('validation-successed');
            validationMessage.innerHTML = statusOfValidation;
            validationMessage.style.color = 'red';
    }
});

// Перерисовка графика при изменении R
document.getElementById('r-coord-input').addEventListener('input', () => {
    const r = parseFloat(getR());
    if (r && r > 0) {
        drawGraph(r);

        // Очищаем старые точки и рисуем только те, которые подходят под новый масштаб
        points.forEach((point) => {
            const x = point.x;
            const y = point.y;
            if (Math.abs(x) <= r && Math.abs(y) <= r) {
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const scale = canvas.width / (4 * r); // Масштаб графика

                // Преобразуем координаты точки в пиксели
                const clickX = centerX + x * scale;
                const clickY = centerY - y * scale;

                // Рисуем точку
                ctx.fillStyle = 'black'; // Цвет для старых точек (или можно добавлять логику для попадания)
                ctx.beginPath();
                ctx.arc(clickX, clickY, 5, 0, 2 * Math.PI);
                ctx.fill();
            }
        });
    }
});

// Рисуем график при загрузке страницы
drawGraph();
