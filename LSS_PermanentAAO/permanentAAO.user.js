// ==UserScript==
// @name         Permanent AAO Selector
// @namespace    https://www.leitstellenspiel.de/
// @version      1.0
// @description  Filters missions by required Stations
// @author       LennardTFD
// @match        https://www.leitstellenspiel.de/missions/*
// @match        https://www.missionchief.com/missions/*
// @match        https://www.meldkamerspel.com/missions/*
// @updateURL    https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_PermanentAAO/permanentAAO.user.js
// @downloadURL  https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_PermanentAAO/permanentAAO.user.js
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    let aaoCatrgories = $("a[href*='aao_category_']");

    aaoCatrgories.each((e, category) => {
        category.addEventListener("click", () => {
            setAAO($(category).attr("href"));
        });
    });

    function setAAO(aaoHref) {
        localStorage.setItem("LSS_PermanentAAO", aaoHref);
    }

    function getAAO() {
        return localStorage.getItem("LSS_PermanentAAO");
    }

    function selectAAO() {
        let aaoHref = getAAO();
        if(aaoHref != undefined)
        {
            //$("a[href=" + aaoHref + "]").click();
            $("a[href=" + aaoHref + "]").tab("show");
        }
    }

    selectAAO();

})();