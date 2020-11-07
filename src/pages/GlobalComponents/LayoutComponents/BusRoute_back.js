import { useEffect } from "react";
import { useState } from "react";

export default function BusRoute({ key, data, stationData, navigation }) {

    const [activeSections, setActiveSections] = useState([]);
    const [stationRouteInfo, setStationRouteInfo] = useState(null)
    let timer = null;

    useEffect(()=>{
        refresh()
    }, [data])

    const refresh = () => {
        RestAPI.getStationRouteInfo(data.routeId._text, stationData.stationId._text).then((res) => {
            if (res.response.msgHeader.resultCode._text == 0) {
                setStationRouteInfo(res.response.msgBody.busArrivalItem)
            }
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

export default class BusRoute extends Component {
    static contextType = NavigationContext;
    constructor(props) {
        super(props)
        this.state = {
            activeSections: [],
            stationRouteInfo: null,
        };
        this.refresh = this.refresh.bind(this);
        this.timer = null;
    }

    componentDidMount() {
        const navigation = this.context;
        // this._unsubscribe = navigation.addListener('focus', () => {
            
        // })
            this.refresh()
        // this.timer = setInterval(this.refresh, 10000); // 10초만에 자동갱신을 위한 타임어
    }
    

    componentWillUnmount() {
        // this._unsubscribe();
        // clearInterval(this.timer)
    }

    refresh() {
        RestAPI.getStationRouteInfo(this.props.data.routeId._text, this.props.stationData.stationId._text).then((res) => {
            if (res.response.msgHeader.resultCode._text == 0) {
                this.setState({
                    stationRouteInfo: res.response.msgBody.busArrivalItem
                })
            }
        })
    }

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
                        sections={this.state.stationRouteInfo}
                        navigation={this.props.navigation}
                        onPressDetail={() => {

                        }}
                    />
                }
                renderContent={(content, index, isActive, sections) =>
                    <RenderContent
                        content={content}
                        index={index}
                        isActive={isActive}
                        sections={this.state.stationRouteInfo}
                    />
                }
                onChange={this._updateSections}
                expandMultiple={true}
                underlayColor={'transparent'}
                duration={300}
            />
        );
    }
}