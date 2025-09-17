document.getElementById('bmiForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const heightInput = document.getElementById('height');
  const weightInput = document.getElementById('weight');
  const resultDiv = document.getElementById('result');

  const height = parseFloat(heightInput.value) / 100; 
  const weight = parseFloat(weightInput.value);

  if (height > 0 && weight > 0) {
    const bmi = weight / (height * height);
    let category = '';

    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 24.9) category = 'Normal weight';
    else if (bmi < 29.9) category = 'Overweight';
    else category = 'Obesity';

    resultDiv.innerHTML = `
      <h4>Your BMI: ${bmi.toFixed(1)}</h4>
      <p class="fw-bold">${category}</p>
    `;
  } else {
    resultDiv.innerHTML =
      '<p class="text-danger">Please enter valid numbers.</p>';
  }
});