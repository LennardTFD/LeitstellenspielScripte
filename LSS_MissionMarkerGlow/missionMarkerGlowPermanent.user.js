// ==UserScript==
// @name         Mission Marker Glow
// @namespace    https://leitstellenspiel.de
// @version      1.0
// @description  Adds glow to mission marker
// @author       Lennard[TFD]
// @match        https://www.leitstellenspiel.de/
// @match        https://www.missionchief.com/
// @match        https://www.meldkamerspel.com/
// @updateURL    https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_MissionMarkerGlow/missionMarkerGlow.user.js
// @downloadURL  https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_MissionMarkerGlow/missionMarkerGlow.user.js
// @grant        none
// ==/UserScript==



function createListener(node)
{
    console.log("Creating listener");
    console.log(node);
    $(node).hover(
        () => {
            let missionIconSrc = node.find("img").attr("src");
            let mapMarker = $("img[src*='" + missionIconSrc + "']")[0];
            $(mapMarker).addClass("glow");
        },
        () => {
            let missionIconSrc = node.find("img").attr("src");
            let mapMarker = $("img[src*='" + missionIconSrc + "']")[0];
            $(mapMarker).removeClass("glow");
        }
    );
}

(function() {
    'use strict';
    $("<style type='text/css'> " +
        ".glow[src*='red']{ filter: drop-shadow(0px 0px 8px red)}" +
        ".glow[src*='yellow']{ filter: drop-shadow(0px 0px 8px yellow)} " +
        ".glow[src*='green']{ filter: drop-shadow(0px 0px 8px green)} " +
        "</style>").appendTo("head");

    let missionSections = ["mission_list", "mission_list_krankentransporte",
        "mission_list_sicherheitswache", "mission_list_alliance",
        "mission_list_alliance_event"];

    var mutationObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            var node = mutation.addedNodes[0];
            //console.log(node);
            createListener(node);
        });
    });

    for(let i = 0; i < missionSections.length; i++)
    {
        let missionSection = $("#" + missionSections[i]);
        mutationObserver.observe(missionSection[0], {
            childList: true
        });

        let missions = Object.keys(missionSection);
        console.log(missions);
        for(let j = 0; j < missions.length; j++)
        {
            createListener(missions[j]);
        }
    }


})();