// 버스도착정보 페이지
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, NativeModules } from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContext } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-community/async-storage';

import FaIcon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import Colors from '../../../settings/Colors';
import Constants, { ConvStyle } from '../../../settings/Constants';
import StationRouteInfoBottomTab from '../../GlobalComponents/BottomTabComponents/StationRouteInfoBottomTab';
import StationHeader from './Components/StationHeader';
import RouteStationHeader from './Components/RouteStationHeader';
import RouteContent from './Components/RouteContent';
import Refresh from '../../GlobalComponents/Refresh';
import fontStyles from '../../../settings/FontStyle/BusItemStyle';
import RestAPI from '../../../api/RestAPI';

const SharedStorage = NativeModules.SharedStorage;

export function TwoBusInfo({ data }) {
    if (!data) {
        return null
    } else {
        if (!data.locationNo1.hasOwnProperty('_text')) { // 첫번째 버스정보가 없기때문에 노선일괄로 판단
            if (data.flag._text == 'STOP') {
                return <RouteContent data={data} busNum={'0'} /> // 한개 행으로 2대 버스 모두 운행종료로 표기
            } else {
                return <RouteContent data={data} busNum={'1'} /> // 한개 행으로 2대 버스 모두 도착예정없음으로 표기
            }
        } else {
            if (!data.locationNo2.hasOwnProperty('_text')) {
                if (data.garageFlag._text == 'Y' && (Number(data.staOrder._text) - Number(data.locationNo2._text)) == 1) {
                    return <RouteContent data={data} busNum={'21'} /> // 2번째 버스 차고지 대기중으로 표기
                } else if (
                    data.garageTurnFlag == 'Y' &&
                    (Number(data.staOrder._text) - Number(data.locationNo2._text)) == Number(data.turnSeq._text)
                ) {
                    return <RouteContent data={data} busNum={'22'} />  // 2번째 버스 회차지 대기중으로 표기
                } else {
                    return <RouteContent data={data} busNum={'23'} />  // 2번째 버스 도착예정없음으로 표기
                }
            } else {
                return <RouteContent data={data} busNum={'3'} /> // 2대 버스 모두 운행중...
            }
        }
    }
}

export default class StationRouteInfo extends Component {
    static contextType = NavigationContext;
    constructor(props) {
        super(props)
        // 리뷰목록에서 현재 버스도착정보가 잇는가를 검사한다.
        let reviewStatus = false;
        let historyReview = global.historyReview;
        console.log("global historyReview", JSON.stringify(historyReview, null, 4))

        for (let i = 0; i < historyReview.length; i++) {
            if (historyReview[i].type == 'routeStation') {
                if (historyReview[i].stationInfo.stationId._text == this.props.route.params.stationId) {
                    for (let j = 0; j < historyReview[i].data.length; j++) {
                        if (historyReview[i].data[j].routeId._text == this.props.route.params.routeId) {
                            reviewStatus = true;
                        }
                    }
                }
            }
        }

        // 변수초기화부분
        this.state = {
            initialPosition: 'unknown',
            stationInfo: null,
            stationRouteInfo: null,
            routeInfoData: null,
            stationList: null,
            review: reviewStatus
        }
        this.refresh = this.refresh.bind(this);
        this.timer = null;
    }

    componentDidMount() {
        const navigation = this.context;
        showPageLoader(true)
        RestAPI.getStationInfo(this.props.route.params.stationId).then((res) => {

            if (res.response.msgHeader.resultCode._text == 0) {
                this.setState({
                    stationInfo: res.response.msgBody.busStationInfo
                })
            }
        })
        this._unsubscribe = navigation.addListener('focus', () => {
            Geolocation.getCurrentPosition(
                position => {
                    const initialPosition = position;
                    this.setState({ initialPosition: initialPosition })
                },
                error => console.log('Error: ', JSON.stringify(error)),
                { enableHighAccuracy: false }
            );
            this.refresh()
            this.timer = setInterval(this.refresh, 10000); // 10초만에 자동갱신을 위한 타임어

        })

        // 노선아이디로부터 노선상세정보 얻기 - 오류신고에 노선헤더와 노선정보에 이용
        RestAPI.getRouteInfo(this.props.route.params.routeId).then((res) => {
            if (res.response.msgHeader.resultCode._text == 0) {
                this.setState({
                    routeInfoData: res.response.msgBody.busRouteInfoItem
                })
            }
        })
        // 노선아이디로부터 노선에 속하는 전체 정류소 정보 얻기 - 노선정보에 이용
        RestAPI.getRouteStation(this.props.route.params.routeId).then((res) => {
            if (res.response.msgHeader.resultCode._text == 0) {
                this.setState({
                    stationList: res.response.msgBody.busRouteStationList
                })
            }
            showPageLoader(false)
        })

    }

    componentWillUnmount() {
        this._unsubscribe();
        clearInterval(this.timer);
    }

    refresh() {
        showPageLoader(true)
        RestAPI.getStationRouteInfo(this.props.route.params.routeId, this.props.route.params.stationId).then((res) => {
            if (res.response.msgHeader.resultCode._text == 0) {
                this.setState({
                    stationRouteInfo: res.response.msgBody.busArrivalItem
                })
            }
            showPageLoader(false)
        })
    }

    checkExsit(array, stationId) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].type == 'routeStation') {
                if (array[i].stationInfo.stationId._text == stationId) {
                    return true
                }
            }
        }
        return false
    }

    render() {
        // console.log(JSON.stringify(this.props.route.params.data, null, 4))
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header
                    centerComponent={{
                        text: '버스도착정보',
                        style: ConvStyle(18, Colors.blue, 170)
                    }}
                    rightComponent={
                        <TouchableOpacity
                            onPress={() => {
                                if (!this.state.review) {
                                    this.setState({ review: true }, async () => {
                                        if (this.checkExsit(global.historyReview, this.props.route.params.stationId)) {
                                            for (let i = 0; i < global.historyReview.length; i++) {
                                                if (global.historyReview[i].type == 'routeStation') {
                                                    if (global.historyReview[i].stationInfo.stationId._text == this.props.route.params.stationId) {
                                                        global.historyReview[i].data.unshift({
                                                            routeId: {
                                                                _text: this.props.route.params.routeId
                                                            }
                                                        })
                                                        await AsyncStorage.setItem('historyReview', JSON.stringify(global.historyReview))
                                                        SharedStorage.set(
                                                            JSON.stringify({text: global.historyReview}),
                                                        );
                                                        Alert.alert('알림', '즐겨찾기에 추가되었습니다.', [{ text: '확인' }])
                                                    }
                                                }
                                            }
                                        } else {
                                            global.historyReview.unshift({
                                                type: 'routeStation',
                                                stationId: {
                                                    _text: this.props.route.params.stationId,
                                                },
                                                stationInfo: this.state.stationInfo,
                                                data: [{
                                                    routeId: {
                                                        _text: this.props.route.params.routeId
                                                    }
                                                }],
                                                memo: ''
                                            })
                                            await AsyncStorage.setItem('historyReview', JSON.stringify(global.historyReview))
                                            SharedStorage.set(
                                                JSON.stringify({text: global.historyReview}),
                                            );
                                            Alert.alert('알림', '즐겨찾기에 추가되었습니다.', [{ text: '확인' }])
                                        }
                                    })
                                } else {
                                    this.setState({ review: false }, async () => {
                                        for (let i = 0; i < global.historyReview.length; i++) {
                                            if (global.historyReview[i].type == 'routeStation') {
                                                if (global.historyReview[i].stationInfo.stationId._text == this.props.route.params.stationId) {
                                                    if (global.historyReview[i].data.length == 1) {
                                                        global.historyReview.splice(i, 1);
                                                        await AsyncStorage.setItem('historyReview', JSON.stringify(global.historyReview))
                                                        SharedStorage.set(
                                                            JSON.stringify({text: global.historyReview}),
                                                        );
                                                        Alert.alert('알림', '즐겨찾기가 삭제되었습니다.', [{ text: '확인' }])
                                                    } else {
                                                        for (let j = 0; j < global.historyReview[i].data.length; j++) {
                                                            if (global.historyReview[i].data[j].routeId._text == this.props.route.params.routeId) {
                                                                global.historyReview[i].data.splice(j, 1);
                                                                await AsyncStorage.setItem('historyReview', JSON.stringify(global.historyReview))
                                                                SharedStorage.set(
                                                                    JSON.stringify({text: global.historyReview}),
                                                                );
                                                                Alert.alert('알림', '즐겨찾기가 삭제되었습니다.', [{ text: '확인' }])
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    })
                                }
                            }}
                        >
                            {
                                this.state.review ?
                                    <FaIcon name="star" size={30} color={Colors.yellow} /> :
                                    <FaIcon name="star-o" size={30} color={Colors.borderColor} />
                            }
                        </TouchableOpacity>
                    }
                    containerStyle={{
                        height: Constants.HEADER_BAR_HEIGHT,
                        backgroundColor: Colors.white,
                        zIndex: 1
                    }}
                />
                <View style={styles.body}>
                    <StationHeader data={this.state.stationInfo} />
                    <RouteStationHeader
                        data={this.state.stationRouteInfo}
                        navigation={this.props.navigation}
                    />
                    <TwoBusInfo data={this.state.stationRouteInfo} />
                    <View style={styles.alarmView}>
                        <TouchableOpacity
                            onPress={() => { }}
                            style={styles.alarmTouchView}
                        >
                            <MIcon name="alarm" size={25} color={Colors.borderColor} />
                            <Text style={{ ...ConvStyle(16, Colors.fontColor, 150), paddingLeft: 10 }}>승하차 알람</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', padding: 5 }}>
                            <Text style={ConvStyle(16, Colors.fontColor, 150)}>지나간 버스</Text>
                        </View>
                        <View style={styles.passBus}>
                            <Text style={ConvStyle(16, Colors.fontColor, 150)}>차량번호: 경기70바1556</Text>
                            <TouchableOpacity style={styles.passBtn}>
                                <Image source={require('../../../../assets/global/nostop.png')} style={styles.imageIcon} />
                                <Text style={{ ...fontStyles.default, paddingLeft: 5, textAlign: 'center' }}>무정차{'\n'}통과</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 15 }}>
                            <Text style={{ ...ConvStyle(13, Colors.fontColor, 150), textAlign: 'center', lineHeight: 20 }}>
                                버스도착정보는 교통 및 버스 운행상황에 따라{'\n'}
                                다를 수 있으며, 버스 이용시 참고용으로만 활용바랍니다.
                            </Text>
                        </View>
                    </View>
                </View>
                <Refresh onPress={this.refresh} />
                <StationRouteInfoBottomTab
                    onPressBack={() => {
                        clearInterval(this.timer)
                        this.props.navigation.goBack();
                    }}
                    onPressRouteInfo={() => {
                        clearInterval(this.timer)
                        this.props.navigation.navigate('routeInfo', {
                            allStations: this.state.stationList,
                            routeInfoData: this.state.routeInfoData
                        })
                    }}
                    onPressReport={() => {
                        clearInterval(this.timer)
                        this.props.navigation.navigate('report', {
                            routeInfoData: this.state.routeInfoData,
                            stationInfoData: this.state.stationInfo
                        })
                    }}
                    onPressMap={() => {
                        clearInterval(this.timer)
                        this.props.navigation.navigate('stationAround', {
                            data: this.props.route.params.data
                        })
                    }}
                    onPressFindRoad={() => {
                        clearInterval(this.timer)
                        global.startPOI = {
                            title: '현재위치',
                            x: this.state.initialPosition.coords.longitude,
                            y: this.state.initialPosition.coords.latitude
                        }
                        global.endPOI = {
                            title: this.state.stationInfo.stationName._text,
                            x: this.state.stationInfo.x._text,
                            y: this.state.stationInfo.y._text
                        }
                        this.props.navigation.navigate('findRoad')
                    }}
                />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        marginBottom: Constants.BOTTOM_BAR_HEIGHT,
        backgroundColor: Colors.background
    },
    sectionHeader: {
        padding: 5,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: Colors.borderColor,
        backgroundColor: Colors.background
    },
    alarmView: {
        marginTop: 15,
        borderColor: Colors.borderColor,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white
    },
    alarmTouchView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.borderColor,
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginVertical: 15,
        backgroundColor: Colors.white,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    },
    passBus: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: Colors.white,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderColor: Colors.borderColor
    },
    passBtn: {
        flexDirection: 'row',
        paddingHorizontal: 5,
        width: 90,
        paddingVertical: 2,
        borderColor: Colors.borderColor,
        borderWidth: 1,
        borderRadius: 7,
        backgroundColor: Colors.white
    },
    imageIcon: {
        width: 30, height: 30,
        resizeMode: 'contain'
    },

})
