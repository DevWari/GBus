const Html = {
    content: `<!DOCTYPE html>
    <html>
    
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>길찾기</title>
    
        <script src="https://apis.openapi.sk.com/tmap/jsv2?version=2&appKey=01ab749a-7332-4a8d-93ee-dc823cbe3de1"></script>
        <script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
        <script src="https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js"></script>
        <script src="https://goessner.net/download/prj/jsonxml/xml2json.js"></script>
        <script src="https://kit.fontawesome.com/a076d05399.js"></script>
        <script type="text/javascript">
            let data = {};
            let map, startPostion, endPosition;
            let startMarker, endMarker;
            let pathNewArray = [];
            let walkRoad = [];
            let rideRoad = [];
            let missingArr = [];
            let startIcon = 'data:image/png;base64,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'
            let endIcon = 'data:image/png;base64,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'
    
            let walkContent = "<div class='m-pop' style='display: flex; border-radius: 10px; font-size: 35px; color: white; width : 150px; height:70px; box-shadow: 5px 5px 5px #00000040; background-color: rgba(0, 0, 0, 0.6); align-items: center; justify-content: space-around;'>" +
                '<i class="fas fa-walking" style="font-size: 40px; color: white"></i><font style="">도보</font>' + '</div>'
    
            

            function getData(roadData) {
                data = roadData;
                initMap();
            }
    
            function initMap() {
                startPostion = data.LanePath.Node[0].GraphPos[0];
                endPosition = data.LanePath.Node[data.LanePath.Node.length - 1].GraphPos[data.LanePath.Node[data.LanePath.Node.length - 1].GraphPos.length - 1]
    
                let xx = (Number(startPostion.Y._cdata) + Number(endPosition.Y._cdata)) / 2;
                let yy = (Number(startPostion.X._cdata) + Number(endPosition.X._cdata)) / 2;

                map = new Tmapv2.Map("map_div", { // 지도가 생성될 div
                    center: new Tmapv2.LatLng(xx, yy),
                    width : "100vw", // 지도의 넓이
                    height : "100vh", // 지도의 높이
                    pinchZoom: true,
                });
                // map.setZoom(12.5);
                let latlngSW = new Tmapv2.LatLng(startPostion.Y._cdata, startPostion.X._cdata);
                let latlngNE = new Tmapv2.LatLng(endPosition.Y._cdata, endPosition.X._cdata);

                let latlngBound = new Tmapv2.LatLngBounds(latlngSW, latlngNE)
                map.fitBounds(latlngBound)
    
                // 시작점과 도착점의 마커 그리기
                startMarker = new Tmapv2.Marker({
                    position: new Tmapv2.LatLng( startPostion.Y._cdata, startPostion.X._cdata ), //Marker의 중심좌표 설정.
                    map: map, //Marker가 표시될 Map 설정..
                    icon: startIcon
                });
    
                endMarker = new Tmapv2.Marker({
                    position: new Tmapv2.LatLng( endPosition.Y._cdata, endPosition.X._cdata ), //Marker의 중심좌표 설정.
                    map: map, //Marker가 표시될 Map 설정..
                    icon: endIcon
                })
    
                //----------------------- pathNewArray 정의
                pathNewArray.push(data.path.Start);
                if(data.path.hasOwnProperty('Walk')) {
                    if(Array.isArray(data.path.Walk)) {
                        for(let i = 0; i<data.path.Walk.length; i++) {
                            pathNewArray.push(data.path.Walk[i])
                        }
                    } else {
                        pathNewArray.push(data.path.Walk)
                    }
                }
                if(data.path.hasOwnProperty('ExChange')) {
                    if(Array.isArray(data.path.ExChange)) {
                        for(let i = 0; i<data.path.ExChange.length; i++) {
                            pathNewArray.push(data.path.ExChange[i])
                        }
                    } else {
                        pathNewArray.push(data.path.ExChange)
                    }
                }
    
                // pathIndex에따라서 정열
                pathNewArray.sort((a, b) => {
                    return Number(a.pathIndex._text) - Number(b.pathIndex._text)
                })
    
                // missing 경로 index찾기
                let range = 0;
                for(let i = 0; i < pathNewArray.length; i++) {
                    let index = pathNewArray[i].pathIndex._text - range;
                    if(i != index) {
                        missingArr.push(i)
                        range = range + 1;
                    }
                }
                //-----------------------
    
                let walkPathArr = []
                for(let i = 0; i< pathNewArray.length; i++) {
                    if(pathNewArray[i].moveType._cdata === 'Walk') {
                        walkPathArr.push(i);
                    }
                }
    
                // missing 경로 그리기 - 언제나 Walk로
                // if(missingArr.length > 0) {
                //     for(let i = 0; i<missingArr.length; i++) {
                //         walkRoad.push(
                //             new Tmapv2.LatLng(
                //                 data.LanePath.Node[missingArr[i] - 1].GraphPos[data.LanePath.Node[missingArr[i] - 1].GraphPos.length - 1].Y._cdata,
                //                 data.LanePath.Node[missingArr[i] - 1].GraphPos[data.LanePath.Node[missingArr[i] - 1].GraphPos.length - 1].X._cdata,
                //             )
                //         )
                //         walkRoad.push(
                //             new Tmapv2.LatLng(
                //                 data.LanePath.Node[missingArr[i]].GraphPos[0].Y._cdata,
                //                 data.LanePath.Node[missingArr[i]].GraphPos[0].X._cdata,
                //             )
                //         )
                //     }
                //     let polylineMissingWalk = new Tmapv2.Polyline({
                //         path: walkRoad,
                //         strokeColor: "#404040",     // 라인 색상
                //         strokeWeight: 12,            // 라인 두께
                //         fillOpacity: 1,             // 라인 투명도
                //         strokeStyle: 'dot',         // 선의 종류
                //         outline: false,             // 외각 선을 설정
                //         map: map                    // 지도 객체
                //     });
                //     walkRoad = [];
                // }
    
                for(let i = 0; i<data.LanePath.Node.length; i++) {
                    if(walkPathArr.includes(i)) {
                        // 마지막 Walk에 대하여 팝업생성
                        if(i == data.LanePath.Node.length - 1) {
                            renderWalkPopup(
                                data.LanePath.Node[i-1].GraphPos[data.LanePath.Node[i-1].GraphPos.length - 1].X._cdata,
                                data.LanePath.Node[i-1].GraphPos[data.LanePath.Node[i-1].GraphPos.length - 1].Y._cdata,
                                walkContent
                            )
                        }
                        // 모든 Walk에 대하여 이전의 마지막점과 이어준다.
                        if(i <= data.LanePath.Node.length - 1 && i>0) {
                            walkRoad.push(
                                new Tmapv2.LatLng(
                                    data.LanePath.Node[i-1].GraphPos[data.LanePath.Node[i-1].GraphPos.length - 1].Y._cdata,
                                    data.LanePath.Node[i-1].GraphPos[data.LanePath.Node[i-1].GraphPos.length - 1].X._cdata
                                )
                            )
                        }
                        for(let k = 0; k < data.LanePath.Node[i].GraphPos.length; k++) {
                            let dot = new Tmapv2.LatLng(
                                data.LanePath.Node[i].GraphPos[k].Y._cdata,
                                data.LanePath.Node[i].GraphPos[k].X._cdata)
                            walkRoad.push(dot)
                            if(k == Math.floor((data.LanePath.Node[i].GraphPos.length) / 5) && i != data.LanePath.Node.length - 1) {
                                renderWalkPopup(
                                    data.LanePath.Node[i].GraphPos[k].X._cdata,
                                    data.LanePath.Node[i].GraphPos[k].Y._cdata,
                                    walkContent
                                )
                            }
                        }

                        // 마지막을 제외한 Walk에 대하여 다음의 첫점과 이어준다.
                        if(i<data.LanePath.Node.length - 1) {
                            walkRoad.push(
                                new Tmapv2.LatLng(
                                    data.LanePath.Node[i+1].GraphPos[0].Y._cdata,
                                    data.LanePath.Node[i+1].GraphPos[0].X._cdata
                                )
                            )
                        }
                        let polylineWalk = new Tmapv2.Polyline({
                            path: walkRoad,
                            strokeColor: "#404040",     // 라인 색상
                            strokeWeight: 12,            // 라인 두께
                            fillOpacity: 1,             // 라인 투명도
                            strokeStyle: 'dot',         // 선의 종류
                            outline: false,             // 외각 선을 설정
                            map: map                    // 지도 객체
                        });
                        walkRoad = []
                    } else {
                        for(let k = 0; k<data.LanePath.Node[i].GraphPos.length; k++) {
                            if(k == 0) {
    
                                if(pathNewArray[i].moveType._cdata == 'Bus') {
                                    renderWalkPopup(
                                        pathNewArray[i].kX._cdata,
                                        pathNewArray[i].kY._cdata,
                                        renderBusPopupContent(
                                            getColorFromBus(pathNewArray[i].lane.type._cdata),
                                            ConvNumToBusType(pathNewArray[i].lane.type._cdata),
                                            pathNewArray[i].lane.busNo._cdata
                                        )
                                    )
                                } else if(pathNewArray[i].moveType._cdata == 'Subway') {
                                    renderWalkPopup(
                                        pathNewArray[i].kX._cdata,
                                        pathNewArray[i].kY._cdata,
                                        renderSubwayPopupContent(
                                            setIconType(pathNewArray[i].laneAlias._cdata),
                                            getColorFromSubway(pathNewArray[i].laneAlias._cdata),
                                            getShortStrFromSubway(pathNewArray[i].laneAlias._cdata),
                                            pathNewArray[i].name._cdata
                                        )
                                    )
                                }
                            }
                            let dot = new Tmapv2.LatLng(
                                data.LanePath.Node[i].GraphPos[k].Y._cdata,
                                data.LanePath.Node[i].GraphPos[k].X._cdata)
                            rideRoad.push(dot)
                        }
                        let polylineRide = new Tmapv2.Polyline({
                            path: rideRoad,
                            strokeColor: "#FF0000",     // 라인 색상
                            strokeWeight: 12,            // 라인 두께
                            fillOpacity: 1,             // 라인 투명도
                            strokeStyle: 'solid',       // 선의 종류
                            outline: false,             // 외각 선을 설정
                            map: map                    // 지도 객체
                        });
                        rideRoad=[]
                    }
                }
            }
    
            function renderWalkPopup(x, y, content) {
                let infoWindow = new Tmapv2.InfoWindow({
                    position: new Tmapv2.LatLng(Number(y),Number(x)), //Popup 이 표출될 맵 좌표
                    content: content, //Popup 표시될 text
                    type: 2, //Popup의 type 설정.
                    border :'0px',
                    align: 15,
                    map: map //Popup이 표시될 맵 객체
                });
                return infoWindow
            }
    
            function renderBusPopupContent(color, typeTitle, busNum ) {
                let content = "<div class='m-pop' style='display: flex; align-items: center; justify-content: flex-start; border-radius: 10px; border: 2px solid #555555; font-size: 35px; background-color: white; padding: 5px; width: 200px'>" +
                        '<div style="background-color: '+color+'; color: white; border-radius: 10px; padding: 5px; width: 100px; text-align: center">' + '<font style="">' + typeTitle + '</font>' + '</div>' +
                        '<font style="color: blue; margin-left: 20px">'+busNum+'</font>' +
                    '</div>'
                return content;
            }
    
            function renderSubwayPopupContent(iconType, color, typeTitle, subwayTitle) {
                let content = "<div class='m-pop' style='display: flex; align-items: center; justify-content: flex-start; border-radius: 10px; border: 2px solid #555555; font-size: 35px; background-color: white; padding: 5px; width: 230px'>";
                if(iconType == 'str') {
                    content = content + '<div style="background-color: '+color+'; color: white; border-radius: 10px; padding: 5px; width: 100px; text-align: center">';
                } else {
                    content = content + '<div style="background-color: '+color+'; color: white; border-radius: 50px; width: 50px; height: 45px; text-align: center; align-items: center; margin-left: 10px; padding-top: 5px">';
                }
                content = content + typeTitle + '</div>' + '<font style="color: blue; margin-left: 20px">'+subwayTitle+'</font>' + '</div>';
                return content;
            }
    
            // 길찾기에서 아이콘 표시할때 형태규정 - 전철형태
            function setIconType(str) {
                if(str == '수도권 1호선' || str == '수도권 2호선' || str == '수도권 3호선' || str == '수도권 4호선' || str == '수도권 5호선' ||
                    str == '수도권 6호선' || str == '수도권 7호선' || str == '수도권 8호선' || str == '수도권 9호선' ||
                    str == '부산 1호선' || str == '부산 2호선' || str == '부산 3호선' || str == '부산 4호선' ||
                    str == '대구 1호선' || str == '대구 2호선' || str == '대전 1호선' || str == '광주 1호선' ) {
                    return 'num'
                } else {
                    return 'str'
                }
            }
    
            // 길찾기에서 전철유형에 따르는 축소글자 얻기
            function getShortStrFromSubway(str) {
                let shortStr = ''
                if (str == '수도권 1호선') shortStr = '1'
                else if (str == '수도권 2호선') shortStr = '2'
                else if (str == '수도권 3호선') shortStr = '3'
                else if (str == '수도권 4호선') shortStr = '4'
                else if (str == '수도권 5호선') shortStr = '5'
                else if (str == '수도권 6호선') shortStr = '6'
                else if (str == '수도권 7호선') shortStr = '7'
                else if (str == '수도권 8호선') shortStr = '8'
                else if (str == '수도권 9호선') shortStr = '9'
                else if (str == '인천 1호선') shortStr = '인천 1'
                else if (str == '인천 2호선') shortStr = '인천 2'
                else if (str == '인천 3호선') shortStr = '인천 3'
                else if (str == '인천 4호선') shortStr = '인천 4'
                else if (str == '분당선') shortStr = '분당'
                else if (str == '공항철도') shortStr = '공항'
                else if (str == '중앙선') shortStr = '주앙'
                else if (str == '경의중앙선' || str == '경의선') shortStr = '경의'
                else if (str == '경춘선') shortStr = '경춘'
                else if (str == '신분당선') shortStr = '신분당'
                else if (str == '의정부경전철') shortStr = '의정부'
                else if (str == '수인선') shortStr = '수인'
                else if (str == '부산 1호선') shortStr = '부산 1'
                else if (str == '부산 2호선') shortStr = '부산 2'
                else if (str == '부산 3호선') shortStr = '부산 3'
                else if (str == '부산 4호선') shortStr = '부산 4'
                else if (str == '부산 부산-김해경전철') shortStr = '부산-김해'
                else if (str == '대구 1호선') shortStr = '대구 1'
                else if (str == '대구 2호선') shortStr = '대구 2'
                else if (str == '대전 1호선') shortStr = '대전 1'
                else if (str == '광주 1호선') shortStr = '광주 1'
                else shortStr = '1'

                return shortStr
            }
    
            // 길찾기에서 전철유형에 따르는 색상표시
            function getColorFromSubway(str) {
                let color = ''
                if(str == '수도권 1호선') color = '#002F95'
                else if(str == '수도권 2호선') color = '#00B71E'
                else if(str == '수도권 3호선') color = '#FF8100'
                else if(str == '수도권 4호선') color = '#0F87CE'
                else if(str == '수도권 5호선') color = '#7A1ABA'
                else if(str == '수도권 6호선') color = '#B47221'
                else if(str == '수도권 7호선') color = '#4E6012'
                else if(str == '수도권 8호선') color = '#E61C86'
                else if(str == '수도권 9호선') color = '#AB8A3B'
                else if (str == '인천 1호선') color = '#6F97BF'
                else if (str == '인천 2호선') color = '#6F97BF'
                else if (str == '인천 3호선') color = '#6F97BF'
                else if (str == '인천 4호선') color = '#6F97BF'
                else if(str == '분당선') color = '#F5C70F'
                else if(str == '공항철도') color = '#2F64C8'
                else if(str == '중앙선') color = '#3FC0CD'
                else if(str == '경의선') color = '#3FC0CD'
                else if(str == '경춘선') color = '#3FC0CD'
                else if(str == '신분당선') color = '#D21246'
                else if(str == '의정부경전철') color = '#FF8E01'
                else if(str == '수인선') color = '#F5C70F'
                else if(str == '부산 1호선') color = '#FF7019'
                else if(str == '부산 2호선') color = '#00B71E'
                else if(str == '부산 3호선') color = '#C3A26C'
                else if(str == '부산 4호선') color = '#6f8cc0'
                else if(str == '부산 부산-김해경전철') color = '#772E91'
                else if(str == '대구 1호선') color = '#FF3219'
                else if(str == '대구 2호선') color = '#00B71E'
                else if(str == '대전 1호선') color = '#00B71E'
                else if(str == '광주 1호선') color = '#00B71E'
                else color = '#002F95'

                return color
    
            }
    
            // 길찾기에서 매 버스유형에 따르는 색상얻기 함수
            function getColorFromBus(num) {
                let color = ''
                if(num == '0') color = '#31BC31'
                else if(num == '1') color = '#31BC31'
                else if(num == '2') color = '#068ABA'
                else if(num == '3') color = '#FEB204'
                else if(num == '4') color = '#FD000C'
                else if(num == '5') color = '#1B1308'
                else if(num == '10') color = '#31BC31'
                else if(num == '11') color = '#0C479D'
                else if(num == '12') color = '#31BC31'
                else if(num == '13') color = '#FEB204'
                else if(num == '14') color = '#FD000C'
                else if(num == '15') color = '#FD000C'
                else if(num == '20') color = '#FD000C'
                else if(num == '21') color = '#1B1308'
                else if(num == '26') color = '#FD000C'
                else color = '#31BC31'

                return color
            }
    
            // 길찾기를 위한 버스유형정의 함수
            function ConvNumToBusType(num) {
                let name = ''
                if(num == '0') name = '기타'
                else if(num == '1') name = '일반'
                else if(num == '2') name = '좌석'
                else if(num == '3') name = '마을'
                else if(num == '4') name = '직행'
                else if(num == '5') name = '공항'
                else if(num == '10') name = '외곽'
                else if(num == '11') name = '간선'
                else if(num == '12') name = '지선'
                else if(num == '13') name = '순환'
                else if(num == '14') name = '광역'
                else if(num == '15') name = '급행'
                else if(num == '20') name = '농어촌'
                else if(num == '21') name = '시외'
                else if(num == '26') name = '급행간선'
                else name = '기타'
                return name;
            }
        </script>
    </head>
    <body onload="">
    <div id="map_div"></div>
    </body>
    </html>
    `
}

export default Html;