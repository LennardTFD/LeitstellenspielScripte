// ==UserScript==
// @name         POI Color
// @namespace    https://leitstellenspiel.de
// @version      1.0
// @description  Colorizes created POIs with same type
// @author       Lennard[TFD]
// @match        https://www.leitstellenspiel.de/
// @match        https://www.missionchief.com/
// @match        https://www.meldkamerspel.com/
// @updateURL    https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_POIColor/poiColor.user.js
// @downloadURL  https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_POIColor/poiColor.user.js
// @grant        none
// ==/UserScript==


var pois = [];
var poisWithType = [];

missionPositionMarkerAdd = function(e) {
    var t = function() {
        confirm(I18n.t("javascript.poi_delete", {
            caption: e.caption
        })) && (missionPositionMarkerDelete(e.id),
            $.ajax({
                url: "/mission_positions/" + e.id,
                type: "POST",
                data: {
                    _method: "delete"
                },
                cache: !1
            }))
    };
    if ("undefined" != typeof mapkit) {
        var i = new mapkit.ImageAnnotation(new mapkit.Coordinate(e.latitude,e.longitude),{
            url: {
                1: "/images/letter_p.png"
            }
        });
        i.title = e.caption,
            i.addEventListener("select", t),
            map.addAnnotation(i),
            i.element.className = "mapkit-marker"
    } else {
        var n = L.icon({
            iconUrl: "/images/letter_p.png",
            iconSize: [32, 37],
            iconAnchor: iconAnchorCalculate([32, 37])
        });
        i = L.marker([e.latitude, e.longitude], {
            icon: n
        }).addTo(map),
            i.on("click", t)
    }
    let poiData = {elm: i._icon, id: e.id, caption: e.caption, latlng: i._latlng};
    pois.push(poiData);
    i.id = e.id;
    mission_poi_markers.push(i);
}


function findPOIsWithType(caption) {
    let bounds = map.getBounds();
    console.log("Find");
    uncolorizePoisWithType();
    poisWithType = [];
    pois.forEach((e) => {
        if(e.caption == caption && bounds.contains(e.latlng)){
            poisWithType.push(e.elm);
        }
    });
}

function colorizePoisWithType() {
    console.log("color");
    for(let i = 0; i < poisWithType.length; i++)
    {
        $(poisWithType[i]).attr("src", "/images/letter_p_red.png");
    }
}
function uncolorizePoisWithType() {
    console.log("uncolor");
    for(let i = 0; i < poisWithType.length; i++)
    {
        $(poisWithType[i]).attr("src", "/images/letter_p.png");
    }
}

function setupBtnListener()
{
    $( "#build_new_poi" ).click(function() {
        //console.log("POI is clicked!");
        let loader = setInterval(() => {
            //console.log("Waiting for POI");
            if($("#mission_position_address")[0] != undefined)
            {
                //console.log("POI loaded!");
                clearInterval(loader);
                onPoiFormCreated();
            }
        }, 200);
    });
}

function onPoiFormCreated() {
    console.log("Poi form created");
    $( "#mission_position_poi_type" ).on("change", function() {
        console.log("CHANGE!");
        let poiType = $("#mission_position_poi_type option:selected").text();
        findPOIsWithType(poiType);
        colorizePoisWithType();
    });

    let loaderClose, loaderSave;
    $("a[href='/buildings']:eq(0)").click(function() {
        loaderClose = setInterval(() => {
            //console.log("Waiting for POI");
            if($("#build_new_poi")[0] != undefined)
            {
                clearInterval(loaderClose);
                clearInterval(loaderSave);
                setupBtnListener();
            }
        }, 200);
    });

    $(".form-actions").find("input[value='Speichern']").click(function() {
        loaderSave = setInterval(() => {
            //console.log("Waiting for POI");
            if($("#mission_position_address")[0] != undefined)
            {
                clearInterval(loaderSave);
                clearInterval(loaderClose);
                setupBtnListener();
            }
        }, 200);
    });
}

(function() {
    'use strict';
    setupBtnListener();
})();