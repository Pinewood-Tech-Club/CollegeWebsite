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
firebase.initializeApp(firebaseConfig);
firebase.analytics();
 db = firebase.firestore();

function getSummerCamps() {
  var dbRef = db.collection("college-counseling-database");
  var dbQuery = dbRef.orderBy("name", "asc");

  var dbPromise = dbQuery.get();
  return dbPromise.then(function(querySnapshot) {
    var results = [];
    querySnapshot.forEach(function(doc) {
      results.push(doc.data());
    });
    console.log(results)
    return Promise.all(results);
  })
  .catch(function(error) {
    console.log("error getting documents: ", error);
  });
}

getSummerCamps().then(results => {

  element = document.getElementById("add-camps");

  while (element.hasChildNodes()) {
    element.firstChild.remove()
  };

  for (var i = 0; i < results.length; i++) {

    element = document.getElementById("add-camps");
    li = document.createElement("li");
    li.innerHTML = "<strong> Name: </strong>" + results[i].name + "<strong> Organization: </strong>" + results[i].organization + "<strong> Link: </strong>" + results[i].link + "<strong> tags: </strong>" + results[i].tags + "<strong> Participated: </strong>" + results[i].participated.length.toString() + "<strong> Comments: </strong>" + results[i].comments + "<strong> status: </strong>" + results[i].status;
    element.appendChild(li);
  }
});

function setUpFirebaseDatabase() {
  // add collection for Summer Program 1
  db.collection("college-counseling-database").doc("id1").set({
    name: "summer program 1", 
    organization:"Pinewood", 
    link: "wiki.nl",
    tags: ["stem", "stem2", "california"],
    participated:["Micky/Sophomore", "Mini/Senior"], 
    comments:["comment1", "comment2"],
    status: "active"
  })
  .then(function() {
    console.log("Document successfully written!");
  })
  .catch(function(error) {
      console.error("Error writing document: ", error);
  });
  // add collection for summer program 2
  db.collection("college-counseling-database").doc("id2").set({
    name: "summer program 2", 
    organization:"Pinewood", 
    link: "wiki.nl",
    tags: ["language", "fun", "california"],
    participated:["Jane/Junior", "Doe/Senior"], 
    comments:["comment1", "comment2"],
    status: "active"
  })
  .then(function() {
    console.log("Document successfully written!");
  })
  .catch(function(error) {
      console.error("Error writing document: ", error);
  });
}

//setUpFirebaseDatabase(); //only need to run once to set up firebase, do not rerun unless changed :)

function getSummerCampTag(tag) {
  var dbRef = db.collection("college-counseling-database");
  var dbQuery = dbRef;

  if (tag!="") {
    dbQuery = dbRef.where("tags", "array-contains", tag);
  }

  var dbPromise = dbQuery.get();
  return dbPromise.then(function(querySnapshot) {
    var results = [];
    querySnapshot.forEach(function(doc) {
      results.push(doc.data());
    });
    console.log(results)
    return Promise.all(results);
  })
  .catch(function(error) {
    console.log("error getting documents: ", error);
  });
}

function showTag(tag) {
  console.log(tag)
  getSummerCampTag(tag).then(results => {
    console.log("in")
      element = document.getElementById("add-camps");

    while (element.hasChildNodes()) {
      element.firstChild.remove()
    };

    for (var i = 0; i < results.length; i++) {

      element = document.getElementById("add-camps");
      li = document.createElement("li");
      li.innerHTML = "<strong> Name: </strong>" + results[i].name + "<strong> Organization: </strong>" + results[i].organization + "<strong> Link: </strong>" + results[i].link + "<strong> tags: </strong>" + results[i].tags + "<strong> Participated: </strong>" + results[i].participated.length.toString() + "<strong> Comments: </strong>" + results[i].comments + "<strong> status: </strong>" + results[i].status;
      element.appendChild(li);
    }
  });
}

