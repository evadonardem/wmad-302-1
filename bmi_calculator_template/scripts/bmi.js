// Add your BMI calculator JavaScript code here
function calculateBMI() {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const result = document.getElementById('result');
    const category = document.getElementById('category');

    if (!height || !weight || height <= 0 || weight <= 0) {
        result.innerHTML = "Please enter valid numbers!";
        result.classList.add("text-danger");
        category.innerHTML = "";
        return;
    }

    // Convert height from cm to meters
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    result.classList.remove("text-danger");
    result.innerHTML = `Your BMI is ${bmi.toFixed(1)}`;

    let bmiCategory = "";
    if (bmi < 18.5) {
        bmiCategory = "Underweight 😔";
        category.className = "text-info";
    } else if (bmi < 24.9) {
        bmiCategory = "Normal weight 😊";
        category.className = "text-success";
    } else if (bmi < 29.9) {
        bmiCategory = "Overweight 😐";
        category.className = "text-warning";
    } else {
        bmiCategory = "Obese 😟";
        category.className = "text-danger";
    }

    category.innerHTML = bmiCategory;
}
