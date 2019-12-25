// ==UserScript==
// @name         Sort Missions by Patients
// @namespace    https://www.leitstellenspiel.de/
// @version      1.0
// @description  Sorts missions by Patients
// @author       LennardTFD
// @match        https://www.leitstellenspiel.de/
// @match        https://www.missionchief.com/
// @match        https://www.meldkamerspel.com/
// @updateURL    https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_SortByPatients/sortByPatients.user.js
// @downloadURL  https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_SortByPatients/sortByPatients.user.js
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(`
.caret{
    color: gray;
}
.caret.caret-up {
    border-top-width: 0;
    border-bottom: 4px solid;
  }
  
`);

(function() {
    'use strict';
    var mutationObserver;

    function orderByPatientsDescending() {
        var missions = $('#mission_list');

        missions.find('a[id*="alarm_button_"]').parent().parent().parent().sort(function(a, b) {
            //return +$(b).find("[id*='patient_bar_outer_']").length - +$(a).find("[id*='patient_bar_outer_']").length;

            var patients = getPatients(a, b);
            return +patients.m2 - +patients.m1;
        }).appendTo(missions);
    }

    function orderByPatientsAscending() {
        var missions = $('#mission_list');

        missions.find('a[id*="alarm_button_"]').parent().parent().parent().sort(function(a, b) {
            var patients = getPatients(a, b);
            return +patients.m1 - +patients.m2;
        }).appendTo(missions);
    }

    function fromSummary(el) {
        var summary = $(el).find("[id*='mission_patient_summary_']").find("strong:eq(0)");
        return parseInt(summary.text()) || 0;
    }

    function getPatients(a, b) {
        var m1 = $(a).find("[id*='patient_bar_outer_']").length;
        var m2 = $(b).find("[id*='patient_bar_outer_']").length;
        if(m1 == 0)
        {
            m1 = fromSummary(a);
        }
        if(m2 == 0)
        {
            m2 = fromSummary(b);
        }
        return {m1: m1, m2: m2};
    }
    
    function init() {
        var sortDirection = "descending";
        observe();
        $("#btn-group-mission-select").append("<a id='sortByPatients' href='#'><img src='/images/patient_dark.svg' class='patientPrisonerIcon'><b id='sortPatientDown' class='caret'></b><b id='sortPatientUp' style='display: none' class='caret caret-up'></b></a>");
        $("#sortByPatients").on("click", () => {
            mutationObserver.disconnect();
            if($("#sortPatientUp").css("display") != "none")
            {
                $("#sortPatientUp").css("display", "none");
                $("#sortPatientDown").css("display", "");
                sortDirection = "ascending";
                orderByPatientsAscending();
            }
            else
            {
                $("#sortPatientDown").css("display", "none");
                $("#sortPatientUp").css("display", "");
                sortDirection = "descending";
                orderByPatientsDescending();
            }
        });
    }
    function observe() {
        mutationObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {

                var node = mutation.addedNodes[0];
                if(sortDirection == "descending")
                {
                    orderByPatientsDescending();
                }
                else
                {
                    orderByPatientsAscending();
                }
            });
        });
        mutationObserver.observe($("#mission_list")[0], {
            childList: true,
        });
    }
    init();

})();