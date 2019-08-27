// ==UserScript==
// @name         POI Generator
// @namespace    https://leitstellenspiel.de
// @version      1.0
// @description  Generates POIs based on OSM Data
// @author       Lennard[TFD]
// @match        https://www.leitstellenspiel.de/
// @match        https://www.missionchief.com/
// @match        https://www.meldkamerspel.com/
// @updateURL    https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_POIGenerator/poiGenerator.user.js
// @downloadURL  https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_POIGenerator/poiGenerator.user.js
// @grant        none
// ==/UserScript==

var mapType;
if('undefined' == typeof mapkit){
    mapType = "leaflet";
}
else
{
    mapType = "mapkit";
}

(function() {
    'use strict';


    let circle;

    function createElementFromHTML(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();

        return div.children[0];
    }

    function addToForm() {
        let radius = "<div class='input-group'><div class='input-group-addon'><label for='poiGeneratorRange'>Radius (m)</label></div><input id='poiGeneratorRange' class='form-control integer' type='number' step='200' min='100' max='5000' value='1000'></div>"

        let button = "<input id='poiGeneratorStart' type='button' value='Generieren' class='btn btn-success btn'>";

        let progress = "<br><div id='poiGeneratorProgress'></div>";



        let input = createElementFromHTML(radius);
        let generate = createElementFromHTML(button);
        let progressArea = createElementFromHTML(progress);

        document.getElementsByClassName("mission_position_address")[0].after(input);
        document.getElementsByClassName("form-actions")[0].querySelector("input").after(generate);
        document.getElementsByClassName("form-actions")[0].after(progressArea);

        $( "#poiGeneratorStart" ).click(function() {
            start();
        });

        $( "#poiGeneratorRange" ).on("change", function() {
            circle.setRadius($( "#poiGeneratorRange" ).val());
        });


        let center = map.getBounds().getCenter();
        circle = L.circle([center.lat, center.lng], {
            color: "red",
            fillColor: "#f03",
            fillOpacity: 0.5,
            radius: 1000
        }).addTo(map);

        map.on('move', function () {
            circle.setLatLng(map.getBounds().getCenter());
        });

        let loaderClose, loaderSave;
        $("a[href='/buildings']:eq(0)").click(function() {
            loaderClose = setInterval(() => {
                //console.log("Waiting for POI");
                if($("#build_new_poi")[0] != undefined)
                {
                    //console.log("POI loaded!");
                    circle.remove();
                    clearInterval(loaderClose);
                    clearInterval(loaderSave);
                    setupBtnListener();
                }
            }, 200);
        });

        $(".form-actions").find("input[value='Speichern']").click(function() {
            loaderSave = setInterval(() => {
                //console.log("Waiting for POI");
                if($("#mission_position_address")[0] != undefined)
                {
                    circle.remove();
                    //console.log("POI loaded!");
                    clearInterval(loaderSave);
                    clearInterval(loaderClose);
                    setupBtnListener();
                }
            }, 200);
        });
    }



    function setupBtnListener()
    {
        $( "#build_new_poi" ).click(function() {
            //console.log("POI is clicked!");
            let loader = setInterval(() => {
                //console.log("Waiting for POI");
                if($("#mission_position_address")[0] != undefined)
                {
                    //console.log("POI loaded!");
                    clearInterval(loader);
                    addToForm();
                }
            }, 200);
        });
    }
    
    async function requestPOIsInRange() {
        //console.log("Starting generation!");
        let radius = $("#poiGeneratorRange").val();
        let poiId = parseInt($("#mission_position_poi_type").val());

        let pointerLocation;
        if(mapType == "leaflet")
        {
            pointerLocation = map.getBounds().getCenter();
        }
        else
        {
            pointerLocation = map.center;
            pointerLocation.lat = pointerLocation.latitude;
            pointerLocation.lng = pointerLocation.longitude;
        }

        //console.log(pointerLocation);

        let filterString = [];
        
        switch (poiId) {
            //Park
            case 0:
                filterString[0] = "['leisure'~'park|playground']";
                break;
            //See
            case 1:
                filterString[0] = "['natural'='water']['water'!='river']['water'!='canal']['water'!='lock']['waterway'!='river']['waterway'!='stream']['waterway'!='canal']['amenity'!='fountain']";
                filterString[1] = "['natural'='water']['water'~'lake|pond|lagoon|reservoir|reflecting_pool|moat|wastewater']";
                filterString[2] = "['water'~'lake|pond|lagoon|reservoir|reflecting_pool|moat|wastewater']";
                filterString[3] = "['natural'='water']['waterway'='dam']";
                filterString[4] = "['waterway'='dam']";
                //filterString[0] = "['natural'='water']['amenity'!='fountain']";
                break;
            //Krankenhaus
            case 2:
                filterString[0] = "['amenity'~'hospital|clinic']";
                break;
            //Wald
            case 3:
                filterString[0] = "['landuse'='forest']";
                break;
            //Bus stop
            case 4:
                filterString[0] = "['bus'='yes']['public_transport'='stop_position']";
                filterString[1] = "['highway'='bus_stop']";
                break;
            //Tram stop
            case 5:
                filterString[0] = "['tram'='yes']['public_transport'='stop_position']";
                filterString[1] = "['tram'='yes']['railway'='tram_stop']";
                filterString[2] = "['subway'='yes']['public_transport'='stop_position']";
                break;
            //Trainstation
            case 6:
            case 7:
                filterString[0] = "['public_transport'='station']";
                filterString[1] = "['railway'='stop']";
                filterString[2] = "['public_transport'='stop_position']['train'='yes']";
                break;
            //Cargostation
            case 8:
                filterString[0] = [];
                break;
            //Supermarket
            case 9:
            case 10:
                filterString[0] = "['shop'='supermarket']";
                break;
            //Fuelstation
            case 11:
                filterString[0] = "['amenity'='fuel']";
                break;
            //School
            case 12:
                filterString[0] = "['building'='school']";
                filterString[1] = "['amenity'='school']";
                break;
            //Museum
            case 13:
                filterString[0] = "['tourism'='museum']";
                break;
            //Mall
            case 14:
                filterString[0] = "['shop'='mall']";
                break;
            //car workshop
            case 15:
                filterString[0] = "['shop'='car_repair']";
                filterString[1] = "['shop'='car_parts']";
                filterString[2] = "['shop'='car']";
                break;
            //Highway entrance/exit
            //Shall not use!
            case 16:
                filterString[0] = "['highway'='motorway_link']";
                break;
            //Christmasmarket
            case 17:
                filterString[0] = "['market'='flea_market']";
                filterString[1] = "['amenity'='marketplace']";
                break;
            //Warehouse
            case 18:
                filterString[0] = "['building'='industrial']";
                filterString[1] = "['building'='warehouse']";
                break;
            //Disco
            case 19:
                filterString[0] = "['amenity'='nightclub']";
                filterString[1] = "['amenity'='stripclub']";
                filterString[2] = "['amenity'='swingerclub']";
                filterString[3] = "['amenity'='brothel']";
                filterString[4] = "['amenity'='pub']";
                filterString[5] = "['amenity'='bar']";
                break;
            //Stadium
            case 20:
                filterString[0] = "['leisure'='stadium']";
                break;
            //Farm
            case 21:
                filterString[0] = "['building'='farm']";
                filterString[1] = "['building'='barn']";
                filterString[2] = "['building'='farm_auxiliary']";
                filterString[2] = "['building'='stable']";
                break;
            //Office
            case 22:
                filterString[0] = "['office']";
                filterString[1] = "['amenity'='embassy']";
                filterString[2] = "['building'='office']";
                break;
            //Swimming Pool
            case 23:
                filterString[0] = "['leisure'='swimming_area']";
                filterString[1] = "['leisure'='swimming_pool']";
                filterString[2] = "['sport'='swimming']";
                break;
            //Train crossing
            case 24:
                filterString[0] = "['railway'~'crossing|level_crossing|railway_crossing']";
                break;
            //Theatre
            case 25:
                filterString[0] = "['amenity'~'cinema|theatre']";
                break;
            //Fairground
            //Shall not use!
            case 26:
                filterString[0] = "['tourism'='attraction']";
                break;
            //Fluss
            case 27:
                //filterString[0] = "['natural'='water']['water'!='lake']['water'!='pond']['water'!='wastewater']['amenity'!='fountain']";
                filterString[0] = "['natural'='water']['waterway'~'river|stream|riverbank|tidal_channel|canal']";
                filterString[1] = "['natural'='water']['water'~'canal|oxbow|river']";
                filterString[2] = "['water'~'canal|oxbow|river']";
                filterString[3] = "['waterway'~'river|stream|riverbank|tidal_channel|canal']";
                //filterString[1] = "['natural'='water']['waterway'='stream']";
                break;
            //Baumarkt
            case 28:
                filterString[0] = "['shop'='doityourself']";
                break;
            //Airport Runway
            case 29:
            case 32:
                filterString[0] = "['aeroway'='runway']";
                filterString[0] = "['aeroway'='taxiway']";
                break;
            //Airport Building/Terminal
            case 30:
            case 33:
                filterString[0] = "['aeroway'='terminal']";
                filterString[1] = "['aeroway'='gate']";
                break;
            //Airport Parking
            case 31:
            case 34:
                filterString[0] = "['aeroway'='parking_position']";
                filterString[1] = "['aeroway'='apron']";
                break;
            //Airport Car park
            case 35:
                filterString[0] = "['parking'='multi-storey']";
                break;
            //Biogas
            case 36:
                filterString[0] = "['building'='digester']";
                break;
            //Bank
            case 37:
                filterString[0] = "['amenity'='bank']";
                break;
            //Church
            case 38:
                filterString[0] = "['historic'='church']";
                filterString[1] = "['building'='church']";
                filterString[2] = "['building'='mosque']";
                filterString[3] = "['building'='synagogue']";
                break;
            //Church
            case 38:
                filterString[0] = "['historic'='church']";
                filterString[1] = "['building'='church']";
                filterString[2] = "['building'='mosque']";
                filterString[3] = "['building'='synagogue']";
                break;
            //Industry
            case 39:
            case 40:
            case 41:
                filterString[0] = "['building'='industrial']";
                break;
            //Trash burning
            case 42:
                filterString[0] = "['amenity'='waste_disposal']";
                break;
            //Trash burning
            case 43:
                filterString[0] = "['sport'='ice_skating']";
                filterString[0] = "['leisure'='ice_rink']";
                break;

        }


        let requestString = ``;

        let start = `
        [out:json];
            (
        `;

        let requestPreset = `
                node$filterString$(around:${radius}, ${pointerLocation.lat},${pointerLocation.lng});
                way$filterString$(around:${radius}, ${pointerLocation.lat},${pointerLocation.lng});
                relation$filterString$(around:${radius}, ${pointerLocation.lat},${pointerLocation.lng});
        `;

        let end = `
            );
        out center;
        >;
        `;

        for(let i = 0; i < filterString.length; i++)
        {
            //console.log(i, poiId);
            requestString += requestPreset.replace(/\$filterString\$/g, filterString[i]);
        }

        requestString = start + requestString + end;

        //console.log(requestString);

        let pois = await getPOIs(requestString);
        return pois;


    }

    function getPOIs(requestString) {
        return new Promise(resolve => {
            $.ajax({
                url: "http://overpass-api.de/api/interpreter",
                method: "GET",
                data: {data: requestString}
            }).done((res) => {
                resolve(res);
            });
        });
    }
    
    async function createPOIs(poiId, poi) {

        //console.log("Creating POI");

        let lat, lng;

        if(poi.type == "node")
        {
            lat = poi.lat;
            lng = poi.lon;
        }
        else
        {
            lat = poi.center.lat;
            lng = poi.center.lon;
        }
        //console.log(lat, lng);

        let addressRequest = await getAddress(lat, lng);
        let address = addressRequest;
        //console.log(address);

        $.ajax({
            url: "https://www.leitstellenspiel.de/mission_positions",
            method: "POST",
            data: {
                "mission_position[poi_type]": poiId,
                "mission_position[latitude]": lat,
                "mission_position[longitude]": lng,
                "mission_position[address]": address,
                "utf8": true,
                "authentication_token": $("meta[name='csrf-token']").attr("content")
            }
        }).done((res) => {
            //console.log("New POI created")
        });
    }
    
    function getAddress(lat, lng) {
        return new Promise(resolve => {
            $.ajax({
                url: "https://www.leitstellenspiel.de/reverse_address",
                method: "GET",
                data: {
                        latitude: lat,
                        longitude: lng
                    }
            }).done((res) => {
                resolve(res);
            });
        });
    }

    function createProgress(poiId, poiName, poiAmount)
    {

        let progressbar = '<div class="progress" id="poiProgress_' + poiId + '">' +
                '<div class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="' + poiAmount + '">' + poiName + '</div>' +
            '</div>';

        let progress = createElementFromHTML(progressbar);
        $("#poiGeneratorProgress").append(progress);
        return $(progress).find("div");
    }

    async function start()
    {
        let poiId = parseInt($("#mission_position_poi_type").val());
        let poiName = $("#mission_position_poi_type").find("option[value='" + poiId + "']").text();
        let pois = await requestPOIsInRange();
        let poiAmount = Object.keys(pois.elements).length;

        let bar = createProgress(poiId, poiName, poiAmount);
        let max = poiAmount;
        let currProgress = parseInt($(bar).attr("aria-valuenow"));

        let i = 0;
        $.each(pois.elements, (e, t) => {
            setTimeout(() => {
                $(bar).attr("aria-valuenow", ++currProgress);
                $(bar).css("width", ((currProgress / max) * 100) + "%");
                createPOIs(poiId, t);

                //console.log("POI Amount:", poiAmount, "| E:", e);

                if(poiAmount == e + 1)
                {
                    //console.log("Last POI created!");
                    removeProgressbar(poiId);
                }

            }, 3200 * i);
            i++;
        });
        if(poiAmount < 1)
        {
            //console.log("No POIs to create!");
            removeProgressbar(poiId);
        }
    }

    function removeProgressbar(poiId)
    {
        //console.log("Progressbar removed!");
        //console.log($("#poiProgress_" + poiId));
        $("#poiProgress_" + poiId).remove();
    }

    setupBtnListener();


})();