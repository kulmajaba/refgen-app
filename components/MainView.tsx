import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Constants } from 'expo';

import { ApplicationState } from '../store';

interface Props {
  
};

class MainView extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text>Halo?</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});

interface StateProps {
  
};

interface DispatchProps {
  
};

const mapStateToProps = (state: ApplicationState) => {
  return {
    
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  
}, dispatch);

export default connect<StateProps, DispatchProps, {}, ApplicationState>(mapStateToProps, mapDispatchToProps)(MainView);