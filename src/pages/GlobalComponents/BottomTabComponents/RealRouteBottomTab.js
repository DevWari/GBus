import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Fontisto';
import FA5Icon from 'react-native-vector-icons/FontAwesome5';
import MTIcon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../../settings/Colors';
import Constants, { ConvStyle } from '../../../settings/Constants';

export default function RealRouteBottomTab({ onPressBack, onPressMapBtn, onPressInfoBtn}) {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => {
                if(onPressBack) {
                    onPressBack()
                }
            }} style={styles.tabElement}>
                <Icon name="angle-left" size={30} color={Colors.mainTabColor} />
            </TouchableOpacity>
            <View style={styles.tabGroup}>
                <TouchableOpacity
                    style={styles.tabElementGroup}
                    onPress={() => { 
                        if(onPressMapBtn) {
                            onPressMapBtn()
                        }
                    }}
                >
                    <FIcon name="map" size={33} color={Colors.mainTabColor} />
                    <Text style={ConvStyle(13, Colors.mainTabColor, 140)}>지도</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.tabElementGroup}
                    onPress={() => {
                        if(onPressInfoBtn) {
                            onPressInfoBtn()
                        }
                    }}
                >
                    <FA5Icon name="info-circle" size={33} color={Colors.mainTabColor} />
                    <Text style={ConvStyle(13, Colors.mainTabColor, 140)}>노선정보</Text>
                </TouchableOpacity>
            </View>
        </View >
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
    tabElementGroup: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 25,
    },
    tabGroup: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        alignItems: 'flex-end',
        paddingBottom: 10,
    }
})