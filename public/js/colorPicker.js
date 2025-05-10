const colorPickerInput = document.querySelector('.color-picker__input');
const colorPickerCode = document.querySelector('.color-picker__code');

let colorValue = colorPickerInput.value || '#FF4869';

function refreshColorAndCodeInputs() {
  colorPickerInput.value = colorValue;
  colorPickerCode.value = colorValue.substring(1).toUpperCase(); // Remove # and convert to uppercase
}

function handleColorInputChange(e) {
  colorValue = e.target.value;
  refreshColorAndCodeInputs();
}

function handleColorCodeInputChange(e) {
  let inputVal = e.target.value.toUpperCase();
  // Allow only hex characters and limit length
  inputVal = inputVal.replace(/[^0-9A-F]/g, '').substring(0, 6);
  e.target.value = inputVal; // Update input field with sanitized value

  if (inputVal.length === 6) {
    colorValue = `#${inputVal}`;
    colorPickerInput.value = colorValue;
  }
}

colorPickerInput.addEventListener('input', handleColorInputChange);
colorPickerCode.addEventListener('input', handleColorCodeInputChange);
