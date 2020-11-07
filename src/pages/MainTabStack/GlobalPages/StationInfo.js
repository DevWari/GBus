// 정류소 페이지
import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SectionList, Alert, } from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContext } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
//----------------------Icon----------------------//
import FaIcon from 'react-native-vector-icons/FontAwesome';

import Colors from '../../../settings/Colors';
import Constants, { ConvStyle, ConvGroup, ConvBusType } from '../../../settings/Constants';
import StationInfoBottomTab from '../../GlobalComponents/BottomTabComponents/StationInfoBottomTab';
import StationHeader from './Components/StationHeader';
import RouteForBus from './Components/RouteForBus';
import Refresh from '../../GlobalComponents/Refresh';
import RestAPI from '../../../api/RestAPI';

export default class StationInfo extends Component {
    static contextType = NavigationContext;
    constructor(props) {
        super(props)
        // 리뷰목록에서 현재 정류소 아이디를 가진 정류소정보가 잇는가를 검사한다.
        let reviewStatus = false;
        let historyReview = global.historyReview;
        console.log("global historyReview", JSON.stringify(historyReview, null, 4))
        for (let i = 0; i < historyReview.length; i++) {
            if (historyReview[i].type == 'station') {
                if (historyReview[i].data.stationId._text == this.props.route.params.data.stationId._text) {
                    reviewStatus = true;
                }
            }
        }

        // 변수 초기화 부분
        this.state = {
            stationInfo: null,
            stationArraiveRoute: null,
            review: reviewStatus
        }
        this.refresh = this.refresh.bind(this);
        this.timer = null;
    }

    componentDidMount() {
        const navigation = this.context;
        showPageLoader(true)
        this._unsubscribe = navigation.addListener('focus', () => {
            RestAPI.getStationInfo(this.props.route.params.data.stationId._text).then((res) => {
                if (res.response.msgHeader.resultCode._text == 0) {
                    this.setState({
                        stationInfo: res.response.msgBody.busStationInfo
                    })
                }
            })
            this.refresh()
            this.timer = setInterval(this.refresh, 10000); // 10초만에 자동갱신을 위한 타임어
        })
    }

    componentWillUnmount() {
        this._unsubscribe();
        clearInterval(this.timer)
    }

    refresh() {
        showPageLoader(true)
        RestAPI.getStationArraiveRoute(this.props.route.params.data.stationId._text).then((res) => {
            if (res.response.msgHeader.resultCode._text == 0) {
                if (!Array.isArray(res.response.msgBody.busArrivalList)) {
                    this.setState({
                        stationArraiveRoute: [res.response.msgBody.busArrivalList]
                    })
                } else {
                    this.setState({
                        stationArraiveRoute: res.response.msgBody.busArrivalList
                    })
                }

            }
            showPageLoader(false)
        })
    }

    render() {
        // console.log(JSON.stringify(this.props.route.params.data, null, 4))
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header
                    centerComponent={{
                        text: '정류소',
                        style: ConvStyle(18, Colors.blue, 170)
                    }}
                    rightComponent={
                        <TouchableOpacity
                            onPress={() => {
                                if (!this.state.review) {
                                    this.setState({ review: true }, async () => {
                                        global.historyReview.unshift({
                                            type: 'station',
                                            data: this.state.stationInfo,
                                            memo: ''
                                        })
                                        await AsyncStorage.setItem('historyReview', JSON.stringify(global.historyReview))
                                        Alert.alert('알림', '즐겨찾기에 추가되었습니다.', [{ text: '확인' }])
                                    })
                                } else {
                                    this.setState({ review: false }, async () => {
                                        for (let i = 0; i < global.historyReview.length; i++) {
                                            if(global.historyReview[i].type == 'station') {
                                                if (global.historyReview[i].data.stationId._text == this.props.route.params.data.stationId._text) {
                                                    global.historyReview.splice(i, 1);
                                                }
                                            }
                                        }
                                        await AsyncStorage.setItem('historyReview', JSON.stringify(global.historyReview))
                                        Alert.alert('알림', '즐겨찾기가 삭제되었습니다.', [{ text: '확인' }])
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
                    <SectionList
                        sections={ConvGroup(this.state.stationArraiveRoute)}
                        stickySectionHeadersEnabled={true}
                        renderItem={({ item }) =>
                            <RouteForBus
                                data={item}
                                navigation={this.props.navigation}
                                onPressDetail={() => {
                                    clearInterval(this.timer)
                                    this.props.navigation.navigate('stationRouteInfo', {
                                        stationId: item.stationId._text,
                                        routeId: item.routeId._text,
                                        data: this.props.route.params.data
                                    })
                                }}
                            />
                        }
                        renderSectionHeader={({ section }) =>
                            <View style={styles.sectionHeader}>
                                <Text style={ConvStyle(16, '#707070', 150)}>
                                    {ConvBusType(section.title)}
                                </Text>
                            </View>}
                        keyExtractor={(item, index) => index}
                    />
                </View>
                <Refresh onPress={this.refresh} />
                <StationInfoBottomTab
                    onPressBack={()=>{
                        clearInterval(this.timer)
                        this.props.navigation.goBack();
                    }}
                    onPressMapBtn={() => {
                        clearInterval(this.timer)
                        this.props.navigation.navigate('stationAround', {
                            data: this.props.route.params.data
                        })
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
        backgroundColor: Colors.background,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,

        elevation: 3,
    }
})