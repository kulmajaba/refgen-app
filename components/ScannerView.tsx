import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { BarCodeScanner } from 'expo';

import { ApplicationState } from '../store';
import { BarCodeScannerResult, scanSuccess, scanResultCancel } from '../store/scanner';

type StateProps = {
  isBusy: boolean,
  scanResultData: string | undefined,
  hasCameraPermission: boolean | undefined
};

type DispatchProps = {
  scanSuccess: typeof scanSuccess,
  scanResultCancel: typeof scanResultCancel
};

type Props = Readonly<StateProps & DispatchProps>;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

class ScannerView extends Component<Props> {
  componentDidUpdate(prevProps: Props) {
    const { scanResultData } = this.props;

    // Condition used to have && scanResultData !== prevProps.scanResultData
    // Add this back in? If so, clear scanResultData when exiting this view.
    // Gotcha: if using navigation.navigate, the call does not unmount view
    if (scanResultData !== undefined && !prevProps.isBusy) {
      Alert.alert(
        'Barcode scanned',
        `A barcode with the data ${scanResultData} has been scanned. Search this?`,
        [
          { text: 'Cancel', onPress: () => this._alertCancelPressed(), style: 'cancel' },
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { onDismiss: () => this._alertCancelPressed() }
      );
    }
  }

  render() {
    const { hasCameraPermission, isBusy } = this.props;

    if (hasCameraPermission !== true) { // Should never happen
      console.warn("ScannerView: access to camera was not checked before.");
      return <Text>No access to camera</Text>;
    }
    
    return (
      <View style={{ flex: 1 }}>
        <BarCodeScanner
          onBarCodeRead={
            isBusy ?
            undefined :
            (res: BarCodeScannerResult) => {
              console.log(`Barcode ${res.data} read`)
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
    this.props.scanResultCancel();
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
  scanResultCancel
}, dispatch);

export default connect<StateProps, DispatchProps, {}, ApplicationState>(mapStateToProps, mapDispatchToProps)(ScannerView);