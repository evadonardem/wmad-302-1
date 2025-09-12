function calculateBMI() {
    let weight = parseFloat(document.getElementById('weight').value);
    let height = parseFloat(document.getElementById('height').value);
    const bmiAlert = document.getElementById('bmiAlert');

    
    bmiAlert.className = 'mt-3 alert';
    bmiAlert.innerHTML = '';

    if (isNaN(weight) || weight <= 0 || isNaN(height) || height <= 0) {
        bmiAlert.classList.add('alert-danger');
        bmiAlert.textContent = "Please enter valid weight and height.";
        return;
    }

    let bmi = weight / (height * height);
    let roundedBMI = bmi.toFixed(2);
    let category = "";
    let alertClass = "";

    if (bmi < 18.5) {
        category = "You are underweight.";
        alertClass = 'alert-warning';
    } else if (bmi >= 18.5 && bmi < 24.9) {
        category = "You have a normal weight.";
        alertClass = 'alert-success';
    } else if (bmi >= 25 && bmi < 29.9) {
        category = "You are overweight.";
        alertClass = 'alert-warning';
    } else {
        category = "You are obese.";
        alertClass = 'alert-danger';
    }

   
    bmiAlert.classList.add(alertClass);
    bmiAlert.innerHTML = `
        <strong>Your BMI is: ${roundedBMI}</strong><br>
        <strong>Category:</strong> ${category}
    `;
}