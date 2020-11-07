const data = {
	"response": {
		"comMsgHeader": "",
		"msgHeader": {
			"queryTime": "2020-08-28 12:25:55.514",
			"resultCode": "0",
			"resultMessage": "정상적으로 처리되었습니다."
		},
		"msgBody": {
			"busLocationList": [
				{
					"crowded": "1",
					"density": "1",
					"endBus": "0",
					"garageFlag": "N",
					"garageTurnFlag": "N",
					"lowPlate": "0",
					"plateNo": "경기73바3125",
					"plateType": "3",
					"remainSeatCnt": "0",
					"routeId": "216000007",
					"sepFlag": "Y",
					"stateCd": "2",
					"stationId": "216000306",
					"stationSeq": "3",
					"suddenEntry": "1"
				},
				{
					"crowded": "1",
					"density": "1",
					"endBus": "0",
					"garageFlag": "N",
					"garageTurnFlag": "N",
					"lowPlate": "0",
					"plateNo": "경기73바3128",
					"plateType": "3",
					"remainSeatCnt": "0",
					"routeId": "216000007",
					"sepFlag": "Y",
					"stateCd": "2",
					"stationId": "217000140",
					"stationSeq": "9",
					"suddenEntry": "1"
				},
				{
					"crowded": "1",
					"density": "1",
					"endBus": "0",
					"garageFlag": "N",
					"garageTurnFlag": "N",
					"lowPlate": "0",
					"plateNo": "경기73바3039",
					"plateType": "3",
					"remainSeatCnt": "0",
					"routeId": "216000007",
					"sepFlag": "Y",
					"stateCd": "2",
					"stationId": "224000502",
					"stationSeq": "37",
					"suddenEntry": "1"
				},
				{
					"crowded": "1",
					"density": "1",
					"endBus": "0",
					"garageFlag": "N",
					"garageTurnFlag": "N",
					"lowPlate": "0",
					"plateNo": "경기73바3066",
					"plateType": "3",
					"remainSeatCnt": "0",
					"routeId": "216000007",
					"sepFlag": "Y",
					"stateCd": "1",
					"stationId": "217000395",
					"stationSeq": "59",
					"suddenEntry": "2"
				},
				{
					"crowded": "1",
					"density": "1",
					"endBus": "0",
					"garageFlag": "N",
					"garageTurnFlag": "N",
					"lowPlate": "0",
					"plateNo": "경기73바3072",
					"plateType": "3",
					"remainSeatCnt": "0",
					"routeId": "216000007",
					"sepFlag": "Y",
					"stateCd": "2",
					"stationId": "217000388",
					"stationSeq": "110",
					"suddenEntry": "1"
				},
				{
					"crowded": "1",
					"density": "1",
					"endBus": "0",
					"garageFlag": "N",
					"garageTurnFlag": "N",
					"lowPlate": "0",
					"plateNo": "경기73바3079",
					"plateType": "3",
					"remainSeatCnt": "0",
					"routeId": "216000007",
					"sepFlag": "Y",
					"stateCd": "0",
					"stationId": "224000567",
					"stationSeq": "134",
					"suddenEntry": "1"
				}
			]
		}
	}
}

export default data.response.msgBody.busLocationList;