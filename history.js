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
    if ("summercamp" in results[i].action) {
      e.innerHTML += ", Summer camp name: " + results[i].action.summercamp;
      div.append(e);
    }
  }
});
