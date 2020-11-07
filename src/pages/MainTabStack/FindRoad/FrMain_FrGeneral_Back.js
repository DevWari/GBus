
// FrMain페이지의 백업 콤퍼넌트(검색 인푸트 부분)
export function FrGeneral({ navigation, start, end, changeStarEnd }) {
    const [startPOI, setStartPOI] = useState(null)
    const [endPOI, setEndPOI] = useState(null)
    const [review, setReview] = useState(false)

    useEffect(() => {
        if (start && end) {
            setStartPOI(start)
            setEndPOI(end)
            for (let i = 0; i < global.historyReview.length; i++) {
                if (global.historyReview[i].type == 'findRoad') {
                    if (global.historyReview[i].startPOI.title == startPOI.title &&
                        global.historyReview[i].endPOI.title == endPOI.title) {
                        setReview(true)
                    }
                }
            }
        }
    }, [start, end])

    return (
        <View style={{ ...styles.frGeneralContainer, ...styles.shadow }}>
            <View style={styles.row}>
                <Text style={ConvStyle(16, Colors.fontColor, 150)}>출발: </Text>
                <TouchableOpacity
                    activeOpacity={1}
                    style={{ width: '75%' }}
                    onPress={() => { navigation.navigate('frStartEnd', { title: '출발지' }) }}
                >
                    <TextInput
                        placeholder='장소 또는 주소를 입력하세요.'
                        numberOfLines={1}
                        style={{ ...ConvStyle(14, Colors.fontColor, 140), ...styles.input }}
                        value={startPOI?.title}
                        editable={false}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                    if (changeStarEnd) {
                        changeStarEnd()
                    }
                }}>
                    <FIcon name="exchange" size={20} color={Colors.fontColor} style={{ transform: [{ rotate: '90deg' }] }} />
                </TouchableOpacity>
            </View>
            <View style={styles.row}>
                <Text style={ConvStyle(16, Colors.fontColor, 150)}>도착: </Text>
                <TouchableOpacity
                    activeOpacity={1}
                    style={{ width: '75%' }}
                    onPress={() => {
                        if (startPOI == null) {
                            Alert.alert('알림', '출발지를 입력해주세요.', [{ text: '확인' }])
                        } else {
                            navigation.navigate('frStartEnd', { title: '도착지' })
                        }
                    }}
                >
                    <TextInput
                        placeholder='장소 또는 주소를 입력하세요.'
                        numberOfLines={1}
                        style={{ ...ConvStyle(14, Colors.fontColor, 140), ...styles.input }}
                        value={endPOI?.title}
                        editable={false}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={async () => {
                        if (startPOI && endPOI) {
                            if (!review) {
                                setReview(true)
                                global.historyReview.unshift({
                                    type: 'findRoad',
                                    startPOI: startPOI,
                                    endPOI: endPOI,
                                    memo: ''
                                })
                                // await AsyncStorage.setItem('historyReview', JSON.stringify(global.historyReview))
                                Alert.alert('알림', '즐겨찾기에 추가되었습니다.', [{ text: '확인' }])

                            } else {
                                setReview(false)
                                for (let i = 0; i < global.historyReview.length; i++) {
                                    if (global.historyReview[i].type == 'findRoad') {
                                        if (global.historyReview[i].startPOI.title == startPOI.title
                                            && global.historyReview[i].endPOI.title == endPOI.title) {
                                            global.historyReview.splice(i, 1)
                                        }
                                    }
                                }
                                // await AsyncStorage.setItem('historyReview', JSON.stringify(global.historyReview))
                                Alert.alert('알림', '즐겨찾기가 삭제되었습니다.', [{ text: '확인' }])

                            }
                        } else {
                            Alert.alert('알림', '길찾기 검색을 진행한후에 즐겨찾기를 할수 잇습니다!', [{ text: '확인' }])
                        }
                    }}
                >
                    {
                        review ?
                            <FIcon name="star" size={30} color={Colors.yellow} /> :
                            <FIcon name="star-o" size={30} color={Colors.borderColor} />
                    }
                </TouchableOpacity>
            </View>
        </View>
    )

}

export class FrGeneral extends Component {
    constructor(props) {
        super(props)
        // 리뷰목록에서 현재 길찾기정보가 잇는가를 검사한다.
        console.log(JSON.stringify("props", this.props.start))
        let historyReview = global.historyReview;
        let reviewStatus = false

        if (this.props.start && this.props.end) {
            for (let i = 0; i < historyReview.length; i++) {
                if (historyReview[i].type == 'findRoad') {
                    if (historyReview[i].startPOI.title == this.props.start.title 
                        && historyReview[i].endPOI.title == this.props.end.title) {
                        reviewStatus = true;
                    }
                }
            }
        }
        this.state = {
            review: reviewStatus,
            start: this.props.start,
            end: this.props.end
        }
    }
    render() {
        return (
            <View style={{ ...styles.frGeneralContainer, ...styles.shadow }}>
                <View style={styles.row}>
                    <Text style={ConvStyle(16, Colors.fontColor, 150)}>출발: </Text>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{ width: '75%' }}
                        onPress={() => { this.props.navigation.navigate('frStartEnd', { title: '출발지' }) }}
                    >
                        <TextInput
                            placeholder='장소 또는 주소를 입력하세요.'
                            numberOfLines={1}
                            style={{ ...ConvStyle(14, Colors.fontColor, 140), ...styles.input }}
                            value={this.props.start?.title}
                            editable={false}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        if (this.props.changeStarEnd) {
                            this.props.changeStarEnd()
                        }
                    }}>
                        <FIcon name="exchange" size={20} color={Colors.fontColor} style={{ transform: [{ rotate: '90deg' }] }} />
                    </TouchableOpacity>
                </View>
                <View style={styles.row}>
                    <Text style={ConvStyle(16, Colors.fontColor, 150)}>도착: </Text>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{ width: '75%' }}
                        onPress={() => {
                            if (this.props.start == null) {
                                Alert.alert('알림', '출발지를 입력해주세요.', [{ text: '확인' }])
                            } else {
                                this.props.navigation.navigate('frStartEnd', { title: '도착지' })
                            }
                        }}
                    >
                        <TextInput
                            placeholder='장소 또는 주소를 입력하세요.'
                            numberOfLines={1}
                            style={{ ...ConvStyle(14, Colors.fontColor, 140), ...styles.input }}
                            value={this.props.end?.title}
                            editable={false}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            if (this.props.start && this.props.end) {
                                if (!this.state.review) {
                                    this.setState({ review: true }, async () => {
                                        global.historyReview.unshift({
                                            type: 'findRoad',
                                            startPOI: this.props.start,
                                            endPOI: this.props.end,
                                            memo: ''
                                        })
                                        // await AsyncStorage.setItem('historyReview', JSON.stringify(global.historyReview))
                                        Alert.alert('알림', '즐겨찾기에 추가되었습니다.', [{ text: '확인' }])
                                    })
                                } else {
                                    this.setState({ review: false }, async () => {
                                        for (let i = 0; i < global.historyReview.length; i++) {
                                            if (global.historyReview[i].type == 'findRoad') {
                                                if (global.historyReview[i].startPOI.title == this.props.start.title
                                                    && global.historyReview[i].endPOI.title == this.props.end.title) {
                                                    global.historyReview.splice(i, 1)
                                                }
                                            }
                                        }
                                        // await AsyncStorage.setItem('historyReview', JSON.stringify(global.historyReview))
                                        Alert.alert('알림', '즐겨찾기가 삭제되었습니다.', [{ text: '확인' }])
                                    })
                                }
                            } else {
                                Alert.alert('알림', '길찾기 검색을 진행한후에 즐겨찾기를 할수 잇습니다!', [{ text: '확인' }])
                            }
                        }}
                    >
                        {
                            this.state.review ?
                                <FIcon name="star" size={30} color={Colors.yellow} /> :
                                <FIcon name="star-o" size={30} color={Colors.borderColor} />
                        }
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}