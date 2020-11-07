import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Colors from '../../../settings/Colors';
import Constants, { ConvStyle } from '../../../settings/Constants';
import RestAPI from '../../../api/RestAPI';

export default function BusStationHeader({ data, drag, delItem, editItem, navigation }) {
    let assetRoute = '../../../../assets/global/';
    if (!drag) {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('stationInfo', {
                            data: {
                                "stationId": {
                                    "_text": data.stationInfo.stationId._text
                                },
                                "stationName": {
                                    "_text": data.stationInfo.stationName._text
                                },
                                "x": {
                                    "_text": data.stationInfo.x._text
                                },
                                "y": {
                                    "_text": data.stationInfo.y._text
                                }
                            }
                        })
                    }}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 30, height: 30,
                        backgroundColor: Colors.white,
                        borderWidth: 2,
                        borderColor: Colors.fontColor,
                        borderRadius: 20,
                        marginRight: 15,
                    }}>
                        <Icon name="directions-bus" size={20} color={Colors.fontColor} />
                    </View>
                    <View style={styles.content}>
                        <Text numberOfLines={1} style={{ ...ConvStyle(global.fontSize == 0 ? 16 : global.fontSize == 1 ? 17 : 18, Colors.fontColor, 160), lineHeight: 30 }}>
                            {data.stationInfo.stationName._text}
                        </Text>
                        <Text numberOfLines={1} style={ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.fontColor, 140)}>
                            {
                                data.stationInfo.mobileNo ?
                                    data.stationInfo.mobileNo._text + ' | ' :
                                    data.stationInfo.mobileNoSi ?
                                        data.stationInfo.mobileNoSi._text + ' | ' : ''
                            }
                            {data.memo ? data.stationInfo.regionName._text + ' | ' + data.memo : data.stationInfo.regionName._text}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    } else {
        return (
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 30, height: 30,
                        backgroundColor: Colors.white,
                        borderWidth: 2,
                        borderColor: Colors.fontColor,
                        borderRadius: 20,
                        marginRight: 15,
                    }}>
                        <Icon name="directions-bus" size={20} color={Colors.fontColor} />
                    </View>
                    <View style={{...styles.content, width: Constants.WINDOW_WIDTH - 170}}>
                        <Text numberOfLines={1} style={{ ...ConvStyle(global.fontSize == 0 ? 16 : global.fontSize == 1 ? 17 : 18, Colors.fontColor, 160), lineHeight: 30 }}>
                            {data.stationInfo.stationName._text}
                        </Text>
                        <Text numberOfLines={1} style={ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.fontColor, 140)}>
                            {
                                data.stationInfo.mobileNoSi ?
                                    data.stationInfo.mobileNoSi._text + ' | ' :
                                    data.stationInfo.mobileNo ?
                                        data.stationInfo.mobileNo._text + ' | ' : ''
                            }
                            {data.memo ? data.stationInfo.regionName._text + ' | ' + data.memo : data.stationInfo.regionName._text}
                        </Text>
                    </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
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
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    content: {
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    }
})