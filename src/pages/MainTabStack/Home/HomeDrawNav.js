import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Linking } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import FIcon from 'react-native-vector-icons/FontAwesome';
import HomeFavor from './HomeFavor/HomeFavor';
import HomeFavorEdit from './HomeFavorEdit/HomeFavorEdit';
import Constants, { ConvStyle } from '../../../settings/Constants';
import MaIcon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../../settings/Colors';

const HomeDrawer = createDrawerNavigator();

export function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
            <View style={styles.drawHeader}>
                <TouchableOpacity style={{
                    position: 'absolute',
                    right: 10}}
                    onPress={()=>{
                        props.navigation.closeDrawer()
                    }}>
                    <Text style={{color: Colors.blue, fontSize: 18}}>X</Text>
                </TouchableOpacity>
                <Text style={{...ConvStyle(18, Colors.blue, 170), paddingTop: 30}}>경기버스정보</Text>
            </View>
            <View style={{ flexDirection: 'column' }}>
                <View style={styles.line} />
                <TouchableOpacity style={styles.drawItem} onPress={()=>{
                    props.navigation.navigate('busType')
                }}>
                    <Image
                        source={require('../../../../assets/draw/draw_bus_type.png')}
                        style={styles.drawImage}
                    />
                    <Text style={ConvStyle(16, Colors.dark, 140)}>버스유형</Text>
                </TouchableOpacity>
                <View style={styles.line} />
                <TouchableOpacity style={styles.drawItem} onPress={()=>{
                    props.navigation.navigate('option')
                }}>
                    <Image
                        source={require('../../../../assets/draw/draw_setting.png')}
                        style={styles.drawImage}
                    />
                    <Text style={ConvStyle(16, Colors.dark, 140)}>앱 설정</Text>
                </TouchableOpacity>
                <View style={styles.line} />
                <TouchableOpacity style={styles.drawItem} onPress={()=>{
                    props.navigation.navigate('message')
                }}>
                    <Image
                        source={require('../../../../assets/draw/draw_message.png')}
                        style={styles.drawImage}
                    />
                    <Text style={ConvStyle(16, Colors.dark, 140)}>알림과 공지</Text>
                </TouchableOpacity>
                <View style={styles.line} />
                <TouchableOpacity style={styles.drawItem}>
                    <Image
                        source={require('../../../../assets/draw/draw_await.png')}
                        style={styles.drawImage}
                    />
                    <Text style={ConvStyle(16, Colors.dark, 140)}>승차대기이력 보기</Text>
                </TouchableOpacity>
                <View style={styles.line} />
                <TouchableOpacity style={styles.drawItem}>
                    <Image
                        source={require('../../../../assets/draw/draw_help.png')}
                        style={styles.drawImage}
                    />
                    <Text style={ConvStyle(16, Colors.dark, 140)}>도움말</Text>
                </TouchableOpacity>
                <View style={styles.line} />
            </View>
            <View style={styles.drawFooter}>
                <View style={styles.drawFooterImage}>
                    <Image
                        source={require('../../../../assets/draw/draw_slogan.png')}
                        style={{ width: 160, height: 90, resizeMode: 'contain', marginBottom: 15 }}
                    />
                    <Image
                        source={require('../../../../assets/draw/draw_cert.png')}
                        style={{ width: 87, resizeMode: 'contain', marginVertical: 20 }}
                    />
                    <Text style={ConvStyle(18, Colors.blue, 140)}>경기도 교통정보센터</Text>
                    <Text>Ver 2.0</Text>
                </View>

                <TouchableOpacity style={styles.drawPhone}
                    onPress={() => { Linking.openURL('tel:130-120') }}
                >
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}>
                        <FIcon name="phone" size={35} color={Colors.blue} />
                    </View>
                    <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                        <Text style={{ ...ConvStyle(18, Colors.dark, 170), lineHeight: 30 }}>고객센터 130-120</Text>
                        <Text style={{ ...ConvStyle(14, Colors.dark, 140), lineHeight: 30 }}>전화버튼을 누르면 통화하실수 있습니다.</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView>
    )
}

export default function HomeDrawNav({ navigation }) {
    const [initRender, setInitRender] = useState(true)

    useEffect(() => {
        setInitRender(false)
    }, [initRender])

    return (
        <HomeDrawer.Navigator
            drawerStyle={{
                width: initRender ? 0 : Constants.WINDOW_WIDTH * 0.85,
                borderWidth: 1,
                borderColor: Colors.blue,
            }}
            drawerContent={
                props => <CustomDrawerContent {...props} />
            }
            initialRouteName="homeFavor"
        >
            <HomeDrawer.Screen name="homeFavor" component={HomeFavor} />
            <HomeDrawer.Screen name="homeFavorEdit" component={HomeFavorEdit} />
        </HomeDrawer.Navigator>
    )
}

const styles = StyleSheet.create({
    drawHeader: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 30,
    },
    drawItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderColor: Colors.blue,
    },
    line: {
        borderBottomWidth: 0.5,
        borderColor: Colors.blue
    },
    drawImage: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        marginLeft: 20,
        marginRight: 30,
        marginVertical: 10
    },
    drawFooter: {
        flex: 1,
        justifyContent: 'center',
        paddingBottom: 50
    },
    drawFooterImage: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    drawPhone: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: Colors.lightBlue,
    },
})