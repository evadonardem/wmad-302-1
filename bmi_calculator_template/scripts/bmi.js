document.getElementById("bmiForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const height = parseFloat(document.getElementById("height").value) / 100;
  const weight = parseFloat(document.getElementById("weight").value);

  if (height > 0 && weight > 0) {
    const bmi = (weight / (height * height)).toFixed(2);
    let category = "";

if (bmi < 18.5) {
  category = '<i class="fas fa-feather-alt text-info me-1"></i> Underweight';
} else if (bmi >= 18.5 && bmi < 24.9) {
  category = '<i class="fas fa-smile text-success me-1"></i> Normal weight';
} else if (bmi >= 25 && bmi < 29.9) {
  category = '<i class="fas fa-exclamation-triangle text-warning me-1"></i> Overweight';
} else {
  category = '<i class="fas fa-times-circle text-danger me-1"></i> Obese';
}

    document.getElementById("result").innerHTML = `
      <h4><i class="fas fa-heartbeat text-danger me-2"></i>Your BMI: 
        <span class="text-primary">${bmi}</span></h4>
      <p class="fw-bold">Category: <span class="text-success">${category}</span></p>
    `;
  } else {
    document.getElementById("result").innerHTML = `
      <div class="alert alert-danger">⚠️ Please enter valid values.</div>
    `;
  }
});