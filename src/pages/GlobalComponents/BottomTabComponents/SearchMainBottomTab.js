import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';
import Colors from '../../../settings/Colors';
import Constants from '../../../settings/Constants';


export default function SearchMainBottomTab({ navigation, backTab }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => {
                    if(backTab) {
                        backTab()
                    }
                }}
                style={styles.tabElement}
            >
                <Icon name="angle-left" size={30} color={Colors.mainTabColor} />
            </TouchableOpacity>
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
        justifyContent: 'center'
    }
})