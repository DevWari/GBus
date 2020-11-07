import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import BusStationHeader from '../../../GlobalComponents/LayoutComponents/BusStationHeader';
import BusRoute from '../../../GlobalComponents/LayoutComponents/BusRoute';
import Data from '../../../GlobalComponents/Dummy/Data';

export function RenderContent({content, index, isActive, sections, navigation}) {
    return (
        <>
            {
                sections[0].data.map((item, index) => (
                    <BusRoute key={index} 
                        data={item} 
                        stationData={sections[0].stationInfo} 
                        navigation={navigation}/>
                ))
            }
        </>
    )
}

export default class BusStationFavor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeSections: [0],
            stationInfo: null
        };
    }

    _renderHeader(content, index, isActive, sections, navigation) {
        return (
            <BusStationHeader data = {sections[0]} navigation={navigation} />
        )
    }

    _updateSections = activeSections => {
        this.setState({ activeSections })
    }

    render() {
        return (
            <Accordion
                sections={[this.props.item]}
                activeSections={this.state.activeSections}
                renderHeader={(content, index, isActive, sections) => 
                    this._renderHeader(content, index, isActive, sections, this.props.navigation)
                }
                renderContent={(content, index, isActive, sections)=>
                    <RenderContent
                        content={content}
                        index={index}
                        isActive={isActive}
                        sections={sections}
                        navigation={this.props.navigation}
                    />
                }
                onChange={this._updateSections}
                underlayColor={'transparent'}
                duration={300}
                containerStyle={{ marginBottom: 5 }}
                disabled
            />
        );
    }
}