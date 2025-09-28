document.addEventListener('DOMContentLoaded', function () {
    const bmiForm = document.getElementById('bmiForm');
    const bmiResult = document.getElementById('bmiResult');

    bmiForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);

        if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
            bmiResult.innerHTML = `<span class="text-danger"><i class="fas fa-exclamation-triangle"></i> Please enter valid values.</span>`;
            return;
        }

        const bmi = weight / (height * height);
        let category = '';
        let icon = '';

        if (bmi < 18.5) {
            category = 'Underweight';
            icon = '<i class="fas fa-arrow-down text-info"></i>';
        } else if (bmi < 24.9) {
            category = 'Normal weight';
            icon = '<i class="fas fa-check-circle text-success"></i>';
        } else if (bmi < 29.9) {
            category = 'Overweight';
            icon = '<i class="fas fa-exclamation-circle text-warning"></i>';
        } else {
            category = 'Obesity';
            icon = '<i class="fas fa-times-circle text-danger"></i>';
        }

        bmiResult.innerHTML = `
            <div>
                <span style="font-size:1.5rem;font-weight:600;">${bmi.toFixed(1)}</span>
                <span class="text-secondary" style="font-size:1rem;">BMI</span>
            </div>
            <div class="mt-2">${icon} <span>${category}</span></div>
        `;
    });
});