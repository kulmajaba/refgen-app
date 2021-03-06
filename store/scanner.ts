import { Action } from 'redux';

import assertNever from '../util/assertNever';

export type BarCodeScannerResult = {
  type: string,
  data: string
};

export type ScannerState = Readonly<{
  isBusy: boolean,
  scanResultData: string | undefined,
  hasCameraPermission: boolean | undefined,
  error: Error | undefined
}>;

const defaultState: ScannerState = {
  isBusy: false,
  scanResultData: undefined,
  hasCameraPermission: undefined,
  error: undefined
};

// TS 'typeof' returns the exact value as type for implicitly typed 'const'
const CAMERA_PERMISSION = 'refgen-app/scanner/CAMERA_PERMISSION';
const SCAN_RESULT_DONE = 'refgen-app/scanner/SCAN_RESULT_DONE';
const SCAN_SUCCESS = 'refgen-app/scanner/SCAN_SUCCESS';

interface CameraPermissionAction extends Action {
  type: typeof CAMERA_PERMISSION;
  payload: boolean;
};

interface ScanResultDoneAction extends Action {
  type: typeof SCAN_RESULT_DONE;
}

interface ScanSuccessAction extends Action {
  type: typeof SCAN_SUCCESS;
  payload: string;
};

type KnownAction = CameraPermissionAction |
                   ScanResultDoneAction |
                   ScanSuccessAction;

export default function reducer (state: ScannerState = defaultState, action: KnownAction): ScannerState {
  switch (action.type) {
    case CAMERA_PERMISSION: {
      return {
        ...state,
        hasCameraPermission: action.payload
      };
    }
    case SCAN_RESULT_DONE: {
      return {
        ...state,
        isBusy: false
      };
    }
    case SCAN_SUCCESS: {
      if (state.isBusy) {
        return state;
      }

      return {
        ...state,
        isBusy: true,
        scanResultData: action.payload
      };
    }
    default: {
      assertNever(action);
      return state;
    }
  }
}

export function cameraPermission(payload: boolean): CameraPermissionAction {
  return {
    type: CAMERA_PERMISSION,
    payload
  };
}

export function scanResultDone(): ScanResultDoneAction {
  return {
    type: SCAN_RESULT_DONE
  };
}

// Only use scanned data, also available type and target (target exists on Android, not sure about iOS)
// TODO: Fix BarCodeScannerCallback type in DefinitelyTyped repo, check target in iOS
export function scanSuccess(payload: BarCodeScannerResult): ScanSuccessAction {
  return {
    type: SCAN_SUCCESS,
    payload: payload.data
  };
}