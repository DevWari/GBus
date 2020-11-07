import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Dash from 'react-native-dash';
import Constants, {
    ConvStyle,
    setIconType,
    getShortStrFromSubway
} from '../../../../settings/Constants';
import Colors from '../../../../settings/Colors';

export default function FrSubwayDetailRow({ beforeColor, selfColor, item, isTransfer }) {
    return (
        <View style={styles.container}>
            {
                beforeColor == Colors.gray ?
                    <Dash style={{ width: 1, height: 45, flexDirection: 'column', ...styles.topLine }} dashColor={Colors.gray} /> :
                    <View style={{ ...styles.topLine, backgroundColor: beforeColor }} />
            }
            <View style={{ ...styles.bottomLine, backgroundColor: selfColor }} />
            {
                setIconType(item.laneAlias._cdata) == 'num' ?
                    <View style={{ ...styles.busIconView, backgroundColor: selfColor, ...styles.shadow }}>
                        <Text style={ConvStyle(14, Colors.white, 170)}>{getShortStrFromSubway(item.laneAlias._cdata)}</Text>
                    </View> :
                    <View style={{ ...styles.busTextView, backgroundColor: selfColor, ...styles.shadow }}>
                        <Text style={ConvStyle(14, Colors.white, 150)}>{getShortStrFromSubway(item.laneAlias._cdata)}</Text>
                    </View>
            }
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
                    <Text style={ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.fontColor, 170)}>{item.way._cdata} 방면</Text>
                </View>
                <Text style={ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.gray, 140)}>
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
    busTextView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        paddingVertical: 5,
        width: 50,
        marginHorizontal: 10
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