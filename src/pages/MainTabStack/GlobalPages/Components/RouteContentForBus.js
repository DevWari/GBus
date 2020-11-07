// 정류소에서 매 노선에 해당하여 2대 버스의 현재 상황을 알려주기 위한 Component
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Colors, { ConvColors, ConvDensityColor } from '../../../../settings/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IoIcon from 'react-native-vector-icons/Ionicons';
import fontStyles from '../../../../settings/FontStyle/BusItemStyle';
import fontStylesForBus from '../../../../settings/FontStyle/BusRouteStyle';
import Constants, { ConvStyle, ConvDensityTitle, ConvLowPlate } from '../../../../settings/Constants';

let assetRoute = '../../../../../assets/global/';

export function Status({ color, title }) {
    return (
        <View style={{ ...styles.status, borderColor: color }}>
            <Text style={fontStyles.default}>{title}</Text>
        </View>
    )
}
export function RenderItemFirst({ data }) {
    let assetRoute = '../../../../../assets/global/';
    if (!data) {
        return null
    }
    return (
            <View style={styles.container}>
                <Icon name="directions-bus" size={25} color={ConvColors(data.routeTypeCd._text, '1')} />
                <View style={styles.content}>
                    <View style={{ width: 70 }}>
                        <Text numberOfLines={1} style={ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.blue, 150 )}>{data.locationNo1._text}번째 전</Text>
                    </View>
                    {
                        data.remainSeatCnt1._text == '-1' ? null :
                            <Status
                                color={ data.remainSeatCnt1._text == '0' ? ConvDensityColor(data.density1._text) : ConvDensityColor('3') }
                                title={ data.remainSeatCnt1._text == '0' ? ConvDensityTitle(data.density1._text) : data.remainSeatCnt1._text + '석' } />   
                    }
                    <Text numberOfLines={1} style={ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.fontColor, 150 )}>
                        { ConvLowPlate(data.lowPlate1._text) }
                    </Text>
                </View>
                <TouchableOpacity style={styles.alarm}>
                    <IoIcon name="notifications" size={20} color={Colors.borderColor} />
                </TouchableOpacity>
            </View>
    )
}
export function RenderItemSecond({ data }) {
    let assetRoute = '../../../../../assets/global/';
    if (!data) {
        return null
    }
    return (
            <View style={styles.container}>
                <Icon name="directions-bus" size={25} color={ConvColors(data.routeTypeCd._text, '1')} />
                <View style={styles.content}>
                    <View style={{ width: 70 }}>
                        <Text numberOfLines={1} style={ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.blue, 150 )}>{data.locationNo2._text}번째 전</Text>
                    </View>
                    {
                        data.remainSeatCnt2._text == '-1' ? null :
                            <Status
                                color={ data.remainSeatCnt2._text == '0' ? ConvDensityColor(data.density2._text) : ConvDensityColor('3') }
                                title={ data.remainSeatCnt2._text == '0' ? ConvDensityTitle(data.density2._text) : data.remainSeatCnt2._text + '석' } />
                    }   
                    <Text numberOfLines={1} style={ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.fontColor, 150 )}>
                        { ConvLowPlate(data.lowPlate2._text) }
                    </Text>
                </View>
                <TouchableOpacity style={styles.alarm}>
                    <IoIcon name="notifications" size={20} color={Colors.borderColor} />
                </TouchableOpacity>
            </View>
    )
}

export default function RouteContentForBus({ data, busNum }) {
    if (busNum == '0') {
        return (
            <View style={styles.container}>
                <Text style={{ ...ConvStyle(14, Colors.fontColor, 150), lineHeight: 25 }}>
                    운행이 종료되었습니다.
                </Text>
            </View>
        )
    } else if (busNum == '1') {
        return (
            <View style={styles.container}>
                <Text style={{ ...ConvStyle(14, Colors.fontColor, 150), lineHeight: 25 }}>
                    도착 예정 버스가 없습니다.
                </Text>
            </View>
        )
    } else if (busNum == '21') {
        return (
            <>
                <RenderItemFirst data={data} />
                {/* <View style={styles.container}>
                    <Text style={{ ...ConvStyle(14, Colors.blue, 150), lineHeight: 25 }}>2번째 버스: </Text>
                    <Text style={{ ...ConvStyle(18, Colors.fontColor, 150), lineHeight: 45 }}> 차고지 대기중입니다. </Text>
                </View> */}
            </>
        )
    } else if (busNum == '22') {
        return (
            <>
                <RenderItemFirst data={data} />
                {/* <View style={styles.container}>
                    <Text style={{ ...ConvStyle(16, Colors.blue, 150), lineHeight: 45 }}>2번째 버스: </Text>
                    <Text style={{ ...ConvStyle(18, Colors.fontColor, 150), lineHeight: 45 }}> 회차지 대기중입니다. </Text>
                </View> */}
            </>
        )
    } else if (busNum == '23') {
        return (
            <>
                <RenderItemFirst data={data} />
                {/* <View style={styles.container}>
                    <Text style={{ ...ConvStyle(16, Colors.blue, 150), lineHeight: 45 }}>2번째 버스: </Text>
                    <Text style={{ ...ConvStyle(18, Colors.fontColor, 150), lineHeight: 45 }}> 도착 예정 버스가 없습니다. </Text>
                </View> */}
            </>
        )
    } else if (busNum == '3') {
        return (
            <>
                <RenderItemFirst data={data} />
                <RenderItemSecond data={data} />
            </>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderColor: Colors.borderColor,
        backgroundColor: Colors.background,
        borderWidth: 0.5,
        paddingVertical: 5,
        paddingRight: 15,
        paddingLeft: 50,
    },
    status: {
        borderWidth: 2,
        borderRadius: 5,
        paddingVertical: 2,
        paddingHorizontal: 10,
        marginHorizontal: 10,
        backgroundColor: Colors.white
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 5
    },
    alarm: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30,
        borderColor: Colors.borderColor,
        borderWidth: 1,
        borderRadius: 15,
        backgroundColor: Colors.white
    },
    innerContent: {
        width: 55,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.blue,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 3,
        marginRight: 15
    },
})