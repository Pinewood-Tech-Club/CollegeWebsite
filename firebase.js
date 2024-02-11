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
    [element, div1, div2, div3, a, org, part] = formatData(results[i].name);

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
  a.setAttribute("onclick", `content('${i}')`)
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
function content(id) {
  getSummerCamps().then(results => {

    var result = null;

    for (var c = 0; c < results.length; c++){
      if (results[c].name == id){
       //getting position for id in firebase results
        result = results[c];
        break;
      }
    }

    //getting all modal components
    modalHeader = document.getElementById("modal-header");
    addWebLink = document.getElementById("addWebLink");
    addTagsModal = document.getElementById("addTagsModal");
    addParticipants = document.getElementById("addParticipants");
    AdminParticipantEdit = document.getElementById("AdminParticipantEdit");

    
    //hiding 'delete participant' div that should only be shown after clicking edit content
    if (AdminParticipantEdit.style.display == "flex") {
      AdminParticipantEdit.style.display = "none";
    }

    //getting more modal components
    addComments = document.getElementById("addComments");
    addGeneralDescription = document.getElementById("addGeneralDescription");

    //removing all existing content
    elementsArray = [modalHeader, addWebLink, addTagsModal, addParticipants, addComments, addGeneralDescription];

    for (var c = 0; c < elementsArray.length; c++) {
      while (elementsArray[c].hasChildNodes()) {
        elementsArray[c].firstChild.remove()
      };
    };

    //creating headaer
    header = document.createElement("h1");
    header.classList.add("modal-title", "modal-color");
    header.classList.add("fs-5");

    //creating link
    linkContent = document.createElement("a");
    linkContent.setAttribute("href", `${result.link}`);
    linkContent.classList.add("link-body-emphasis", "link-offset-2", "link-underline-opacity-25", "link-underline-opacity-75-hover");


    //adding badges
    for (var c = 0; c < result.tags.length; c++) {
      modalTag = document.createElement("p");
      modalTag.classList.add("badge");
      modalTag.classList.add("bg-success");
      modalTag.classList.add("tagBadge");
      modalTag.setAttribute("id", `tag${c}`);
      
      modalTag.innerHTML = result.tags[c];

      addTagsModal.appendChild(modalTag);
    };

    //adding participants
    for (var c = 0; c < result.participated.length; c++) {

      participantOne = document.createElement("p");
      participantTwo = document.createElement("p");

      text = result.participated[c].split("/");

      participantOne.innerHTML = text[0];
      participantTwo.innerHTML = text[1];

      addParticipants.appendChild(participantOne);
      addParticipants.appendChild(participantTwo);
    };

    //adding comments
    for (var c = 0; c < result.comments.length; c++) {
      comment = document.createElement("p");
      comment.classList.add("userComment");

      comment.innerHTML = result.comments[c];

      addComments.appendChild(comment);
    };

    //making description element
    genDescription = document.createElement("p");
    
    //adding text content
    header.innerHTML = result.name;
    linkContent.innerHTML = result.link;
    genDescription.innerHTML = result.description;

    //adding all content into modal for user to see
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

//adding new participants, onClick
function addParticipant() {
  addParticipants = document.getElementById("addParticipants");
  existingParticipantsArray = [];

  //creating array of all current participants w/o new participant
  for (var i = 0; i < addParticipants.children.length; i++) { 
    existingParticipantsArray.push(addParticipants.children[i].textContent);
  }

  //getting toastBody to get user email #lifeHack
  toastBody = document.getElementById("toastBody");
  const email = toastBody.textContent.split(" ")[2].toLowerCase();
  console.log(email);

  //creating elements for participants
  participantName = document.createElement("p");
  participantName.classList.add("col");

  participantGrade = document.createElement("p");
  participantGrade.classList.add("col");

  //array for current participants + new
  updatedParticipantsArray = [];

  modalHeader = document.getElementById("modal-header");

  getUsers(email).then(results => {
    //adding textContent
    participantName.innerHTML = results[0].name;
    participantGrade.innerHTML = results[0].grade;

    //checking if participants is already in list
    if (existingParticipantsArray.includes(participantName.textContent) == true) { 
      alert("You've already participated");
    } else { //participant not yet added -> add them
      addParticipants.appendChild(participantName);
    addParticipants.appendChild(participantGrade);

    for (var i = 0; i < addParticipants.children.length; i++) { 
      updatedParticipantsArray.push(addParticipants.children[i].textContent);
    }
  
    console.log(updatedParticipantsArray);

    convertArray = [];

    for (var i = 0; i < updatedParticipantsArray.length; i+=2) { 
      convertArray.push(updatedParticipantsArray[i] + "/" + updatedParticipantsArray[i+1])
    };

    console.log(convertArray);

    db.collection("college-counseling-database").doc(modalHeader.children[0].textContent).update({
      participated: convertArray
    });
    }
  });
};

//adding a comment
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

function showTag(tag) {
  getSummerCamps().then(results => {
    console.log("in")
      element = document.getElementById("add-camps");

    while (element.hasChildNodes()) {
      element.firstChild.remove()
    };
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
    for (var i = 0; i < results.length; i++) {
      var flag = false;
      for (var j = 0; j < results[i].tags.length; j++){
        if (results[i].tags[j].toLowerCase() == tag){
          flag = true;
        }
      }
      if (tag != "" && !flag){
        continue;
      }
      [element, div1, div2, div3, a, org, part] = formatData(results[i].name)

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

  for (var i = 0; i < littleArrayTeeHee.length; i++) {
    littleArrayTeeHee[i].value = ""
  }
}

function mostUsedTags() {
  // Create a map with key being tag and value being the count of results with tag
  let tagCounts = {}
  getSummerCamps().then(results => {
    for (var i = 0; i < results.length; i++) {
      for (var j = 0; j < results[i].tags.length; j++){
        var tag = results[i].tags[j].toLowerCase()  
        // increase count for tag in tagCounts because results[i] includes this tag or set it to 1 if it is not in tagCounts
        if (tag in tagCounts) {
          tagCounts[tag] = tagCounts[tag] + 1
        }  else  {
          tagCounts[tag] = 1
        }       
      }
    }

    // Create an array from the map to short by value  eg. [['academic', 4], ['fun', 6]]
    var items = Object.keys(tagCounts).map(function(key) {
      return [key, dict[key]];
    });

    // Sort the array based on the second element
    items.sort(function(first, second) {
      return second[1] - first[1];
    });

    //items.slice(0, 3) // get the 3 most used tags
    return items;
  });
}

// testing mostUsedTags()
sortedTags = mostUsedTags()
sortedTags.forEach(function(entry) {
  console.log(entry[0]);
});

function adminEdit() {
  document.getElementsByClassName("perhapshidden").hidden = false;

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
  rowContainer = document.getElementById("rowContainer");
  console.log(rowContainer);
  if (rowContainer != null) {
    rowContainer.remove()
  } else {
    console.log("rowContainer not found")
  }

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
  rowContainer.setAttribute("id", "rowContainer");
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

  console.log(rowDiv);

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

  if (document.getElementById("doneButton") == null) {
    doneButton = document.createElement("button");
    doneButton.classList.add("btn");
    doneButton.classList.add("btn-outline-success");
    doneButton.setAttribute("onClick", "exitEdit()");
    doneButton.setAttribute("id", "doneButton")
    doneButton.innerHTML = "Exit Editing";

    modalFooter.appendChild(doneButton);
  } else {
    doneButton = document.getElementById("doneButton");
    doneButton.style.display = "flex";
  }


};

function buttonChange() {
  editContent = document.getElementById("editContent");
  editContent.style.display = "flex";

  doneButton = document.getElementById("doneButton");
  doneButton.style.display = "none";
}

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

  buttonChange();

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

    buttonChange();
    content(campName);
    
  })
}