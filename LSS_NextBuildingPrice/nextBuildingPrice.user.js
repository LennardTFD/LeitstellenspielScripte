// ==UserScript==
// @name         Next Building Price
// @namespace    https://www.leitstellenspiel.de/
// @version      1.1
// @description  Calculates next price of Building
// @author       Lennard[TFD]
// @match        https://www.leitstellenspiel.de/
// @match        https://www.missionchief.com/
// @match        https://www.meldkamerspel.com/
// @updateURL    https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_NextBuildingPrice/nextBuildingPrice.user.js
// @downloadURL  https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_NextBuildingPrice/nextBuildingPrice.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var amount = {};
    var buildingTypes;
    function getAmount()
    {
        amount = {};
        $(".building_list_li").each((e, t) => {

            amount[$(t).attr("building_type_id")] = (amount[$(t).attr("building_type_id")]+1) || 1 ;
        });

        buildingTypes = Object.keys(amount);
    }



    function calcPrice(buildingId, buildingAmount)
    {
        if(buildingAmount == undefined){buildingAmount = 0;};
        var price;
        switch(buildingId)
        {
            case 0:
            case 6:
                if(buildingAmount <= 23)
                {
                    price = 100000;
                }
                else
                {
                    price = 100000+(200000*Math.log2(buildingAmount-22));
                }
                break;
            case 9:
                price = 200000+(100000*Math.log2(buildingAmount+1));
                break;

        }
        return parseInt(price);

    }

    function beautifyPrice(price)
    {
        return price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    }

    function createText()
    {
        var fw = calcPrice(0, amount["0"]);
        var pol = calcPrice(6, amount["6"]);
        var thw= calcPrice(9, amount["9"]);

        var calculations = "<br><span id='nextPrice'><span style='display:inline-block;'><b>FW:</b> " + beautifyPrice(fw) + " <b>/</b> " + beautifyPrice( parseInt(fw/2)) + "</span> | <span style='display:inline-block;'><b>Pol:</b> " + beautifyPrice(pol) + " <b>/</b> " + beautifyPrice( parseInt(pol/2)) + "</span> | <span style='display:inline-block;'><b>THW:</b> " + beautifyPrice(thw) + "</span> </span>";

        $(calculations).insertAfter("#btn-group-building-select");
    }



    var mutationObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {

            var node = mutation.addedNodes[0];
            if(node == undefined)
            {
                return;
            }
            //console.log($(node).find("#building_panel_body"));
            if($(node).find("#building_panel_body") != undefined){getAmount(); createText();};

        });
    });

    //Listen for new Incomming Status updates
    mutationObserver.observe($("#buildings")[0], {
        childList: true
    });

    getAmount(); createText();

})();