document.addEventListener("DOMContentLoaded", () => {
    const heightInput = document.getElementById("height");
    const weightInput = document.getElementById("weight");
    const calcBtn = document.getElementById("calcBtn");
    const result = document.getElementById("result");

  function calculateBMI() {
    const height = parseFloat(heightInput.value);
    const weight = parseFloat(weightInput.value);

    if (!height || !weight || height <= 0 || weight <= 0) {
        result.textContent = "I think you forgot something?";
        return;
    }

    const bmi = weight / (height * height);

    let category = "";
    let categoryClass = "";

    if (bmi < 18.5) {
        category = "Underweight";
        categoryClass = "underweight";
        setTimeout(() => {
        window.open("https://food.grab.com/ph/en/", "_blank");
        }, 3000);
    } else if (bmi < 25) {
        category = "Normal";
        categoryClass = "normal";
    } else if (bmi < 30) {
        category = "Overweight";
        categoryClass = "overweight";
        setTimeout(() => {
        window.open("https://www.facebook.com/BuildersXtremeGym", "_blank");
        }, 3000);
    } else {
        category = "Obese";
        categoryClass = "obese";
        setTimeout(() => {
            window.open("https://www.facebook.com/beghhealthcareforall", "_blank");
        }, 3000);
    }

    result.innerHTML =
        `Your BMI is <strong>${bmi.toFixed(2)}</strong> — ` +
        `<span class="${categoryClass}">${category}</span>`;
  }

    calcBtn.addEventListener("click", calculateBMI);
});
