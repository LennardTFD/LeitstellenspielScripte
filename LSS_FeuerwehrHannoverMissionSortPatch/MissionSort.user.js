// ==UserScript==
// @name         Einsatzsortierung
// @version      1.1p
// @author       FeuerwehrHannover
// @include      *://www.leitstellenspiel.de/
// @include      *://www.leitstellenspiel.de/missions/*
// ==/UserScript==
$(document).ready(function () {
    if ("/" == window.location.pathname) {
        var e = {}, t = {}, i = {}, n = {}, s = {}, r = {};
        sessionStorage.getItem("missionsort") ? r = JSON.parse(sessionStorage.getItem("missionsort")) : $.get("https://www.leitstellenspiel.de/einsaetze.json", function (e) {
            $.each(e, function (t) {
                let missionId = e[t].id;
                null != e[t].average_credits ? (console.log(typeof e), r[missionId] = {}, r[missionId].Credits = e[t].average_credits) : (r[missionId] = {}, r[missionId].Credits = "0")
            }), sessionStorage.setItem("missionsort", JSON.stringify(r))
        }), $("body").hasClass("dark") ? localStorage.setItem("sort-dark", !0) : localStorage.removeItem("sort-dark"), $("#btn-group-mission-select").append('<button id="sortdebug" class="btn btn-xs btn-default mission_selection"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button> <button id="sortdate" class="btn btn-xs btn-default mission_selection"><span class="glyphicon glyphicon-time" aria-hidden="true"></span></button> <button id="sortcredits" class="btn btn-xs btn-default mission_selection"><span class="glyphicon glyphicon glyphicon glyphicon-euro" aria-hidden="true"></span></button> <button id="sortabc" class="btn btn-xs btn-default mission_selection"><span class="glyphicon glyphicon-sort-by-alphabet" aria-hidden="true"></span></button>'), localStorage.removeItem("sort-credits"), localStorage.removeItem("sort-date"), localStorage.removeItem("sort-credits-alliance"), localStorage.removeItem("sort-abc"), localStorage.removeItem("sort-abc-alliance"), $("#mission_list .missionSideBarEntry").each(function () {
            $(this).attr("sort-default", $(this).index())
        }), $("#mission_list_alliance .missionSideBarEntry").each(function () {
            $(this).attr("sort-default", $(this).index())
        }), $("#sortcredits").click(function () {
            localStorage.removeItem("sort-credits"), localStorage.removeItem("sort-date"), localStorage.removeItem("sort-credits-alliance"), localStorage.setItem("sort-mode", "credits");
            var i = $("#mission_list div.missionSideBarEntry"), n = $("#mission_list_alliance div.missionSideBarEntry");
            i.sort(function (e, t) {
                return +$(t).attr("data-credits") - +$(e).attr("data-credits")
            }), i.appendTo("div#mission_list"), n.sort(function (e, t) {
                return +$(t).attr("data-credits") - +$(e).attr("data-credits")
            }), n.appendTo("div#mission_list_alliance"), $("#mission_list .missionSideBarEntry").each(function () {
                var t = $(this).attr("mission_type_id");
                if (null == r[t]) console.log("Neuer Einsatz ID: " + t); else {
                    var i = $(this).index(), n = $(this).attr("mission_id");
                    $(this).attr("data-credits", r[t].Credits), e[i] = n, localStorage.setItem("sort-credits", JSON.stringify(e))
                }
            }), $("#mission_list_alliance .missionSideBarEntry").each(function () {
                var e = $(this).attr("mission_type_id");
                if ("null" == e) {
                    var i = $(this).index(), n = $(this).attr("mission_id");
                    $(this).attr("data-credits", "25000"), t[i] = n, localStorage.setItem("sort-credits-alliance", JSON.stringify(t))
                } else if (null == r[e]) console.log("Neuer Einsatz ID: " + e); else {
                    i = $(this).index(), n = $(this).attr("mission_id");
                    $(this).attr("data-credits", r[e].Credits), t[i] = n, localStorage.setItem("sort-credits-alliance", JSON.stringify(t))
                }
            })
        }), $("#sortdate").click(function () {
            localStorage.setItem("sort-mode", "date"), localStorage.removeItem("sort-credits"), localStorage.removeItem("sort-date"), localStorage.removeItem("sort-credits-alliance"), localStorage.removeItem("sort-abs");
            var e = $("#mission_list_alliance .missionSideBarEntry");
            e.sort(function (e, t) {
                return +$(e).attr("mission_id") - +$(t).attr("mission_id")
            }), e.appendTo("#mission_list_alliance"), $("#mission_list_alliance .missionSideBarEntry").each(function () {
                var e = $(this).index(), t = $(this).attr("mission_id");
                i[e] = t
            }), localStorage.setItem("sort-date", JSON.stringify(i))
        }), $("#sortdebug").click(function () {
            localStorage.removeItem("sort-date"), localStorage.removeItem("sort-credits"), localStorage.removeItem("sort-mode"), localStorage.removeItem("sort-abc");
            var e = $("#mission_list div.missionSideBarEntry"), t = $("#mission_list_alliance div.missionSideBarEntry");
            e.sort(function (e, t) {
                return +$(e).attr("sort-default") - +$(t).attr("sort-default")
            }), e.appendTo("div#mission_list"), t.sort(function (e, t) {
                return +$(e).attr("sort-default") - +$(t).attr("sort-default")
            }), t.appendTo("div#mission_list_alliance")
        }), $("#sortabc").click(function () {
            localStorage.setItem("sort-mode", "abc"), localStorage.removeItem("sort-date"), localStorage.removeItem("sort-credits");
            var e = $("#mission_list div.missionSideBarEntry"), t = $("#mission_list_alliance div.missionSideBarEntry");
            e.sort(function (e, t) {
                return $(e).find("a.map_position_mover").clone().children().remove().end().text() < $(t).find("a.map_position_mover").clone().children().remove().end().text() ? -1 : $(e).find("a.map_position_mover").clone().children().remove().end().text() > $(t).find("a.map_position_mover").clone().children().remove().end().text() ? 1 : 0
            }), e.appendTo("div#mission_list"), t.sort(function (e, t) {
                return $(e).find("a.map_position_mover").clone().children().remove().end().text() < $(t).find("a.map_position_mover").clone().children().remove().end().text() ? -1 : $(e).find("a.map_position_mover").clone().children().remove().end().text() > $(t).find("a.map_position_mover").clone().children().remove().end().text() ? 1 : 0
            }), t.appendTo("div#mission_list_alliance"), $("#mission_list .missionSideBarEntry").each(function () {
                var e = $(this).index(), t = $(this).attr("mission_id");
                n[e] = t
            }), localStorage.setItem("sort-abc", JSON.stringify(n)), $("#mission_list_alliance .missionSideBarEntry").each(function () {
                var e = $(this).index(), t = $(this).attr("mission_id");
                s[e] = t
            }), localStorage.setItem("sort-abc-alliance", JSON.stringify(s))
        }), faye.subscribe("/private-alliance140de", function (e) {
            e.search("missionMarkerAdd()")
        })
    }
    if (window.location.pathname.indexOf("missions/") > -1) {
        function o(e, t) {
            return parseInt(Object.keys(e).find(i => e[i] === t))
        }

        function a(e) {
            $(".mission_header_info div:eq(0)").append('<div class="sorterror"><p style="margin: 0;"><strong>Fehler!</strong>' + e + "</p></div>"), $(".sorterror").css({
                "background-color": "#ffdddd",
                "border-left": "6px solid #f44336",
                "margin-bottom": "15px",
                padding: "4px 12px",
                display: "flex",
                "align-items": "center"
            }), "true" == localStorage.getItem("sort-dark") && $(".sorterror").css("color", "#000")
        }

        function l() {
            return $("#mission_finish_now_btn").length ? "sort-credits" : "sort-credits-alliance"
        }

        function c() {
            return $("#mission_finish_now_btn").length ? "sort-abc" : "sort-abc-alliance"
        }

        function d(e) {
            null != e ? $(".navbar-header").append('<div class="btn-group"><button id="sort-alert-next" next="' + e + '" class="btn btn-warning btn-sm" title="Alarmieren und weiter (sortiert)"><img class="icon icons8-Phone-Filled" src="/images/icons8-phone_filled.svg" width="10" height="18"><span class="glyphicon glyphicon-arrow-right"></span></button></div>') : $(".navbar-header").append('<div class="btn-group"><button class="btn btn-warning disabled" title="Alarmieren und weiter (sortiert)"><img class="icon icons8-Phone-Filled" src="/images/icons8-phone_filled.svg" width="10" height="18"><span class="glyphicon glyphicon-arrow-right"></span></button></div>')
        }

        if (null != localStorage.getItem("sort-next") && "" != localStorage.getItem("sort-next")) {
            var m = localStorage.getItem("sort-next");
            localStorage.removeItem("sort-next"), window.location.href = "https://www.leitstellenspiel.de/missions/" + m
        }
        if ($(document).on("click", "#sort-alert-next", function () {
            localStorage.setItem("sort-next", $("#sort-alert-next").attr("next")), $("#mission_alarm_btn").click()
        }), null == localStorage.getItem("sort-mode")) throw a(" Es konnte keine Sortierung gefunden werden | ID: #4 (no sort-mode)"), new Error("Einsatzsortierung | Ein Fehler ist aufgetreten! Bei Problemen melde dich im Forum. ID: #4");
        if ("credits" == localStorage.getItem("sort-mode")) {
            if (null == localStorage.getItem(l())) throw a(" Es konnte keine Sortierung gefunden werden | ID: #1 (no storage item)"), new Error("Einsatzsortierung | Ein Fehler ist aufgetreten! Bei Problemen melde dich im Forum. ID: #1");
            var g = location.href.replace("https://www.leitstellenspiel.de/missions/", "");
            if (null !== o(f = JSON.parse(localStorage.getItem(l())), g)) {
                var p = '<div class="btn-group"><a href="/missions/', h = o(f, g), u = parseInt(f[h - 1]);
                isNaN(u) ? p += '" class="disabled ' : p += u + '" class="', p += 'btn btn-fadeout btn-sm btn-warning navbar-btn" id="sort_previous" title="Vorheriger sortierter Einsatz"> <span class="glyphicon glyphicon-arrow-left"></span> <span class="glyphicon glyphicon glyphicon glyphicon-euro" aria-hidden="true"></span></a><a href="/missions/';
                var b = parseInt(f[h + 1]);
                isNaN(b) ? p += '" class="disabled ' : p += b + '" class="', p += 'btn  btn-fadeout btn-sm  btn-warning navbar-btn" id="sort_next" title="Nächster sortierter Einsatz"><span class="glyphicon glyphicon glyphicon glyphicon-euro" aria-hidden="true"></span> <span class="glyphicon glyphicon-arrow-right"></span> </a></div>', d(b), $(".navbar-header").append(p)
            } else a(" Zu diesem Einsatz konnte keine Sortierung gefunden werden. Sortiere die Einsätze erneut.")
        } else if ("abc" == localStorage.getItem("sort-mode")) {
            if (null == localStorage.getItem(c())) throw a(" Es konnte keine Sortierung gefunden werden | ID: #2 (no storage item)"), new Error("Einsatzsortierung | Ein Fehler ist aufgetreten! Bei Problemen melde dich im Forum. ID: #2");
            g = location.href.replace("https://www.leitstellenspiel.de/missions/", "");
            var f = JSON.parse(localStorage.getItem(c()));
            if (isNaN(o(f, g))) a(" Zu diesem Einsatz konnte keine Sortierung gefunden werden. Sortiere die Einsätze erneut."); else {
                p = '<div class="btn-group"><a href="/missions/', h = o(f, g), u = parseInt(f[h - 1]);
                isNaN(u) ? p += '" class="disabled ' : p += u + '" class="', p += 'btn btn-fadeout btn-sm btn-warning navbar-btn" id="sort_previous" title="Vorheriger sortierter Einsatz"> <span class="glyphicon glyphicon-arrow-left"></span> <span class="glyphicon glyphicon-sort-by-alphabet" aria-hidden="true"></span></a><a href="/missions/';
                b = parseInt(f[h + 1]);
                isNaN(b) ? p += '" class="disabled ' : p += b + '" class="', p += 'btn  btn-fadeout btn-sm  btn-warning navbar-btn" id="sort_next" title="Nächster sortierter Einsatz"><span class="glyphicon glyphicon-sort-by-alphabet" aria-hidden="true"></span> <span class="glyphicon glyphicon-arrow-right"></span> </a></div>', d(b), $(".navbar-header").append(p)
            }
        } else {
            if ("date" != localStorage.getItem("sort-mode")) throw a(" Es konnte keine Sortierung gefunden werden | ID: #1 (sort-mode undefined)"), new Error("Einsatzsortierung | Ein Fehler ist aufgetreten! Bei Problemen melde dich im Forum. ID: #3");
            if (null == localStorage.getItem("sort-date")) throw a(" Es konnte keine Sortierung gefunden werden | ID: #2 (no storage item)"), new Error("Einsatzsortierung | Ein Fehler ist aufgetreten! Bei Problemen melde dich im Forum. ID: #2");
            g = location.href.replace("https://www.leitstellenspiel.de/missions/", ""), f = JSON.parse(localStorage.getItem("sort-date"));
            if (isNaN(o(f, g))) a(" Zu diesem Einsatz konnte keine Sortierung gefunden werden. Sortiere die Einsätze erneut."); else {
                p = '<div class="btn-group"><a href="/missions/', h = o(f, g), u = parseInt(f[h - 1]);
                isNaN(u) ? p += '" class="disabled ' : p += u + '" class="', p += 'btn btn-fadeout btn-sm btn-warning navbar-btn" id="sort_previous" title="Vorheriger sortierter Einsatz"> <span class="glyphicon glyphicon-arrow-left"></span> <span class="glyphicon glyphicon-time" aria-hidden="true"></span></a><a href="/missions/';
                b = parseInt(f[h + 1]);
                isNaN(b) ? p += '" class="disabled ' : p += b + '" class="', p += 'btn  btn-fadeout btn-sm  btn-warning navbar-btn" id="sort_next" title="Nächster sortierter Einsatz"><span class="glyphicon glyphicon-time" aria-hidden="true"></span> <span class="glyphicon glyphicon-arrow-right"></span> </a></div>', d(b), $(".navbar-header").append(p)
            }
        }
    }
});
