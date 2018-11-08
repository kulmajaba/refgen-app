import { Constants } from 'expo';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';

import CitationView from './components/CitationView';
import MainView from './components/MainView';
import ScannerView from './components/ScannerView';
import SearchView from './components/SearchView';
import configureStore from './configureStore';
import { colors } from './util/styleConstants';

const store = configureStore();

const NavStack = createStackNavigator(
  {
    Home: MainView,
    Scanner: ScannerView,
    Search: SearchView,
    Citation: CitationView
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
