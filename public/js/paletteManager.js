import { getTextColorFromHex } from './utils.js';

// --- CONSTANTS ---
const MIN_COLORS = 3;
const MAX_COLORS = 5;
const HIDDEN_CLASS = 'hidden';
const LIGHT_ICON_CLASS = 'palette-colors__btn-color-icon--light';
const HOVER_LIGHT_TEXT_CLASS = 'color-options__code-and-name--light';
const HOVER_DARK_TEXT_CLASS = 'color-options__code-and-name--dark';

// --- DOM ELEMENTS ---
const paletteForm = document.querySelector('#palette-form');
const modal = document.querySelector('#colorModal');
const colorOptionsList = modal.querySelector('.color-options');
const colorOptions = Array.from(modal.querySelectorAll('.color-options__item'));
const colorList = paletteForm.querySelector('.palette-colors');
const addColorBtn = paletteForm.querySelector('.btn-add-color');
const modalFallbackMessage = modal.querySelector('.modal__fallback-message');
const selectedColorsInput = paletteForm.querySelector('#selectedColorsInput');

// --- TEMPLATES ---
const colorItemTemplate = document.getElementById('color-item-template');
const emptyPlaceholderTemplate = document.getElementById(
  'empty-color-placeholder-template',
);

// --- STATE ---
let selectedColors = [];

// --- UI UPDATE FUNCTIONS ---

function renderSelectedColorsList() {
  colorList.innerHTML = '';

  selectedColors.forEach((color) => {
    const colorElement = createColorElement(color.id, color.name, color.code);
    colorList.appendChild(colorElement);
  });

  const placeholdersNeeded = MIN_COLORS - selectedColors.length;
  for (let i = 0; i < placeholdersNeeded; i++) {
    if (selectedColors.length + i < MIN_COLORS) {
      colorList.appendChild(createEmptyColorPlaceholder());
    }
  }
}

function updateSelectedColorsInputValue() {
  selectedColorsInput.value = JSON.stringify(
    selectedColors.map((c) => ({
      id: c.id,
      name: c.name,
      code: c.code,
      position: c.position,
    })),
  );
}

function updateAvailableColorsInModal() {
  let visibleCount = 0;
  colorOptions.forEach((option) => {
    const isSelected = selectedColors.some(
      (color) => color.id === option.dataset.id,
    );
    option.classList.toggle(HIDDEN_CLASS, isSelected);
    if (!isSelected) {
      visibleCount++;
    }
  });

  modalFallbackMessage.classList.toggle(HIDDEN_CLASS, visibleCount > 0);
  colorOptionsList.classList.toggle(HIDDEN_CLASS, visibleCount === 0);
}

function updateColorOptionsModalStyling() {
  colorOptions.forEach((option) => {
    option.classList.remove(
      'is-first-visible-option',
      'is-last-visible-option',
    );
  });

  const visibleOptions = colorOptions.filter(
    (option) => !option.classList.contains(HIDDEN_CLASS),
  );

  if (visibleOptions.length > 0) {
    visibleOptions[0].classList.add('is-first-visible-option');
    visibleOptions[visibleOptions.length - 1].classList.add(
      'is-last-visible-option',
    );
  }
}

// --- HELPER FUNCTIONS ---

function createEmptyColorPlaceholder() {
  return emptyPlaceholderTemplate.content.cloneNode(true).firstElementChild;
}

function createColorElement(id, name, code) {
  const templateClone = colorItemTemplate.content.cloneNode(true);
  const colorItem = templateClone.firstElementChild;
  const colorBtn = colorItem.querySelector('.palette-colors__btn-color');
  const removeColorIcon = colorBtn.querySelector(
    '.palette-colors__btn-color-icon',
  );

  colorBtn.dataset.id = id;
  colorBtn.setAttribute('aria-label', `Remove color: ${name} (${code})`);
  colorBtn.style.backgroundColor = code;

  if (getTextColorFromHex(code) === 'white') {
    removeColorIcon.classList.add(LIGHT_ICON_CLASS);
  } else {
    removeColorIcon.classList.remove(LIGHT_ICON_CLASS);
  }

  colorBtn.addEventListener('click', () => handleRemoveColor(id));

  return colorItem;
}

function isPaletteValid() {
  return (
    selectedColors.length >= MIN_COLORS && selectedColors.length <= MAX_COLORS
  );
}

function toggleModal() {
  if (modal.open) {
    modal.close();
  } else {
    updateAvailableColorsInModal();
    updateColorOptionsModalStyling();
    modal.showModal();
  }
}

// --- EVENT HANDLERS ---

function handleAddColor(id, name, code) {
  if (selectedColors.length >= MAX_COLORS) {
    alert(`You can select a maximum of ${MAX_COLORS} colors.`);
    return;
  }

  if (!selectedColors.some((color) => color.id === id)) {
    const position = selectedColors.length + 1;
    selectedColors.push({ id, name, code, position });
    renderApp();
  }
}

function handleRemoveColor(idToRemove) {
  selectedColors = selectedColors.filter((color) => color.id !== idToRemove);
  selectedColors.forEach((color, index) => {
    color.position = index + 1;
  });
  renderApp();
}

function handleColorOptionClick(event) {
  const option = event.target.closest('.color-options__item');
  if (!option || option.classList.contains(HIDDEN_CLASS)) return;

  const { id, name } = option.dataset;
  const code = option.querySelector('.color-options__swatch').dataset.code;
  handleAddColor(id, name, code);
  modal.close();
}

function handleColorOptionKeydown(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    const option = event.target.closest('.color-options__item');
    if (option && !option.classList.contains(HIDDEN_CLASS)) {
      event.preventDefault();
      const { id, name } = option.dataset;
      const code = option.querySelector('.color-options__swatch').dataset.code;
      handleAddColor(id, name, code);
      modal.close();
    }
  }
}

function applyColorOptionHoverEffect(option, colorCode) {
  const swatch = option.querySelector('.color-options__swatch');
  const codeAndName = option.querySelector('.color-options__code-and-name');

  option.addEventListener('mouseenter', () => {
    option.style.backgroundColor = colorCode;

    swatch.style.border = `2px solid ${getTextColorFromHex(colorCode)}`;
    const textLuminance = getTextColorFromHex(colorCode);

    codeAndName.classList.toggle(
      HOVER_LIGHT_TEXT_CLASS,
      textLuminance === 'white',
    );
    codeAndName.classList.toggle(
      HOVER_DARK_TEXT_CLASS,
      textLuminance === 'black',
    );
  });

  option.addEventListener('mouseleave', () => {
    option.style.backgroundColor = '';
    swatch.style.border = '';
    codeAndName.classList.remove(HOVER_LIGHT_TEXT_CLASS, HOVER_DARK_TEXT_CLASS);
  });
}

function handleSubmit(event) {
  if (!isPaletteValid()) {
    event.preventDefault();
    alert(`Palettes must have between ${MIN_COLORS} and ${MAX_COLORS} colors.`);
  }
}

// --- MAIN RENDER FUNCTION ---
function renderApp() {
  renderSelectedColorsList();
  updateSelectedColorsInputValue();
}

// --- INITIALIZATION & EVENT LISTENERS ---
function init() {
  addColorBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleModal();
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.close();
    }
  });

  if (colorOptionsList) {
    colorOptionsList.addEventListener('click', handleColorOptionClick);
  }

  colorOptions.forEach((option) => {
    const swatch = option.querySelector('.color-options__swatch');
    const code = swatch.dataset.code;
    applyColorOptionHoverEffect(option, code);
    option.addEventListener('keydown', handleColorOptionKeydown);
  });

  paletteForm.addEventListener('submit', handleSubmit);

  renderApp();
  updateAvailableColorsInModal();
  updateColorOptionsModalStyling();
}

// Initialize
init();
