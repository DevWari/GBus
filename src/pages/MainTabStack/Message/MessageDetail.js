import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import Constants, { ConvStyle, ConvStrToDate } from '../../../settings/Constants';
import Colors from '../../../settings/Colors';
import MessageDetailBottomTap from '../../GlobalComponents/BottomTabComponents/MessageDetailBottomTap';
import MTIcon from 'react-native-vector-icons/MaterialIcons';
import FIcon from 'react-native-vector-icons/FontAwesome';
import MessageData from '../../GlobalComponents/Dummy/MessageData';

let assetRoutes = '../../../../assets/message/image.png'

export default class MessageDetail extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header
                    centerComponent={{
                        text: '알림',
                        style: ConvStyle(18, Colors.blue, 170)
                    }}
                    containerStyle={{
                        height: Constants.HEADER_BAR_HEIGHT,
                        backgroundColor: Colors.white
                    }}
                />
                <View style={styles.body}>
                    <ScrollView style={styles.scroll}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: 30,
                            paddingBottom: 20
                        }}>
                            <MTIcon name="info-outline" size={35} color={Colors.blue} />
                            <Text style={{ ...ConvStyle(20, Colors.blue, 140), paddingLeft: 10 }}>공사알림</Text>
                        </View>
                        <View style={{
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            paddingHorizontal: 20,
                            paddingBottom: 20
                        }}>
                            <Text style={{ ...ConvStyle(20, Colors.fontColor, 160), textAlign: 'center', lineHeight: 30 }}>
                                분당수서간 도시고속화 도로 공사
                            </Text>
                            <View style={{
                                flexDirection: 'column',
                                paddingVertical: 20,
                            }}>
                                <Text style={{ ...ConvStyle(14, Colors.fontColor, 140), lineHeight: 25 }}>
                                    [공사] 분당 수서간 도시고속화 도로 판교로 430 이매동 1521 주의운전 도로공사
                                </Text>
                                <Text style={{ ...ConvStyle(14, Colors.fontColor, 140), lineHeight: 25 }}>
                                    2020-04-03 07:00:00 ~ 2020-05-03 23:00:00
                                </Text>
                                <Text style={{ ...ConvStyle(14, Colors.fontColor, 140), lineHeight: 40 }}>
                                    경찰정(UTIS) 제공
                                </Text>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                {/* <Image source={require('../../../../assets/messsage/image.png')} style={{width: '90%', height: 250, resizeMode: 'stretch'}} /> */}
                                <FIcon name="image" size={280} color={Colors.borderColor} />
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <MessageDetailBottomTap navigation={this.props.navigation} />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        marginBottom: Constants.BOTTOM_BAR_HEIGHT,
        backgroundColor: Colors.background,
    },
    scroll: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: Colors.white,
        borderColor: Colors.borderColor,
        borderTopWidth: 0.5
    },
})