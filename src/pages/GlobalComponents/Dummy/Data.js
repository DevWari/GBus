import Colors from '../../../settings/Colors';

const data = {
    favorStation: [
        {
            ix: 1,
            type: 'station',
            title: '의왕 현대아파트 앞',
            direct: '강신중학교 방면',
            memo: '출근',
            route: [
                {
                    ix: 1,
                    num: '1007',
                    time1: '5분',
                    time2: '23분',
                    direct: '강변역(B) 방면',
                    color: Colors.orange,
                    busInfo: [
                        {
                            ix: 1,
                            num: 2,
                            status: '여유',
                            type: '저상',
                            color: Colors.green
                        },
                        {
                            ix: 2,
                            num: 13,
                            status: '노선이탈',
                            type: '저상',
                            color: Colors.red
                        }
                    ]
                },
                {
                    ix: 2,
                    num: '7770',
                    time1: '잠시후 도착',
                    time2: '17분',
                    direct: '의왕시청 방면',
                    color: Colors.green,
                    busInfo: [
                        {
                            ix: 1,
                            num: 1,
                            status: '23석',
                            type: '2층',
                            color: Colors.green
                        },
                        {
                            ix: 2,
                            num: 8,
                            status: '여유',
                            type: '저상',
                            color: Colors.green
                        }
                    ]
                }
            ]
        },
        {
            ix: 2,
            type: 'station',
            title: '광명 철산 아파트 사거리',
            direct: '하안동 방면',
            memo: '퇴근',
            route: [
                {
                    ix: 1,
                    num: '100-1',
                    time1: '도착정보없음',
                    time2: '',
                    direct: '하안동 방면',
                    color: Colors.orange,
                    busInfo: null
                }
            ]
        },
        {
            ix: 3,
            type: 'route',
            num: '7770',
            color: Colors.orange,
            routeType: '직행좌석',
            memo: ''
        },
        {
            ix: 4,
            type: 'route',
            num: '100-1',
            color: Colors.green,
            routeType: '일반버스',
            memo: ''
        },
        {
            ix: 5,
            type: 'route',
            num: '100-2',
            color: Colors.green,
            routeType: '마을버스',
            memo: ''
        },
        
        
    ],
}

export default data;