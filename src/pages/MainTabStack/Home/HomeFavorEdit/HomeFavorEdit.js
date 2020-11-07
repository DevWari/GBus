import React, { Component } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import DraggableFlatList from "react-native-draggable-flatlist";
import DialogInput from 'react-native-dialog-input';
import AsyncStorage from '@react-native-community/async-storage';

import HomeBottomTab from '../../../GlobalComponents/BottomTabComponents/HomeBottomTab';
import Constants, { ConvStyle } from '../../../../settings/Constants';
import Colors from '../../../../settings/Colors';
import Data from '../../../GlobalComponents/Dummy/Data';
import BusStationHeader from '../../../GlobalComponents/LayoutComponents/BusStationHeader';
import BusRouteFavor from '../HomeFavor/BusRouteFavor';
import BusStation from '../../../GlobalComponents/LayoutComponents/BusStation';
import FindRoadFavor from '../../../GlobalComponents/LayoutComponents/FindRoadFavor';


export default class HomeFavorEdit extends Component {
    state = {
        data: this.props.route.params.data,
        isEditDialogVisible: false,
        selectedIxForEdit: null
    };

    componentDidMount() {
        this.setState({
            data: this.props.route.params.data
        })
    }

    componentDidUpdate(prevProps) {
        if(prevProps.route.params.data != this.props.route.params.data) {
            this.setState({
                data: this.props.route.params.data
            })
        }
    }
    showEditDialog(isShow, ix) {
        this.setState({ selectedIxForEdit: ix })
        this.setState({ isEditDialogVisible: isShow })
    }

    editData(data, ix, updateName) {
        data.forEach((item, index) => {
            if (index == ix) {
                if (item.type == 'realRoute') {
                    item.memo = updateName
                } else if(item.type == 'station') {
                    item.memo = updateName
                } else if(item.type == 'findRoad') {
                    item.memo = updateName
                } else if(item.type == 'routeStation') {
                    item.memo = updateName
                }
            }
        })
        return data
    }

    asyncDataAfterEdit(updateName, data) {
        if (updateName === '' || updateName === undefined) {
            this.showEditDialog(false, null)
            return
        }
        this.setState({
            data: this.editData(data, this.state.selectedIxForEdit, updateName)
        })
        global.historyReview = this.editData(data, this.state.selectedIxForEdit, updateName)

        this.showEditDialog(false, null)
    }

    asyncDataAfterDel(data, item, type) {
        if (item.type == 'realRoute') {
            for(let i = 0; i<data.length; i++) {
                if(data[i].type == 'realRoute') {
                    if(data[i].routeId._text == item.routeId._text) {
                        data.splice(i, 1)
                        this.setState({ data: data})
                        global.historyReview = data
                    }
                }
            }
        } else if(item.type == 'station') {
            for(let i = 0; i<data.length; i++) {
                if(data[i].type == 'station') {
                    if(data[i].data.stationId._text == item.data.stationId._text) {
                        data.splice(i, 1)
                        this.setState({ data: data})
                        global.historyReview = data
                    }
                }
            }
        } else if(item.type == 'findRoad') {
            for(let i = 0; i<data.length; i++) {
                if(data[i].type == 'findRoad') {
                    if(data[i].startPOI.title === item.startPOI.title && data[i].endPOI.title === item.endPOI.title) {
                        data.splice(i, 1)
                        this.setState({ data: data})
                        global.historyReview = data
                    }
                }
            }
        } else if(item.type == 'routeStation') {
            for(let i = 0; i<data.length; i++) {
                if(data[i].type == 'routeStation') {
                    if(data[i].stationInfo.stationId._text === item.stationInfo.stationId._text) {
                        data.splice(i, 1)
                        this.setState({ data: data})
                        global.historyReview = data
                    }
                }
            }
        }

    }

    asyncDataAfterDraw(data) {
        this.setState({ data })
        global.historyReview = data
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header
                    centerComponent={{
                        text: '편집',
                        style: ConvStyle(18, Colors.blue, 170)
                    }}
                    containerStyle={{
                        height: Constants.HEADER_BAR_HEIGHT,
                        backgroundColor: Colors.white
                    }}
                />
                <View style={styles.body}>
                    <DraggableFlatList
                        data={this.state.data}
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
                        renderItem={({ item, index, drag, isActive }) => {
                            if (item.type == 'station') {
                                return (
                                    <BusStation
                                        key={index}
                                        item={item}
                                        drag={drag}
                                        delItem={()=>{
                                            Alert.alert('삭제', '선택한 항목을 삭제하시겠습니까?', [
                                                {text: '취소'},
                                                {
                                                    text: '확인',
                                                    onPress: async () => {
                                                        this.asyncDataAfterDel(global.historyReview, item, 'station')
                                                        await AsyncStorage.setItem('historyReview', JSON.stringify(global.historyReview))
                                                    }
                                                }
                                            ])
                                        }}
                                        editItem = {()=>{
                                            this.showEditDialog(true, index)
                                        }}
                                    />
                                )
                            } else if (item.type == 'realRoute') {
                                return (
                                    <BusRouteFavor
                                        key={index}
                                        item={item}
                                        drag={drag}
                                        delItem={() => {
                                            Alert.alert('삭제', '선택한 항목을 삭제하시겠습니까?', [
                                                { text: '취소' },
                                                {
                                                    text: '확인',
                                                    onPress: async () => {
                                                        this.asyncDataAfterDel(global.historyReview, item, 'realRoute')
                                                        await AsyncStorage.setItem('historyReview', JSON.stringify(global.historyReview))
                                                    }
                                                }
                                            ])
                                        }}
                                        editItem={() => {
                                            this.showEditDialog(true, index)
                                        }}
                                    />
                                )
                            } else if (item.type == 'findRoad') {
                                return (
                                    <FindRoadFavor 
                                        key={index}
                                        item={item}
                                        drag={drag}
                                        delItem={()=>{
                                            Alert.alert('삭제', '선택한 항목을 삭제하시겠습니까?', [
                                                { text: '취소' },
                                                {
                                                    text: '확인',
                                                    onPress: async () => {
                                                        this.asyncDataAfterDel(global.historyReview, item, 'findRoad')
                                                        await AsyncStorage.setItem('historyReview', JSON.stringify(global.historyReview))
                                                    }
                                                }
                                            ])
                                        }}
                                        editItem={() => {
                                            this.showEditDialog(true, index)
                                        }}
                                    />
                                )
                            } else if(item.type == 'routeStation') {
                                return (
                                    <BusStationHeader 
                                        key={index}
                                        data={item}
                                        drag={drag}
                                        delItem={()=>{
                                            Alert.alert('삭제', '선택한 항목을 삭제하시겠습니까?', [
                                                { text: '취소' },
                                                {
                                                    text: '확인',
                                                    onPress: async () => {
                                                        this.asyncDataAfterDel(global.historyReview, item, 'routeStation')
                                                        await AsyncStorage.setItem('historyReview', JSON.stringify(global.historyReview))
                                                    }
                                                }
                                            ])
                                        }}
                                        editItem={()=>{
                                            this.showEditDialog(true, index)
                                        }}
                                    />
                                )
                            }
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        onDragEnd={async ({ data }) => {
                            this.asyncDataAfterDraw(data)
                            await AsyncStorage.setItem('historyReview', JSON.stringify(global.historyReview))
                        }}
                    />
                </View>
                <DialogInput isDialogVisible={this.state.isEditDialogVisible}
                    title={"새 이름 입력"}
                    message={"즐겨찾기 명칭"}
                    hintInput={"즐겨찾기명"}
                    submitText={"확인"}
                    cancelText={"취소"}
                    submitInput={ async (inputText) => {
                        this.asyncDataAfterEdit(inputText, global.historyReview)
                        await AsyncStorage.setItem('historyReview', JSON.stringify(global.historyReview))
                    }}
                    closeDialog={() => { this.showEditDialog(false, null) }}

                />
                <HomeBottomTab navigation={this.props.navigation} />
            </SafeAreaView >
        )
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        marginBottom: Constants.BOTTOM_BAR_HEIGHT,
        backgroundColor: Colors.background
    },
})