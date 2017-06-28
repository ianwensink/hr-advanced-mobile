import React, { Component } from 'react';
import MapView from 'react-native-maps';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

class Map extends Component {
  render() {
    const children = React.Children.map(this.props.children, child => child);
    delete this.props.children;
    return (
      <MapView
        {...this.props}
        style={styles.map}
        ref={(m) => this.map = m}
      >
        {children}
      </MapView>
    );
  }
}

export default Map;
