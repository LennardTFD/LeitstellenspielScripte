// ==UserScript==
// @name         Message Audio
// @version      1.0
// @description  Spielt Sound bei erhalt einer Privaten Nachricht
// @author       LennardTFD
// @include      https://www.leitstellenspiel.de/
// @include      https://www.missionchief.com/
// @include      https://www.meldkamerspel.com/
// @grant        none
// @run          document-start
// @updateURL    https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_MessageAudio/messageAudio.user.js
// @downloadURL  https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_MessageAudio/messageAudio.user.js
// ==/UserScript==


(function() {
    'use strict';

    $("body").append('<audio loop="false" width="0" height="0" id="messageSound" src="/audio/ring.mp3" type="audio/mp3" ></audio>');
    var audio =$('#messageSound')[0];

    var mutationObserver = new MutationObserver(function(mutations) {
        //console.log(mutations[0]["target"]);
        console.log("MUTATION!");
        var element = mutations[0]["target"];
        if($(element).attr("class").includes("message_new highlight"))
        audio.play();
        setTimeout(() => {audio.pause()}, 1000);
    });

    //Listen for new Incomming Status updates
    mutationObserver.observe($("#message_top")[0], {
        attributes: true
    });
})();
