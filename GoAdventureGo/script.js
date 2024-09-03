account1 = {
    email: "prashanth@gmail.com",
    password: 12345,
};

account2 = {
    email: "rohit@gmail.com",
    password: 56789,
};

accounts = [account1, account2];


// login
const inputlogin = document.querySelector(".auth-btn");
const inputemail = document.querySelector(".email");
const inputpassword = document.querySelector(".password");



let currentAccount;
inputlogin.addEventListener("click", function (e) {
    e.preventDefault();

    currentAccount = accounts.find(acc => acc.email === inputemail.value);

    if(currentAccount.password === Number(inputpassword.value)){
        console.log("Login Successful");
        window.location.href = "payments.html";
    }
});


