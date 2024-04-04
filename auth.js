// Assuming 'auth' and 'db' are already initialized Firebase Authentication and Firestore instances
function setPermissions(email) {
    var accordion = document.getElementById("addContentButton");
    var editContentButton = document.getElementById("editContent");
    var commentButton = document.getElementById("addCommentButton");
    var participationButton = document.getElementById("participated");
    var fullNameAndGrade = document.getElementById("FullNameAndGrade");
    var participantsList = document.getElementById("participantsList");
    var participantNumber = document.getElementById("participantNumber");
    var report = document.getElementById("report");
    var history = document.getElementById("history");
    var bottomButtons = document.getElementById("bottomButtons");

    db.collection("users").doc(email).get().then(doc => {
        if (doc.exists) {
            const userData = doc.data();
            console.log(userData);
            const accountType = userData.accountType;
            console.log(accountType);
            switch(accountType) {
                case "viewer":
                    fullNameAndGrade.style.display = "none";
                    participantsList.style.display = "none";
                    participantNumber.style.display = "flex";
                    accordion.style.display = "none";
                    editContentButton.style.display = "none";
                    commentButton.style.display = "none";
                    participationButton.style.display = "none";
                    bottomButtons.style.display = "none";
                    break;
                case "content creator":
                    fullNameAndGrade.style.display = "none";
                    participantsList.style.display = "none";
                    participantNumber.style.display = "flex";
                    editContentButton.style.display = "none";
                    commentButton.style.display = "flex";
                    participationButton.style.display = "flex";
                    accordion.style.display = "flex";
                    bottomButtons.style.display = "none";
                    break;
                case "admin":
                    fullNameAndGrade.style.display = "flex";
                    participantsList.style.display = "flex";
                    participantNumber.style.display = "block";
                    editContentButton.style.display = "flex";
                    commentButton.style.display = "none";
                    participationButton.style.display = "none";
                    accordion.style.display = "flex";
                    bottomButtons.style.display = "flex";

                default:
                    break;
            }
        }   else {
            console.log("User data not found")
        }
    }).catch(error => {
        console.error("Error getting user data:", error);
    })
}
// Listen for auth state changes
auth.onAuthStateChanged(user => {
    // Select elements outside the condition to avoid repetition
    var signoutButton = document.querySelector('#signout-button');
    var buttons = document.querySelectorAll("#nav-link");
    var signedOutContent = document.getElementById('signedOutContent');
    var bottomButtons = document.getElementById('bottomButtons'); // Ensure this element exists in your HTML
    var signinButton = null;
    var signupButton = null;

    // Iterate to find sign in and sign up buttons
    buttons.forEach(button => {
        if (button.innerHTML.trim() === "Sign In") {
            signinButton = button;
        } else if (button.innerHTML.trim() === "Sign Up") {
            signupButton = button;
        }
    });

    // Ensure we have all necessary elements before proceeding
    if (signoutButton && signinButton && signupButton && signedOutContent && bottomButtons) {
        if (user && user.emailVerified) {
            // User is signed in and email is verified
            console.log("User verified:", user.emailVerified);
            let toastMessage = document.getElementById("toastMessage");
            let toastBody = document.getElementById("toastBody");
            
            if (toastMessage && toastBody) {
                toastMessage.classList.add("show");
                toastBody.innerHTML = "Welcome (back) " + user.email;
            }
            
            console.log(user.email);

            // Adjust button visibility based on user state
            signoutButton.style.display = "flex";
            bottomButtons.style.display = "flex";
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

            setPermissions(user.email); // Assuming this is a function to set permissions based on user's email
        } else {
            // Handle signed-out state or email not verified
            bottomButtons.style.display = "none";
            signoutButton.style.display = "none";
            signinButton.style.display = "flex";
            signupButton.style.display = "flex";
            signedOutContent.style.display = "block";

            if (typeof hideContent === "function") {
                hideContent('contentContainer'); // Ensure this function is defined and safely callable
            }
        }
    } else {
        console.error("Some UI elements could not be found.");
    }
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
            if (cred.user.emailVerified) {
                setPermissions(email);
                window.location.href = "index.html"; // Consider using a more dynamic approach or SPA routing
            }
            else {
                console.error("Please verify your email!")
            }
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
        // Send an email verification to the newly created user
        cred.user.sendEmailVerification().then(() => {
            // Email sent.
            console.log("Verification email sent.");
        }).catch(verificationError => {
            // Handle Errors here.
            console.error("Error sending verification email:", verificationError);
        });

        // Set user data in Firestore
        if (cred.user.emailVerified) {
            return db.collection("users").doc(email).set({
                name: fullName,
                grade: grade,
                accountType: returnPermissions(email) // Use the returnPermissions function to set account type
            });
        }
    }).then(() => {
        //window.location.href = "index.html";
        alert("Sign Up Successful! Please verify your email before logging in.");
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

// // Google Sign-In
// var provider = new firebase.auth.GoogleAuthProvider();
// document.getElementById('google-signin-btn').addEventListener('click', function() {
//     firebase.auth().signInWithPopup(provider).then(result => {
//         window.location.href = "index.html";
//     }).catch(error => {
//         alert(error.message);
//     });
// });