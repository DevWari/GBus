import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, NativeModules} from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';

import Constants, { ConvStyle } from '../../../settings/Constants';
import Colors from '../../../settings/Colors';
import Icons from 'react-native-vector-icons/MaterialIcons';
import EIcons from 'react-native-vector-icons/Entypo';
import RestAPI from '../../../api/RestAPI';


const SharedStorage = NativeModules.SharedStorage;

let assetsRoute = '../../../../assets/home/';
export default class Intro extends Component {
    constructor(props) {
        super(props)
        this.state = {
            one: global.fontSize == 0 ? true : false,
            two: global.fontSize == 1 ? true : false,
            three: global.fontSize == 2 ? true : false
        }
    }

    componentDidMount() {
        SharedStorage.set(
            JSON.stringify({text: global.historyReview}),
        );
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header
                    centerComponent={{
                        text: '경기버스정보',
                        style: ConvStyle(18, Colors.blue, 170)
                    }}
                    containerStyle={{
                        height: Constants.HEADER_BAR_HEIGHT,
                        backgroundColor: Colors.white
                    }}
                />
                <View style={styles.body}>
                    <View style={styles.slogan}>
                        <Image source={require(assetsRoute + 'slogan.png')} style={{ width: 225, height: 27, resizeMode: 'contain' }} />
                    </View>
                    <View style={styles.greetingView}>
                        <Icons name="insert-emoticon" size={35} color={Colors.blue} style={{ paddingVertical: 20 }} />
                        <Text style={{ ...ConvStyle(18, Colors.blue, 160), lineHeight: 30 }}> 새로워진 경기버스정보를 </Text>
                        <Text style={{ ...ConvStyle(18, Colors.blue, 160), lineHeight: 30 }}> 만나보세요 </Text>
                    </View>
                    <View style={{
                        position: 'absolute',
                        bottom: 0, left: 0, right: 0
                    }}>
                        <View style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={{ ...ConvStyle(18, Colors.blue, 160), lineHeight: 30 }}>연영대를 알려주시면</Text>
                            <Text style={{ ...ConvStyle(18, Colors.blue, 160), lineHeight: 30 }}>적절한 글꼴크기를 설정해 드립니다.</Text>
                            <Text style={{ ...ConvStyle(14, Colors.blue, 150), lineHeight: 40 }}>(언제든지 앱설정에서 변경할수 있습니다.)</Text>
                        </View>
                        <View style={styles.selectView} >
                            <TouchableOpacity onPress={async () => {
                                this.setState({
                                    one: true,
                                    two: false,
                                    three: false
                                })
                                global.fontSize = 0
                                await AsyncStorage.setItem('fontSize', JSON.stringify(0))
                            }} style={styles.touchView}
                            >
                                <Text style={{ ...ConvStyle(15, Colors.fontColor, 160), lineHeight: 35 }}>45세 이하</Text>
                                {
                                    this.state.one ?
                                        <EIcons name="check" size={30} color={Colors.fontColor} /> : null
                                }

                            </TouchableOpacity>
                        </View>
                        <View style={styles.selectView} >
                            <TouchableOpacity onPress={async () => {
                                this.setState({
                                    one: false,
                                    two: true,
                                    three: false
                                })
                                global.fontSize = 1
                                await AsyncStorage.setItem('fontSize', JSON.stringify(1))
                            }} style={styles.touchView}
                            >
                                <Text style={{ ...ConvStyle(15, Colors.fontColor, 160), lineHeight: 35 }}>60세 이하</Text>
                                {
                                    this.state.two ?
                                        <EIcons name="check" size={30} color={Colors.fontColor} /> : null
                                }

                            </TouchableOpacity>
                        </View>
                        <View style={styles.selectView} >
                            <TouchableOpacity onPress={async () => {
                                this.setState({
                                    one: false,
                                    two: false,
                                    three: true
                                })
                                global.fontSize = 2
                                await AsyncStorage.setItem('fontSize', JSON.stringify(2))
                            }} style={styles.touchView}
                            >
                                <Text style={{ ...ConvStyle(15, Colors.fontColor, 160), lineHeight: 35 }}>60세 이상</Text>
                                {
                                    this.state.three ?
                                        <EIcons name="check" size={30} color={Colors.fontColor} /> : null
                                }

                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.innerContainer}>
                        <TouchableOpacity onPress={()=>{
                            if(!this.state.one && !this.state.two && !this.state.three ) {
                                Alert.alert('알림', '글꼴크기를 선택해주세요', [{text: '확인'}])
                            } else {
                                this.props.navigation.navigate('introTwo')
                            }
                            
                        }}>
                            <Text style={{ ...ConvStyle(18, Colors.blue, 160), lineHeight: 30 }}>건너뛰기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
                            if(!this.state.one && !this.state.two && !this.state.three ) {
                                Alert.alert('알림', '글꼴크기를 선택해주세요', [{text: '확인'}])
                            } else {
                                this.props.navigation.navigate('introTwo')
                            }
                        }}>
                            <Text style={{ ...ConvStyle(18, Colors.blue, 160), lineHeight: 30 }}>다음</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        marginBottom: Constants.BOTTOM_BAR_HEIGHT,
        backgroundColor: Colors.white,
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
    greetingView: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: Constants.WINDOW_HEIGHT - 550,
        width: Constants.WINDOW_WIDTH - 10,
        borderWidth: 1,
        borderColor: Colors.borderColor,
        backgroundColor: Colors.background,
        marginVertical: 5,
        marginHorizontal: 5,
        textAlign: 'center'
    },
    container: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: Constants.BOTTOM_BAR_HEIGHT,
        width: Constants.WINDOW_WIDTH,
        backgroundColor: Colors.white,
        borderTopWidth: 1,
        borderColor: Colors.gray,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    innerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    selectView: {
        paddingHorizontal: 30,
        borderTopWidth: 1,
        borderColor: Colors.borderColor
    },
    touchView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10
    }
})