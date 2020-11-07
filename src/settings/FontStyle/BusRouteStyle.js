import { StyleSheet } from 'react-native';
import Colors from '../Colors';
import { ConvStyle } from '../Constants';

const fontStyles = StyleSheet.create({
    arraiveTime: ConvStyle(14, Colors.white, 150 ),
    arraiveSoon: ConvStyle(12, Colors.white, 150),
    direction: ConvStyle(14, Colors.fontColor, 150 )
})

export default fontStyles;