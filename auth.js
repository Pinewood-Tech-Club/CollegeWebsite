// Assuming 'auth' and 'db' are already initialized Firebase Authentication and Firestore instances

// Listen for auth state changes
auth.onAuthStateChanged(user => {

    // Select elements outside the condition to avoid repetition
    var signoutButton = document.querySelector('#signout-button');
    var buttons = document.querySelectorAll("#nav-link");
    var signedOutContent = document.getElementById('signedOutContent');
    var signinButton = null;
    var signupButton = null;
    var accordion = document.getElementById("addContentButton");
    var editContentButton = document.getElementById("editContent");
    var commentButton = document.getElementById("addCommentButton");
    var participationButton = document.getElementById("participated");

    // Iterate to find sign in and sign up buttons
    buttons.forEach(button => {
        if (button.innerHTML.trim() === "Sign In") {
            signinButton = button;
        } else if (button.innerHTML.trim() === "Sign Up") {
            signupButton = button;
        }
    });

    if (user) {
        // Simplified user check
        let toastMessage = document.getElementById("toastMessage");
        toastMessage.classList.add("show");

        let toastBody = document.getElementById("toastBody");
        toastBody.innerHTML = "Welcome (back) " + user.email;
        console.log(user.email);

        // Adjust button visibility based on user state
        signoutButton.style.display = "flex";
        signinButton.style.display = "none";
        signupButton.style.display = "none";
        signedOutContent.style.display = "none";

        // Fetch user data or set permissions
        db.collection("users").doc(user.email).get().then(doc => {
            if (doc.exists) {
                let accountType = returnPermissions(user.email);
                console.log("Setting account type:", accountType);
                // User data exists, handle accordingly
                console.log("Document data:", doc.data());
            }
        }).catch(error => {
            console.error("Error getting user data:", error);
        });
    } else {
        // Handle signed-out state
        signoutButton.style.display = "none";
        signinButton.style.display = "flex";
        signupButton.style.display = "flex";
        signedOutContent.style.display = "block";
        hideContent('contentContainer');
    }

    db.collection("users").doc(user.email).get().then(doc => {
        if (doc.exists) {
            const userData = doc.data();
            console.log(userData);
            const accountType = userData.accountType;
            console.log(accountType);
            switch(accountType) {
                case "viewer":
                    accordion.style.display = "none";
                    editContentButton.style.display = "none";
                    commentButton.style.display = "none";
                    participationButton.style.display = "none";
                    break;
                case "content creator":
                    editContentButton.style.display = "none";
                    commentButton.style.display = "flex";
                    participationButton.style.display = "flex";
                    accordion.style.display = "flex";
                    break;
                case "admin":
                    editContentButton.style.display = "flex";
                    commentButton.style.display = "none";
                    participationButton.style.display = "none";
                    accordion.style.display = "none";
                default:
                    break;
            }
        }   else {
            console.log("User data not found")
        }
    }).catch(error => {
        console.error("Error getting user data:", error);
    })
});

// Utility function for hiding content by class
function hideContent(hiddenClass) {
    let elements = document.getElementsByClassName(hiddenClass);
    Array.from(elements).forEach(element => {
        element.style.display = "none";
    });
}

// Function to determine user permissions
function returnPermissions(email) {
    if (email.endsWith("@pinewood.edu")) {
        if (/^[^\d]/.test(email)) {
            return "admin";
        } else {
            return "content creator";
        }
    } else {
        return "viewer";
    }
}

// Sign-In Form Event Listener
const signinform = document.querySelector('#signin-form');
signinform.addEventListener('submit', e => {
    e.preventDefault();
    const email = signinform['emailInputSignIn'].value;
    const password = signinform['passwordInputSignIn'].value;

    auth.signInWithEmailAndPassword(email, password)
        .then(cred => {
            // Assuming you want to reset and redirect here
            signinform.reset();
            window.location.href = "index.html"; // Consider using a more dynamic approach or SPA routing
        })
        .catch(error => {
            alert(error.message);
        });
});

// Sign-Up Form Event Listener
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', e => {
    e.preventDefault();

    const email = signupForm['emailInputSignUp'].value.toLowerCase();
    const password = signupForm['passwordInputSignUp'].value;
    const fullName = signupForm['fullNameInputSignUp'].value;
    const grade = signupForm['gradeInputSignUp'].value;

    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        // Set user data in Firestore
        return db.collection("users").doc(email).set({
            name: fullName,
            grade: grade,
            accountType: returnPermissions(email) // Use the returnPermissions function to set account type
        });
    }).then(() => {
        window.location.href = "index.html";
        alert("Sign Up Successful!");
        console.log(accountType);
    }).catch(error => {
        alert(error.message);
    });
});

// Sign-Out Event Listener
const signout = document.querySelector('#signout-button');
signout.addEventListener('click', e => {
    e.preventDefault();
    auth.signOut().then(() => {
        window.location.href = "index.html";
    }).catch(error => {
        alert(error.message);
    });
});

// Google Sign-In
var provider = new firebase.auth.GoogleAuthProvider();
document.getElementById('google-signin-btn').addEventListener('click', function() {
    firebase.auth().signInWithPopup(provider).then(result => {
        window.location.href = "index.html";
    }).catch(error => {
        alert(error.message);
    });
});
