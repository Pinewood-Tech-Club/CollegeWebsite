//make auth and firestore references
const auth = firebase.auth();
const db = firebase.firestore();

auth.onAuthStateChanged(user =>{
    console.log(user);
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
        alert(1);
        signinform.reset();
        sleep(1000).then(() => { window.location.href = "index.html"; });
    })
})