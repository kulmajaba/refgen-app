import React, { Component, ReactNode } from 'react';
import { Alert, View, Text, StyleSheet, TouchableHighlight, Image, ImageStyle } from 'react-native';
import { NavigationContainerProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { BarCodeScanner, Constants, Permissions } from 'expo';

import { ApplicationState } from '../store';
import { cameraPermission } from '../store/scanner';
import { fetchCitation } from '../store/bookApi';
import { globalStyles, colors } from '../util/styleConstants';
import AndroidButton from './AndroidButton';

type StateProps = {
  hasCameraPermission: boolean | undefined
};

type DispatchProps = {
  cameraPermission: typeof cameraPermission,
  fetchCitation: typeof fetchCitation
};

type Props = Readonly<NavigationContainerProps & StateProps & DispatchProps>;

class MainView extends Component<Props> {
  static navigationOptions = {
    title: 'Home',
  };

  async componentDidMount() {
    const result: Permissions.PermissionResponse = await Permissions.askAsync(Permissions.CAMERA);
    this.props.cameraPermission(result.status === 'granted');
  }

  _navigateToScanner() {
    const { hasCameraPermission, navigation } = this.props;

    if (navigation == undefined) {
      console.warn('MainView: navigation prop is undefined');
      return;
    }

    if (hasCameraPermission !== true) {
      Alert.alert(
        'No camera permission',
        'The app has not been granted permission to use the camera.',
      );
      return;
    }

    navigation.navigate('Scanner');
  }

  render() {
    const { hasCameraPermission } = this.props;

    let status: ReactNode = null;

    if (hasCameraPermission === undefined) {
      status = <Text style={[globalStyles.bobyText, styles.bodyText]}>'Requesting for camera permission'</Text>;
    }
    if (hasCameraPermission === false) {
      status = <Text style={[globalStyles.bobyText, styles.bodyText]}>'No camera permission'</Text>;
    }

    return (
      <View style={styles.container}>
        <Text style={[globalStyles.bobyText, styles.bodyText]}>
          Scan a barcode to search Google Books for the information. Select the right book and you can share the citation in BibTex format.
        </Text>
        
        {status}

        <AndroidButton imageSource={require('../assets/camera.png')} onPress={() => this._navigateToScanner()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 24
  },
  bodyText: {
    textAlign: 'center'
  },
  button: {
    backgroundColor: colors.primaryColorD,
    padding: 14,
    borderRadius: 40,
    alignSelf: 'flex-end',
    marginBottom: 12,
    marginRight: 12
  },
  buttonImage: {
    width: 48,
    height: 48
  }
});

const mapStateToProps = (state: ApplicationState) => {
  return {
    hasCameraPermission: state.scanner.hasCameraPermission
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  cameraPermission,
  fetchCitation
}, dispatch);

export default connect<StateProps, DispatchProps, {}, ApplicationState>(mapStateToProps, mapDispatchToProps)(MainView);
