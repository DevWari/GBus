import { StyleSheet } from 'react-native';
import Colors from '../Colors';
import { ConvStyle } from '../Constants';

const fontStyles = StyleSheet.create({
    default: ConvStyle(14, Colors.fontColor, 150 ),
    num: ConvStyle(14, Colors.blue, 150 ),
})

export default fontStyles;