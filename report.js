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
    var snap = await db.collection("reports").get();
  
    var results = [];
    snap.forEach((doc) => {
      results.push(doc.data());
    });
  
    return results;
  }
  
  fetchData().then((results) => {
    console.log(results.length == 0);

    if (results.length == 0) {
        addReports = document.getElementById("addReports");

        noData = document.createElement("p");
        noData.setAttribute("style", "text-align : center");
        noData.innerHTML = "No Reports Yet <br> Reports will appear here once added";

        addReports.append(noData);
    }
    else {
    for (var i = 0; i < results.length; i++) {
      
      addReports = document.getElementById("addReports");

        if (results[i].comments != "") {

            for (var c = 0; c < results[i].comments.length; c++) {
                reports = document.createElement("p");
                str = results[i].comments[c];
                stringArray = str.split('-');
                date = stringArray[stringArray.length - 1];

                reports.setAttribute("id", date);

                reports.innerHTML = 
                "<strong>" + 
                stringArray[0][0].toUpperCase() + stringArray[0].slice(1) +
                " Reported " + 
                date + 
                " </strong> " +
                results[i].name +
                ".          <strong> Report content: </strong> " +
                stringArray[1];

                console.log(reports);
                addReports.append(reports);

            }
        }

        if (results[i].description != "") {

            for (var c = 0; c < results[i].description.length; c++) {
                reports = document.createElement("p");
                str = results[i].description[c];
                stringArray = str.split('-');
                date = stringArray[stringArray.length - 1];

                reports.setAttribute("id", date);

                reports.innerHTML = 
                "<strong> Description Reported " + 
                date + 
                " </strong> " +
                results[i].name +
                ".          <strong> Report content: </strong> " +
                stringArray[0];

                console.log(reports);
                addReports.append(reports);
            } 
        }

        if (results[i].link != "") {

            for (var c = 0; c < results[i].link.length; c++) {
                reports = document.createElement("p");
                str = results[i].link[c];
                stringArray = str.split('-');
                date = stringArray[stringArray.length - 1];

                reports.setAttribute("id", date);

                reports.innerHTML = 
                "<strong> Link Reported " + 
                date + 
                " </strong> " +
                results[i].name +
                ".          <strong> Report content: </strong> " +
                stringArray[0];

                console.log(reports);
                addReports.append(reports);
            } 
        }

        if (results[i].tags != "") {

            for (var c = 0; c < results[i].tags.length; c++) {
                reports = document.createElement("p");
                str = results[i].tags[c];
                stringArray = str.split('-');

                date = stringArray[stringArray.length - 1];

                reports.setAttribute("id", date);

                reports.innerHTML = 
                "<strong>" + 
                stringArray[0][0].toUpperCase() + stringArray[0].slice(1) +
                " Reported " + 
                date + 
                " </strong> " +
                results[i].name +
                ".          <strong> Report content: </strong> " +
                stringArray[1];

                console.log(reports);
                addReports.append(reports);
            } 
        }
    }}

    sortingElementsByDate();
    }
  );

