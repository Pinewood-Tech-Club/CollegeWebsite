function sortingElementsByDate() {
  var paragraphs = document.querySelectorAll("p");

  const paragraphsWithDates = [];

  paragraphs.forEach(paragraph => {
      const dateStr = paragraph.id;
      const date = new Date(dateStr);

      paragraphsWithDates.push({ element: paragraph, date: date });
  });

  //sort the array by date
  paragraphsWithDates.sort((a, b) => b.date - a.date);

  
  paragraphsWithDates.forEach(item => {
      document.body.appendChild(item.element);
  });
}

async function fetchData() {
  var snap = await db.collection("history").get();

  var results = [];
  snap.forEach((doc) => {
    results.push(doc.data());
  });

  return results;
}

fetchData().then((results) => {
  var div = document.getElementById("add");
  for (var i = 0; i < results.length; i++) {
    e = document.createElement("p");
    e.setAttribute("id", results[i].date);

    e.innerHTML =
      "<strong> Date: </strong> " +
      results[i].date +
      ", <strong> User:  </strong>" +
      results[i].user +
      ", <strong> Action: </strong> " +
      results[i].action.type;
    if (results[i].action.type == "add summer program") {
      e.innerHTML += ", <strong> Summer camp name: </strong> " + results[i].action.summercamp;
      div.append(e);
    }
    if (results[i].action.type == "add comment") {
      e.innerHTML +=
        ", <strong> Summer camp: </strong>" +
        results[i].action.summercamp +
        ", <strong> Comment content: </strong>" +
        results[i].action.content;
      div.append(e);
    }
  }

  sortingElementsByDate();

});
