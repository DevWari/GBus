import { Dimensions, Platform, StatusBar } from 'react-native';
import Colors from './Colors';

// 안드로이드에서 헤더바의 높이를 구하는 함수
export function getStatusBarHeight() {
    return Platform.OS == 'ios' ? 0 : StatusBar.currentHeight;
}

// 폰트 스타일 정의 함수
export function ConvStyle(size, color, fontfamily) {
    let style = {
        fontSize: size,
        color: color,
        fontFamily: 'THEjunggt' + fontfamily
    }
    return style
}

// 정류소를 경유하는 모든 노선 유형별 그룹함수
export function ConvGroup(data) {
    if (!data) {
        return []
    } else {
        let convData = {}
        for (let i = 0; i < data.length; i++) {
            let obj = data[i]
            if (convData[obj.routeTypeCd._text] === undefined) {
                convData[obj.routeTypeCd._text] = [obj.routeTypeCd._text]
            }
            convData[obj.routeTypeCd._text].push(obj)
        }
        let oldData = Object.values(convData)
        let newData = []
        for (let j = 0; j < oldData.length; j++) {
            let elementObj = {
                title: '',
                data: []
            }
            elementObj.title = oldData[j][0]
            elementObj.data = oldData[j].slice(1)
            newData.push(elementObj)
        }
        return MergeGroup(newData)
    }
}
// ConvData에서 Merge를 위한 함수
export function MergeGroup(array) {
    let newArr = [];
    
    for(let i = 0; i<array.length; i++) {
        if(array[i].title == '11' || array[i].title == '14' || array[i].title == '16' || array[i].title == '21') {
            if(newArr.some((element)=>element.title == '11')) {
                for(let j=0; j<newArr.length; j++) {
                    if(newArr[j].title == '11') {
                        newArr[j].data = [...newArr[j].data, ...array[i].data]
                    }
                }
            } else {
                newArr.push({
                    title: '11',
                    data: array[i].data
                })
            }
        } else if(array[i].title == '41' || array[i].title == '42' || array[i].title == '43') {
            if(newArr.some((element)=>element.title == '41')) {
                for(let j=0; j<newArr.length; j++) {
                    if(newArr[j].title == '41') {
                        newArr[j].data = [...newArr[j].data, ...array[i].data]
                    }
                }
            } else {
                newArr.push({
                    title: '41',
                    data: array[i].data
                })
            }
        } else if(array[i].title == '51' || array[i].title == '52' || array[i].title == '53') {
            if(newArr.some((element)=>element.title == '51')) {
                for(let j=0; j<newArr.length; j++) {
                    if(newArr[j].title == '51') {
                        newArr[j].data = [...newArr[j].data, ...array[i].data]
                    }
                }
            } else {
                newArr.push({
                    title: '51',
                    data: array[i].data
                })
            }
        } else if(array[i].title == '30') {
            newArr.push({
                title: '30',
                data: array[i].data
            })
        } else if(array[i].title == '12') {
            newArr.push({
                title: '12',
                data: array[i].data
            })
        } else {
            if(newArr.some((element)=>element.title == '100')) {
                for(let j=0; j<newArr.length; j++) {
                    if(newArr[j].title == '100') {
                        newArr[j].data = [...newArr[j].data, ...array[i].data]
                    }
                }
            } else {
                newArr.push({
                    title: '100',
                    data: array[i].data
                })
            }
        }
    }
    return newArr;
}

// 버스유형 문자변환 함수
export function ConvBusType(str) {
    let busType = ''
    if (str == '11' || str == '14' || str == '16' || str == '21') busType = '직행좌석'
    else if (str == '41' || str == '42' || str == '43') busType = '시외'
    else if (str == '51' || str == '52' || str == '53') busType = '공항'
    else if (str == '30') busType = '마을'
    else if (str == '12') busType = '좌석'
    else busType = '일반'
    return busType
}

// 혼잡도별 문자렬 변환 함수
export function ConvDensityTitle(str) {
    let densityStatus = ''
    if (str == '') densityStatus = ''
    else if (str == '1') densityStatus = '여유'
    else if (str == '2') densityStatus = '보통'
    else if (str == '3') densityStatus = '혼잡'
    else if (str == '4') densityStatus = '매우혼잡'
    return densityStatus
}

// 저상버스여부 확인 함수
export function ConvLowPlate(str) {
    let lowPlate = ''
    if (str == 0) lowPlate = '일반'
    else if (str == 1) lowPlate = '저상'
    else if (str == 2) lowPlate = '2층'
    else if (str == 7) lowPlate = '트롤리'
    return lowPlate
}

// 붙어잇는 문자렬을 날자로 변경하는 함수
export function ConvStrToDate(str) {
    let date = ''
    date = str.substr(0, 4) + "-" + str.substr(4, 2) + "-" + str.substr(6, 2) + " " + str.substr(8, 2) + ":00"
    return date
}

// 길찾기에서 이전 아이템의 색갈을 얻는 함수
export function getPrevColor(pathIndex, item) {
    // item.sort((a, b) => {
    //     return Number(a.pathIndex._text) - Number(b.pathIndex._text)
    // })
    for (let i = 0; i < item.length; i++) {
        if (Number(item[i].pathIndex._text) == pathIndex) {
            if (item[i - 1].moveType._cdata == 'Subway') {
                return getColorFromSubway(item[i - 1].laneAlias._cdata)
            } else {
                return getColorFromBus(item[i - 1].lane.type._cdata)
            }
        }
    }
}

export function getLastColor(item) {
    if (item[item.length - 1].moveType._cdata == 'Subway') {
        return getColorFromSubway(item[item.length - 1].laneAlias._cdata)
    } else if (item[item.length - 1].moveType._cdata == 'Bus') {
        return getColorFromBus(item[item.length - 1].lane.type._cdata)
    } else {
        return Colors.gray
    }
}

// 길찾기상세페이지에서 이전 아이템의 색갈을 얻는 데모함수
export function getPrevColorForDetail(pathIndex, item) {
    for (let i = 0; i < item.length; i++) {
        if (Number(item[i].pathIndex._text) == pathIndex) {
            if (item[i - 1].moveType._cdata == 'Subway') {
                return getColorFromSubway(item[i - 1].laneAlias._cdata)
            } else if (item[i - 1].moveType._cdata == 'Bus') {
                return getColorFromBus(item[i - 1].lane.type._cdata)
            } else {
                return Colors.gray
            }
        }
    }
}

// 현 지점이 승차점인가, 아니면 환승지점인가를 검사하는 함수
export function checkTransfer(index, item) {
    if (item[index - 1].moveType._cdata == 'Walk') return false
    else return true
}

// 길찾기에서 아이콘 표시할때 형태규정 - 전철형태
export function setIconType(str) {
    if (str == '수도권 1호선' || str == '수도권 2호선' || str == '수도권 3호선' || str == '수도권 4호선' || str == '수도권 5호선' ||
        str == '수도권 6호선' || str == '수도권 7호선' || str == '수도권 8호선' || str == '수도권 9호선' ||
        str == '부산 1호선' || str == '부산 2호선' || str == '부산 3호선' || str == '부산 4호선' ||
        str == '대구 1호선' || str == '대구 2호선' || str == '대전 1호선' || str == '광주 1호선') {
        return 'num'
    } else {
        return 'str'
    }
}

// 길찾기에서 전철유형에 따르는 축소글자 얻기
export function getShortStrFromSubway(str) {
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
export function getColorFromSubway(str) {
    let color = ''
    if (str == '수도권 1호선') color = '#002F95'
    else if (str == '수도권 2호선') color = '#00B71E'
    else if (str == '수도권 3호선') color = '#FF8100'
    else if (str == '수도권 4호선') color = '#0F87CE'
    else if (str == '수도권 5호선') color = '#7A1ABA'
    else if (str == '수도권 6호선') color = '#B47221'
    else if (str == '수도권 7호선') color = '#4E6012'
    else if (str == '수도권 8호선') color = '#E61C86'
    else if (str == '수도권 9호선') color = '#AB8A3B'
    else if (str == '인천 1호선') color = '#6F97BF'
    else if (str == '인천 2호선') color = '#6F97BF'
    else if (str == '인천 3호선') color = '#6F97BF'
    else if (str == '인천 4호선') color = '#6F97BF'
    else if (str == '분당선') color = '#F5C70F'
    else if (str == '공항철도') color = '#2F64C8'
    else if (str == '중앙선') color = '#3FC0CD'
    else if (str == '경의선' || str == '경의중앙선') color = '#3FC0CD'
    else if (str == '경춘선') color = '#3FC0CD'
    else if (str == '신분당선') color = '#D21246'
    else if (str == '의정부경전철') color = '#FF8E01'
    else if (str == '수인선') color = '#F5C70F'
    else if (str == '부산 1호선') color = '#FF7019'
    else if (str == '부산 2호선') color = '#00B71E'
    else if (str == '부산 3호선') color = '#C3A26C'
    else if (str == '부산 4호선') color = '#6f8cc0'
    else if (str == '부산 부산-김해경전철') color = '#772E91'
    else if (str == '대구 1호선') color = '#FF3219'
    else if (str == '대구 2호선') color = '#00B71E'
    else if (str == '대전 1호선') color = '#00B71E'
    else if (str == '광주 1호선') color = '#00B71E'
    else color = '#002F95'
    return color

}

// 길찾기에서 매 버스유형에 따르는 색상얻기 함수
export function getColorFromBus(num) {
    let color = ''
    if (num == '0') color = '#31BC31'
    else if (num == '1') color = '#31BC31'
    else if (num == '2') color = '#068ABA'
    else if (num == '3') color = '#FEB204'
    else if (num == '4') color = '#FD000C'
    else if (num == '5') color = '#1B1308'
    else if (num == '10') color = '#31BC31'
    else if (num == '11') color = '#0C479D'
    else if (num == '12') color = '#31BC31'
    else if (num == '13') color = '#FEB204'
    else if (num == '14') color = '#FD000C'
    else if (num == '15') color = '#FD000C'
    else if (num == '20') color = '#FD000C'
    else if (num == '21') color = '#1B1308'
    else if (num == '26') color = '#FD000C'
    else color = '#31BC31'

    return color
}

// 길찾기를 위한 버스유형정의 함수
export function ConvNumToBusType(num) {
    let name = ''
    if (num == '0') name = '기타'
    else if (num == '1') name = '일반'
    else if (num == '2') name = '좌석'
    else if (num == '3') name = '마을'
    else if (num == '4') name = '직행'
    else if (num == '5') name = '공항'
    else if (num == '10') name = '외곽'
    else if (num == '11') name = '간선'
    else if (num == '12') name = '지선'
    else if (num == '13') name = '순환'
    else if (num == '14') name = '광역'
    else if (num == '15') name = '급행'
    else if (num == '20') name = '농어촌'
    else if (num == '21') name = '시외'
    else if (num == '26') name = '급행간선'
    else name = '기타'
    return name;
}
const Constants = {
    WINDOW_WIDTH: Dimensions.get('window').width,
    WINDOW_HEIGHT: Dimensions.get('window').height,
    HEADER_BAR_HEIGHT: 70,
    BOTTOM_BAR_HEIGHT: 70,
    APP_KEY: '01ab749a-7332-4a8d-93ee-dc823cbe3de1',
    BIZ_APP_ID: 'f37db52749fe',
    COORD_TYPE: 'WGS84GEO',
    SERVICE_KEY: '1234567890'
}

export default Constants;