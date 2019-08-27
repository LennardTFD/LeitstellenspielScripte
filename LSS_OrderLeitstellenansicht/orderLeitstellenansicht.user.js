// ==UserScript==
// @name         Order Leitstellenanaischt
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  No Page reload when backalarming units
// @author       Lennard[TFD]
// @match        https://www.leitstellenspiel.de/leitstellenansicht
// @grant        none
// ==/UserScript==
(function() {
    'use strict';

    //const order = [[0], [2, 5, 12], [6, 11, 13, 17], [9], [15]];

    const order = {
        0: 0,
        2: 1,
        5: 1,
        6: 2,
        9: 3,
        11: 2,
        12: 1,
        13: 2,
        15: 4,
        17: 2
    };

    var buildings = $("div .building_list_li");
    var rows = $(".col-xs-6");

    buildings.each((e, t) => {
        var buildingType = $(t).attr("building_type_id");
        //console.log( rows[order[buildingType]]);
        $(rows[order[buildingType]]).append($(t));
    });
    //console.info("Finished Sorting Buildings to row");

    rows.each((e, t) => {
        var buildingsInRows = $(t).find(".building_list_li");
        var alphabeticallyOrderedDivs = buildingsInRows.sort(function (a, b) {
            return $(a).find("a[href*='/buildings/']").text() > $(b).find("a[href*='/buildings/']").text();
        });
        $(t).html(alphabeticallyOrderedDivs);
        //console.info("Sorting Buildings in Row " + e);
    });



})();
