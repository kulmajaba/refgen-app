import { Action, ActionCreator, Dispatch, Reducer } from 'redux';
import { ThunkAction } from 'redux-thunk';

export type ScannerState = {
  loading: boolean,
  error: Error | undefined
};

const defaultState: ScannerState = {
  loading: false,
  error: undefined
};

// TS 'typeof' returns the exact value as type for implicitly typed 'const'
const SCAN = 'refgen-app/scanner/SCAN';

interface scanStartAction extends Action {
  type: typeof SCAN;
};

type KnownAction = scanStartAction;

export default function reducer (state: ScannerState = defaultState, action: KnownAction): ScannerState {
  switch (action.type) {
    case SCAN: {
      return {
        ...state,
        loading: true
      };
    }
    default: {
      return state;
    }
  }
}

export function startScan() {
  return {
    type: SCAN
  };
}