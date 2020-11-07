import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Colors from '../../../settings/Colors';
import fontStyleBusRoute from '../../../settings/FontStyle/BusRouteStyle';
import Constants, { ConvStyle } from '../../../settings/Constants';
import Icon from 'react-native-vector-icons/Ionicons';

export default function BusRouteHeader({ active, data }) {
    let assetRoute = '../../../../assets/home/';
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.touchItem}
                onPress={() => {
                    alert('곧 버스도착페이지로 연결됩니다.')
                }}
            >
                <View style={styles.num}>
                    <Text style={ConvStyle(18, data.color, 170)}>
                        {data.num}
                    </Text>
                </View>
                <View style={styles.content}>
                    <View style={styles.innerContentView}>
                        <View style={styles.innerContent}>
                            <Text style={fontStyleBusRoute.arraiveTime}>
                                {data.time1}
                            </Text>
                        </View>
                        {
                            data.time2 ?
                                <View style={styles.innerContent}>
                                    <Text style={fontStyleBusRoute.arraiveTime}>
                                        {data.time2}
                                    </Text>
                                </View> : null
                        }
                    </View>
                    <Text numberOfLines={1} style={fontStyleBusRoute.direction}>
                        {data.direct}
                    </Text>
                </View>
            </TouchableOpacity>
            <View style={styles.icon}>
                {
                    active ?
                        <Icon name="ellipsis-vertical-outline" size={30} color={Colors.borderColor} /> :
                        <Icon name="ellipsis-vertical" size={30} color={Colors.borderColor} />
                        // <Image source={require(assetRoute + 'expand.png')} style={styles.image} /> :
                        // <Image source={require(assetRoute + 'collapse.png')} style={styles.image} />
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
        borderWidth: 0.5,
        backgroundColor: Colors.white,
        paddingTop: 8,
        paddingBottom: 5,
        paddingRight: 20,
    },
    touchItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    num: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: 15,
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
        paddingVertical: 3,
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