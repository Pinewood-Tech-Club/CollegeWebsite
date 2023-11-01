auth.onAuthStateChanged(user => {
    console.log(user ? 'user signed in' : 'user signed out');

    var signinbutton = null;
    var signoutbutton = document.querySelector('#signout-button');
    var signupbutton = null;
    var buttons = document.querySelectorAll("#nav-link");
    var signedOutContent = document.getElementById('signedOutContent');
    //alert(buttons.length);
    for (var i = 0; i < buttons.length; i++) {
        var s = buttons[i].innerHTML.trim()
        //alert(s)
        if (s == "Sign In"){
            signinbutton = buttons[i];
        }
        if (s == "Sign Up"){
            signupbutton = buttons[i];
        }
    }

    if (user){
        signoutbutton.style.display = "flex";
        signinbutton.style.display = "none";
        signupbutton.style.display = "none";
        signedOutContent.style.display = "none";
        
    }
    else{
        signoutbutton.style.display = "none";
        signinbutton.style.display = "flex";
        signupbutton.style.display = "flex";
        hideContent('contentContainer');
        signedOutContent.style.display = "block";
    }
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const signinform = document.querySelector('#signin-form')
signinform.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signinform['emailInputSignIn'].value;
    const password = signinform['passwordInputSignIn'].value;
    
    auth.signInWithEmailAndPassword(email, password).then(cred => {
        signinform.reset();
        window.location.href = "index.html";
        alert("Login Successful");
    }).catch(error => {
        if (error.code === 'auth/invalid-email') {
            alert("Invalid email");
        } else if (error.code === 'auth/user-not-found') {
            alert("We don't got that email bro");
        } else if (error.code === 'auth/wrong-password') {
            alert("Wrong password!")
        }
    });
})

const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // get user info
    const email = signupForm['emailInputSignUp'].value;
    const password = signupForm['passwordInputSignUp'].value;

    // sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        signupForm.reset();
        window.location.href = "index.html";
        alert("Sign Up Successful");
    });
});

const signout = document.querySelector('#signout-button');
signout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut().then(function(){
    window.location.href = "index.html";
    alert("User Logged Out")
  });
}); 

function hideContent(hiddenClass) {
    elements = document.getElementsByClassName(hiddenClass);

    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = "none";
    }
};