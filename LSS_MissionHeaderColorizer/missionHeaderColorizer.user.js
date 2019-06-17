// ==UserScript==
// @name         Mission Header Colorizer
// @namespace    https://www.leitstellenspiel.de/
// @version      1.2.8
// @description  Changes Color of Header, depending on City, Mission ID or ZIP Code
// @author       LennardTFD
// @match        https://www.leitstellenspiel.de/
// @match        https://www.leitstellenspiel.de/missions/*
// @match        https://www.missionchief.com/
// @match        https://www.missionchief.com/missions/*
// @match        https://www.meldkamerspel.com/
// @match        https://www.meldkamerspel.com/missions/*
// @updateURL    https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_MissionHeaderColorizer/missionHeaderColorizer.user.js
// @downloadURL  https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_MissionHeaderColorizer/missionHeaderColorizer.user.js
// @grant        none
// ==/UserScript==


var settingsNamespace = "LSS_missionColorizer";

function resetSettings(reqConfirm)
{

    if(!reqConfirm || confirm("Sicher? Alle deine Farbeinstellungen gehen verloren!")) {
        localStorage.setItem(settingsNamespace, JSON.stringify({
            "city":
                {"cities": [], "colors": []},
            "mission":
                {"ids": [], "colors": []},
            "zip":
                {"zips": [], "zipColors": []},
            "tab":
                {"ids": [], "tabColors": []},
            "defaultColor": ["#000000", false, 80],
        }));
    }

    loadSettings();
}

function loadSettings()
{
    var colorData = JSON.parse(localStorage.getItem(settingsNamespace));

    settings = colorData;

    transparency = colorData["defaultColor"][2];
    cities = colorData["city"]["cities"]; //Zu filternde Städte/Orte
    citiesColors = colorData["city"]["colors"];//Farbe der zugehörigen Städte

    missionIDs = colorData["mission"]["ids"];
    missionColors = colorData["mission"]["colors"]; //Farbe der Missionen

    tabs = colorData["tab"]["ids"]; //ID des Tabs
    tabColors = colorData["tab"]["colors"]; //Des Tabs

    zips = colorData["zip"]["zips"]; //ID des Tabs
    zipColors = colorData["zip"]["colors"]; //Des Tabs

    if(settings["defaultColor"][1])
    {
        defaultColor = settings["defaultColor"][0];
    }
    else
    {
        defaultColor = "";
    }
    return colorData;
}
////////////////////FIST SETUP OR UPDATE//////////////////
var firstLoad = JSON.parse(localStorage.getItem(settingsNamespace));
if(localStorage.getItem(settingsNamespace) == null || firstLoad["defaultColor"] == null || firstLoad["tab"] == null || firstLoad["zip"] == null)
{
    if(firstLoad == null)
    {
        resetSettings(false);
    }
    else if(firstLoad["tab"] == null)
    {
        firstLoad["tab"] = {"ids": [], "tabColors": []};
        localStorage.setItem(settingsNamespace, JSON.stringify(firstLoad));
    }
    else if(firstLoad["zip"] == null)
    {
        firstLoad["zip"] = {"zips": [], "zipColors": []};
        localStorage.setItem(settingsNamespace, JSON.stringify(firstLoad));
    }
}
///////SETTINGS AREA START//////////////
var settings = loadSettings();
var transparency, cities, citiesColors, zips, zipColors, missionIDs, missionColors, tabs, tabColors, defaultColor;
///////SETTINGS AREA END//////////////



(function() {
    'use strict';

    var missionID = -1;
    var colorIndex = -1;
    var colorSet = false;
    var closed;
    var currentGame = window.location.hostname;
    var currentPage = window.location.pathname;

    //Create Button in Navbar
    function createButton()
    {
        var btn = $(' <li class="dropdown" id="colorizerDropdown">' +
            '<a href="#" class="dropdown-toggle" role="button" data-toggle="dropdown"><span style="color: white" class="glyphicon glyphicon-tint"><b class="caret"></b></a>' +
            '<ul class="dropdown-menu">' +
            '<li class="lightbox-open" id="colorizer"><a href="#" id="colorizerButton">Einstellungen</a></li>' +
            '<li><a href="#" id="colorizerReload">Neu Laden</a></li>' +
            '</ul></li>');
        $('#navbar-main-collapse > ul').append(btn);

        $( "#colorizer" ).click(function() {
            createForm();
        });
        $( "#colorizerReload" ).click(function() {
            loadSettings();
            colorizeMap();
        });

    }

    ////////////////////Settings Form Stuff////////////////////

    //Create Color Menu when called via Bucked Icon
    function createForm()
    {
        //Default Color
        var defaultColor = "Standard Farbe: <input id='defaultColor' class='form-control' style='width: 80px;' type='color'> Nutzen: <input type='checkbox' id='enableDefaultColor'><br>" +
            "Transparenz: <input type='range' value='100' max='100' min='0' step='10' id='colorTransparency' class='custom-range' style='width: 300px'><br><br>";

        //Colors for City Names
        var divCity = "<div id='cityDiv'>" +
            "<h3>Stadt Namen</h3>" +
            //"<input id='addCity' class='btn btn-default' type='button' value='+ Stadt'>" +
            "<button id='addCity' class='btn btn-default'><i class='glyphicon glyphicon-plus'></i> Stadt</button>" +
            "<table id='cityTable'><tr><th width='150px'>Stadt</th><th>Farbe</th><th></th></tr></table>" +
            "</div><br><br>";

        var divZip = "<div id='zipDiv'>" +
            "<h3>Postleitzahlen</h3>" +
            "<p>Beispiel:</p>" +
            "<textarea disabled style='width: 150px; height: 30px;'>67892, 40892, 75241</textarea><br>" +
            //"<input id='addZip' class='btn btn-default' type='button' value='+ ZIP'>" +
            "<button id='addZip' class='btn btn-default'><i class='glyphicon glyphicon-plus'></i> Zip</button>" +
            "<table id='zipTable'>" +
            "<tr id='zipColorRow'></tr>" + //Color Row
            "<tr id='zipRow'></tr>" + //Color Row
            "</table>" +
            "</div><br><br>";


        //MISSION IDS///

        var divMission = "<div id='missionDiv'>" +
            "<h3>Mission IDs</h3>" +
            "<p>Beispiel:</p>" +
            "<textarea disabled style='width: 150px; height: 30px;'>54, 32, 145, 290, 25</textarea><br>" +
            //"<input id='addMissionColor' class='btn btn-default' type='button' value='+ Farbe'>" +
            "<button id='addMissionColor' class='btn btn-default'><i class='glyphicon glyphicon-plus'></i> Farbe</button>" +
            "<table id='missionTable'>" +
            "<tr id='missionColorRow'></tr>" + //Color Row
            "<tr id='missionIdRow'></tr>" + //Color Row
            "</table>" +
            "</div><br><br>";

        var divTab = "<div id='tabDiv'>" +
            "<h3>Tab Färbung</h3>" +
            //"<input id='addTab' class='btn btn-default' type='button' value='+ Tab'>" +
            "<button id='addTab' class='btn btn-default'><i class='glyphicon glyphicon-plus'></i> Tab</button>" +
            "<table id='tabTable'><tr><th width='200px'>Tab ID</th><th>Farbe</th><th></th></tr></table>" +
            "</div>";



        var saver = "<br><input id='saveSettings' class='btn btn-success btn btn-lg' type='button' value='Speichern'>";

        //Reset Colors
        var reseter = "<br>Sollten keine Einsätze eingefäbrt werden oder andere Fehler auftreten, kannst du hier deine Einstellungen zurücksetzen: <input style='color: white;' type='button' id='resetSettings' class='btn btn-danger' value='Zurücksetzen'>";

        //Set Content of Form
        var newWindow = $("#lightbox_box")[0];
        var content = "<div id='colorWrapper' class='panel-body' style='margin: 10px'>" + defaultColor + divCity + divZip + divMission + divTab + saver + reseter + "</div>";
        $(newWindow).html(content);


        for(var i = 0; i < cities.length; i++)
        {
            addCity(cities[i], citiesColors[i]);
        }

        for(var i = 0; i < zips.length; i++)
        {
            addZip(zips[i], zipColors[i]);
        }

        for(var i = 0; i < missionColors.length; i++)
        {
            addMissionColor(missionIDs[i], missionColors[i]);
        }

        for(var i = 0; i < tabs.length; i++)
        {
            addTab(tabs[i], tabColors[i]);
        }

        $("#defaultColor").val(settings["defaultColor"][0]);
        $("#colorTransparency").val(settings["defaultColor"][2]);

        if(settings["defaultColor"][1])
        {
            $("#enableDefaultColor").prop("checked", true);
        }

        $( "#addCity" ).click(function() {
            addCity();
        });
        $( "#addZip" ).click(function() {
            addZip();
        });
        $( "#addMissionColor" ).click(function() {
            addMissionColor();
        });
        $( "#addTab" ).click(function() {
            addTab();
        });
        $( "#saveSettings" ).click(function() {
            saveSettings();
        });
        $( "#resetSettings" ).click(function() {
            resetSettings(true);
        });

        $("[id^='lightbox_iframe_']").remove();
        //Make Form Scrollable
        $("#lightbox_box").css("overflow-y", "auto");
        closed = setInterval(removeForm, 100);
    }

    //Delete Form Content after closed
    function removeForm()
    {
        if($("#lightbox_background").css("display") == "none") {
            $("#colorWrapper").remove();
            $("#lightbox_box").css("overflow-y", "");
            clearInterval(closed);
        }
        $("[id^='lightbox_iframe_']").remove();

    }

    //Add a new Input for Mission IDs
    function addMissionColor(missionIDs, color)
    {

        if(missionIDs != null && color != null)
        {
            var currID = missionIDs[0];
            for(var i = 1; i < missionIDs.length; i++)
            {
                currID = currID + ", " + missionIDs[i];
            }

            //var newColorRow = "<th><input width='70px' type='color' class='missionColor' value='" + color + "'><input class='removeColor' type='button' value='- Farbe'></th>";
            var newColorRow = "<th><input width='70px' type='color' class='missionColor form-control' style='width: 80px;' value='" + color + "'><button id='removeColor' class='removeColor btn btn-default'><i class='glyphicon glyphicon-minus'></i> Farbe</button></th>";
            var newIdRow = "<td><textarea width='70px' class='missionId form-control'>" + currID + "</textarea></td>";

        }
        else
        {
            //var newColorRow = "<th><input width='70px' type='color' class='missionColor'><input class='removeColor' type='button' value='- Farbe'></th>";
            var newColorRow = "<th><input width='70px' type='color' class='missionColor form-control' style='width: 80px;'><button id='removeColor' class='removeColor btn btn-default'><i class='glyphicon glyphicon-minus'></i> Farbe</button></th>";
            var newIdRow = "<td><textarea width='70px' class='missionId form-control'></textarea></td>";
        }

        newColorRow = $.parseHTML(newColorRow);
        newIdRow = $.parseHTML(newIdRow);

        $("#missionColorRow").append(newColorRow);
        $("#missionIdRow").append(newIdRow);

        $( $(newColorRow).find(".removeColor") ).click(function() {
            removeMissionColor($(newColorRow));
            removeMissionColor($(newIdRow));
        });
    }

    //Remove City Input
    function removeMissionColor(item)
    {
        item.remove(); //Remove Mission Color
    }

    //Create new Input for City
    function addCity(cityName, color)
    {
        if(cityName != null && color != null)
        {
            //var cityInput = "<tr class='city'><td><input type='text' name='city' value='" + cityName + "'></td><td><input type='color' name='color' value='" + color + "'></td><td><input class='removeCity' type='button' value='- Stadt'></td></tr>";
            var cityInput = "<tr class='city'><td><input type='text' name='city' class='form-control' value='" + cityName + "'></td><td><input type='color' name='color' class='form-control' style='width: 80px;' value='" + color + "'></td><td><button class='removeCity btn btn-default'><i class='glyphicon glyphicon-minus'></i> Stadt</button></td></tr>";
        }
        else
        {
            var cityInput = "<tr class='city'><td><input type='text' name='city' class='form-control' ></td><td><input type='color' name='color' class='form-control' style='width: 80px;'></td><td><button class='removeCity btn btn-default'><i class='glyphicon glyphicon-minus'></i> Stadt</button></td></tr>";
        }
        cityInput = $.parseHTML(cityInput);
        $("#cityTable").append(cityInput);

        $( $(cityInput).find(".removeCity") ).click(function() {
            removeCity($(cityInput));
        });


    }



    //Remove City Input
    function removeCity(item)
    {
        item.remove(); //Remove City
    }
    //Add ZIP input
    function addZip(zips, color)
    {

        if(zips != null && color != null)
        {
            var currZIP = zips[0];
            for(var i = 1; i < zips.length; i++)
            {
                currZIP = currZIP + ", " + zips[i];
            }

            //var newColorRow = "<th><input width='70px' type='color' class='zipColor' value='" + color + "'><input class='removeZip' type='button' value='- ZIP'></th>";
            var newColorRow = "<th><input width='70px' type='color' class='zipColor form-control' style='width: 80px;' value='" + color + "'><button class='removeZip btn btn-default'><i class='glyphicon glyphicon-minus'></i> Zip</button></th>";
            var newZipRow = "<td><textarea width='70px' class='zip form-control'>" + currZIP + "</textarea></td>";

        }
        else
        {
            var newColorRow = "<th><input width='70px' type='color' style='width: 80px;' class='zipColor form-control'><button class='removeZip btn btn-default'><i class='glyphicon glyphicon-minus'></i> Zip</button></th>";
            var newZipRow = "<td><textarea width='70px' class='zip form-control'></textarea></td>";
        }

        newColorRow = $.parseHTML(newColorRow);
        newZipRow = $.parseHTML(newZipRow);

        $("#zipColorRow").append(newColorRow);
        $("#zipRow").append(newZipRow);

        $( $(newColorRow).find(".removeZip") ).click(function() {
            removeZip($(newColorRow));
            removeZip($(newZipRow));
        });
    }

    //Remove City Input
    function removeZip(item)
    {
        item.remove(); //Remove City
    }

    //Add Tab Color
    function addTab(tabID, color)
    {
        if(tabID != null && color != null)
        {
            //var tabInput = "<tr class='tab'><td><input type='text' name='tab' value='" + tabID + "'></td><td><input type='color' name='tabColor' value='" + color + "'></td><td><input class='removeTab' type='button' value='- Tab'></td></tr>";
            var tabInput = "<tr class='tab'><td><input type='text' name='tab' class='form-control' value='" + tabID + "'></td><td><input type='color' name='tabColor' class='form-control' style='width: 80px;' value='" + color + "'></td><td><button class='removeTab btn btn-default'><i class='glyphicon glyphicon-minus'></i> Tab</button></td></tr>";
        }
        else
        {
            var tabInput = "<tr class='tab'><td><input type='text' name='tab' class='form-control'></td><td><input type='color' name='tabColor' class='form-control' style='width: 80px;'></td><td><button class='removeTab btn btn-default'><i class='glyphicon glyphicon-minus'></i> Tab</button></td></tr>";
        }
        tabInput = $.parseHTML(tabInput);
        $("#tabTable").append(tabInput);

        $( $(tabInput).find(".removeTab") ).click(function() {
            removeTab($(tabInput));
        });
    }

    //Remove Tab Input
    function removeTab(item)
    {
        item.remove(); //Remove City
    }

    //Save Settings from Input to Local Storage
    function saveSettings()
    {
        var cityColorJSON = {};
        var cities = [];
        var colors = [];

        var missionColorJSON = {};
        var missionColors = [];
        var missionIDs = [];

        var tabColorJSON = {};
        var tabColors = [];
        var tabIDs = [];

        var zipColorJSON = {};
        var zipColors = [];
        var zipCodes = [];

        var combine = {};

        $(".city").each(function(index)
        {
            cities.push($("[name='city']:eq(" + index + ")").val());
            colors.push($("[name='color']:eq(" + index + ")").val());
        });

        $(".zip").each(function(index)
        {
            var zips = $.map($(".zip:eq(" + index + ")").val().split(','), function(value){

                var out = parseInt(value, 10);
                if(isNaN(out))
                {
                    out = [-1];
                }
                return out;
            });

            zipColors.push($(".zipColor:eq(" + index + ")").val());
            zipCodes.push(zips);
        });

        $(".missionColor").each(function(index)
        {
            var ids = $.map($(".missionId:eq(" + index + ")").val().split(','), function(value){

                var out = parseInt(value, 10);
                if(isNaN(out))
                {
                    out = [-1];
                }
                return out;
            });

            missionColors.push($(".missionColor:eq(" + index + ")").val());
            missionIDs.push(ids);
        });

        $(".tab").each(function(index)
        {
            tabIDs.push($("[name='tab']:eq(" + index + ")").val());
            tabColors.push($("[name='tabColor']:eq(" + index + ")").val());
        });


        var defaultColor = [$("#defaultColor").val(), $("#enableDefaultColor").prop("checked"), $("#colorTransparency").val()];

        cityColorJSON["cities"] = cities;
        cityColorJSON["colors"] = colors;

        missionColorJSON["ids"] = missionIDs;
        missionColorJSON["colors"] = missionColors;

        tabColorJSON["ids"] = tabIDs;
        tabColorJSON["colors"] = tabColors;

        zipColorJSON["zips"] = zipCodes;
        zipColorJSON["colors"] = zipColors;

        combine["city"] = cityColorJSON;
        combine["zip"] = zipColorJSON;
        combine["mission"] = missionColorJSON;
        combine["tab"] = tabColorJSON;


        combine["defaultColor"] = defaultColor;

        localStorage.setItem(settingsNamespace, JSON.stringify(combine));

        loadSettings();
    }


    function luminanace(r, g, b) {
        var a = [r, g, b].map(function (v) {
            v /= 255;
            return v <= 0.03928
                ? v / 12.92
                : Math.pow( (v + 0.055) / 1.055, 2.4 );
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    function contrast(rgb1, rgb2) {
        return (luminanace(rgb1[0], rgb1[1], rgb1[2]) + 0.05)
            / (luminanace(rgb2[0], rgb2[1], rgb2[2]) + 0.05);
    }

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    }


    function regexLastIndexOf(string, regex, startpos) {
        regex = (regex.global) ? regex : new RegExp(regex.source, "g" + (regex.ignoreCase ? "i" : "") + (regex.multiLine ? "m" : ""));
        if(typeof (startpos) == "undefined") {
            startpos = string.length;
        } else if(startpos < 0) {
            startpos = 0;
        }
        var stringToWorkWith = string.substring(0, startpos + 1);
        var lastIndexOf = -1;
        var nextStop = 0;
        var result;
        while((result = regex.exec(stringToWorkWith)) != null) {
            lastIndexOf = result.index;
            regex.lastIndex = ++nextStop;
        }
        return lastIndexOf;
    }



    ////////////////////Colorize Stuff////////////////////

    //Get City of Mission
    function getOrt(page, index)
    {
        if(page == "map" && index != null)
        {
            var ort = $("#missions_outer").find("[id^='mission_address_']:eq(" + index + ")").text();
        }else if(page == "mission")
        {
            var ort = $(".col-md-6:eq(0)").find("small").text();
        }

        if(ort.includes("Von: "))
        {
            ort = ort.slice(ort.indexOf("Von: ") + 5, ort.indexOf("Nach: "));
        }
        if(ort.includes("|"))
        {
            ort = ort.slice(0, ort.indexOf("|"));
        }

        var cityBegin = regexLastIndexOf(ort, /\d/);
        ort = ort.slice(cityBegin + 2);

        return ort;
    }

    function getZip(page, index)
    {
        if(page == "map" && index != null)
        {
            var zip = $("#missions_outer").find("[id^='mission_address_']:eq(" + index + ")").text();
        }else if(page == "mission")
        {
            var zip = $(".col-md-6:eq(0)").find("small").text();
        }

        if(zip.includes("Von: "))
        {
            zip = zip.slice(zip.indexOf("Von: ") + 5, zip.indexOf("Nach: "));
        }

        var zipStart = zip.lastIndexOf(",");
        if(zipStart == -1)
        {
            zipStart = -2;
        }
        zip = zip.slice(zipStart + 2);
        var zipEnd = zip.indexOf(" ");
        zip = zip.slice(0, zipEnd);
        return zip;
    }

    //Colorize Mission List
    function colorizeMap()
    {
        var subIndexKTW = 0;
        var subIndexSW = 0;
        var missionList = $("#missions_outer").find(".panel-heading");
        //var missionList = $("#mission_list").find(".panel-heading");
        if(transparency > 99)
        {
            transparency = "ff";
        }

        $(missionList).each(function(index){

            colorSet = false;

            var ort = getOrt("map", index);
            var zip = getZip("map", index);
            var cityIndex = findSimilarOrt(ort);
            //var zipIndex = zips.indexOf(zip);

            var missionMultiplicator = 16;
            if($(".MissionOut").length > 0)
            {
                missionMultiplicator = 17;
            }

            var missionListLength = $("[id='mission_list']").find(".missionSideBarEntrySearchable").length;
            var ktwListLength = $("[id='mission_list_krankentransporte']").find(".missionSideBarEntrySearchable").length;
            var ktwOrMission = "";
            if(index < missionListLength)
            {
                var missionID = $("[id='mission_list']").find("[id^='mission_']:eq(" + index * missionMultiplicator + ")").attr("mission_type_id");
                ktwOrMission = "mission";
            }
            else if(index < (missionListLength + ktwListLength))
            {
                var missionID = $("[id='mission_list_krankentransporte']").find("[id^='mission_']:eq(" + subIndexKTW * missionMultiplicator + ")").attr("mission_type_id");
                ktwOrMission = "ktw";
                subIndexKTW++;
            }
            else
            {
                var missionID = $("[id='mission_list_sicherheitswache']").find("[id^='mission_']:eq(" + subIndexSW * missionMultiplicator + ")").attr("mission_type_id");
                subIndexSW++;
            }


            missionList[index].style.backgroundImage = "none";
            if(defaultColor == "")
            {
                missionList[index].style["background-color"] = "";
            }
            else
            {
                missionList[index].style["background-color"] = defaultColor + transparency;
            }

            var cityNameColor = colorByOrt("map", cityIndex, index, missionList);
            var zipCodeColor = colorByZip("map", zip, index, missionList);
            var missionIdColor = colorByMission("map", missionID, index, missionList);

            var assignedBgColor = missionList[index].style["background-color"];
            if(assignedBgColor.includes("rgba"))
            {
                assignedBgColor = assignedBgColor.replace("rgba(", "");
            }
            else
            {
                assignedBgColor = assignedBgColor.replace("rgb(", "");
            }
            assignedBgColor = assignedBgColor.replace(")", "");
            assignedBgColor = assignedBgColor.split(",");
            assignedBgColor[3] = "1";
            console.log(assignedBgColor);

            if(assignedBgColor.length > 1) {
                if (contrast([255, 255, 255], assignedBgColor) < 4.5) {
                    $(missionList[index]).find("a:eq(1)").css("color", "black");
                } else {
                    $(missionList[index]).find("a:eq(1)").css("color", "white");
                }
            }
            else
            {
                $(missionList[index]).find("a:eq(1)").css("color", "#337ab7");
            }


        });
    }

    //Colorize Mission Header
    function colorizeMission()
    {
        colorizeTabs();
        //Get full Address
        var ort = getOrt("mission", -1);
        var zip = getZip("mission");
        var cityIndex = findSimilarOrt(ort);

        //Get Mission ID
        missionID = $("#mission_help")[0].href;
        missionID = parseInt(missionID.slice(missionID.search(/\d/), missionID.indexOf("?")));

        if(defaultColor == "")
        {
            $(".mission_header_info").css("background-color", "");
        }
        else
        {
            $(".mission_header_info").css("background-color", defaultColor);
        }


        var cityNameColor = colorByOrt("mission", cityIndex, -1, []);
        var zipColor = colorByZip("mission", zip, -1, []);
        var missionIdColor = colorByMission("mission", missionID, -1, []);

        var color = $(".mission_header_info").css("background-color");
        color = color.replace("rgb(", "");
        color = color.replace(")", "");
        color = color.split(",");
        //Calculate Contrast
        if(contrast([255, 255, 255], color) < 4.5)
        {
            $(".mission_header_info:eq(0)").css("color", "black");
            $(".patientPrisonerIcon:eq(0)").css("filter", "brightness(0)");
        }
        else
        {
            $(".mission_header_info:eq(0)").css("color", "white");
        }
    }

    function colorizeTabs()
    {
        for(var i = 0; i < tabs.length; i++)
        {
            $("a[href='" + tabs[i] +"']").css("background-color", tabColors[i]);
            $("a[href='" + tabs[i] +"']").css("color", "white");
        }
    }

    //Colorize Mission by its ID
    function colorByMission(page, missionID, index, missionList)
    {
        var found = false;
        for(var i = 0; i < missionIDs.length; i++)
        {
            for(var j = 0; j < missionIDs[i].length; j++)
            {
                if(missionIDs[i][j] == missionID)
                {
                    colorIndex = i;
                    found = true;
                    break;
                }
            }
            if(found)
            {
                break;
            }
        }
        if(!found)
        {
            colorIndex = -1;
        }

        if(page == "map" && colorIndex != -1)
        {
            missionList[index].style.backgroundImage = "none";
            missionList[index].style["background-color"] = missionColors[colorIndex] + transparency;
            colorSet = true;
            return true;
        }
        else if (page == "mission" && colorIndex != -1)
        {
            $(".mission_header_info").css("background-color", missionColors[colorIndex]);
            colorSet = true;
            return true;
        }
        else
        {
            return false;
        }
    }

    //Colorize Mission by its City
    function colorByOrt(page, cityIndex, index, missionList)
    {
        if(page == "map")
        {
            missionList[index].style.backgroundImage = "none";
            missionList[index].style["background-color"] = citiesColors[cityIndex] + transparency;
            colorSet = true;
            return true;
        }
        else if (page == "mission")
        {
            $(".mission_header_info").css("background-color", citiesColors[cityIndex]);
            colorSet = true;
            return true;
        }
        return false;
    }

    function colorByZip(page, zip, index, missionList)
    {
        var found = false;
        for(var i = 0; i < zips.length; i++)
        {
            for(var j = 0; j < zips[i].length; j++)
            {
                if(zips[i][j] == zip)
                {
                    colorIndex = i;
                    found = true;
                    break;
                }
            }
            if(found)
            {
                break;
            }
        }
        if(!found)
        {
            colorIndex = -1;
        }

        if(page == "map" && colorIndex != -1)
        {
            missionList[index].style.backgroundImage = "none";
            missionList[index].style["background-color"] = zipColors[colorIndex] + transparency;
            colorSet = true;
            return true;
        }
        else if (page == "mission" && colorIndex != -1)
        {
            $(".mission_header_info").css("background-color", zipColors[colorIndex]);
            colorSet = true;
            return true;
        }
        else
        {
            return false;
        }
    }

    //Find Ort who's name is similar to in City List
    function findSimilarOrt(ort)
    {
        for(var i = 0; i < cities.length; i++)
        {
            if(ort.includes(cities[i]))
            {
                var cityIndex = i;
                return cityIndex;
            }
        }
        return -1;
    }


    //Create Nav Bar Button
    createButton();
    //Check if Mission List needs to be colored
    //or Mission Header
    if(currentPage == "/")
    {
        colorizeMap();
        var mutationObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                colorizeMap();
            });
        });
        mutationObserver.observe($("#mission_list")[0], {
            childList: true
        });
        mutationObserver.observe($("#mission_list_krankentransporte")[0], {
            childList: true
        });
        mutationObserver.observe($("#mission_list_sicherheitswache")[0], {
            childList: true
        });
    }
    else
    {
        colorizeMission();
    }

})();