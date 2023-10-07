var firebaseConfig = {
  apiKey: "AIzaSyDAMD1hMJYS7upXHipLG_HlPxhtDwkRVK8",
  authDomain: "college-counseling-database.firebaseapp.com",
  databaseURL: "https://college-counseling-database-default-rtdb.firebaseio.com",
  projectId: "college-counseling-database",
  storageBucket: "college-counseling-database.appspot.com",
  messagingSenderId: "1085147306385",
  appId: "1:1085147306385:web:080af2eb2caea2e44ee230",
  measurementId: "G-MGN0MY84XX"
};

  // Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

  //make auth and firestore references
const auth = firebase.auth();
const db = firebase.firestore();

// signup
const signupForm = document.querySelector('#signup-form');

var signuplabel = document.getElementById("verified");

signuplabel.style.visibility = "hidden";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = signupForm['email'].value;
  const password = signupForm['password_input'].value;

  // sign up the user
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-signup');
    signupForm.reset();
    signuplabel.style.visibility = "visible";
    sleep(2000).then(() => { window.location.href = "index.html" });
  });
});

// logout
/*const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    console.log('user signed out');
  })
});*/