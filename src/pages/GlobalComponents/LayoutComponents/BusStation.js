import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Colors from '../../../settings/Colors';
import Constants, { ConvStyle } from '../../../settings/Constants';

export default function BusStation({ item, drag, delItem, editItem, navigation }) {
    if (!drag) {
        return (
            <View style={{...styles.container, marginBottom: 5}}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('stationInfo', {
                            data: {
                                "stationId": {
                                    "_text": item.data.stationId._text
                                },
                                "stationName": {
                                    "_text": item.data.stationName._text
                                },
                                "x": {
                                    "_text": item.data.x._text
                                },
                                "y": {
                                    "_text": item.data.y._text
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
                        backgroundColor: Colors.fontColor,
                        borderRadius: 20,
                        marginRight: 15,
                    }}>
                        <MIcon name="directions-bus" size={20} color={Colors.white} />
                    </View>
                    <View style={styles.content}>
                        <Text numberOfLines={1} style={{ ...ConvStyle(global.fontSize == 0 ? 16 : global.fontSize == 1 ? 17 : 18, Colors.fontColor, 160), lineHeight: 30 }}>
                            {item.data.stationName._text}
                        </Text>
                        <Text numberOfLines={1} style={ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.fontColor, 140)}>
                            {
                                item.data.mobileNoSi ?
                                    item.data.mobileNoSi._text + ' | ' :
                                    item.data.mobileNo ?
                                        item.data.mobileNo._text + ' | ' : ''
                            }
                            {item.memo ? item.data.regionName._text + ' | ' + item.memo : item.data.regionName._text}
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
                        backgroundColor: Colors.fontColor,
                        borderRadius: 20,
                        marginRight: 15,
                    }}>
                        <MIcon name="directions-bus" size={20} color={Colors.white} />
                    </View>
                    <View style={{...styles.content, width: Constants.WINDOW_WIDTH - 170}}>
                        <Text numberOfLines={1} style={{ ...ConvStyle(global.fontSize == 0 ? 16 : global.fontSize == 1 ? 17 : 18, Colors.fontColor, 160), lineHeight: 30 }}>
                            {item.data.stationName._text}
                        </Text>
                        <Text numberOfLines={1} style={ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.fontColor, 140)}>
                            {
                                item.data.mobileNoSi ?
                                    item.data.mobileNoSi._text + ' | ' :
                                    item.data.mobileNo ?
                                        item.data.mobileNo._text + ' | ' : ''
                            }
                            {item.memo ? item.data.regionName._text + ' | ' + item.memo : item.data.regionName._text}
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
                        <MIcon name="edit" size={25} color={Colors.fontColor} />
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
                        <MIcon name="menu" size={25} color={Colors.fontColor} />
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
        paddingVertical: 7,
        paddingHorizontal: 15,
    },
    content: {
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    }
})