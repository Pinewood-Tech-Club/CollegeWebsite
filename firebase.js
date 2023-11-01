firebase.analytics();
//db = firebase.firestore();

// This function gets the data from the firebase database and returns array 'results' which has all the data.
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

//uses results to append into "add-camps" id
getSummerCamps().then(results => {

  element = document.getElementById("add-camps");

  while (element.hasChildNodes()) {
    element.firstChild.remove()
  };

  for (var i = 0; i < results.length; i++) {
    [element, div1, div2, div3, a, org, part] = formatData(i);

    //getting data 
    a.innerHTML = results[i].name; 
    org.innerHTML = results[i].organization;
    part.innerHTML = results[i].participated.length;

    //append HTML 
    div1.appendChild(a);
    div2.appendChild(org);
    div3.appendChild(part);
    element.append(div1, div2, div3);

  }
});

//simplifies prev. function code
function formatData(i) {
  //console.log(i)
  element = document.getElementById("add-camps"); //where database will be added

  div1 = document.createElement("div"); //creating col div
  div1.classList.add("col"); // adding "col" class to div

  div2 = document.createElement("div"); //creating col div
  div2.classList.add("col"); // adding "col" class to div

  div3 = document.createElement("div"); //creating col div
  div3.classList.add("col"); // adding "col" class to div

  a = document.createElement("button"); // creating a for name
  a.setAttribute("id", `${i}`);
  a.setAttribute("onclick", `content(${i})`)
  a.classList.add("p-3");
  a.classList.add("btn");
  a.classList.add("btn-outline-success");
  a.classList.add("summerCampButton");
  a.setAttribute("data-bs-toggle", "modal");
  a.setAttribute("data-bs-target", "#summerCampMoreModal")

  org = document.createElement("div"); // creating div for organization name
  org.classList.add("p-3");

  part = document.createElement("div"); // creating div for # of participants
  part.classList.add("p-3");

  return [element, div1, div2, div3, a, org, part];
};


function content(i) {
  getSummerCamps().then(results => {
    console.log(i);
    modalHeader = document.getElementById("modal-header");

    while (modalHeader.hasChildNodes()) {
      modalHeader.firstChild.remove()
    };

    //<h1 class="modal-title fs-5" id="summerCampMoreModalLabel"></h1>

    header = document.createElement("h1");
    header.classList.add("modal-title");
    header.classList.add("fs-5");
    
    header.innerHTML = results[i].name;
    console.log(header);
    modalHeader.appendChild(header);

});
  //console.log(i);
};




//initial commit to set up firebase
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

//
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
      [element, div1, div2, div3, a, org, part] = formatData(i)

      //getting data 
      a.innerHTML = results[i].name; 
      org.innerHTML = results[i].organization;
      part.innerHTML = results[i].participated;
  
      //append HTML 
      div1.appendChild(a);
      div2.appendChild(org);
      div3.appendChild(part);
      element.append(div1, div2, div3);
    }
  });
}
let submitButton = document.getElementById("submitNewContent");
submitButton.onclick = function() {
  createFromAddContent();
}
function createFromAddContent() {
  let nameOfSummerCamp = document.getElementById("nameOf");
  let organization = document.getElementById("org");
  let link = document.getElementById("link");
  let tagDiv = document.getElementById("tagDiv");
  let children = tagDiv.children;
  console.log(children[1].value);

  db.collection("college-counseling-database").add({
    name: nameOfSummerCamp.value, 
    organization: organization.value, 
    link: link.value,
    tags: [children[1].value, children[2].value, children[3].value],
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
}