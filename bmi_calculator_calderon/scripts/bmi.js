// Add your BMI calculator JavaScript code here

//to not prematurely display the different BMI categories
document.querySelector('.alert-obese').style.display = 'none';
document.querySelector('.alert-overweight').style.display = 'none';
document.querySelector('.alert-normal').style.display = 'none';
document.querySelector('.alert-underweight').style.display = 'none';
document.querySelector('.alert-invalid').style.display = 'none';
document.querySelector("#loading").style.display = "none";

document.getElementById("calculate-btn").addEventListener("click", function(){
    document.querySelector('.alert-obese').style.display = 'none';
    document.querySelector('.alert-overweight').style.display = 'none';
    document.querySelector('.alert-normal').style.display = 'none';
    document.querySelector('.alert-underweight').style.display = 'none';
    document.querySelector('.alert-invalid').style.display = 'none';

    document.querySelector("#loading").style.display = "block";

    //get the value of the user's input
    var height = document.getElementById("height").value;
    var weight = document.getElementById("weight").value;
    var bmiResult = document.querySelectorAll(".bmiResult");

    if (isNaN(weight) || weight <= 0 || isNaN(height) || height <= 0) {
        document.querySelector("#loading").style.display = "none";
        document.querySelector('.alert-invalid').style.display = 'block';
    } 
    else{   
        //formula for the bmi
        var bmi = Number(weight / (height * height)).toFixed(2);
        
        //adds some texts to the class bmiResult which displays the user's BMI
        bmiResult.forEach(item => {
            item.innerHTML = `<strong style="font-size: 30px">Your BMI is: ${bmi}</strong><br />`;  
        });

        //does some fancy(imo) thing and displays the user's category
        setTimeout(function() {
            document.querySelector("#loading").style.display = "none";

            if (bmi < 18.5) {    
                document.querySelector('.alert-underweight').style.display = 'block';
            } else if (bmi >= 18.5 && bmi < 24.9) {      
                document.querySelector('.alert-normal').style.display = 'block';
            } else if (bmi >= 25 && bmi < 29.9) {
                document.querySelector('.alert-overweight').style.display = 'block';
            } else {
                document.querySelector('.alert-obese').style.display = 'block';
            }
        }, 1200);
    }
    
    

});




// document.getElementById('register-btn').addEventListener('click', function() {
//             const name = document.getElementById('name').value;
//             const birthdate = new Date(document.getElementById('birthdate').value);
//             const today = new Date();
//             const age = today.getFullYear() - birthdate.getFullYear();

//             document.querySelector('.alert').classList.remove('alert-success', 'alert-danger')
//             document.querySelector('.alert').style.display = 'block';
//             document.getElementById('.alert #name').textContent = name;
//             document.querySelector('.alert #age').textContent = age;
//             document.querySelector('.alert').classlist.add(age >= 18 ? 'alert-success' : 'alert-danger');
//         });

//         document.querySelector('.alert').style.display = 'none';