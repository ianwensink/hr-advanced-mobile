import React, { Component } from 'react';
import { View } from 'react-native';
import MapView from 'react-native-maps';

const styles = {
  icon: {
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: 'red',
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  visited: {
    backgroundColor: 'blue',
  },
};

class StoreMarker extends Component {
  render() {
    const discount = this.props.discount;
    return (
      <MapView.Marker
        key={discount.discount_id}
        coordinate={discount.location}
        anchor={{ x: 0, y: 0.1 }}
        title={`${discount.discount} - ${discount.store}`}>
        <View style={[styles.icon, this.props.visited && styles.visited]} />
      </MapView.Marker>
    )
  }
}

export default StoreMarker;
