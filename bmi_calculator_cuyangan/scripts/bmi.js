// Add your BMI calculator JavaScript code here

document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("bmiForm");
  var result = document.getElementById("bmiResult");
  var tips = document.getElementById("bmiTips");
  var historyList = document.getElementById("bmiHistory");
  var clearBtn = document.getElementById("clearBtn");
  var exportBtn = document.getElementById("exportBtn");

  loadHistory();

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var height = parseFloat(document.getElementById("height").value);
    var weight = parseFloat(document.getElementById("weight").value);

    if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
      result.innerHTML = `<div class="alert alert-danger">Please enter valid height and weight.</div>`;
      tips.innerHTML = "";
      return;
    }

    var bmi = weight / ((height / 100) ** 2);
    var category = "";
    var advice = "";
    var categoryId = "";

    ["underweight", "healthy", "overweight", "obese"].forEach(id => {
      const row = document.getElementById(`category-${id}`);
      if (row) row.classList.remove("animate-category");
    });

    if (bmi < 18.5) {
      category = "Underweight";
      categoryId = "underweight";
      advice = "Consider a balanced diet with more calories and strength training to build muscle.";
    } else if (bmi < 24.9) {
      category = "Normal weight";
      categoryId = "healthy";
      advice = "Keep up the good work! Maintain your weight with regular exercise and healthy eating.";
    } else if (bmi < 29.9) {
      category = "Overweight";
      categoryId = "overweight";
      advice = "Try incorporating more cardio and portion control into your routine.";
    } else {
      category = "Obese";
      categoryId = "obese";
      advice = "Consult a healthcare provider. Focus on gradual weight loss through diet and activity.";
    }

    const categoryRow = document.getElementById(`category-${categoryId}`);
    if (categoryRow) {
      categoryRow.classList.add("animate-category");
    }

    var entry = {
      date: new Date().toLocaleString(),
      height: height,
      weight: weight,
      bmi: bmi.toFixed(2),
      category: category
    };

    saveToHistory(entry);
    loadHistory();

    result.innerHTML = `
      <div class="alert alert-info">
        <strong>Your BMI:</strong> ${entry.bmi}<br>
        <strong>Category:</strong> ${category}
      </div>
      <div class="progress mt-3">
        <div class="progress-bar bg-${bmi < 18.5 ? 'warning' : bmi < 24.9 ? 'success' : bmi < 29.9 ? 'info' : 'danger'}"
             role="progressbar"
             style="width: ${Math.min((bmi / 40) * 100, 100)}%"
             aria-valuenow="${entry.bmi}"
             aria-valuemin="0"
             aria-valuemax="40">
          ${entry.bmi}
        </div>
      </div>
    `;

    tips.innerHTML = `
    <div class="alert alert-secondary">
        <i class="fas fa-lightbulb"></i> <strong>Health Tip:</strong> ${advice}
    </div>
    `;
  });

  clearBtn.addEventListener("click", function () {
    localStorage.removeItem("bmiHistory");
    loadHistory();
    alert("BMI history cleared.");
  });

  exportBtn.addEventListener("click", function () {
    var history = JSON.parse(localStorage.getItem("bmiHistory")) || [];
    if (history.length === 0) {
      alert("No history to export.");
      return;
    }

    var csv = "Date,Height (cm),Weight (kg),BMI,Category\n";
    history.forEach(function (entry) {
      csv += `${entry.date},${entry.height},${entry.weight},${entry.bmi},${entry.category}\n`;
    });

    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "bmi_history.csv";
    link.click();
  });

  function saveToHistory(entry) {
    var history = JSON.parse(localStorage.getItem("bmiHistory")) || [];
    history.unshift(entry);
    localStorage.setItem("bmiHistory", JSON.stringify(history.slice(0, 10)));
  }

  function loadHistory() {
    var history = JSON.parse(localStorage.getItem("bmiHistory")) || [];
    historyList.innerHTML = "";

    if (history.length === 0) {
      historyList.innerHTML = `<p class="text-muted">No history yet.</p>`;
      return;
    }

    history.forEach(function (entry) {
      var item = document.createElement("li");
      item.className = "list-group-item";
      item.innerHTML = `
        <strong>${entry.date}</strong><br>
        Height: ${entry.height} cm, Weight: ${entry.weight} kg<br>
        BMI: ${entry.bmi} (${entry.category})
      `;
      historyList.appendChild(item);
    });
  }
});