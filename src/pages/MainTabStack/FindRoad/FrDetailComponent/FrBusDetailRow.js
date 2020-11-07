import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Dash from 'react-native-dash';

import MTIcon from 'react-native-vector-icons/MaterialIcons';
import Constants, { ConvStyle, ConvNumToBusType } from '../../../../settings/Constants';
import Colors from '../../../../settings/Colors';

export default function FrBusDetailRow({selfColor, beforeColor, item, isTransfer}) {
    return(
        <View style={styles.container}>
            {
                beforeColor == Colors.gray ? 
                    <Dash style={{ width: 1, height: 45, flexDirection: 'column', ...styles.topLine }} dashColor={Colors.gray} /> :
                    <View style={{ ...styles.topLine, backgroundColor: beforeColor }} />
            }
            <View style={{ ...styles.bottomLine, backgroundColor: selfColor }} />

            <View style={{...styles.busIconView, backgroundColor: selfColor, ...styles.shadow}}>
                <MTIcon name="directions-bus" size={20} color={Colors.white} />
            </View>
            <View style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
            }}>
                <Text style={ConvStyle(global.fontSize == 0 ? 16 : global.fontSize == 1 ? 17 : 18, Colors.fontColor, 150)}>
                    {isTransfer ? '환승' : '승차'} | {item.name._cdata}
                </Text>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    paddingVertical: 5,
                }}>
                    <View style={{...styles.detailView, backgroundColor: selfColor, ...styles.shadow}}>
                        <Text style={ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.white, 150)}>{ConvNumToBusType(item.lane.type._cdata)}</Text>
                    </View>
                    <Text style={{ ...ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.fontColor, 170), marginRight: 10, }}>{item.lane.busNo._cdata}</Text>
                </View>
                <Text style={ConvStyle(14, Colors.gray, 140)}>
                    {item.moveTime._cdata}분, {item.stopCount._cdata}개역 이동
                </Text>
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
        height: 90
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
    detailView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 5,
        marginRight: 10,
    },
    topLine: {
        position: 'absolute',
        top: 0,
        left: 44,
        width: 2,
        height: 45,
    },
    bottomLine: {
        position: 'absolute',
        bottom: 0,
        left: 44,
        width: 2,
        height: 45,
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