import { getTextColorFromHex } from './utils.js';

const modal = document.querySelector('#colorModal');
const colorOptionsList = document.querySelector('.color-options');
const colorOptions = document.querySelectorAll('.color-options__item');
const colorList = document.querySelector('.color-list');
const addColorBtn = document.querySelector('.color-add-btn');
const emptyMessage = document.querySelector('.modal__fallback-message');
const selectedColorsInput = document.querySelector('#selectedColorsInput');

let selectedColors = [];

function toggleModal() {
  if (modal.open) {
    modal.close();
  } else {
    updateAvailableColors();
    updateColorOptionsBorder();
    modal.showModal();
  }
}

function createColorElement(id, name, code) {
  const colorItem = document.createElement('li');
  colorItem.classList.add('list__item');

  const colorBtn = document.createElement('button');
  colorBtn.type = 'button';
  colorBtn.className = 'color-btn';
  colorBtn.dataset.id = id;
  colorBtn.setAttribute('aria-label', `Remove color: ${name}/${code}`);

  const colorSwatch = document.createElement('span');
  colorSwatch.className = 'color-btn__swatch';
  colorSwatch.style.backgroundColor = code;

  const colorIcon = document.createElement('i');
  colorIcon.className = 'bx bx-x color-btn__icon';
  colorIcon.setAttribute('aria-hidden', 'true');
  if (getTextColorFromHex(code) === 'white') {
    colorIcon.classList.add('color-btn__icon--light');
  }

  colorBtn.appendChild(colorSwatch);
  colorBtn.appendChild(colorIcon);
  colorItem.appendChild(colorBtn);

  colorBtn.addEventListener('click', () => removeColor(id));

  return colorItem;
}

function removeColor(id) {
  selectedColors = selectedColors.filter((color) => color.id !== id);
  updateColorList();
  updateSelectedColorsInput();
  updateColorOptionsBorder();
}

function addColor(id, name, code) {
  if (!selectedColors.some((color) => color.id === id)) {
    selectedColors.push({ id, name, code });
    updateColorList();
    updateSelectedColorsInput();
    updateColorOptionsBorder();
  }
}

// Update the hidden form input with selected colors
function updateSelectedColorsInput() {
  const colorIds = selectedColors.map((color) => color.id);
  selectedColorsInput.value = JSON.stringify(colorIds);
}

// Update the available colors list based on selected colors
function updateAvailableColors() {
  let availableCount = 0;

  colorOptions.forEach((option) => {
    const isSelected = selectedColors.some(
      (color) => color.id === option.dataset.id,
    );
    option.style.display = isSelected ? 'none' : '';

    if (!isSelected) {
      availableCount++;
    }
  });

  emptyMessage.style.display = availableCount === 0 ? 'block' : 'none';
  colorOptionsList.style.display = availableCount === 0 ? 'none' : 'flex';
}

function updateColorList() {
  colorList.innerHTML = '';

  selectedColors.forEach((color) => {
    const colorElement = createColorElement(color.id, color.name, color.code);
    colorList.appendChild(colorElement);
  });
}

function updateColorOptionsBorder() {
  colorOptions.forEach((option) => {
    option.style.borderRadius = '0px';
  });

  let firstVisible = null;
  let lastVisible = null;

  for (let i = 0; i < colorOptions.length; i++) {
    if (colorOptions[i].style.display !== 'none') {
      if (firstVisible === null) {
        firstVisible = colorOptions[i]; // Assign the first visible item found
      }
      lastVisible = colorOptions[i]; // Continuously update lastVisible to the current visible item
    }
  }

  if (firstVisible) {
    if (firstVisible === lastVisible) {
      // Only one item is visible
      firstVisible.style.borderRadius = '9px';
    } else {
      firstVisible.style.borderRadius = '9px 9px 0 0';
      lastVisible.style.borderRadius = '0 0 9px 9px';
    }
  }
}

function applyColorOptionHoverEffect(option, color) {
  const swatch = option.querySelector('.color-options__swatch');
  const codeAndName = option.querySelector('.color-options__code-and-name');

  option.addEventListener('mouseenter', () => {
    option.style.backgroundColor = color;
    swatch.style.border = `2px solid ${getTextColorFromHex(color)}`;
    getTextColorFromHex(color) === 'white'
      ? codeAndName.classList.add('color-options__code-and-name--light')
      : codeAndName.classList.add('color-options__code-and-name--dark');
  });

  option.addEventListener('mouseleave', () => {
    option.style.background = 'none';
    swatch.style.border = '1px solid var(--neutral)';
    codeAndName.classList.remove(
      'color-options__code-and-name--light',
      'color-options__code-and-name--dark',
    );
  });
}

addColorBtn.addEventListener('click', (e) => {
  e.preventDefault();
  toggleModal();
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.close();
  }
});

// Color selection handlers
colorOptions.forEach((option) => {
  const code = option.querySelector('.color-options__swatch').dataset.code;

  const selectColor = () => {
    const { id, name } = option.dataset;
    addColor(id, name, code);
    modal.close();
  };

  option.addEventListener('click', selectColor);
  applyColorOptionHoverEffect(option, code);

  option.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectColor();
    }
  });
});

// Initialize
// updateColorList();
// updateSelectedColorsInput();
// updateColorOptionsBorder();
