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

// Ensure the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Access the sign-in form
    const signinform = document.querySelector('#signin-form');
    
    // Add an event listener for the form submission
    signinform.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        
        // Get user info from form inputs
        const email = signinform['emailInputSignIn'].value;
        const password = signinform['passwordInputSignIn'].value;
       
        // Sign in the user with Firebase Authentication
        auth.signInWithEmailAndPassword(email, password).then(cred => {
            // Reset the form
            signinform.reset();
            // Redirect the user or update UI as needed
            window.location.href = "index.html"; // Or any other page
            alert("Login Successful");
        }).catch(error => {
            // Handle errors such as invalid email, user not found, or wrong password
            switch(error.code) {
                case 'auth/invalid-email':
                    alert("Invalid email format.");
                    break;
                case 'auth/user-not-found':
                    alert("User not found.");
                    break;
                case 'auth/wrong-password':
                    alert("Incorrect password.");
                    break;
                default:
                    alert("Error signing in: " + error.message);
                    console.log(error.message);
            }
        });
        // will return admin, viewer, or content creator
        returnPermissions(email);
    });
});


/*const signupForm = document.querySelector('#signup-form');
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

        /*
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
}); */

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

function returnPermissions(email) {
    // Check if the email domain is @pinewood.edu
    if (email.endsWith("@pinewood.edu")) {
        // Check if the email does not start with a number
        // ^[^\d] means the string starts with any character except digits
        if (/^[^\d]/.test(email)) {
            return "admin";
        } else {
            // If it starts with a number or any other case within @pinewood domain
            return "content creator";
        }
    } else {
        // Everyone else is a viewer
        return "viewer";
    }
}
