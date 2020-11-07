// 정류소 경유노선의 행을 보여주기 위한 헤더부분 Component
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Colors, { ConvColors } from '../../../../settings/Colors';
import fontStyleBusRoute from '../../../../settings/FontStyle/BusRouteStyle';
import Constants, { ConvStyle } from '../../../../settings/Constants';
import Icon from 'react-native-vector-icons/Ionicons';
import Data from '../../../GlobalComponents/Dummy/DataStationRoute';

export default function RouteHeaderForBus({ active, data, navigation, onPressDetail }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.touchItem}
                onPress={() => {
                    if(onPressDetail) {
                        onPressDetail()
                    }
                }}
            >
                <View style={styles.num}>
                    <Text numberOfLines={1} style={ConvStyle(18, ConvColors(data.routeTypeCd._text, '1'), 170)}>
                        {data.routeName._text}
                    </Text>
                </View>
                <View style={styles.content}>
                    <View style={styles.innerContentView}>
                        {
                            !data.predictTime1.hasOwnProperty('_text') ?
                                <View style={styles.innerContent}>
                                    <Text style={ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.white, 150 )}>
                                        도착정보없음
                                    </Text>
                                </View> :
                                <View style={styles.innerContent}>
                                    <Text style={ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.white, 150 )}>
                                        { parseInt(data.predictTime1._text) <= 3 ? 
                                            '잠시 후 도착' : data.predictTime1._text + '분' }
                                    </Text>
                                </View>
                        }
                        {
                            !data.predictTime2.hasOwnProperty('_text') ? null :
                                <View style={styles.innerContent}>
                                    <Text style={ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.white, 150 )}>
                                        {data.predictTime2._text}분
                                    </Text>
                                </View>
                        }
                    </View>
                    <Text numberOfLines={1} style={{...ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.fontColor, 150 ), lineHeight: 25}}>
                        {data.routeDestName._text} 방면
                    </Text>
                </View>
            </TouchableOpacity>
            <View style={styles.icon}>
                {
                    active ?
                        <Icon name="ellipsis-vertical-outline" size={35} color={Colors.borderColor} /> :
                        <Icon name="ellipsis-vertical" size={35} color={Colors.borderColor} />
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderColor: Colors.borderColor,
        borderBottomWidth: 1,
        backgroundColor: Colors.white,
        paddingTop: 10,
        paddingRight: 20,
    },
    touchItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    num: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 10,
        width: 100,
    },
    content: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    innerContentView: {
        flexDirection: 'row',
        paddingBottom: 5
    },
    innerContent: {
        backgroundColor: Colors.blue,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 3,
        marginRight: 10
    },
    icon: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    image: {
        height: 25, width: 25,
        resizeMode: 'contain'
    }
})