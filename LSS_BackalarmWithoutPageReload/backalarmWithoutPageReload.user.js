// ==UserScript==
// @name         BackalarmWithoutPageReload
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  No Page reload when backalarming units
// @author       Lennard[TFD]
// @match        https://www.leitstellenspiel.de/missions/*
// @match        https://www.missionchief.com/missions/*
// @match        https://www.meldkamerspel.com/missions/*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';
    var backAlarmBtns = $("a[href*='/vehicles/'][href*='/backalarm?return=mission'], a[href*='/gefangener/']");
    backAlarmBtns.each((e,t) => {
        //Remember URL to back alarm unit
        var url = $(t).attr("href");
        //Remove "href" to stop page from reloading
        $(t).removeAttr("href");
        //AJAX call to back alarm URL on Button Click
        t.addEventListener("click", () => {
            $.ajax({
                url: url
            });
            //Remove Vehicle Element from List
            var selector = $(t).parent().parent();
            if(url.includes("/gefangener/"))
            {
                selector.prev().remove();
                selector.remove();
            }
            else
            {
                selector.parent().remove();
            }
        })
    })
})();
