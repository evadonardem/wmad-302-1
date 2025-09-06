document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('bmiForm');
    const resultBox = document.getElementById('bmiResult');

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);

        if (!weight || !height || weight <= 0 || height <= 0) {
            resultBox.innerHTML = `
                <div class="text-danger">
                    ⚠️ Invalid input. Please check your values.
                </div>
            `;
            return;
        }

        const bmi = weight / (height * height);
        let status = '';
        let icon = '';

        if (bmi < 18.5) {
            status = 'Underweight';
            icon = '📉';
        } else if (bmi < 24.9) {
            status = 'Healthy';
            icon = '✅';
        } else if (bmi < 29.9) {
            status = 'Overweight';
            icon = '⚠️';
        } else {
            status = 'Obese';
            icon = '🚨';
        }

        resultBox.innerHTML = `
            <div>
                <span style="font-size: 1.8rem; font-weight: bold;">${bmi.toFixed(1)}</span>
                <div style="font-size: 1rem; color: #666;">Your BMI</div>
            </div>
            <div class="mt-2">
                ${icon} <strong>${status}</strong>
            </div>
        `;
    });
});
