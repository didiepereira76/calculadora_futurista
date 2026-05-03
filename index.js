const buttonsEl = document.querySelectorAll("button");
const inputFieldEl = document.getElementById("result");

let currentValue = '';

buttonsEl.forEach(button => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    const value = button.dataset.value;

    if (action === "clear") {
      clearResult();
    } else if (action === "calculate") {
      calculateResult();
    } else if (action === "negate") {
      negateResult();
    } else if (action === "percent") {
      percentResult();
    } else if (value) {
      appendValue(value);
    }
  });
});

function clearResult() {
  currentValue = "";
  updateDisplay();
}

function negateResult() {
  if (currentValue && currentValue !== "Error") {
    // If it's a single evaluated number or simple expression, we can negate it
    try {
      const result = eval(currentValue) * -1;
      currentValue = result.toString();
      updateDisplay();
    } catch (e) {
      // Ignore if it's an incomplete expression like "5+"
    }
  }
}

function percentResult() {
  if (currentValue && currentValue !== "Error") {
    try {
      const result = eval(currentValue) / 100;
      currentValue = formatResult(result);
      updateDisplay();
    } catch (error) {
      showError();
    }
  }
}

function calculateResult() {
  if (!currentValue || currentValue === "Error") return;
  
  try {
    const result = eval(currentValue);
    
    if (result === Infinity || result === -Infinity || isNaN(result)) {
      throw new Error("Invalid operation");
    }
    
    currentValue = formatResult(result);
    updateDisplay();
  } catch (error) {
    showError();
  }
}

function appendValue(value) {
  if (currentValue === "Error") {
    currentValue = "";
  }
  
  // Prevent multiple decimals in the current number segment
  const parts = currentValue.split(/[\+\-\*\/]/);
  const lastPart = parts[parts.length - 1];
  
  if (value === '.' && lastPart.includes('.')) {
    return;
  }
  
  currentValue += value;
  updateDisplay();
}

function updateDisplay() {
  let visualValue = currentValue.replace(/\*/g, '×').replace(/\//g, '÷');
  inputFieldEl.value = visualValue;
}

function formatResult(num) {
  return parseFloat(num.toFixed(8)).toString();
}

function showError() {
  currentValue = "Error";
  updateDisplay();
  setTimeout(clearResult, 1500);
}