var sessionid = null;

function checkLogin(){
    var url_string = window.location.href; //window.location.href
    console.log("url_string: "+url_string);
    var url = new URL(url_string);
    var c = url.searchParams.get("session");
    console.log("C vlaue "+c);
    if (c != null) {
        sessionid = c;
        console.log("sessionid: "+sessionid)
        checkIfAdmin()
    } else {
        console.log("not logged in yet, redirecting")
        //window.location.href="https://lye.software/signin?forward=stats.lye.software-index.html"
    }
    

    

}


async function getInfo(serverResponse){
    //serverResponse = await httpGet("https://lye.software/"+sessionid+"/getinfo")
    printBaseInfo(serverResponse.split("-seperator-"))
    console.log(serverResponse.split("-seperator-").length)
    console.log(serverResponse.split("-seperator-"))
    if (serverResponse.split("-seperator-").length>4){
        printAdminInfo(serverResponse.split("-seperator-"))
    }
    hideElement(document.getElementById("loading"))
}


function printBaseInfo(rsp){
    var information = `
    <h3 style="text-align: left;">Number of accounts with unique emails: ${rsp[0]}</h3>
    <h3 style="text-align: left;">Week number: ${rsp[1]}</h3>
    <h3 style="text-align: left;"># of logged in users this week: ${rsp[2]}</h3>
    <h3>Total # of sessionIDs: ${rsp[3]}</h3>
    `
    document.getElementById("infoHolder").innerHTML += information;

}

function printAdminInfo(rsp)
{
    document.title = "Lye Admin Stats"
    var moreInfo = `
    <h1>Admin Mode Info</h1>
    <h3>Lang Studysheet count: ${rsp[8]}</h3>`
    document.getElementById("infoHolder").innerHTML += moreInfo;
    let info = `
    
    <h3>Username & token list</h3>
    <div id="previewUToek" style="display: flex; flex-direction: column; justify-content: center;">
    </div> 
    <h3>Tokens that are signed in this week</h3>
    <div id="signedTok" style="display: flex; flex-direction: column; justify-content: center;">
    </div> 
    <h3>Lang Feedback (feedback & token of feedbacker)</h3>
    <div id="previewFeedback" style="display: flex; flex-direction: column; justify-content: center;">
    </div> 
    <h3>Lang Studysheet list (name of sheet & token)</h3>
    <div id="previewSS" style="display: flex; flex-direction: column; justify-content: center;">
    </div> 
    

    `
    document.getElementById("infoHolder").innerHTML += info;
    console.log("rsp4: "+rsp[4])
    //username & token list
    let uTokList = rsp[4]
    uTokArrTxt = splitter(uTokList)
    show(uTokArrTxt, "previewUToek")
    //studysheet list
    let ssList = rsp[5];
    arrSSList = splitter(ssList)
    show(arrSSList, "previewSS")
    //Lang Feedback
    let feedback = rsp[6];
    arrFeedback = splitter(feedback)
    show(arrFeedback, "previewFeedback")
    //tokens signed in this week
    let toek = rsp[7]
    arrToek = toek.split("-subseperator-")
    for (i=0; i<arrToek.length; i++){
        div = document.createElement("DIV");
        div.innerHTML = arrToek[i]
        div.style.border = "2px solid black";
        div.style.padding = "10px";
        document.getElementById("signedTok").append(div);
    }
    

}
// async function getAdminInfo(newInfo){
    
//     splitUToekList()
//     var info = `
//     <h1>Admin Mode Info</h1>
//     <h3>Username & token list</h3>
//     <div id="previewUToek">
//     </div> 
//     <h3>Lang Studysheet list (name of sheet & token)</h3>
//     <h3>Lang Feedback (feedback & token of feedbacker)</h3>`

//     document.getElementById("infoHolder").innerHTML+=info;

//     var otherInfo = `
//     <h3>Tokens logged in: ${toeknum}</h3>
//     <h3>Lang Studysheet count: ${num}</h3>`
// }


function hideElement(element){
    element.style.opacity = "0";
    element.style.pointerEvents = "none";
}

function splitter(sheet){
    // console.log("og sheet: "+sheet)
    sheet = sheet.replaceAll("-subseperator-", "\n")
    console.log(sheet)
    
    customWords = sheet
    arrayText = customWords.split('\n')
    return arrayText;
}

function show(arrayText, id){
    for (i=0; i<arrayText.length; i++){
        pair = arrayText[i];
        console.log("Pair #"+i+" is: "+pair);
        parsedPair = JSON.parse(pair);
        div = document.createElement("DIV");
        div.innerHTML = parsedPair[0]
        div.style.border = "2px solid black";
        div.style.padding = "10px";
        div2 = document.createElement("DIV");
        div2.innerHTML = parsedPair[1]
        div2.style.border = "2px solid black";
        div2.style.padding = "10px";

        bigDiv = document.createElement("DIV");
        bigDiv.style.display = "flex";

        document.getElementById(id).append(bigDiv);
        bigDiv.append(div);
        bigDiv.append(div2);
        br = document.createElement("br")
        document.getElementById(id).append(br);
        
    }
}

async function httpGet(theUrl, lye){
    
    //this needs to be async as we cannot set timeout for sync request and sync reqs halt all js for browser
    var xmlHttp = new XMLHttpRequest();
    console.log("Opening Connection to "+theUrl)
    // xmlHttp.timeout = 5000;
    
    // xmlHttp.ontimeout = () => {
    //     console.error(`The request for ${url} timed out.`);
    //     alert('The request for '+theUrl+' timed out. We will be reloading this page after the dialogue box is removed.')
    //     window.location.reload();
    //     changeToOffline();
    // };
    xmlHttp.onload = () => {
        if (xmlHttp.readyState === 4) {
        if (xmlHttp.status === 200) {
            console.log("status200")
            console.log( xmlHttp.responseText);
        } else {
            console.error(xmlHttp.statusText);
        }
        }
    };
    await xmlHttp.open( "GET", theUrl, true ); // false for synchronous request

    if (lye == true){
        console.log("setting headers")
        xmlHttp.setRequestHeader("lye-origin", "langstudy.tech/index.html");
    }
    xmlHttp.setRequestHeader("Keep-Alive", "timeout=10, max=5");
    console.log(xmlHttp.status)
    try {
        xmlHttp.send( null );
    } catch (error) {
        console.log(error)
        alert("error line 205 alt ")
        failedServerConnectionOnStart();

        //put a splash screen error here
    }
    
    
    console.log(xmlHttp.status)
    return new Promise(resolve => {
        setTimeout(() => {
            console.log("HTTPGET STATUS: "+xmlHttp.status)
            if(xmlHttp.status == 0){
                offline = true;
                console.error("GET Request status = 0.")
            }
            console.log("XMLHTTP RESPONSE BEGIN")
            console.log(xmlHttp.responseText)
            console.log("XMLHTTP RESPONSE END")
          resolve(xmlHttp.responseText);
        }, 2000);
      });
}
