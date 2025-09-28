 document.getElementById('bmiForm').addEventListener('submit', function(e) {
      e.preventDefault();

      const height = parseFloat(document.getElementById('height').value);
      const weight = parseFloat(document.getElementById('weight').value);
      const resultDiv = document.getElementById('result');

      if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        resultDiv.innerHTML = `
          <div class="alert alert-danger text-center">
            <i class="fas fa-exclamation-triangle me-2"></i>Please enter valid height and weight.
          </div>
        `;
        return;
      }

      const bmi = (weight / (height * height)).toFixed(2);
      let category = '';
      let alertClass = '';

      if (bmi < 18.5) {
        category = 'Underweight';
        alertClass = 'alert-warning';
      } else if (bmi >= 18.5 && bmi < 24.9) {
        category = 'Normal weight';
        alertClass = 'alert-success';
      } else if (bmi >= 25 && bmi < 29.9) {
        category = 'Overweight';
        alertClass = 'alert-warning';
      } else {
        category = 'Obese';
        alertClass = 'alert-danger';
      }

      resultDiv.innerHTML = `
        <div class="alert ${alertClass} text-center">
          <h5><i class="fas fa-heartbeat me-2"></i>Your BMI is <strong>${bmi}</strong></h5>
          <p>Category: <strong>${category}</strong></p>
        </div>
      `;
    });