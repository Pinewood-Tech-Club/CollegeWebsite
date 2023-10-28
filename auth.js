auth.onAuthStateChanged(user => {
    console.log(user ? 'user signed in' : 'user signed out');

    var signinbutton = null;
    var signoutbutton = document.querySelector('#signout-button');
    var signupbutton = null;
    var buttons = document.querySelectorAll("#nav-link");
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

    if (user == null){

        signoutbutton.hidden = true;
        signinbutton.hidden = false;
        signupbutton.hidden = false;
        
    }
    else{
        signoutbutton.hidden = false;
        signinbutton.hidden = true;
        signupbutton.hidden = true;
    }
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const signinform = document.querySelector('#signin-form')
signinform.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = signinform['email_input'].value;
    const password = signinform['password_input'].value;
    
    auth.signInWithEmailAndPassword(email, password).then(cred => {
        signinform.reset();
        window.location.href = "index.html";
    }).catch(error => {
        if (error.code === 'auth/invalid-email') {
            alert("Invalid email");
        } else {
            alert("We don't got that email bro");
        }
    });
})

const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // get user info
    const email = signupForm['email_input'].value;
    const password = signupForm['password_input'].value;

    // sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        signupForm.reset();
        window.location.href = "index.html";
    });
});

const signout = document.querySelector('#signout-button');
signout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut().then(function(){
    window.location.href = "index.html";
  });
}); 