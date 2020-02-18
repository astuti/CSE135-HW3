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
    
    var newJSON = [{
            "id": uniqueKey,
            "#user-agent":  navigator.userAgent,
            "#user-lang"  : navigator.language,
            "#user-cookies"  : navigator.cookieEnabled,
            "#user-js"  : true,
            "#user-img"   : checkImages(),
            "#user-css"  : !document.styleSheets[0].disabled,
            "#user-max-width"   : screen.width,
            "#user-max-height"  : screen.height,
            "#user-window-width"    : screen.availWidth,
            "#user-window-height"   : screen.availHeight,
            "#user-ect" : navigator.connection.effectiveType,
            "#performance-load-start":  mainPerformanceObject.startTime.toFixed(3),
            "#performance-load-end":    (mainPerformanceObject.startTime + mainPerformanceObject.duration).toFixed(3),
            "#performance-load-delta":  mainPerformanceObject.duration.toFixed(3),
            "#performance-request-start": miscPerfomanceObject.requestStart.toFixed(3),
            "#performance-response-start":  miscPerfomanceObject.responseStart.toFixed(3),
            "#performance-response-end":  miscPerfomanceObject.responseEnd.toFixed(3),
            "#performance-transfer-size": miscPerfomanceObject.transferSize,
            "#performance-encoded-body-size":    miscPerfomanceObject.encodedBodySize,
            "#dynamic-clicks":  JSON.stringify(mouseClicks),
            "#dynamic-moves":  JSON.stringify(mouseMoves),
            "#dynamic-keys":  JSON.stringify(keysPressed),
            "#dynamic-scroll":  JSON.stringify(scrollEvents),
            "#dynamic-idle":  JSON.stringify(idleEvents)
    }];
    if(localStorage.getItem('myEntries') != null){
        var existingJSON = JSON.parse(localStorage.getItem('myEntries'));
        existingJSON.push(newJSON[0]);
        localStorage.setItem('myEntries', JSON.stringify(existingJSON));  
    } else {
        localStorage.setItem('myEntries', JSON.stringify(newJSON));  
    }  
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
    var existingJSON = JSON.parse(localStorage.getItem('myEntries'));
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