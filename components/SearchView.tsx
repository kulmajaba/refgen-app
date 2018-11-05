import React, { Component } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
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
      <View style={styles.listItem}>
        {
          item.volumeInfo.imageLinks !== undefined && item.volumeInfo.imageLinks.smallThumbnail !== undefined &&
          <Image
            style={styles.image}
            source={{uri: item.volumeInfo.imageLinks.smallThumbnail}}
            resizeMode={'contain'}
          />
        }
        <View style={styles.listItemInfo}>
          {
            item.volumeInfo.authors !== undefined &&
            item.volumeInfo.authors.map((author: string, index: number) => {
              return <Text key={`author${index}`}>{author}</Text>;
            })
          }
          <Text>{item.volumeInfo.title}</Text>
          {
            item.volumeInfo.subtitle !== undefined &&
            <Text>{item.volumeInfo.subtitle}</Text>
          }
          <Text>Published: {item.volumeInfo.publishedDate}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => this._itemSelected(item)}>
          <Text style={styles.buttonText}>USE</Text>
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
          keyExtractor={(item: BookData) => item.id}
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
  button: {
    padding: 18,
    borderRadius: 8,
    backgroundColor: '#555'
  },
  buttonText: {
    color: 'white'
  },
  container: {
    flex: 1,
  },
  image: {
    width: 50,
    height: 90,
    borderRadius: 4
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 8,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 8,
    backgroundColor: '#ccc'
  },
  listItemInfo: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    margin: 8
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