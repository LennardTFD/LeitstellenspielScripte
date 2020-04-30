// ==UserScript==
// @name         Verbands Einsatzort
// @namespace    https://www.leitstellenspiel.de/
// @version      1.0
// @description  Zeigt Ort des Verbandeinsatzes in Chat
// @author       Lennard[TFD]
// @match        https://www.leitstellenspiel.de/
// @match        https://www.missionchief.com/
// @match        https://www.meldkamerspel.com/
// @updateURL    https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_AllianceMissionLocation/allianceMissionLocation.user.js
// @downloadURL  https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_AllianceMissionLocation/allianceMissionLocation.user.js
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(`
.allianceMissionLocator {
    width:20px;
    height:20px;
    margin-left:5px;
    vertical-align:middle;
    cursor:pointer;
    background-color:#cecece;
    border-radius:2px;
    content: url("/images/icons8-location_off.svg");
}
`);

(function() {
    'use strict';

    //Überschreibe standard Chat Funktion
    var allianceChatOriginal = allianceChat;
    allianceChat = function(message) {
        allianceChatOriginal(message);
        var targetMessage = $("#mission_chat_messages").find("li a[href='/missions/" + message.mission_id + "']:eq(0)");
        var missionId = message.mission_id;
        if(missionId) createAllianceChatMover(missionId, targetMessage);
    };


    function createAllianceChatMover(missionId, targetMessage)
    {
        var mission = $("#mission_caption_" + missionId);
        var lat = mission.attr("data-latitude");
        var lng = mission.attr("data-longitude");
        var address = $("#mission_address_" + missionId).text();
        if(!lat || !lng) return;
        targetMessage.after("<a title='" + address + "' class='map_position_mover allianceMissionLocator' data-latitude='" + lat + "' data-longitude='" + lng + "'></a>");
    }

    function init()
    {
        var missionMessages = $("#mission_chat_messages").find("li a[href*='mission']");
        missionMessages.each((e, t) => {
            var missionId = $(t).attr("href").replace("/missions/", "");
            createAllianceChatMover(missionId, $(t));
        });
    }

    init();
})();


