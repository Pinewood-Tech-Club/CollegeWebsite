var username = document.getElementById("username_input");
var password = document.getElementById("password_input");
var button = document.getElementById("login");
button.addEventListener("click", LogInCheck);

var loggedInUsers = [{username: "tony", password: "wu"}, {username: "zgalbs", password: "yur"}];

function LogInCheck(){
    if (username.value == "" || password.value == ""){
        alert("Please enter something")
    }
    else{
        for (var i = 0; i < loggedInUsers.length; i++){
            if (loggedInUsers[i].username == username.value && loggedInUsers[i].password == password.value){
                alert("Logged In!")
            }
            else{
                alert("Invalid Login!")
            }
        }
    }
}

