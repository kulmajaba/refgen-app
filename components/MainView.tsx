import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import { NavigationContainerProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { BarCodeScanner, Constants, Permissions } from 'expo';

import { ApplicationState } from '../store';
import { cameraPermission } from '../store/scanner';

type StateProps = {
  hasCameraPermission: boolean | undefined
};

type DispatchProps = {
  cameraPermission: (payload: boolean) => void
};

type Props = Readonly<NavigationContainerProps & StateProps & DispatchProps>;

class MainView extends Component<Props> {
  async componentWillMount() {
    const result: Permissions.PermissionResponse = await Permissions.askAsync(Permissions.CAMERA);
    this.props.cameraPermission(result.status === 'granted');
  }

  _navigateToScanner() {
    if (this.props.navigation == undefined) {
      console.warn('MainView: navigation prop is undefined');
      return;
    }
    this.props.navigation.navigate('Scanner');
  }

  render() {
    const { hasCameraPermission } = this.props;

    let text = <Text>Halo?</Text>

    if (hasCameraPermission === undefined) {
      text = <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      text = <Text>No access to camera</Text>;
    }

    return (
      <View style={styles.container}>
        {text}

        <TouchableHighlight onPress={() => this._navigateToScanner()}>
          <Text>Go to scanner</Text>
        </TouchableHighlight>
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

const mapStateToProps = (state: ApplicationState) => {
  return {
    hasCameraPermission: state.scanner.hasCameraPermission
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  cameraPermission
}, dispatch);

export default connect<StateProps, DispatchProps, {}, ApplicationState>(mapStateToProps, mapDispatchToProps)(MainView);
