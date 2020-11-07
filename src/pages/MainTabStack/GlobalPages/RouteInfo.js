import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import Fa5Icon from 'react-native-vector-icons/FontAwesome5';
import FIcon from 'react-native-vector-icons/Feather';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IoIcon from 'react-native-vector-icons/Ionicons';
import RouteHeader from './Components/RouteHeader';
import Colors from '../../../settings/Colors';
import Constants, { ConvStyle } from '../../../settings/Constants';
import HomeBottomTab from '../../GlobalComponents/BottomTabComponents/HomeBottomTab';

export default class RouteInfo extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let routeInfoData = this.props.route.params.routeInfoData;
        let allStations = this.props.route.params.allStations;
        let title = '';
        allStations.forEach((item, index) => {
            item.mobileNoSi || item.mobileNo ?
                index == allStations.length - 1 ?
                    title += item.stationName._text :
                    title += item.stationName._text + '-' :
                title += ''
        });
        console.log("routeInfoData: ", routeInfoData)
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header
                    centerComponent={{
                        text: '운행정보',
                        style: ConvStyle(18, Colors.blue, 170)
                    }}
                    // rightComponent={
                    //     <TouchableOpacity
                    //         onPress={() => { }}
                    //     >
                    //         <FaIcon name="star-o" size={30} color={Colors.borderColor} />
                    //     </TouchableOpacity>
                    // }
                    containerStyle={styles.header}
                />
                <RouteHeader data={routeInfoData} />
                <ScrollView style={styles.scroll}>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={styles.subHeader}>
                            <Fa5Icon name="route" size={20} color={Colors.fontColor} />
                            <Text style={styles.subTitle}>운행지역</Text>
                        </View>
                        <View style={styles.subBody}>
                            <Text numberOfLines={1} style={{ ...ConvStyle(global.fontSize == 0 ? 18 : global.fontSize == 1 ? 19 : 20, Colors.fontColor, 150), lineHeight: 30 }}>
                                {routeInfoData.startStationName? routeInfoData.startStationName._text : null}
                                {'<->'}
                                {routeInfoData.endStationName ? routeInfoData.endStationName._text : null}
                            </Text>
                            <Text numberOfLines={1} style={{...ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.fontColor, 150),
        lineHeight: 25}}>
                                {   
                                    routeInfoData ?
                                        routeInfoData.adminName._text + ' ' + routeInfoData.routeTypeName._text :
                                        null
                                }
                            </Text>
                            <Text numberOfLines={1} style={{...ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.fontColor, 150),
        lineHeight: 25}}>
                                운수업체: {routeInfoData.companyName._text} ({routeInfoData.companyTel?._text})
                            </Text>
                            <Text numberOfLines={1} style={{...ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.fontColor, 150),
        lineHeight: 25}}>
                                차고지: {routeInfoData.garageName._text} ({routeInfoData.garageTel._text})
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={styles.subHeader}>
                            <FIcon name="clock" size={20} color={Colors.fontColor} />
                            <Text style={styles.subTitle}>운행시간</Text>
                        </View>
                        <View style={styles.subBody}>
                            <Text numberOfLines={1} style={{...ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.fontColor, 150),
        lineHeight: 25}}>
                                기점: 평일 {
                                    routeInfoData.upFirstTime && routeInfoData.upLastTime ?
                                        routeInfoData.upFirstTime._text + '~' + routeInfoData.upLastTime._text :
                                        null
                                },
                                주말: {
                                    routeInfoData.weUpFirstTime && routeInfoData.weUpLastTime ?
                                        routeInfoData.weUpFirstTime._text + '~' + routeInfoData.weUpLastTime._text :
                                        null
                                }
                            </Text>
                            <Text numberOfLines={1} style={{...ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.fontColor, 150),
        lineHeight: 25}}>
                                종점: 평일 {
                                    routeInfoData.downFirstTime && routeInfoData.downLastTime ?
                                        routeInfoData.downFirstTime._text + '~' + routeInfoData.downLastTime._text :
                                        null
                                },
                                주말: {
                                    routeInfoData.weDownFirstTime && routeInfoData.weDownLastTime ?
                                        routeInfoData.weDownFirstTime._text + '~' + routeInfoData.weDownLastTime._text :
                                        null
                                }
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={styles.subHeader}>
                            <MCIcon name="timeline-clock-outline" size={25} color={Colors.fontColor} />
                            <Text style={styles.subTitle}>배차간격</Text>
                        </View>
                        <View style={styles.subBody}>
                            <Text numberOfLines={1} style={{...ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.fontColor, 150),
        lineHeight: 25}}>
                                평일: {
                                        routeInfoData.peekAlloc && routeInfoData.nPeekAlloc ?
                                            routeInfoData.peekAlloc._text + '~' + routeInfoData.nPeekAlloc._text + '분' :
                                            null
                                    },
                                주말: {
                                    routeInfoData.wePeekAlloc && routeInfoData.weNPeekAlloc ?
                                        routeInfoData.wePeekAlloc._text + '~' + routeInfoData.weNPeekAlloc._text + '분' :
                                        null
                                }
                            </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={styles.subHeader}>
                            <IoIcon name="bookmarks" size={20} color={Colors.fontColor} />
                            <Text style={styles.subTitle}>주요정차정류소</Text>
                        </View>
                        <View style={styles.subBody}>
                            <Text numberOfLines={10} style={{...ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.fontColor, 150),
        lineHeight: 25}}>{title}</Text>
                        </View>
                    </View>
                </ScrollView>
                <HomeBottomTab navigation={this.props.navigation} />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        height: Constants.HEADER_BAR_HEIGHT,
        backgroundColor: Colors.white,
        borderBottomColor: Colors.borderColor,
        borderBottomWidth: 0.5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    },
    scroll: {
        flex: 1,
        flexDirection: 'column',
        marginBottom: Constants.BOTTOM_BAR_HEIGHT
    },
    subHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 5
    },
    subTitle: {
        ...ConvStyle(16, Colors.fontColor, 150),
        paddingLeft: 10
    },
    subBody: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: 10,
        backgroundColor: Colors.white,
        borderColor: Colors.borderColor,
        borderWidth: 0.7
    },
    content: {
        ...ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.fontColor, 150),
        lineHeight: 25
    }
})