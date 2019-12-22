// ==UserScript==
// @name         Mission Filter by Requirements
// @namespace    https://www.leitstellenspiel.de/
// @version      1.12
// @description  Filters missions by required Stations
// @author       LennardTFD
// @match        https://www.leitstellenspiel.de/
// @match        https://www.missionchief.com/
// @match        https://www.meldkamerspel.com/
// @updateURL    https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_MissionReqFilter/missionReqFilter.user.js
// @downloadURL  https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_MissionReqFilter/missionReqFilter.user.js
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(`
.filterShow {
    display: block;
}

.filterHide {
    display: none;
}
`);

function filterElement(mission, arr, n = undefined) {
    let types = ["fw", "rd", "pol", "thw", "water"];

    if(n == undefined)
    {
        n = types.length;
    }

    let typeIndex = types.length - n;
    let type = types[typeIndex];

    //console.log("FilterElement()");
    //console.log(mission.attr("class"));
    if(mission.attr("class").includes("mission_deleted"))
    {
        //console.log(mission);
        //console.log("Mission is finished!");
        mission.remove();
        return;
    }


    if(n < 1)
    {
        return;
    }

    //If (mission is fw and looking for fw || not fw and looking for not fw) || ignoring fw || (mission is not fw && not looking for fw)
    if(
        (String(arr[typeIndex]) == mission.attr(types[typeIndex]))
        ||
        ((String(arr[typeIndex])) == "undefined")
        ||
        (mission.attr(types[typeIndex]) == undefined && String(arr[typeIndex]) == "false")
    )
    {
        //Show Element, start recursion for next Filter
        //mission.css("display", "block");
        //if((mission.css("display") != "none" && mission.attr("class").includes("filterHide"))|| mission.css("display") == undefined)
        //if(mission.attr("class").includes("filterHide") && !mission.attr("class").includes("mission_deleted"))
        //{
            mission.addClass("filterShow");
            mission.removeClass("filterHide");
       // }
        //else
       // {
            //mission.remove();
        //}

        filterElement(mission, arr, n - 1);
        //return false;
    }
    else
    {
        //Hide Element
        //mission.css("display", "none");
        mission.addClass("filterHide");
        mission.removeClass("filterShow");
        //return true;
    }
}

//function filter(fw, rd, pol, n = 3) {
function filter(fw, rd, pol, thw, water) {

    let missions = $("#mission_list").find("div[class*='missionSideBarEntry missionSideBarEntrySearchable']");
    let deletedMissions = $("#mission_list").find("div[class*='mission_deleted']");

    deletedMissions.each((e, t) => {
       $(t).remove();
    });

    missions.each((e, t) => {
        let mission = $(t);
        //console.log(mission);
        filterElement(mission, [fw, rd, pol, thw, water]);
    });
}

(function() {
    'use strict';

    let requirements;

    function getRequirements()
    {
        return new Promise(resolve => {
            $.ajax({
                url: "https://lssm.ledbrain.de/api/missions.php",
                //url: "https://raw.githubusercontent.com/LennardTFD/LeitstellenspielScripte/master/LSS_MissionReqFilter/missiondata.de.json",
                method: "GET",
            }).done((res) => {
                //resolve(JSON.parse(res));
                resolve(res);
            });
        });
    }

    function removeFilter()
    {
        let missions = $("#mission_list").find("div[class*='missionSideBarEntry missionSideBarEntrySearchable']");

        missions.each((e, t) => {
            // 0 = FW, 2 = RD, 6 = POL, 9 = THW, 11 = BePOL, 13 = PolHeli, 15 = Wasserrettung, werk = Werk, sek = SEK, mek = MEK
            let mission = $(t);
            mission.removeAttr("fw");
            mission.removeAttr("rd");
            mission.removeAttr("pol");
            mission.removeAttr("thw");
            mission.removeAttr("water");
        });

    }

    //Apply needed Stations to mission
    async function applyFilter()
    {
        let missions = $("#mission_list").find("div[class*='missionSideBarEntry missionSideBarEntrySearchable']");
        missions.each((e, t) => {
            // 0 = FW, 2 = RD, 6 = POL, 9 = THW, 11 = BePOL, 13 = PolHeli, 15 = Wasserrettung, werk = Werk, sek = SEK, mek = MEK
            let mission = $(t);
            let missionId = mission.attr("mission_type_id");
            let req = requirements[missionId].stations;


            if(req.length == 1)
            {
                mission.attr("fw", true);
            }
            else
            {
                let stations = Object.keys(req);
                //console.log(stations);
                for(let i = 0; i < stations.length; i++)
                {
                    switch (stations[i]) {

                        case "0":
                        case "werk":
                            //fw = true;
                            mission.attr("fw", true);
                            break;
                        case "2":
                            //rd = true;
                            mission.attr("rd", true);
                            break;
                        case "6":
                        case "11":
                        case "13":
                        case "sek":
                        case "mek":
                            mission.attr("pol", true);
                            //pol = true;
                            break;
                        case "9":
                            //thw = true;
                            mission.attr("thw", true);
                            break;
                        case "15":
                            //water = true;
                            mission.attr("water", true);
                            break;
                    }
                }
            }
        });
    }
    
    function switchStatus(element) {
        element = $(element);
        let status = element.attr("status");
        //console.log(element);
        if(status == "true")
        {
            element.removeClass("btn-success");
            element.addClass("btn-default");
            element.attr("status", "undefined");
        } else if(status == "undefined")
        {
            element.removeClass("btn-default");
            element.addClass("btn-danger");
            element.attr("status", "false");
        } else if(status == "false")
        {
            element.removeClass("btn-danger");
            element.addClass("btn-success");
            element.attr("status", "true");
        }
        //console.log(status);

        filter(
            $("#req_select_fw").attr("status"),
            $("#req_select_rd").attr("status"),
            $("#req_select_pol").attr("status"),
            $("#req_select_thw").attr("status"),
            $("#req_select_water").attr("status")
        );
    }
    
    function createListener(elem) {

        elem.addEventListener("click", (event) => {
            event.preventDefault();
            switchStatus(elem);
        });
    }

    function createFilterBtns()
    {
        let filterDiv = $("#btn-group-mission-select");
        let html = `<br><br>
                    <a id='req_select_fw' class='btn btn-xs btn-default mission_selection' status="undefined" href='' classshow='mission_list' title='Grün = Einsätze werden gezeigt. Rot = Einsätze werden ausgeblendet. Schwarz = Einsätze werden ignoriert'>FW</a>
                    <a id='req_select_rd' class='btn btn-xs btn-default mission_selection' status="undefined" href='' classshow='mission_list' title='Grün = Einsätze werden gezeigt. Rot = Einsätze werden ausgeblendet. Schwarz = Einsätze werden ignoriert'>RD</a>
                    <a id='req_select_pol' class='btn btn-xs btn-default mission_selection' status="undefined" href='' classshow='mission_list' title='Grün = Einsätze werden gezeigt. Rot = Einsätze werden ausgeblendet. Schwarz = Einsätze werden ignoriert'>POL</a>
                    <a id='req_select_thw' class='btn btn-xs btn-default mission_selection' status="undefined" href='' classshow='mission_list' title='Grün = Einsätze werden gezeigt. Rot = Einsätze werden ausgeblendet. Schwarz = Einsätze werden ignoriert'>THW</a>
                    <a id='req_select_water' class='btn btn-xs btn-default mission_selection' status="undefined" href='' classshow='mission_list' title='Grün = Einsätze werden gezeigt. Rot = Einsätze werden ausgeblendet. Schwarz = Einsätze werden ignoriert'>Wasser</a>
                    `;
        let filterBtns = filterDiv.append(html);

        createListener($("#req_select_fw")[0]);
        createListener($("#req_select_rd")[0]);
        createListener($("#req_select_pol")[0]);
        createListener($("#req_select_thw")[0]);
        createListener($("#req_select_water")[0]);
    }


    async function init()
    {
        createFilterBtns();
        requirements = await getRequirements();
        applyFilter();

        var mutationObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if(!$("#search_input_field_missions").is(":focus"))
                {
                    removeFilter();
                    applyFilter();
                    filter(
                        $("#req_select_fw").attr("status"),
                        $("#req_select_rd").attr("status"),
                        $("#req_select_pol").attr("status"),
                        $("#req_select_thw").attr("status"),
                        $("#req_select_water").attr("status")
                    );
                }

            });
        });
        mutationObserver.observe($("#mission_list")[0], {
            childList: true
        });

    }

    init();
})();