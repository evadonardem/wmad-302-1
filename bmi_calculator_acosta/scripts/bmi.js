// Generate raindrops dynamically
const rainContainer = document.querySelector('.rain');
for (let i = 0; i < 100; i++) {
    const drop = document.createElement('div');
    drop.classList.add('drop');
    drop.style.left = Math.random() * window.innerWidth + 'px';
    drop.style.animationDuration = 0.5 + Math.random() * 1.5 + 's';
    drop.style.animationDelay = Math.random() * 5 + 's';
    rainContainer.appendChild(drop);
}

document.getElementById('bmiForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const height = parseFloat(document.getElementById('height').value) / 100;
    const weight = parseFloat(document.getElementById('weight').value);

    if (height > 0 && weight > 0) {
        const bmi = (weight / (height * height)).toFixed(2);
        let category = '';

        if (bmi < 18.5) {
            category = 'Underweight';
        } else if (bmi >= 18.5 && bmi < 24.9) {
            category = 'Normal weight';
        } else if (bmi >= 25 && bmi < 29.9) {
            category = 'Overweight';
        } else {
            category = 'Obese';
        }

        document.getElementById('result').innerHTML = `
          <h4><i class="fas fa-heartbeat text-danger me-2"></i>Your BMI is: <span class="text-primary">${bmi}</span></h4>
          <p class="fw-bold">Category: <span class="text-success">${category}</span></p>
        `;
    } else {
        document.getElementById('result').innerHTML = `
          <div class="alert alert-danger w-100 text-center">
            <i class="fas fa-exclamation-triangle me-2"></i>Please enter valid height and weight.
          </div>
        `;
    }
});// Add your BMI calculator JavaScript code here