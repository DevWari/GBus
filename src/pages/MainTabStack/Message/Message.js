import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';

import Constants, { ConvStyle, ConvStrToDate } from '../../../settings/Constants';
import Colors from '../../../settings/Colors';
import HomeBottomTab from '../../GlobalComponents/BottomTabComponents/HomeBottomTab';
import MTIcon from 'react-native-vector-icons/MaterialIcons';
import MessageData from '../../GlobalComponents/Dummy/MessageData';

let assetsRoute = '../../../../assets/home/';

export default class Message extends Component {
    constructor(props) {
        super(props)
    }
    renderItem = ({ index, item }) => {
        return (
            <TouchableOpacity style={styles.itemContainer}
                onPress={()=>{
                    this.props.navigation.navigate('messageDetail', {data: item})
                }}
            >
                <View style={styles.itemIconView}>
                    <MTIcon name="info-outline" size={35} color={Colors.black} />
                </View>
                <View style={styles.itemContent}>
                    <Text numberOfLines={1} style={{ ...ConvStyle(18, Colors.black, 140), lineHeight: 30 }}>
                        {item.title}
                    </Text>
                    <Text style={{ ...ConvStyle(14, Colors.fontColor, 140), lineHeight: 25 }}>
                        {ConvStrToDate(item.startTime)} ~ {ConvStrToDate(item.endTime)}
                    </Text>
                    <Text numberOfLines={3} style={{ ...ConvStyle(14, Colors.fontColor, 140), lineHeight: 25 }}>
                        {item.contents}
                    </Text>
                </View>
            </TouchableOpacity>
        )
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
                    <View style={styles.slogan}>
                        <Image source={require(assetsRoute + 'slogan.png')} style={{ width: 225, height: 27, resizeMode: 'contain' }} />
                    </View>
                    <View style={{ flex: 1, backgroundColor: Colors.background }}>
                        <FlatList
                            data={MessageData}
                            ListEmptyComponent={
                                <View style={{ padding: 15, flexDirection: 'row', justifyContent: 'center' }}>
                                    <Text style={ConvStyle(18, Colors.fontColor, 150)}>알림이 존재하지 않습니다.</Text>
                                </View>
                            }
                            renderItem={this.renderItem}
                            ListFooterComponent={
                                <View style={{ height: 50 }} />
                            }
                            refreshing={false}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </View>
                <HomeBottomTab navigation={this.props.navigation}/>
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
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        borderWidth: 0.5,
        borderColor: Colors.borderColor,
        paddingVertical: 10,
        backgroundColor: Colors.white
    },
    itemIconView: {
        width: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    itemContent: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: Constants.WINDOW_WIDTH - 50,
        paddingHorizontal: 10
    }
})