import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import fontStyles from '../../../../settings/FontStyle/BusRouteStyle';
import Constants, { ConvStyle } from '../../../../settings/Constants';
import Colors, { ConvColors } from '../../../../settings/Colors';
import Data from '../../../GlobalComponents/Dummy/DataStationRoute';
import RestAPI from '../../../../api/RestAPI';

export default function BusRouteFavor({ item, drag, delItem, editItem, navigation }) {
    let assetRoute = '../../../../assets/global/';

    const [routeInfo, setRouteInfo] = useState(null)

    useEffect(() => {
        RestAPI.getRouteInfo(item.routeId._text).then((res) => {
            if (res.response.msgHeader.resultCode._text == 0) {
                setRouteInfo(res.response.msgBody.busRouteInfoItem)
            }
        })
    }, [item])

    if(!routeInfo) {
        return null
    }
    if (!drag) {
        return (
            <View style={{ ...styles.container, marginBottom: 5 }}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('realRoute', {data: item})
                    }}
                    style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
                >
                    <View style={{ paddingRight: 10 }}>
                        <Icon name="directions-bus" size={30} 
                        color={ConvColors(routeInfo.routeTypeCd._text, '1')} />
                    </View>
                    <View style={styles.content}>
                        <Text style={ConvStyle(global.fontSize == 0 ? 16 : global.fontSize == 1 ? 17 : 18, ConvColors(routeInfo.routeTypeCd._text, '1'), 170)}>
                            {routeInfo.routeName._text}
                        </Text>
                        <Text numberOfLines={1} style={{ ...ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.fontColor, 150), paddingHorizontal: 20 }}>
                            {item.memo ? item.memo : routeInfo.routeTypeName._text}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    } else {
        return (
            <View style={{ ...styles.container, marginBottom: 0 }}>
                <View style={{ paddingRight: 10 }}>
                    <Icon name="directions-bus" size={25} color={ConvColors(routeInfo.routeTypeCd._text, '1')} />
                </View>
                <View style={styles.content}>
                    <Text style={ConvStyle(global.fontSize == 0 ? 16 : global.fontSize == 1 ? 17 : 18, ConvColors(routeInfo.routeTypeCd._text, '1'), 170)}>
                        {routeInfo.routeName._text}
                    </Text>
                    <Text numberOfLines={1} style={{ ...ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.fontColor, 150), paddingHorizontal: 20 }}>
                        {item.memo ? item.memo : routeInfo.routeTypeName._text}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                    <TouchableOpacity
                        onPress={() => {
                            if (editItem) {
                                editItem()
                            }
                        }}
                    >
                        <Icon name="edit" size={25} color={Colors.fontColor} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ paddingHorizontal: 15 }}
                        onPress={() => {
                            if (delItem) {
                                delItem()
                            }
                        }}
                    >
                        <FeatherIcon name="trash-2" size={25} color={Colors.fontColor} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onLongPress={drag}
                    >
                        <Icon name="menu" size={25} color={Colors.fontColor} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderColor: Colors.borderColor,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        backgroundColor: Colors.white,
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingRight: 20,
    }
})