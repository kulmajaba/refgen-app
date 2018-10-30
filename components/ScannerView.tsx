import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { BarCodeScanner } from 'expo';

import { ApplicationState } from '../store';
import { scanSuccess, scanResultCancel } from '../store/scanner';

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

class ScannerView extends Component<Props> {
  componentDidUpdate(prevProps: Props) {
    const { scanResultData } = this.props;

    if (scanResultData !== undefined && !prevProps.isBusy && scanResultData !== prevProps.scanResultData) {
      Alert.alert(
        'Barcode scanned',
        `A barcode with the data ${scanResultData} has been scanned. Search this?`,
        [
          { text: 'Cancel', onPress: () => this.props.scanResultCancel(), style: 'cancel' },
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { onDismiss: () => this.props.scanResultCancel() }
      );
    }
  }

  // TODO: Set more sensible scanning interval, now leads to a bit of a race condition with the alerts
  render() {
    const { hasCameraPermission } = this.props;

    if (hasCameraPermission !== true) { // Should never happen
      console.warn("ScannerView: access to camera was not checked before.");
      return <Text>No access to camera</Text>;
    }

    const { scanResultData } = this.props;
    
    return (
      <View style={{ flex: 1 }}>
        <BarCodeScanner
          onBarCodeRead={(res: { type: string; data: string; }) => this._handleBarCodeScanned(res)}
          style={StyleSheet.absoluteFill}
        />
      </View>
    );
  }

  // TODO: Fix BarCodeScannerCallback type in DefinitelyTyped repo, check target in iOS
  _handleBarCodeScanned(res: { type: string, data: string }) {
    this.props.scanSuccess(res);
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