auth.onAuthStateChanged(user => {
    console.log(user ? 'user signed in' : 'user signed out');
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
    })
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
  window.location.href = "index.html";
}); 