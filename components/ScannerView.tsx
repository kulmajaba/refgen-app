import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { NavigationContainerProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { BarCodeScanner } from 'expo';

import { ApplicationState } from '../store';
import { BarCodeScannerResult, scanSuccess, scanResultCancel } from '../store/scanner';
import delay from '../util/delay';

type StateProps = {
  isBusy: boolean,
  scanResultData: string | undefined,
  hasCameraPermission: boolean | undefined
};

type DispatchProps = {
  scanSuccess: typeof scanSuccess,
  scanResultCancel: typeof scanResultCancel
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
      console.warn('ScannerView: access to camera was not checked before.');
      return <Text>No access to camera</Text>;
    }
    
    return (
      <View style={{ flex: 1 }}>
        <BarCodeScanner
          onBarCodeRead={
            isBusy ? // This will only prevent events when this view is focused
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

  _alertOkPressed() {
    if (this.props.navigation == undefined) {
      console.warn('ScannerView: navigation prop is undefined');
      return;
    }
    
    this.props.navigation.navigate('Search');
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