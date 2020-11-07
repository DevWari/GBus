const Html = {
	content: `<!DOCTYPE html>
	<html>
	
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>정류소 주변 정류소</title>
	
		<script src="https://apis.openapi.sk.com/tmap/jsv2?version=2&appKey=01ab749a-7332-4a8d-93ee-dc823cbe3de1"></script>
		<script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
		<script src="https://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js"></script>
		<script src="https://goessner.net/download/prj/jsonxml/xml2json.js"></script>
	
		<script type="text/javascript">
		let x = '';
		let y = '';
		let aroundStationAfterDrag = '';
		let markerPositions = [];
		let map, marker, myMarker, myBounds, toReactNative;

		let currentLocation = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAA+CAYAAACoegJmAAAABHNCSVQICAgIfAhkiAAABKFJREFUaEPFmtFV3EgQRa/kABZHYOZo/hciMI7AEMGaCBZHYIjAOALjCDyOwEMEi/9nzrARLASAtaek1li0uruqpQHrizNqlV6/rqpXVaJgxLWBvQd4W8BRDftiQv52pm5ruHW/LUv4NoObEa8Rm/ZrBX8BxwUc259qVgrYRQmfZg645XkTuA0cPcCHHjsW27E15w7knWYkCc4d3+cRTGnvvavh/RyuUguj4Daw/xO+AgfamybcP6/gIvZ8ENwGDn7Cd2BvwotNj9awmMNJaPEA3HMC6wG6quDUB/gInPiYYyznKH9I6ih+pYu9Gg6K1h3+MNHXLnpfwWV//SNwK/hqdP574LKEq1RqWLUp56yA1xaQJbyZwbJbuwUn6cKxlrRTw5cXcDYDNRV0hpzthYHJmwoOB+BW8N2QxwbUWxiRNc5lhJU/U8/UcNqlmIa5Fbwr4LPyoiQwST3Aqxlcx+wYAd5WMBMbHbhFAW9jRmv4Ng9IlsuFH0TSvLRzU8PlHL74Nl02EAajwVLDyRwWhdvNfwnW7kvY933MyPZNCSd+0KzhHJBNxa5PlQSSRFTRKkHsuqhaY9vLCKxbf1vCYX9zjhCpVF5FXtocrYC7KtpqI3iVMOvv3B3lxhoIsi6kAob3Hgq4ZSIP/ag8bdWMJjYp7G3rOu3EJOclwYUCYQ3in2M095F7aL4uKaVYN6zb/G3MkXaWa7ie/6qWm5+1d+eCM6lIaKtPAa4J6f7LlN1Gj0Bkbw7vMmxdCHNS3wdDOrJbceqkBEWY28qS3HfJ+J+US2nRelfBS2+3wuTHnFQCDBL5uj2RqB1RCQ2cREsjJR7ALPb6Yt7ZWYk8JSSzSSWalNSwnMObPjgXtaKPsQy/XR7yNcORUsJLYU6tSPwi0PmMNNaiLrGC4b6Gs1CHZSjP7ivYE+GXZiblmILlzsnYoMB0zx/XvY4fWL6ARagg1XzNyV2TE5uSad1WtVq9LxWGlNHmCtgPGk2yeusbNTHVc72HBODpmNnHGv6WvsMS5Z0bdczlpAdhTpobmXuoLMqxP8BHQwuwxV25IrgBZ/Q7f9OSvGWKJGnm2qvXxI9fix8au7l+dG+r7m33lVIKy1Hsas2gwXFBIf4gfvFbL8lv3Sn0+1ZLSnlS4H79+KjjX7eVarao7wqxL3P+OEJVi10BCdhpVKH/e2iQI1GoJeSnwDioHQcjsLENzFS0fpcn9kLzOZloZrV+U4HFJgrByeZzsxeqeoLMOcUY3cjkshhqBTob0YG10mznYoiuj7EWZe652EuxlgQnN5+avRRrKrgpHb527hprKjjHXnIKpYGI3XdjseQHO/Xblxu47FQ1Qh1ZaBMqOFdOaZPIHAKDk9LR4BzA6NgiB1noY0jseRNzO0wtg2FkamNmcC44kiMEjUEtdfjPZ4GbGByDkkjbTBY4x96YgvTfEg4srWQfcDa4McqRe5yq8Kcod8ohCdRSMWcf5yRwjj3t44osG3Wck8FZotciUTtLJb4h5TPR4LOUFp2TUknIeGjOYqk4LEBHRatv2BsImrVTA7gTcH3/G5s2Jgm/tkv33ztH/uRdey51/39y65RmMgFtNQAAAABJRU5ErkJggg==';
		let busMarker = 'data:image/png;base64,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';
		let redBus = 'data:image/png;base64,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';

		function setLocation(lat, lng) {
			x = lat;
			y = lng;
			initTmap();
		}

		// 페이지가 로딩이 된 후 호출하는 함수입니다.
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
				icon: busMarker
			});

			map.setZoom(18);
			map.addListener("zoom_changed", onChanged); // 지도의 줌 변경시, 이벤트 리스너 등록.
			map.addListener("dragend", onDragend); // 지도 드래그 끝났을 때, 이벤트 리스너 등록.
			map.addListener("touchend", onTouchend); // 모바일에서 지도 터치 터치가 끝났을때, 이벤트 리스너 등록.

			myBounds = map.getBounds();

			$.ajax({
				url: 'http://220.64.14.147/ws/rest/busstationservice/searcharound',
				type: 'GET',
				data: { serviceKey: '1234567890', x: x, y: y },
				success: function (data) {
					aroundStationAfterDrag = JSON.parse(xml2json(data, " "));
					console.log(aroundStationAfterDrag)
					if(aroundStationAfterDrag.response.msgHeader.resultCode === '0') {
						for (let i = 0; i < aroundStationAfterDrag.response.msgBody.busStationAroundList.length; i++) {
							marker = new Tmapv2.Marker({
								position: new Tmapv2.LatLng(
										aroundStationAfterDrag.response.msgBody.busStationAroundList[i].y,
										aroundStationAfterDrag.response.msgBody.busStationAroundList[i].x
								), //Marker의 중심좌표 설정.
								map: map, //Marker가 표시될 Map 설정..
								icon: busMarker
							});
							markerPositions.push(marker);
							aroundStationAfterDrag.response.msgBody.busStationAroundList[i].distance = Math.round(myMarker.getPosition().distanceTo(marker.getPosition())) + 'm'

							marker.addListener("click", function(evt) {
								console.log(aroundStationAfterDrag.response.msgBody.busStationAroundList[i].stationName +
										aroundStationAfterDrag.response.msgBody.busStationAroundList[i].distance)
							});
							marker.addListener("touchend", function (evt) {
								toReactNative={
									isMarkerClick : true,
									data: aroundStationAfterDrag.response.msgBody.busStationAroundList[i]
								}
								postMessageReactNative(JSON.stringify(toReactNative));
							});
						}
						toReactNative = {
							isMarkerClick: false,
							originalData: '1',
							data: aroundStationAfterDrag
						}
						postMessageReactNative(JSON.stringify(toReactNative));
					}
					else {
						toReactNative={
							isMarkerClick: false,
							originalData: '0',
							data: aroundStationAfterDrag.response.msgHeader.resultMessage
						}
						postMessageReactNative(JSON.stringify(toReactNative))
					}
				},
				error: function (request, error) {
					console.log("Request: "+JSON.stringify(request));
				}
			});
		}

		function onDragend(e) {
			let mapCenter = map.getCenter();
			if(map.getZoom() >= 18) {
				$.ajax({
					url: 'http://220.64.14.147/ws/rest/busstationservice/searcharound',
					type: 'GET',
					data: {
						serviceKey: '1234567890',
						x: mapCenter._lng, // 127....
						y: mapCenter._lat  // 37.....
					},
					success: function (data) {

						aroundStationAfterDrag = JSON.parse(xml2json(data, " "));
						if(markerPositions.length !== 0) {
							for(let j = 0; j<markerPositions.length; j++) {
								markerPositions[j].setMap(null);
							}
						}
						if(aroundStationAfterDrag.response.msgHeader.resultCode === '0') {
							for (let i = 0; i < aroundStationAfterDrag.response.msgBody.busStationAroundList.length; i++) {
								marker = new Tmapv2.Marker({
									position: new Tmapv2.LatLng(
											aroundStationAfterDrag.response.msgBody.busStationAroundList[i].y,
											aroundStationAfterDrag.response.msgBody.busStationAroundList[i].x
									), //Marker의 중심좌표 설정.
									map: map, //Marker가 표시될 Map 설정..
									icon: busMarker
								});
								aroundStationAfterDrag.response.msgBody.busStationAroundList[i].distance =
										Math.round(myMarker.getPosition().distanceTo(marker.getPosition())) >= 1000 ?
												Math.round(myMarker.getPosition().distanceTo(marker.getPosition())) / 1000 + 'km' :
												Math.round(myMarker.getPosition().distanceTo(marker.getPosition())) + 'm'
								markerPositions.push(marker)
								marker.addListener("click", function(evt) {
									console.log(aroundStationAfterDrag.response.msgBody.busStationAroundList[i].stationName +
											aroundStationAfterDrag.response.msgBody.busStationAroundList[i].distance)
								});
								marker.addListener("touchend", function (evt) {
									toReactNative={
										isMarkerClick : true,
										data: aroundStationAfterDrag.response.msgBody.busStationAroundList[i]
									}
									postMessageReactNative(JSON.stringify(toReactNative));
								});
							}
						} else {
							toReactNative={
								isMarkerClick: false,
								originalData: '0',
								data: aroundStationAfterDrag.response.msgHeader.resultMessage
							}
							postMessageReactNative(JSON.stringify(toReactNative))
						}
					},
					error: function (request, error) {
						console.log("Request: "+JSON.stringify(request));
					}
				});
			}
		}
		function onChanged(e) {
			let mapCenter = map.getCenter();
			if(map.getZoom() < 18) {
				for(let j = 0; j<markerPositions.length; j++) {
					markerPositions[j].setMap(null);
				}
			} else {
				$.ajax({
					url: 'http://220.64.14.147/ws/rest/busstationservice/searcharound',
					type: 'GET',
					data: {
						serviceKey: '1234567890',
						x: mapCenter._lng, // 127....
						y: mapCenter._lat  // 37.....
					},
					success: function (data) {

						aroundStationAfterDrag = JSON.parse(xml2json(data, " "));
						if(markerPositions.length !== 0) {
							for(let j = 0; j<markerPositions.length; j++) {
								markerPositions[j].setMap(null);
							}
						}

						if(aroundStationAfterDrag.response.msgHeader.resultCode === '0') {
							for (let i = 0; i < aroundStationAfterDrag.response.msgBody.busStationAroundList.length; i++) {
								marker = new Tmapv2.Marker({
									position: new Tmapv2.LatLng(
											aroundStationAfterDrag.response.msgBody.busStationAroundList[i].y,
											aroundStationAfterDrag.response.msgBody.busStationAroundList[i].x
									), //Marker의 중심좌표 설정.
									map: map, //Marker가 표시될 Map 설정..
									icon: busMarker,
								});
								aroundStationAfterDrag.response.msgBody.busStationAroundList[i].distance =
										Math.round(myMarker.getPosition().distanceTo(marker.getPosition())) >= 1000 ?
												Math.round(myMarker.getPosition().distanceTo(marker.getPosition())) / 1000 + 'km' :
												Math.round(myMarker.getPosition().distanceTo(marker.getPosition())) + 'm'
								markerPositions.push(marker)
								marker.addListener("click", function(evt) {
									console.log(aroundStationAfterDrag.response.msgBody.busStationAroundList[i].stationName +
											aroundStationAfterDrag.response.msgBody.busStationAroundList[i].distance)
								});
								marker.addListener("touchend", function (evt) {
									toReactNative={
										isMarkerClick : true,
										data: aroundStationAfterDrag.response.msgBody.busStationAroundList[i]
									}
									postMessageReactNative(JSON.stringify(toReactNative));
								});
							}

						} else {
							toReactNative={
								isMarkerClick: false,
								originalData: '0',
								data: aroundStationAfterDrag.response.msgHeader.resultMessage
							}
							postMessageReactNative(JSON.stringify(toReactNative))
						}
					},
					error: function (request, error) {
						console.log("Request: "+JSON.stringify(request));
					}
				});
			}
		}
		function onTouchend(e) {
			let mapCenter = map.getCenter();
			if(map.getZoom() >= 18) {
				$.ajax({
					url: 'http://220.64.14.147/ws/rest/busstationservice/searcharound',
					type: 'GET',
					data: {
						serviceKey: '1234567890',
						x: mapCenter._lng, // 127....
						y: mapCenter._lat  // 37.....
					},
					success: function (data) {

						aroundStationAfterDrag = JSON.parse(xml2json(data, " "));
						if(markerPositions.length !== 0) {
							for(let j = 0; j<markerPositions.length; j++) {
								markerPositions[j].setMap(null);
							}
						}
						if(aroundStationAfterDrag.response.msgHeader.resultCode === '0') {
							for (let i = 0; i < aroundStationAfterDrag.response.msgBody.busStationAroundList.length; i++) {
								marker = new Tmapv2.Marker({
									position: new Tmapv2.LatLng(
											aroundStationAfterDrag.response.msgBody.busStationAroundList[i].y,
											aroundStationAfterDrag.response.msgBody.busStationAroundList[i].x
									), //Marker의 중심좌표 설정.
									map: map, //Marker가 표시될 Map 설정..
									icon: busMarker
								});
								aroundStationAfterDrag.response.msgBody.busStationAroundList[i].distance =
										Math.round(myMarker.getPosition().distanceTo(marker.getPosition())) >= 1000 ?
												Math.round(myMarker.getPosition().distanceTo(marker.getPosition())) / 1000 + 'km' :
												Math.round(myMarker.getPosition().distanceTo(marker.getPosition())) + 'm'
								markerPositions.push(marker)
								marker.addListener("click", function(evt) {
									console.log(aroundStationAfterDrag.response.msgBody.busStationAroundList[i].stationName +
											aroundStationAfterDrag.response.msgBody.busStationAroundList[i].distance)
								});
								marker.addListener("touchend", function (evt) {
									toReactNative={
										isMarkerClick : true,
										data: aroundStationAfterDrag.response.msgBody.busStationAroundList[i]
									}
									postMessageReactNative(JSON.stringify(toReactNative));
								});
							}
						} else {
							toReactNative={
								isMarkerClick: false,
								originalData: '0',
								data: aroundStationAfterDrag.response.msgHeader.resultMessage
							}
							postMessageReactNative(JSON.stringify(toReactNative))
						}
					},
					error: function (request, error) {
						console.log("Request: "+JSON.stringify(request));
					}
				});
			}
		}

		function postMessageReactNative(text) {
			try{
				window.ReactNativeWebView.postMessage(text);
			} catch (e) {console.log(e)}
		}

		function fitBounds(x, y) {
			let zoomLevel = map.getZoom();
			let latlngSW = new Tmapv2.LatLng(y + 0.002, x - 0.002);
			let latlngNE = new Tmapv2.LatLng(y - 0.002, x  + 0.002);
			let latlngBound = new Tmapv2.LatLngBounds(latlngSW, latlngNE)
			map.fitBounds(latlngBound)

			myMarker.setMap(null)

			myMarker = new Tmapv2.Marker({
				position: new Tmapv2.LatLng(y,x), //Marker의 중심좌표 설정.
				map: map, //Marker가 표시될 Map 설정..
				icon: currentLocation,
				iconSize: new Tmapv2.Size(50, 80),
			});

			$.ajax({
				url: 'http://220.64.14.147/ws/rest/busstationservice/searcharound',
				type: 'GET',
				data: { serviceKey: '1234567890', x: x, y: y },
				success: function (data) {
					aroundStationAfterDrag = JSON.parse(xml2json(data, " "));

					if(aroundStationAfterDrag.response.msgHeader.resultCode === '0') {
						for (let i = 0; i < aroundStationAfterDrag.response.msgBody.busStationAroundList.length; i++) {
							marker = new Tmapv2.Marker({
								position: new Tmapv2.LatLng(
										aroundStationAfterDrag.response.msgBody.busStationAroundList[i].y,
										aroundStationAfterDrag.response.msgBody.busStationAroundList[i].x
								), //Marker의 중심좌표 설정.
								map: map, //Marker가 표시될 Map 설정..
								icon: busMarker
							});
							markerPositions.push(marker);
							aroundStationAfterDrag.response.msgBody.busStationAroundList[i].distance = Math.round(myMarker.getPosition().distanceTo(marker.getPosition())) + 'm'
							marker.addListener("click", function(evt) {
								console.log(aroundStationAfterDrag.response.msgBody.busStationAroundList[i].stationName +
										aroundStationAfterDrag.response.msgBody.busStationAroundList[i].distance)
							});
							marker.addListener("touchend", function (evt) {
								toReactNative={
									isMarkerClick : true,
									data: aroundStationAfterDrag.response.msgBody.busStationAroundList[i]
								}
								postMessageReactNative(JSON.stringify(toReactNative));
							});
						}
						toReactNative = {
							isMarkerClick: false,
							originalData: '1',
							data: aroundStationAfterDrag
						}
						postMessageReactNative(JSON.stringify(toReactNative));
					} else {
						toReactNative={
							isMarkerClick: false,
							originalData: '0',
							data: aroundStationAfterDrag.response.msgHeader.resultMessage
						}
						postMessageReactNative(JSON.stringify(toReactNative))
					}
				},
				error: function (request, error) {
					console.log("Request: "+JSON.stringify(request));
				}
			});
		}

	</script>
	</head>
	
	<!-- 맵 생성 실행 -->
	<div id="map_div"></div>
	
	</html>`
}

export default Html
