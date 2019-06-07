// ==UserScript==
// @name         Chatter to Speech
// @namespace    https://www.leitstellenspiel.de/
// @version      1.22
// @description  Einsatzfunk zu Sprache
// @author       LennardTFD
// @match        https://www.leitstellenspiel.de/
// @match        https://www.missionchief.com/
// @match        https://www.meldkamerspel.com/
// @updateURL    https://github.com/LennardTFD/LSS_ChatterToSpeech/raw/master/chatterToSpeech.user.js
// @downloadURL  https://github.com/LennardTFD/LSS_ChatterToSpeech/raw/master/chatterToSpeech.user.js
// @require      https://code.responsivevoice.org/responsivevoice.js
// @grant        none
// ==/UserScript==

var SIREN_URL = "MYAUDIOURL";

var apiKeys = ["H9aKeucp", "rGxkrbXx", "Nf6P23Fg", "C24n6rzz", "KEUuZq9F", "Bm2hpREZ"];
function randomApiSelect()
{
    return apiKeys[Math.floor(Math.random()*apiKeys.length)];
}

//Import "ResponsiveVoice" API
$("body").append("<script src='https://code.responsivevoice.org/responsivevoice.js?key=" + randomApiSelect() + "></script>");
//Import background siren
$("body").append('<audio loop="false" width="0" height="0" id="sound" src="' + SIREN_URL + '" type="audio/mp3" ></audio>');


//Words which need corrected pronunciation
var wordsToPronounce = [
    ["RTW", "R T W"], ["NEF", "N E F"], ["BNAW", "Baby N A W"], ["NAW", "N A W "], ["KTW", "K T W "], ["OrgL", "Org L "], ["GRTW", "G R T W"],

    ["ELW", "E L W "], ["DLK", "D L K "], ["HLF", "H L F "], ["LF", "L F "], ["TLF", " T L F "], ["KatS", " Kat Schutz "],
    ["AnH", " Anhänger "], ["DekonP", "Dekon P "], ["GW", "G W "], ["WLF", "W L F "], ["AB", "A B"], ["MTF", "M T F"], ["MTW", "M T W"],

    ["RTB", "R T B"], ["MZB", "M Z B"],
    ["FuStW", "Funkstreife "], ["GruKw", "Gru K W "],

    ["Brandmeldeanlage", "B M A "], ["KH", ""]
];

//Phrases to randomly use for diffrent Status
var phrases = {
    "0": ["Blitz, Blitz, Blitz. Notruf von %UNIT%", "Notruf von %UNIT%", "%UNIT% Notruf", "Unterstützung zu %UNIT%", "Unterstützung zu %ADDRESS%!"],
    "1": ["Hier %UNIT%. Wir rücken ein", "%UNIT% Status 1", "%UNIT% rückt ein", "%UNIT% sind auf dem Weg zur Wache", "%UNIT%. Einsatzstelle übergeben. Alle Einheiten können einrücken", "%UNIT%. Einsatz beendet", "%UNIT% Einsatz beendet. Wir rücken ab", "%UNIT% wieder frei"],
    "2": ["%UNIT% zurück auf Wache", "%UNIT% auf Wache", "%UNIT% in der Fahrzeughalle", "%UNIT% Status 2", "%UNIT% meldet frei auf Wache"],
    "3": ["%UNIT% auf Anfahrt", "%UNIT% rückt aus!", "%UNIT%. Wir rücken aus", "Hier %UNIT%. Wir rollen!", "%UNIT% rollt", "Hier %UNIT%. Wir rücken aus", "%UNIT% auf Anfahrt", "%UNIT% sind auf Anfahrt", "Hier %UNIT%. Sind auf Anfahrt", "%UNIT% Status 3",
        "%UNIT% auf Anfahrt zum Einsatz", "%UNIT% aufgesessen", "%UNIT% zu %ADDRESS%", "%UNIT% auf Anfahrt zu %MISSION%", "%UNIT% fährt zu %MISSION% an %ADDRESS%", "%UNIT% verstanden", "Hier %UNIT%, verstanden", "%UNIT% zu %MISSION% an %ADDRESS%",
        "%UNIT%, %MISSION%, %ADDRESS%", "%ADDRESS%, %UNIT%", "%MISSION% für %UNIT% an %ADDRESS%", "%UNIT%, %ADDRESS%, %MISSION%"],
    "4": ["%UNIT% an Einsatzstelle eingetroffen!", "%UNIT% hat Einsatzstelle erreicht", "%UNIT% Status 4", "%UNIT% . Status wechsel auf die 4", "%UNIT%. Am Einsatzort eingetroffen", "%UNIT% hat %MISSION% erreicht", "%UNIT% an %ADDRESS% angekommen"],
    "5": ["Leitstelle für %UNIT%. Kommen!", "Leitstelle für %UNIT%", "Leitstelle von %UNIT%", "Einmal Leitstelle für %UNIT%", "Sprechwunsch für %UNIT%"],
    "6": ["%UNIT% geht außer Dienst", "%UNIT% nicht einsatzbereit", "%UNIT% nicht besetzt", "%UNIT% kann nicht ausrücken", "%UNIT% unbesetzt", "Wir machen Feierabend. %UNIT%"],
    "7": ["Hier %UNIT%. Mit Sonderrechten ins Krankenhaus", "%UNIT% Status 7", "Hier %UNIT%. Wir wechseln auf Status 7", "Status 7 für %UNIT%", "%UNIT% hat Patienten aufgenommen", "%UNIT% wir fahren zu %BUILDING%",
        "%UNIT% bringt Patienten zu %BUILDING%", "%UNIT% mit Sonderrechten nach %BUILDING%", "%BUILDING% für %UNIT%", "Voranmeldung bei %BUILDING% für %UNIT%"],
    "8": ["Hier %UNIT%. Laden aus", "%UNIT% lädt aus", "%UNIT% Status 8", "Status 8 für %UNIT%"],
    "9": ["%UNIT% wartet auf Abholung", "%UNIT% steht bereit", "%UNIT% kann abgeholt werden", "%UNIT% auf Status 9"]
}

//Voices used. Duplicate voice sets increase their frequency
var voices = ["Deutsch Male", "Deutsch Male", "Deutsch Female"];

var audio = document.getElementById('sound');
audio.volume = 0.04;
var isSpeaking = false;

//Queue of last Status changes
var chatterQueue = [];

function chatParser(missionInfo)
{

    var unit = missionInfo[0];
    var status = missionInfo[1];
    var address = missionInfo[2];
    var mission = missionInfo[3];
    var building = missionInfo[4];

    if(String(parseInt(address)).length == 5)
    {
        //address = address.split(" ");
        //TODO turn 41642 in 41 6 4 2
    }

    //Replace unit names with correct pronunciation
    for(var i = 0; i < wordsToPronounce.length; i++)
    {
        unit = unit.replace(wordsToPronounce[i][0], wordsToPronounce[i][1]);
    }
    //removes "/" and "-" from call signs
    unit = unit.replace(/\//gi, " ");
    unit = unit.replace(/-/gi, " ");

    //Select a random phrase from phrases list
    var pharse = phrases[status][Math.floor(Math.random()*phrases[status].length)];

    //Replace Unit Wildcard with calling unit
    pharse = pharse.replace("%UNIT%", unit);

    //If Status 3 or 4
    if(status == "3" || status == "4")
    {
        //Diese Parameter treffen nur auf Status 3 und 4 Einsätze zu
        //Replace Address wildcard with mission address
        pharse = pharse.replace("%ADDRESS%", address);
    }
    //If Status 7
    else if(status == "7")
    {
        //If no building name is available replace with default value
        if(building == undefined)
        {
            building = "Krankenhaus"
        }
        //Replace Building wildcard with building unit is driving to
        pharse = pharse.replace("%BUILDING%", building);
    }

    //Replace mission wildcard with mission name
    pharse = pharse.replace("%MISSION%", mission);

    if(status == "3")
    {
        //Play background sound when en route
        if(Math.floor((Math.random() * 2) + 1) == 1)
        {
            startBackground();
        }
    }

    return pharse;
}


function workOffQueue()
{
    //If there are unfinished chatter messages AND there is currently no other speech
    if(chatterQueue.length > 0 && !responsiveVoice.isPlaying() && !isSpeaking)
    {
        //Make queue smaller if there is to much old chatter
        if(chatterQueue.length > 10)
        {
            chatterQueue = chatterQueue.splice(0,4);
        }

        isSpeaking = true;
        var curr = chatterQueue[0];
        chatter(chatParser(curr));
        chatterQueue.shift();
    }
    //If there is currently chatter
    else if(chatterQueue != 0)
    {
        //retry 1 second later
        setTimeout(workOffQueue, 1000);
    }
}


function addToQueue(unit, status, address, missionName, buildingName)
{
    //Add new chatter message to working queue
    chatterQueue.push([unit, status, address, missionName, buildingName]);
}

function startBackground()
{
    //Play background Sound
    audio.play();
}
function stopBackground()
{
    //Stop background sound
    audio.pause();
    isSpeaking = false;
}

function chatter(msg)
{
    //select random speed
    var speed = parseFloat((Math.random() * (0.0 - 0.1500) + 0.0200).toFixed(4));
    //Select random speeker
    var talker = voices[Math.floor(Math.random()*voices.length)];
    //Play chatter Audio
    responsiveVoice.speak(msg, talker, {rate: (1.2 + speed), onStart: function(){isSpeaking = true}, onend: stopBackground});
}

var mutationObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {

        var node = mutation.addedNodes[0];
        if(node == undefined)
        {
            return;
        }
        //Dont play sound if chatter comes from alliance
        var aliance = $(node).attr("class");
        if(aliance.includes("radio_message_alliance"))
        {
            return;
        }
        //Select Status from new chatter message
        var status = $(node).find("span").html();
        //select calling unit
        var unit = $(node).find("[href^='/vehicles/']").html();

        var missionName = undefined;
        var missionAddress = undefined;
        var buildingName = undefined;

        switch(status)
        {
            //If status 3 or 4
            case "3":
            case "4":
                //Get Mission reference
                var missionId = ($(node).find("[href^='/missions/']")[0].href).split("/missions/")[1];
                var missionInList = $("#missions-panel-body").find("[href*='" + missionId + "']");
                var missionData = missionInList.parent().find(".map_position_mover");
                //Grab Mission Name
                missionName = (missionData.html()).split(",")[0];
                //Grab Mission Address
                missionAddress = (missionData.find("small").html()).split(",")[0];
                //console.log(unit + ": " + missionName + " | " + missionAddress);
                break;
            //If Status 7
            case "7":
                //Grab building name
                buildingName = $(node).find("[href^='/buildings/']").html();
                //console.log("!!!!!!STATUS 7!!!!! BUILDING: " + buildingName);
                break;
        }
        //console.log(status + " | " + unit);
        //If is real chatter
        if(unit != undefined && status != undefined)
        {
            //Add new chatter to queue
            addToQueue(unit, status, missionAddress, missionName, buildingName);
            //Start working on queue
            workOffQueue();
        }

    });
});

//Listen for new Incomming Status updates
mutationObserver.observe($("#radio_messages")[0], {
    childList: true
});
//Listen for new FMS5 and similars
mutationObserver.observe($("#radio_messages_important")[0], {
    childList: true
});
