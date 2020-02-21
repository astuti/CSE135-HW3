// PUT THIS INSIDE YOUR BODY TAG AT THE BOTTOM 
// <!-- The core Firebase JS SDK is always required and must be listed first -->
// <script src="/__/firebase/7.8.2/firebase-app.js"></script>

// <!-- TODO: Add SDKs for Firebase products that you want to use
//      https://firebase.google.com/docs/web/setup#available-libraries -->
// <script src="/__/firebase/7.8.2/firebase-analytics.js"></script>

// <!-- Initialize Firebase -->
// <script src="/__/firebase/init.js"></script>


var idleObj = setTimeout(timeoutHandler, 2000); 
var currentlyIdling = false;
var idleStart, idleEnd, idleTime;
var uniqueKey, fromPage;

function gatherData(){
    
    var mainPerformanceObject = performance.getEntriesByName("load-time")[0];

    var miscPerfomanceObject = 
    performance.getEntries().find( 
        () => PerformanceNavigationTiming 
        );
    
    var newJSON = {
            id : uniqueKey,
            user_agent:  navigator.userAgent,
            user_lang: navigator.language,
            user_cookies: navigator.cookieEnabled,
            user_js: true,
            user_img: checkImages(),
            user_css: !document.styleSheets[0].disabled,
            user_max_width: screen.width,
            user_max_height: screen.height,
            user_window_width: screen.availWidth,
            user_window_height: screen.availHeight,
            user_ect: navigator.connection.effectiveType,
            performance_load_start: mainPerformanceObject.startTime.toFixed(3),
            performance_load_end: (mainPerformanceObject.startTime + mainPerformanceObject.duration).toFixed(3),
            performance_load_delta:  mainPerformanceObject.duration.toFixed(3),
            performance_request_start: miscPerfomanceObject.requestStart.toFixed(3),
            performance_response_start:  miscPerfomanceObject.responseStart.toFixed(3),
            performance_response_end:  miscPerfomanceObject.responseEnd.toFixed(3),
            performance_transfer_size: miscPerfomanceObject.transferSize,
            performance_encoded_body_size:    miscPerfomanceObject.encodedBodySize,
            dynamic_clicks:  JSON.stringify(mouseClicks),
            dynamic_moves:  JSON.stringify(mouseMoves),
            dynamic_keys:  JSON.stringify(keysPressed),
            dynamic_scroll:  JSON.stringify(scrollEvents),
            dynamic_idle:  JSON.stringify(idleEvents)
    };
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://console.firebase.google.com/project/cse135-hw3-5f57c/overview", true);
    xhttp.send(newJSON);

}

// There should be small 1x1 gif at the bottom of every page called check-image
function checkImages(){
    return document.getElementById('check-image').complete; // this depends on the image being in the html page
}

performance.mark("pre-load");
window.addEventListener('DOMContentLoaded', beginGatherData);

function beginGatherData(){
    performance.mark("post-load");
    performance.measure("load-time", "pre-load", "post-load");
    var path = window.location.pathname;
    fromPage = path.split("/").pop();
    if(fromPage.length > 0){
        uniqueKey = fromPage + ' - ' + (new Date());
    } else {
        uniqueKey = 'index.html' + ' - ' + (new Date());
    }
    addListeners();
}
let mouseClicks = [];
let mouseMoves = [];
let keysPressed = [];
let scrollEvents = [];
let idleEvents = [];
function addListeners(){
    window.addEventListener("click", e => resetIdle() | mouseClicks.push([e.clientX, e.clientY]) );
    window.addEventListener("mousemove", e =>  resetIdle() | mouseMoves.push([e.clientX, e.clientY]) );
    window.addEventListener("keyup", e => resetIdle() | keysPressed.push(e.key) );
    window.addEventListener("scroll", e => resetIdle() | scrollEvents.push([window.scrollX, window.scrollY]) );
    window.addEventListener("beforeunload", e => resetIdle() | storeData());
}


function resetIdle(){
    clearTimeout(idleObj);
    idleObj = setTimeout(timeoutHandler, 2000); 

    if(currentlyIdling){
        idleEnd = new Date().getTime();
        idleTime = idleEnd - idleStart;
        idleEvents.push([idleTime]);
    }
    currentlyIdling = false;
}
function timeoutHandler(){
    currentlyIdling = true;
    idleStart = new Date().getTime();
}

function logClick(e){
    mouseClicks.push([e.clientX, e.clientY]);
}
function logMove(e){
    mouseMoves.push([e.clientX, e.clientY]);
}
function storeData(e){
    gatherData();
}








/* Now begins reportertest.html specific functions */


function purgeAll(){
    if(confirm("Are you sure you want to delete all entries?")){
        localStorage.clear();
        document.getElementById('report-container').innerHTML ="";
    }
}
function purgeEntry(entry){
    if(confirm("Are you sure you want to delete this entry?")){
        var x = JSON.parse(localStorage.getItem('myEntries'));
        x.splice(entry, 1);
        localStorage.setItem('myEntries', JSON.stringify(x));

        document.getElementById('report-container').innerHTML ="";
        populateEntries();
    }
}
function populateEntries(){
    var parsedEntries = JSON.parse(localStorage.getItem('myEntries'));
   for(entryIndex in parsedEntries){
       addEntryTable(entryIndex, parsedEntries);
   }
}
function addEntryTable(entryIndex, parsedEntries){
    var template = document.querySelector('#report-template');
    var clone = document.importNode(template.content, true);
    var reportContainer = document.querySelector('#report-container');
  

    jsonPopulator(entryIndex, clone, parsedEntries)
    reportContainer.appendChild(clone);
    
}

function jsonPopulator(entryIndex, root, parsedEntries,){
    var table = 'static-table';
    root.querySelector('.purge-button').value = entryIndex;

    for(ID in parsedEntries[entryIndex]){  
        
        if(ID.localeCompare("id") != 0){

            root.querySelector('.entry').id = parsedEntries[entryIndex][ID];
            root.querySelector(ID).innerHTML = parsedEntries[entryIndex][ID];
           
        } else {
            root.getElementById(table).innerHTML = parsedEntries[entryIndex][ID];
        }
    }
}