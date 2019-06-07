// ==UserScript==
// @name         Panic Button
// @namespace    https://leitstellenspiel.de
// @version      1.2
// @description  Zieht eigenen Rettungsdienst von Verbandseinsätzen ab und loggt aus
// @author       Lennard[TFD]
// @match        https://www.leitstellenspiel.de/
// @match        https://www.missionchief.com/
// @match        https://www.meldkamerspel.com/
// @updateURL	 https://github.com/LennardTFD/LSS_Panic/raw/master/panicButton.user.js
// @downloadURL	 https://github.com/LennardTFD/LSS_Panic/raw/master/panicButton.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    //HIER ABSCHIEDSNACHRICHT BEARBEITEN//
    var CUSTOM_GOODBYE_MESSAGE = "@all Habe einen Realeinsatz! Rufe meinen Rettungsdienst zurück! (Gesendet von Panic Button)";
    //////////////////////////////////////////////////////

    function init()
    {
        //Set Cooldown Storage when not existing
        if(localStorage.getItem("LSS_PanicButton") == null)
        {
            localStorage.setItem("LSS_PanicButton", "0");
        }

        //Create Button
        var btn = $('<li><a href="#" id="panicBtn" ><span style="color: white" class="glyphicon glyphicon-alert"></a></li>');
        $('#navbar-main-collapse > ul').append(btn);

        //Add Function to Button
        $( "#panicBtn" ).click(function() {
            //Get cooldonwtimer
            var coolDownTimer = cooldown();

            //If cooldown still active
            if(coolDownTimer != true)
            {
                alert("Zeit bis zur Reaktivierung: " + coolDownTimer);
                return;
            }
            //If User confirms "Panic"
            if(confirm("Alarm! Alarm!"))
            {
                //reset cooldown Timer
                var d = new Date();
                localStorage.setItem("LSS_PanicButton", d.getTime());
                //start procedure
                codeRed();
            }
        });
    }

    function cooldown()
    {
        //Default cooling Time
        var coolingTime = 15;
        //Get last activation of Panic
        var lastActivation = parseInt(localStorage.getItem("LSS_PanicButton"));
        //Get current time
        var currentTime = new Date();
        currentTime = currentTime.getTime();
        //If Last activation is more then coolingTime ago
        if((lastActivation + (coolingTime * 60000)) <= currentTime)
        {
            return true;
        }
        //If not
        else
        {
            //Give remaining Time till cooldown end
            var remainTime = coolingTime - ((currentTime - lastActivation) / 60000);
            return remainTime.toFixed(1);
        }
    }

    async function codeRed()
    {
        //Get all Alliance Missions
        var missionList = $("#mission_list_alliance");
        var allianceMissions = missionList.find("a[id*='alarm_button']");

        //For all Missions in List
        for(var i = 0; i < allianceMissions.length; i++)
        {
            //Get Details
            var mission = $(allianceMissions[i]);
            //Get URL of Mission
            var missionUrl = mission.attr("href");
            //Get "Participating" Icon
            var icon = mission.parent().find("span[class*='glyphicon-user']");
            //Check if player is participating
            var isParticipating = !icon.attr("class").includes("hidden");
            //If Player is participating
            if(isParticipating)
            {
                //Revoke Units for current Mission in List
                await revokeUnits(missionUrl);
            }
        }
        //Send Goodbye Message, then logout
        sendGoodbyeMessage();
        logout();
    }

    function revokeUnits(missionUrl)
    {
        return new Promise(resolve => {
            setTimeout(() => {
                //open mission URL /backalarmRettungsdienst
                $.ajax({
                    url: missionUrl + "/backalarmRettungsdienst"
                }).done(function() {
                    resolve(true);
                });
            }, 1000);
        })
    }

    function logout() {
        //Logout player
        setTimeout(() => {
            $("#logout_button").click();
        }, 1000);

    }

    function sendGoodbyeMessage()
    {
        var authToken = $("[name='authenticity_token']").val();
        $.ajax({
            type: "POST",
            url: "/alliance_chats",
            data: {
                "utf8": "✓",
                "authenticity_token": authToken,
                "alliance_chat[message]": CUSTOM_GOODBYE_MESSAGE
            }
        })
    }

    init();
})();