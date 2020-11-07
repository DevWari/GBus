import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Fontisto';
import IoIcon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../../settings/Colors';
import Constants, {ConvStyle} from '../../../settings/Constants';


export default function FrStartEndBottom({ navigation, setPoi, setCurrent }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => { navigation.goBack() }} style={styles.tabElement}>
                <Icon name="angle-left" size={30} color={Colors.mainTabColor} />
            </TouchableOpacity>
            <View style={styles.tabGroup}>
                <TouchableOpacity 
                    style={styles.tabElementGroup} 
                    onPress={()=>{
                        if(setCurrent) {
                            setCurrent()
                        }
                    }}
                >
                    <MIcon name="my-location" size={35} color={Colors.mainTabColor} />
                    <Text style={ConvStyle(13, Colors.mainTabColor, 140)}>현재위치</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.tabElementGroup}
                    onPress={() => { 
                        if(setPoi) {
                            setPoi()
                        }    
                    }}
                >
                    <IoIcon name="map" size={33} color={Colors.mainTabColor} />
                    <Text style={ConvStyle(13, Colors.mainTabColor, 140)}>지도에서 선택</Text>
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