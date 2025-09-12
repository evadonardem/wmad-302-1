const form = document.getElementById("bmiForm");
const result = document.getElementById("result");
const category = document.getElementById("category");
const resetBtn = document.getElementById("resetBtn");
const sampleBtn = document.getElementById("sampleBtn");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    let weight = parseFloat(document.getElementById("weight").value);
    let height = parseFloat(document.getElementById("height").value);

    if (weight > 0 && height > 0) {
        // Convert lbs to kg
        let weightKg = weight * 0.453592;
        let bmi = weightKg / (height * height);

        result.innerText = `Your BMI is: ${bmi.toFixed(2)}`;

        let categoryText = "";
        let badgeClass = "badge bg-secondary";

        if (bmi < 18.5) {
            categoryText = "Underweight";
            badgeClass = "badge bg-warning text-dark";
        } else if (bmi >= 18.5 && bmi < 24.9) {
            categoryText = "Normal weight";
            badgeClass = "badge bg-success";
        } else if (bmi >= 25 && bmi < 29.9) {
            categoryText = "Overweight";
            badgeClass = "badge bg-info text-dark";
        } else {
            categoryText = "Obese";
            badgeClass = "badge bg-danger";
        }

        category.innerHTML = `<span class="${badgeClass}">${categoryText}</span>`;
    } else {
        result.innerText = "⚠ Please enter valid values.";
        category.innerText = "";
    }
});

// Reset button
resetBtn.addEventListener("click", () => {
    document.getElementById("weight").value = "";
    document.getElementById("height").value = "";
    result.innerText = "";
    category.innerText = "";
});

// Sample data button
sampleBtn.addEventListener("click", () => {
    document.getElementById("weight").value = 150; // lbs
    document.getElementById("height").value = 1.70; // meters
});
