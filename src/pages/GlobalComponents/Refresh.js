import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';

import Constants from '../../settings/Constants';

export default function Refresh({onPress}) {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={()=>{
                if(onPress) {
                    onPress()
                }
            }}
        >
            <Image source={require('../../../assets/global/refresh.png')} style={styles.image} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: Constants.BOTTOM_BAR_HEIGHT + 15,
        right: 15,
    },
    image: { 
        width: 50, 
        height: 50, 
        resizeMode: 'contain'
    }
})