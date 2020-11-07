import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Global Components
import TestPage from './GlobalPages/TestPage';
import StationInfo from './GlobalPages/StationInfo';
import StationRouteInfo from './GlobalPages/StationRouteInfo';
import RouteInfo from './GlobalPages/RouteInfo';
import Report from './GlobalPages/Report';
import RealRoute from './GlobalPages/RealRoute';

// Stack Components
import HomeDarwNav from './Home/HomeDrawNav';
import Message from './Message/Message';
import MessageDetail from './Message/MessageDetail';
import Around from './Around/Around';
import AroundList from './Around/AroundList';
import RealRouteMap from './GlobalPages/RealRouteMap';
import FrMain from './FindRoad/FrMain';
import FrStartEnd from './FindRoad/FrStartEnd';
import FrSelMap from './FindRoad/FrSelMap';
import FrDetailPage from './FindRoad/FrDetailPage';
import SearchMain from './Search/SearchMain';
import SearchPoiMap from './Search/SearchPoiMap';
import StationAround from './Around/StationAround';
import Intro from './Intro/Intro';
import IntroTwo from './Intro/IntroTwo';
import IntroThree from './Intro/IntroThree';
import BusType from './Home/BusType';
import OptionScreen from './Home/OptionScreen';


const MainTabStack = createStackNavigator();

export default function MainTabStackNav() {
    return (
        <NavigationContainer>
            <MainTabStack.Navigator initialRouteName={
                global.fontSize  ? "home" : "intro"
            } headerMode="none" screenOptions={{animationEnabled: false}} >
            {/* 테스트 페이지 */}
                <MainTabStack.Screen name="test" component={TestPage} />
                
            {/* 인트로 페이지 */}
                <MainTabStack.Screen name="intro" component={Intro} />
                <MainTabStack.Screen name="introTwo" component={IntroTwo} />
                <MainTabStack.Screen name="introThree" component={IntroThree} />

            {/* 홈 페이지 */}
                <MainTabStack.Screen name="home" component={HomeDarwNav} />
                <MainTabStack.Screen name="busType" component={BusType} />
                <MainTabStack.Screen name="option" component={OptionScreen} />
                
            {/* 주변정류소 페이지 */}
                <MainTabStack.Screen name="around" component={Around} />
                <MainTabStack.Screen name="aroundList" component={AroundList} />

            {/* 알림 페이지 */}
                <MainTabStack.Screen name="message" component={Message} />
                <MainTabStack.Screen name="messageDetail" component={MessageDetail} />
                
            {/* 길찾기 페이지 */}
                <MainTabStack.Screen name="findRoad" component={FrMain} />
                <MainTabStack.Screen name="frStartEnd" component={FrStartEnd} />
                <MainTabStack.Screen name="frSelMap" component={FrSelMap} />
                <MainTabStack.Screen name="frDetailPage" component={FrDetailPage} />

            {/* 글로벌 페이지들 */}
                {/* 정류소도착정보 및 정류소, 노선정보, 정류소주변정류소지도 페이지 */}
                <MainTabStack.Screen name="stationInfo" component={StationInfo} />
                <MainTabStack.Screen name="stationRouteInfo" component={StationRouteInfo} />
                <MainTabStack.Screen name="routeInfo" component={RouteInfo} />
                <MainTabStack.Screen name="report" component={Report} />
                <MainTabStack.Screen name="stationAround" component={StationAround} />

                {/* 실시간 노선페이지 */}
                <MainTabStack.Screen name="realRoute" component={RealRoute} />
                <MainTabStack.Screen name="realRouteMap" component={RealRouteMap} />

                {/* 통합검색 페이지 */}
                <MainTabStack.Screen name="searchMain" component={SearchMain} />
                <MainTabStack.Screen name="searchPoiMap" component={SearchPoiMap} />
            </MainTabStack.Navigator>
        </NavigationContainer>
    )
}