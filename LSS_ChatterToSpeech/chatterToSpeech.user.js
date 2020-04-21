// ==UserScript==
// @name         Chatter to Speech
// @namespace    https://www.leitstellenspiel.de/
// @version      1.7
// @description  Einsatzfunk zu Sprache
// @author       LennardTFD
// @match        https://www.leitstellenspiel.de/
// @match        https://www.missionchief.com/
// @match        https://www.meldkamerspel.com/
// @updateURL    https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_ChatterToSpeech/chatterToSpeech.user.js
// @downloadURL  https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_ChatterToSpeech/chatterToSpeech.user.js
// @grant        none
// ==/UserScript==

var SIREN_URL = "MYAUDIOURL";
//Deaktiviert Sound Ausgabe für Status. Beispiel: [1, 2, 3, 4]
var DISABLECHATTERFORSTATUS = [];
var translationLanguage = ""; //Empty, IT

//VOICES CHROME
// 1 = English Male
// 2 = English Female
// 3 = German Female
// 4 = English Female
// 5 = English Female UK
// 15 = Dutch Female
//Get Current Page and select Language for Chatter
var url = window.location.host;
var lang = "";
switch(url)
{
    case "www.leitstellenspiel.de":
        lang = "de-DE";
        break;
    case "www.missionchief.com":
        lang = "en-US";
        break;
    case "www.missionchief.co.uk":
        lang = "en-GB";
        break;
    case "www.meldkamerspel.com":
        lang = "nl-NL";
        break;
    default:
        lang = "en-US";
        break;
}

async function getTranslations()
{
    return new Promise(resolve => {
        $.ajax({
            url: "https://raw.githubusercontent.com/LennardTFD/LeitstellenspielScripte/master/LSS_ChatterToSpeech/translations.json",
            method: "GET",
        }).done((res) => {
            console.log("Got Data!");
            resolve(JSON.parse(res));
        });
    });
}

let translations;
async function init() {
    if(translationLanguage != "")
    {
        translations = await getTranslations();
    }
}

init();

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
/*
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
};
*/
var phrases = {
    "de-DE":{
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
    },
    "en-US":{
        "0": ["Mayday! Mayday! Mayday! %UNIT%", "Emergency call %UNIT%", "%UNIT% Status 0", "Reinforcements to %UNIT%", "Reinforcements to %ADDRESS%!"],
        "1": ["Here %UNIT%. Returning to Station", "%UNIT% Status 1", "%UNIT% ending call", "%UNIT% on way back to station", "%UNIT%. Handed over scene. All Units can head back", "%UNIT%. Scene is clear", "%UNIT% Dispatch finished", "%UNIT% available again"],
        "2": ["%UNIT% back on Station", "%UNIT% on Station", "%UNIT% in Garage", "%UNIT% Status 2", "%UNIT% available on Station"],
        "3": ["%UNIT% enroute", "%UNIT% heading out!", "%UNIT% is enroute", "Here %UNIT%. Heading to scene", "%UNIT% on Status 3", "%UNIT% heading to %ADDRESS%", "%UNIT% enroute to %MISSION%",
            "%UNIT% is driving to %MISSION% at %ADDRESS%", "%UNIT% understood", "%UNIT%, copy", "%UNIT% to %MISSION% near %ADDRESS%", "%UNIT%, %MISSION%, %ADDRESS%", "%ADDRESS%, %UNIT%",
            "%MISSION% for %UNIT% at %ADDRESS%", "%UNIT%, %ADDRESS%, %MISSION%"],
        "4": ["%UNIT% arrived!", "%UNIT% on Scene", "%UNIT% Status 4", "%UNIT% . Changing to Status 4", "%UNIT%. We are on Scene", "%UNIT% arrived at %MISSION%", "%UNIT% on %ADDRESS%"],
        "5": ["Dispatch. How copy?", "Dispatch for %UNIT%", "%UNIT% calling Dispatch", "%UNIT% requesting Dispatch"],
        "6": ["%UNIT% out of order", "%UNIT% unavailable", "%UNIT% unoccupied", "%UNIT% no can do!", "%UNIT% on Status 6"],
        "7": ["Here %UNIT%. Heading to hospital", "%UNIT% Status 7", "Here %UNIT%. We are changing to Status 7", "Status 7 for %UNIT%", "%UNIT% picked up patienten", "%UNIT% heading to %BUILDING%",
            "%UNIT% is transporting patient to %BUILDING%", "%UNIT% transporting to %BUILDING%", "%BUILDING% for %UNIT%", "Registration at %BUILDING% for %UNIT%"],
        "8": ["Here %UNIT%. Unloading", "%UNIT% is unloading", "%UNIT% Status 8", "Status 8 for %UNIT%"],
        "9": ["%UNIT% awaiting pickup", "%UNIT% ready for pickup", "%UNIT% can be picked up", "%UNIT% on Status 9"]
    },
    "nl-NL": {
        "0": [""],
        "1": [""],
        "2": [""],
        "4": [""],
        "5": [""],
        "6": [""],
        "7": [""],
        "8": [""],
        "9": [""]
    }
}

////////////////////////////Duplicating Pharses

phrases["en-GB"] = phrases["en-US"];

////////////////////////////////////////////////
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


    if(translationLanguage != "")
    {
        let newMission = translations[lang][translationLanguage][mission];
        if(newMission != undefined)
        {
            mission = newMission;
        }
    }

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
    unit = unit.replace(/\//gi, "\b");
    unit = unit.replace(/-/gi, "\b");

    //Select a random phrase from phrases list depending of Language
    var pharse = phrases[lang][status][Math.floor(Math.random()*phrases[lang][status].length)];

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
    if(chatterQueue.length > 0 && !isSpeaking)
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
    if(DISABLECHATTERFORSTATUS.includes(parseInt(status))) return;
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
    var t2s = new SpeechSynthesisUtterance();
    t2s.text = msg;
    t2s.lang = lang;

    var speed = parseFloat((Math.random() * (0.0 - 0.1500) + 0.0200).toFixed(4));
    t2s.rate = 1.2 + speed;

    t2s.onend = () => {stopBackground()};
    t2s.onstart = () => {isSpeaking = true;};

    //select random speed

    //Select random speeker
    var talker = voices[Math.floor(Math.random()*voices.length)];
    //Play chatter Audio
    //responsiveVoice.speak(msg, talker, {rate: (1.2 + speed), onStart: function(){isSpeaking = true}, onend: stopBackground});
    speechSynthesis.speak(t2s);
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
                if(missionName.includes("</small>"))
                {
                    var occ = missionName.indexOf("</small>");
                    missionName = missionName.slice(occ + 9, missionName.length - 1);
                    //Grab Mission Address
                    missionAddress = (missionData.find("small:eq(1)").html()).split(",")[0];
                }
                else
                {
                    //Grab Mission Address
                    missionAddress = (missionData.find("small").html()).split(",")[0];
                }


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

