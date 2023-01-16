//get html elements from log in page
const login = document.getElementById("form");
const btn = document.getElementById("logBtn");
const error = document.getElementById("error");

//event listener for mouse click
btn.addEventListener("click", (e) => {
    e.preventDefault();

    //user input is inserted into variable
    const uName = login.username.value;
    const pass = login.psw.value;

    //check if username and pass match
    if (uName=="pardy" && pass == "friday") {
        //if correct, relocate to main game
        window.location.replace("main.html");

    }

    //else, error message
    else{
        error.style.opacity = 1;
    }
});