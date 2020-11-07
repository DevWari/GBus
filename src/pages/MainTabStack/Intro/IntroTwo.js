import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants, { ConvStyle } from '../../../settings/Constants';
import Colors from '../../../settings/Colors';

let assetsRoute = '../../../../assets/home/';
export default class IntroTwo extends Component {
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

                    <View style={{
                        position: 'absolute',
                        bottom: 0, left: 0, right: 0
                    }}>
                        <View style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={{ ...ConvStyle(16, Colors.blue, 160), lineHeight: 30 }}>자주 이용하는 정류소와 노선을</Text>
                            <Text style={{ ...ConvStyle(16, Colors.blue, 160), lineHeight: 30, marginBottom: 15 }}>즐겨찾기에 등록해보세요</Text>
                            <Text style={{ ...ConvStyle(14, Colors.fontColor, 150), lineHeight: 25 }}>정류소와 노선이 표시되는 화면에서</Text>
                            <Text style={{ ...ConvStyle(14, Colors.fontColor, 150), lineHeight: 25, marginBottom: 10 }}>별표를 탭하면 즐겨찾기에 등록됩니다.</Text>
                        </View>
                        <View style={styles.greetingView}>
                            <Text style={{ ...ConvStyle(14, Colors.gray, 150), lineHeight: 25 }}>즐겨찾기를 할 수 있는 화면 2, 3개</Text>
                            <Text style={{ ...ConvStyle(14, Colors.gray, 150), lineHeight: 25 }}>썸네일로 구성한 이미지</Text>
                        </View>

                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.innerContainer}>
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate('introThree')
                        }}>
                            <Text style={{ ...ConvStyle(18, Colors.blue, 160), lineHeight: 30 }}>건너뛰기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate('introThree')
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
        height: Constants.WINDOW_HEIGHT - 400,
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