// ==UserScript==
// @name         Sort Missions by Patients
// @namespace    https://www.leitstellenspiel.de/
// @version      0.1
// @description  Sorts missions by Patients
// @author       LennardTFD
// @match        https://www.leitstellenspiel.de/
// @match        https://www.missionchief.com/
// @match        https://www.meldkamerspel.com/
// @updateURL    https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_SortByPatients/sortByPatients.user.js
// @downloadURL  https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_SortByPatients/sortByPatients.user.js

(function() {
    'use strict';

    var missions = $("#mission_list").find("div[class*='missionSideBarEntry missionSideBarEntrySearchable']");
//missions.each((e,t) => {
//	var patients = $($(t).find(".col-xs-11")[0]).find("div[id*='mission_patients_']").find("div[class*='col-md-6 small']").length;
//console.log(patients);
//console.log("Patients", patients);

//})
//console.log(missions);
    var ordered = missions.sort((e, t) => {
        var patientsE = $($(e).find(".col-xs-11")[0]).find("div[id*='mission_patients_']").find("div[class*='col-md-6 small']").length;
        var patientsT = $($(t).find(".col-xs-11")[0]).find("div[id*='mission_patients_']").find("div[class*='col-md-6 small']").length;
        console.log(patientsE, patientsT);
        return patientsE > patientsT;
    });
    console.log(ordered == missions);
    $("#missions_list").html(ordered);

})();