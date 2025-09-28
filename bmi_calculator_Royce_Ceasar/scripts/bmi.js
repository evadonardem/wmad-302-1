function calculateBMI() {
    const weight = parseFloat(document.getElementById("weight").value);
    const heightCm = parseFloat(document.getElementById("height").value);
  
    const resultEl = document.getElementById("result");
    resultEl.className = ""; // reset classes
  
    if (!weight || !heightCm || weight <= 0 || heightCm <= 0) {
      resultEl.textContent = "Please enter valid positive numbers for weight and height.";
      resultEl.classList.add("text-danger");
      return;
    }
  
    const heightM = heightCm / 100; // Convert cm to meters
    const bmi = weight / (heightM * heightM);
    const bmiRounded = bmi.toFixed(2);
  
    let category = "";
    let message = "";
  
    if (bmi < 18.5) {
      category = "underweight";
      message = "You are underweight.";
    } else if (bmi < 25) {
      category = "normal";
      message = "You have a normal weight.";
    } else if (bmi < 30) {
      category = "overweight";
      message = "You are overweight.";
    } else {
      category = "obese";
      message = "You are obese.";
    }
  
    resultEl.textContent = `Your BMI is ${bmiRounded}. ${message}`;
    resultEl.classList.add(category);
  }  