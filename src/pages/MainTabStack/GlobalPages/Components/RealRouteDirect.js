import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Colors from '../../../../settings/Colors';
import Constants, { ConvStyle } from '../../../../settings/Constants';

export default class RealRouteDirect extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const {data} = this.props;
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.rightView}
                    onPress={()=>{
                        if(this.props.onScrollToTop) {
                            this.props.onScrollToTop()
                        }
                    }}
                >
                    <Text numberOfLines={1} style={styles.text}>
                        {data ? data.endStationName._text : '회차정류소'} 방면
                    </Text>
                    <Text numberOfLines={1} style={styles.text}>(시군명)</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.leftView}
                    onPress={()=>{
                        if(this.props.onScrollToEnd) {
                            this.props.onScrollToEnd()
                        }
                    }}
                >
                    <Text numberOfLines={1} style={styles.text}>
                        {data? data.startStationName._text : '종점정류소'} 방면
                    </Text>
                    <Text numberOfLines={1} style={styles.text}>(시군명)</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.borderColor,
        backgroundColor: Colors.background,
        borderBottomWidth: 0.5,
        padding: 10,
        width: Constants.WINDOW_WIDTH,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    },
    rightView: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: 1,
        borderColor: 'transparent',
        paddingVertical: 5,
        paddingHorizontal: 20,
        width: Constants.WINDOW_WIDTH / 2 - 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        backgroundColor: Colors.blue
    },
    leftView: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5,
        paddingHorizontal: 20,
        width: Constants.WINDOW_WIDTH / 2 - 10,
        borderLeftWidth: 1,
        borderColor: 'transparent',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: Colors.redRoute
    },
    text: {
        ...ConvStyle(14, Colors.white, 150),
        lineHeight: 17
    },
})