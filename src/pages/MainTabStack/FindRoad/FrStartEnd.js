import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, TouchableWithoutFeedback, Keyboard, FlatList, Alert } from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import FIcon from 'react-native-vector-icons/FontAwesome';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import IoIcon from 'react-native-vector-icons/Ionicons';
import Geolocation from '@react-native-community/geolocation';
import { StackActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

import Constants, { ConvStyle, ConvStrToDate } from '../../../settings/Constants';
import Colors from '../../../settings/Colors';
import FrStartEndBottomTab from '../../GlobalComponents/BottomTabComponents/FrStartEndBottomTab';

// 검색이력 아이템
export class RenderItemHistory extends Component {
    render() {
        const { item, navigation, title } = this.props;
        return (
            <View
                style={{
                    paddingVertical: 5,
                    borderWidth: 0.5,
                    borderColor: Colors.borderColor,
                    backgroundColor: Colors.white
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        if (this.props.title == '출발지') {
                            global.startPOI = {
                                title: item.name,
                                address: item.address,
                                x: item.noorLon,
                                y: item.noorLat
                            }
                        } else {
                            global.endPOI = {
                                title: item.name,
                                address: item.address,
                                x: item.noorLon,
                                y: item.noorLat
                            }
                        }
                        navigation.goBack()
                    }}
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '80%' }}>
                        <MIcon name="history" size={25} color={Colors.fontColor} style={{ paddingHorizontal: 15 }} />
                        <View style={{ justifyContent: 'center', alignItems: 'flex-start', flex: 1 }}>
                            <Text numberOfLines={1} style={{ ...ConvStyle(18, Colors.fontColor, 150), lineHeight: 25 }}> {item.name} </Text>
                            <Text numberOfLines={1} style={{ ...ConvStyle(14, Colors.fontColor, 150), lineHeight: 25 }}> {item.address} </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('frSelMap', {
                                x: item.noorLon,
                                y: item.noorLat,
                                title: title
                            })
                        }}
                        style={{ justifyContent: 'center', alignItems: 'center', width: '20%' }}
                    >
                        <FAIcon name="map-marked-alt" size={25} color={Colors.fontColor} />
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>
        )
    }
}
// 출, 도착지로 선택하였됬거나 선택할수 있는 POI아이템
export class RenderItem extends Component {
    insertHistoryPoi = async (item) => {
        global.historyPois.unshift({
            name: item.name,
            address: item.upperAddrName + ' ' + item.middleAddrName + ' ' + item.lowerAddrName,
            noorLon: item.noorLon,
            noorLat: item.noorLat
        })
        await AsyncStorage.setItem('historyPois', JSON.stringify(global.historyPois))
    }
    render() {
        const { item, navigation } = this.props;
        return (
            <View
                style={{
                    paddingVertical: 10,
                    borderWidth: 0.5,
                    borderColor: Colors.borderColor,
                    backgroundColor: Colors.white
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        if (this.props.title == '출발지') {
                            global.startPOI = {
                                title: item.name,
                                address: item.upperAddrName + ' ' + item.middleAddrName + ' ' + item.lowerAddrName,
                                x: item.noorLon,
                                y: item.noorLat
                            }
                            this.insertHistoryPoi(item);
                        } else {
                            global.endPOI = {
                                title: item.name,
                                address: item.upperAddrName + ' ' + item.middleAddrName + ' ' + item.lowerAddrName,
                                x: item.noorLon,
                                y: item.noorLat
                            }
                            this.insertHistoryPoi(item);
                        }
                        navigation.goBack()
                    }}
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '80%' }}>
                        <MIcon name="search" size={25} color={Colors.fontColor} style={{ paddingHorizontal: 15 }} />
                        <View style={{ justifyContent: 'center', alignItems: 'flex-start', flex: 1 }}>
                            <Text numberOfLines={1} style={{ ...ConvStyle(global.fontSize == 0 ? 18 : global.fontSize == 1 ? 19 : 20, Colors.fontColor, 150), lineHeight: 25 }}>
                                {item.name}
                            </Text>
                            <Text numberOfLines={1} style={{ ...ConvStyle(global.fontSize == 0 ? 14 : global.fontSize == 1 ? 15 : 16, Colors.fontColor, 150), lineHeight: 25 }}>
                                {item.upperAddrName + ' ' + item.middleAddrName + ' ' + item.lowerAddrName + ' ' + item.detailAddrName}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('frSelMap', {
                                x: item.noorLon,
                                y: item.noorLat,
                                title: this.props.title
                            })
                        }}
                        style={{ justifyContent: 'center', alignItems: 'center', width: '20%' }}
                    >
                        <FAIcon name="map-marked-alt" size={25} color={Colors.fontColor} />
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>
        )
    }
}

export default class FrStartEnd extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initialPosition: 'unknown',
            searchWord: '',
            pois: null,
            historyPois: global.historyPois
        }
        this.searchPOI = this.searchPOI.bind(this);
    }

    // 현재위치의 좌표를 얻어낸다.
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

    // Tmap POI범용 검색 API사용
    searchPOI() {
        if (this.state.searchWord == '') {
            Alert.alert('알림', '검색어가 비어있습니다.', [{ text: '확인' }])
            return
        }
        let serverURL =
            `https://apis.openapi.sk.com/tmap/pois?version=1&format=json&callback=result&resCoordType=WGS84GEO&reqCoordType=WGS84GEO&count=10` +
            `&appKey=` + Constants.APP_KEY + `&searchKeyword=` + encodeURIComponent(this.state.searchWord);
        showPageLoader(true)
        return (
            fetch(serverURL, { method: 'GET' })
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                    } else {
                        // console.log(JSON.stringify(response, null, 4))
                        showPageLoader(false)
                    }
                }).then((json) => {
                    this.setState({ pois: json })
                    showPageLoader(false)
                }).catch((error) => {
                    this.setState({ pois: null })
                    console.log("error: ", error)
                }).finally(() => { showPageLoader(false) })
        )
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header
                    centerComponent={{
                        text: this.props.route.params.title,
                        style: ConvStyle(18, Colors.blue, 170)
                    }}
                    containerStyle={{
                        height: Constants.HEADER_BAR_HEIGHT,
                        backgroundColor: Colors.white
                    }}
                    leftComponent={
                        <TouchableOpacity
                            onPress={() => {
                                global.startPOI = null;
                                global.endPOI = null;
                                this.props.navigation.goBack();
                            }}
                        >
                            <IoIcon name="chevron-back" size={30} color={Colors.fontColor} />
                        </TouchableOpacity>
                    }
                />
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                    <View style={styles.body}>
                        <View style={{ backgroundColor: Colors.white }}>
                            <TextInput
                                placeholder='장소 또는 주소를 입력하세요'
                                autoFocus={true}
                                clearTextOnFocus={true}
                                style={{ ...ConvStyle(14, Colors.blue, 140), ...styles.input }}
                                onChangeText={text => this.setState({ searchWord: text })}
                                value={this.state.searchWord}
                                onSubmitEditing={this.searchPOI}
                            />
                        </View>
                        <View style={styles.ctrlView}>
                            {/* 현재위치를 그대로 넘긴다. */}
                            <TouchableOpacity
                                style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '33%' }}
                                onPress={() => {
                                    if (this.props.route.params.title == '출발지') {
                                        global.startPOI = {
                                            title: '현재위치',
                                            address: '현재위치',
                                            x: this.state.initialPosition.coords.longitude,
                                            y: this.state.initialPosition.coords.latitude
                                        }
                                    } else {
                                        global.endPOI = {
                                            title: '현재위치',
                                            address: '현재위치',
                                            x: this.state.initialPosition.coords.longitude,
                                            y: this.state.initialPosition.coords.latitude
                                        }
                                    }
                                    this.props.navigation.dispatch(StackActions.pop(1));
                                }}
                            >
                                <MIcon name="my-location" size={25} color={Colors.fontColor} />
                                <Text style={ConvStyle(14, Colors.fontColor, 150)}> 현재위치</Text>
                            </TouchableOpacity>

                            {/* 현재위치를 중심으로 지도에서 선택할수 잇게 지도를 현시한다. */}
                            <TouchableOpacity
                                style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', width: '34%' }}
                                onPress={() => {
                                    this.props.navigation.navigate('frSelMap', {
                                        x: this.state.initialPosition.coords.longitude,
                                        y: this.state.initialPosition.coords.latitude,
                                        title: this.props.route.params.title
                                    })
                                }}
                            >
                                <FAIcon name="map-marked-alt" size={20} color={Colors.fontColor} />
                                <Text style={ConvStyle(14, Colors.fontColor, 150)}> 지도에서 선택</Text>
                            </TouchableOpacity>

                            {/* 이력삭제 버튼 */}
                            {
                                this.state.pois ?
                                    null :
                                    <TouchableOpacity
                                        style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', width: '33%' }}
                                        onPress={() => {
                                            Alert.alert('알림', '검색이력을 삭제하시겠습니까?', [
                                                {
                                                    text: '취소',
                                                    onPress: ()=>{}
                                                },
                                                {
                                                    text: '확인',
                                                    onPress: () => {
                                                        this.setState({ historyPois: [] }, async () => {
                                                            global.historyPois = [];
                                                            await AsyncStorage.removeItem('historyPois')
                                                        })
                                                    }
                                                }
                                            ])
                                        }}
                                    >
                                        <MIcon name="history" size={25} color={Colors.fontColor} />
                                        <Text style={ConvStyle(14, Colors.fontColor, 150)}> 삭제</Text>
                                    </TouchableOpacity>
                            }

                        </View>

                        {/* 검색결과 또는 검색이력을 보여주는 목록을 현시한다. */}
                        <View style={{ flex: 1 }}>
                            <FlatList
                                data={this.state.pois ? this.state.pois.searchPoiInfo.pois.poi : this.state.historyPois}
                                ListEmptyComponent={
                                    <View style={{ padding: 15, flexDirection: 'row', justifyContent: 'center' }}>
                                        <Text style={ConvStyle(16, Colors.fontColor, 150)}>결과가 비어있습니다.</Text>
                                    </View>
                                }
                                renderItem={({ item, index, separators }) => {
                                    if (this.state.pois) {
                                        return (
                                            <RenderItem
                                                item={item}
                                                navigation={this.props.navigation}
                                                title={this.props.route.params.title}
                                            />
                                        )
                                    } else {
                                        return (
                                            <RenderItemHistory
                                                item={item}
                                                navigation={this.props.navigation}
                                                title={this.props.route.params.title}
                                            />
                                        )
                                    }
                                }}
                                ListHeaderComponent={
                                    <View style={{ height: 15 }} />
                                }
                                ListFooterComponent={
                                    <View style={{ height: 15 }} />
                                }
                                refreshing={false}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <FrStartEndBottomTab
                    navigation={this.props.navigation}
                    setPoi={() => {
                        this.props.navigation.navigate('frSelMap', {
                            x: this.state.initialPosition.coords.longitude,
                            y: this.state.initialPosition.coords.latitude,
                            title: this.props.route.params.title
                        })
                    }}
                    setCurrent={() => {
                        if (this.props.route.params.title == '출발지') {
                            global.startPOI = {
                                title: '현재위치',
                                x: this.state.initialPosition.coords.longitude,
                                y: this.state.initialPosition.coords.latitude
                            }
                        } else {
                            global.endPOI = {
                                title: '현재위치',
                                x: this.state.initialPosition.coords.longitude,
                                y: this.state.initialPosition.coords.latitude
                            }
                        }
                        this.props.navigation.dispatch(StackActions.pop(1));
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
    input: {
        borderColor: Colors.borderColor,
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 3,
        paddingHorizontal: 10,
        margin: 15
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    ctrlView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderColor: Colors.borderColor,
        borderWidth: 1,
        paddingHorizontal: 20,
        paddingVertical: 10
    }
})