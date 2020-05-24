// ==UserScript==
// @name         Foreb Dakrmode
// @namespace    https://forum.leitstellenspiel.de/
// @version      1.0
// @description  Versetzt das LSS Forum in den Darkmode (und viele andere WoltLab Foren)
// @author       Lennard[TFD]
// @match        https://forum.leitstellenspiel.de/*
// @match        https://forum.rettungssimulator.online/*
// @updateURL    https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_ForumDarkMode/forumDarkMode.user.js
// @downloadURL  https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_ForumDarkMode/forumDarkMode.user.js
// @run-at document-start
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(`
/*Main*/
#main {background-color:#212121 !important}
#main form {background-color:#212121 !important}
#main form input, .inputItemList, select {background-color:#7d8287 !important; color:white}

.buttonList {background-color:#212121 !important}

.formSubmit {background-color:#212121 !important}
.formSubmit input {background-color:#a70c00 !important}


.section {background-color:#212121 !important}
.sidebar .boxContainer * {background-color:#212121 !important}
.contentHeader {color:white}
.pageNavigation{background-color:#a70c00 !important}
.breadcrumbs a {color:white !important}
.wbbThreadList {background-color:#212121 !important}
.badge {background-color:#818181 !important}
.icon {color:white !important}
/*Thread List*/
.likeCounterLiked span{color:#0f0 !important}
.tabularListRow:hover{background-color:#3b3b3b !important}
.statsDataList {color:white !important}
.datetime {color:#7d8287 !important}
.messageGroupListStatsSimple{color:white !important}

/*Drop Downs*/
.interactiveDropdown {background-color:#212121 !important}
.interactiveDropdown li {color:white !important}
.interactiveDropdown li:hover {background-color:#3b3b3b !important}
.interactiveDropdownShowAll {background-color:#212121 !important; color:white !important}
.interactiveDropdownShowAll:hover {background-color:#3b3b3b !important; color:white !important}
.interactiveDropdownHeader {background-color:#212121 !important; color:white !important}

#pageFooter.boxContainer.boxContent{background-color:#b71c0c !important}
.boxesFooterBoxes, .boxesFooterBoxes * {background-color:#212121 !important}

#recentActivities li, .messageSearchResultList li {color:white !important}
#recentActivities li:hover, .messageSearchResultList li:hover {background-color:#3b3b3b !important;}

.userList li {color:white !important}
.userList li:hover {background-color:#3b3b3b !important;}
.buttonList iconList {color:black !important}

.wbbBoard:hover{background-color:#3b3b3b !important;}

.pagination li a{color:white !important}
h2{color:white !important}

.columnMark label {color:white !important}


.dialogContent {background-color:#212121 !important; color:white}

.userMessage {color:white}
.commentResponse:hover{background-color:#3b3b3b !important}

li .button {color:white}

.redactor-layer {background-color:#212121 !important; color:white}
.messageSidebar {background-color:#212121 !important; color:white}
.messageBody, .messageFooter, .messageTabMenu * {background-color:#212121 !important; color:white !important}
.quoteBox, .messageReduced * {background-color:#3b3b3b !important; color:white}
`);