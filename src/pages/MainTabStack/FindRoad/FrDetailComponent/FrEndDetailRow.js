import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Dash from 'react-native-dash';

import MTIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Constants, { ConvStyle, ConvNumToBusType } from '../../../../settings/Constants';
import Colors from '../../../../settings/Colors';

export default function FrEndDetailRow({beforeColor, end}) {
    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            borderColor: Colors.borderColor,
            borderWidth: 0.7,
            paddingHorizontal: 10,
            height: 60
        }}>
            {
                beforeColor == Colors.gray ?
                    <Dash style={{ width: 1, height: 30, flexDirection: 'column', ...styles.topLine }} dashColor={beforeColor} /> :
                    <View style={{ ...styles.topLine, backgroundColor: beforeColor }} />
            }
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: 30,
                height: 30,
                marginHorizontal: 20,
            }}>
                <MTIcon name='map-marker' size={30} color={Colors.fontColor} />
            </View>
            <Text style={{...ConvStyle(global.fontSize == 0 ? 16 : global.fontSize == 1 ? 17 : 18, Colors.fontColor, 150), lineHeight: 30}}>
                도착 | {end}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    topLine: {
        position: 'absolute',
        top: 0,
        left: 44,
        width: 2,
        height: 30,
    },
})