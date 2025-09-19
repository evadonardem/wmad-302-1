// Add your BMI calculator JavaScript code here
document.getElementById('bmiForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const height = parseFloat(document.getElementById('height').value) / 100;
    const weight = parseFloat(document.getElementById('weight').value);

    if (height > 0 && weight > 0) {
        const bmi = (weight / (height * height)).toFixed(2);
        let category = '';
        let emoji = '';

        if (bmi < 18.5) {
            category = 'Underweight';
            emoji = '😟';
        } else if (bmi >= 18.5 && bmi < 24.9) {
            category = 'Normal weight';
            emoji = '🙂';
        } else if (bmi >= 25 && bmi < 29.9) {
            category = 'Overweight';
            emoji = '😬';
        } else {
            category = 'Obese';
            emoji = '😞';
        }

        document.getElementById('result').innerHTML = `
            <h4><i class="fas fa-heartbeat text-danger me-2"></i>Your BMI is: <span class="text-primary">${bmi}</span> ${emoji}</h4>
            <p class="fw-bold">Category: <span class="text-success">${category}</span></p>
        `;
    } else {
        document.getElementById('result').innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>Please enter valid height and weight.
            </div>
        `;
    }
});
