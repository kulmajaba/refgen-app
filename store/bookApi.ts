import { Action, ActionCreator, Dispatch, Reducer } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import assertNever from './assertNever';
import { ApplicationState } from '.';
import readFile from './readFile';

// Not an authentication key, used for statistics.
// TODO: restrict api key usage to Android/iOS apps only
const apiKey: string = 'AIzaSyAiUlbaPvpP3QC-qnjl7_MXPQ7HY0RDgqg';

export type BookApiState = Readonly<{
  isBusy: boolean,
  searchedBooks: BookData[],
  error: Error | undefined
}>;

const defaultState: BookApiState = {
  isBusy: false,
  searchedBooks: [],
  error: undefined
};

// TS 'typeof' returns the exact value as type for implicitly typed 'const'
const FETCH_BOOK_START = 'refgen-app/bookApi/FETCH_BOOK_START';
const FETCH_BOOK_SUCCESS = 'refgen-app/bookApi/FETCH_BOOK_SUCCESS';
const FETCH_CITATION_START = 'refgen-app/bookApi/FETCH_CITATION_START';
const FETCH_CITATION_SUCCESS = 'refgen-app/bookApi/FETCH_CITATION_SUCCESS';
const FETCH_ERROR = 'refgen-app/bookApi/FETCH_ERROR';

interface FetchBookStartAction extends Action {
  type: typeof FETCH_BOOK_START;
};

interface FetchBookSuccessAction extends Action {
  type: typeof FETCH_BOOK_SUCCESS;
  payload: BookData[];
};

interface FetchCitationStartAction extends Action {
  type: typeof FETCH_CITATION_START;
};

interface FetchCitationSuccessAction extends Action {
  type: typeof FETCH_CITATION_SUCCESS;
  payload: any // TODO: Type this
};

interface FetchErrorAction extends Action {
  type: typeof FETCH_ERROR;
  payload: Error;
};

type KnownAction = FetchBookStartAction
                   | FetchBookSuccessAction
                   | FetchCitationStartAction
                   | FetchCitationSuccessAction
                   | FetchErrorAction;

export default function reducer (state: BookApiState = defaultState, action: KnownAction): BookApiState {
  switch (action.type) {
    case FETCH_BOOK_START: {
      return {
        ...state,
        isBusy: true
      };
    }
    case FETCH_BOOK_SUCCESS: {
      return {
        ...state,
        isBusy: false,
        searchedBooks: action.payload
      };
    }
    case FETCH_CITATION_START: {
      return {
        ...state,
        isBusy: true
      };
    }
    case FETCH_CITATION_SUCCESS: {
      return {
        ...state // TODO: Do something with the data
      };
    }
    case FETCH_ERROR: {
      return {
        ...state,
        isBusy: false,
        error: action.payload
      };
    }
    default: {
      assertNever(action);
      return state;
    }
  }
}

export function fetchBook(barCode: string): ThunkAction<void, undefined, undefined, KnownAction> {
  return (dispatch: ThunkDispatch<undefined, undefined, KnownAction>) => {
    dispatch({ type: FETCH_BOOK_START });

    fetch(`https://www.googleapis.com/books/v1/volumes?q=${barCode}&key=${apiKey}`)
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }

        return response.json();
      })
        .then((responseData: BookResponse) => {
          console.log(responseData);
          if (responseData.totalItems === 0) {
            throw new Error("No books found");
          }

          const payload: BookData[] = responseData.items.map((responseBook: BookResource) => {
            const book: BookData = {
              id: responseBook.id,
              selfLink: responseBook.selfLink,
              volumeInfo: {
                title: responseBook.volumeInfo.title,
                subtitle: responseBook.volumeInfo.subtitle != undefined ? responseBook.volumeInfo.subtitle : undefined,
                authors: responseBook.volumeInfo.authors,
                publisher: responseBook.volumeInfo.publisher != undefined ? responseBook.volumeInfo.publisher : undefined,
                publishedDate: responseBook.volumeInfo.publishedDate,
                industryIdentifiers: responseBook.volumeInfo.industryIdentifiers,
                printType: responseBook.volumeInfo.printType,
                imageLinks: responseBook.volumeInfo.imageLinks != undefined ? responseBook.volumeInfo.imageLinks : undefined,
                language: responseBook.volumeInfo.language,
                infoLink: responseBook.volumeInfo.infoLink
              },
              accessInfo: {
                country: responseBook.accessInfo.country,
                viewability: responseBook.accessInfo.viewability,
                publicDomain: responseBook.accessInfo.publicDomain,
                epub: responseBook.accessInfo.epub,
                pdf: responseBook.accessInfo.pdf
              }
            };
            return book;
          })

          dispatch({ type: FETCH_BOOK_SUCCESS, payload });
        })
      .catch((error: Error) => {
        console.log(error);
        dispatch({ type: FETCH_ERROR, payload: error });
      });
  }
}

export function fetchCitation(id: string):ThunkAction<void, ApplicationState, undefined, KnownAction> {
  // https://books.google.fi/books/download/Nälkäpeli.bibtex?id=pB0GDQEACAAJ&hl=fi&output=bibtex
  return (dispatch: ThunkDispatch<ApplicationState, undefined, KnownAction>, getState: () => ApplicationState) => {
    dispatch({ type: FETCH_CITATION_START });

    fetch(`https://books.google.fi/books/download/?id=${id}&hl=fi&output=bibtex`)
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }

        return response.blob()
      })
      .then(async (data: Blob) => {
        console.log('ses')
        const text = await readFile(data);
        console.log(text);
        
      })
      .catch((error: Error) => {
        console.log(error);
        dispatch({ type: FETCH_ERROR, payload: error });
      });
  }
}