// ==UserScript==
// @name         Vehicle Counter
// @namespace    https://www.leitstellenspiel.de/
// @version      1.22
// @description  Zählt Fahrzeuge an der Einsatzstelle
// @author       LennardTFD
// @match        https://www.leitstellenspiel.de/missions/*
// @match        https://www.missionchief.com/missions/*
// @match        https://www.meldkamerspel.com/missions/*
// @updateURL    https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_VehicleCounter/vehicleCounter.user.js
// @downloadURL  https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_VehicleCounter/vehicleCounter.user.js
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(`

.tooltipVehAmount {
  position: relative;
  display: inline-block;
  opacity: 1;
}

.tooltipVehAmount .tooltiptextVehAmount {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  top: 150%;
  left: 50%;
  margin-left: -60px;
}

.tooltipVehAmount .tooltiptextVehAmount::after {
  content: "";
  position: absolute;
  bottom: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent black transparent;
}

.tooltipVehAmount:hover .tooltiptextVehAmount {
  visibility: visible;
}

`);

(function() {
    'use strict';
    //Create Label with Vehicles
    var vehOnSite = $("<span class='amount_of_people_label tooltipVehAmount'>Fahrzeuge <span class='label' style='background-color: grey' id='vehAmount'>0<</span><span class='tooltiptextVehAmount'>Vor Ort: <span id='vehAmountSite'>0</span><br>Anfahrt: <span id='vehAmountEnroute'>0</span></span></span>");
    $("#amount_of_people").append(vehOnSite);

    //Count Vehicles on Site
    var vehAmountOnSite = $("#mission_vehicle_at_mission tbody [id*='vehicle_row_']").length;
    var vehAmountEnroute = $("#mission_vehicle_driving tbody [id*='vehicle_row_']").length;
    $("#vehAmount").text(vehAmountOnSite + vehAmountEnroute);
    $("#vehAmountSite").text(vehAmountOnSite);
    $("#vehAmountEnroute").text(vehAmountEnroute);
})();