// ==UserScript==
// @name         Hide Unrelated Paths
// @namespace    https://www.leitstellenspiel.de/
// @version      0.3
// @description  Blende Fahrzeugrouten aus, die nicht zum mouse hover Einsatz gehören
// @author       Lennard[TFD]
// @match        https://www.leitstellenspiel.de/
// @grant        none
// @updateURL    https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_HideUnrealtedPaths/hideUnrealtedPaths.user.js
// @downloadURL  https://github.com/LennardTFD/LeitstellenspielScripte/raw/master/LSS_HideUnrealtedPaths/hideUnrealtedPaths.user.js
// ==/UserScript==

(function() {
    let aVehicles;
    let mapType;
    if('undefined' == typeof mapkit) mapType = "leaflet";
    else mapType = "mapkit";
    /******************************* LOOK UP TABLE AREA *******************************/

        //LookupTable for missions and vehicles
    let missionVehicleLookupTable = {missions: {},vehicles: {}};

    function getVehicleMission(vehicleID)
    {
        return missionVehicleLookupTable.vehicles[vehicleID] || null;
    }

    function getMissionVehicles(missionID)
    {
        return missionVehicleLookupTable.missions[missionID] || [];
    }


    /******************************* GENERAL AREA *******************************/

    function removeVehicleRelation(vehicleID, missionID)
    {
        let missionVehicles = getMissionVehicles(missionID);
        let i = missionVehicles.indexOf(vehicleID);
        if(i > -1) {
            missionVehicleLookupTable.missions[missionID].splice(i, 1);
        }

        missionVehicleLookupTable.vehicles[vehicleID] = null;
    }

    function setVehicleRelation(vehicleID, missionID)
    {

        //If mission does not exist, created it
        if(!missionVehicleLookupTable.missions[missionID]) missionVehicleLookupTable.missions[missionID] = [];
        //Relate vehicle to mission
        missionVehicleLookupTable.missions[missionID].push(vehicleID);
        //Set Mission ID for vehicle
        missionVehicleLookupTable.vehicles[vehicleID] = missionID;
    }

    function hideVehicleRoutes(missionID, mode = "show")
    {
        if(missionID == null || missionID == "") return;
        //For every Vehicle on Map
        for(let vehicle_marker of vehicle_markers)
        {
            //If Vehicle is not part of Mission
            if(!getMissionVehicles(missionID).includes(vehicle_marker.vehicle_id))
            {
                //If show is request, show it, else hide it
                //if(mode == "show") map.addLayer(vehicle_marker.polyline);
                //else map.removeLayer(vehicle_marker.polyline);
                if(mode == "show") {
                    vehicle_marker.polyline.setStyle({opacity: 1});
                    vehicle_marker.setOpacity(1);
                }
                else
                {
                    vehicle_marker.polyline.setStyle({opacity: 0.2});
                    vehicle_marker.setOpacity(0.2);
                }
            }
        }
    }

    /******************************* SETUP AREA *******************************/


    function missionMarkerListener(marker)
    {
        let id = marker.mission_id;
        marker.addEventListener("mouseover", () => {
            hideVehicleRoutes(id, "hide");
        });
        //Create event Listeners to show unrelated paths on Mission mouse leave
        marker.addEventListener("mouseout", () => {
            hideVehicleRoutes(id, "show");
        });
    }

    function vehicleMarkerListener(vehicle)
    {
        vehicle.addEventListener("mouseover", () => {
            hideVehicleRoutes(getVehicleMission(vehicle.vehicle_id), "hide");
        });
        //Create event Listeners to show unrelated paths on Mission mouse leave
        vehicle.addEventListener("mouseout", () => {
            hideVehicleRoutes(getVehicleMission(vehicle.vehicle_id), "show");
        });
    }

    async function init()
    {
/*
        if(!localStorage.aVehicles || JSON.parse(localStorage.aVehicles).lastUpdate < (new Date().getTime() - 5 * 1000 * 60) || JSON.parse(localStorage.aVehicles).userId != user_id) await $.getJSON('/api/vehicles').done(data => localStorage.setItem('aVehicles', JSON.stringify({lastUpdate: new Date().getTime(), value: data, userId: user_id})) );
        aVehicles = JSON.parse(localStorage.aVehicles).value;

 */

        await $.getJSON('/api/vehicles').done(data => aVehicles = data );

        //For each existing marker, create listener
        for(let marker of mission_markers)
        {
            missionMarkerListener(marker);
        }
        for(let vehicle of vehicle_markers)
        {
            vehicleMarkerListener(vehicle);
        }

        //Get all vehicles
        //let vehicleData = $.getJSON("api/vehicles", (vehicles) => {
            //Get Vehicles with mission realtion
            let vehicles = aVehicles.filter((e) => {
                return e.target_id != null && e.target_type == "mission";
            });

            //Setup Vehicle relation inside lookup table
            for(let vehicle of vehicles)
            {
                setVehicleRelation(vehicle.id, vehicle.target_id);
            }
        //});



    }

    /******************************* FUNCTION OVERWRITE AREA *******************************/

        //Overwrite vehicleDrive function
    var vehicleDriveOld = vehicleDrive;
    vehicleDrive = function(d) {
        //Get Attributes
        let missionID = d.mid;
        let vehicleID = d.id;

        //If target is not a new mission
        if(missionID == "" || missionID == null)
        {
            //Get Old Mission
            let oldMissionID = getVehicleMission(vehicleID) || null;
            //If old mission is known, remove Vehicle relation from mission
            removeVehicleRelation(vehicleID, oldMissionID);
        }
        else setVehicleRelation(vehicleID, missionID);
        //call original function
        vehicleDriveOld(d);
    }
    //overwrite missionMarkerAdd function
    var missionMarkerAddOld = missionMarkerAdd;
    missionMarkerAdd = function(e) {
        //call original function
        missionMarkerAddOld(e);
        missionMarkerListener(mission_markers[mission_markers.length - 1]);
    }

    var vehicleMarkerAddOld = vehicleMarkerAdd;
    vehicleMarkerAdd = function(e)
    {
        vehicleMarkerAddOld(e);
        vehicleMarkerListener(vehicle_markers[vehicle_markers.length - 1]);
    }

    init();
})()