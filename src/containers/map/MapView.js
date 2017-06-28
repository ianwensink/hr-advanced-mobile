import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '../../components/ui/Text';

class MapView extends Component {
  static componentName = 'MapView';

  state = {
    currentPosition: {
      lat: 0,
      lng: 0,
    }
  }

  componentDidMount() {
    this.watchPosition();
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  watchPosition() {
    this.watchId = navigator.geolocation.watchPosition((position) => {
      if(
        position.coords.latitude !== this.state.currentPosition.lat ||
        position.coords.longitude !== this.state.currentPosition.lng
      ) {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.setState({ currentPosition: newLocation }, this.sendLocation);
      }
    }, console.warn, {
      maximumAge: 10000,
      distanceFilter: 0,
    });
  }

  render() {
    const styles = StyleSheet.create({
      container: {
        width: '100%',
        height: '100%',
      },
      map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
      },
    });

    return (
      <View style={styles.container}>
        <Text>Haha mooi</Text>
      </View>
    );
  }
}

export default MapView;
