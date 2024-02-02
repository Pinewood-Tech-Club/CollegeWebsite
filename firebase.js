firebase.analytics();
//db = firebase.firestore();

// This function gets the data from the firebase database and returns array 'results' which has all the data.
function getSummerCamps() {
  var dbRef = db.collection("college-counseling-database");
  var dbQuery = dbRef.orderBy("name", "asc");

  var dbPromise = dbQuery.get();``
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
  //i like insertion sort ok dont judge
  for (var i = 1; i < results.length; i++){
    var idx = i;
    while (idx > 0 && results[idx].participated.length > results[idx-1].participated.length){
      var temp = results[idx]
      results[idx] = results[idx-1];
      results[idx-1] = temp;
      idx--;
    }
  }
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
    addYourself = document.getElementById("addYourself");

    

    addYourself.addEventListener("click", function() {
      db.collection("users").doc(firebase.auth().currentUser.email).get().then((doc) =>{
        var data = doc.data();
        db.collection("college-counseling-database").doc(modalHeader.children[0].textContent).update({
          participated: firebase.firestore.FieldValue.arrayUnion(data['name'] + '/' + data['grade'])
        }).then(() => {
          window.location.href = "index.html";
        });
      });
    })
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
  // add collection for summer program 2
  db.collection("college-counseling-database").doc("id2").set({
    name: "summer program 2", 
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sagittis sapien a euismod finibus. Duis consectetur fermentum libero vitae bibendum. Cras condimentum pretium elementum. Mauris non dictum sem, eget rutrum lacus. Fusce hendrerit blandit tristique. Morbi nec sem vel metus imperdiet tincidunt vel non mi. Sed lorem felis, tempus sit amet pretium vel, cursus sit amet ex.",
    organization:"Pinewood", 
    link: "wiki.nl",
    tags: ["language", "fun", "california"],
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
<<<<<<< Updated upstream

=======
    //simple insertion sort (ik built-in sort is faster but im too lazy to write custom comparator function so cry abt it)
    for (var i = 1; i < results.length; i++){
      var idx = i;
      while (idx > 0 && results[idx].participated.length > results[idx-1].participated.length){
        var temp = results[idx]
        results[idx] = results[idx-1];
        results[idx-1] = temp;
        idx--;
      }
    }
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
}

function adminEdit() {
  console.log("admin is editing");
  addGeneralDescription = document.getElementById("addGeneralDescription");
  addWebLink = document.getElementById("addWebLink");
  AdminParticipantEdit = document.getElementById("AdminParticipantEdit");
  currentParticipants = document.getElementById("addParticipants");
  commentSection = document.getElementsByClassName("userComment");
  modalFooter = document.getElementById("modalFooter");
  editContent = document.getElementById("editContent");
  tagOne = document.getElementById("tag0");
  tagTwo = document.getElementById("tag1");
  tagThree = document.getElementById("tag2");

  AdminParticipantEdit.style.display = "flex";
  editContent.style.display = "none";

  console.log(tagOne);

  tagOne.innerHTML = '<input class="form-control form-control-sm" value='+ tagOne.innerText+'>';
  tagTwo.innerHTML = '<input class="form-control form-control-sm" value='+ tagTwo.innerText+'>';
  tagThree.innerHTML = '<input class="form-control form-control-sm" value='+ tagThree.innerText+'>';
  
  addGeneralDescription.innerHTML = '<textarea class="form-control" id="floatingTextarea">'+addGeneralDescription.innerText + '</textarea>';
  addWebLink.innerHTML = '<input class="form-control" value='+addWebLink.innerText+'>';
  
  rowContainer = document.createElement("div");
  rowContainer.classList.add("container");
  rowContainer.classList.add("px-3");
  rowContainer.classList.add("text-center");
  rowContainer.classList.add("contentModal");
  rowContainer.classList.add("contentContainer");

  console.log(currentParticipants.children.length/2);

  console.log("editing children");
  rowDiv = document.createElement("div");
  rowDiv.classList.add("row");
  rowDiv.classList.add("gx-3");
  rowDiv.classList.add("row-cols-1");
  rowDiv.classList.add("g-3");

  

  // if (rowDiv.children.length == currentParticipants.children.length/2) {
    
  // } else {
      for (var i = 0; i < (currentParticipants.children.length/2); i++) { 
        
        empty = document.createElement("p");
        rowContent = document.createElement("button");

        rowContent.classList.add("btn-close");
        //rowContent.classList.add("g-3");
        rowContent.setAttribute("aria-label", "Close");
        rowContent.setAttribute("type", "button");
        rowContent.setAttribute("onClick", `deleteParticipant(${i})`);

        rowDiv.appendChild(empty);
        empty.appendChild(rowContent);
      }
  // }
  rowContainer.appendChild(rowDiv);
  AdminParticipantEdit.appendChild(rowContainer);

  // console.log(rowDiv.children.length);
  // console.log(rowDiv);

  for (var c = 0; c < (commentSection.length); c++) {
    //console.log(commentSection[c].innerText);
    commentSection[c].innerHTML = '<textarea class="form-control" id="floatingTextarea">'+commentSection[c].innerText + '</textarea>';
  }

  doneButton = document.createElement("button");
  doneButton.classList.add("btn");
  doneButton.classList.add("btn-outline-success");
  doneButton.setAttribute("onClick", "exitEdit()");
  doneButton.setAttribute("id");
  modalFooter.appendChild(don, "doneButton");
  doneButton.innerHTML = "Exit Editing";
};

function exitEdit() {
  addGeneralDescription = document.getElementById("addGeneralDescription");
  updateCommentSection = document.getElementById("addComments");
  tags = document.getElementById("addTagsModal");
  webLink = document.getElementById("addWebLink");
  webValue = webLink.children[0].value;
  modalHeader = document.getElementById("modal-header");
  campName = modalHeader.children[0].textContent;

  existingCommentsArray = [];
  existingTagsArray = [];

  for (var i = 0; i < updateCommentSection.children.length; i++) { 
    if (updateCommentSection.children[i].children[0].value != "") {
        existingCommentsArray.push(updateCommentSection.children[i].children[0].value);
      }
    };

  for (var i = 0; i < tags.children.length; i++) { 
     existingTagsArray.push(tags.children[i].children[0].value);
  };

  console.log(existingCommentsArray);
  console.log(existingTagsArray);
  
  db.collection("college-counseling-database").doc(campName).update({
    description: addGeneralDescription.children[0].value,
    tags: existingTagsArray,
    comments: existingCommentsArray, 
    link: webValue
    });

  editContent = document.getElementById("editContent");
  editContent.style.display = "flex";

  doneButton = document.getElementById("doneButton");
  doneButton.style.display = "none";

  content(campName);
};

function deleteParticipant(c) {
  modalHeader = document.getElementById("modal-header");
  campName = modalHeader.children[0].textContent;

  getSummerCamps().then(results => {
    let tag = 0;

    for (var i = 0; i < results.length; i++) { 
      if (results[i] == campName) {
        tag = i;
      } else {
        console.log("not a match");
      }
    }

    participantList = results[tag].participated;

    console.log(participantList);
    console.log(c);

    participantList.splice(c, 1);
    console.log(participantList);

    db.collection("college-counseling-database").doc(campName).update({
      participated: participantList
      });

    content(campName);
  })
>>>>>>> Stashed changes
}