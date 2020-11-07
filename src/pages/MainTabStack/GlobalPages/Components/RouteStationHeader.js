import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Colors, { ConvColors } from '../../../../settings/Colors';
import Constants, { ConvStyle, ConvBusType } from '../../../../settings/Constants';

export default function RouteStationHeader({ data, navigation }) {
    if(!data) {
        return null
    }
    console.log(JSON.stringify(data))
    return (
        <View
            style={styles.headerView}
            // onPress={()=>{
            //     navigation.navigate('realRoute', {data: data})
            // }}
        >
            <View style={styles.top}>
                <Text style={ConvStyle(27, ConvColors(data.routeTypeCd._text, '1'), 170)}>
                    {data.routeName._text}
                </Text>
            </View>
            <View style={styles.bottom}>
                <View style={{ ...styles.left, backgroundColor: ConvColors(data.routeTypeCd._text, '1') }}>
                    <Text numberOfLines={1} style={ConvStyle(16, Colors.white, 150)}>
                        {ConvBusType(data.routeTypeCd._text)}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '40%' }}>
                    <Text numberOfLines={1} style={ConvStyle(16, Colors.fontColor, 150)}>{data.routeDestName._text}방면</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerView: {
        borderColor: Colors.borderColor,
        borderBottomWidth: 0.5,
        flexDirection: 'column',
        backgroundColor: Colors.white,
        padding: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
        zIndex: 1
    },
    top: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    bottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    left: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: 7,
    }
})