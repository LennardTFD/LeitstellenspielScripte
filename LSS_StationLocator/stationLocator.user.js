// ==UserScript==
// @name         Station Locator
// @namespace    https://leitstellenspiel.de
// @version      1.0
// @description  Gets Stations based on OSM Data
// @author       Lennard[TFD]
// @match        https://www.leitstellenspiel.de/
// @match        https://www.missionchief.com/
// @match        https://www.meldkamerspel.com/
// @updateURL    https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_StationLocator/stationLocator.user.js
// @downloadURL  https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_StationLocator/stationLocator.user.js
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

let greenIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

let redIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

let greyIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

(function() {
    'use strict';

    function createElementFromHTML(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();

        return div.children[0];
    }
    
    async function requestStationsInRange() {
        //console.log("Starting generation!");
        let radius = 2000;

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

        let requestString = `
        [out:json];
            (
                node['amenity'='fire_sation'](around:${radius}, ${pointerLocation.lat},${pointerLocation.lng});
                node['amenity'='police'](around:${radius}, ${pointerLocation.lat},${pointerLocation.lng});
                node['emergency'='ambulance_station'](around:${radius}, ${pointerLocation.lat},${pointerLocation.lng});
                way['amenity'='fire_sation'](around:${radius}, ${pointerLocation.lat},${pointerLocation.lng});
                way['amenity'='police'](around:${radius}, ${pointerLocation.lat},${pointerLocation.lng});
                way['emergency'='ambulance_station'](around:${radius}, ${pointerLocation.lat},${pointerLocation.lng});
                relation['amenity'='fire_sation'](around:${radius}, ${pointerLocation.lat},${pointerLocation.lng});
                relation['amenity'='police'](around:${radius}, ${pointerLocation.lat},${pointerLocation.lng});
                relation['emergency'='ambulance_station'](around:${radius}, ${pointerLocation.lat},${pointerLocation.lng});
                );
        out center;
        >;
        `;
        let pois = await getStations(requestString);
        return pois;
    }

    function getStations(requestString) {
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
    
    async function addMarker(poiId, poi) {

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

        let addressRequest = await getAddress(lat, lng);
        let address = addressRequest;

        createMarker([lat, lng], )


    }
    
    function createMarker(chord, type, text) {

        let iconType = greenIcon;

        switch (type) {
            case "fire_station":
                iconType = redIcon;
                break;
            case "ambulance_station":
                iconType = greyIcon;
                break;
            case "police":
                iconType = greenIcon;
                break;
        }
        
        L.marker([chord[0], chord[1]], {icon: iconType}).addTo(map).bindPopup(text);
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

    async function run() {
        let stations = (await requestStationsInRange()).elements;
        let stationAmount = Object.keys(stations);
        for(let i = 0; i<stationAmount; i++)
        {
            console.log(stations[stationAmount[i]]);
        }
    }


})();