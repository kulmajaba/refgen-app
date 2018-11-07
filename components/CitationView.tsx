import React, { Component, ReactNode } from 'react';
import { Alert, View, Text, StyleSheet, TouchableHighlight, Image, ImageStyle, TextInput, Share } from 'react-native';
import { NavigationContainerProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';

import { ApplicationState } from '../store';
import { globalStyles, colors } from '../util/styleConstants';
import AndroidButton from './AndroidButton';

type StateProps = {
  citation: string | undefined
};

type DispatchProps = {
  
};

type Props = Readonly<NavigationContainerProps & StateProps & DispatchProps>;

class MainView extends Component<Props> {
  static navigationOptions = {
    title: 'Citation',
  };

  _shareCitation() {
    const { citation } = this.props;
    if (citation === undefined) {
      console.warn('Citation undefined');
      return;
    }

    Share.share({ message: citation });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={[globalStyles.bobyText, styles.bodyText]}>
          Citation generated. Make sure it's correct and share it however you like.
        </Text>

        <Text style={globalStyles.bobyText}>
          {this.props.citation}
        </Text>

        <AndroidButton imageSource={require('../assets/share.png')} onPress={() => this._shareCitation()} />
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
    citation: state.bookApi.citation
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  
}, dispatch);

export default connect<StateProps, DispatchProps, {}, ApplicationState>(mapStateToProps, mapDispatchToProps)(MainView);
