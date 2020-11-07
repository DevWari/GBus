import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Fontisto';
import EIcon from 'react-native-vector-icons/Entypo';
import Colors from '../../../settings/Colors';
import Constants, { ConvStyle } from '../../../settings/Constants';

export default function MessageDetailBottomTap({ navigation }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => { navigation.goBack() }} style={styles.tabElement}>
                <Icon name="angle-left" size={30} color={Colors.mainTabColor} />
            </TouchableOpacity>
            <View style={styles.tabGroup}>
                <TouchableOpacity
                    style={{...styles.tabElement, paddingHorizontal: 10}}
                    onPress={() => { }}
                >
                    <EIcon name="controller-jump-to-start" size={35} color={Colors.mainTabColor} />
                    <Text style={ConvStyle(13, Colors.mainTabColor, 140)}>이전</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{...styles.tabElement, paddingHorizontal: 10}}
                    onPress={() => { }}
                >
                    <EIcon name="controller-next" size={35} color={Colors.mainTabColor} />
                    <Text style={ConvStyle(13, Colors.mainTabColor, 140)}>다음</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: Constants.BOTTOM_BAR_HEIGHT,
        width: Constants.WINDOW_WIDTH,
        backgroundColor: Colors.blue,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    tabElement: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabGroup: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingBottom: 10
    }
})