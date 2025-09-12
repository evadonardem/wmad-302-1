// Add your BMI calculator JavaScript code here
document.getElementById('bmiForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const height = parseFloat(document.getElementById('height').value) / 100;
  const weight = parseFloat(document.getElementById('weight').value);

  if (height > 0 && weight > 0) {
    const bmi = (weight / (height * height)).toFixed(1);
    let category = '';
    let advice = '';

    if (bmi < 18.5) {
      category = 'Underweight';
      advice = 'Try bulking';
    } else if (bmi < 25) {
      category = 'Normal';
      advice = 'Maintain your shape';
    } else if (bmi < 30) {
      category = 'Overweight';
      advice = 'Go for a cut';
    } else if (bmi < 40) {
      category = 'Obese';
      advice = 'Start losing weight';
    } else {
      category = 'Extreme Obese';
      advice = 'Take action now';
    }

    document.getElementById('result').innerHTML = `
      <h4><i class="fas fa-heartbeat text-danger me-2"></i>Your BMI: 
      <span class="text-primary">${bmi}</span></h4>
      <p class="fw-bold">Category: ${category}</p>
      <p>${advice}</p>
    `;
  } else {
    document.getElementById('result').innerHTML = `
      <div class="alert alert-danger w-100 text-center">
        <i class="fas fa-exclamation-triangle me-2"></i>Please enter valid height and weight.
      </div>
    `;
  }
});