<h1>LSS Chatter to Speech</h1>
Dieses Script wandelt Funksprüche in gesprochene Sprache um.<br>
Es kann eine Hintergrund Audio für Status 3 Meldungen hinterlegt werden.<br>

<hr>

<h4>Für Erweiterungen:</h4>
Es stehen folgende Wildcards zur Verfügung:<br><br>

|   Wildcard    |   Formatierung                |
| ------------- | ----------------------------- |
|   %USER%      |   Funkrufname der Einheit     |
|   %MISSION%   |   Name des Einatzes           |
|   %ADDRESS%   |   Addresse des Einsatzes      |
|   %BUILDING%  |   Name des Krankenhauses/Zelle **(Status 7)**     |

---
<b>%UNIT%</b> bei <b>%MISSION%</b> an <b>%ADRESSE%</b> angekommen!
<b>Florian Düsseldorf 01-HLF20-01</b> bei <b>Mülltonnenbrand</b> an <b>Berliner Allee 25</b> angekommen!
---

<h6>Die Text2Speech API stammt von <a href="https://responsivevoice.com/">Repsonsive Voice</a></h6>
