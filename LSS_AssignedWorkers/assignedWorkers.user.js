// ==UserScript==
// @name         Zugewiesenes Personal
// @namespace    https://leitstellenspiel.de/
// @version      1.31
// @description  Zeigt dem Fahrzeug zugewiesenes Personal an
// @author       Lennard[TFD]
// @match        https://www.leitstellenspiel.de/buildings/*
// @exclude      https://www.leitstellenspiel.de/buildings/*/*
// @match        https://www.missionchief.com/buildings/*
// @exclude      https://www.missionchief.com/buildings/*/*
// @match        https://www.meldkamerspel.com/buildings/*
// @exclude      https://www.meldkamerspel.com/buildings/*/*
// @updateURL    https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_AssignedWorkers/assignedWorkers.user.js
// @downloadURL  https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_AssignedWorkers/assignedWorkers.user.js
// @grant        none
// ==/UserScript==

//Main function
async function calculate()
{
    var buildingExclute = [1, 3, 4, 7, 8, 10, 16];

    //Get First vehicle in List as reference
    var tbodys = $("tbody").length - 1;
    var firstVeh = $("tbody:eq(" + tbodys + ")").find("tr:eq(0)").find("td:eq(1)").find("a");
    var firstVehUrl = $("tbody:eq(" + tbodys + ")").find("tr:eq(0)").find("td:eq(1)").find("a").attr("href") + "/zuweisung";
    //Stop if building is empty
    if(!firstVehUrl.includes("/vehicles/") || buildingExclute.indexOf(parseInt($("h1").attr("building_type"))) != -1)
    {
        return;
    }

    //AJAX Call to assigned workers page
    var response = $.parseHTML(await getAllAssignedUnits(firstVehUrl));
    //Parse given Result an count assigned workers
    var calculation = parseResult($(response));
    //Print assignments in Web
    drawResults(calculation);
}

//Print assigned workers to Vehicle Table
function drawResults(d2d)
{
    //Get List of vehicles
    var allVehicles = $("tbody").find("td:nth-child(2n)").find("a").not("[class*='btn']");

    //For each vehicle in building
    allVehicles.each((e, t) => {
        //turn back to JQUERY
        var veh = $(t);
        //Get URL of vehicle (vehicle ID)
        var vehUrl = veh.attr("href");
        //Get label for max workers of vehicle
        var workerLabel = veh.parent().parent().find("td");
        var workers = workerLabel.length - 1;
        workerLabel = $(workerLabel[workers]);

        if(workerLabel.find("a").length > 0)
        {
            var maxVehWorkers = workerLabel.text().split("/")[0];
            //Remove Text in front
            workerLabel.find("a")[0].previousSibling.remove();
            workerLabel.html(maxVehWorkers + workerLabel.html());
        }

        var assignedWorkers;
        //if units are assigned
        if(d2d[vehUrl] != null)
        {
            assignedWorkers = d2d[vehUrl];
        }
        else
        {
            //If no unit is assigned
            assignedWorkers = 0;
        }
        //Print to table
        workerLabel.html(assignedWorkers + " / " + workerLabel.html());
    });
}


function parseResult(html) {
    //List of vehicles with assignment amount
    var assignments = {};
    //Get List of vehicles with assignments
    var vehicles = $(html).find("tbody").find("td:nth-child(2n)").find("a").not("[class*='btn']");

    //For each vehicle with assigned workers
    vehicles.each((e, t) => {
        //get URL of vehicle (vehicle ID)
        var vehicleUrl = $(t).attr("href");

        //If uncounted vehicle
        if(assignments[vehicleUrl] == null)
        {
            //Add entry to list
            assignments[vehicleUrl] = 1;
        }
        else
        {
            //If vehicle already got counted
            //increase counter
            assignments[vehicleUrl] += 1;
        }
    });
    //return list of assignment count
    return assignments;
}

function getAllAssignedUnits(vehUrl)
{
    //Make ASYNC Call to workers page
    return new Promise(resolve => {
        $.ajax({
            type: "GET",
            url: vehUrl,
            success: function(data)
            {
                resolve(data);
            }
        });
    })
}

(function() {
    'use strict';
    //Execute main
    $( document ).ready(function() {
        calculate();
    });
})();