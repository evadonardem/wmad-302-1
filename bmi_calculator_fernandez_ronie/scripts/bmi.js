document.getElementById("bmiForm").addEventListener("submit", function(e) {
  e.preventDefault();

  // Get input values (meters and kilograms)
  const height = parseFloat(document.getElementById("height").value);
  const weight = parseFloat(document.getElementById("weight").value);

  // Calculate BMI
  if (height > 0 && weight > 0) {
    const bmi = (weight / (height * height)).toFixed(2);

    // Show result
    document.getElementById("bmiResult").textContent = bmi;

    // Classify BMI with icons
    let category = "";
    let icon = "";
    let categoryElement = document.getElementById("bmiCategory");

    if (bmi < 18.5) {
      category = "You are Underweight! Eat more " + '<i class="fa-solid fa-face-smile-wink"></i>';
      icon = '<i class="fa-solid fa-triangle-exclamation"></i> ';
      categoryElement.className = "text-warning fw-bold";
      
    } else if (bmi < 24.9) {
      category = "Normal Weight, Congrats!" + '<i class="fa-solid fa-thumbs-up"></i>';
      icon = '<i class="fa-solid fa-smile"></i> ';
      categoryElement.className = "text-success fw-bold";

    } else if (bmi < 29.9) {
      category = "You are Overweight. Just a bit of exercise will do!" + '<i class="fa-solid fa-face-smile"></i>';
      icon = '<i class="fa-solid fa-circle-exclamation"></i> ';
      categoryElement.className = "text-primary fw-bold";

    } else {
      category = "You are Obese! Calorie Deficit is the Key!" + '<i class="fa-solid fa-burger"></i>';
      icon = '<i class="fa-solid fa-skull-crossbones"></i> ';
      categoryElement.className = "text-danger fw-bold";
    }

    // Insert icon + category
    categoryElement.innerHTML = icon + category;

  } else {
    alert("Please enter valid values for height (m) and weight (kg).");
  }
});
