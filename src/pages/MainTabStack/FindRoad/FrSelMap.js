import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from '@react-native-community/geolocation';
import { StackActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

import Constants, { ConvStyle } from '../../../settings/Constants';
import Colors from '../../../settings/Colors';
import FrSelMapBottomTab from '../../GlobalComponents/BottomTabComponents/FrSelMapBottomTab';
import Html from '../../Tmap/TmapSelectPosition';


export function RenderItem({ isVisible, selStationInfo }) {
    if (!isVisible) {
        return null
    }
    return (
        <View style={styles.container}>
            <View style={styles.detailBody}>
                <View style={styles.detailBodyLeft}>
                    <View style={styles.busIconView}>
                        <Image source={require('../../../../assets/findRoad/sel_poi.png')} style={{ width: 30, height: 30, resizeMode: 'contain' }} />
                    </View>
                    <View style={styles.detailBusInfoView}>
                        <Text numberOfLines={1} style={{ ...ConvStyle(18, Colors.fontColor, 160), lineHeight: 30 }}>
                            {selStationInfo.poiName}
                        </Text>
                        <Text numberOfLines={1} style={{ ...ConvStyle(14, Colors.fontColor, 140), lineHeight: 20 }}>
                            {selStationInfo.poiAddress}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default class FrSelMap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initialPosition: 'unknown',
            isVisible: false,
            selStationInfo: null,
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

    insertHistoryPoi = async (item) => {
        global.historyPois.unshift({
            name: item.poiBuildingName != '' ?  item.poiBuildingName :  item.poiNameDemo,
            address: item.poiAddress,
            noorLon: item.x,
            noorLat: item.y
        })
        await AsyncStorage.setItem('historyPois', JSON.stringify(global.historyPois))
    }

    render() {
        const {navigation} = this.props;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header
                    centerComponent={{
                        text: this.props.route.params.title,
                        style: ConvStyle(18, Colors.blue, 170)
                    }}
                    containerStyle={styles.header}
                />
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
                        console.log("data from map: ", data)
                        if (data.isSel) {
                            this.setState({ isVisible: true, selStationInfo: data.data })
                        } else {
                            Alert.alert('경고', data.data, [{
                                text: '확인',
                                onPress: ()=>{
                                    navigation.goBack();
                                }
                            }])
                        }
                    }}
                    javaScriptEnabled={true}
                    incognito={true}
                    injectedJavaScript={`setMapCenter(${this.props.route.params.x},${this.props.route.params.y})`}
                />
                <TouchableOpacity style={styles.currentLocation}
                    onPress={() => {
                        this.webRef.injectJavaScript(`fitBounds(${this.state.initialPosition.coords.longitude}, ${this.state.initialPosition.coords.latitude})`)
                    }}
                >
                    <MIcon name="my-location" size={60} color={Colors.blue} />
                </TouchableOpacity>
                <RenderItem isVisible={this.state.isVisible} selStationInfo={this.state.selStationInfo} />
                <FrSelMapBottomTab
                    navigation={this.props.navigation}
                    title={this.props.route.params.title}
                    setStartEnd={() => {
                        if (this.state.selStationInfo) {
                            console.log("the data from map: ==========", JSON.stringify(this.state.selStationInfo, null, 4))
                            if (this.props.route.params.title == '출발지') {
                                global.startPOI = {
                                    title: this.state.selStationInfo.poiBuildingName != '' ? 
                                            this.state.selStationInfo.poiBuildingName : 
                                            this.state.selStationInfo.poiNameDemo,
                                    address: this.state.selStationInfo.poiAddress,
                                    x: this.state.selStationInfo.x,
                                    y: this.state.selStationInfo.y
                                }
                                this.insertHistoryPoi(this.state.selStationInfo)
                            } else {
                                global.endPOI = {
                                    title: this.state.selStationInfo.poiBuildingName != '' ? 
                                            this.state.selStationInfo.poiBuildingName : 
                                            this.state.selStationInfo.poiNameDemo,
                                    address: this.state.selStationInfo.poiAddress,
                                    x: this.state.selStationInfo.x,
                                    y: this.state.selStationInfo.y
                                }
                                this.insertHistoryPoi(this.state.selStationInfo)
                            }

                            this.props.navigation.dispatch(StackActions.pop(2));
                        } else {console.log('Please wait a mement!')}
                    }} />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        height: Constants.HEADER_BAR_HEIGHT,
        backgroundColor: Colors.white
    },
    body: {
        flex: 1,
        marginBottom: Constants.BOTTOM_BAR_HEIGHT,
        backgroundColor: Colors.background,
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
        justifyContent: 'flex-start'
    },
    busIconView: {
        paddingHorizontal: 10,
        justifyContent: 'center'
    },
    detailBusInfoView: {
        flex: 1,
        paddingRight: 10,
        justifyContent: 'center'
    },
    detailBodyRight: {
        justifyContent: 'flex-end',
        paddingHorizontal: 10
    },
    detailBodyEmpty: {
        marginBottom: 10,
        marginHorizontal: 10,
        borderColor: Colors.borderColor,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: Colors.white,
        paddingVertical: 10,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
})