// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

const delActionButton = document.querySelector('.del__action__btn'); ///// кнопка удаления
const borderInput = document.querySelector('#border_color'); ///// поле с цветом границы блока
const minWeightInput = document.querySelector('.minweight__input'); // поле с нижней границей weight
const maxWeightInput = document.querySelector('.maxweight__input'); // поле с верхней границей weight

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);



/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
const display = () => {
  // TODO: очищаем fruitsList от вложенных элементов,
  // чтобы заполнить актуальными данными из fruits
  fruitsList.innerHTML = '';  

  for (let i = 0; i < fruits.length; i++) {
    // TODO: формируем новый элемент <li> при помощи document.createElement        
    let cardLi = document.createElement('li');  
    cardLi.className = "fruit__item"; 
    let cardMainDiv = document.createElement('div');  
    cardMainDiv.className = "fruit__info"; 
    /////...а еще есть insertAdjacentHTML
    cardMainDiv.insertAdjacentHTML('beforeend', `<div>index: ${i}</div>`);

    /////добавляем стили для каждого цвета
    switch (fruits[i].color) {
      case 'фиолетовый': cardLi.className += ' fruit_violet';      break;
      case 'зеленый': cardLi.className += ' fruit_green';      break;
      case 'розово-красный': cardLi.className += ' fruit_carmazin';      break;
      case 'желтый': cardLi.className += ' fruit_yellow';      break;
      case 'светло-коричневый': cardLi.className += ' fruit_lightbrown';      break;
      default: cardLi.style.cssText = `background-color: ${fruits[i].border}`;      break; 
      ///// если цвет не входит в список значений из исходного fruits - значение для border color будет подтянуто НЕ из css файла, а из значения объекта с ключом border
    }      

    // и добавляем в конец списка fruitsList при помощи document.appendChild
    /////appendChild разве не устарела?   
    cardLi.append(cardMainDiv);
    fruitsList.append(cardLi);     
    

    /////строки для наполнения карточки - извлекаем из БД и рендерим
    let cardKind = document.createElement('div'); 
    let cardKindText = document.createTextNode("kind: " + fruits[i].kind);
    cardKind.append(cardKindText);
    cardMainDiv.append(cardKind);

    let cardColor = document.createElement('div'); 
    let cardColorText = document.createTextNode("color: " + fruits[i].color);
    cardColor.append(cardColorText);
    cardMainDiv.append(cardColor);
    
    let cardWeight = document.createElement('div'); 
    let cardWeightText = document.createTextNode("weight (кг): " + fruits[i].weight);
    cardWeight.append(cardWeightText);
    cardMainDiv.append(cardWeight);
  }  
};

// первая отрисовка карточек
display();



/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];  

  /////делаем глубокое копирование fruits для последующей проверки на совпадение с перемешанным массивом  
  const fruitsDeepCopy = JSON.stringify(fruits);  

  // ATTENTION: сейчас при клике вы запустите бесконечный цикл и браузер зависнет
  while (fruits.length > 0) {
    // TODO: допишите функцию перемешивания массива
    //
    // Подсказка: находим случайный элемент из fruits, используя getRandomInt
    // вырезаем его из fruits и вставляем в result.
    // ex.: [1, 2, 3], [] => [1, 3], [2] => [3], [2, 1] => [], [2, 1, 3]
    // (массив fruits будет уменьшатся, а result заполняться)   
    let randomEl = fruits.splice(getRandomInt(0,fruits.length-1),1);
    result.push(...randomEl);    
  }
  
/////особый случай, когда при перемешивании получившийся массив совпадает со старым
JSON.stringify(result) == fruitsDeepCopy ? alert('Порядок не изменился') : "";

/////записываем результат в массив fruits
fruits = result;
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display();
});



/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  if (minWeightInput.value && maxWeightInput.value) {
      const newFilteredArray = fruits.filter((item) =>    
        // TODO: допишите функцию   
        minWeightInput.value <= item.weight && item.weight <= maxWeightInput.value            
      ) 
      fruits = newFilteredArray;
  } else {
    alert("Пожалуйста, заполните оба поля - min weight и max weight");
  }
};

filterButton.addEventListener('click', () => {
  filterFruits();
  display();
});



/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  // TODO: допишите функцию сравнения двух элементов по цвету
  ///// реализовано по возрастанию длины значения color. Ибо по радуге - непонятно, как быть со свежедобавленными цветами
  return a.color.length > b.color.length;
  
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    // TODO: допишите функцию сортировки пузырьком
      for (let i = 1; i < arr.length; i++) {
        const current = arr[i]; ///// зеленый arr[1]
        let j = i; ///// 1 = 1
       
        while (j > 0 && comparation(arr[j - 1], current)) { ///// фиолетовый > зеленый
          arr[j] = arr[j - 1]; ///// записываем на место arr[1] (зеленый) объект arr[0] (фиолетовый)
            j--; ///// меняем индекс с 1 на 0
        }

        arr[j] = current; ///// записываем в arr[0] (фиолетовый) объект arr[1] (зеленый) 
        ///// если бы проверка (фиолетовый > зеленый) не прошла, arr[1] (зеленый) бы записался в arr[1] (зеленый)
    }
  },

  quickSort(arr, comparation) {
    // TODO: допишите функцию быстрой сортировки   

        if (arr.length < 2) return arr; ////// условие остановки, выхода из рекурсии, возвращем массив с 1 элементом        
        let pivot = arr[0];    ////// выбираем опорный элемент      
        const left = []; ////// определяем массивы для тех, что меньше и больше опорного
        const right = [];
        
        ///// проходим циклом по всем элементам из массива и разносим их в массивы, созданные ранее, при помощи функции: true - в левый, false - в правый  
        for (let i = 1; i < arr.length; i++) {
          if (comparation(pivot, arr[i])) {
            left.push(arr[i]);
          } else {
            right.push(arr[i]);
          }
        }

        //// рекурсивно повторяем процесс для новых двух массивов
        let leftAgain = sortAPI.quickSort(left, comparationColor);
        let rightAgain = sortAPI.quickSort(right, comparationColor);
        //// текущий опорный элемент - кладем как первый в правый массив. Объединяем все во fruits
        fruits = leftAgain.concat([pivot].concat(rightAgain));
        return fruits;        
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  // TODO: переключать значение sortKind между 'bubbleSort' / 'quickSort'
  if (sortKind == 'bubbleSort') {
    sortKind = 'quickSort';
    sortKindLabel.textContent = 'quickSort';
  } else {
    sortKind = 'bubbleSort';
    sortKindLabel.textContent = 'bubbleSort';
  }
});

sortActionButton.addEventListener('click', () => {
  // TODO: вывести в sortTimeLabel значение 'sorting...'
  sortTimeLabel.textContent = 'sorting...';
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  // TODO: вывести в sortTimeLabel значение sortTime
  sortTimeLabel.textContent = sortTime;
});



/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  // TODO: создание и добавление нового фрукта в массив fruits
  // необходимые значения берем из kindInput, colorInput, weightInput

  ///// забираем значение из инпута color picker для border
  let borderColor = borderInput.getAttribute('data-current-color');

  ///// проверяем, что введенное в поле "color:" значение - новое в fruits. Если нет - выводим предупреждение и заменяем цвет на существующий в базе
  for (let i = 0; i < fruits.length; i++) {
    if (colorInput.value == fruits[i].color) {     
      fruits[i].border ? borderColor = fruits[i].border : "";
      alert('Вы ввели в поле "color:" один из уже существующих цветов. Цвет границы блока (border color) был заменен на значение rgb, закрепленное за существуюшим цветом');
      break;
    }
  }  

  ///// создаем новый объект и засовываем в БД
  if (kindInput.value && colorInput.value && weightInput.value) {    
    const newFruit = new Object ({ kind: kindInput.value, color: colorInput.value, weight: weightInput.value });

    /////тут надо проверить, что цвет, введенный в поле "color:", не совпадает с любым из пяти первоначальных цветов fruits, т.к. для них не было значения "border:"
    if (colorInput.value !== "фиолетовый" && colorInput.value !== "зеленый" && colorInput.value !== "розово-красный" 
    && colorInput.value !== "желтый" && colorInput.value !== "светло-коричневый") {
      newFruit.border = borderColor;      
    }   

    fruits.push(newFruit);
    display();  
  } else {
    alert('Пожалуйста, заполните все поля');  /////если хотя бы одно из полей не заполнено
  }
});



/*** УДАЛИТЬ ПОСЛЕДНИЙ ФРУКТ ***/

delActionButton.addEventListener('click', () => {  
  fruits.length > 0 ? fruits.pop () : alert('Больше нечего удалять');
  display();
});