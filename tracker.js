fetch('https://us-central1-cse135-hw3-5f57c.cloudfunctions.net/cookie/newsession', {
  method: 'GET', 
  mode: 'cors', 
  credentials: 'include'
})
  .then((response) => {
    return response.text();
    }).then((myBody) => {
      myBody = myBody.replace(/^"(.*)"$/, '$1');
      var newScript = document.createElement("script");
      var inlineScript = document.createTextNode(myBody);
      newScript.appendChild(inlineScript); 
      document.body.appendChild(newScript);
});