// ==UserScript==
// @name         Building S6
// @namespace    https://www.leitstellenspiel.de/
// @version      1.0
// @description  ALle Fahrzeuge einer Wache auf Status 6
// @author       Lennard[TFD]
// @match        https://www.leitstellenspiel.de/buildings/*
// @match        https://www.missionchief.com/buildings/*
// @match        https://www.meldkamerspel.com/buildings/*
// @updateURL    https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_BuildingS6/buildingS6.user.js
// @downloadURL  https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_BuildingS6/buildingS6.user.js
// @grant        none
// ==/UserScript==

const vehicles = $("#vehicle_table").find("tbody").find("tr");

const btnLocation = $("tr.tablesorter-headerRow").find("th").find("div:contains('FMS')");

let btn6 = btnLocation.append("<button class='btn btn-default btn-xs' id='s6'>S6</button>");
let btn2 = btnLocation.append("<button class='btn btn-default btn-xs' id='s2'>S2</button>");

$("#s6").on("click", () => {
   switchStatus(6);
});

$("#s2").on("click", () => {
    switchStatus(2);
});

function switchStatus(status)
{

    alert("Wechsel auf Status " + status + "\nProzess Zeit: " + 2 * vehicles.length + " Sekunden");

    vehicles.each((e, t) => {
        setTimeout(() => {

            let vehicle = $(t);
            let vehUrl = vehicle.find("td").find("a").attr("href");

            $.ajax({
                url: vehUrl + "/set_fms/" + status
            })

        }, 2000 * e);
    });
}


