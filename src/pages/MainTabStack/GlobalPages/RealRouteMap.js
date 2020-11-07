import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Fontisto';
import { WebView } from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';

import RouteHeader from './Components/RouteHeader';
import Colors from '../../../settings/Colors';
import Constants, { ConvStyle } from '../../../settings/Constants';
import HomeBottomTab from '../../GlobalComponents/BottomTabComponents/HomeBottomTab';
import Html from '../../Tmap/TmapRealTimeRoute';

let assetsRoute = '../../../../assets/global/';

export function RenderItem({ isVisible, direction, selStationInfo, navigation }) {
    console.log(JSON.stringify(selStationInfo, null, 4));
    return (
        <View style={styles.container}>
            {
                isVisible ?
                    <TouchableOpacity style={styles.detailBody}
                        onPress={()=>{
                            navigation.navigate('stationInfo', {
                                data: {
                                    "stationId": {
                                        "_text" : selStationInfo.stationId
                                    },
                                    "stationName" : {
                                        "_text" : selStationInfo.stationName
                                    },
                                    "x": {
                                        "_text" : selStationInfo.x
                                    },
                                    "y" : {
                                        "_text" : selStationInfo.y
                                    }
                                }
                            })
                        }}
                    >
                        <View style={styles.detailBodyLeft}>
                            <View style={styles.busIconView}>
                                {
                                    direction == 'start' ?
                                        <Image source={require(assetsRoute + 'marker.png')} style={{ width: 35, height: 35, resizeMode: 'contain' }} /> :
                                        <Image source={require(assetsRoute + 'marker_red.png')} style={{ width: 35, height: 35, resizeMode: 'contain' }} />
                                }

                            </View>
                            <View style={{
                                justifyContent: 'center'
                            }}>
                                <Text numberOfLines={1} style={{ ...ConvStyle(18, Colors.fontColor, 160), lineHeight: 30 }}>
                                    {selStationInfo.stationName}
                                </Text>
                                <Text numberOfLines={1} style={{ ...ConvStyle(14, Colors.fontColor, 140), lineHeight: 20 }}>
                                    {
                                        selStationInfo.mobileNo ?
                                            selStationInfo.mobileNoSi ? ' ' + selStationInfo.mobileNo + ', ' + selStationInfo.mobileNoSi + ', ' : ' ' + selStationInfo.mobileNo + ', ' :
                                            selStationInfo.mobileNoSi ? ' ' + selStationInfo.mobileNoSi + ', ' : ' '
                                    }
                                    {selStationInfo.centerYn == 'Y' ? '중앙차로, ' : null}
                                    {selStationInfo.regionName}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.detailBodyRight}>
                            <Icon name="angle-right" size={20} color={Colors.borderColor} />
                        </View>
                    </TouchableOpacity> : null
            }
        </View>
    )
}

export default class RealRouteMap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            // visibleLoader: true,
            initialPosition: 'unknown',
            selStationInfo: null,
            isVisible: false,
            direction: null,
        }
    }

    componentDidMount() {
        Geolocation.getCurrentPosition(
            position => {
                const initialPosition = position;
                this.setState({ initialPosition: initialPosition })
            },
            error => console.log('Error: ', JSON.stringify(error)),
            { enableHighAccuracy: false }
        );
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header
                    centerComponent={{
                        text: '노선도',
                        style: ConvStyle(18, Colors.blue, 170)
                    }}
                    rightComponent={
                        <TouchableOpacity
                            onPress={() => { }}
                        >
                            <FaIcon name="star-o" size={30} color={Colors.borderColor} />
                        </TouchableOpacity>
                    }
                    containerStyle={styles.header}
                />
                <RouteHeader data={this.props.route.params.data} />
                <WebView
                    ref={(ref) => this.webRef = ref}
                    originWhitelist={['*']}
                    style={styles.body}
                    source={{ html: Html.content }}
                    onLoadStart={event => {
                        showPageLoader(true)
                    }}
                    onLoadEnd={event => {
                        showPageLoader(false)
                    }}
                    onMessage={(event) => {
                        let data = JSON.parse(event.nativeEvent.data.toString())

                        if (data.isError) {
                            alert(data.data)
                        } else {
                            this.setState({ selStationInfo: data.data, isVisible: true, direction: data.direction })
                        }
                    }}
                    javaScriptEnabled={true}
                    injectedJavaScript={
                        this.state.initialPosition != 'unknown' ?
                            `getRouteData(${this.state.initialPosition.coords.longitude}, ${this.state.initialPosition.coords.latitude}, ${this.props.route.params.data.routeId._text})` :
                            ``
                    }
                    cacheEnabled={false}
                />
                <TouchableOpacity style={styles.currentLocation}
                    onPress={() => {
                        this.webRef.injectJavaScript(`fitBounds(${this.state.initialPosition.coords.longitude}, ${this.state.initialPosition.coords.latitude})`)
                    }}
                >
                    <MIcon name="my-location" size={60} color={Colors.blue} />
                </TouchableOpacity>
                <RenderItem
                    isVisible={this.state.isVisible}
                    direction={this.state.direction}
                    selStationInfo={this.state.selStationInfo}
                    navigation={this.props.navigation}
                />
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
    body: {
        flex: 1,
        marginBottom: Constants.BOTTOM_BAR_HEIGHT
    },
    currentLocation: {
        position: 'absolute',
        right: 0,
        bottom: Constants.BOTTOM_BAR_HEIGHT + 70,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },

    // 정류소 상세정보 아이템 스타일
    container: {
        position: 'absolute',
        flexDirection: 'column',
        bottom: Constants.BOTTOM_BAR_HEIGHT, left: 0, right: 0,
        backgroundColor: 'transparent'
    },
    detailBody: {
        marginBottom: 10,
        marginHorizontal: 10,
        borderColor: Colors.borderColor,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: Colors.white,
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    detailBodyLeft: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: Constants.WINDOW_WIDTH * 0.7
    },
    busIconView: {
        paddingHorizontal: 10,
        justifyContent: 'center'
    },
    detailBusInfoView: {
        flex: 1,
        paddingRight: 30,
        justifyContent: 'center'
    },
    detailBodyRight: {
        justifyContent: 'flex-end',
        paddingHorizontal: 10
    },
})