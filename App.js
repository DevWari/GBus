import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';

import PageLoaderIndicator from './src/pages/GlobalComponents/PageLoaderIndicator';
import MainTabStackNav from './src/pages/MainTabStack/MainTabStackNav';
import Data from './src/pages/GlobalComponents/Dummy/Data';

export default function App() {
    const [isShowPageLoader, setIsShowPageLoader] = useState(false);
    
    global.showPageLoader = (isShow) => {
        setIsShowPageLoader(isShow)
    }

    global.forceUpdate = () => {
        const [value, setValue] = useState(0)
        return () => setValue(value => ++value);
    }

    const _bootstrapAsync = async () => {
        AsyncStorage.getItem('historyReview', (err, data) => {
            if (err) console.log(err)
            else if (data) global.historyReview = JSON.parse(data);
            else if (data == null) global.historyReview = [];
        })
        AsyncStorage.getItem('historyPois', (err, data) => {
            if (err) console.log(err)
            else if (data) global.historyPois = JSON.parse(data);
            else if (data == null) global.historyPois = [];
        })
        AsyncStorage.getItem('historyRoads', (err, data) => {
            if (err) console.log(err)
            else if (data) global.historyRoads = JSON.parse(data);
            else if (data == null) global.historyRoads = [];
        })
        AsyncStorage.getItem('historySearchs', (err, data) => {
            if (err) console.log(err)
            else if (data) global.historySearchs = JSON.parse(data)
            else if (data == null) global.historySearchs = [];
        })
        AsyncStorage.getItem('fontSize', (err, data) => {
            if (err) console.log(err)
            else if (data) global.fontSize = Number(JSON.parse(data))
        })
    }

    useEffect(async () => {
        _bootstrapAsync()
        global.data = Data.favorStation;
        SplashScreen.hide();
    }, [])
    return (
        <SafeAreaProvider >
            <MainTabStackNav />
            <PageLoaderIndicator isPageLoader={isShowPageLoader}/>
        </SafeAreaProvider>
    );
}