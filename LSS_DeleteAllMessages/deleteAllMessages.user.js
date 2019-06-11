// ==UserScript==
// @name         Delete all Messages
// @version      1.0
// @description  Wählt alle Privat Nachrichten aus um sie zu löschen
// @author       LennardTFD
// @include      https://www.leitstellenspiel.de/messages?
// @grant        none
// @run          document-start
// @updateURL    https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_DeleteAllMessages/deleteAllMessages.user.js
// @downloadURL  https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_DeleteAllMessages/deleteAllMessages.user.js
// ==/UserScript==


(function() {
    'use strict';

    var checkBoxPos = $("table > thead > tr > th:eq(0)");
    var labelPos = checkBoxPos.parent().find("th:eq(1)");
    checkBoxPos.append("<input type='checkbox' id='selectAll'>");
    labelPos.append("Alles");

    var box = $("#selectAll");

    box.change(() => {

        var allMessages = $("input[type='checkbox'][id!='selectAll']");

        if(box.prop("checked"))
        {
            allMessages.each((e, t) => {
                $(t).prop("checked", true);
            })
        }
        else
        {
            allMessages.each((e, t) => {
                $(t).prop("checked", false);
            })
        }
    });
})();
