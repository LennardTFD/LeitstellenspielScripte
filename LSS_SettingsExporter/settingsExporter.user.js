// ==UserScript==
// @name         Settings Exporter/Importer
// @namespace    https://leitstellenspiel.de/
// @version      1.1
// @description  Exportiert/Importiert Script Einstellungen
// @author       Lennard[TFD]
// @match        https://www.leitstellenspiel.de/profile/*
// @updateURL    https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_SettingsExporter/settingsExporter.user.js
// @downloadURL  https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_SettingsExporter/settingsExporter.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    $(".page-header .pull-right").append("<a class='btn btn-default btn-xs' id='exportBtn'>Exportieren</a><a class='btn btn-default btn-xs' id='importBtn'>Imporieren</a>");
    $(".page-header .pull-right").append("<br><textarea class='pull-right' style='width: 290px; height: 200px' id='importExportArea'></textarea>");

    function exportSettings()
    {
        var settings = localStorage;
        console.log(settings);
        $("#importExportArea").val(JSON.stringify(settings));
    }

    function importSettings()
    {
        var oldStorage = JSON.parse($("#importExportArea").val());

        var storageKeys = Object.keys(oldStorage);
        for(var i = 0; i < storageKeys.length; i++)
        {
            localStorage.setItem(storageKeys[i], oldStorage[storageKeys[i]]);
        }
    }

    $( "#exportBtn" ).on( "click", function() {
        exportSettings();
    });
    $( "#importBtn" ).on( "click", function() {
        importSettings();
    });


})();