// ==UserScript==
// @name         MaxUnit Calculator
// @version      1.411
// @description  Max Unit Calculator für LSS
// @author       LennardTFD
// @include      https://www.leitstellenspiel.de/buildings/*
// @exclude      https://www.leitstellenspiel.de/buildings/*/personals
// @grant        none
// @run          document-start
// @updateURL    https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_NeededWorkers/neededWorkers.user.js
// @downloadURL  https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_NeededWorkers/neededWorkers.user.js
// ==/UserScript==

var amount = 0;

var workers_text = document.createElement('dt');
workers_text.id = "workers_text";
workers_text.innerHTML = "Personal benötigt:";

var info = document.createElement('p');
info.id = "workers";
info.innerHTML = "calculating...";
info.style = "display:inline";

var checkbox_handler = document.createElement('dt');
checkbox_handler.id = "fms6_handler";

var checkbox = document.createElement('input');
checkbox.id = "fms6_toggle";
checkbox.type = "checkbox";

var checkbox_text = document.createElement('dd');
checkbox_text.id = "fms6_toggle_text";
checkbox_text.innerHTML = "FMS 6 Fahrzeuge ignorieren";


function drawOutput()
{
    var lines = $(".dl-horizontal").find("dt").length;

    document.getElementsByTagName('dl')[0].insertBefore(checkbox_handler,document.getElementsByTagName("dd")[lines +1]);
    document.getElementsByTagName('dl')[0].insertBefore(checkbox_text,document.getElementsByTagName("dd")[lines +1]);
    document.getElementsByTagName('dt')[lines].appendChild(checkbox);

    document.getElementsByTagName('dl')[0].getElementsByTagName("dd")[lines - 1].getElementsByTagName("div")[0].before(info);

    calc();
}


function calc()
{

    var lastFMS = localStorage.getItem("LSS_unitCalc");

    //var maxworkers = $("#vehicle_table").find("tbody:eq(0)").find("tr").find("td:eq(4)");
    var maxworkers = $("#vehicle_table").find("tbody:eq(0)").find("tr").find("td:eq(5)");
    amount = 0;

    var fms6_ignore = document.getElementById("fms6_toggle").checked;

    for(var i = 0; i < maxworkers.length; i++)
    {
        //var fms = $("#vehicle_table").find("tbody:eq(0)").find("tr:eq(" + i + ")").find("td:eq(2)").text();
        var fms = $("#vehicle_table").find("tbody:eq(0)").find("tr:eq(" + i + ")").find("td:eq(3)").text();

        if(fms6_ignore == true || lastFMS == "true")
        {
            if(fms != 6)
            {
                //var workers = $("#vehicle_table").find("tbody:eq(0)").find("tr:eq(" + i + ")").find("td:eq(4)");
                var workers = $("#vehicle_table").find("tbody:eq(0)").find("tr:eq(" + i + ")").find("td:eq(5)");
                var text = parseInt(workers.text());
                amount = amount + text;
            }
        }
        else
        {
            //var workers = $("#vehicle_table").find("tbody:eq(0)").find("tr:eq(" + i + ")").find("td:eq(4)");
            var workers = $("#vehicle_table").find("tbody:eq(0)").find("tr:eq(" + i + ")").find("td:eq(5)");
            var text = parseInt(workers.text());
            amount = amount + text;
        }

    }
    info.innerHTML = "<b>(" + amount + " benötigt)  </b>";
}



(function() {
    'use strict';


    var buildings = ["1", "3", "4", "7", "8", "10", "14"];

    var buildingType = $("h1").attr("building_type");

    if(buildings.includes(buildingType))
    {
    }
    else
    {
        drawOutput();
    }


    var lastFMS = localStorage.getItem("LSS_unitCalc");

    if(lastFMS == "true")
    {
        $("#fms6_toggle").prop("checked", true);
    }
    else
    {
        $("#fms6_toggle").prop("checked", false);
    }

    $('#fms6_toggle').on('change', function(){

        if($("#fms6_toggle").prop("checked"))
        {
            localStorage.setItem("LSS_unitCalc", true);
        }
        else
        {
            localStorage.setItem("LSS_unitCalc", false);
        }

        calc();
    });

})();
