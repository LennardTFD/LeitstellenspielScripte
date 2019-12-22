// ==UserScript==
// @name         Remaining Credits
// @namespace    https://leitstellenspiel.de
// @version      1.1
// @description  Berechnet zu verdienende Credits der derzeitigen Einsatzliste
// @author       Lennard[TFD]
// @match        https://www.leitstellenspiel.de/
// @match        https://www.missionchief.com/
// @match        https://www.meldkamerspel.com/
// @updateURL    https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_RemainingCredits/remainingCredits.user.js
// @downloadURL  https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_RemainingCredits/remainingCredits.user.js
// ==/UserScript==

(function() {
    'use strict';

    var requirements;
    var mutationObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {

            var node = mutation.addedNodes[0];
            //console.log(node);
            if ((!mutation.oldValue || !mutation.oldValue.match(/\bmission_deleted\b/))
                && mutation.target.classList
                && mutation.target.classList.contains('mission_deleted')){
                calculate();
                //alert('mission_deleted class added');
            }
            else if(node != undefined)
            {
                setupListener($(node));
                calculate();
            }

        });
    });

    function getRequirements()
    {
        return new Promise(resolve => {
            $.ajax({
                url: "https://lssm.ledbrain.de/api/missions.php",
                method: "GET",
            }).done((res) => {
                resolve(res);
            });
        });
    }

    function setupListener(mission)
    {
        mutationObserver.observe(mission[0], {
            attributes: true,
            attributeOldValue: true,
            attributeFilter: ['class']
        });
    }

    function beautifyCredits(credits)
    {
        return credits.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    }

    async function init()
    {

        let filterDiv = $("#btn-group-mission-select");
        let html = `<br><br>
                    <span>Zu verdienen: <span id='remCredits'>0</span> Credits</span>
                    `;
        let filterBtns = filterDiv.append(html);

        //console.log(await getCredits(3));
        requirements = await getRequirements();

        var missionList = $("#mission_list");
        var missions = missionList.find("a[id*='alarm_button']");

        missions.each((e, t) => {
            setupListener($(t).parent().parent().parent());
        });

        mutationObserver.observe($("#mission_list")[0], {
            childList: true,
        });

        calculate();
    }



    function calculate()
    {
        var credits = 0;
        var missionList = $("#mission_list");
        var missions = missionList.find("a[id*='alarm_button']").parent().parent().parent().not("[class*='mission_deleted']");
        missions.each((e, t) => {
            var missionId = $(t).attr("mission_type_id");
            if(missionId == "null") return;
            var missionCredits = requirements[parseInt(missionId)].credits;
            if(missionCredits == undefined)
            {
                missionCredits = 250;
            }
            credits += missionCredits;
        });
        $("#remCredits").text(beautifyCredits(credits));
        console.log(credits);
    }
    init();
})();