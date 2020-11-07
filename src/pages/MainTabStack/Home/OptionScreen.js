import React, { Component, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import Slider from '@react-native-community/slider';
import EIcons from 'react-native-vector-icons/Entypo';

import Constants, { ConvStyle, ConvBusType } from '../../../settings/Constants';
import Colors, { ConvColors } from '../../../settings/Colors';
import HomeBottomTab from '../../GlobalComponents/BottomTabComponents/HomeBottomTab';

export default function OptionScreen({ route, navigation }) {
    const [oneBefore, setOneBefore] = useState(true)
    const [twoBefore, setTwoBefore] = useState(true)
    const [threeBefore, setThreeBefore] = useState(false)

    const [fontSize, setFontSize] = useState(global.fontSize)

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header
                centerComponent={{
                    text: '설정',
                    style: ConvStyle(18, Colors.blue, 170)
                }}
                containerStyle={{
                    height: Constants.HEADER_BAR_HEIGHT,
                    backgroundColor: Colors.white
                }}
            />
            <View style={styles.body}>
                <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                        <Text style={ConvStyle(14, Colors.fontColor, 150)}>글꼴 크기</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={ConvStyle(16, Colors.fontColor, 150)}>보통</Text>
                        <Slider
                            style={{ flex: 1 }}
                            minimumValue={0}
                            maximumValue={2}
                            step={1}
                            minimumTrackTintColor={Colors.blue}
                            thumbTintColor={Colors.blue}
                            maximumTrackTintColor="#000000"
                            onValueChange={ async (val) => {
                                setFontSize(val)
                                global.fontSize = val
                                await AsyncStorage.setItem('fontSize', JSON.stringify(val))
                                // updateAppScreen();
                            }}
                            value={fontSize}
                        />
                        <Text style={ConvStyle(16, Colors.fontColor, 150)}>더 크게</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                        <Text style={ConvStyle(14, Colors.fontColor, 150)}>승하차 알림 서비스</Text>
                    </View>
                    <View style={styles.rowView}>
                        <TouchableOpacity style={styles.rowTouchView} onPress={()=>{
                            if(oneBefore) setOneBefore(false)
                            else setOneBefore(true)
                        }}>
                            <Text style={ConvStyle(16, Colors.fontColor, 150)}>1번째 전</Text>
                            {
                                oneBefore ? <EIcons name="check" size={30} color={Colors.fontColor} /> : null
                            }
                            
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        justifyContent: 'center',
                        width: Constants.WINDOW_WIDTH,
                        height: 60,
                        borderColor: Colors.borderColor,
                        backgroundColor: Colors.white,
                        paddingHorizontal: 15
                    }}>
                        <TouchableOpacity style={styles.rowTouchView} onPress={()=>{
                            if(twoBefore) setTwoBefore(false)
                            else setTwoBefore(true)
                        }}>
                            <Text style={ConvStyle(16, Colors.fontColor, 150)}>2번째 전</Text>
                            {
                                twoBefore ? <EIcons name="check" size={30} color={Colors.fontColor} /> : null
                            }
                        </TouchableOpacity>
                    </View>
                    <View style={styles.rowView}>
                        <TouchableOpacity style={styles.rowTouchView} onPress={()=>{
                            if(threeBefore) setThreeBefore(false)
                            else setThreeBefore(true)
                        }}>
                            <Text style={ConvStyle(16, Colors.fontColor, 150)}>3번째 전</Text>
                            {
                                threeBefore ? <EIcons name="check" size={30} color={Colors.fontColor} /> : null
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10 }}>
                        <Text style={ConvStyle(14, Colors.fontColor, 150)}>위젯 새로고침</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={ConvStyle(16, Colors.fontColor, 150)}>15초</Text>
                        <Slider
                            style={{ flex: 1 }}
                            minimumValue={0}
                            maximumValue={15}
                            step={5}
                            minimumTrackTintColor={Colors.blue}
                            thumbTintColor={Colors.blue}
                            maximumTrackTintColor="#000000"
                            onValueChange={(val)=>{
                                console.log(val + 15)
                            }}
                        />
                        <Text style={ConvStyle(16, Colors.fontColor, 150)}>30초</Text>
                    </View>
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        width: Constants.WINDOW_WIDTH,
        height: 70,
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white,
        paddingHorizontal: 15
    },
    rowView: {
        justifyContent: 'center',
        borderWidth: 1,
        width: Constants.WINDOW_WIDTH,
        height: 70,
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white,
        paddingHorizontal: 15
    },
    rowTouchView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
})