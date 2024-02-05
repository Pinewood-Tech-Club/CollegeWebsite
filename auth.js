auth.onAuthStateChanged(user => {
    console.log(user ? 'user signed in' : 'user signed out');

    if (user) {
        toastMessage = document.getElementById("toastMessage");
        //alert(toastMessage);
        toastMessage.classList.add("show");

        toastBody = document.getElementById("toastBody");
        toastBody.innerHTML = "welcome (back) " + user.email;
        console.log(user.email);
    }
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
        // getUsers(user.email).then(results => {
        //     if (results[0].accountType == "viewer"){
        //         hideContent("notforViewers")
        //     }
        // })
    }
    else{
        signoutbutton.style.display = "none";
        //contentContainer.style.display = "none";
        signinbutton.style.display = "flex";
        signupbutton.style.display = "flex";
        hideContent('contentContainer');
        signedOutContent.style.display = "block";
    }

    getUsers(user.email).then(results => {
        console.log(results);
        //ARNAV START HERE
    }).catch(error => {
        console.error("Error getting users:", error);
    });
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
            alert("Invalid User");
        } else if (error.code === 'auth/wrong-password') {
            alert("Wrong password!")
        }
    })
})

const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // get user info
    const email = signupForm['emailInputSignUp'].value.toLowerCase();
    const password = signupForm['passwordInputSignUp'].value;
    const fullName = signupForm['fullNameInputSignUp'].value;
    const grade = signupForm['gradeInputSignUp'].value;

    // sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        
        signupForm.reset();


        /*viewer can
        1. view and search for summer camps
        2. can see number of pw participants for summer camps
        3. can see comments but cannot comment
        */

        /*content creators can
        1. add programs/content
        2. can interact with the I partcipated button
        3. can comment
        */

        /*admins can
        1. do everything a content creator can
        2. edit content
        3. delete participants
        4. delete comments
        */

        db.collection("users").doc(email).set({
            name: fullName,
            grade: grade,
            accountType: "viewer",
        })
        .then(() => {
            window.location.href = "index.html";
            alert("Sign Up Successful!");
        })
    }).catch(function(error) {
        alert(error.message);
    });
});

const signout = document.querySelector('#signout-button');
signout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut().then(function(){
    window.location.href = "index.html";
    alert("User Logged Out")
  }).catch(function(error) {
    alert(error.message);
  });
}); 

function hideContent(hiddenClass) {
    elements = document.getElementsByClassName(hiddenClass);
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = "none";
    }
};

// google auth sign up
// Initialize the Google provider object
var provider = new firebase.auth.GoogleAuthProvider();

// Attach an onClick event to the Google Sign-In button
document.getElementById('google-signin-btn').addEventListener('click', function() {
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        alert("Login Successful with Google");
        alert(auth.currentUser.displayName);
        window.location.href = "index.html";
    }).catch(function(error) {
        alert(error.message);
    });
});
