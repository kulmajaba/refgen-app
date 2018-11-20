import React, { Component } from 'react';
import {
  Image,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { NavigationContainerProps, NavigationScreenProp } from 'react-navigation';
import { connect } from 'react-redux';

import { ApplicationState } from '../store';
import { globalStyles } from '../util/styleConstants';
import AndroidButton from './AndroidButton';

type StateProps = {
  citation: string | undefined
};

type Props = Readonly<NavigationContainerProps & StateProps>;

class CitationView extends Component<Props> {
  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<{}> }) => {
    return {
      title: 'Citation',
      headerRight: (
        <TouchableOpacity
          onPress={() => navigation.popToTop()}
        >
          <Image source={require('../assets/home.png')} style={{ width: 32, height: 32, marginRight: 18 }} />
        </TouchableOpacity>
      )
    }
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

        <AndroidButton imageSource={require('../assets/share-white.png')} onPress={() => this._shareCitation()} />
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
  }
});

const mapStateToProps = (state: ApplicationState) => {
  return {
    citation: state.bookApi.citation
  };
};

export default connect<StateProps, {}, {}, ApplicationState>(mapStateToProps)(CitationView);
