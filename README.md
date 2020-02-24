Before and After Minification Size Comparison:
Before: 4,221 bytes
After: 1,130 bytes

We performed this optimization by using https://javascript-minifier.com/
Other minifiers that we tried would encounter parsing errors upon our anonymous labmbda functions.

Endpoint: https://us-central1-my-third-website.cloudfunctions.net/cookie/newsession
   If a GET request is made at this endpoint, the minified reporter.js is sent in the message
   body as a string. user and sessions cookies are also automatically passed and set using the 
   set-cookie header, if it has not been set before.
   If a POST request is made at this endpoint, the stored user and session ID's are passed along with 
   static, permormance and dynamic information (via the reqest body).

Overview of Data Storage choices:
Our data is stored using a cloud-hosted NoSQL database known as Cloud Firestore. 
We chose to implement our data storage in a nested fashion. Our outer-most collection is Users, 
this collection contains a group of documents which each represent individual users, and each user document id 
corresponds to the user's persistent cookie. Each individual user document has nested inside of it a collection 
called Sessions. Each of these Session collections contains a group of documents corresponding to the pages that 
were viewed by the user during that session, where the session document id corresponds to the user's session cookie, 
and the data collected while on that page (referred to as entries). Each entry then contains fields and values
corresponding to the respective information that our injected reporter script has sent over.

**NOTE: We had to write a small tracker.js script to initiate a proper fetch request to the endpoint to avoid CORS errors. To make this work for another website, simply copy
 our tracker.js script into the script directory of any other website that you trying to host, and invoke it at the bottom of every .html page of your 
 website. Also, Prof Powell approved us to have a group of 4, but the gradescope submission only allows 3 at the moment.