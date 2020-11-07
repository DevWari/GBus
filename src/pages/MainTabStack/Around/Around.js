import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Fontisto';
import IoIcon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from '@react-native-community/geolocation';
import Constants, { ConvStyle, ConvStrToDate } from '../../../settings/Constants';
import Colors from '../../../settings/Colors';
import MainBottomTab from '../../GlobalComponents/BottomTabComponents/MainBottomTab';
import Html from '../../Tmap/TmapAround';

let assetsRoute = '../../../../assets/global/';

export function RenderItem({ isVisible, selStationInfo, onPress }) {
    return (
        <View style={styles.container}>
            {
                isVisible ?
                    <TouchableOpacity style={styles.detailBody}
                        onPress={() => {
                            if (onPress) {
                                onPress()
                            }
                        }}
                    >
                        <View style={styles.detailBodyLeft}>
                            <View style={styles.busIconView}>
                                <Image source={require(assetsRoute + 'marker.png')} style={{ width: 35, height: 35, resizeMode: 'contain' }} />
                            </View>
                            <View style={styles.detailBusInfoView}>
                                <Text numberOfLines={1} style={{ ...ConvStyle(18, Colors.fontColor, 160), lineHeight: 30 }}>
                                    {selStationInfo.stationName}
                                </Text>
                                <Text numberOfLines={1} style={{ ...ConvStyle(14, Colors.fontColor, 140), lineHeight: 20 }}>
                                    {selStationInfo.distance} |
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
                    </TouchableOpacity> :
                    <View style={styles.detailBodyEmpty}>
                        <Text style={ConvStyle(15, Colors.fontColor, 170)}>내 주변 500m 이내 정류소를 표시합니다.</Text>
                    </View>
            }
        </View>
    )
}

export default class Around extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isVisible: false,
            selStationInfo: null,
            originalData: null,
            initialPosition: 'unknown'
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
                        text: '주변정류소',
                        style: ConvStyle(18, Colors.blue, 170)
                    }}
                    rightComponent={
                        <TouchableOpacity
                            onPress={() => {
                                this.props.navigation.navigate('aroundList', { data: this.state.originalData });
                            }}
                        >
                            <IoIcon name="list" size={35} color={Colors.fontColor} />
                        </TouchableOpacity>
                    }
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
                        // console.log(JSON.parse(event.nativeEvent.data.toString()))
                        let data = JSON.parse(event.nativeEvent.data.toString())
                        if (data.isMarkerClick) {
                            this.setState({ isVisible: true, selStationInfo: data.data })
                        } else {
                            if (data.originalData == '1') {
                                this.setState({
                                    originalData: data.data.response.msgBody.busStationAroundList
                                })
                            } else {
                                if (data.data == '') {
                                    return
                                }
                                // 주변정류소 결과가 존재하지 않습니다. 2번뜬다.
                                console.log(data.data)
                            }
                        }
                    }}
                    javaScriptEnabled={true}
                    injectedJavaScript={
                        this.state.initialPosition != 'unknown' ?
                            `setLocation(${this.state.initialPosition.coords.longitude}, ${this.state.initialPosition.coords.latitude})` :
                            ``
                    }
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
                    selStationInfo={this.state.selStationInfo} 
                    onPress={()=>{
                        if(this.state.selStationInfo) {
                            this.props.navigation.navigate('stationInfo', {
                                data: {
                                    "stationId": {
                                        "_text" : this.state.selStationInfo.stationId
                                    },
                                    "stationName" : {
                                        "_text" : this.state.selStationInfo.stationName
                                    },
                                    "x": {
                                        "_text" : this.state.selStationInfo.x
                                    },
                                    "y" : {
                                        "_text" : this.state.selStationInfo.y
                                    }
                                }
                            })
                        }
                    }}
                />
                <MainBottomTab navigation={this.props.navigation} selTab={'around'} />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        height: Constants.HEADER_BAR_HEIGHT,
        backgroundColor: Colors.white,
        borderBottomColor: Colors.borderColor,
        borderBottomWidth: 1,
    },
    body: {
        flex: 1,
        marginBottom: Constants.BOTTOM_BAR_HEIGHT,
        backgroundColor: Colors.background
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