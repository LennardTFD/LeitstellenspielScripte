// ==UserScript==
// @name         Alliance Member Notes
// @namespace    https://leitstellenspiel.de
// @version      1.0
// @description  Hides buildings of alliance
// @author       Lennard[TFD]
// @match        https://www.leitstellenspiel.de/verband/mitglieder/
// @grant        none
// ==/UserScript==




(function() {
    'use strict';

    let buttons = $("tbody tr a").after('<div class="allianceMemberNotice"><a class="alliance_member_notice btn btn-default btn-xs pull-right"><span title="Bearbeiten" class="glyphicon glyphicon-pencil"></span></a><div class="allianceMemberNoticeInput"><textarea></textarea><button>Speichern</button></div></div>');
    buttons.on("click", (e) => {
        showInput($(e.currentTarget).find("a"));
    });

    function showInput(el)
    {
        var id = el.parent().parent().find("a[href*='/profile/']").attr("href").replace("/profile/", "");
        el.css("display", "none");
        let input = el.find("allianceMemberNoticeInput");
        input.css("display", "inline");
        input.find("button").on("click", (e) => {
            $(e.currentTarget).parent().find("textarea")
        });
    }

    function saveInput(el)
    {
        console.log($(el).parent().find("textarea").val());
    }



})();