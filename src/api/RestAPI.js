import Constants from '../settings/Constants';
let convert = require('xml-js');
let uri = `http://220.64.14.147/`;

const RestAPI = {
    getRouteList: (pageSize, pageNo, keyword) => {
        showPageLoader(true);
        let serverURL = uri + `ws/rest/busrouteservice/page?serviceKey=` + Constants.SERVICE_KEY + `&pageSize=` + pageSize + `&pageNo=` + pageNo + `&keyword=` + keyword;
        console.log("route api is : ", serverURL)
        return (
            fetch(serverURL, { method: 'GET' })
                .then(response => response.text())
                .then(text => {
                    let res = JSON.parse(convert.xml2json(text, { compact: true, spaces: 4 }))
                    return res
                })
                .catch((error) => {
                    console.log(error)
                    showPageLoader(false)
                })
                .finally(() => {
                    showPageLoader(false)
                })
        )
    },
    getStationList: (pageSize, pageNo, keyword) => {
        showPageLoader(true);
        let serverURL = uri + `ws/rest/busstationservice/page?serviceKey=` + Constants.SERVICE_KEY + `&pageSize=` + pageSize + `&pageNo=` + pageNo + `&keyword=` + keyword;
        console.log("station api is : ", serverURL)
        return(
            fetch(serverURL, {method: 'GET'})
                .then(response=>response.text())
                .then(text=> {
                    let res = JSON.parse(convert.xml2json(text, {compact: true, spaces: 4}))
                    return res
                })
                .catch((error) => {
                    console.log(error)
                    showPageLoader(false)
                })
                .finally(()=>{
                    showPageLoader(false)
                })
        )
    },
    getPoiList: (keyword) => {
        showPageLoader(true)
        let serverURL =
            `https://apis.openapi.sk.com/tmap/pois?version=1&format=json&callback=result&resCoordType=WGS84GEO&reqCoordType=WGS84GEO&count=10` +
            `&appKey=` + Constants.APP_KEY + `&searchKeyword=` + encodeURIComponent(keyword);

        console.log("poi api is : ", serverURL)
        return (
            fetch(serverURL, { method: 'GET' })
                .then((response) => response.json())
                .then((json) => {
                    return json
                }).catch((error) => {
                    console.log(error)
                    showPageLoader(false)
                }).finally(() => { showPageLoader(false) })
        )
    },
    // 해당 노선에 속하는 정류소 전체목록을 가져오는 API - 실시간 노선 정류소 목록을 얻기 위해 필요하다.
    getRouteStation: (routeId) => {
        let serverURL = uri + `ws/rest/busrouteservice/station?serviceKey=` + Constants.SERVICE_KEY + `&routeId=` + routeId;
        console.log("stations list in selected route: ", serverURL);
        return(
            fetch(serverURL, {method: 'GET'})
                .then(response=>response.text())
                .then(text=> {
                    let res = JSON.parse(convert.xml2json(text, {compact: true, spaces: 4}))
                    return res
                })
                .catch((error) => {
                    console.log(error)
                    showPageLoader(false)
                })
        )
    },
    // 해당 노선에 속하는 현재 운행중인 버스 목록을 가져오는 API - 실시간 노선 정류소 운행 버스목록을 위해 필요하다.
    getActiveBus: (routeId) => {
        let serverURL = uri + `ws/rest/buslocationservice?serviceKey=` + Constants.SERVICE_KEY + `&routeId=` + routeId;
        console.log("active bus list in selected route: ", serverURL);
        return(
            fetch(serverURL, {method: 'GET'})
                .then(response=>response.text())
                .then(text=> {
                    let res = JSON.parse(convert.xml2json(text, {compact: true, spaces: 4}))
                    return res
                })
                .catch((error) => {
                    console.log(error)
                    showPageLoader(false)
                })
        )
    },
    // 노선아이디로 해당 노선의 상세정보 얻기 위한 API
    getRouteInfo: (routeId) => {
        let serverURL = uri + `ws/rest/busrouteservice/info?serviceKey=` + Constants.SERVICE_KEY + `&routeId=` + routeId;
        console.log("info of selected route: ", serverURL);
        return(
            fetch(serverURL, {method: 'GET'})
                .then(response=>response.text())
                .then(text=> {
                    let res = JSON.parse(convert.xml2json(text, {compact: true, spaces: 4}))
                    return res
                })
                .catch((error) => {
                    console.log(error)
                    showPageLoader(false)
                })
        )
    },

    // 정류소아이디로 정류소 상세정보 얻기
    getStationInfo: (stationId) => {
        let serverURL = uri + `ws/rest/busstationservice/info?serviceKey=` + Constants.SERVICE_KEY + `&stationId=` + stationId;
        console.log("info of the selected station: ", serverURL);
        return(
            fetch(serverURL, {method: 'GET'})
                .then(response=>response.text())
                .then(text=> {
                    let res = JSON.parse(convert.xml2json(text, {compact: true, spaces: 4}))
                    return res
                })
                .catch((error) => {
                    console.log(error)
                    showPageLoader(false)
                })
        )
    },

    // 노선아이디와 정류소아이디로 버스도착정보 얻기
    getStationRouteInfo: (routeId, stationId) => {
        let serverURL = uri + `ws/rest/busarrivalservice?serviceKey=` + Constants.SERVICE_KEY + `&stationId=` + stationId + `&routeId=` + routeId;
        console.log("stationRouteInfo of the selected station in route: ", serverURL);
        return(
            fetch(serverURL, {method: 'GET'})
                .then(response=>response.text())
                .then(text=> {
                    let res = JSON.parse(convert.xml2json(text, {compact: true, spaces: 4}))
                    return res
                })
                .catch((error) => {
                    console.log(error)
                    showPageLoader(false)
                })
        )
    },

    // 정류소 아이디로 정류소 도착정보 목록 얻기
    getStationArraiveRoute: (stationId) => {
        let serverURL = uri + `ws/rest/busarrivalservice/station?serviceKey=` + Constants.SERVICE_KEY + `&stationId=` + stationId;
        console.log("stationArriveRoute of the selected station: ", serverURL);
        return (
            fetch(serverURL, {method: 'GET'})
                .then(response=>response.text())
                .then(text=> {
                    let res = JSON.parse(convert.xml2json(text, {compact: true, spaces: 4}))
                    return res
                })
                .catch((error) => {
                    console.log(error)
                    showPageLoader(false)
                })
        )        
    },

    // 버스유형별 (시외, 공항)
    getBusType: (type) => {
        let serverURL = uri + `ws/rest/busrouteservice/routetype?serviceKey=` + Constants.SERVICE_KEY + `&areaId=02&routeType=` + type;
        console.log("busType URL: ", serverURL);
        return (
            fetch(serverURL, {method: 'GET'})
                .then(response=>response.text())
                .then(text=> {
                    let res = JSON.parse(convert.xml2json(text, {compact: true, spaces: 4}))
                    return res
                })
                .catch((error) => {
                    console.log(error)
                    showPageLoader(false)
                })
        )
    }
}

export default RestAPI;