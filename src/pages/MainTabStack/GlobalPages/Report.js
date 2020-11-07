import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking, TextInput, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
//----------------------Icon----------------------//
import Icon from 'react-native-vector-icons/Feather';
import RNPickerSelect from 'react-native-picker-select';
import IoIcon from 'react-native-vector-icons/Ionicons';
import FIcon from 'react-native-vector-icons/FontAwesome';
//------------------------------------------------//
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../../../settings/Colors';
import Constants, { ConvStyle } from '../../../settings/Constants';
import StationHeader from './Components/StationHeader';
import RouteHeader from './Components/RouteHeader';
import ReportBottomTab from '../../GlobalComponents/BottomTabComponents/ReportBottomTab';

export default class Report extends Component {
    constructor(props) {
        super(props)
        this.state = {
            select: undefined,
            error: '',
            date: '',
            time: '',
            setShowDate: false,
            setShowTime: false
        }
        this.SelectIconView = this.SelectIconView.bind(this);
    }
    SelectIconView() {
        return (
            <IoIcon name="chevron-down-circle" size={30} color={Colors.borderColor} />
        )
    }
    handleError = (error) => {
        this.setState({ error: error })
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header
                    centerComponent={{
                        text: '오류신고',
                        style: ConvStyle(18, Colors.blue, 170)
                    }}
                    containerStyle={{
                        height: Constants.HEADER_BAR_HEIGHT,
                        backgroundColor: Colors.white,
                        zIndex: 1
                    }}
                />
                <View style={styles.body}>
                    <StationHeader data={this.props.route.params.stationInfoData}/>
                    <RouteHeader data={this.props.route.params.routeInfoData} />

                    <ScrollView style={{...styles.scroll, marginBottom: 70}}>
                        <View style={{ flexDirection: 'column' }}>
                            <View style={styles.subHeader}>
                                <Text style={styles.subTitle}>불편유형</Text>
                            </View>
                            <View style={{ ...styles.subBody, height: 50, justifyContent: 'center' }}>
                                <RNPickerSelect
                                    placeholder={{}}
                                    items={[
                                        {
                                            label: '도착 정보 불일치',
                                            value: '0',
                                        },
                                        {
                                            label: '위치 정보 불일치',
                                            value: '1',
                                        },
                                        {
                                            label: '버스 운행 중 사라짐',
                                            value: '2',
                                        },
                                    ]}
                                    onValueChange={value => {
                                        this.setState({
                                            select: value,
                                        });
                                    }}
                                    style={{
                                        ...pickerSelectStyles,
                                        iconContainer: {
                                            top: 8
                                        },
                                    }}
                                    value={this.state.select}
                                    Icon={this.SelectIconView}
                                    useNativeAndroidPickerStyle={false}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'column' }}>
                            <View style={styles.subHeader}>
                                <Text style={styles.subTitle}>오류내용</Text>
                            </View>
                            <View style={{ ...styles.subBody, paddingHorizontal: 10 }}>
                                <TextInput
                                    onChangeText={this.handleError}
                                    numberOfLines={5}
                                    multiline={true}
                                    textAlignVertical="top"
                                    style={{
                                        width: '100%'
                                    }}
                                    maxLength={80}
                                />
                            </View>
                        </View>
                        <View style={{ flexDirection: 'column' }}>
                            <View style={styles.subHeader}>
                                <Text style={styles.subTitle}>시간</Text>
                            </View>
                            <View style={{
                                padding: 10,
                                flexDirection: 'row',
                                backgroundColor: Colors.white,
                                borderWidth: 0.7,
                                borderColor: Colors.borderColor
                            }}>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    width: '60%',
                                    paddingRight: 10,
                                }}
                                >
                                    <TouchableOpacity onPress={() => { this.setState({ setShowDate: true }) }} >
                                        <FIcon name="calendar" size={20} color={Colors.black} />
                                    </TouchableOpacity>
                                    <Text style={{ ...ConvStyle(14, Colors.borderColor, 150), paddingLeft: 10 }}>
                                        {this.state.date == '' ? '날자 선택' : this.state.date}
                                    </Text>
                                    {this.state.setShowDate && (
                                        <DateTimePicker
                                            value={Date.now()}
                                            mode='date'
                                            is24Hour={true}
                                            display="default"
                                            onTouchCancel={() => {
                                                this.setState({ setShowDate: false })
                                            }}
                                            onChange={(event, selectedDate) => {
                                                if (event.type == 'dismissed') {
                                                    this.setState({ setShowDate: false })
                                                } else {
                                                    this.setState({
                                                        date: selectedDate.getDate() + '/' + (selectedDate.getMonth() + 1) + '/' + selectedDate.getFullYear(),
                                                        setShowDate: false
                                                    })
                                                }
                                            }}
                                        />
                                    )}
                                </View>
                                <View style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    width: '40%',
                                    paddingRight: 10,
                                }}
                                >
                                    <TouchableOpacity onPress={() => { this.setState({ setShowTime: true }) }} >
                                        <FIcon name="clock-o" size={23} color={Colors.black} />
                                    </TouchableOpacity>
                                    <Text style={{ ...ConvStyle(14, Colors.borderColor, 150), paddingLeft: 10 }}>
                                        {this.state.time == '' ? '시간 선택' : this.state.time}
                                    </Text>
                                    {this.state.setShowTime && (
                                        <DateTimePicker
                                            value={Date.now()}
                                            mode='time'
                                            is24Hour={true}
                                            display="default"
                                            onTouchCancel={() => {
                                                this.setState({ setShowTime: false })
                                            }}
                                            onChange={(event, selectedDate) => {
                                                if (event.type == 'dismissed') {
                                                    this.setState({ setShowTime: false })
                                                } else {
                                                    this.setState({
                                                        time: selectedDate.getHours() + ':' + selectedDate.getMinutes(),
                                                        setShowTime: false
                                                    })
                                                }
                                            }}
                                        />
                                    )}
                                </View>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'column' }}>
                            <View style={styles.subHeader}>
                                <Text style={styles.subTitle}>연락처</Text>
                            </View>
                            <View style={{ ...styles.subBody, paddingHorizontal: 10 }}>
                                <TextInput
                                    placeholder="연락처를 입력하시면 답변을 받을 수 있습니다."
                                    onChangeText={this.handleError}
                                    numberOfLines={1}
                                    multiline={true}
                                    textAlignVertical="center"
                                    style={{
                                        ...ConvStyle(14, Colors.fontColor, 150),
                                        width: '100%',
                                    }}
                                />
                            </View>
                            <View style={styles.subHeader} />
                        </View>
                    </ScrollView>
                    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                        <View style={styles.callView}>
                            <TouchableOpacity
                                onPress={() => { Linking.openURL('tel:130-120') }}
                            >
                                <Icon name="phone-call" size={35} color={Colors.black} />
                            </TouchableOpacity>
                            <View style={styles.callTitle}>
                                <Text style={{ ...ConvStyle(14, Colors.fontColor, 150), lineHeight: 20 }}>
                                    대중교통이용시 불편이나 문의는
                                    경기도 콜센터로도 문의하실 수 있습니다.
                            </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <ReportBottomTab navigation={this.props.navigation} />
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
    callView: {
        paddingHorizontal: 20,
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0.7,
        borderColor: Colors.borderColor,
        backgroundColor: Colors.white
    },
    callTitle: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    scroll: {
        flex: 1,
        flexDirection: 'column',
    },
    subHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 5
    },
    subTitle: {
        ...ConvStyle(16, Colors.fontColor, 150),
        paddingLeft: 10
    },
    subBody: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: Colors.white,
        borderColor: Colors.borderColor,
        borderWidth: 0.7,
    },
    content: {
        ...ConvStyle(14, Colors.fontColor, 150),
        lineHeight: 25
    }
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        ...ConvStyle(16, Colors.fontColor, 150),
        width: Constants.WINDOW_WIDTH - 20,
        paddingVertical: 12,
        paddingHorizontal: 10,
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        ...ConvStyle(16, Colors.fontColor, 150),
        width: Constants.WINDOW_WIDTH - 20,
        paddingHorizontal: 12,
        paddingVertical: 10,
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});