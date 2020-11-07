import React, { Component } from 'react';
import { StyleSheet, Animated, View, Text, StatusBar, Platform } from 'react-native';
import { Header } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { WebView } from 'react-native-webview';

import Constants, { ConvStyle, getStatusBarHeight } from '../../../settings/Constants';
import Colors from '../../../settings/Colors';
import HomeBottomTab from '../../GlobalComponents/BottomTabComponents/HomeBottomTab';
import FrDetailPageInner from './FrDetailPageInner';
// import Data from '../../GlobalComponents/Dummy/FrDetailData';
import Html from '../../Tmap/TmapFindRoad';

export default class FrDetailPage extends Component {
    constructor(props) {
        super(props)
    }

    yPos = 0;
    topLimit = 0;
    bottomLimit = Constants.WINDOW_HEIGHT - Constants.BOTTOM_BAR_HEIGHT - Constants.HEADER_BAR_HEIGHT - getStatusBarHeight() - 50;
    middlePosition = (Constants.WINDOW_HEIGHT - Constants.HEADER_BAR_HEIGHT - Constants.BOTTOM_BAR_HEIGHT - getStatusBarHeight()) / 2;
    translateX = new Animated.Value(0)
    translateY = new Animated.Value(this.middlePosition)

    // handleGesture = Animated.event(
    //     [{
    //         nativeEvent: {
    //             translationX: 0,
    //             translationY: this.translateY
    //         }
    //     }],
    //     { useNativeDriver: true }
    // );
    // _onGestureStateChange = (event) => {
    //     console.log(tag, event.nativeEvent)
    //     this.scale.setValue(event.nativeEvent.scale)
    // };

    render() {
        const { navigation } = this.props
        const { data } = this.props.route.params;
        // console.log("this is FrDetailData item inner this page !======================", JSON.stringify(data, null, 4));

        let circleTransformStyle = {
            transform: [
                {
                    translateY: this.translateY
                },
                {
                    translateX: 0
                }
            ]
        }
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Header
                    centerComponent={{
                        text: data.path.Start.name._cdata + '->' + data.path.End.exName._cdata,
                        style: {...ConvStyle(18, Colors.blue, 170), justifyContent: 'center'}
                    }}
                    containerStyle={{
                        height: Constants.HEADER_BAR_HEIGHT,
                        backgroundColor: Colors.white
                    }}
                />
                {/* 맵뷰 */}
                <View style={{
                    ...styles.body,
                    top: Constants.HEADER_BAR_HEIGHT + getStatusBarHeight()
                }}>
                    <WebView
                        ref={(ref) => this.webRef = ref}
                        originWhitelist={['*']}
                        style={{
                            flex: 1
                        }}
                        source={{ html: Html.content }}
                        onLoadStart={event => {
                            showPageLoader(true)
                        }}
                        onLoadEnd={event => {
                            showPageLoader(false)
                        }}
                        onMessage={(event) => { }}
                        javaScriptEnabled={true}
                        incognito={true}
                        injectedJavaScript={`getData(${JSON.stringify(data)})`}
                    />
                </View>

                {/* 얻어진 길찾기 상세정보 */}
                <PanGestureHandler
                    onGestureEvent={(event) => {
                        this.yPos = event.nativeEvent.absoluteY - 110;
                        // console.log('yPOS : >>>>>>> ', this.yPos)
                        // console.log('bottom limit **************** ', this.bottomLimit)
                        if (this.yPos > this.topLimit && this.yPos < this.bottomLimit) {
                            this.translateY.setOffset(0)
                            this.translateY.setValue(this.yPos)
                        }
                    }}
                    onHandlerStateChange={(event) => {
                        // this.translateY.extractOffset();
                        if (event.nativeEvent.state === 5) {
                            if (this.yPos < this.middlePosition - 20 && this.yPos > this.topLimit) {
                                this.yPos = 0;
                                this.translateY.setOffset(0)
                                this.translateY.setValue(this.yPos)
                            }

                            if (this.yPos > this.middlePosition + 20 && this.yPos < this.bottomLimit) {
                                this.yPos = this.bottomLimit;
                                this.translateY.setOffset(0)
                                this.translateY.setValue(this.yPos)
                            }

                            if (this.yPos > this.middlePosition - 20 && this.yPos < this.middlePosition + 20) {
                                this.yPos = this.middlePosition;
                                this.translateY.setOffset(0)
                                this.translateY.setValue(this.yPos)
                            }
                        }
                    }}
                    shouldCancelWhenOutside={false}

                >
                    <Animated.View style={[styles.backBody, circleTransformStyle]}>
                        <FrDetailPageInner navigation={navigation} data={data} />
                    </Animated.View>
                </PanGestureHandler>

                <HomeBottomTab navigation={navigation} />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    body: {
        flex: 1,
        position: 'absolute',
        left: 0, right: 0,
        bottom: Constants.BOTTOM_BAR_HEIGHT,
        backgroundColor: Colors.background
    },
    backBody: {
        flex: 1,
        marginBottom: Constants.BOTTOM_BAR_HEIGHT,

    },
    test: {
        flexDirection: 'row', height: 50, backgroundColor: Colors.green
    }
})