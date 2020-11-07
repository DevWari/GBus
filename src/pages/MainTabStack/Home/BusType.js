import React, { Component, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaIcon from 'react-native-vector-icons/MaterialIcons';

import Constants, { ConvStyle, ConvBusType } from '../../../settings/Constants';
import Colors, {ConvColors} from '../../../settings/Colors';
import HomeBottomTab from '../../GlobalComponents/BottomTabComponents/HomeBottomTab';
import RestAPI from '../../../api/RestAPI';

export function ResultFindTab({ type, setSel }) {
    return (
        <View style={styles.tabContainer}>
            <TouchableOpacity onPress={() => {
                    if (setSel) {
                        setSel('nightBus')
                    }
                }}
                style={type == 'nightBus' ? styles.tabView : { padding: 10 }}
            >
                <Text style={ConvStyle(16, Colors.fontColor, 150)}>심야버스</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                    if (setSel) {
                        setSel('lowBus')
                    }
                }}
                style={type == 'lowBus' ? styles.tabView : { padding: 10 }}
            >
                <Text style={ConvStyle(16, Colors.fontColor, 150)}>저상버스</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                    if (setSel) {
                        setSel('outBus')
                    }
                }}
                style={type == 'outBus' ? styles.tabView : { padding: 10 }}
            >
                <Text style={ConvStyle(16, Colors.fontColor, 150)}>시외버스</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
                    if (setSel) {
                        setSel('airBus')
                    }
                }}
                style={type == 'airBus' ? styles.tabView : { padding: 10 }}
            >
                <Text style={ConvStyle(16, Colors.fontColor, 150)}>공항버스</Text>
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
                onPress={()=>{
                    navigation.navigate('realRoute', {data: item})
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
                                    <Text style={{ ...ConvStyle(14, Colors.white, 150), lineHeight: 25 }}>{ConvBusType(item.routeTypeCd._text)}</Text>
                                </View>
                                <Text style={ConvStyle(16, ConvColors(item.routeTypeCd._text, '1'), 150)}>{item.routeName._text}</Text>
                            </View>
                        </View>
                        <Text numberOfLines={1} style={{ ...ConvStyle(16, Colors.fontColor, 150), lineHeight: 30 }}>
                            {item.regionName._text.length > 15 ? item.regionName._text.substring(0,14)+ '...' : item.regionName._text}
                        </Text>
                    </View>
                    <Text numberOfLines={1} style={{ ...ConvStyle(16, Colors.fontColor, 150), lineHeight: 25 }}>{item.stStaNm._text} ~ {item.edStaNm._text}</Text>
                    <Text numberOfLines={1} style={{ ...ConvStyle(14, Colors.gray, 150), lineHeight: 25 }}>첫차 {item.upFirstTime ? item.upFirstTime._text: '-'}, 막차 {item.upLastTime ? item.upLastTime._text : '-'}, 배차 {item.npeekAlloc ? item.npeekAlloc._text : '-'}분</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export function HeaderTitle({title}) {
    return (
        <View style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            backgroundColor: Colors.background,
            paddingHorizontal: 10,
            paddingVertical: 5
        }} >
            <Text style={ConvStyle(14, Colors.fontColor, 150)}>{title}</Text>
        </View>
    )
}

export default function BusType({ route, navigation }) {
    const flatRef = useRef(null)
    const [type, setType] = useState('nightBus')
    const [selData, setSelData] = useState(null)

    useEffect(() => {
        try {
            flatRef.current?.scrollToOffset({
                animated: false,
                offset: 0
            })
        } catch (ex) { }
    }, [type])

    const getBusTypeData = (type) => {
        setSelData(null)
        showPageLoader(true)
        RestAPI.getBusType(type).then((res) => {
            if (res.response.msgHeader.resultCode._text == 0) {
                setSelData(res.response.msgBody.routeList.busRouteList)
            }
            showPageLoader(false)
        })
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header
                centerComponent={{
                    text: '버스유형',
                    style: ConvStyle(18, Colors.blue, 170)
                }}
                containerStyle={{
                    height: Constants.HEADER_BAR_HEIGHT,
                    backgroundColor: Colors.white
                }}
            />
            <View style={styles.body}>
                <ResultFindTab
                    type={type}
                    setSel={(type) => {
                        setType(type)
                        if (type == 'nightBus') {
                            setSelData(null)
                        } else if (type == 'lowBus') {
                            setSelData(null)
                        } else if (type == 'outBus') {
                            getBusTypeData('O')
                        } else if (type == 'airBus') {
                            getBusTypeData('A')
                        }
                    }}
                />
                <View style={{ flex: 1, backgroundColor: Colors.background }}>
                    <FlatList
                        ref={flatRef}
                        removeClippedSubviews={true}
                        legacyImplementation={true}
                        windowSize={50}
                        initialNumToRender={20}
                        data={selData}
                        ListHeaderComponent={()=> {
                                if(type == 'outBus') {
                                    return <HeaderTitle title={'시외버스(도착정보제공노선)'} />
                                } else if(type == 'airBus') {
                                    return <HeaderTitle title={'공항버스(도착정보제공노선)'} />
                                } else {
                                    return null
                                }
                            }
                        }
                        ListEmptyComponent={
                            <View style={{ padding: 15, flexDirection: 'row', justifyContent: 'center' }}>
                                <Text style={ConvStyle(16, Colors.fontColor, 150)}>
                                    검색결과가 비어있습니다.
                                </Text>
                            </View>
                        }
                        renderItem={({ item, index, separators }) => {
                            return <RenderBusItem item={item} navigation={navigation} />
                        }}
                        refreshing={false}
                        keyExtractor={(item, index) => 'key' + index}
                    />
                </View>
            </View>
            <HomeBottomTab navigation={navigation} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        marginBottom: Constants.BOTTOM_BAR_HEIGHT,
        backgroundColor: Colors.background,
    },
    tabContainer: {
        borderColor: Colors.borderColor,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tabView: {
        borderBottomColor: Colors.blue,
        borderBottomWidth: 3,
        padding: 10
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