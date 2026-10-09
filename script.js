let balance = 50000;

function transferMoney(event) {
    event.preventDefault();

    let receiver = document.getElementById("receiver").value;
    let receiverAccount = document.getElementById("receiverAccount").value;
    let amount = document.getElementById("amount").value;

    if (receiverAccount.length < 10) {
        document.getElementById("transferMessage").innerHTML =
            "Please enter a valid receiver account number.";
        return;
    }

    document.getElementById("transferMessage").innerHTML =
        "₹" + amount + " transferred successfully to " +
        receiver + " (Account: " + receiverAccount + ").";

    document.getElementById("receiver").value = "";
    document.getElementById("receiverAccount").value = "";
    document.getElementById("amount").value = "";
}



function payBill() {

    let billType = document.getElementById("billType").value;
    let amount = Number(document.getElementById("billAmount").value);
    let message = document.getElementById("billMessage");

    if (billType === "" || amount <= 0) {
        message.innerHTML = "Please select a bill and enter amount.";
        message.style.color = "red";
        return;
    }

    if (amount > balance) {
        message.innerHTML = "Insufficient balance!";
        message.style.color = "red";
        return;
    }

    balance -= amount;

    document.getElementById("balance").innerHTML =
        "₹" + balance.toLocaleString("en-IN");

    message.innerHTML =
        billType + " bill of ₹" +
        amount.toLocaleString("en-IN") +
        " paid successfully.";

    message.style.color = "green";

    document.getElementById("billAmount").value = "";
}

function requestLoan(event) {

    event.preventDefault();

    let name = document.getElementById("loanName").value;
    let loanType = document.getElementById("loanType").value;
    let amount = document.getElementById("loanAmount").value;

    let message = document.getElementById("loanMessage");

    message.innerHTML =
        "Loan request submitted successfully for " +
        name + ".<br>" +
        "Loan Type: " + loanType +
        "<br>Amount: ₹" + Number(amount).toLocaleString("en-IN");

    message.style.color = "green";

    document.getElementById("loanName").value = "";
    document.getElementById("loanAmount").value = "";
}

function logout() {

    alert("You have been logged out successfully!");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}



function registerUser(event) {

    event.preventDefault();

    let name =
        document.getElementById("regName").value;

    let email =
        document.getElementById("regEmail").value;

    let mobile =
        document.getElementById("regMobile").value;

    let accountType =
        document.getElementById("regAccountType").value;

    let password =
        document.getElementById("regPassword").value;

    let confirmPassword =
        document.getElementById("regConfirmPassword").value;

    let message =
        document.getElementById("registerMessage");


  

    if (password !== confirmPassword) {

        message.innerHTML =
            "Passwords do not match.";

        message.style.color = "red";

        return;
    }


    

    if (password.length < 6) {

        message.innerHTML =
            "Password must contain at least 6 characters.";

        message.style.color = "red";

        return;
    }


    

    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userMobile", mobile);
    localStorage.setItem("accountType", accountType);
    localStorage.setItem("userPassword", password);


    

    message.innerHTML =
        "You are registered successfully!";

    message.style.color = "green";


    

    setTimeout(function () {

        window.location.href = "login.html";

    }, 1500);
}




function loginUser(event) {

    event.preventDefault();

    let email =
        document.getElementById("loginEmail").value;

    let password =
        document.getElementById("loginPassword").value;


    let savedEmail =
        localStorage.getItem("userEmail");

    let savedPassword =
        localStorage.getItem("userPassword");


    let message =
        document.getElementById("loginMessage");


    

    if (
        email === savedEmail &&
        password === savedPassword
    ) {

        

        message.innerHTML =
            "You are logged in successfully!";

        message.style.color = "green";


        

        setTimeout(function () {

            window.location.href = "index.html";

        }, 1500);

    }

    else {

        message.innerHTML =
            "Invalid email or password.";

        message.style.color = "red";

    }
}


let expenses = [];

function addExpense(event) {

    event.preventDefault();

    let description =
        document.getElementById("expenseDescription").value;

    let amount =
        parseFloat(document.getElementById("expenseAmount").value);

    let category =
        document.getElementById("expenseCategory").value;


    if (description === "" ||
        isNaN(amount) ||
        amount <= 0 ||
        category === "") {

        alert("Please enter valid expense details.");
        return;
    }


    let expense = {
        description: description,
        amount: amount,
        category: category
    };


    expenses.push(expense);


    displayExpenses();

    analyzeExpenses();



    document.getElementById("expenseDescription").value = "";
    document.getElementById("expenseAmount").value = "";
    document.getElementById("expenseCategory").value = "";
}




function displayExpenses() {

    let table =
        document.getElementById("expenseTable");

    table.innerHTML = "";


    expenses.forEach(function(expense) {

        let row = document.createElement("tr");


        row.innerHTML = `
            <td>${expense.description}</td>
            <td>${expense.category}</td>
            <td class="debit">
                -₹${expense.amount.toFixed(2)}
            </td>
        `;


        table.appendChild(row);

    });

}




function analyzeExpenses() {

    let total = 0;

    let highest = 0;

    let categoryTotals = {};


    expenses.forEach(function(expense) {

        total += expense.amount;


        if (expense.amount > highest) {

            highest = expense.amount;

        }


        if (categoryTotals[expense.category]) {

            categoryTotals[expense.category] +=
                expense.amount;

        } else {

            categoryTotals[expense.category] =
                expense.amount;

        }

    });




    document.getElementById("totalExpense").innerText =
        "₹" + total.toFixed(2);


    document.getElementById("highestExpense").innerText =
        "₹" + highest.toFixed(2);


    document.getElementById("expenseCount").innerText =
        expenses.length;




    let highestCategory = "";

    let highestCategoryAmount = 0;


    for (let category in categoryTotals) {

        if (categoryTotals[category] >
            highestCategoryAmount) {

            highestCategoryAmount =
                categoryTotals[category];

            highestCategory = category;

        }

    }




    let percentage =
        (highestCategoryAmount / total) * 100;



    let advice =
        "Your highest spending category is " +
        highestCategory +
        " with ₹" +
        highestCategoryAmount.toFixed(2) +
        " (" +
        percentage.toFixed(1) +
        "% of your total expenses). ";




    if (percentage >= 50) {

        advice +=
            " You are spending a large amount " +
            "in this category. Try to reduce your spending.";

    }

    else if (percentage >= 30) {

        advice +=
            "Consider monitoring your spending money " +
            "in this category.";

    }

    else {

        advice +=
            " Your expenses are reasonably spended.";

    }


    document.getElementById("expenseAdvice").innerText =
        advice;

}



