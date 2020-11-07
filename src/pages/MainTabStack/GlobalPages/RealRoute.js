import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Platform, Alert } from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContext } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
//----------------------Icon----------------------//
import IoIcon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import FaIcon from 'react-native-vector-icons/FontAwesome';

import Colors, { ConvDensityColor, ConvColors } from '../../../settings/Colors';
import Constants, { ConvStyle, ConvDensityTitle } from '../../../settings/Constants';
import RouteHeader from './Components/RouteHeader';
import RealRouteDirect from './Components/RealRouteDirect';
import RealRouteBottomTab from '../../GlobalComponents/BottomTabComponents/RealRouteBottomTab';
import Refresh from '../../GlobalComponents/Refresh';
import RestAPI from '../../../api/RestAPI';

// 매 정류소 지점 아이콘 렌더
export function RenderLine({ indexId, startId, endId, length }) {
    if (indexId == startId) {
        return (
            <>
                <View style={{ width: 10 }}>
                    <Line color={'transparent'} />
                    <Line color={Colors.blue} />
                </View>
                <MarkIcon title={'기점'} isReturn={false} />
            </>
        )
    } else if (indexId == endId) {
        return (
            <>
                <View style={{ width: 10 }}>
                    <Line color={Colors.blue} />
                    <Line color={Colors.redRoute} />
                </View>
                <MarkIcon title={'회차'} isReturn={true} />
            </>
        )
    } else if (parseInt(indexId) == length) {
        return (
            <>
                <View style={{ width: 10 }}>
                    <Line color={Colors.redRoute} />
                    <Line color={'transparent'} />
                </View>
                <MarkIcon title={'종점'} isReturn={false} />
            </>
        )
    } else if (parseInt(indexId) > parseInt(endId)) {
        return (
            <>
                <View style={{ width: 10 }}>
                    <Line color={Colors.redRoute} />
                    <Line color={Colors.redRoute} />
                </View>
                <MarkIcon title={''} isReturn={false} />
            </>
        )
    } else if (parseInt(indexId) < parseInt(endId)) {
        return (
            <>
                <View style={{ width: 10 }}>
                    <Line color={Colors.blue} />
                    <Line color={Colors.blue} />
                </View>
                <MarkIcon title={''} isReturn={false} />
            </>
        )
    }
}
// 운행중인 버스 아래부분 렌더
export function RenderBeforeIcon({ indexId, activeBusList, routeType }) {
    if (!Array.isArray(activeBusList)) activeBusList = [activeBusList];
    if (activeBusList.some(el => el.stationId._text == indexId)) {
        if (activeBusList.find(el => el.stationId._text == indexId).stateCd._text == '0' ||
            activeBusList.find(el => el.stationId._text == indexId).stateCd._text == '2') {
            return (
                // 버스 위부분에 절반 표기
                <ActiveBus top={'-50%'} typeColor={Colors.blue} data={
                    activeBusList.find(el => el.stationId._text == indexId)
                } routeType={routeType} />
            )
        } else {
            return null
        }
    } else {
        return null
    }
}
// 운행중인 버스 위부분 렌더
export function RenderIcon({ indexId, activeBusList, routeType }) {
    if (!Array.isArray(activeBusList)) activeBusList = [activeBusList];
    if (activeBusList.some(el => el.stationId._text == indexId)) {
        if (activeBusList.find(el => el.stationId._text == indexId).stateCd._text == '0' ||
            activeBusList.find(el => el.stationId._text == indexId).stateCd._text == '2') {
            return (
                // 정류소 아래부분에 절반 표기
                // <ActiveBus top={'49.9%'} typeColor={Colors.blue} />
                null
            )
        } else {
            return (
                // 정류소에 도착한 버스아이콘 표기
                <ActiveBus top={'0%'} typeColor={Colors.blue} data={
                    activeBusList.find(el => el.stationId._text == indexId)
                } routeType={routeType} />
            )
        }
    } else {
        return null
    }
}

export function RenderItem({ item, stationList, activeBusList, index, onPressItem, routeType }) {
    return (
        <TouchableOpacity style={{ ...styles.renderItemContainer }} activeOpacity={1}
            onPress={() => {
                if (onPressItem) {
                    onPressItem()
                }
            }}
        >
            <View style={{
                width: Constants.WINDOW_WIDTH * 0.35,
                height: 70
            }} />
            <RenderLine
                indexId={item.stationSeq._text}
                startId={1}
                endId={item.turnSeq._text}
                length={stationList.length}
            />
            <View style={styles.itemDetail}>
                <Text numberOfLines={1}
                    style={{
                        ...ConvStyle(global.fontSize == 0 ? 18 : global.fontSize == 1 ? 19 : 20,
                            !item.mobileNoSi && !item.mobileNo ?
                                index == 0 || index == stationList.length - 1 ?
                                    Colors.fontColor :
                                    item.stationName._text.substring(item.stationName._text.length - 3, item.stationName._text.length - 1) == '경유' ?
                                        Colors.borderColor : Colors.fontColor
                                : Colors.fontColor
                        ),
                        lineHeight: 25
                    }}>
                    {item.stationName._text}
                </Text>
                {
                    item.mobileNoSi ?
                        item.mobileNo ?
                            item.districtCd._text == '1' ?
                                <Text style={{ ...ConvStyle(global.fontSize == 0 ? 16 : global.fontSize == 1 ? 17 : 18, Colors.fontColor, 150), lineHeight: 25 }}>
                                    {item.regionName._text + " | " + item.mobileNoSi._text}
                                </Text> :
                                <Text style={{ ...ConvStyle(global.fontSize == 0 ? 16 : global.fontSize == 1 ? 17 : 18, Colors.fontColor, 150), lineHeight: 25 }}>
                                    {item.regionName._text + " | " + item.mobileNo._text}
                                </Text>
                            : <Text style={{ ...ConvStyle(global.fontSize == 0 ? 16 : global.fontSize == 1 ? 17 : 18, Colors.fontColor, 150), lineHeight: 25 }}>
                                {item.regionName._text + " | " + item.mobileNoSi._text}
                            </Text>
                        : item.mobileNo ?
                            <Text style={{ ...ConvStyle(global.fontSize == 0 ? 16 : global.fontSize == 1 ? 17 : 18, Colors.fontColor, 150), lineHeight: 25 }}>
                                {item.regionName._text + " | " + item.mobileNo._text}
                            </Text>
                            : null
                }
            </View>
            {
                !activeBusList ? null :
                    item.stationSeq._text != '1' ?
                        <RenderBeforeIcon
                            indexId={
                                stationList.find(el =>
                                    parseInt(el.stationSeq._text) == (parseInt(item.stationSeq._text) - 1)).stationId._text
                            }
                            routeType={routeType}
                            activeBusList={activeBusList}
                        /> : null
            }
            {
                !activeBusList ? null :
                    <RenderIcon
                        routeType={routeType}
                        indexId={item.stationId._text}
                        activeBusList={activeBusList}
                    />
            }
        </TouchableOpacity>
    )

}

export default class RealRoute extends Component {
    static contextType = NavigationContext
    constructor(props) {
        super(props)
        // 리뷰목록에 현재 실시간 노선아이디를 가진 노선정보가 잇는가를 검사한다.
        let reviewStatus = false;
        let historyReview = global.historyReview;
        console.log("global historyReview", JSON.stringify(historyReview, null, 4))
        for (let i = 0; i < historyReview.length; i++) {
            if (historyReview[i].type == 'realRoute') {
                if (historyReview[i].routeId._text == this.props.route.params.data.routeId._text) {
                    reviewStatus = true;
                }
            }
        }

        // 변수초기화부분
        this.flatRef = React.createRef();
        this.state = {
            stationList: [],
            activeBusList: [],
            routeInfoData: null,
            review: reviewStatus
        }
        this.refresh = this.refresh.bind(this);
        this.timer = null;
    }

    componentDidMount() {
        const navigation = this.context
        showPageLoader(true);

        // 노선의 상세정보 얻기
        RestAPI.getRouteInfo(this.props.route.params.data.routeId._text).then((res) => {
            if (res.response.msgHeader.resultCode._text == 0) {
                this.setState({
                    routeInfoData: res.response.msgBody.busRouteInfoItem
                })
            }
        })
        RestAPI.getRouteStation(this.props.route.params.data.routeId._text).then((res) => {
            if (res.response.msgHeader.resultCode._text == 0) {
                this.setState({
                    stationList: res.response.msgBody.busRouteStationList
                }, () => {
                    RestAPI.getActiveBus(this.props.route.params.data.routeId._text).then((res) => {
                        if (res.response.msgHeader.resultCode._text == 0) {
                            this.setState({
                                activeBusList: res.response.msgBody.busLocationList
                            })
                        } else if (res.response.msgHeader.resultCode._text == 4) {
                            if (this.state.routeInfoData && this.state.routeInfoData.upLastTime && this.state.routeInfoData.downLastTime) {
                                Alert.alert('알림',
                                    `운행중인 버스가 없습니다.${'\n'}막차시간: 기점(` + this.state.routeInfoData.upLastTime._text + `), 회차점(` + this.state.routeInfoData.downLastTime._text + `)${'\n'}버스 이용에 참고하시기 바랍니다.`,
                                    [{ text: '확인' }])
                            } else {
                                Alert.alert('알림', '운행중인 버스가 없습니다', [{ text: '확인' }])
                            }

                        } else {
                            Alert.alert('알림', res.response.msgHeader.resultMessage._text, [{ text: '확인' }])
                        }
                    })
                })
            }
            showPageLoader(false)
        })
        this._unsubscribe = navigation.addListener('focus', () => {
            this.refresh();
            this.timer = setInterval(this.refresh, 10000); // 10초만에 자동갱신을 위한 타임어
        })
    }

    componentWillUnmount() {
        this._unsubscribe();
        clearInterval(this.timer)
    }

    refresh() {
        showPageLoader(true)
        RestAPI.getActiveBus(this.props.route.params.data.routeId._text).then((res) => {
            if (res.response.msgHeader.resultCode._text == 0) {
                this.setState({
                    activeBusList: res.response.msgBody.busLocationList
                })
            }
            showPageLoader(false)
        })
    }

    ScrollToTop = () => {
        try {
            this.flatRef.current?.scrollToIndex({
                animated: true,
                index: 0
            })
        } catch (ex) { }
    }

    ScrollToEnd = (index) => {
        try {
            this.flatRef.current?.scrollToOffset({
                animated: true,
                offset: 70 * index + 10,
            })
        } catch (ex) { }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header
                    centerComponent={{
                        text: '실시간버스위치',
                        style: ConvStyle(18, Colors.blue, 170)
                    }}
                    rightComponent={
                        <TouchableOpacity
                            onPress={() => {
                                if(!this.state.review) {
                                    this.setState({ review: true }, async () => {
                                        global.historyReview.unshift({
                                            type: 'realRoute',
                                            routeId: {
                                                _text: this.props.route.params.data.routeId._text
                                            },
                                            memo: ''
                                        })
                                        await AsyncStorage.setItem('historyReview', JSON.stringify(global.historyReview))
                                        Alert.alert('알림', '즐겨찾기에 추가되었습니다.', [{text: '확인'}])
                                    })
                                } else {
                                    this.setState({review:false}, async ()=>{
                                        for( let i = 0; i<global.historyReview.length; i++) {
                                            if(global.historyReview[i].type == 'realRoute') {
                                                if(global.historyReview[i].routeId._text == this.props.route.params.data.routeId._text) {
                                                    global.historyReview.splice(i, 1);
                                                }
                                            }
                                        }
                                        await AsyncStorage.setItem('historyReview', JSON.stringify(global.historyReview))
                                        Alert.alert('알림', '즐겨찾기가 삭제되었습니다.', [{text: '확인'}])
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
                    containerStyle={styles.header}
                />
                {/* 선택된 노선의 간단한 상세정보를 보여주기 위한 헤더 부분 - 완성 */}
                <RouteHeader data={this.state.routeInfoData} />

                {/* 회차 및 종점정류소 방면(지역위치와 함께) - 지역위치 미완성 */}
                <RealRouteDirect
                    data={this.state.routeInfoData}
                    onScrollToTop={this.ScrollToTop}
                    onScrollToEnd={() => this.ScrollToEnd(
                        this.state.stationList[0].turnSeq._text - 1)}
                />

                {/* 노선정류소 목록으로 현시 부분 */}
                <View style={{
                    flex: 1,
                    marginBottom: Constants.BOTTOM_BAR_HEIGHT,
                }}>
                    <FlatList
                        ref={this.flatRef}
                        removeClippedSubviews={true}
                        initialNumToRender={10}
                        maxToRenderPerBatch={200}
                        legacyImplementation={true}
                        windowSize={50}
                        getItemLayout={(data, index) => (
                            { length: 70, offset: 70 * index, index }
                        )}
                        data={this.state.stationList}
                        ListHeaderComponent={
                            <View style={{ height: 10 }} />
                        }
                        ListFooterComponent={
                            <View style={{ height: 100 }} />
                        }
                        renderItem={({ item, index, separators }) => {
                            return (
                                <RenderItem
                                    key={index}
                                    item={item}
                                    stationList={this.state.stationList}
                                    activeBusList={this.state.activeBusList}
                                    index={index}
                                    routeType={this.state.routeInfoData}
                                    navigation={this.props.navigation}
                                    onPressItem={() => {
                                        if (item.stationName._text.substring(item.stationName._text.length - 3, item.stationName._text.length - 1) == '경유') {
                                            console.log("impossible");
                                        } else {
                                            clearInterval(this.timer)
                                            this.props.navigation.navigate('stationRouteInfo', {
                                                stationId: item.stationId._text,
                                                routeId: this.props.route.params.data.routeId._text,
                                                data: item
                                            })
                                        }
                                    }}
                                />
                            )
                        }}
                        refreshing={false}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                {/* 실시간 업데이트를 위한 새로고침 아이콘 */}
                <Refresh onPress={this.refresh} />
                <RealRouteBottomTab
                    onPressBack={()=>{
                        clearInterval(this.timer)
                        this.props.navigation.goBack()
                    }}
                    onPressMapBtn={() => {
                        clearInterval(this.timer)
                        this.props.navigation.navigate(
                            'realRouteMap',
                            { data: this.state.routeInfoData }
                        )
                    }}
                    onPressInfoBtn={() => {
                        clearInterval(this.timer)
                        this.props.navigation.navigate(
                            'routeInfo',
                            {
                                allStations: this.state.stationList,
                                routeInfoData: this.state.routeInfoData
                            }
                        )
                    }}
                />
            </SafeAreaView>
        )
    }
}

// 노선뷰
export function Line({ color }) {
    return (
        <View style={{
            width: '100%',
            height: 35.5,
            backgroundColor: color
        }} />
    )
}
// 정류소, 시작점, 도착점, 마크 아이콘뷰
export function MarkIcon({ title, isReturn }) {
    return (
        <View style={styles.markIconContainer}>
            <View style={styles.markIconTitle}>
                <Text style={ConvStyle(global.fontSize == 0 ? 15 : global.fontSize == 1 ? 16 : 17, Colors.fontColor, 150)}>{title}</Text>
            </View>
            <View style={styles.markIcon}>
                {
                    isReturn ?
                        <FaIcon name="rotate-left" size={12} color={Colors.fontColor} /> :
                        <IoIcon name="chevron-down-sharp" size={12} color={Colors.borderColor} />
                }
            </View>
        </View>
    )
}
// 운행중인 버스뷰
export function ActiveBus({ top, typeColor, data, routeType }) {
    return (
        <View style={{ ...styles.activeBusContainer, top: top }}>
            <View style={styles.activeBusTitle}>
                {
                    data.remainSeatCnt._text == '-1' ? null :
                        <View style={{
                            ...styles.activeBusType,
                            borderColor: data.remainSeatCnt._text == '0' ? ConvDensityColor(data.density._text) : ConvDensityColor('3')
                        }}>
                            <Text style={ConvStyle(global.fontSize == 0 ? 15 : global.fontSize == 1 ? 16 : 17, Colors.fontColor, 150)}>
                                {data.remainSeatCnt._text == '0' ? ConvDensityTitle(data.density._text) : data.remainSeatCnt._text + '석'}
                            </Text>
                        </View>
                }
                <View style={{ paddingRight: 5, paddingTop: 5 }}>
                    <Text style={ConvStyle(global.fontSize == 0 ? 15 : global.fontSize == 1 ? 16 : 17, Colors.fontColor, 150)}>
                        {data.plateNo._text.substring(data.plateNo._text.length - 4, data.plateNo._text.length)}
                    </Text>
                </View>
            </View>
            <View style={{ backgroundColor: Colors.white, width: 30 }}>
                <MIcon name="directions-bus" size={30} color={ConvColors(routeType ? routeType.routeTypeCd._text : '100', '1')} />
            </View>
        </View>
    )
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
    markIconContainer: {
        position: 'absolute',
        left: Constants.WINDOW_WIDTH * 0.35 - 120 + 14,
        top: 0,
        height: 70,
        width: 120,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    markIconTitle: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
        backgroundColor: Colors.white
    },
    markIcon: {
        backgroundColor: Colors.white,
        borderColor: Colors.borderColor,
        borderWidth: 1,
        borderRadius: 10,
        width: 18,
        height: 18,
        marginLeft: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    activeBusContainer: {
        position: 'absolute',
        left: Constants.WINDOW_WIDTH * 0.35 - 120 + 20,
        height: 70,
        width: 120,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    activeBusTitle: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
        backgroundColor: Colors.white,
        zIndex: 2
    },
    activeBusType: {
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 5,
        paddingVertical: 2
    },
    renderItemContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 70,
        backgroundColor: Colors.white,
        borderColor: Colors.borderColor,
        borderTopWidth: 0.7
    },
    itemDetail: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingHorizontal: 20,
        height: 70,
        width: Constants.WINDOW_WIDTH * 0.65 - 10,
        // borderColor: Colors.borderColor,
        // borderTopWidth: 0.5,
        // borderBottomWidth: 0.5,
    }
})