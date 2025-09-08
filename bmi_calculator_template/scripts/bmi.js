// Add your BMI calculator JavaScript code here

document.getElementById('bmiForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value); // Input is in meters, no conversion needed

    if (isNaN(weight) || isNaN(height) || height === 0) {
        alert('Please enter valid weight and height.');
        return;
    }

    const bmi = weight / (height * height);
    const resultElement = document.getElementById('result');
    const resultTextElement = document.getElementById('result-text');
    let category = '';
    let alertClass = 'alert-success';

    if (bmi < 18.5) {
        category = 'Underweight';
        alertClass = 'alert-warning';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        category = 'Normal weight';
        alertClass = 'alert-success';
    } else if (bmi >= 25 && bmi <= 29.9) {
        category = 'Overweight';
        alertClass = 'alert-warning';
    } else {
        category = 'Obesity';
        alertClass = 'alert-danger';
    }

    resultTextElement.innerHTML = `Your BMI is: <strong>${bmi.toFixed(2)}</strong><br>Category: <strong>${category}</strong>`;
    resultTextElement.className = `alert ${alertClass}`;
    resultElement.classList.remove('d-none');
});

document.getElementById('bmiForm').addEventListener('reset', function() {
    document.getElementById('result').classList.add('d-none');
});