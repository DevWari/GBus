import React, { Component, useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';

import RestAPI from '../../../api/RestAPI';
import RouteHeaderForBus from '../../MainTabStack/GlobalPages/Components/RouteHeaderForBus';
import RouteContentForBus from '../../MainTabStack/GlobalPages/Components/RouteContentForBus';
import { useFocusEffect } from '@react-navigation/native';
import Refresh from '../../GlobalComponents/Refresh';

export function RenderHeader({ content, index, isActive, sections, navigation, onPressDetail }) {
    if (!sections) {
        return null
    }
    return (
        <RouteHeaderForBus
            active={isActive}
            data={sections}
            navigation={navigation}
            onPressDetail={() => {
                if (onPressDetail) {
                    onPressDetail()
                }
            }}
        />
    )
}

export function RenderContent({ content, index, isActive, sections }) {
    if (!sections) {
        return null
    } else {
        if (!sections.locationNo1.hasOwnProperty('_text')) { // 첫번째 버스정보가 없기때문에 노선일괄로 판단
            if (sections.flag._text == 'STOP') {
                return <RouteContentForBus data={sections} busNum={'0'} /> // 한개 행으로 2대 버스 모두 운행종료로 표기
            } else {
                return <RouteContentForBus data={sections} busNum={'1'} /> // 한개 행으로 2대 버스 모두 도착예정없음으로 표기
            }
        } else {
            if (!sections.locationNo2.hasOwnProperty('_text')) {
                if (sections.garageFlag._text == 'Y' && (Number(sections.staOrder._text) - Number(sections.locationNo2._text)) == 1) {
                    return <RouteContentForBus data={sections} busNum={'21'} /> // 2번째 버스 차고지 대기중으로 표기
                } else if (
                    sections.garageTurnFlag == 'Y' &&
                    (Number(sections.staOrder._text) - Number(sections.locationNo2._text)) == Number(sections.turnSeq._text)
                ) {
                    return <RouteContentForBus data={sections} busNum={'22'} />  // 2번째 버스 회차지 대기중으로 표기
                } else {
                    return <RouteContentForBus data={sections} busNum={'23'} />  // 2번째 버스 도착예정없음으로 표기
                }
            } else {
                return <RouteContentForBus data={sections} busNum={'3'} /> // 2대 버스 모두 운행중...
            }
        }
    }
}

export default function BusRoute({ data, stationData, navigation }) {

    const [activeSections, setActiveSections] = useState([]);
    const [stationRouteInfo, setStationRouteInfo] = useState(null)
    const timer = useRef(null);

    useFocusEffect(React.useCallback(() => {
        refresh()
        timer.current = setInterval(() => refresh(), 10000)
        return () => clearInterval(timer.current)
    }, [data]))

    const refresh = () => {
        showPageLoader(true)
        RestAPI.getStationRouteInfo(data.routeId._text, stationData.stationId._text).then((res) => {
            if (res.response.msgHeader.resultCode._text == 0) {
                setStationRouteInfo(res.response.msgBody.busArrivalItem)
            }
            showPageLoader(false)
        })
    }

    return (
        <Accordion
            sections={[data]}
            activeSections={activeSections}
            renderHeader={(content, index, isActive, sections) =>
                <RenderHeader
                    content={content}
                    index={index}
                    isActive={isActive}
                    sections={stationRouteInfo}
                    navigation={navigation}
                    onPressDetail={() => {
                        navigation.navigate('stationRouteInfo', {
                            stationId: stationData.stationId._text,
                            routeId: data.routeId._text,
                            data: stationData
                        })
                    }}
                />
            }
            renderContent={(content, index, isActive, sections) =>
                <RenderContent
                    content={content}
                    index={index}
                    isActive={isActive}
                    sections={stationRouteInfo}
                />
            }
            onChange={activeSections => {
                setActiveSections(activeSections)
            }}
            expandMultiple={true}
            underlayColor={'transparent'}
            duration={300}
        />
    );

}