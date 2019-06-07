// ==UserScript==
// @name         Vehicle Counter
// @namespace    https://www.leitstellenspiel.de/
// @version      1.0
// @description  Zählt Fahrzeuge an der Einsatzstelle
// @author       LennardTFD
// @match        https://www.leitstellenspiel.de/missions/*
// @match        https://www.missionchief.com/missions/*
// @match        https://www.meldkamerspel.com/missions/*
// @updateURL    https://github.com/LennardTFD/LSS_VehicleCounter/raw/master/vehicleCounter.user.js
// @downloadURL  https://github.com/LennardTFD/LSS_VehicleCounter/raw/master/vehicleCounter.user.js
// @grant        none
// ==/UserScript==


(function() {
    'use strict';
    //Create Label with Vehicles
    var vehOnSite = $("<span class='amount_of_people_label'>Fahrzeuge <span class='label' style='background-color: black' id='vehOnSite'>0</span></span>");
    $("#amount_of_people").append(vehOnSite);

    //Count Vehicles on Site
    var vehAmount = $("#mission_vehicle_at_mission").find("tbody tr").length;
    $("#vehOnSite").text(vehAmount);
})();