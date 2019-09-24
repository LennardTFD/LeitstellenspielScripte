// ==UserScript==
// @name         Mission Marker Glow
// @namespace    https://leitstellenspiel.de
// @version      1.1
// @description  Adds glow to mission marker
// @author       Lennard[TFD]
// @match        https://www.leitstellenspiel.de/
// @match        https://www.missionchief.com/
// @match        https://www.meldkamerspel.com/
// @updateURL    https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_MissionMarkerGlow/missionMarkerGlowPermanent.user.js
// @downloadURL  https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_MissionMarkerGlow/missionMarkerGlowPermanent.user.js
// @grant        none
// ==/UserScript==


(function() {
    'use strict';
    $("<style type='text/css'> " +
        ".leaflet-marker-icon[src*='red']{ filter: drop-shadow(0px 0px 8px red)}" +
        ".leaflet-marker-icon[src*='yellow']{ filter: drop-shadow(0px 0px 8px yellow)} " +
        ".leaflet-marker-icon[src*='green']{ filter: drop-shadow(0px 0px 8px green)} " +
        ".leaflet-marker-icon[src*='rot']{ filter: drop-shadow(0px 0px 8px red)}" +
        ".leaflet-marker-icon[src*='gelb']{ filter: drop-shadow(0px 0px 8px yellow)} " +
        ".leaflet-marker-icon[src*='gruen']{ filter: drop-shadow(0px 0px 8px green)} " +
        "</style>").appendTo("head");
})();