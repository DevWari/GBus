import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Colors from '../../../settings/Colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import fontStyles from '../../../settings/FontStyle/BusItemStyle';
import Constants, { ConvStyle } from '../../../settings/Constants';

export function Status({ color, title }) {
    return (
        <View style={{ ...styles.status, borderColor: color }}>
            <Text style={fontStyles.default}>{title}</Text>
        </View>
    )
}

export default function BusItem({ data, color }) {
    let assetRoute = '../../../../assets/global/';

    if (!data) {
        return (
            <View style={styles.container}>
                <Text style={{ ...ConvStyle(14, Colors.fontColor, 150), paddingVertical: 15 }}>운행 중인 버스가 없습니다.</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Icon name="directions-bus" size={25} color={color} />
            <View style={styles.content}>
                <Text style={fontStyles.num}>{data.num}번째 전</Text>
                <Status color={data.color} title={data.status} />
                <Text numberOfLines={1} style={fontStyles.default}>{data.type}</Text>
            </View>
            <TouchableOpacity style={styles.alarm}>
                <Image source={require(assetRoute + 'alarm.png')} style={{ width: 30, height: 30, resizeMode: 'contain' }} />
                <Text style={{...fontStyles.default, paddingLeft: 5}}>승차{'\n'}대기</Text>
            </TouchableOpacity>
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
        paddingVertical: 5,
        paddingLeft: 40,
        paddingRight: 10,
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
    }
})