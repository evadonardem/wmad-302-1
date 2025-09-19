jfunction updateValues() {
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;

    document.getElementById('heightValue').innerText = height;
    document.getElementById('weightValue').innerText = weight;

    const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
    document.getElementById('bmiResult').innerText = `BMI: ${bmi}`;

    let category = "";
    let iconHtml = "";

    if (bmi < 18.5) {
        category = "Thin";
        iconHtml = '<i class="fa-solid fa-child-reaching" style="color:#00ffff; text-shadow:0 0 12px #00ffff;"></i>';
    } else if (bmi < 25) {
        category = "Normal";
        iconHtml = '<i class="fa-solid fa-dumbbell" style="color:#39ff14; text-shadow:0 0 12px #39ff14;"></i>';
    } else if (bmi < 30) {
        category = "Overweight";
        iconHtml = '<i class="fa-solid fa-weight-scale" style="color:#ffea00; text-shadow:0 0 12px #ffea00;"></i>';
    } else {
        category = "Obese";
        // Two icons side by side (stomach + hanging weight)
        iconHtml = '<i class="fa-solid fa-weight-hanging" style="color:#ff3131; text-shadow:0 0 12px #ff3131;"></i> ' +
                   '<i class="fa-solid fa-stomach" style="color:#ff00ff; text-shadow:0 0 12px #ff00ff;"></i>';
    }

    document.getElementById('bmiCategory').innerText = category;
    document.getElementById('bmiIcon').innerHTML = iconHtml;
}

// Run once when the page loads
updateValues();
