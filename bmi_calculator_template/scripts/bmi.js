// Add your BMI calculator JavaScript code here

    // 🌌 Generate stars
    const rainContainer = document.querySelector('.rain');
    for (let i = 0; i < 200; i++) {
      const drop = document.createElement('div');
      drop.classList.add('drop');
      drop.style.left = Math.random() * window.innerWidth + 'px';
      drop.style.top = Math.random() * window.innerHeight + 'px';
      drop.style.animationDuration = (1 + Math.random() * 2) + 's';
      rainContainer.appendChild(drop);
    }

    // Shooting stars
    setInterval(() => {
      const star = document.createElement('div');
      star.classList.add('shooting-star');
      star.style.left = Math.random() * window.innerWidth + 'px';
      star.style.top = Math.random() * window.innerHeight / 2 + 'px';
      rainContainer.appendChild(star);
      setTimeout(() => star.remove(), 1500);
    }, 4000);

    // BMI Calculation
    document.getElementById('bmiForm').addEventListener('submit', function (e) {
      e.preventDefault();

      const height = parseFloat(document.getElementById('height').value);
      const weight = parseFloat(document.getElementById('weight').value);
      const resultDiv = document.getElementById('result');

      if (height > 0 && weight > 0) {
        const bmi = (weight / (height * height)).toFixed(2);
        let category = '';
        let progress = 0;

        if (bmi < 18.5) { category = 'Underweight'; progress = 20; }
        else if (bmi < 24.9) { category = 'Normal'; progress = 50; }
        else if (bmi < 29.9) { category = 'Overweight'; progress = 75; }
        else { category = 'Obese'; progress = 95; }

        resultDiv.innerHTML = `
          <h4>Your BMI is <strong class="text-info">${bmi}</strong></h4>
          <p class="fw-bold">You are <span>${category}</span>.</p>
          <div class="progress">
            <div class="progress-bar" style="width:${progress}%"></div>
          </div>
        `;
        resultDiv.classList.add("show");
      } else {
        resultDiv.innerHTML = `
          <div class="alert alert-danger">
            <i class="fas fa-exclamation-circle me-2"></i>Please enter valid height and weight.
          </div>
        `;
        resultDiv.classList.add("show");
      }
    });