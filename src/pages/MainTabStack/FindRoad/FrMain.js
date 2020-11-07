import React, { Component, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, TouchableWithoutFeedback, Keyboard, FlatList, ScrollView, Alert } from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContext } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-community/async-storage';

import FIcon from 'react-native-vector-icons/FontAwesome';
import IoIcon from 'react-native-vector-icons/Ionicons';
import MTIcon from 'react-native-vector-icons/MaterialIcons';

import Constants, { ConvStyle, getPrevColor, getColorFromSubway, getColorFromBus } from '../../../settings/Constants';
import Colors from '../../../settings/Colors';
import MainBottomTab from '../../GlobalComponents/BottomTabComponents/MainBottomTab';
import FrRestAPI from '../../../api/FrRestAPI';

import FrBusRow from './FrComponent/FrBusRow';
import FrSubwayRow from './FrComponent/FrSubwayRow';
import FrEndRow from './FrComponent/FrEndRow';

let convert = require('xml-js');

// 일반 및 지역길찾기 출, 도착지 정보입력창
export function FrGeneral({ navigation, start, end, changeStarEnd, onPressStart, onPressEnd }) {
    const [startPOI, setStartPOI] = useState(start)
    const [endPOI, setEndPOI] = useState(end)
    const [review, setReview] = useState(false)

    console.log("global historyReview: ", JSON.stringify(global.historyReview, null, 4));
    useEffect(() => {
        setStartPOI(start)
        setEndPOI(end)
    }, [start, end])
    useEffect(() => {

        if (startPOI && endPOI) {
            for (let i = 0; i < global.historyReview.length; i++) {
                if (global.historyReview[i].type == 'findRoad') {
                    if (global.historyReview[i].startPOI.title === startPOI.title &&
                        global.historyReview[i].endPOI.title === endPOI.title) {
                        setReview(true)
                    }
                }
            }
        } else {
            setReview(false)
        }
    }, [startPOI, endPOI])

    console.log("startPOI: ", startPOI);
    console.log("review============================: ", review)

    return (
        <View style={{ ...styles.frGeneralContainer, ...styles.shadow }}>
            <View style={styles.row}>
                <Text style={ConvStyle(16, Colors.fontColor, 150)}>출발: </Text>
                <TouchableOpacity
                    activeOpacity={1}
                    style={{ width: '75%' }}
                    onPress={() => {
                        if (onPressStart) {
                            onPressStart()
                        }
                    }}
                >
                    <TextInput
                        placeholder='장소 또는 주소를 입력하세요.'
                        numberOfLines={1}
                        style={{ ...ConvStyle(14, Colors.fontColor, 140), ...styles.input }}
                        value={startPOI ? startPOI.title : ''}
                        editable={false}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    if (changeStarEnd) {
                        changeStarEnd()
                    }
                }}>
                    <FIcon name="exchange" size={20} color={Colors.fontColor} style={{ transform: [{ rotate: '90deg' }] }} />
                </TouchableOpacity>
            </View>
            <View style={styles.row}>
                <Text style={ConvStyle(16, Colors.fontColor, 150)}>도착: </Text>
                <TouchableOpacity
                    activeOpacity={1}
                    style={{ width: '75%' }}
                    onPress={() => {
                        if (onPressEnd) {
                            onPressEnd()
                        }
                    }}
                >
                    <TextInput
                        placeholder='장소 또는 주소를 입력하세요.'
                        numberOfLines={1}
                        style={{ ...ConvStyle(14, Colors.fontColor, 140), ...styles.input }}
                        value={endPOI ? endPOI.title : ''}
                        editable={false}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={async () => {
                        if (startPOI && endPOI) {
                            if (!review) {
                                setReview(true)
                                global.historyReview.unshift({
                                    type: 'findRoad',
                                    startPOI: startPOI,
                                    endPOI: endPOI,
                                    memo: ''
                                })
                                await AsyncStorage.setItem('historyReview', JSON.stringify(global.historyReview))
                                Alert.alert('알림', '즐겨찾기에 추가되었습니다.', [{ text: '확인' }])

                            } else {
                                setReview(false)
                                for (let i = 0; i < global.historyReview.length; i++) {
                                    if (global.historyReview[i].type == 'findRoad') {
                                        if (global.historyReview[i].startPOI.title == startPOI.title
                                            && global.historyReview[i].endPOI.title == endPOI.title) {
                                            global.historyReview.splice(i, 1)
                                        }
                                    }
                                }
                                await AsyncStorage.setItem('historyReview', JSON.stringify(global.historyReview))
                                Alert.alert('알림', '즐겨찾기가 삭제되었습니다.', [{ text: '확인' }])

                            }
                        } else {
                            Alert.alert('알림', '길찾기 검색을 진행한후에 즐겨찾기를 할수 잇습니다!', [{ text: '확인' }])
                        }
                    }}
                >
                    {
                        review ?
                            <FIcon name="star" size={30} color={Colors.yellow} /> :
                            <FIcon name="star-o" size={30} color={Colors.borderColor} />
                    }
                </TouchableOpacity>
            </View>
        </View>
    )

}
export class FrArea extends Component {
    constructor(props) {
        super(props)
        this.state = {
            start: '',
            end: ''
        }
    }
    render() {
        const { searchAreaRoad } = this.props
        return (
            <View style={{ ...styles.frAreaContainer, ...styles.shadow }}>
                <View style={{
                    justifyContent: 'center',
                    width: '80%'
                }}>
                    <View style={styles.row}>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={{ width: '70%' }}
                            onPress={() => { alert('출발지') }}
                        >
                            <TextInput
                                placeholder='출발지를 입력하세요.'
                                style={{ ...ConvStyle(14, Colors.fontColor, 140), ...styles.input, marginRight: 5 }}
                                onChangeText={text => this.setState({ start: text })}
                                value={this.state.start}
                            />
                        </TouchableOpacity>
                        <Text style={ConvStyle(16, Colors.fontColor, 150)}>에서</Text>
                    </View>
                    <View style={styles.row}>
                        <TouchableOpacity
                            activeOpacity={1}
                            style={{ width: '70%' }}
                            onPress={() => { alert('도착지') }}
                        >
                            <TextInput
                                placeholder='도착지를 입력하세요.'
                                style={{ ...ConvStyle(14, Colors.fontColor, 140), ...styles.input, marginRight: 5 }}
                                onChangeText={text => this.setState({ end: text })}
                                value={this.state.end}
                            />
                        </TouchableOpacity>
                        <Text style={ConvStyle(16, Colors.fontColor, 150)}>가는길</Text>
                    </View>
                </View>
                <TouchableOpacity style={{ ...styles.areaSearchIcon, ...styles.shadow }}
                    onPress={() => {
                        Keyboard.dismiss();
                        if (searchAreaRoad) {
                            if (this.state.start == '' || this.state.end == '') {
                                Alert.alert('알림', '출발지와 도착지를 입력해주세요.', [{ text: '확인' }]);
                            } else {
                                searchAreaRoad(this.state.start, this.state.end);
                            }
                        }
                    }}
                >
                    <Image source={require('../../../../assets/findRoad/area_search.png')} style={{ width: 30, height: 30, resizeMode: 'contain' }} />
                </TouchableOpacity>
            </View>
        )
    }
}


// 최근검색 내역 목록뷰
export class RenderItem extends Component {
    render() {
        const { item } = this.props;
        return (
            <View style={{
                borderColor: Colors.borderColor,
                borderWidth: 0.5,
                backgroundColor: Colors.white
            }}>
                <TouchableOpacity style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',

                }}
                    onPress={() => {
                        global.startPOI = {
                            title: item.sTitle,
                            address: item.sAddress,
                            x: item.sX,
                            y: item.sY
                        }
                        global.endPOI = {
                            title: item.eTitle,
                            address: item.eAddress,
                            x: item.eX,
                            y: item.eY
                        }
                        if (this.props.selHistoryRoads) {
                            this.props.selHistoryRoads()
                        }
                    }}
                >
                    <MTIcon name="directions" size={35} color={Colors.fontColor} style={{ padding: 10 }} />
                    <Text
                        numberOfLines={1}
                        style={{ ...ConvStyle(global.fontSize == 0 ? 16 : global.fontSize == 1 ? 17 : 18, Colors.fontColor, 150), width: 120 }}
                    >
                        {item.sTitle}
                    </Text>
                    <Text> {'  -->  '} </Text>
                    <Text
                        numberOfLines={1}
                        style={{ ...ConvStyle(global.fontSize == 0 ? 16 : global.fontSize == 1 ? 17 : 18, Colors.fontColor, 150), width: 120 }}
                    >
                        {item.eTitle}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}
export class RecentHistory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            historyRoads: global.historyRoads
        }
    }
    render() {
        const { navigation } = this.props;
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                <View style={{ flex: 1, marginBottom: Constants.BOTTOM_BAR_HEIGHT, backgroundColor: Colors.background }}>
                    <View style={{ ...styles.delView, ...styles.shadow }}>
                        <Text style={{ ...ConvStyle(16, Colors.fontColor, 150), padding: 7 }}>최근 검색</Text>
                        <TouchableOpacity style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 7
                        }}
                            onPress={() => {
                                Alert.alert('알림', '검색이력을 삭제하시겠습니까?', [
                                    {
                                        text: '취소',
                                        onPress: () => { }
                                    },
                                    {
                                        text: '확인',
                                        onPress: () => {
                                            this.setState({ historyRoads: [] }, async () => {
                                                global.historyRoads = [];
                                                await AsyncStorage.removeItem('historyRoads')
                                            })
                                        }
                                    }
                                ])
                            }}
                        >
                            <MTIcon name="history" size={25} color={Colors.fontColor} style={{ paddingRight: 5 }} />
                            <Text style={ConvStyle(16, Colors.fontColor, 150)}>삭제</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.listView}>
                        <FlatList
                            data={this.state.historyRoads}
                            ListHeaderComponent={
                                <View style={{ height: 10, backgroundColor: Colors.background }} />
                            }
                            ListEmptyComponent={
                                <View style={{ padding: 15, flexDirection: 'row', justifyContent: 'center' }}>
                                    <Text style={ConvStyle(16, Colors.fontColor, 150)}>검색결과가 존재하지 않습니다.</Text>
                                </View>
                            }
                            renderItem={({ item, index, separators }) => {
                                return (
                                    <RenderItem key={index} item={item} selHistoryRoads={() => {
                                        if (this.props.selHistoryRoads) {
                                            this.props.selHistoryRoads()
                                        }
                                    }} />
                                )
                            }}
                            refreshing={false}
                            keyExtractor={(item, index) => 'key' + index}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}


// 길찾기 결과 현시 목록뷰
export class ResultFindTab extends Component {

    render() {
        const { type, data, setSel } = this.props;
        let busCount = data.hasOwnProperty('bus') ? 
            Array.isArray(data.bus) ? data.bus.length : 1 : 0;
        let subwayCount = data.hasOwnProperty('subway') ? 
            Array.isArray(data.subway) ? data.subway.length : 1 : 0;
        let transferCount = data.hasOwnProperty('transfer') ? 
            Array.isArray(data.transfer) ? data.transfer.length : 1 : 0;
        let allCount = busCount + subwayCount + transferCount;

        return (
            <View style={{ ...styles.delView, ...styles.shadow }}>
                <TouchableOpacity
                    onPress={() => {
                        if (setSel) {
                            setSel('all')
                        }
                    }}
                    style={type == 'all' ? styles.tabView : { padding: 7 }}
                >
                    <Text style={ConvStyle(16, Colors.fontColor, 150)}>
                        전체 {allCount}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        if (setSel) {
                            setSel('bus')
                        }
                    }}
                    style={type == 'bus' ? styles.tabView : { padding: 7 }}
                >
                    <Text style={ConvStyle(16, Colors.fontColor, 150)}>
                        버스 {busCount}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        if (setSel) {
                            setSel('subway')
                        }
                    }}
                    style={type == 'subway' ? styles.tabView : { padding: 7 }}
                >
                    <Text style={ConvStyle(16, Colors.fontColor, 150)}>
                        지하철 {subwayCount}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        if (setSel) {
                            setSel('transfer')
                        }
                    }}
                    style={type == 'transfer' ? styles.tabView : { padding: 7 }}
                >
                    <Text style={ConvStyle(16, Colors.fontColor, 150)}>
                        버스+지하철 {transferCount}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}
export function ResultFind(props) {
    const flatRef = useRef(null);
    const [type, setType] = useState('all');
    const [selData, setData] = useState(
        [
            ...props.data.hasOwnProperty('bus') ? 
                Array.isArray(props.data.bus) ? props.data.bus : [props.data.bus] : [],
            ...[
                ...props.data.hasOwnProperty('subway') ? 
                Array.isArray(props.data.subway) ? props.data.subway : [props.data.subway] : [],
                ...props.data.hasOwnProperty('transfer') ? 
                Array.isArray(props.data.transfer) ? props.data.transfer : [props.data.transfer] : []
            ]
        ]
    );

    useEffect(() => {
        if (type == 'all') {
            setData([
                ...props.data.hasOwnProperty('bus') ? 
                Array.isArray(props.data.bus) ? props.data.bus : [props.data.bus] : [],
                ...[
                    ...props.data.hasOwnProperty('subway') ? 
                    Array.isArray(props.data.subway) ? props.data.subway : [props.data.subway] : [],
                    ...props.data.hasOwnProperty('transfer') ? 
                    Array.isArray(props.data.transfer) ? props.data.transfer : [props.data.transfer] : []
                ]
            ])
        }
        if (type == 'bus') {
            setData(props.data.hasOwnProperty('bus') ? 
            Array.isArray(props.data.bus) ? props.data.bus : [props.data.bus] : [])
        }
        if (type == 'subway') {
            setData(props.data.hasOwnProperty('subway') ? 
            Array.isArray(props.data.subway) ? props.data.subway : [props.data.subway] : [])
        }
        if (type == 'transfer') {
            setData(props.data.hasOwnProperty('transfer') ? 
            Array.isArray(props.data.transfer) ? props.data.transfer : [props.data.transfer] : [])
        }
        try {
            flatRef.current?.scrollToOffset({
                animated: false,
                offseet: 0
            })
        } catch (ex) { }
    }, [type, props])

    return (
        // <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
            <View style={{ flexGrow: 1, marginBottom: Constants.BOTTOM_BAR_HEIGHT }}>
                <ResultFindTab
                    type={type}
                    setSel={(type) => {
                        setType(type)
                        if (type == 'all') {
                            setData([
                                ...props.data.hasOwnProperty('bus') ?
                                    Array.isArray(props.data.bus) ? props.data.bus : [props.data.bus] : [],
                                ...[
                                    ...props.data.hasOwnProperty('subway') ?
                                        Array.isArray(props.data.subway) ? props.data.subway : [props.data.subway] : [],
                                    ...props.data.hasOwnProperty('transfer') ?
                                        Array.isArray(props.data.transfer) ? props.data.transfer : [props.data.transfer] : []
                                ]
                            ])
                        }
                        if (type == 'bus') {
                            setData(props.data.hasOwnProperty('bus') ? 
                            Array.isArray(props.data.bus) ? props.data.bus : [props.data.bus] : [])
                        }
                        if (type == 'subway') {
                            setData(props.data.hasOwnProperty('subway') ? 
                            Array.isArray(props.data.subway) ? props.data.subway : [props.data.subway] : [])
                        }
                        if (type == 'transfer') {
                            setData(props.data.hasOwnProperty('transfer') ? 
                            Array.isArray(props.data.transfer) ? props.data.transfer : [props.data.transfer] : [])
                        }
                    }}
                    data={props.data}
                />
                <View style={styles.listView}>
                    <FlatList
                        style={{flex:1}}
                        ref={flatRef}
                        removeClippedSubviews={true}
                        legacyImplementation={true}
                        windowSize={50}
                        initialNumToRender={5}
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
                            return (
                                <RenderResultItem key={index} item={item} navigation={props.navigation} start={props.start} end={props.end} />
                            )
                        }}
                        refreshing={false}
                        keyExtractor={(item, index) => 'key' + index}
                    />
                </View>
            </View>
        // </TouchableWithoutFeedback>
    )
}
export class RenderResultItem extends Component {
    render() {
        const { item, navigation, start, end } = this.props
        const itemArray = [];

        if (item.path.hasOwnProperty('Start')) {
            itemArray.push(item.path.Start)
        }

        if (item.path.hasOwnProperty('ExChange')) {
            if (Array.isArray(item.path.ExChange)) {
                item.path.ExChange.map((itemEx, index) => {
                    itemArray.push(itemEx)
                })
            } else {
                itemArray.push(item.path.ExChange)
            }
        }

        itemArray.sort((a, b) => {
            return Number(a.pathIndex._text) - Number(b.pathIndex._text)
        })

        return (
            <View style={{
                flexDirection: 'column',
                padding: 10,
                borderColor: Colors.borderColor,
                borderWidth: 1,
                backgroundColor: Colors.white,
                justifyContent: 'center',
                marginBottom: 15,
                ...styles.shadow
            }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    padding: 10,
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                    }}>
                        <Text style={ConvStyle(global.fontSize == 0 ? 16 : global.fontSize == 1 ? 17 : 18, Colors.fontColor, 150)}>약 {item.time._cdata}분 | {item.distance._cdata} | 약 {item.payment._cdata} 원</Text>
                    </View>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('frDetailPage', { data: item })
                    }}>
                        <IoIcon name="map" size={25} color={Colors.fontColor} />
                    </TouchableOpacity>
                </View>

                <View style={{
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    borderWidth: 0.7,
                    borderColor: Colors.borderColor
                }}>
                    {
                        item.path.Start.moveType._cdata == 'Bus' ?
                            <FrBusRow beforeColor={'transparent'} selfColor={getColorFromBus(item.path.Start.lane.type._cdata)} item={item.path.Start} /> :
                            <FrSubwayRow beforeColor={'transparent'} selfColor={getColorFromSubway(item.path.Start.laneAlias._cdata)} item={item.path.Start} />
                    }
                    {
                        item.path.hasOwnProperty('ExChange') ?
                            Array.isArray(item.path.ExChange) ?
                                item.path.ExChange.map((item, index) => {
                                    return (
                                        item.moveType._cdata == 'Bus' ?
                                            <FrBusRow key={'innerIndex'+index}
                                                beforeColor={getPrevColor(item.pathIndex._text, itemArray)}
                                                selfColor={getColorFromBus(item.lane.type._cdata)}
                                                item={item} /> :
                                            <FrSubwayRow key={'innerIndex'+index}
                                                beforeColor={getPrevColor(item.pathIndex._text, itemArray)}
                                                selfColor={getColorFromSubway(item.laneAlias._cdata)}
                                                item={item} />
                                    )
                                }) :
                                item.path.ExChange.moveType._cdata == 'Bus' ?
                                    <FrBusRow
                                        beforeColor={getPrevColor(item.path.ExChange.pathIndex._text, itemArray)}
                                        selfColor={getColorFromBus(item.path.ExChange.lane.type._cdata)}
                                        item={item.path.ExChange} /> :
                                    <FrSubwayRow
                                        beforeColor={getPrevColor(item.path.ExChange.pathIndex._text, itemArray)}
                                        selfColor={getColorFromSubway(item.path.ExChange.laneAlias._cdata)}
                                        item={item.path.ExChange} />
                            : null

                    }
                    <FrEndRow
                        beforeColor={
                            itemArray[itemArray.length - 1].moveType._cdata == 'Bus' ?
                                getColorFromBus(itemArray[itemArray.length - 1].lane.type._cdata) :
                                getColorFromSubway(itemArray[itemArray.length - 1].laneAlias._cdata)
                        }
                        item={item.path.End.exName._cdata} />
                </View>
            </View>
        )
    }
}
export class ResultFindClass extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: 'all',
            selData: []
        }
        this.flatRef = React.createRef();
    }

    componentDidMount() {
        this.setState({
            selData:
                [
                    ...this.props.data.hasOwnProperty('bus') ? this.props.data.bus : [],
                    ...[
                        ...this.props.data.hasOwnProperty('subway') ? this.props.data.subway : [],
                        ...this.props.data.hasOwnProperty('transfer') ? this.props.data.transfer : []
                    ]
                ]
        }, this.ScrollToTop);
    }

    ScrollToTop = () => {
        try {
            this.flatRef.current?.scrollToOffset({
                animated: false,
                offseet: 0
            })
        } catch (ex) { }
    }

    render() {
        const { data, start, end, navigation } = this.props;
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
                <View style={{ flex: 1, marginBottom: Constants.BOTTOM_BAR_HEIGHT }}>
                    <ResultFindTab
                        type={this.state.type}
                        setSel={(type) => {
                            this.setState({ type: type }, () => {
                                if (type == 'all') {
                                    this.setState({
                                        selData:
                                            [
                                                ...data.hasOwnProperty('bus') ? data.bus : [],
                                                ...[
                                                    ...data.hasOwnProperty('subway') ? data.subway : [],
                                                    ...data.hasOwnProperty('transfer') ? data.transfer : []
                                                ]
                                            ]
                                    }, this.ScrollToTop);
                                }
                                if (type == 'bus') {
                                    this.setState({ selData: data.hasOwnProperty('bus') ? data.bus : [] }, this.ScrollToTop);
                                }
                                if (type == 'subway') {
                                    this.setState({ selData: data.hasOwnProperty('subway') ? data.subway : [] }, this.ScrollToTop);
                                }
                                if (type == 'transfer') {
                                    this.setState({ selData: data.hasOwnProperty('transfer') ? data.transfer : [] }, this.ScrollToTop);
                                }
                            })
                        }}
                        data={this.props.data}
                    />
                    <View style={styles.listView}>
                        <FlatList
                            ref={this.flatRef}
                            removeClippedSubviews={true}
                            legacyImplementation={true}
                            windowSize={50}
                            initialNumToRender={10}
                            data={this.state.selData}
                            extraData={this.props.data}
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
                                return (
                                    <RenderResultItem key={index} item={item} navigation={navigation} start={start} end={end} />
                                )
                            }}
                            refreshing={false}
                            keyExtractor={(item, index) => 'key' + index}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

// 메인 뷰
export default class FrMain extends Component {
    static contextType = NavigationContext
    constructor(props) {
        super(props)

        this.scrollRef = React.createRef();
        this.state = {
            getCityDo: null,
            initialPosition: 'unknown',
            title: '길찾기',
            startPOI: null,
            endPOI: null,
            paths: null,
            areaStartArr: null,
            areaEndArr: null,
        }
        this.searchRoad = this.searchRoad.bind(this);
    }

    // 일반길찾기에서 지역간 길찾기 스크롤 제목변경
    handleScroll = (event) => {
        if (event.nativeEvent.contentOffset.x < Constants.WINDOW_WIDTH / 2) {
            this.setState({ title: '길찾기' })
        } else {
            this.setState({ title: '지역간 길찾기' })
        }
    }

    // 출, 도착지점이 결정되면 자동으로 두 지점사이에 길찾기 API를 호출한다.
    searchRoad() {
        let serverURL = `https://topopen.tmap.co.kr/tmap/gg/transit/pathfind?appKey=` + Constants.APP_KEY + `&version=1&format=xml&bizAppId=` + Constants.BIZ_APP_ID + `&reqCoordType=` + Constants.COORD_TYPE + `&resCoordType=` + Constants.COORD_TYPE + `&sX=` + this.state.startPOI.x + `&sY=` + this.state.startPOI.y + `&eX=` + this.state.endPOI.x + `&eY=` + this.state.endPOI.y;
        showPageLoader(true);
        console.log("serverURL", serverURL);
        return (
            fetch(serverURL, { method: 'GET' })
                .then(response => response.text().then(text => {
                    let res = JSON.parse(convert.xml2json(text, { compact: true, spaces: 4 }));
                    console.log("this is the test result", JSON.stringify(res.PathFind.transfer[2], null, 4))
                    if (Number(res?.PathFind?.pointDistance._cdata) < 800) {
                        Alert.alert('알림', '출발지와 도착지의 거리가 800m미만인 경우 대중교통 길찾기 결과를 제공하지 않습니다.', [{ text: '확인' }]);
                        this.setState({ paths: {} })
                    } else {
                        this.setState({ paths: res?.PathFind })
                    }
                    showPageLoader(false);
                }))
                .catch((error) => {
                    console.log(error)
                    this.setState({ paths: null })
                    showPageLoader(false);
                })
                .finally(() => {
                    global.startPOI = null;
                    global.endPOI = null;
                    this.insertHistoryRoad(this.state.startPOI, this.state.endPOI);
                    showPageLoader(false)
                })
        )
    }
    // 지역간 길찾기에서 출, 도착지점이 결정되면 일반길찾기를 적용하는 API.
    searchRoadFromArea(sX, sY, eX, eY) {
        let serverURL = `https://topopen.tmap.co.kr/tmap/gg/transit/pathfind?appKey=` + Constants.APP_KEY + `&version=1&format=xml&bizAppId=` + Constants.BIZ_APP_ID + `&reqCoordType=` + Constants.COORD_TYPE + `&resCoordType=` + Constants.COORD_TYPE + `&sX=` + sX + `&sY=` + sY + `&eX=` + eX + `&eY=` + eY;
        console.log('searchRoadFromArea url is: ', serverURL)
        showPageLoader(true);
        return (
            fetch(serverURL, { method: 'GET' })
                .then(response => response.text().then(text => {
                    let res = JSON.parse(convert.xml2json(text, { compact: true, spaces: 4 }));
                    // console.log("this is the test result", JSON.stringify(res.PathFind.transfer[2], null, 4))
                    if (Number(res?.PathFind?.pointDistance._cdata) < 800) {
                        Alert.alert('알림', '출발지와 도착지의 거리가 800m미만인 경우 대중교통 길찾기 결과를 제공하지 않습니다.', [{ text: '확인' }]);
                        this.setState({ paths: {} })
                    } else {
                        this.setState({ paths: res?.PathFind })
                    }
                    showPageLoader(false);
                }))
                .catch((error) => {
                    console.log(error)
                    this.setState({ paths: {} })
                    showPageLoader(false);
                })
                .finally(() => {
                    // global.startPOI = null;
                    // global.endPOI = null;
                    // this.insertHistoryRoad(this.state.startPOI, this.state.endPOI);
                    showPageLoader(false)
                })
        )
    }

    // 이력을 로콜에 보관하는 함수
    insertHistoryRoad = async (s, e) => {
        global.historyRoads.unshift({
            sTitle: s.title,
            eTitle: e.title,
            sAddress: s.address,
            eAddress: e.address,
            sX: s.title == '현재위치' ? this.state.initialPosition.coords.longitude : s.x,
            sY: s.title == '현재위치' ? this.state.initialPosition.coords.latitude : s.y,
            eX: e.title == '현재위치' ? this.state.initialPosition.coords.longitude : e.x,
            eY: e.title == '현재위치' ? this.state.initialPosition.coords.latitude : e.y
        })
        await AsyncStorage.setItem('historyRoads', JSON.stringify(global.historyRoads))
    }

    componentDidMount() {
        const navigation = this.context
        Geolocation.getCurrentPosition(
            position => {
                const initialPosition = position;
                this.setState({ initialPosition: initialPosition })
            },
            error => console.log('Error: ', JSON.stringify(error)),
            { enableHighAccuracy: false }
        )
        this._unsubscribe = navigation.addListener('focus', () => {
            if (global.startPOI) {
                this.setState({ startPOI: global.startPOI }, () => {
                    if (global.endPOI) {
                        this.setState({ endPOI: global.endPOI }, () => {
                            this.searchRoad()
                        })
                    } else {
                        Alert.alert('알림', '도착지를 입력해주세요.', [{ text: '확인' }])
                    }
                })
            }
        })
    }
    componentWillUnmount() {
        this._unsubscribe();
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header
                    centerComponent={{
                        text: this.state.title,
                        style: ConvStyle(18, Colors.blue, 170)
                    }}
                    containerStyle={{
                        height: Constants.HEADER_BAR_HEIGHT,
                        backgroundColor: Colors.white
                    }}
                />

                <View style={{
                    width: Constants.WINDOW_WIDTH
                }}>
                    <ScrollView style={{ backgroundColor: Colors.background }}
                        ref={this.scrollRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        decelerationRate={0}
                        snapToAlignment={"center"}
                        snapToInterval={Constants.WINDOW_WIDTH}
                        keyboardShouldPersistTaps='handled'
                        onScroll={this.handleScroll}
                    >
                        <FrGeneral
                            navigation={this.props.navigation}
                            start={this.state.startPOI}
                            end={this.state.endPOI}
                            onPressStart={() => {
                                this.setState({
                                    startPOI: null,
                                    endPOI: null,
                                    paths: null
                                }, () => {
                                    this.props.navigation.navigate('frStartEnd', { title: '출발지' })
                                })
                            }}
                            onPressEnd={() => {
                                if (!global.startPOI) {
                                    this.setState({
                                        startPOI: null,
                                        endPOI: null
                                    }, ()=> {
                                        Alert.alert('알림', '출발지를 다시 입력해주세요.', [{ text: '확인' }])
                                    })
                                } else {
                                    this.setState({
                                        paths: null
                                    }, ()=>{
                                        this.props.navigation.navigate('frStartEnd', { title: '도착지' })
                                    })
                                }
                            }}
                            changeStarEnd={() => {
                                if (this.state.startPOI == null && this.state.endPOI == null) {
                                    Alert.alert('알림', '출, 도착점을 입력해주세요.', [{ text: '확인' }])
                                } else if (this.state.startPOI == null && this.state.endPOI) {
                                    global.startPOI = global.endPOI;
                                    global.endPOI = null;
                                    this.setState({
                                        startPOI: this.state.endPOI,
                                        endPOI: null
                                    })
                                    Alert.alert('알림', '도착지를 입력해주세요.', [{ text: '확인' }])
                                } else if (this.state.endPOI == null && this.state.startPOI) {
                                    global.endPOI = global.startPOI;
                                    global.startPOI = null
                                    this.setState({
                                        startPOI: null,
                                        endPOI: this.state.startPOI
                                    })
                                    Alert.alert('알림', '출발지를 입력해주세요.', [{ text: '확인' }])
                                } else {
                                    global.startPOI = global.endPOI;
                                    global.endPOI = global.startPOI;
                                    this.setState({
                                        startPOI: this.state.endPOI,
                                        endPOI: this.state.startPOI
                                    }, () => {
                                        this.searchRoad()
                                    })
                                }
                            }}
                        />
                        <FrArea
                            searchAreaRoad={(start, end) => {
                                FrRestAPI.getCityName(
                                    this.state.initialPosition == 'unknown' ? 126.97357177734416 : this.state.initialPosition.coords.longitude , 
                                    this.state.initialPosition == 'unknown' ? 37.45051365242391 : this.state.initialPosition.coords.latitude
                                ).then(async (json) => {
                                // 126.97357177734416, 37.45051365242391 - 경기도 임의의 좌표
                                    console.log("result", json)
                                    if (json == null) {
                                        Alert.alert('알림', '현재 자기위치를 확인해주십시오.', [{ text: '확인' }])
                                    } else {
                                        if (json == '서울특별시') {
                                            let promise1 = () => new Promise((resolve, reject) => {
                                                FrRestAPI.getPOISeoul(start).then((json) => {
                                                    if (json == null) {
                                                        FrRestAPI.getPOIGyong(start).then((json) => {
                                                            if (json == null) {
                                                                FrRestAPI.getPOIAll(start).then((json) => {
                                                                    if (json == null) {
                                                                        Alert.alert('알림', '출발지점과 지명이 겹치는 지역이 존재하지 않습니다.', [{ text: '확인' }]);
                                                                        reject()
                                                                    }
                                                                    else {
                                                                        resolve(json)
                                                                    }
                                                                })
                                                            }
                                                            else {
                                                                resolve(json)
                                                            }
                                                        })
                                                    }
                                                    else {
                                                        resolve(json)
                                                    }
                                                })

                                            })

                                            let promise2 = () => new Promise((resolve, reject) => {
                                                FrRestAPI.getPOISeoul(end).then((json) => {
                                                    if (json == null) {
                                                        FrRestAPI.getPOIGyong(end).then((json) => {
                                                            if (json == null) {
                                                                FrRestAPI.getPOIAll(end).then((json) => {
                                                                    if (json == null) {
                                                                        Alert.alert('알림', '도착지점과 지명이 겹치는 지역이 존재하지 않습니다.', [{ text: '확인' }]);
                                                                        reject()
                                                                    }
                                                                    else {
                                                                        resolve(json)
                                                                    }
                                                                })
                                                            }
                                                            else {
                                                                resolve(json)
                                                            }
                                                        })
                                                    } else {
                                                        resolve(json)
                                                    }
                                                })
                                            })

                                            try {
                                                let res = await promise1();
                                                let res2 = await promise2();
                                                this.setState({
                                                    areaStartArr: res,
                                                    areaEndArr: res2
                                                }, () => {
                                                    this.searchRoadFromArea(
                                                        this.state.areaStartArr.findPoiAreaDataByNameInfo.dongInfo[0].resLon,
                                                        this.state.areaStartArr.findPoiAreaDataByNameInfo.dongInfo[0].resLat,
                                                        this.state.areaEndArr.findPoiAreaDataByNameInfo.dongInfo[0].resLon,
                                                        this.state.areaEndArr.findPoiAreaDataByNameInfo.dongInfo[0].resLat,
                                                    )
                                                })
                                            } catch (ex) { console.log(ex) }

                                        } else {
                                            console.log("this is gyonggi")
                                            let promise1 = () => new Promise((resolve, reject) => {
                                                FrRestAPI.getPOIGyong(start).then((json) => {
                                                    console.log("this is gyonggi result: ", json)
                                                    if (json == null) {
                                                        FrRestAPI.getPOISeoul(start).then((json) => {
                                                            if (json == null) {
                                                                FrRestAPI.getPOIAll(start).then((json) => {
                                                                    if (json == null) {
                                                                        Alert.alert('알림', '출발지점과 지명이 겹치는 지역이 존재하지 않습니다.', [{ text: '확인' }]);
                                                                        reject()
                                                                    }
                                                                    else {
                                                                        resolve(json)
                                                                    }
                                                                })
                                                            }
                                                            else {
                                                                resolve(json)
                                                            }
                                                        })
                                                    }
                                                    else {
                                                        resolve(json)
                                                    }
                                                })

                                            })

                                            let promise2 = () => new Promise((resolve, reject) => {
                                                FrRestAPI.getPOIGyong(end).then((json) => {
                                                    if (json == null) {
                                                        FrRestAPI.getPOISeoul(end).then((json) => {
                                                            if (json == null) {
                                                                FrRestAPI.getPOIAll(end).then((json) => {
                                                                    if (json == null) {
                                                                        Alert.alert('알림', '도착지점과 지명이 겹치는 지역이 존재하지 않습니다.', [{ text: '확인' }]);
                                                                        reject()
                                                                    }
                                                                    else {
                                                                        resolve(json)
                                                                    }
                                                                })
                                                            }
                                                            else {
                                                                resolve(json)
                                                            }
                                                        })
                                                    } else {
                                                        resolve(json)
                                                    }
                                                })
                                            })

                                            try {
                                                let res = await promise1();
                                                console.log("promise 1 result: ", res)
                                                let res2 = await promise2();
                                                this.setState({
                                                    areaStartArr: res,
                                                    areaEndArr: res2
                                                }, () => {
                                                    this.searchRoadFromArea(
                                                        this.state.areaStartArr.findPoiAreaDataByNameInfo.dongInfo[0].resLon,
                                                        this.state.areaStartArr.findPoiAreaDataByNameInfo.dongInfo[0].resLat,
                                                        this.state.areaEndArr.findPoiAreaDataByNameInfo.dongInfo[0].resLon,
                                                        this.state.areaEndArr.findPoiAreaDataByNameInfo.dongInfo[0].resLat,
                                                    )
                                                })
                                            } catch (ex) { console.log(ex) }
                                        }
                                    }
                                })
                            }}
                        />
                    </ScrollView>
                </View>
                
                {/* 최근 검색 현시목록 및 결과현시 목록 */}
                {
                    this.state.paths == null ?
                        <RecentHistory
                            navigation={this.props.navigation}
                            selHistoryRoads={() => {
                                this.setState({
                                    startPOI: global.startPOI,
                                    endPOI: global.endPOI
                                }, () => {
                                    this.searchRoad()
                                })
                            }}
                        /> :
                        <ResultFind
                            data={this.state.paths}
                            navigation={this.props.navigation}
                            start={this.state.startPOI}
                            end={this.state.endPOI}
                        />
                }

                {/* 길찾기 결과 현시목록 */}
                <MainBottomTab selTab="findRoad" navigation={this.props.navigation} />
            </SafeAreaView>
        )
    }
}
// 스타일 정의부분
const styles = StyleSheet.create({
    frGeneralContainer: {
        justifyContent: 'center',
        marginRight: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        paddingLeft: 20,
        paddingRight: 10,
        paddingVertical: 5,
        width: Constants.WINDOW_WIDTH - 30
    },
    frAreaContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginVertical: 10,
        borderWidth: 1,
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        paddingLeft: 20,
        paddingRight: 10,
        paddingVertical: 5,
        width: Constants.WINDOW_WIDTH - 30
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 5,
    },
    input: {
        borderColor: Colors.borderColor,
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 3,
        paddingHorizontal: 10,
        marginLeft: 10,
        marginRight: 20,
        width: '85%'
    },
    areaSearchIcon: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.borderColor,
        borderRadius: 5,
        borderWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: 20,
        backgroundColor: Colors.white,
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
    delView: {
        borderColor: Colors.borderColor,
        borderTopWidth: 1,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    listView: {
        flexGrow: 1,
        backgroundColor: Colors.background,
        zIndex: 999999
    },
    tabView: {
        borderBottomColor: Colors.blue,
        borderBottomWidth: 3,
        padding: 7
    }
})