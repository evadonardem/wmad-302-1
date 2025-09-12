// Add your BMI calculator JavaScript code here

// Select elements from the DOM
const bmiForm = document.getElementById("bmiForm");
const bmiValue = document.getElementById("bmiValue");
const bmiCategory = document.getElementById("bmiCategory");
const resultBox = document.getElementById("result");

// Add event listener for form submission
bmiForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form refresh

    // Get user inputs
    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);

    // Validate inputs
    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
        alert("Please enter valid positive numbers for height and weight.");
        return;
    }

    // Calculate BMI
    const bmi = weight / (height * height);

    // Display BMI with 2 decimal places
    bmiValue.textContent = bmi.toFixed(2);

    // Determine BMI category
    let category = "";
    if (bmi < 18.5) {
        category = "Underweight";
        bmiCategory.style.color = "#0dcaf0"; // Light blue
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        category = "Normal weight";
        bmiCategory.style.color = "#198754"; // Green
    } else if (bmi >= 25 && bmi <= 29.9) {
        category = "Overweight";
        bmiCategory.style.color = "#ffc107"; // Yellow
    } else {
        category = "Obese";
        bmiCategory.style.color = "#dc3545"; // Red
    }

    bmiCategory.textContent = `Category: ${category}`;

    // Show result box
    resultBox.classList.remove("d-none");
});
