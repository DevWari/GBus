import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BallIndicator } from "react-native-indicators";
import Colors from '../../settings/Colors';

const PageLoaderIndicator = ({ isPageLoader = false }) => {
    if (!isPageLoader) {
        return null;
    }
    return (
        <View style={styles.container}>
            <BallIndicator color={Colors.blue} size={40} count={8} />
        </View>
    )
}

export default PageLoaderIndicator;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0, right: 0, top: 0, bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99999
    }
})
