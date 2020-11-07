import React, { Component, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Image, Alert } from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import FaIcon from 'react-native-vector-icons/FontAwesome';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import Constants, { ConvStyle, ConvStrToDate } from '../../../settings/Constants';
import Colors from '../../../settings/Colors';
import HomeBottomTab from '../../GlobalComponents/BottomTabComponents/HomeBottomTab';
import AsyncStorage from '@react-native-community/async-storage';


export function RenderItem({ item, onPress }) {
    let reviewStatus = false;
    let historyReview = global.historyReview;
    for(let i = 0; i<historyReview.length; i++) {
        if(historyReview[i].type == 'station') {
            if(historyReview[i].data.stationId._text == item.stationId) {
                reviewStatus = true;
            }
        }
    }

    const [review, setReview] = useState(reviewStatus);
    return (
        <View style={styles.itemContainer}>
            <TouchableOpacity style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center'
            }}
                onPress={() => {
                    if(onPress) {
                        onPress()
                    }
                }}>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: Colors.fontColor,
                    borderWidth: 2, width: 30, height: 30,
                    borderRadius: 20,
                    marginRight: 15,
                }}>
                    <MIcon name="directions-bus" size={20} color={Colors.fontColor} />
                </View>
                <View style={styles.itemContent}>
                    <Text numberOfLines={1} style={{ ...ConvStyle(18, Colors.fontColor, 160), lineHeight: 25 }}>
                        {item.stationName}
                    </Text>
                    <Text numberOfLines={1} style={{ ...ConvStyle(14, Colors.fontColor, 140), lineHeight: 20 }}>
                        {item.distance} |
                        {
                            item.mobileNo ?
                                item.mobileNoSi ? ' ' + item.mobileNo + ', ' + item.mobileNoSi + ', ' : ' ' + item.mobileNo + ', ' :
                                item.mobileNoSi ? ' ' + item.mobileNoSi + ', ' : ' '
                        }
                        {item.centerYn == 'Y' ? '중앙차로, ' : null}
                        {item.regionName}
                    </Text>
                </View>
            </TouchableOpacity>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TouchableOpacity
                    onPress={async () => {
                        console.log(item)
                        if(!review) {
                            setReview(true)
                            global.historyReview.unshift({
                                type: 'station',
                                data: {
                                    "centerYn": { "_text": item.centerYn },
                                    "districtCd": { "_text": item.districtCd },
                                    "mobileNo": { "_text": item.mobileNo ? item.mobileNo : "" },
                                    "mobileNoSi": { "_text": item.mobileNoSi ? item.mobileNoSi : "" },
                                    "regionName": { "_text": item.regionName },
                                    "stationId": { "_text": item.stationId },
                                    "stationName": { "_text": item.stationName },
                                    "x": { "_text": item.x },
                                    "y": { "_text": item.y },
                                },
                                memeo: ''
                            })
                            await AsyncStorage.setItem('historyReview', JSON.stringify(global.historyReview))
                            Alert.alert('알림', '즐겨찾기에 추가되었습니다.', [{ text: '확인' }])
                        } else {
                            setReview(false)
                            for(let i = 0; i<global.historyReview.length; i++) {
                                if(global.historyReview[i].type == 'station') {
                                    if(global.historyReview[i].data.stationId._text == item.stationId) {
                                        global.historyReview.splice(i, 1);
                                    }
                                }
                            }
                            await AsyncStorage.setItem('historyReview', JSON.stringify(global.historyReview))
                            Alert.alert('알림', '즐겨찾기가 삭제되었습니다.', [{ text: '확인' }])
                        }
                    }}
                >
                    {
                        review ?
                            <FaIcon name="star" size={30} color={Colors.yellow} /> :
                            <FaIcon name="star-o" size={30} color={Colors.borderColor} />

                    }
                    
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default class AroundList extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header
                    centerComponent={{
                        text: '주변정류소',
                        style: ConvStyle(18, Colors.blue, 170)
                    }}
                    containerStyle={{
                        height: Constants.HEADER_BAR_HEIGHT,
                        backgroundColor: Colors.white,
                        borderBottomColor: Colors.borderColor,
                    }}
                />
                <View style={styles.body}>
                    <FlatList
                        removeClippedSubviews={true}
                        initialNumToRender={20}
                        maxToRenderPerBatch={100}
                        legacyImplementation={true}
                        windowSize={50}
                        data={this.props.route.params.data}
                        ListEmptyComponent={
                            <View style={{ padding: 15, flexDirection: 'row', justifyContent: 'center' }}>
                                <Text style={ConvStyle(18, Colors.fontColor, 150)}>주변정류소가 존재하지 않습니다.</Text>
                            </View>
                        }
                        renderItem={({ item, index, separators }) => {
                            return <RenderItem
                                item={item}
                                onPress={()=>{
                                    this.props.navigation.navigate('stationInfo', {
                                        data: {
                                            "stationId": {
                                                "_text" : item.stationId
                                            },
                                            "stationName" : {
                                                "_text" : item.stationName
                                            },
                                            "x": {
                                                "_text" : item.x
                                            },
                                            "y" : {
                                                "_text" : item.y
                                            }
                                        }
                                    })
                                }}
                            />
                        }}
                        refreshing={false}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                <HomeBottomTab navigation={this.props.navigation} />
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
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderColor: Colors.borderColor,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        backgroundColor: Colors.white,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    itemContent: {
        width: Constants.WINDOW_WIDTH - 120,
        alignItems: 'flex-start'
    }
})