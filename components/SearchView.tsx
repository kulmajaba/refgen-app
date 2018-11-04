import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { NavigationContainerProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';

import { ApplicationState } from '../store';
import { fetchBook, fetchCitation } from '../store/bookApi';

type StateProps = {
  scanResultData: string | undefined,
  searchedBooks: BookData[],
  isBusy: boolean
};

type DispatchProps = {
  fetchBook: typeof fetchBook,
  fetchCitation: typeof fetchCitation
};

type Props = Readonly<NavigationContainerProps & StateProps & DispatchProps>;

class SearchView extends Component<Props> {
  componentWillMount() {
    if (this.props.scanResultData === undefined) {
      console.warn("SearchView: scanResultData is undefined");
      return;
    }
    this.props.fetchBook(this.props.scanResultData);
  }

  _renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>Searching Google Books for {this.props.scanResultData}</Text>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  _renderListItem(item: BookData) {
    return (
      <View style={styles.listItem} key={item.id}>
        <Text>{item.volumeInfo.title}</Text>
        <TouchableOpacity onPress={() => this._itemSelected(item)}>
          <Text>USE</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderResultsView() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.searchedBooks}
          renderItem={(obj: {item: BookData}) => this._renderListItem(obj.item)}
        />
      </View>
    );
  }

  render() {
    if (this.props.isBusy) {
      return this._renderLoadingView();
    }
    else {
      return this._renderResultsView();
    }
  }

  _itemSelected(item: BookData) {
    console.log(`Selected: ${item.volumeInfo.title}`);
    this.props.fetchCitation(item.id);
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

const mapStateToProps = (state: ApplicationState) => {
  return {
    scanResultData: state.scanner.scanResultData,
    searchedBooks: state.bookApi.searchedBooks,
    isBusy: state.bookApi.isBusy
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  fetchBook,
  fetchCitation
}, dispatch);

export default connect<StateProps, DispatchProps, {}, ApplicationState>(mapStateToProps, mapDispatchToProps)(SearchView);