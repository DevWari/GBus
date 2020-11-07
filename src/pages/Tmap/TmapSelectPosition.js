const Html = {
    content: `<!DOCTYPE html>
    <html>
    
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>출, 도착지 선택</title>
    
        <script src="https://apis.openapi.sk.com/tmap/jsv2?version=2&appKey=01ab749a-7332-4a8d-93ee-dc823cbe3de1"></script>
        <script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
        <script src="https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js"></script>
        <script src="https://goessner.net/download/prj/jsonxml/xml2json.js"></script>
        <script type="text/javascript">
            let x = '',y = '';
            let map, myMarker, selMarker, toReactNative;
            let arrResult, newRoadAddr, newRoadAddrName, lastLegal; 
            let currentLocation = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAA+CAYAAACoegJmAAAABHNCSVQICAgIfAhkiAAABKFJREFUaEPFmtFV3EgQRa/kABZHYOZo/hciMI7AEMGaCBZHYIjAOALjCDyOwEMEi/9nzrARLASAtaek1li0uruqpQHrizNqlV6/rqpXVaJgxLWBvQd4W8BRDftiQv52pm5ruHW/LUv4NoObEa8Rm/ZrBX8BxwUc259qVgrYRQmfZg645XkTuA0cPcCHHjsW27E15w7knWYkCc4d3+cRTGnvvavh/RyuUguj4Daw/xO+AgfamybcP6/gIvZ8ENwGDn7Cd2BvwotNj9awmMNJaPEA3HMC6wG6quDUB/gInPiYYyznKH9I6ih+pYu9Gg6K1h3+MNHXLnpfwWV//SNwK/hqdP574LKEq1RqWLUp56yA1xaQJbyZwbJbuwUn6cKxlrRTw5cXcDYDNRV0hpzthYHJmwoOB+BW8N2QxwbUWxiRNc5lhJU/U8/UcNqlmIa5Fbwr4LPyoiQwST3Aqxlcx+wYAd5WMBMbHbhFAW9jRmv4Ng9IlsuFH0TSvLRzU8PlHL74Nl02EAajwVLDyRwWhdvNfwnW7kvY933MyPZNCSd+0KzhHJBNxa5PlQSSRFTRKkHsuqhaY9vLCKxbf1vCYX9zjhCpVF5FXtocrYC7KtpqI3iVMOvv3B3lxhoIsi6kAob3Hgq4ZSIP/ag8bdWMJjYp7G3rOu3EJOclwYUCYQ3in2M095F7aL4uKaVYN6zb/G3MkXaWa7ie/6qWm5+1d+eCM6lIaKtPAa4J6f7LlN1Gj0Bkbw7vMmxdCHNS3wdDOrJbceqkBEWY28qS3HfJ+J+US2nRelfBS2+3wuTHnFQCDBL5uj2RqB1RCQ2cREsjJR7ALPb6Yt7ZWYk8JSSzSSWalNSwnMObPjgXtaKPsQy/XR7yNcORUsJLYU6tSPwi0PmMNNaiLrGC4b6Gs1CHZSjP7ivYE+GXZiblmILlzsnYoMB0zx/XvY4fWL6ARagg1XzNyV2TE5uSad1WtVq9LxWGlNHmCtgPGk2yeusbNTHVc72HBODpmNnHGv6WvsMS5Z0bdczlpAdhTpobmXuoLMqxP8BHQwuwxV25IrgBZ/Q7f9OSvGWKJGnm2qvXxI9fix8au7l+dG+r7m33lVIKy1Hsas2gwXFBIf4gfvFbL8lv3Sn0+1ZLSnlS4H79+KjjX7eVarao7wqxL3P+OEJVi10BCdhpVKH/e2iQI1GoJeSnwDioHQcjsLENzFS0fpcn9kLzOZloZrV+U4HFJgrByeZzsxeqeoLMOcUY3cjkshhqBTob0YG10mznYoiuj7EWZe652EuxlgQnN5+avRRrKrgpHb527hprKjjHXnIKpYGI3XdjseQHO/Xblxu47FQ1Qh1ZaBMqOFdOaZPIHAKDk9LR4BzA6NgiB1noY0jseRNzO0wtg2FkamNmcC44kiMEjUEtdfjPZ4GbGByDkkjbTBY4x96YgvTfEg4srWQfcDa4McqRe5yq8Kcod8ohCdRSMWcf5yRwjj3t44osG3Wck8FZotciUTtLJb4h5TPR4LOUFp2TUknIeGjOYqk4LEBHRatv2BsImrVTA7gTcH3/G5s2Jgm/tkv33ztH/uRdey51/39y65RmMgFtNQAAAABJRU5ErkJggg=='
            let selLocation = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAABoCAYAAAC+NNNnAAAABHNCSVQICAgIfAhkiAAAB4tJREFUeF7tXNt1E0kQreqZEbZ+lo1gTQTrjQATwZoIwBFgIlgcASYCTASYCJAjwESAN4I1P7aQ1F2cmocYjXqmq1ojIc5KPz7Hqn7crupbj+4WQo8fAjicGvMYAQ4A8ZCIDhDxoD4EEd0g4g0QXSPidWLtFQLc9DUNXLUjBjEz5hkAPAfEhzH95SABLlPn3qwKLhrQLEmeEYMAOIoB0dFmBNaeZQCjmH7VgKYAR2TMa0Q8jBlQ0WaUWnui1ZgYEAE8nBnzDyCeKia1uijRq8y5M2lHIkDlZn+7Aa14501E15lzTyXaCgIqN/3H2A0vXdmgHNFt6twTBLjuku0ENEuS5wTwNjjYpgQEoFoB5ZpJkk+bmqt4nAAoL6CtMbM2lAWoRwhw2xRZAsRsNjXm44oEcEVEl+hcbu9pafczgJzqyRj++xwR/xRrZllwlFn7JAhoasw5IL5QD0T0lQCYYi98K+frjwAOZsawcz4FxN8ixjzLnHtVb7egIXaakCQfYzpOnTuXAmn2X1rFOSJyCCX/FKb3V53OFwBNjPmkMjWir6lzRyEqlc4wZ1UithCNthZMbw5IS9FE9Dlz7lji7KSA8v1VBLsjFShrn1Sx3xzQtDA1WaBZaOawbzAVcC0oIno3cI73IuSAtD4ntZbtttVjl3siTyk8JnxJRKPMuXdde05rMam1TOOchgComI1oiVnqJjXlALZgre7ciOiWWXHg3Js2k5wYcyElCiJ6OSiICWBizJdmZukdpDC1A9/K5tF4knCYdKzaM0QXA+dOWmk9Sb5I+uMAdsCMpzG3ahV8A0yT5L0WzHzPdIDSWE9q7e84MeYUEV9LViFv4Ak3psa8AkQ2tegPWvs0Bbj0+ChxTMl9oGIFrjJrl1iwTPy+BPdMACrXFQbOPfKJTYzhwsofwdUiOsNpknDu/jgk3GZuGg2HxkCAk9Tai6acdNGZvtnkZIRQc171AdXRRQequj9pMKfUpK9YQxRaufz7FkDi9oJBKqZa0pA8xpQDaiUE6YIIALFIZu1SSiMNmnlBxBr6RQB9FgPakMl9Hji3VO+TaggAcpMTsVwHIFl7gcn1RQqiCW2EtlucqyKmk2uojYFKx3qjyl882iKifwfOLZxUVGJS11L5IXFEW4Xozfn04Vz7CH0gjxQ0cVhH6qAwi2X99NRvEcvJnRZARz2MZxkFqgNMXhUSpg88fp54ahu1MVG17DOAY2cMV3A6g0neM8a5U1+EXfWlKguUTrnIWJXevs3e67ZUptDH5bFkXlDkwgoAXBvnLruAsKw2Bee+2YdVgETUPZ+woGgucDutIqptUPZSWU6VgouTvHWDysEY816bX1WpR1TVpw4KEV/6cpgYDU2MeYGI5zFtq1jzR13OmNtY50hEF3xsGFunK4mJCyyyumADcbV/+N/1QiPn83/HrE5NY+dpUW/rPGWr5MujTtZKXiSM/hC9yZzLz36jS8Fdg1f3DogLf+WRylzemCPWCGtDVDoToKyz7hxQWVf7T9B+u0SIvmbOzYuai8cpSbK62W0YbtPRLwDSOrMNz907XNPJLwD65cyuYW4LpFDBn/5KZldjt2r+0RWWbTA3X37mPdYXl15/LipvaboNkD622zC4trJx28ULPuvZXp/kIYPWPVR9EZV9bkpLHVlu110fVfq7KSzQcYrope36xLZSSx6qrs+583pZTOa4bk21ldKCe6jmaHXp+RoRhQo0QZNjgW3SUkg7IkA5KGlB/ydrRw5IU4xcEyiJdsSAWPCnMl6A2cQsVxfUVlh7U1TA7zTHCV5zrjeQHq/3BoY7CtwtWglQX2dBUsBdZ0Ztfag0VO6ljUXikhr6ShqqBa6yqypSVfjlvPlOqEu1hjblbKU03YuG1k7jSiKIou3mSqyLIJgIsuKcZ+nWfMjcVI7V11kfh8VL/bbcKZKAWRlQvp/6jfM+ZNaqrnj2toeqjsrr/texRzHzCSkjgt78kK8j1dWAlpnE+BxfV1G03bKf+F3q8msTREBj8iZkbdvCrmxqVce9AfKaXpIApukCCJpMOD778b+eTK13QKVvWgiL8MGDJY3kWprN5v/vy9TWAqjJej5A4BzQdFqYYO3NgpSWQ3K9mVyN9fi9a347ywuIgXz7ll/CyIqnOlEOdK0s1+ycr8dQkrzvAhR6EBLSxEYB5abH93329rxP39x4nD+8iJ10V7veTa4+2Gw49F6hTu/u1jbu2jpmYDtAPdjgTkOaRdyZnGa12oJcbR+cqbrh8AURSW5OtcmEf56D6CIdj99p56feQ7PhkN/36F4Ea2dVyTt3ko7HS++JevVDs+GQQxXNS+BYOBzsfUjv71UZbIyGZO+N4mHMWxLRVXZ/LzHtH9G7dtzZ/v4lIK52UVA4KAGcZXd3C6/xQ03VGqIsO7RpyqDCj/xCo3d8z9phc9NG42pAC2nC3l7nb/sgovenDIho6Ycd6tiy8TjMgn3RtmbRd45Vs1o7DfWwWjuT62ERo1lOMvZOQ5JVCsjsNKRZxP+FycUEnJpFXKvJTff3R4i48FsNMQHn1gDi7NYOh+f8Di+fFOJIGz1rwLDsd6BFRhVyxXMXAAAAAElFTkSuQmCC'
    
            function setMapCenter(lat, lng) {
                x = lat;
                y = lng;
                initTmap()
            }
            function initTmap() {
                // map 생성
                // Tmapv2.Map을 이용하여, 지도가 들어갈 div, 넓이, 높이를 설정합니다.
                map = new Tmapv2.Map("map_div", { // 지도가 생성될 div
                    center: new Tmapv2.LatLng(y, x),
                    width : "100vw", // 지도의 넓이
                    height : "100vh", // 지도의 높이
                    pinchZoom: true,
                });
                
                myMarker = new Tmapv2.Marker({
                    position: new Tmapv2.LatLng(y,x), //Marker의 중심좌표 설정.
                    map: map, //Marker가 표시될 Map 설정..
                    icon: currentLocation,
                    iconSize: new Tmapv2.Size(40, 70),
                });
    
                selMarker = new Tmapv2.Marker({
                    icon: selLocation,
                    iconSize: new Tmapv2.Size(40, 80),
                    map: map
                })

                // 초기 중심좌표에 대한 상세정보표기
                reverseGeo(x, y)

                map.addListener("touchstart", function onClick(evt){
                    let mapLatLng = evt.latLng;

                    // 기존 마커 삭제
                    selMarker.setMap(null);
                    myMarker.setMap(null);

                    let markerPosition = new Tmapv2.LatLng(mapLatLng._lat, mapLatLng._lng);

                    // 마커 올리기
                    selMarker = new Tmapv2.Marker(
                        {
                            position: markerPosition,
                            icon: selLocation,
                            iconSize: new Tmapv2.Size(40, 80),
                            map: map
                        }
                    )
                    reverseGeo(mapLatLng._lng, mapLatLng._lat);
                })
            }

            function reverseGeo(lon, lat) {
                $.ajax({
                    method: 'GET',
                    url: 'https://apis.openapi.sk.com/tmap/geo/reversegeocoding?version=1&format=json&callback=result',
                    async: false,
                    data: {
                        'appKey': '01ab749a-7332-4a8d-93ee-dc823cbe3de1',
                        'coordType': 'WGS84GEO',
                        'addressType': 'A10',
                        "lon" : lon,
                        "lat" : lat
                    },
                    success: function(response) {
                        if(response === undefined) {
                            toReactNative = {
                                isSel: false,
                                data: '현재위치를 확정할수 없습니다.'
                            }
                            postMessageReactNative(JSON.stringify(toReactNative))
                        } else {
                            arrResult = response.addressInfo;
        
                            //법정동 마지막 문자
                            lastLegal = arrResult.legalDong
                                .charAt(arrResult.legalDong.length - 1);
        
                            // 새주소
                            newRoadAddr = arrResult.city_do + ' '
                                + arrResult.gu_gun;
        
                            if (arrResult.eup_myun === '' && (lastLegal === "읍" || lastLegal === "면")) {//읍면
                                newRoadAddr += ' '+arrResult.legalDong;
                            } else {
                                newRoadAddr += ' '+arrResult.eup_myun;
                            }
                            newRoadAddr += arrResult.roadName + ' '
                                + arrResult.buildingIndex;
        
                            newRoadAddrName = arrResult.adminDong + ' ' + arrResult.bunji;
                            
                            toReactNative={
                                isSel: true,
                                data: {
                                    poiName: newRoadAddr,
                                    poiAddress: newRoadAddrName,
                                    x: lon,
                                    y: lat,
                                    poiBuildingName: arrResult.buildingName,
                                    poiNameDemo: arrResult.city_do + ' ' + arrResult.gu_gun + ' ' + arrResult.adminDong
                                }
                            }
                            postMessageReactNative(JSON.stringify(toReactNative))
                        }
                    },
                    error : function(request, status, error) {
                        if(request.status !== 200) {
                            console.log(JSON.parse(request.responseText).error.message)
                            toReactNative={
                                isSel: false,
                                data: JSON.parse(request.responseText).error.message
                            }
                            postMessageReactNative(JSON.stringify(toReactNative))
                        }
    
                    }
                })
            }

            function fitBounds(x, y) {
                let zoomLevel = map.getZoom();
                let latlngSW = new Tmapv2.LatLng(y + 0.002, x - 0.002);
                let latlngNE = new Tmapv2.LatLng(y - 0.002, x  + 0.002);
                let latlngBound = new Tmapv2.LatLngBounds(latlngSW, latlngNE)
                map.fitBounds(latlngBound)
    
                myMarker.setMap(null);
                selMarker.setMap(null);
    
                myMarker = new Tmapv2.Marker({
                    position: new Tmapv2.LatLng(y,x), //Marker의 중심좌표 설정.
                    map: map, //Marker가 표시될 Map 설정..
                    icon: currentLocation,
                    iconSize: new Tmapv2.Size(40, 70),
                });
            }
    
            function postMessageReactNative(text) {
                try{
                    window.ReactNativeWebView.postMessage(text);
                } catch (e) {console.log(e)}
            }
    
        </script>
    </head>
    
    <body onload="">
    <!-- 맵 생성 실행 -->
    <div id="map_div"></div>
    </body>
    
    </html>`
}

export default Html