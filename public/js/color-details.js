import { getTextColorFromHex } from './utils.js';

const colorBtn = document.querySelector('.color-details__color');
const colorCode = document.querySelector('.color-details__code');

const hexColor = colorCode.textContent;

if (getTextColorFromHex(hexColor) === 'white') {
  colorCode.classList.add('color-details__code--light');
}

colorBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(colorCode.textContent).then(() => {
    colorCode.textContent = '✓';
    colorCode.classList.add('color-details__code--big-text');
    setTimeout(() => {
      colorCode.textContent = hexColor;
      colorCode.classList.remove('color-details__code--big-text');
    }, 1250);
  });
});
