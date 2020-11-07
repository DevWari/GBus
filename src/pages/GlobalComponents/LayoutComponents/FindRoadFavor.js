import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Colors from '../../../settings/Colors';
import Constants, { ConvStyle } from '../../../settings/Constants';

export default function FindRoadFavor({ item, drag, delItem, editItem, navigation }) {
    if (!drag) {
        return (
            <View style={{ ...styles.container, marginBottom: 5 }}>
                <TouchableOpacity
                    onPress={() => {
                        global.startPOI = item.startPOI;
                        global.endPOI = item.endPOI;
                        navigation.navigate('findRoad')
                    }}
                    style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
                >
                    <View style={styles.content}>
                        <MIcon name="directions" size={40} color={Colors.fontColor} />
                        <Text numberOfLines={1} style={{ ...ConvStyle(global.fontSize == 0 ? 16 : global.fontSize == 1 ? 17 : 18, Colors.fontColor, 150), paddingLeft: 10 }}>
                            {
                                item.memo ? item.memo :
                                    item.startPOI.title + ' -> ' + item.endPOI.title
                            }
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    } else {
        return (
            <View style={styles.container}>

                <View style={{ flexDirection: 'row', alignItems: 'center', width: Constants.WINDOW_WIDTH - 170, }}>
                    <MIcon name="directions" size={40} color={Colors.fontColor} />
                    <Text numberOfLines={1} style={{ ...ConvStyle(global.fontSize == 0 ? 16 : global.fontSize == 1 ? 17 : 18, Colors.fontColor, 150), paddingLeft: 10 }}>
                        {
                            item.memo ? item.memo :
                                item.startPOI.title + ' -> ' + item.endPOI.title
                        }
                    </Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
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
        paddingVertical: 10,
        paddingRight: 15,
        paddingLeft: 12
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    }
})