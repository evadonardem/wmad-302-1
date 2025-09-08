function calculateBMI(weight, height) {
  return (weight / (height * height)).toFixed(2);
}

function getBMICategory(bmi) {
  if (bmi < 18.5) {
    return {
      text: '<i class="fas fa-feather text-info me-1"></i>Underweight',
      css: "text-info"
    };
  }
  if (bmi < 24.9) {
    return {
      text: '<i class="fas fa-smile text-success me-1"></i>Normal weight',
      css: "text-success"
    };
  }
  if (bmi < 29.9) {
    return {
      text: '<i class="fas fa-exclamation-triangle text-warning me-1"></i>Overweight',
      css: "text-warning"
    };
  }
  return {
    text: '<i class="fas fa-times-circle text-danger me-1"></i>Obese',
    css: "text-danger"
  };
}

document.getElementById("bmiForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const heightInput = parseFloat(document.getElementById("height").value) / 100;
  const weightInput = parseFloat(document.getElementById("weight").value);
  const resultDiv = document.getElementById("result");

  if (heightInput > 0 && weightInput > 0) {
    const bmi = calculateBMI(weightInput, heightInput);
    const { text, css } = getBMICategory(bmi);

    resultDiv.innerHTML = `
      <h4>
        <i class="fas fa-heartbeat text-danger me-2"></i>
        Your BMI: <span class="text-primary">${bmi}</span>
      </h4>
      <p class="fw-bold">Category: <span class="${css}">${text}</span></p>
    `;
  } else {
    resultDiv.innerHTML = `
      <div class="alert alert-danger">
        <i class="fas fa-exclamation-circle me-1"></i> Please enter valid values.
      </div>
    `;
  }
});

// Add your BMI calculator JavaScript code here