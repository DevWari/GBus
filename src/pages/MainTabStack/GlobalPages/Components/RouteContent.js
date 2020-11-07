// 버스도착페이지에서 2대버스의 정보를 보여주기위한 페이지
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Colors, { ConvColors, ConvDensityColor } from '../../../../settings/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import fontStyles from '../../../../settings/FontStyle/BusItemStyle';
import fontStylesForBus from '../../../../settings/FontStyle/BusRouteStyle';
import Constants, { ConvStyle, ConvDensityTitle, ConvLowPlate } from '../../../../settings/Constants';

export function Status({ color, title }) {
    return (
        <View style={{ ...styles.status, borderColor: color }}>
            <Text style={ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.fontColor, 150 )}>{title}</Text>
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
            <View style={styles.content}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.innerContent}>
                        {
                            Number(data.predictTime1._text) <= 3 ?
                                <Text style={{ ...fontStylesForBus.arraiveSoon, textAlign: 'center' }}>
                                    잠시후{'\n'}도착
                                </Text> :
                                <Text style={fontStylesForBus.arraiveTime}>
                                    {data.predictTime1._text}분
                                </Text>
                        }
                    </View>
                </View>
                <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 80 }}>
                            <Text numberOfLines={1} style={ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.fontColor, 150 )}>
                                {data.locationNo1._text}번째 전
                            </Text>
                        </View>
                        {
                            data.remainSeatCnt1._text == '-1' ? null :
                                <Status
                                    color={data.remainSeatCnt1._text == '0' ? ConvDensityColor(data.density1._text) : ConvDensityColor('3')}
                                    title={data.remainSeatCnt1._text == '0' ? ConvDensityTitle(data.density1._text) : data.remainSeatCnt1._text + '석'}
                                />
                        }
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5 }}>
                        <Text style={ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.fontColor, 150 )}>
                            {ConvLowPlate(data.lowPlate1._text)}{" | "}
                        </Text>
                        <Text style={ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.fontColor, 150 )}>
                            {data.plateNo1._text.slice(data.plateNo1._text.length - 4, data.plateNo1._text.length + 1)}
                        </Text>
                    </View>
                </View>

            </View>
            <TouchableOpacity style={styles.alarm}>
                <Image source={require(assetRoute + 'alarm.png')} style={{ width: 30, height: 30, resizeMode: 'contain' }} />
                <Text style={{ ...fontStyles.default, paddingLeft: 5 }}>승차{'\n'}대기</Text>
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
            <View style={styles.content}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={styles.innerContent}>
                        {
                            Number(data.predictTime2._text) <= 3 ?
                                <Text style={{ ...fontStylesForBus.arraiveSoon, textAlign: 'center' }}>
                                    잠시후{'\n'}도착
                                </Text> :
                                <Text style={fontStylesForBus.arraiveTime}>
                                    {data.predictTime2._text}분
                                </Text>
                        }
                    </View>
                </View>
                <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 80 }}>
                            <Text numberOfLines={1} style={ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.fontColor, 150 )}>
                                {data.locationNo2._text}번째 전
                            </Text>
                        </View>
                        {
                            data.remainSeatCnt2._text == '-1' ? null :
                                <Status
                                    color={data.remainSeatCnt2._text == '0' ? ConvDensityColor(data.density2._text) : ConvDensityColor('3')}
                                    title={data.remainSeatCnt2._text == '0' ? ConvDensityTitle(data.density2._text) : data.remainSeatCnt2._text + '석'}
                                />
                        }
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5 }}>
                        <Text style={ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.fontColor, 150 )}>
                            {ConvLowPlate(data.lowPlate2._text)}{" | "}
                        </Text>
                        <Text style={ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.fontColor, 150 )}>
                            {data.plateNo2._text.slice(data.plateNo2._text.length - 4, data.plateNo2._text.length + 1)}
                        </Text>
                    </View>
                </View>

            </View>
            <TouchableOpacity style={styles.alarm}>
                <Image source={require(assetRoute + 'alarm.png')} style={{ width: 30, height: 30, resizeMode: 'contain' }} />
                <Text style={{ ...fontStyles.default, paddingLeft: 5 }}>승차{'\n'}대기</Text>
            </TouchableOpacity>
        </View>
    )
}

export default function RouteContent({ data, busNum }) {
    if (busNum == '0') {
        return (
            <View style={styles.container}>
                <Text style={{ ...ConvStyle(16, Colors.fontColor, 150), lineHeight: 45 }}>
                    운행이 종료되었습니다.
                </Text>
            </View>
        )
    } else if (busNum == '1') {
        return (
            <View style={styles.container}>
                <Text style={{ ...ConvStyle(16, Colors.fontColor, 150), lineHeight: 45 }}>
                    도착 예정 버스가 없습니다.
                </Text>
            </View>
        )
    } else if (busNum == '21') {
        return (
            <>
                <RenderItemFirst data={data} />
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{...styles.innerContent, backgroundColor: Colors.gray}}>
                                <Text style={{ ...fontStylesForBus.arraiveTime, textAlign: 'center' }}>
                                    대기중
                            </Text>
                            </View>
                        </View>
                        <Text style={{ ...ConvStyle(14, Colors.fontColor, 150), lineHeight: 45 }}> 차고지 대기중입니다. </Text>
                    </View>
                </View>
            </>
        )
    } else if (busNum == '22') {
        return (
            <>
                <RenderItemFirst data={data} />
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{...styles.innerContent, backgroundColor: Colors.gray}}>
                                <Text style={{ ...fontStylesForBus.arraiveTime, textAlign: 'center' }}>
                                    대기중
                            </Text>
                            </View>
                        </View>
                        <Text style={{ ...ConvStyle(14, Colors.fontColor, 150), lineHeight: 45 }}> 회차지 대기중입니다. </Text>
                    </View>
                </View>
            </>
        )
    } else if (busNum == '23') {
        return (
            <>
                <RenderItemFirst data={data} />
                <View style={styles.container}>
                    <View style={styles.content}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{...styles.innerContent, backgroundColor: Colors.gray}}>
                                <Text style={{ ...fontStylesForBus.arraiveTime, textAlign: 'center' }}>
                                    없음
                            </Text>
                            </View>
                        </View>
                        <Text style={{ ...ConvStyle(14, Colors.fontColor, 150), lineHeight: 45 }}> 도착 예정 버스가 없습니다. </Text>
                    </View>
                </View>
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
        backgroundColor: Colors.white,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    status: {
        borderWidth: 2,
        borderRadius: 5,
        paddingVertical: 2,
        paddingHorizontal: 10,
        marginHorizontal: 10
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
        paddingHorizontal: 5,
        width: 80,
        paddingVertical: 2,
        borderColor: Colors.borderColor,
        borderWidth: 1,
        borderRadius: 7,
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