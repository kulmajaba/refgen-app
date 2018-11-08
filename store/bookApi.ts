import { Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import assertNever from '../util/assertNever';
import readFile from '../util/readFile';
import { ApplicationState } from './';

// Not an authentication key, used for statistics.
// TODO: restrict api key usage to Android/iOS apps only
const apiKey: string = 'AIzaSyAiUlbaPvpP3QC-qnjl7_MXPQ7HY0RDgqg';

export type BookApiState = Readonly<{
  isBusy: boolean,
  searchedBooks: BookData[],
  citation: string | undefined,
  error: Error | undefined
}>;

const defaultState: BookApiState = {
  isBusy: false,
  searchedBooks: [],
  citation: undefined,
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

type KnownAction = FetchBookStartAction |
                   FetchBookSuccessAction |
                   FetchCitationStartAction |
                   FetchCitationSuccessAction |
                   FetchErrorAction;

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
        ...state,
        isBusy: false,
        citation: action.payload
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
  return async (dispatch: ThunkDispatch<undefined, undefined, KnownAction>) => {
    dispatch({ type: FETCH_BOOK_START });

    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${barCode}&key=${apiKey}`);
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const responseData = await response.json();
      
      if (responseData.totalItems === 0) {
        throw new Error('No books found');
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
    }
    catch(error) {
      console.log(error);
      dispatch({ type: FETCH_ERROR, payload: error });
    }
  }     
}

export function fetchCitation(id: string):ThunkAction<void, ApplicationState, undefined, KnownAction> {
  // e.g. https://books.google.fi/books/download/Nälkäpeli.bibtex?id=pB0GDQEACAAJ&hl=fi&output=bibtex
  return async (dispatch: ThunkDispatch<ApplicationState, undefined, KnownAction>, getState: () => ApplicationState) => {
    dispatch({ type: FETCH_CITATION_START });

    // TODO: Localize hl parameter, add a setting?
    try {
      const response = await fetch(`https://books.google.fi/books/download/?id=${id}&hl=fi&output=bibtex`);
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const data = await response.blob();
      console.log('Citation fetched')

      const text = await readFile(data);
      console.log(text);

      dispatch({ type: FETCH_CITATION_SUCCESS, payload: text });
    }
    catch (error) {
      console.log(error);
      dispatch({ type: FETCH_ERROR, payload: error });
    }
  }
}