// 정류소 경유노선 Accordion section 구성 스크린
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import RouteHeaderForBus from './RouteHeaderForBus';
import RouteContentForBus from './RouteContentForBus';
import Colors from '../../../../settings/Colors';
import Constants, { ConvStyle } from '../../../../settings/Constants';

export function RenderHeader({ content, index, isActive, sections, navigation, onPressDetail }) {
    return (
        <RouteHeaderForBus
            active={isActive}
            data={sections[0]}
            navigation={navigation}
            onPressDetail={() => {
                if (onPressDetail) {
                    onPressDetail()
                }
            }}
        />
    )
}

export default class RouteForBus extends Component {
    state = {
        activeSections: []
    };

    _renderContent(content, index, isActive, sections) {
        if (!sections[0]) {
            return null
        } else {
            if (!sections[0].locationNo1.hasOwnProperty('_text')) { // 첫번째 버스정보가 없기때문에 노선일괄로 판단
                if (sections[0].flag._text == 'STOP') {
                    return <RouteContentForBus data={sections[0]} busNum={'0'} /> // 한개 행으로 2대 버스 모두 운행종료로 표기
                } else {
                    return <RouteContentForBus data={sections[0]} busNum={'1'} /> // 한개 행으로 2대 버스 모두 도착예정없음으로 표기
                }
            } else {
                if (!sections[0].locationNo2.hasOwnProperty('_text')) {
                    if (sections[0].garageFlag._text == 'Y' && (Number(sections[0].staOrder._text) - Number(sections[0].locationNo2._text)) == 1) {
                        return <RouteContentForBus data={sections[0]} busNum={'21'} /> // 2번째 버스 차고지 대기중으로 표기
                    } else if (
                        sections[0].garageTurnFlag == 'Y' &&
                        (Number(sections[0].staOrder._text) - Number(sections[0].locationNo2._text)) == Number(sections[0].turnSeq._text)
                    ) {
                        return <RouteContentForBus data={sections[0]} busNum={'22'} />  // 2번째 버스 회차지 대기중으로 표기
                    } else {
                        return <RouteContentForBus data={sections[0]} busNum={'23'} />  // 2번째 버스 도착예정없음으로 표기
                    }
                } else {
                    return <RouteContentForBus data={sections[0]} busNum={'3'} /> // 2대 버스 모두 운행중...
                }
            }
        }
    };

    _updateSections = activeSections => {
        this.setState({ activeSections });
    };

    render() {
        return (
            <Accordion
                sections={[this.props.data]}
                activeSections={this.state.activeSections}
                renderHeader={(content, index, isActive, sections) =>
                    <RenderHeader
                        content={content}
                        index={index}
                        isActive={isActive}
                        sections={sections}
                        navigation={this.props.navigation}
                        onPressDetail={()=>{
                            if(this.props.onPressDetail){
                                this.props.onPressDetail()
                            }
                        }}
                    />
                }
                renderContent={this._renderContent}
                onChange={this._updateSections}
                expandMultiple={true}
                underlayColor={'transparent'}
                duration={300}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderColor: Colors.borderColor,
        borderBottomWidth: 0.5,
        paddingVertical: 5,
        paddingLeft: 40,
        paddingRight: 10,
    }
})