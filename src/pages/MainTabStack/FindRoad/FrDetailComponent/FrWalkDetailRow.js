import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Dash from 'react-native-dash';

import MTIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import F5Icon from 'react-native-vector-icons/FontAwesome5';
import Constants, { ConvStyle, ConvNumToBusType } from '../../../../settings/Constants';
import Colors from '../../../../settings/Colors';


export default function FrWalkDetailRow({ type, beforeColor, item }) {
    return (
        <View style={styles.container}>
            <View style={{ ...styles.topLine, backgroundColor: beforeColor }} />
            <Dash style={{ width: 1, height: 30, flexDirection: 'column', ...styles.bottomLine }} dashColor={Colors.gray} />
            {
                type == 'start' ?
                    <View style={styles.iconView}>
                        <MTIcon name='map-marker' size={30} color={Colors.fontColor} />
                    </View> :
                    <View style={{ ...styles.busIconView, borderColor: beforeColor }}>
                        <Text style={ConvStyle(12, Colors.fontColor, 140)}>하차</Text>
                    </View>
            }
            <View style={styles.contentView}>
                <Text style={{ ...ConvStyle(global.fontSize == 0 ? 16 : global.fontSize == 1 ? 17 : 18, Colors.fontColor, 150), lineHeight: 30 }}>
                    {type == 'start' ? '출발' : '하차'} | {item.name._cdata}
                </Text>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <F5Icon name='walking' size={20} color={Colors.fontColor} />
                    <Text style={ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.gray, 140)}>  도보 {item.moveTime._cdata}분 | {item.moveDistance._cdata}m</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderColor: Colors.borderColor,
        borderWidth: 0.7,
        paddingHorizontal: 10,
        height: 60
    },
    iconView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        marginHorizontal: 20,
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
    contentView: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingVertical: 5,
    },
    topLine: {
        position: 'absolute',
        top: 0,
        left: 44,
        width: 2,
        height: 30,
    },
    bottomLine: {
        position: 'absolute',
        bottom: 0,
        left: 44,
    },
})