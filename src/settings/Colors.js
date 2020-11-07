const Colors = {
    black:          '#000000',
    white:          '#FFFFFF',
    blue:           '#0C479D',
    lightBlue:      '#B5C5DF',
    orange:         '#FF5425',
    green:          '#31BC31',
    red:            '#D40606',
    gray:           '#959595',
    yellow:         '#EFAD32',

    //선택색갈
    mainTabColor:   '#CCCCCC', // 메인바텀탭바에서 선택안되었을때 이용하는 색갈
    borderColor:    '#BBBBBB', // 레이아웃들의 테두리선, 보더선에서 이용하는 색갈
    fontColor:      '#353A50', // Default글꼴로 이용하는 색갈
    background:     '#EDEEF0', // Default배경색으로 이용하는 색갈
    stationInfo:    '#D2D2D2', // 정류소, 버스도착정보에 현시되는 정류소헤더부분 색갈
    redRoute:       '#FF0000', // 회차지방향 색갈
}

// 노선유형별 색상값 변환 함수
export function ConvColors(str, rgbType) {
    let colorType = ''
    if(rgbType == '1') {
        if(str == '11' || str == '14' || str == '16' || str == '21') colorType = '#FD000C'
        else if(str == '41' || str == '42' || str == '43') colorType = '#D7559F'
        else if(str == '51' || str == '52' || str == '53') colorType = '#474747'
        else if(str == '30') colorType = '#EFAD32'
        else if(str == '12') colorType = '#038BD4'
        else colorType = '#31BC31'
    } else {
        if(str == '11' || str == '14' || str == '16' || str == '21') colorType = '#F7230E'
        else if(str == '41' || str == '42' || str == '43') colorType = '#DC60A6'
        else if(str == '51' || str == '52' || str == '53') colorType = '#1B1308'
        else if(str == '30') colorType = '#FEB204'
        else if(str == '12') colorType = '#068ABA'
        else colorType = '#058763'
    }
    return colorType
}

// 혼잡도별 색상값 변환 함수
export function ConvDensityColor(str) {
    let densityColor = ''
    if(str == '') densityColor = ''
    else if(str == '1') densityColor = '#31BC31' // 녹색
    else if(str == '2') densityColor = '#038BD4' // 파랑
    else if(str == '3') densityColor = '#EFAD32' // 노랑
    else if(str == '4') densityColor = '#FD000C' // 빨강

    return densityColor
}

export default Colors;