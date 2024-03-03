var div = document.getElementById('add')

var dbRef = db.collection("history")

var dbPromise = dbRef.get();
dbPromise.then(function(querySnapshot) {
  var results = [];
  querySnapshot.forEach(function(doc) {
    results.push(doc.data());
  });
  console.log(results)
  for (var i = 0; i < results.length; i++){
    var e = document.createElement('p')
    e.innerHTML = "Date: " + results[i].date + ", User: " + results[i].user + ", Action: " + results[i].action["type"]
    div.append(e);
  }
  return Promise.all(results);
})
.catch(function(error) {
  console.log("error getting documents: ", error);
});
