// Add your BMI calculator JavaScript code here
function calculateBmi() {
    let weight = document.getElementById("weightInput").value;
    let height = document.getElementById("heightInput").value;

    let bmi = weight / (height * height);

    if (bmi < 18.5) {
        document.getElementById("output").innerHTML = 
        `Your BMI is ${bmi.toFixed(2)}.`
        document.getElementById("output2").innerHTML = 
        `<div>
            A low BMI can indicate malnutrition and can be linked to compromised immune function. 
            Please watch over your welfare. Don't skip meals and eat a proper diet!
        </div>
        <div class="mt-3">
            <i class="fa-solid fa-scale-unbalanced fa-4x" style="color: #FFD43B;"></i>
        </div>`;
    }
    else if (bmi >= 18.5 && bmi <= 24.9) {
        document.getElementById("output").innerHTML = 
        `Your BMI is ${bmi.toFixed(2)}.`
        document.getElementById("output2").innerHTML =
        `<div>
            Your BMI is indicated to be at a normal range. Keep it up!
        </div>
        <div class="mt-3">
            <i class="fa-solid fa-scale-balanced fa-4x" style="color: #FFD43B;"></i>
        </div>`
    }
    else if (bmi >= 25 && bmi <= 29.9) {
        document.getElementById("output").innerHTML = 
        `Your BMI is ${bmi.toFixed(2)}.`
        document.getElementById("output2").innerHTML =
        `<div>
            A high BMI is associated with health risks like heart disease, high blood pressure, diabetes, etc. 
            Please watch over your welfare. Exercise regularly!
        </div>
        <div class="mt-3">
            <i class="fa-solid fa-scale-unbalanced fa-4x" style="color: #FFD43B;"></i>
        </div>`
    }
    else if (bmi >= 30) {
        document.getElementById("output").innerHTML = 
        `Your BMI is ${bmi.toFixed(2)}.`
        document.getElementById("output2").innerHTML =
        `<div>
            YOU MUST LOSE SOME WEIGHT!
        </div>
        <div class="mt-3">
            <i class="fa-solid fa-scale-unbalanced fa-4x" style="color: #FFD43B;"></i>
        </div>`
    }
    else if (isNaN(weight) || isNaN(height) || height <= 0 || weight <= 0) {
         document.getElementById("output").innerHTML = 
         `Please input the correct height and weight value.`
    }
}
function clearInputs() {
    document.getElementById("weightInput").value = "";
    document.getElementById("heightInput").value = "";
    document.getElementById("output").innerHTML = "";
    document.getElementById("output2").innerHTML = "";
}
