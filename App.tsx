import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { Constants } from 'expo';
import { createStackNavigator } from 'react-navigation';

import configureStore from './configureStore';
import MainView from './components/MainView';
import ScannerView from './components/ScannerView';
import SearchView from './components/SearchView';
import { colors } from './util/styleConstants';

const store = configureStore();

const NavStack = createStackNavigator(
  {
    Home: MainView,
    Scanner: ScannerView,
    Search: SearchView
  },
  {
    initialRouteName: 'Home',
    navigationOptions: {
      headerStyle: {
        backgroundColor: colors.primaryColorM,
      },
      headerTintColor: 'white',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  }
);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <NavStack />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight // https://github.com/expo/expo/issues/71
  },
});
