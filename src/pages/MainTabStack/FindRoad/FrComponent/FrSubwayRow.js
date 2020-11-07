import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, TouchableWithoutFeedback, Keyboard, FlatList, ScrollView, Alert } from 'react-native';

import MTIcon from 'react-native-vector-icons/MaterialIcons';
import Constants, { ConvStyle, setIconType, getShortStrFromSubway } from '../../../../settings/Constants';
import Colors from '../../../../settings/Colors';

export default function FrSubwayRow({beforeColor, selfColor, item}) {
    return(
        <View style={styles.container}>
            <View style={{...styles.topLine, backgroundColor: beforeColor}} />
            <View style={{...styles.bottomLine, backgroundColor: selfColor}} />
            {
                setIconType(item.laneAlias._cdata) == 'num' ? 
                    <View style={{...styles.busIconView, backgroundColor: selfColor, ...styles.shadow}}>
                        <Text style={ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.white, 170)}>{getShortStrFromSubway(item.laneAlias._cdata)}</Text>
                    </View> :
                    <View style={{...styles.busTextView, backgroundColor: selfColor, ...styles.shadow}}>
                        <Text style={ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.white, 150)}>{getShortStrFromSubway(item.laneAlias._cdata)}</Text>
                    </View>
            }
            <Text style={{...ConvStyle(global.fontSize == 0 ? 16 : global.fontSize == 1 ? 17 : 18, Colors.fontColor, 170), marginRight: 10,}}>{item.name._cdata}</Text>
            <Text numberOfLines={1} style={{...ConvStyle(global.fontSize == 0 ? 16 : global.fontSize == 1 ? 17 : 18, Colors.borderColor, 170), flex: 1}}>{item.way._cdata} 방면</Text>
        </View>
    )    
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderColor: Colors.borderColor,
        borderWidth: 0.7,
        backgroundColor: Colors.background
    },
    busIconView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        borderRadius: 15,
        marginHorizontal: 20,
    },
    busTextView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        paddingHorizontal: 5,
        paddingVertical: 5,
        width: 50,
        marginHorizontal: 10
    },
    detailView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 7,
        paddingVertical: 5,
        borderRadius: 5,
        marginRight: 15,
    },
    topLine: {
        position: 'absolute',
        top: 0,
        left: 44,
        width: 2,
        height: 25,
    },
    bottomLine: {
        position: 'absolute',
        bottom: 0,
        left: 44,
        width: 2,
        height: 25,
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        
        elevation: 8,
    },
})