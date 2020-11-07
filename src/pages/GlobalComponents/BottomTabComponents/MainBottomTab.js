import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import IconBadge from 'react-native-icon-badge';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Constants, { ConvStyle } from '../../../settings/Constants';
import Colors from '../../../settings/Colors';

let assetRoute = '../../../../assets/mainTab/';

export default function MainBottomTab({ selTab, navigation, homeType }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => { 
                if(homeType == 'homeInner') {
                    navigation.navigate('homeFavorEdit', {data: global.historyReview})
                } else {
                    navigation.navigate('homeFavor')
                }
            }} style={styles.tabElement}>
                {
                    selTab == 'home' ?
                        <>
                            <Ionicons name="home" size={33} color={Colors.white} />
                            <Text style={ConvStyle(13, Colors.white, 140)}>홈</Text>
                        </> :
                        <>
                            <Ionicons name="home" size={33} color={Colors.mainTabColor} />
                            <Text style={ConvStyle(13, Colors.mainTabColor, 140)}>홈</Text>
                        </>
                }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {navigation.navigate('around')}} style={styles.tabElement}>
                {
                    selTab == 'around' ?
                        <>
                            <Icon name="my-location" size={35} color={Colors.white} />
                            <Text style={ConvStyle(13, Colors.white, 140)}>주변정류소</Text>
                        </> :
                        <>
                            <Icon name="my-location" size={35} color={Colors.mainTabColor} />
                            <Text style={ConvStyle(13, Colors.mainTabColor, 140)}>주변정류소</Text>
                        </>
                }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {navigation.navigate('findRoad')}} style={styles.tabElement}>
                {
                    selTab == 'findRoad' ?
                        <>
                            <Icon name="directions" size={37} color={Colors.white} />
                            <Text style={ConvStyle(13, Colors.white, 140)}>길찾기</Text>
                        </> :
                        <>
                            <Icon name="directions" size={37} color={Colors.mainTabColor} />
                            <Text style={ConvStyle(13, Colors.mainTabColor, 140)}>길찾기</Text>
                        </>
                }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { }} style={styles.tabElement}>
                {/* {
                    selTab == 'message' ?
                        <>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                                <IconBadge
                                    MainElement={
                                        <Icon name="email" size={35} color={Colors.white} />
                                    }
                                    BadgeElement={
                                        <Text style={{ color: Colors.white }}>2</Text>
                                    }
                                    IconBadgeStyle={{...styles.iconBadge, borderColor: Colors.white}}
                                />
                            </View>
                            <Text style={ConvStyle(13, Colors.white, 140)}>알림</Text>
                        </> :
                        <>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                                <IconBadge
                                    MainElement={
                                        <Icon name="email" size={35} color={Colors.mainTabColor} />
                                    }
                                    BadgeElement={
                                        <Text style={ConvStyle(10, Colors.mainTabColor, 170)}>2</Text>
                                    }
                                    IconBadgeStyle={{...styles.iconBadge, borderColor: Colors.mainTabColor}}
                                />
                            </View>
                            <Text style={ConvStyle(13, Colors.mainTabColor, 140)}>알림</Text>
                        </>
                } */}
                {
                    selTab == 'message' ?
                        <>
                            <Image source={require(assetRoute+'main_tab_await.png')} style={{width: 35, height: 35, marginBottom: 2, resizeMode: 'contain'}} />
                            <Text style={ConvStyle(13, Colors.white, 140)}>승하차지원</Text>
                        </> :
                        <>
                            <Image source={require(assetRoute+'main_tab_await.png')} style={{width: 35, height: 35, marginBottom: 2, resizeMode: 'contain'}} />
                            <Text style={ConvStyle(13, Colors.mainTabColor, 140)}>승하차지원</Text>
                        </>
                }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { }} style={styles.tabElement}>
                {
                    selTab == 'busAverage' ?
                        <>
                            <CIcon name="clipboard-check" size={35} color={Colors.white} />
                            <Text style={ConvStyle(13, Colors.white, 140)}>버스평가</Text>
                        </> :
                        <>
                            <CIcon name="clipboard-check" size={35} color={Colors.mainTabColor} />
                            <Text style={ConvStyle(13, Colors.mainTabColor, 140)}>버스평가</Text>
                        </>
                }
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
        alignItems: 'flex-end',
        paddingBottom: 10,
        paddingHorizontal: 15,
    },
    tabElement: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconBadge: {
        position: 'absolute',
        top: -5,
        left: -8,
        width: 22,
        height: 22,
        backgroundColor: Colors.blue,
        borderWidth: 1
    }
})