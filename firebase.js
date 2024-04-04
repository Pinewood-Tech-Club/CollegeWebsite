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
  return dbPromise
    .then(function (querySnapshot) {
      var results = [];
      querySnapshot.forEach(function (doc) {
        results.push(doc.data());
      });
      console.log(results);
      return Promise.all(results);
    })
    .catch(function (error) {
      console.log("error getting documents: ", error);
    });
}

function getReports() {
  var dbRef = db.collection("reports");
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

function switchToHistory() {
  window.location.href = "./history.html";
}

function switchToReports() {
  window.location.href = "./report.html";
}

//uses results to append into "add-camps" id
getSummerCamps().then((results) => {
  for (var i = 1; i < results.length; i++) {
    var idx = i;
    while (
      idx > 0 &&
      results[idx].participated.length > results[idx - 1].participated.length
    ) {
      var temp = results[idx];
      results[idx] = results[idx - 1];
      results[idx - 1] = temp;
      idx--;
    }
  }
  element = document.getElementById("add-camps");

  while (element.hasChildNodes()) {
    element.firstChild.remove();
  }

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
  element = document.getElementById("add-camps"); //where database will be added

  div1 = document.createElement("div"); //creating col div
  div1.classList.add("col"); // adding "col" class to div

  div2 = document.createElement("div"); //creating col div
  div2.classList.add("col"); // adding "col" class to div

  div3 = document.createElement("div"); //creating col div
  div3.classList.add("col"); // adding "col" class to div

  a = document.createElement("button"); // creating a for name
  a.setAttribute("id", `${i}`);
  a.setAttribute("onclick", `content('${i}')`);
  a.classList.add("p-3");
  a.classList.add("btn");
  a.classList.add("btn-outline-success");
  a.classList.add("summerCampButton");
  a.setAttribute("data-bs-toggle", "modal");
  a.setAttribute("data-bs-target", "#summerCampMoreModal");

  org = document.createElement("div"); // creating div for organization name
  org.classList.add("p-3");

  part = document.createElement("div"); // creating div for # of participants
  part.classList.add("p-3");

  return [element, div1, div2, div3, a, org, part];
}

//get, format and export all contentModal content
function content(id) { 
  getSummerCamps().then((results) => {
    var result = null;

    for (var c = 0; c < results.length; c++) {
      if (results[c].name == id) {
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
    var participantNumber = document.getElementById("participantNumber");

    //hiding 'delete participant' div that should only be shown after clicking edit content
    if (AdminParticipantEdit.style.display == "flex") {
      AdminParticipantEdit.style.display = "none";
    }

    //getting more modal components
    addComments = document.getElementById("addComments");
    addGeneralDescription = document.getElementById("addGeneralDescription");

    //removing all existing content
    elementsArray = [
      modalHeader,
      addWebLink,
      addTagsModal,
      addParticipants,
      addComments,
      addGeneralDescription,
    ];

    for (var c = 0; c < elementsArray.length; c++) {
      while (elementsArray[c].hasChildNodes()) {
        elementsArray[c].firstChild.remove();
      }
    }

    //creating headaer
    header = document.createElement("h1");
    header.classList.add("modal-title", "modal-color");
    header.classList.add("fs-5");
    header.setAttribute("id", "camp name")
    header.setAttribute("onmouseover", "handleMouseOver(this)");
    header.setAttribute("onmouseout", "handleMouseOut(event, this)");

    //creating link
    linkContent = document.createElement("a");
    linkContent.setAttribute("href", `${result.link}`);
    linkContent.classList.add("link-body-emphasis", "link-offset-2", "link-underline-opacity-25", "link-underline-opacity-75-hover");
    linkContent.setAttribute("id", "link")
    linkContent.setAttribute("onmouseover", "handleMouseOver(this)");
    linkContent.setAttribute("onmouseout", "handleMouseOut(event, this)");


    //adding badges
    for (var c = 0; c < result.tags.length; c++) {
      modalTag = document.createElement("p");
      modalTag.classList.add("badge");
      modalTag.classList.add("bg-success");
      modalTag.classList.add("tagBadge");
      modalTag.setAttribute("id", "tag " + (c + 1))
      modalTag.setAttribute("onmouseover", "handleMouseOver(this)");
      modalTag.setAttribute("onmouseout", "handleMouseOut(event, this)");
      modalTag.setAttribute("id", `tag${c}`);

      modalTag.innerHTML = result.tags[c];

      addTagsModal.appendChild(modalTag);
    }

    //adding participants
    for (var c = 0; c < result.participated.length; c++) {
      participantOne = document.createElement("p");
      participantTwo = document.createElement("p");

      text = result.participated[c].split("/");

      participantOne.innerHTML = text[0];
      participantTwo.innerHTML = text[1];

      addParticipants.appendChild(participantOne);
      addParticipants.appendChild(participantTwo);
    }

    participantNumber.innerHTML =
      "Pinewood Participants: " + result.participated.length;



    //adding comments
    for (var c = 0; c < result.comments.length; c++) {
      commentDiv = document.createElement("div");
      commentDiv.classList.add("userComment");
      commentDiv.setAttribute("id", "comment " + (c + 1))

      email = result.comments[c].email;
      date = result.comments[c].date;

      comment = document.createElement("p");
      comment.classList.add("commentContent");
      comment.innerHTML = result.comments[c].comment;

      userAndDate = document.createElement("p");
      userAndDate.classList.add("smallTextNameAndDate");
      userAndDate.innerHTML = "<i> <div class='authEmail'>" + email + "</div>, <div class='authDate'>" + date + "</div> </i>";

      commentDiv.appendChild(comment);
      commentDiv.appendChild(userAndDate);
      
      commentDiv.setAttribute("onmouseover", "handleMouseOver(this)");
      commentDiv.setAttribute("onmouseout", "handleMouseOut(event, this)");

      addComments.appendChild(commentDiv);
    }

    //making description element
    genDescription = document.createElement("p");
    genDescription.setAttribute("id", "description")
    genDescription.setAttribute("onmouseover", "handleMouseOver(this)");
    genDescription.setAttribute("onmouseout", "handleMouseOut(event, this)");
    
    //adding text content
    header.innerHTML = result.name;
    linkContent.innerHTML = result.link;
    genDescription.innerHTML = result.description;

    //adding all content into modal for user to see
    modalHeader.appendChild(header);
    addWebLink.appendChild(linkContent);
    addGeneralDescription.appendChild(genDescription);
  });
}

function getUsers(email) {
  console.log(email);
  var dbRef = db.collection("users");
  var dbQuery = dbRef.where(
    firebase.firestore.FieldPath.documentId(),
    "==",
    email
  );

  var dbPromise = dbQuery.get();
  return dbPromise
    .then(function (querySnapshot) {
      var results = [];
      querySnapshot.forEach(function (doc) {
        results.push(doc.data());
      });
      console.log(results);
      return Promise.all(results);
    })
    .catch(function (error) {
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

  //creating elements for participants
  participantName = document.createElement("p");
  participantName.classList.add("col");

  participantGrade = document.createElement("p");
  participantGrade.classList.add("col");

  //array for current participants + new
  updatedParticipantsArray = [];

  modalHeader = document.getElementById("modal-header");

  getUsers(email).then((results) => {
    //adding textContent
    participantName.innerHTML = results[0].name;
    participantGrade.innerHTML = results[0].grade;

    //checking if participants is already in list
    if (
      existingParticipantsArray.includes(participantName.textContent) == true
    ) {
      alert("You've already participated");
    } else {
      //participant not yet added -> add them
      addParticipants.appendChild(participantName);
      addParticipants.appendChild(participantGrade);

      for (var i = 0; i < addParticipants.children.length; i++) {
        updatedParticipantsArray.push(addParticipants.children[i].textContent);
      }

      convertArray = [];

      for (var i = 0; i < updatedParticipantsArray.length; i += 2) {
        convertArray.push(
          updatedParticipantsArray[i] + "/" + updatedParticipantsArray[i + 1]
        );
      }

      var participantNumber = document.getElementById("participantNumber");
      participantNumber.innerHTML =
        "Pinewood Participants: " + updatedParticipantsArray.length / 2;

      db.collection("college-counseling-database")
        .doc(modalHeader.children[0].textContent)
        .update({
          participated: convertArray,
        })
        .catch(function (error) {
          console.error("Error writing document: ", error);
        });
    }
  });
}

function getDate() {
  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  return [day, month, year]
}

//adding a comment
function addComment() {
  commentContent = document.getElementById("inputComment");
  updateCommentSection = document.getElementById("addComments");
  modalHeader = document.getElementById("modal-header");
  div = document.createElement("div");

  [day, month, year] = getDate();
  currentDate = month +"/"+ day +"/"+ year;

  comment = document.createElement("p");
  comment.innerHTML = commentContent.value;

  nameAndDate = document.createElement("p");
  nameAndDate.classList.add("smallTextNameAndDate");
  nameAndDate.innerHTML = "<i> <div class='authEmail'>" + auth.currentUser.email + "</div>, <div class='authDate'>" + currentDate + "</div> </i>";

  div.appendChild(comment);
  div.appendChild(nameAndDate);

  existingCommentsArray = [];
  nestedList = {
    comment: commentContent.value,
    email: auth.currentUser.email,
    date: currentDate};

  updateCommentSection.appendChild(div);

  for (var i = 0; i < updateCommentSection.children.length; i++) {
    existingCommentsArray.push(updateCommentSection.children[i].textContent);
  };

  db.collection("college-counseling-database")
    .doc(modalHeader.children[0].textContent)
    .update({
      comments: firebase.firestore.FieldValue.arrayUnion(nestedList),
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });
    
  commentContent.value = "";

  db.collection("history")
    .doc(
      "comment: " +
        modalHeader.children[0].textContent +
        " " + date
    )
    .set({
      action: {
        type: "add comment",
        summercamp: modalHeader.children[0].textContent,
        content: commentContent.value,
      },
      date: month.toString() + "/" + day.toString() + "/" + year.toString(),
      user: auth.currentUser.email,
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });
}

//variables for both "createReportButton()" and "addReport()"
var reportTarget = ""
var commentNumber = 0
var tagNumer = 0

//report button
function createReportButton(target) {
  const reportButton = document.createElement("button");
  reportModal = document.getElementById("reportModal")
  reportModalLabel = document.getElementById("reportModalLabel");
  reportTextArea = document.getElementById("reportTextArea")
  campBeingReported = document.getElementById("camp name").innerHTML;
  reportButton.textContent = "Report";

  reportButton.classList.add("report-button", "btn", "btn-outline-danger", "btn-sm");
  reportButton.setAttribute("data-bs-toggle","modal");
  reportButton.setAttribute("data-bs-target","#reportModal");
if (target.id.startsWith("tag")) {
    reportButton.style.cssText = "margin-right:10px; margin-left:10px";
  } else {
  reportButton.style.cssText = "margin-right:10px; margin-left:10px; float:right";
  };

  reportButton.setAttribute("onmouseout", "handleMouseOut(event, this)");
  reportTarget = target.id;
  if (reportTarget.includes("comment")) {
    commentNumber = reportTarget.substring(8)
    reportTarget = "comments"
  }
if (reportTarget.includes("tag")) {
    tagNumber = reportTarget.substring(3)
    reportTarget = "tags"
  }

  reportModalLabel.innerHTML = ("Report " + campBeingReported + "'s " + reportTarget + ":");

  reportModal.addEventListener("hidden.bs.modal", function() {
    if (!reportTextArea.value == "") {
      reportTextArea.value = "";
    };
  });

  return reportButton;
};

//actually adds the report (separated into a diff function bc it triggeres after confirming)
function addReport() {
  campBeingReported = document.getElementById("camp name").innerHTML;
  reportTextArea = document.getElementById("reportTextArea");
  reportDesc = reportTextArea.value

  if (reportTarget == "comments"){
    reportDesc = ("comment" + commentNumber + "-" + reportDesc)
  }

if (reportTarget == "tags"){
    reportDesc = ("tag" + tagNumber + "-" + reportDesc)
  }

  //A BUNCH OF FIREBASE STUFF
  getReports().then(results => { 
    [day, month, year] = getDate();

    nameArray = [];

    //creating two arrays that merge and get put into firebase (updates the existing firebase list of reports)
    dbRef = db.collection("reports").doc(campBeingReported);
    updatedReportsArray = [];
    existingReportsArray = [];

    date = month +"/"+ day +"/"+ year

    fullReport = reportDesc +"-"+ date

    updatedReportsArray.push(fullReport);

    //makes sure all this happens AFTER it gets the existing reports, otherwise it stores it before it even gets the data
    dbRef.get().then(function(doc) {
      if (doc.exists) {
        existingReportsArray = doc.data()[reportTarget] || [];
       
        for (var i = 0; i < existingReportsArray.length; i++) { 
          updatedReportsArray.push(existingReportsArray[i]);
        }
        
        //these are the documents in firebase, if the camp has never been reported before then it adds it to the "reports" collection
        for (let i = 0; i < results.length; i++) {
          nameArray.push(results[i].name);
        }
    
        if (nameArray.includes(campBeingReported)) {
          db.collection("reports").doc(campBeingReported).update({
            [reportTarget]: updatedReportsArray,
          });
          alert("Reported!");
        }
      } else {
        db.collection("reports").doc(campBeingReported).set({
          name: campBeingReported,
          description: [],
          link: [],
          tags: [],
          comments: [],
        })
        .then(function() {
          db.collection("reports").doc(campBeingReported).update({
            [reportTarget]: updatedReportsArray,
          })
          alert("Reported!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
      };
    });
  });
};


//handles when the mouse hovers over description element (spawns report button)
function handleMouseOver(element) {
  const reportButton = createReportButton(element);
  if (!element.parentElement.querySelector(".report-button") && editing == false) {
if (element.id.startsWith("tag")) {
      element.parentElement.insertBefore(reportButton, element.parentElement.firstChild);
    } else {
    element.parentElement.insertBefore(reportButton, element);
}
  };
};

//handles when the mouse stops hovering over description element (despawns report button)
function handleMouseOut(event, element) {
  const reportButton = element.parentElement.querySelector(".report-button");
  if (reportButton && !reportButton.contains(event.relatedTarget)) {
    element.parentElement.removeChild(reportButton);
  }
};

function setUpReportDatabase() {
  // add collection for Summer Program 1
  db.collection("reports").doc("id1").set({
    name: ["summer program 1", 1],
    description: ["al;kdjf;lkasjdf", 1],
    link: ["wiki.nl", 1],
    tags: ["stem/1", "stem2/1"],
    comments:["comment1/1", "comment2/1"],
  })
  .then(function() {
    console.log("Document successfully written!");
  })
  .catch(function(error) {
      console.error("Error writing document: ", error);
  });

}

//setUpReportDatabase() //DO NOT UNCOMMENT THANK YOU VERY MUCHI (if you uncomment cate will hunt you down) (yes that is a threat)

//initial commit to set up firebase
function setUpFirebaseDatabase() {
  // add collection for Summer Program 1
  db.collection("college-counseling-database")
    .doc("id1")
    .set({
      name: "summer program 1",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec posuere odio est, at aliquet sapien malesuada id. Sed rutrum, nulla luctus vulputate aliquam, neque orci aliquet ante, vel commodo erat orci non eros. Mauris sit amet sodales massa. Donec eu volutpat tellus, sit amet pulvinar nisi. Aenean nec orci eros. Nam tempor sapien in lorem gravida pretium. Nulla quis lorem suscipit ante lacinia varius. Curabitur purus ex, sodales et posuere a, tincidunt in turpis.",
      organization: "Pinewood",
      link: "wiki.nl",
      tags: ["stem", "stem2", "california"],
      participated: ["Micky/Sophomore", "Mini/Senior"],
      comments: ["comment1", "comment2"],
      status: "active",
    })
    .then(function () {
      console.log("Document successfully written!");
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });
  // add collection for summer program 2
  db.collection("college-counseling-database")
    .doc("id2")
    .set({
      name: "summer program 2",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sagittis sapien a euismod finibus. Duis consectetur fermentum libero vitae bibendum. Cras condimentum pretium elementum. Mauris non dictum sem, eget rutrum lacus. Fusce hendrerit blandit tristique. Morbi nec sem vel metus imperdiet tincidunt vel non mi. Sed lorem felis, tempus sit amet pretium vel, cursus sit amet ex.",
      organization: "Pinewood",
      link: "wiki.nl",
      tags: ["language", "fun", "california"],
      participated: ["Jane/Junior", "Doe/Senior"],
      comments: ["comment1", "comment2"],
      status: "active",
    })
    .then(function () {
      console.log("Document successfully written!");
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });
}

function showTag(tag) {
  getSummerCamps().then((results) => {
    element = document.getElementById("add-camps");

    while (element.hasChildNodes()) {
      element.firstChild.remove();
    }
    //simple insertion sort (ik built-in sort is faster but im too lazy to write custom comparator function so cry abt it)
    for (var i = 1; i < results.length; i++) {
      var idx = i;
      while (
        idx > 0 &&
        results[idx].participated.length > results[idx - 1].participated.length
      ) {
        var temp = results[idx];
        results[idx] = results[idx - 1];
        results[idx - 1] = temp;
        idx--;
      }
    }
    for (var i = 0; i < results.length; i++) {
      var flag = false;
      for (var j = 0; j < results[i].tags.length; j++) {
        if (results[i].tags[j].toLowerCase() == tag.toLowerCase()) {
          flag = true;
        }
      }
      if (tag != "" && !flag) {
        continue;
      }
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
}
let submitButton = document.getElementById("submitNewContent");
submitButton.onclick = function () {
  createFromAddContent();
};

function autoRefresh() {
  window.location = window.location.href;
}

function createFromAddContent() {
  alert("Content Submitted");
  let nameOfSummerCamp = document.getElementById("nameOf");
  let organization = document.getElementById("org");
  let link = document.getElementById("link");
  let tagDiv = document.getElementById("tagDiv");
  let children = tagDiv.children;
  let descriptionInput = document.getElementById("descriptionInput");

  db.collection("college-counseling-database").doc(nameOfSummerCamp.value).set({
    name: nameOfSummerCamp.value, 
    description: descriptionInput.value,
    organization: organization.value, 
    link: link.value,
    tags: [children[1].value, children[2].value, children[3].value],
    participated:[], 
    comments:[],
    reports:[],
    status: "active"
  })
  .then(function() {
    console.log("Document successfully written!");
    autoRefresh();
  })
  .catch(function(error) {
      console.error("Error writing document: ", error);
    });

  [day, month, year] = getDate();

  let flag = false;
  db.collection("history")
    .doc("add " + nameOfSummerCamp.value)
    .set({
      action: {
        type: "add summer program",
        summercamp: nameOfSummerCamp.value,
      },
      date: month.toString() + "/" + day.toString() + "/" + year.toString(),
      user: auth.currentUser.email,
    })
    .then(function () {
      console.log("Document successfully written!");
    })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    });
  littleArrayTeeHee = [
    nameOfSummerCamp,
    organization,
    link,
    tagDiv,
    children[1],
    children[2],
    children[3],
    descriptionInput,
  ];

  for (var i = 0; i < littleArrayTeeHee.length; i++) {
    littleArrayTeeHee[i].value = "";
  }
}

var out = ""; // Global variable used to update tag calculated in promise (mostUsedTagsPromise(val))
function mostUsedTagsPromise(val) {
  // Create a map with key being tag and value being the count of results with tag
  return getSummerCamps()
    .then((results) => {
      console.log("Check results", results.length);

      let tagCounts = {}; // Dictionary to keep tags and counts in results. eg. key = "academic", value = 6 if academic appears 6 times in results
      for (var i = 0; i < results.length; i++) {
        for (var j = 0; j < results[i].tags.length; j++) {
          var tag = results[i].tags[j].toLowerCase();
          firstLetter = tag.charAt(0);
          firstLetter = firstLetter.toUpperCase();
          remainingLetters = tag.substring(1);
          tag = firstLetter + remainingLetters;

          // increase count for tag in tagCounts because results[i] includes this tag or set it to 1 if it is not in tagCounts
          if (tag in tagCounts) {
            tagCounts[tag] = tagCounts[tag] + 1;
          } else {
            tagCounts[tag] = 1;
          }
        }
      }

      // Create an array from the map to sort by value  eg. [['academic', 4], ['fun', 6]]
      var items = Object.keys(tagCounts).map(function (key) {
        return [key, tagCounts[key]];
      });

      // Sort the array based on the second element
      items.sort(function (first, second) {
        return second[1] - first[1];
      });

      // Set the text in the buttons sorted by tag (fixed 6 buttons at most)
      if (items.length > 0) {
        document.getElementById("button-tag1").innerText = items[0][0];
      } else {
        document.getElementById("button-tag1").innerText = "";
      }
      if (items.length > 1) {
        document.getElementById("button-tag2").innerText = items[1][0];
      } else {
        document.getElementById("button-tag2").innerText = "";
      }
      if (items.length > 2) {
        document.getElementById("button-tag3").innerText = items[2][0];
      } else {
        document.getElementById("button-tag3").innerText = "";
      }

      if (items.length > 3) {
        document.getElementById("drop-button-tag1").innerText = items[3][0];
      } else {
        document.getElementById("drop-button-tag1").innerText = "";
      }
      if (items.length > 4) {
        document.getElementById("drop-button-tag2").innerText = items[4][0];
      } else {
        document.getElementById("drop-button-tag2").innerText = "";
      }
      if (items.length > 5) {
        document.getElementById("drop-button-tag3").innerText = items[5][0];
      } else {
        document.getElementById("drop-button-tag3").innerText = "";
      }
      return Promise.resolve(items[val][0]);
    })
    .then((res) => {
      out = res;
    });
}

async function mostUsedTags(val) {
  await mostUsedTagsPromise(val);
  console.log("Out, ", out);
}

var editing = false
function adminEdit() {
  editing = true
  addGeneralDescription = document.getElementById("addGeneralDescription");
  addWebLink = document.getElementById("addWebLink");
  AdminParticipantEdit = document.getElementById("AdminParticipantEdit");
  currentParticipants = document.getElementById("addParticipants");
  commentContent = document.getElementsByClassName("commentContent");
  modalFooter = document.getElementById("modalFooter");
  editContent = document.getElementById("editContent");
  tagOne = document.getElementById("tag0");
  tagTwo = document.getElementById("tag1");
  tagThree = document.getElementById("tag2");
  rowContainer = document.getElementById("rowContainer");
  
  if (rowContainer != null) {
    rowContainer.remove();
  } else {
    console.log("rowContainer not found");
  }

  AdminParticipantEdit.style.display = "flex";
  editContent.style.display = "none";

  console.log(tagOne);

  tagOne.innerHTML =
    '<input class="form-control form-control-sm" value=' +
    tagOne.innerText +
    ">";
  tagTwo.innerHTML =
    '<input class="form-control form-control-sm" value=' +
    tagTwo.innerText +
    ">";
  tagThree.innerHTML =
    '<input class="form-control form-control-sm" value=' +
    tagThree.innerText +
    ">";

  addGeneralDescription.innerHTML =
    '<textarea class="form-control" id="floatingTextarea">' +
    addGeneralDescription.innerText +
    "</textarea>";
  addWebLink.innerHTML =
    '<input class="form-control" value=' + addWebLink.innerText + ">";

  rowContainer = document.createElement("div");
  rowContainer.classList.add("container");
  rowContainer.setAttribute("id", "rowContainer");
  rowContainer.classList.add("px-3");
  rowContainer.classList.add("text-center");
  rowContainer.classList.add("contentModal");
  rowContainer.classList.add("contentContainer");

  rowDiv = document.createElement("div");
  rowDiv.classList.add("row");
  rowDiv.classList.add("gx-3");
  rowDiv.classList.add("row-cols-1");
  rowDiv.classList.add("g-3");

  for (var i = 0; i < currentParticipants.children.length / 2; i++) {
    empty = document.createElement("p");
    rowContent = document.createElement("button");

    rowContent.classList.add("btn-close");
    rowContent.setAttribute("aria-label", "Close");
    rowContent.setAttribute("type", "button");
    rowContent.setAttribute("onClick", `deleteParticipant(${i})`);

    rowDiv.appendChild(empty);
    empty.appendChild(rowContent);
  }
  // }
  rowContainer.appendChild(rowDiv);
  AdminParticipantEdit.appendChild(rowContainer);

  for (var c = 0; c < commentContent.length; c++) {
    commentContent[c].innerHTML =
      '<textarea class="form-control" id="floatingTextarea">' +
      commentContent[c].innerText +
      "</textarea>";
  }

  if (document.getElementById("doneButton") == null) {
    doneButton = document.createElement("button");
    doneButton.classList.add("btn");
    doneButton.classList.add("btn-outline-success");
    doneButton.setAttribute("onClick", "exitEdit()");
    doneButton.setAttribute("id", "doneButton");
    doneButton.setAttribute("data-bs-dismiss", "modal");
    doneButton.innerHTML = "Save Editing";

    modalFooter.appendChild(doneButton);
  } else {
    doneButton = document.getElementById("doneButton");
    doneButton.style.display = "flex";
  }
}

function buttonChange() {
  editContent = document.getElementById("editContent");
  editContent.style.display = "flex";

  doneButton = document.getElementById("doneButton");
  doneButton.style.display = "none";
}

function exitEdit() {
  editing = false
  addGeneralDescription = document.getElementById("addGeneralDescription");
  updateCommentSection = document.getElementsByClassName("commentContent");
  tags = document.getElementById("addTagsModal");
  participants = document.getElementById("addParticipants");
  webLink = document.getElementById("addWebLink");
  webValue = webLink.children[0].value;
  modalHeader = document.getElementById("modal-header");
  campName = modalHeader.children[0].textContent;

  existingCommentsArray = [];
  existingTagsArray = [];
  existingParticipantsArray = [];

  authEmail = document.getElementsByClassName("authEmail");
  authDate = document.getElementsByClassName("authDate");

  for (var i = 0; i < updateCommentSection.length; i++) {
    if (updateCommentSection[i].children[0].value != "") {

      nestedDictionary = {
        comment: updateCommentSection[i].children[0].value,
        date: authDate[i].textContent,
        email: authEmail[i].textContent,
      }

      existingCommentsArray.push(nestedDictionary);
    }
  }

  for (var i = 0; i < tags.children.length; i++) {
    existingTagsArray.push(tags.children[i].children[0].value);
  }

  for (var i = 0; i < participants.children.length; i += 2) {
    existingParticipantsArray.push(
      participants.children[i].innerHTML +
        "/" +
        participants.children[i + 1].innerHTML
    );
  }

  db.collection("college-counseling-database").doc(campName).update({
    description: addGeneralDescription.children[0].value,
    tags: existingTagsArray,
    comments: existingCommentsArray,
    participated: existingParticipantsArray,
    link: webValue,
  })
  .catch(function (error) {
    console.error("Error writing document: ", error);
  });

  buttonChange();

  content(campName);
}

function deleteParticipant(c) {
  // Remove name and grade from table
  participants = document.getElementById("addParticipants");
  if (participants.hasChildNodes()) {
    participants.removeChild(participants.children[c * 2 + 1]); // remove grade
    participants.removeChild(participants.children[c * 2]); // remove name
  }

  // Remove last button from "remove button array"
  delContainer = document.getElementById("rowContainer");
  if (delContainer.hasChildNodes()) {
    delButtons = delContainer.children[0];
    delButtons.removeChild(delButtons.lastElementChild);
  }
}