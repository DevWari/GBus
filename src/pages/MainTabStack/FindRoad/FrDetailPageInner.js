import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList} from 'react-native';
import Constants, { 
    ConvStyle,
    getPrevColorForDetail, 
    getColorFromSubway, 
    getColorFromBus, 
    checkTransfer,
    getLastColor } from '../../../settings/Constants';
import Colors from '../../../settings/Colors';
import FrWalkDetailRow from './FrDetailComponent/FrWalkDetailRow';
import FrEndDetailRow from './FrDetailComponent/FrEndDetailRow';
import FrBusDetailRow from './FrDetailComponent/FrBusDetailRow';
import FrSubwayDetailRow from './FrDetailComponent/FrSubwayDetailRow';

export default class FrDetailPageInner extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { navigation, data } = this.props
        const itemArray = [];
     
        itemArray.push(data.path.Start)
        if (data.path.hasOwnProperty('Walk')) {
            if(Array.isArray(data.path.Walk)) {
                data.path.Walk.map((itemWK, index) => {
                    itemArray.push(itemWK)
                })
            }
        }    
        if (data.path.hasOwnProperty('ExChange')) {
            if (Array.isArray(data.path.ExChange)) {
                data.path.ExChange.map((itemEx, index) => {
                    itemArray.push(itemEx)
                })
            } else {
                itemArray.push(data.path.ExChange)
            }
        }

        itemArray.sort((a, b) => {
            return Number(a.pathIndex._text) - Number(b.pathIndex._text)
        })
        return (
            <View style={styles.body}>
                <View style={{
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    borderColor: Colors.gray,
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
                    borderWidth: 0.5,
                    height: 50,
                    backgroundColor: Colors.white,
                    ...styles.shadow
                }}>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: 5
                    }}>
                        <View style={{
                            height: 7, width: 50,
                            backgroundColor: Colors.gray,
                            borderRadius: 5
                        }} />
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        paddingHorizontal: 20,
                        paddingVertical: 10
                    }}>
                        <Text style={ConvStyle(global.fontSize == 0 ? 16 : global.fontSize == 1 ? 17 : 18, Colors.fontColor, 150)}>
                            약{data.time._cdata}분 | {data.distance._cdata} m | 약{data.payment._cdata}원
                        </Text>
                    </View>
                </View>
                <View style={{ flex: 1, backgroundColor: Colors.white }}>
                    <FlatList
                        removeClippedSubviews={true}
                        initialNumToRender={20}
                        maxToRenderPerBatch={100}
                        legacyImplementation={true}
                        windowSize={50}
                        data={itemArray}
                        renderItem={({ item, index, separators }) => {
                            if(item.moveType._cdata == 'Walk') {
                                if(item.pathIndex._text == '0') {
                                    return <FrWalkDetailRow 
                                                type={'start'}
                                                beforeColor={'transparent'}
                                                start = {data.path.Start.name._cdata}
                                                item={item} />
                                } else {
                                    return <FrWalkDetailRow 
                                                type={'end'} 
                                                beforeColor={getPrevColorForDetail(item.pathIndex._text, itemArray)}
                                                item={item}/>
                                }
                            } else if(item.moveType._cdata == 'Subway') {
                                return <FrSubwayDetailRow
                                    beforeColor={getPrevColorForDetail(item.pathIndex._text, itemArray)}
                                    selfColor={getColorFromSubway(item.laneAlias._cdata)}
                                    isTransfer={checkTransfer(index, itemArray)}
                                    item={item}
                                />
                                
                            } else if(item.moveType._cdata == 'Bus') {
                                return <FrBusDetailRow
                                    beforeColor={getPrevColorForDetail(item.pathIndex._text, itemArray)}
                                    selfColor={getColorFromBus(item.lane.type._cdata)}
                                    isTransfer={checkTransfer(index, itemArray)}
                                    item={item}
                                />
                            }
                        }}
                        ListFooterComponent={()=>{
                            return <FrEndDetailRow
                                beforeColor={getLastColor(itemArray)}    
                                end={data.path.End.exName._cdata} />
                        }}
                        refreshing={false}
                        keyExtractor={(item, index) => item.pathIndex._text}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1
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
})