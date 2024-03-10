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
    e.innerHTML =
      "Date: " +
      results[i].date +
      ", User: " +
      results[i].user +
      ", Action: " +
      results[i].action.type;
    if (results[i].action.type == "add summer program") {
      e.innerHTML += ", Summer camp name: " + results[i].action.summercamp;
      div.append(e);
    }
    if (results[i].action.type == "add comment") {
      e.innerHTML +=
        ", Summer camp: " +
        results[i].action.summercamp +
        ", Comment content: " +
        results[i].action.content;
      div.append(e);
    }
  }
});
