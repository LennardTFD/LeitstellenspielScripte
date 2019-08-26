// ==UserScript==
// @name         Chatter to Speech
// @namespace    https://www.leitstellenspiel.de/
// @version      1.4
// @description  Einsatzfunk zu Sprache
// @author       LennardTFD
// @match        https://www.leitstellenspiel.de/
// @match        https://www.missionchief.com/
// @match        https://www.meldkamerspel.com/
// @updateURL    https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_ChatterToSpeech/chatterToSpeech.user.js
// @downloadURL  https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_ChatterToSpeech/chatterToSpeech.user.js
// @grant        none
// ==/UserScript==

var AUDIO_URL = "MYAUDIOURL";


//Import background siren
$("body").append('<audio loop="false" style="display: none;" src="' + AUDIO_URL + '" type="audio/mp3" ></audio>');

//Voices used. Duplicate voice sets increase their frequency
var audio = document.getElementById('sound');
audio.volume = 0.04;

var mutationObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {

        var node = mutation.addedNodes[0];
        if(node == undefined)
        {
            return;
        }

        audio.play();

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
