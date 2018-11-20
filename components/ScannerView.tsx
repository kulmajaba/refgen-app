import { BarCodeScanner } from 'expo';
import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { NavigationContainerProps } from 'react-navigation';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

import { ApplicationState } from '../store';
import { BarCodeScannerResult, scanResultDone, scanSuccess } from '../store/scanner';
import delay from '../util/delay';

type StateProps = {
  isBusy: boolean,
  scanResultData: string | undefined,
  hasCameraPermission: boolean | undefined
};

type DispatchProps = {
  scanSuccess: typeof scanSuccess,
  scanResultDone: typeof scanResultDone
};

type Props = Readonly<NavigationContainerProps & StateProps & DispatchProps>;

class ScannerView extends Component<Props> {
  static navigationOptions = {
    title: 'Scan',
  };

  componentDidUpdate(prevProps: Props) {
    const { scanResultData } = this.props;

    // Gotcha: if using navigation.navigate, the call does not unmount view
    if (scanResultData !== undefined && !prevProps.isBusy) {
      Alert.alert(
        'Barcode scanned',
        `A barcode with the data ${scanResultData} has been scanned. Search this?`,
        [
          { text: 'Cancel', onPress: () => this._alertCancelPressed(), style: 'cancel' },
          { text: 'OK', onPress: () => this._alertOkPressed() },
        ],
        { onDismiss: () => this._alertCancelPressed() }
      );
    }
  }

  render() {
    const { hasCameraPermission, isBusy } = this.props;

    if (hasCameraPermission !== true) { // Should never happen
      return <Text>No access to camera</Text>;
    }
    
    return (
      <View style={{ flex: 1 }}>
        <BarCodeScanner
          onBarCodeRead={
            isBusy ? // This will only prevent events when this view is focused
            undefined :
            (res: BarCodeScannerResult) => {
              this.props.scanSuccess(res)
            }
          }
          style={StyleSheet.absoluteFill}
        />
      </View>
    );
  }

  async _alertCancelPressed() {
    await delay(1000);
    this.props.scanResultDone();
  }

  _alertOkPressed() {
    if (this.props.navigation == undefined) {
      return;
    }
    // TODO: reactivate scanner when necessary
    this.props.navigation.replace('Search');
    this.props.scanResultDone();
  }
}

const mapStateToProps = (state: ApplicationState) => {
  return {
    isBusy: state.scanner.isBusy,
    scanResultData: state.scanner.scanResultData,
    hasCameraPermission: state.scanner.hasCameraPermission
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  scanSuccess,
  scanResultDone
}, dispatch);

export default connect<StateProps, DispatchProps, {}, ApplicationState>(mapStateToProps, mapDispatchToProps)(ScannerView);