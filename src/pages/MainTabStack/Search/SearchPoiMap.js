import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import Geolocation from '@react-native-community/geolocation';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import { WebView } from 'react-native-webview';

import Constants, { ConvStyle } from '../../../settings/Constants';
import Colors from '../../../settings/Colors';
import SearchPoiMapBottomTab from '../../GlobalComponents/BottomTabComponents/SearchPoiMapBottomTab';
import Html from '../../Tmap/TmapSearchPoi';

export function RenderItem({ selStationInfo }) {
    if(!selStationInfo) return null
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

export default class SearchPoiMap extends Component {
    constructor(props) {
        super(props)
        this.state={
            initialPosition: 'unknown',
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

    render() {
        const {navigation} = this.props;
        let positionInfo = this.props.route.params.positionInfo;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header
                    centerComponent={{
                        text: '검색',
                        style: ConvStyle(18, Colors.blue, 170)
                    }}
                    containerStyle={{
                        height: Constants.HEADER_BAR_HEIGHT,
                        backgroundColor: Colors.white
                    }}
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
                        if (data.isSel) {
                            this.setState({ selStationInfo: data.data })
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
                    injectedJavaScript={`getPoiLocation(${positionInfo.noorLat}, ${positionInfo.noorLon})`}
                />
                <TouchableOpacity style={styles.currentLocation}
                    onPress={() => {
                        this.webRef.injectJavaScript(`fitBounds(${this.state.initialPosition.coords.longitude}, ${this.state.initialPosition.coords.latitude})`)
                    }}
                >
                    <MIcon name="my-location" size={60} color={Colors.blue} />
                </TouchableOpacity>
                <RenderItem selStationInfo={this.state.selStationInfo} />
                <SearchPoiMapBottomTab navigation={navigation} findRoad={()=>{
                    global.startPOI = {
                        title: '현재위치',
                        x: this.state.initialPosition.coords.longitude,
                        y: this.state.initialPosition.coords.latitude
                    }
                    global.endPOI = {
                        title: positionInfo.name,
                        x: positionInfo.noorLon,
                        y: positionInfo.noorLat
                    }
                    navigation.navigate('findRoad')
                }} />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
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
})