/**
 * App Navigation
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-app
 */
import React from 'react';
// Consts and Libs
// Scenes
import Placeholder from '../components/general/Placeholder';
import Map from '../containers/Map/MapView';
// Components
import { StackNavigator } from 'react-navigation';

export const MapStack = StackNavigator({
    Map: {
      screen: Map,
      navigationOptions: {
        title: 'Map',
      },
    },
    DealDetail: {
      screen: Placeholder,
      navigationOptions: ({ navigation }) => ({
        title: navigation.state.params.label,
      }),
    },
  }
);

export const root = StackNavigator({
  Map: {
    screen: MapStack,
    navigationOptions: {
      title: 'Map',
      header: null,
    },
  },
});

export default root;
