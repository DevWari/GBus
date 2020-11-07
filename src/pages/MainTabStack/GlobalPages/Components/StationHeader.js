import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../../../settings/Colors';
import Constants, { ConvStyle } from '../../../../settings/Constants';

export default function StationHeader({ data }) {
    return (
        <View
            style={styles.headerView}
        >
            <View style={styles.top}>
                <Text style={ConvStyle(20, Colors.fontColor, 150)} numberOfLines={1}>
                    {data ? data.stationName._text : '정류소 명'}
                </Text>
            </View>
            <View style={styles.bottom}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', width: '40%' }}>
                    <Text numberOfLines={1} style={ConvStyle(16, Colors.fontColor, 150)}>
                        {
                            data ?
                                data.mobileNo? data.mobileNo._text : 
                                    data.mobileNoSi? data.mobileNoSi._text : '모바일번호'
                                : '모바일번호'
                        }
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '40%' }}>
                    <Text numberOfLines={1} style={ConvStyle(16, Colors.fontColor, 150)}>
                        {
                            data? data.regionName._text : '지역 명'
                        }
                    </Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerView: {
        borderColor: Colors.dark,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        flexDirection: 'column',
        backgroundColor: Colors.stationInfo,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    },
    top: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        textAlign: 'center',
        paddingBottom: 5
    },
    bottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingTop: 5
    }
})