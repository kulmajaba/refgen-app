import React, { Component } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View, FlatList, TouchableOpacity, ImageStyle } from 'react-native';
import { NavigationContainerProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';

import { ApplicationState } from '../store';
import { fetchBook, fetchCitation } from '../store/bookApi';
import { colors, globalStyles } from '../util/styleConstants';

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
  static navigationOptions = {
    title: 'Search',
  };

  componentWillMount() {
    if (this.props.scanResultData === undefined) {
      console.warn("SearchView: scanResultData is undefined");
      return;
    }
    this.props.fetchBook(this.props.scanResultData);
  }

  _renderLoadingView() {
    return (
      <View style={[styles.container, styles.loading]}>
        <Text style={[globalStyles.bobyText, styles.loadingText]}>Searching Google Books for {this.props.scanResultData}</Text>
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
            style={styles.image as ImageStyle} // TODO: fix type
            source={{uri: item.volumeInfo.imageLinks.smallThumbnail}}
            resizeMode={'contain'}
          />
        }
        <View style={styles.listItemInfo}>
          <Text style={[globalStyles.bobyText, {fontWeight: 'bold'}]}>{item.volumeInfo.title}</Text>
          {
            item.volumeInfo.subtitle !== undefined &&
            <Text style={styles.subtitle}>{item.volumeInfo.subtitle}</Text>
          }
          <Text style={globalStyles.bobyText}>
            {
              item.volumeInfo.authors !== undefined &&
              item.volumeInfo.authors.join(', ')
            }
          </Text>
          <Text style={globalStyles.bobyText}>Published: {item.volumeInfo.publishedDate}</Text>
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
          ListHeaderComponent={<View style={styles.listHeader} />}
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
    backgroundColor: colors.primaryColorD
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
  },
  container: {
    flex: 1,
    backgroundColor: '#ccc'
  },
  image: {
    width: 50,
    height: 90,
    borderRadius: 4
  },
  listHeader: {
    marginTop: 8
  },
  listItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginHorizontal: 8,
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 8,
    backgroundColor: '#f0f0f0'
  },
  listItemInfo: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
    margin: 8
  },
  loading: {
    justifyContent: 'flex-start',
    alignContent: 'center',
    paddingHorizontal: 32
  },
  loadingText: {
    marginVertical: 40,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 15,
    color: '#444',
    paddingLeft: 6
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