import React, { Component, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, FlatList, Alert, AsyncStorage } from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaIcon from 'react-native-vector-icons/MaterialIcons';

import SearchMainBottomTab from '../../GlobalComponents/BottomTabComponents/SearchMainBottomTab';
import Constants, { ConvStyle, ConvBusType } from '../../../settings/Constants';
import Colors, { ConvColors } from '../../../settings/Colors';
import RestAPI from '../../../api/RestAPI';

export class SearchTabBar extends Component {
    render() {
        const { type, setSel } = this.props;
        return (
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    onPress={() => {
                        if (setSel) {
                            setSel('recent')
                        }
                    }}
                    style={type == 'recent' ? styles.selTabView : styles.tabView}
                >
                    <Text style={ConvStyle(14, Colors.fontColor, 150)}>최근검색</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        if (setSel) {
                            setSel('route')
                        }
                    }}
                    style={type == 'route' ? styles.selTabView : styles.tabView}
                >
                    <Text style={ConvStyle(14, Colors.fontColor, 150)}>노선</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        if (setSel) {
                            setSel('station')
                        }
                    }}
                    style={type == 'station' ? styles.selTabView : styles.tabView}
                >
                    <Text style={ConvStyle(14, Colors.fontColor, 150)}>정류소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        if (setSel) {
                            setSel('poi')
                        }
                    }}
                    style={type == 'poi' ? styles.selTabView : styles.tabView}
                >
                    <Text style={ConvStyle(14, Colors.fontColor, 150)}>장소</Text>
                </TouchableOpacity>
            </View>
        )
    }
}


export function RenderHistoryItem({ item, selHistory }) {
    return (
        <View style={{
            borderColor: Colors.borderColor,
            borderWidth: 0.7,
            backgroundColor: Colors.white,
            paddingVertical: 10,
        }}>
            <TouchableOpacity style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
            }} onPress={() => {
                if (selHistory) {
                    selHistory()
                }
            }}>
                <MaIcon name="history" size={30} color={Colors.gray} style={{ paddingHorizontal: 15 }} />
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    paddingRight: 15,
                }}>
                    <Text numberOfLines={1} style={{ ...ConvStyle(18, Colors.fontColor, 150), lineHeight: 40 }}>{item.title}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export function RenderBusItem({ item, navigation }) {
    return (
        <View style={{
            borderWidth: 0.7,
            borderColor: Colors.borderColor,
            backgroundColor: Colors.white,
            width: Constants.WINDOW_WIDTH
        }}>
            <TouchableOpacity style={styles.busRenderContainer}
                onPress={() => {
                    navigation.navigate('realRoute', { data: item })
                }}
            >
                <MaIcon name="directions-bus" size={35} color={ConvColors(item.routeTypeCd._text, '1')} style={{ paddingHorizontal: 15 }} />
                <View style={styles.busRenderContent}>
                    <View style={styles.busRenderTopContent}>
                        <View style={styles.busRenderTopLeftContent}>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <View style={{
                                    backgroundColor: ConvColors(item.routeTypeCd._text, '1'),
                                    borderRadius: 7,
                                    paddingHorizontal: 5,
                                    marginRight: 10
                                }}>
                                    <Text style={{
                                        ...global.fontSize == 0 ? ConvStyle(14, Colors.white, 150) : global.fontSize == 1 ? ConvStyle(15, Colors.white, 150) : ConvStyle(16, Colors.white, 150),
                                        lineHeight: 25
                                    }}>
                                        {ConvBusType(item.routeTypeCd._text)}
                                    </Text>
                                </View>
                                <Text style={
                                    global.fontSize == 0 ? ConvStyle(16, ConvColors(item.routeTypeCd._text, '1'), 150) : 
                                        global.fontSize == 1 ? ConvStyle(18, ConvColors(item.routeTypeCd._text, '1'), 150) :
                                        ConvStyle(20, ConvColors(item.routeTypeCd._text, '1'), 150) 
                                }>{item.routeName._text}</Text>
                            </View>
                        </View>
                        <Text numberOfLines={1} style={{ 
                            ...global.fontSize == 0 ? ConvStyle(16, Colors.fontColor, 150) : global.fontSize == 1 ? ConvStyle(17, Colors.fontColor, 150) :ConvStyle(18, Colors.fontColor, 150) ,
                            lineHeight: 30 }}>
                            {item.regionName._text.length > 15 ? item.regionName._text.substring(0, 14) + '...' : item.regionName._text}
                        </Text>
                    </View>
                    <Text numberOfLines={1} style={{ 
                        ...global.fontSize == 0 ? ConvStyle(16, Colors.fontColor, 150) : global.fontSize == 1 ? ConvStyle(17, Colors.fontColor, 150) :ConvStyle(18, Colors.fontColor, 150) ,
                        lineHeight: 25 }}>{item.stStaNm._text} ~ {item.edStaNm._text}</Text>
                    <Text numberOfLines={1} style={{ 
                        ...ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.gray, 150), 
                        lineHeight: 25 }}>첫차 {item.upFirstTime ? item.upFirstTime._text : '-'}, 막차 {item.upLastTime ? item.upLastTime._text : '-'}, 배차 {item.npeekAlloc ? item.npeekAlloc._text : '-'}분</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export function RenderStationItem({ item, navigation }) {
    return (
        <View style={{
            paddingVertical: 7,
            backgroundColor: Colors.white,
            borderColor: Colors.borderColor,
            borderWidth: 0.7
        }}>
            <TouchableOpacity style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
            }}
                onPress={() => {
                    navigation.navigate('stationInfo', { data: item })
                }}
            >
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 30,
                    height: 30,
                    borderRadius: 20,
                    backgroundColor: Colors.fontColor,
                    marginHorizontal: 15,
                }}>
                    <MaIcon name="directions-bus" size={20} color={Colors.white} />
                </View>
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    flex: 1,
                    paddingRight: 15
                }}>
                    <Text numberOfLines={1} style={{ 
                        ...ConvStyle(global.fontSize == 0 ? 16 : global.fontSize == 1 ? 17 : 18, Colors.fontColor, 150), 
                        lineHeight: 30 }}>{item.stationName._text}</Text>
                    <Text style={{ 
                        ...ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.gray, 150), 
                        lineHeight: 25 }}>
                        {item.districtCd._text == 1 || item.districtCd._text == 3 ? item.mobileNoSi._text : item.mobileNo._text} | {item.regionName._text}
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export function RenderPoiItem({ item, navigation }) {
    return (
        <View style={{
            paddingVertical: 7,
            borderWidth: 0.7,
            borderColor: Colors.borderColor,
            backgroundColor: Colors.white,
        }}>
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}
                onPress={() => {
                    navigation.navigate('searchPoiMap', { positionInfo: item });
                }}
            >
                <MaIcon name="location-on" size={35} color={Colors.fontColor} style={{ paddingHorizontal: 15 }} />
                <View style={{ justifyContent: 'center', alignItems: 'flex-start', flex: 1 }}>
                    <Text numberOfLines={1} style={{ 
                        ...ConvStyle(global.fontSize == 0 ? 16 : global.fontSize == 1 ? 17 : 18, Colors.fontColor, 150), 
                        lineHeight: 25 }}>
                        {item.name}
                    </Text>
                    <Text numberOfLines={1} style={{ ...ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.gray, 150), lineHeight: 25 }}>
                        {item.upperAddrName + ' ' + item.middleAddrName + ' ' + item.lowerAddrName + ' ' + item.detailAddrName}
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default function SearchMain({ navigation, route }) {
    // const flatRef = useRef(null)
    const [text, setText] = useState(route.params.searchText)
    const [type, setType] = useState('route')
    const [selData, setSelData] = useState([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [totalPageRoute, setTotalPageRoute] = useState(null);

    useEffect(() => {
        insertHistorySearch(text)
    }, [])

    useEffect(() => {
        if (type == 'recent') {
            setSelData(global.historySearchs);
        }

        if (type == 'route') {
            RestAPI.getRouteList(20, pageIndex, text).then((res) => {
                if (res.response.msgHeader.resultCode._text == 0) {
                    setTotalPageRoute(res.response.msgBody.routeCount._text);
                    let data = [];
                    if (res.response.msgBody.routeCount._text == '1') {
                        data = [...selData, res.response.msgBody.routeList.busRouteList];
                    } else {
                        data = [...selData, ...res.response.msgBody.routeList.busRouteList];
                    }
                    setSelData(data);
                }
                showPageLoader(false)
            })
        }

        if (type == 'station') {
            RestAPI.getStationList(20, pageIndex, text).then((res) => {
                if (res.response.msgHeader.resultCode._text == 0) {
                    setTotalPageRoute(res.response.msgBody.stationCount._text)
                    let data = [];
                    if (res.response.msgBody.stationCount._text == '1') {
                        data = [...selData, res.response.msgBody.stationList.busStationList]
                    } else {
                        data = [...selData, ...res.response.msgBody.stationList.busStationList]
                    }
                    setSelData(data);
                }
                showPageLoader(false)
            })
        }
        if (type == 'poi') {
            RestAPI.getPoiList(text).then((res) => {
                if (res.hasOwnProperty('error')) {
                    setSelData([])
                } else {
                    setSelData(res.searchPoiInfo.pois.poi)
                }
                showPageLoader(false)
            })
        }

    }, [type, pageIndex])

    const getInitial = () => {
        if (type == 'route') {
            RestAPI.getRouteList(20, 1, text).then((res) => {
                if (res.response.msgHeader.resultCode._text == 0) {
                    setTotalPageRoute(res.response.msgBody.routeCount._text);
                    if (res.response.msgBody.routeCount._text == '1') {
                        setSelData([res.response.msgBody.routeList.busRouteList]);
                    } else {
                        setSelData(res.response.msgBody.routeList.busRouteList);
                    }
                }
                showPageLoader(false)
            })
        }
        if (type == 'station') {
            RestAPI.getStationList(20, 1, text).then((res) => {
                if (res.response.msgHeader.resultCode._text == 0) {
                    setTotalPageRoute(res.response.msgBody.stationCount._text)
                    if (res.response.msgBody.stationCount._text == '1') {
                        setSelData([res.response.msgBody.stationList.busStationList])
                    } else {
                        setSelData(res.response.msgBody.stationList.busStationList)
                    }
                }
                showPageLoader(false)
            })
        }
        if (type == 'poi') {
            RestAPI.getPoiList(text).then((res) => {
                if (res.hasOwnProperty('error')) {
                    setSelData([])
                } else {
                    setSelData(res.searchPoiInfo.pois.poi)
                }
                showPageLoader(false)
            })
        }

    }

    const insertHistorySearch = async (title) => {
        if (text == '') {
            return null
        }
        global.historySearchs.unshift({
            title: title
        })
        // await AsyncStorage.setItem('historySearchs', JSON.stringify(global.historyPois))
    }

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
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.body}>
                    <View style={styles.searchView}>
                        <TextInput
                            style={styles.search}
                            placeholder='정류소, 노선을 입력하세요'
                            value={text}
                            onChangeText={text => setText(text)}
                            onSubmitEditing={() => {
                                if (text == '') {
                                    Alert.alert('알림', '정류소, 노선을 입력하세요', [{ text: '확인' }])
                                    // setType('route')
                                    if (type == 'recent') setType('route')
                                    setSelData([])
                                    getInitial()
                                } else {
                                    // setType('route')
                                    if (type == 'recent') setType('route')
                                    setSelData([])
                                    getInitial()
                                    insertHistorySearch(text)
                                }
                            }}
                        />
                    </View>
                    <SearchTabBar
                        type={type}
                        setSel={(type) => {
                            setType(type)
                            setPageIndex(1)
                            setSelData([])
                        }}
                    />
                    <View style={{ flex: 1 }}>
                        <FlatList
                            // ref={flatRef}
                            data={selData}
                            ListHeaderComponent={
                                <View style={{ height: 10, backgroundColor: Colors.background }} />
                            }
                            ListEmptyComponent={
                                <View style={{ padding: 15, flexDirection: 'row', justifyContent: 'center' }}>
                                    <Text style={ConvStyle(18, Colors.fontColor, 150)}>
                                        검색결과가 비어있습니다.
                                    </Text>
                                </View>
                            }
                            renderItem={({ item, index, separators }) => {
                                if (type == 'route') {
                                    return <RenderBusItem item={item} navigation={navigation} />
                                }
                                if (type == 'station') {
                                    return <RenderStationItem item={item} navigation={navigation} />
                                }
                                if (type == 'poi') {
                                    return <RenderPoiItem item={item} navigation={navigation} />
                                }
                                if (type == 'recent') {
                                    return <RenderHistoryItem item={item} selHistory={() => {
                                        setText(item.title)
                                        setSelData([])
                                        setPageIndex(1)
                                        setType('route')
                                        insertHistorySearch(item.title)
                                    }} />
                                }
                            }}
                            refreshing={false}
                            onEndReachedThreshold={0.5}
                            onEndReached={(offset) => {
                                if (type == 'poi' || type == 'recent') { }
                                else {
                                    if (pageIndex < Math.ceil(totalPageRoute / 20)) {
                                        setPageIndex(pageIndex + 1)
                                    }
                                }
                            }}
                            keyExtractor={(item, index) => 'key' + index}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <SearchMainBottomTab navigation={navigation} backTab={() => {
                setType('route');
                setPageIndex(1);
                setSelData([]);
                navigation.goBack();
            }} />
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        marginBottom: Constants.BOTTOM_BAR_HEIGHT,
        backgroundColor: Colors.background,
    },
    searchView: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderColor: Colors.borderColor,
        borderBottomWidth: 0.5,
        backgroundColor: Colors.white,
    },
    search: {
        ...ConvStyle(15, Colors.dark, 140),
        borderColor: Colors.borderColor,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 5,
        flex: 1,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 5,
        borderColor: Colors.borderColor,
        borderWidth: 1,
        backgroundColor: Colors.white
    },
    selTabView: {
        borderBottomColor: Colors.blue,
        borderBottomWidth: 3,
        paddingHorizontal: 15,
        paddingVertical: 7
    },
    tabView: {
        paddingVertical: 7,
        paddingHorizontal: 15,
    },
    busRenderContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    busRenderContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingVertical: 10,
        paddingRight: 15
    },
    busRenderTopContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    busRenderTopLeftContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    }
})