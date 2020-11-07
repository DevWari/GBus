import Constants from '../settings/Constants';

const FrRestAPI = {
    // 현재 위치로부터 자기위치의 도시이름 얻어오기(서울, 경기, 전국을 검사하기 위해 필요하다.)
    getCityName(lon, lat) {
        let serverURL = `https://apis.openapi.sk.com/tmap/geo/reversegeocoding?version=1&format=json&callback=result&addressType=A10&appKey=` + Constants.APP_KEY + `&coordType=` + Constants.COORD_TYPE + `&lon=` + lon + `&lat=` + lat;
        return (
            fetch(serverURL, { method: 'GET' })
                .then((response) => response.json())
                .then((json) => {
                    return json.addressInfo.city_do
                })
                .catch((error) => {
                    console.log("error: ", error)
                })
        )
    },
    // 입력된 문자로 읍/면/동 검색하기 - 서울
    getPOISeoul(str) {
        let serverURL = `https://apis.openapi.sk.com/tmap/poi/findPoiAreaDataByName?version=1&format=json&callback=result&page=1&count=1&addressType=all&area_si_do=서울&appKey=` + Constants.APP_KEY + `&resCoordType=` + Constants.COORD_TYPE + `&area_dong=` + str;
        console.log("seoul dong: ", serverURL)
        return (
            fetch(serverURL, { method: 'GET' })
                .then((response) => response.json())
                .then((json) => {
                    return json
                })
                .catch((error) => {
                    console.log("error: ", error)
                })
        )
    },
    // 입력된 문자로 읍/면/동 검색하기 - 경기
    getPOIGyong(str) {
        let serverURL = `https://apis.openapi.sk.com/tmap/poi/findPoiAreaDataByName?version=1&format=json&callback=result&page=1&count=1&addressType=all&area_si_do=경기&appKey=` + Constants.APP_KEY + `&resCoordType=` + Constants.COORD_TYPE + `&area_dong=` + str;
        console.log("gyongi dong: ", serverURL)
        return (
            fetch(serverURL, { method: 'GET' })
                .then((response) => response.json())
                .then((json) => {
                    return json
                })
                .catch((error) => {
                    console.log("error: ", error)
                })
        )
    },
    // 입력된 문자로 읍/면/동 검색하기 - 전국
    getPOIAll(str) {
        let serverURL = `https://apis.openapi.sk.com/tmap/poi/findPoiAreaDataByName?version=1&format=json&callback=result&page=1&count=20&addressType=all&appKey=` + Constants.APP_KEY + `&resCoordType=` + Constants.COORD_TYPE + `&area_dong=` + str;
        return (
            fetch(serverURL, { method: 'GET' })
                .then((response) => response.json())
                .then((json) => {
                    return json
                })
                .catch((error) => {
                    console.log("error: ", error)
                    
                })
        )
    }
}

export default FrRestAPI