document.getElementById("bmiForm").addEventListener("submit", function(event) {
  event.preventDefault();

  let weight = parseFloat(document.getElementById("weight").value);
  let height = parseFloat(document.getElementById("height").value);

  if (weight > 0 && height > 0) {
    // BMI formula with height in meters
    let bmi = weight / (height * height);
    let resultText = `Your BMI is ${bmi.toFixed(1)} - `;

    if (bmi < 18.5) {
      resultText += "Underweight 😟";
    } else if (bmi < 25) {
      resultText += "Normal 🙂";
    } else if (bmi < 30) {
      resultText += "Overweight 😐";
    } else if (bmi < 40) {
      resultText += "Obese 😟";
    } else {
      resultText += "Extreme Obese 💩";
    }

    document.getElementById("bmiResult").innerText = resultText;
  } else {
    document.getElementById("bmiResult").innerText = "Please enter valid values!";
  }
});
