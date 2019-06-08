// ==UserScript==
// @name         Zugewiesenes Personal
// @namespace    https://leitstellenspiel.de/
// @version      1.0
// @description  Zeigt dem Fahrzeug zugewiesenes Personal an
// @author       Lennard[TFD]
// @match        https://www.leitstellenspiel.de/buildings/*
// @exclude      https://www.leitstellenspiel.de/buildings/*/*
// @updateURL    https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_SettingsExporter/settingsExporter.user.js
// @downloadURL  https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_SettingsExporter/settingsExporter.user.js
// @grant        none
// ==/UserScript==

async function calculate()
{
    var firstVehUrl = $("tbody:eq(1)").find("tr:eq(0)").find("td:eq(1)").find("a").attr("href") + "/zuweisung";
    if(firstVehUrl == null)
    {
        return;
    }
    //console.log(await getAllAssignedUnits(firstVehUrl));
    var response = $.parseHTML(await getAllAssignedUnits(firstVehUrl));
    var calculation = parseResult($(response));
    drawResults(calculation);
}

function drawResults(d2d)
{
    var allVehicles = $("tbody").find("a").not("[class*='btn']");

    allVehicles.each((e, t) => {
        var veh = $(t);
        console.log(veh);
        var vehUrl = veh.attr("href");
        var workerLabel = veh.parent().parent().find("td:eq(5)");
        var assignedWorkers;
        if(d2d[vehUrl] != null)
        {
            assignedWorkers = d2d[vehUrl];
        }
        else
        {
            assignedWorkers = 0;
        }
        workerLabel.html(assignedWorkers + " / " + workerLabel.html());
    });
}

function parseResult(html) {
    var assignments = {};
    var vehicles = $(html).find("tbody").find("a").not("[class*='btn']");
    console.log(vehicles);

    vehicles.each((e, t) => {
        console.log(t);
        var vehicleUrl = $(t).attr("href");

        if(assignments[vehicleUrl] == null)
        {
            console.log("new assignment");
            assignments[vehicleUrl] = 1;
        }
        else
        {
            console.log("Refresh");
            assignments[vehicleUrl] += 1;
        }
    });

    return assignments;
}

function getAllAssignedUnits(vehUrl)
{
    return new Promise(resolve => {
        $.ajax({
            type: "GET",
            url: vehUrl,
            success: function(data)
            {
                //console.log(data);
                resolve(data);
            }
        });
    })
}

(function() {
    'use strict';
    calculate();
})();