// ==UserScript==
// @name         Mission Header Colorizer
// @namespace    https://www.leitstellenspiel.de/
// @version      1.2.9
// @description  Changes Color of Header, depending on City, Mission ID or ZIP Code
// @author       LennardTFD
// @match        https://www.leitstellenspiel.de/
// @match        https://www.missionchief.com/
// @match        https://www.meldkamerspel.com/
// @updateURL    https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_MissionHeaderColorizer/missionHeaderColorizer.user.js
// @downloadURL  https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_MissionHeaderColorizer/missionHeaderColorizer.user.js
// @grant        none
// ==/UserScript==


(function() {
    'use strict';

    let requirements;

    function getRequirements()
    {
        return new Promise(resolve => {
            $.ajax({
                url: "https://raw.githubusercontent.com/LSS-Manager/lss-manager-v3/dev/modules/lss-missionHelper/missions.de.json",
                method: "GET",
            }).done((res) => {
                resolve(JSON.parse(res));
            });
        });
    }

    async function applyFilter()
    {

        let  missions = $("#mission_list").find("div[class='missionSideBarEntry missionSideBarEntrySearchable']");

        missions.each((e, t) => {

            // 0 = FW, 2 = RD, 6 = POL, 9 = THW, 11 = BePOL, 13 = PolHeli, 15 = Wasserrettung werk = Werk, sek = SEK, mek = MEK
            let mission = $(t);
            let missionId = mission.attr("mission_type_id");
            let req = requirements[missionId].stations;

            let fw = rd = pol = thw = water = false;

            if(req.length == 1)
            {
                fw = true;
            }
            else if (req.length == undefined)
            {
                let stations = Object.keys(req);
                for(let i = 0; i < stations.length; i++)
                {
                    switch (req[stations[i]]) {

                        case 0:
                        case "werk":
                            //fw = true;
                            mission.attr("fw", true);
                            break;
                        case 2:
                            //rd = true;
                            mission.attr("rd", true);
                            break;
                        case 6:
                        case 11:
                        case 13:
                        case "sek":
                        case "mek":
                            mission.attr("pol", true);
                            //pol = true;
                            break;
                        case 9:
                            //thw = true;
                            mission.attr("thw", true);
                            break;
                        case 15:
                            //water = true;
                            mission.attr("water", true);
                            break;
                    }
                }
            }

        });

    }


    async function init()
    {
        requirements = await getRequirements();
        applyFilter();
    }

    init();
})();