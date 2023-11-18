firebase.analytics();
//db = firebase.firestore();

// import { doc, getDoc } from "firebase/firestore";

// const docRef = doc(db, "cities", "SF");
// const docSnap = await getDoc(docRef);

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

//get, format and export all contentModal content
function content(i) {
  getSummerCamps().then(results => {
    console.log(i);
    modalHeader = document.getElementById("modal-header");
    addWebLink = document.getElementById("addWebLink");
    addTagsModal = document.getElementById("addTagsModal");
    addParticipants = document.getElementById("addParticipants");
    //addYourself = document.getElementById("addYourself");

    addComments = document.getElementById("addComments");
    addGeneralDescription = document.getElementById("addGeneralDescription");


    elementsArray = [modalHeader, addWebLink, addTagsModal, addParticipants, addComments, addGeneralDescription];

    for (var c = 0; c < elementsArray.length; c++) {
      while (elementsArray[c].hasChildNodes()) {
        elementsArray[c].firstChild.remove()
      };
    };

    header = document.createElement("h1");
    header.classList.add("modal-title");
    header.classList.add("fs-5");

    linkContent = document.createElement("a");
    linkContent.setAttribute("href", `${results[i].link}`);
    linkContent.classList.add("link-body-emphasis", "link-offset-2", "link-underline-opacity-25", "link-underline-opacity-75-hover");

    for (var c = 0; c < results[i].tags.length; c++) {
      modalTag = document.createElement("p");
      modalTag.classList.add("badge");
      modalTag.classList.add("bg-secondary");
      modalTag.classList.add("tagBadge");
      

      modalTag.innerHTML = results[i].tags[c];

      addTagsModal.appendChild(modalTag);
    };

    for (var c = 0; c < results[i].participated.length; c++) {

      participantOne = document.createElement("p");
      participantTwo = document.createElement("p");

      text = results[i].participated[c].split("/");

      participantOne.innerHTML = text[0];
      participantTwo.innerHTML = text[1];

      addParticipants.appendChild(participantOne);
      addParticipants.appendChild(participantTwo);
    };

    for (var c = 0; c < results[i].comments.length; c++) {
      comment = document.createElement("p");

      comment.innerHTML = results[i].comments[c];

      addComments.appendChild(comment);
    };

    genDescription = document.createElement("p");
    
    header.innerHTML = results[i].name;
    linkContent.innerHTML = results[i].link;
    genDescription.innerHTML = results[i].description;

    modalHeader.appendChild(header);
    addWebLink.appendChild(linkContent);
    addGeneralDescription.appendChild(genDescription);

});
};

function getUsers(email) {
  console.log(email);
  var dbRef = db.collection("users");
  var dbQuery = dbRef.where(firebase.firestore.FieldPath.documentId(), '==', email);

  var dbPromise = dbQuery.get();
  return dbPromise.then(function(querySnapshot) {
    var results = [];
    querySnapshot.forEach(function(doc) {
      results.push(doc.data());
    });
    console.log(results);
    return Promise.all(results);
  })
  .catch(function(error) {
    console.log("error getting documents: ", error);
  });
}

function addParticipant() {
  addParticipants = document.getElementById("addParticipants");
  toastBody = document.getElementById("toastBody");
  const email = toastBody.textContent.split(" ")[2].toLowerCase();
  console.log(email);

  participantName = document.createElement("p");
  participantName.classList.add("col");

  participantGrade = document.createElement("p");
  participantGrade.classList.add("col");

  existingParticipantsArray = [];

  modalHeader = document.getElementById("modal-header");

  getUsers(email).then(results => {
    //console.log(results);

    //console.log("THIS IS NAME", results[0].name);
    //console.log("THIS IS GRADE", results[0].grade);


    participantName.innerHTML = results[0].name;
    participantGrade.innerHTML = results[0].grade;

    console.log("this is printing", participantName);

    addParticipants.appendChild(participantName);
    addParticipants.appendChild(participantGrade);

    for (var i = 0; i < addParticipants.children.length; i++) { 
      existingParticipantsArray.push(addParticipants.children[i].textContent);
    };
  
    console.log(existingParticipantsArray);

    convertArray = [];

    for (var i = 0; i < existingParticipantsArray.length; i+=2) { 
      convertArray.push(existingParticipantsArray[i] + "/" + existingParticipantsArray[i+1])
      
    };

    console.log(convertArray);

    db.collection("college-counseling-database").doc(modalHeader.children[0].textContent).update({
      participated: convertArray
    });

  });
};

function addComment() {
  commentContent = document.getElementById("inputComment");
  updateCommentSection = document.getElementById("addComments");
  modalHeader = document.getElementById("modal-header");

  comment = document.createElement("p");
  comment.innerHTML = commentContent.value;

  existingCommentsArray = [];
  updateCommentSection.appendChild(comment);

  for (var i = 0; i < updateCommentSection.children.length; i++) { 
    existingCommentsArray.push(updateCommentSection.children[i].textContent);
  }

  console.log(modalHeader.children[0].textContent);

  db.collection("college-counseling-database").doc(modalHeader.children[0].textContent).update({
    comments: existingCommentsArray
  });
  commentContent.value = "";
  //console.log(commentContent.value);
};

//initial commit to set up firebase
function setUpFirebaseDatabase() {
  // add collection for Summer Program 1
  db.collection("college-counseling-database").doc("id1").set({
    name: "summer program 1", 
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec posuere odio est, at aliquet sapien malesuada id. Sed rutrum, nulla luctus vulputate aliquam, neque orci aliquet ante, vel commodo erat orci non eros. Mauris sit amet sodales massa. Donec eu volutpat tellus, sit amet pulvinar nisi. Aenean nec orci eros. Nam tempor sapien in lorem gravida pretium. Nulla quis lorem suscipit ante lacinia varius. Curabitur purus ex, sodales et posuere a, tincidunt in turpis.",
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
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sagittis sapien a euismod finibus. Duis consectetur fermentum libero vitae bibendum. Cras condimentum pretium elementum. Mauris non dictum sem, eget rutrum lacus. Fusce hendrerit blandit tristique. Morbi nec sem vel metus imperdiet tincidunt vel non mi. Sed lorem felis, tempus sit amet pretium vel, cursus sit amet ex.",
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
  alert("Content Submitted");
  let nameOfSummerCamp = document.getElementById("nameOf");
  let organization = document.getElementById("org");
  let link = document.getElementById("link");
  let tagDiv = document.getElementById("tagDiv");
  let children = tagDiv.children;
  let descriptionInput = document.getElementById("descriptionInput");

  console.log(children[1].value);

  db.collection("college-counseling-database").doc(nameOfSummerCamp.value).set({
    name: nameOfSummerCamp.value, 
    description: descriptionInput.value,
    organization: organization.value, 
    link: link.value,
    tags: [children[1].value, children[2].value, children[3].value],
    participated:[], 
    comments:["comment1", "comment2"],
    status: "active"
  })
  .then(function() {
    console.log("Document successfully written!");
  })
  .catch(function(error) {
      console.error("Error writing document: ", error);
  });

  littleArrayTeeHee = [nameOfSummerCamp, organization, link, tagDiv, children[1], children[2], children[3], descriptionInput];

  for (var i = 0; i < littleArrayHeeHee.length; i++) {
    littleArrayHeeHee[i].value = ""
  }
}