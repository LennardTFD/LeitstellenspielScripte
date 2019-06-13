// ==UserScript==
// @name         Alliance Building Hider
// @namespace    https://leitstellenspiel.de
// @version      1.2
// @description  Hides buildings of alliance
// @author       Lennard[TFD]
// @match        https://www.leitstellenspiel.de/
// @match        https://www.missionchief.com/
// @match        https://www.meldkamerspel.com/
// @updateURL    https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_AllianceBuildingHider/allianceBuildingHider.user.js
// @downloadURL  https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_AllianceBuildingHider/allianceBuildingHider.user.js
// @grant        none
// ==/UserScript==

//Determine if MapKit or Leaflet is used
var mapType;
if('undefined' == typeof mapkit){
    mapType = "leaflet";
}
else
{
    mapType = "mapkit";
}

function markerListener()
{
    if(mapType == "leaflet")
    {
        map.on('moveend', function(e) {
            removeAlliance();
        });
    }
    else
    {
        map.addEventListener("region-change-end", function(e) {
            removeAlliance();
        });
    }
}
function removeAlliance()
{
    var listOfAllianceBuildings = [];
    building_markers_cache.forEach((e) => {
        if(e.user_id == null){
            listOfAllianceBuildings.push(e["id"]);
        }
    });
    $.each(building_markers, function (e, t) {
        if(listOfAllianceBuildings.indexOf(t["building_id"]) != -1)
        {
            'undefined' == typeof mapkit ? map.removeLayer(t)  : map.removeAnnotation(t);
        }
    });
}
(function() {
    'use strict';
    markerListener();
})();