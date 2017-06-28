import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import BackgroundGeolocation from 'react-native-background-geolocation';
import Map from '../../components/Map';
import StoreMarker from '../../components/Map/StoreMarker';
import PushNotification from 'react-native-push-notification';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class MapView extends Component {
  static componentName = 'MapView';

  constructor() {
    super();

    this.state = {
      mapScrollEnabled: false,
      followsUserLocation: true,
      showsUserLocation: true,
      discounts: [],
      geofences: [],
      region: {
        latitude: 51.917156,
        longitude: 4.484897,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    };

    this.onGeofence = this.onGeofence.bind(this);
    this.onLocation = this.onLocation.bind(this);
    this.onMapPanDrag = this.onMapPanDrag.bind(this);
  }

  componentWillMount() {
    BackgroundGeolocation.on('geofence', this.onGeofence);
    BackgroundGeolocation.on('location', this.onLocation);

    // 2.  #configure the plugin (just once for life-time of app)
    BackgroundGeolocation.configure({
      // Geolocation Config
      desiredAccuracy: 0,
      stationaryRadius: 5,
      distanceFilter: 5,
      // Activity Recognition
      stopTimeout: 1,
      // Application config
      debug: false, // <-- enable this hear sounds for background-geolocation life-cycle.
      logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
      stopOnTerminate: false,   // <-- Allow the background-service to continue tracking when user closes the app.
      startOnBoot: true,        // <-- Auto start tracking when device is powered-up.
    });
  }

  componentDidMount() {
    fetch('https://docent.cmi.hro.nl/bootb/service/v1/discount')
      .then(res => res.json())
      .then((discounts) => this.processDiscounts(discounts));
  }

  processDiscounts(discounts) {
    discounts.forEach(discount => {
      discount.location = {
        latitude: discount.latitude,
        longitude: discount.longitude,
      };

      BackgroundGeolocation.getGeofences((geofences) => {
        const existingGeofence = geofences.find(geofence => geofence.identifier === discount.discount_id.toString());
        const geofence = Object.assign(
          {
            identifier: discount.discount_id,
            radius: 150,
            notifyOnEntry: true,
            notifyOnExit: false,
            notifyOnDwell: false,
            extras: discount,
          },
          discount.location
        );

        if(existingGeofence) {
          geofence.extras.visited = existingGeofence.extras.visited;
        } else {
          geofence.extras.visited = 0;
        }

        BackgroundGeolocation.addGeofence(geofence, () => {
          this.setState({ discounts: [...this.state.discounts, discount] });
        });
      });
    });

    BackgroundGeolocation.getGeofences(geofences => this.setState({ geofences }));
  }

  componentWillUnmount() {
    BackgroundGeolocation.un('geofence', this.onGeofence);
    BackgroundGeolocation.un('location', this.onLocation);
  }

  onGeofence(geofence) {
    geofence.extras.visited += 1;
    BackgroundGeolocation.addGeofence(geofence);
    BackgroundGeolocation.getGeofences(geofences => this.setState({ geofences }));
    PushNotification.localNotification({
      message: `Aanbieding gevonden! Bij de ${geofence.extras.store} is ${geofence.extras.discount} in de aanbieding.`,
    });
  }

  onLocation(location) {
    this.setCenter(location);
  }

  onMapPanDrag(location) {
    this.setState({
      followsUserLocation: false,
      mapScrollEnabled: true,
    });
  }

  setCenter(location, force = false) {
    if(!this.map || (!this.state.followsUserLocation && !force)) {
      return;
    }
    this.map.animateToCoordinate({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    });
  }

  renderMarkers() {
    return this.state.discounts.map((discount) => {
      const geofence = this.state.geofences.find(geofence => geofence.identifier === discount.discount_id.toString());
      return (
        <StoreMarker
          key={discount.discount_id}
          discount={discount}
          visited={geofence.extras.visited > 0}
        />
      );
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Map
          ref={(m) => this.map = m && m.map}
          initialRegion={this.state.region}
          showsUserLocation={true}
          onPanDrag={this.onMapPanDrag}
          scrollEnabled={this.state.mapScrollEnabled}
          showsPointsOfInterest={false}
          showsScale={false}
          showsTraffic={false}
          toolbarEnabled={false}
        >
          {this.renderMarkers()}
        </Map>
      </View>
    );
  }
}

export default MapView;
