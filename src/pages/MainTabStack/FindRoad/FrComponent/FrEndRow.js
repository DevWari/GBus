import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, TouchableWithoutFeedback, Keyboard, FlatList, ScrollView, Alert } from 'react-native';

import MTIcon from 'react-native-vector-icons/MaterialIcons';
import Constants, { ConvStyle, ConvStrToDate } from '../../../../settings/Constants';
import Colors from '../../../../settings/Colors';

export default function FrEndRow({beforeColor, item}) {
    return(
        <View style={styles.container}>
            <View style={{...styles.topLine, backgroundColor: beforeColor}} />
            <View style={{...styles.busIconView, borderColor: beforeColor}}>
                <Text style={ConvStyle(12, Colors.fontColor, 140)}>하차</Text>
            </View>
            <Text style={{...ConvStyle(global.fontSize == 0 ? 16 : global.fontSize == 1 ? 17 : 18, Colors.fontColor, 170), marginRight: 10,}}>{item}</Text>
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
        backgroundColor: Colors.white,
        borderWidth: 2,
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
    }
})