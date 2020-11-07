import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, PermissionsAndroid, TouchableWithoutFeedback, Keyboard, FlatList, Alert } from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContext } from '@react-navigation/native';
import MainBottomTab from '../../../GlobalComponents/BottomTabComponents/MainBottomTab';
import Constants, { ConvStyle } from '../../../../settings/Constants';
import Colors from '../../../../settings/Colors';
import Refresh from '../../../GlobalComponents/Refresh';
import BusStationFavor from './BusStationFavor';
import BusRouteFavor from './BusRouteFavor';
import BusStation from '../../../GlobalComponents/LayoutComponents/BusStation';
import FindRoadFavor from '../../../GlobalComponents/LayoutComponents/FindRoadFavor';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FeaIcon from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import SoundRecorder from 'react-native-sound-recorder';
import RNFetchBlob from 'react-native-fetch-blob'

let assetsRoute = '../../../../../assets/home/';
let voiceImage = '../../../../../assets/global/voice_logo.png'

export default class HomeFavor extends Component {
    static contextType = NavigationContext
    constructor(props) {
        super(props);
        this.flatRef = React.createRef();
        this.state = {
            data: global.data ? global.data : null,
            searchText: '',
            modalView: false,
            recordStart: false,
            findResult: null,
            resultView: false
        }
    }

    componentDidMount() {
        const navigation = this.context
        this._unsubscribe = navigation.addListener('focus', () => {
            this.setState({ data: global.data ? global.data : null })

            try {
                this.flatRef.current?.scrollToOffset({
                    animated: false,
                    offseet: 0
                })
            } catch (ex) { }
        })
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    toggleModal = () => {
        this.setState({ modalView: !this.state.modalView })
    }
    toggleResultModal = () => {
        this.setState({ resultView: !this.state.resultView })
    }

    async requestMicrophonePermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
                {
                    title: "Requesting Microphone Access",
                    message: "App needs permission to access to your microphone "
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the microphone");
            } else {
                console.log("Microphone permission denied");
                alert("Microphone permission denied");
            }
        } catch (err) {
            console.warn(err);
        }
    }

    async requestStoragePermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Request Storage Access',
                    message: 'App needs permission to access to your Storage'
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the Storage")
            } else {
                console.log("Storage permission denied")
                alert("Storage permission denied");
            }
        } catch (err) {
            console.log("requestStoragePermission Error: ", err)
        }
    }


    async startRecord() {
        await this.requestMicrophonePermission();
        await this.requestStoragePermission();
        SoundRecorder.start('/mnt/sdcard/DCIM/record1.wav', {
            channels: 1,
            sampleRate: 44100,
            encodingBitRate: 32000
        })
            .then(() => {
                this.setState({ recordStart: true })
            });
    }

    endRecord() {
        showPageLoader(true)
        SoundRecorder.stop()
            .then((result) => {
                console.log('stopped recording, audio file saved at: ' + JSON.stringify(result, null, 4));
                this.setState({ recordStart: false }, () => {
                    console.log("recorded file: ", result)

                    RNFetchBlob.fetch('POST', 'https://kakaoi-newtone-openapi.kakao.com/v1/recognize', {
                        'Content-Type': 'application/octet-stream',
                        'X-DSS-Service': 'DICTATION',
                        'Authorization': 'KakaoAK 4e845ec9de1875a3e6f1d75cfa3906d7'
                    }, RNFetchBlob.wrap(result.path))
                        // '/mnt/sdcard/DCIM/heykakao.wav'
                        .then((res) => {
                            const result1 = res.text();
                            console.log("result: ", result1)
                            if (result1.indexOf('{"type":"finalResult"') > 0) {
                                this.setState({
                                    modalView: false,
                                    findResult: JSON.parse(('{"type":"finalResult"' + result1.split('{"type":"finalResult"')[1]).split('------')[0]).nBest,
                                    resultView: true,
                                })
                            } else {
                                Alert.alert('알림', '검색어를 찾을수 없습니다.', [{ text: '확인' }])
                            }
                            showPageLoader(false);

                        })
                        .then((err) => {
                        })
                })
            });
    }

    render() {
        console.log("record status: ", this.state.recordStart);
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header
                    centerComponent={{
                        text: '경기버스정보',
                        style: ConvStyle(18, Colors.blue, 170)
                    }}
                    rightComponent={
                        <TouchableOpacity
                            onPress={() => {
                                Keyboard.dismiss()
                                this.props.navigation.openDrawer()
                            }}
                        >
                            {/* <Image source={require(assetsRoute + 'hamberger.png')} style={{ width: 25, height: 25, resizeMode: 'contain' }} /> */}
                            <Ionicons name="md-menu-sharp" size={35} color={Colors.fontColor} />
                        </TouchableOpacity>
                    }
                    containerStyle={{
                        height: Constants.HEADER_BAR_HEIGHT,
                        backgroundColor: Colors.white
                    }}
                />
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.body}>
                        <View style={styles.slogan}>
                            <Image source={require(assetsRoute + 'slogan.png')} style={{ width: 225, height: 27, resizeMode: 'contain' }} />
                        </View>

                        <View style={styles.searchView}>
                            <TextInput
                                style={styles.search}
                                placeholder='정류소, 노선을 입력하세요'
                                value={this.state.searchText}
                                onChangeText={text => this.setState({ searchText: text })}
                                onSubmitEditing={() => {
                                    if (this.state.searchText == '') {
                                        Alert.alert('알림', '정류소, 노선을 입력하세요', [{ text: '확인' }])
                                    } else {
                                        this.props.navigation.navigate('searchMain', { searchText: this.state.searchText });
                                    }
                                }}
                            />
                            <TouchableOpacity style={styles.recordTouchView} onPress={() => {
                                this.setState({ modalView: true })
                            }}>
                                <Ionicons name="mic" size={35} color={Colors.fontColor} />
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 1 }}>
                            <FlatList
                                ref={this.flatRef}
                                data={global.historyReview}
                                ListHeaderComponent={
                                    <View style={{ padding: 5 }}>
                                        <Text style={ConvStyle(16, '#707070', 150)}>즐겨찾기</Text>
                                    </View>
                                }
                                ListEmptyComponent={
                                    <View style={{ padding: 15, flexDirection: 'row', justifyContent: 'center' }}>
                                        <Text style={ConvStyle(18, Colors.fontColor, 150)}>즐겨찾기가 존재하지 않습니다.</Text>
                                    </View>
                                }
                                renderItem={({ item, index, separators }) => {
                                    if (item.type == 'routeStation') {
                                        return (
                                            <BusStationFavor item={item}
                                                navigation={this.props.navigation} />
                                        )
                                    } else if (item.type == 'realRoute') {
                                        return (
                                            <BusRouteFavor item={item} navigation={this.props.navigation} />
                                        )
                                    } else if (item.type == 'station') {
                                        return (
                                            <BusStation item={item} navigation={this.props.navigation} />
                                        )
                                    } else if (item.type == 'findRoad') {
                                        return (
                                            <FindRoadFavor item={item} navigation={this.props.navigation} />
                                        )
                                    }
                                }}
                                refreshing={false}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <Refresh />
                <MainBottomTab selTab="home" navigation={this.props.navigation} homeType={'homeInner'} />

                <Modal
                    testID={'modal'}
                    isVisible={this.state.modalView}
                    swipeDirection={['down']}
                    onSwipeComplete={this.toggleModal}
                    style={{
                        justifyContent: 'flex-end',
                        margin: 0
                    }}>
                    <View style={{
                        position: 'absolute',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        backgroundColor: Colors.white,
                        width: Constants.WINDOW_WIDTH,
                        height: 230,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        borderColor: Colors.blue,
                        borderTopWidth: 2,
                        borderLeftWidth: 2,
                        borderRightWidth: 2,
                        paddingTop: 10
                    }}>
                        <View style={{
                            width: 50,
                            borderWidth: 4,
                            borderRadius: 2,
                            borderColor: Colors.blue
                        }} />
                        <Text style={{ ...ConvStyle(16, Colors.blue, 150), paddingTop: 20 }}> 듣고 있습니다. </Text>
                        <Text style={{ ...ConvStyle(16, Colors.blue, 150), paddingTop: 10 }}> 검색어를 말씀하세요. </Text>
                        {
                            !this.state.recordStart ?
                                <TouchableOpacity style={{
                                    marginTop: 20,
                                    marginBottom: 10,
                                    width: 60, height: 60,
                                    borderRadius: 30,
                                    borderWidth: 2,
                                    borderColor: Colors.blue,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                    onPress={() => {
                                        this.startRecord()
                                    }}
                                >
                                    <Ionicons name="mic" size={40} color={Colors.blue} />
                                </TouchableOpacity> :
                                <TouchableOpacity style={{
                                    marginTop: 20,
                                    marginBottom: 10,
                                    width: 60, height: 60,
                                    borderRadius: 32,
                                    backgroundColor: Colors.blue,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                    onPress={() => {
                                        this.endRecord()
                                    }}
                                >
                                    <Ionicons name="mic" size={40} color={Colors.white} />
                                </TouchableOpacity>
                        }

                        <Image source={require(voiceImage)} style={{ height: 50, resizeMode: 'contain' }} />
                    </View>
                </Modal>
                <Modal
                    testID={'modal'}
                    isVisible={this.state.resultView}
                    onSwipeComplete={this.toggleResultModal}
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 0
                    }}>
                    <View style={{
                        position: 'absolute',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: Colors.white,
                        width: Constants.WINDOW_WIDTH * 0.85,
                        borderRadius: 20,
                        borderColor: Colors.blue,
                        borderWidth: 2,
                    }}>
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingBottom: 10 }}>
                            <Text style={{ ...ConvStyle(16, Colors.blue, 150), paddingTop: 20 }}> 보다 정확한 검색을 위해 </Text>
                            <Text style={{ ...ConvStyle(16, Colors.blue, 150), paddingTop: 10 }}> 말씀하신 단어를 선택해 주십시오. </Text>
                        </View>
                        <View style={{ flex: 1, width: '100%' }}>
                            <FlatList
                                data={this.state.findResult}
                                ListEmptyComponent={
                                    <View style={{ padding: 10, flexDirection: 'row', justifyContent: 'center' }}>
                                        <Text style={ConvStyle(16, Colors.blue, 150)}>
                                            검색결과가 비어있습니다.
                                    </Text>
                                    </View>
                                }
                                renderItem={({ item, index, separators }) => {
                                    return (
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'flex-start',
                                            alignItems: 'center',
                                            borderTopWidth: 1,
                                            borderColor: Colors.blue,
                                            paddingVertical: 10,
                                            paddingHorizontal: 15
                                        }}>
                                            <TouchableOpacity
                                                style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
                                                onPress={() => {
                                                    this.setState({ resultView: false }, () => {
                                                        this.props.navigation.navigate('searchMain', { searchText: item.value });
                                                    })
                                                }}
                                            >
                                                <FeaIcon name={'message-circle'} color={Colors.blue} size={30} />
                                                <Text style={{ ...ConvStyle(16, Colors.blue, 150), paddingLeft: 15 }}>{item.value}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }}
                                refreshing={false}
                                keyExtractor={(item, index) => item.score}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%', paddingBottom: 15, borderTopWidth: 1, borderColor: Colors.blue }}>
                            <TouchableOpacity onPress={this.toggleResultModal}>
                                <Text style={{ ...ConvStyle(16, Colors.blue, 150), paddingTop: 20 }}>취 소</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView >
        )
    }

}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        marginBottom: Constants.BOTTOM_BAR_HEIGHT,
        backgroundColor: Colors.background,
    },
    slogan: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 20,
        borderColor: Colors.borderColor,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        backgroundColor: Colors.white,
        zIndex: 1
    },
    searchView: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderColor: Colors.borderColor,
        borderBottomWidth: 0.5,
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
    search: {
        ...ConvStyle(15, Colors.dark, 140),
        borderColor: Colors.borderColor,
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 5,
        flex: 1,
    },
    recordTouchView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10
    },
})