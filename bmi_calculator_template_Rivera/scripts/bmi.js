// Background Animation (Particles)
const canvas = document.getElementById("bgAnimation");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
for (let i = 0; i < 50; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3,
        dx: (Math.random() - 0.5) * 1.5,
        dy: (Math.random() - 0.5) * 1.5
    });
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 200, 255, 0.6)";
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// Resize canvas on window resize
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// BMI Calculator with Font Awesome icons
document.getElementById("bmiForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let weight = parseFloat(document.getElementById("weight").value);
    let height = parseFloat(document.getElementById("height").value);

    if (weight > 0 && height > 0) {
        let bmi = weight / (height * height);
        let resultText = `Your BMI is ${bmi.toFixed(1)} - `;

        if (bmi < 18.5) {
            resultText += `<i class="fa-solid fa-face-frown text-warning"></i> Underweight`;
        } else if (bmi < 25) {
            resultText += `<i class="fa-solid fa-face-smile text-success"></i> Normal`;
        } else if (bmi < 30) {
            resultText += `<i class="fa-solid fa-face-meh text-primary"></i> Overweight`;
        } else if (bmi < 40) {
            resultText += `<i class="fa-solid fa-face-sad-tear text-danger"></i> Obese`;
        } else {
            resultText += `<i class="fa-solid fa-skull-crossbones text-dark"></i> Extreme Obese`;
        }

        document.getElementById("bmiResult").innerHTML = resultText;
    } else {
        document.getElementById("bmiResult").innerHTML =
            `<i class="fa-solid fa-triangle-exclamation text-danger"></i> Please enter valid values!`;
    }
});