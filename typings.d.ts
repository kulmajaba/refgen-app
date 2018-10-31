declare module "*.json" {
  const value: any;
  export default value;
}

type BookResource = {
  kind: "books#volume",
  id: string,
  etag: string,
  selfLink: string,
  volumeInfo: {
    title: string,
    subtitle?: string,
    authors: string[],
    publisher?: string,
    publishedDate: string, // "2005-11-21", "1849"
    description?: string,
    industryIdentifiers: Array<{
      type: string, // "ISBN_13", "ISBN_10", "OTHER"
      identifier: string
    }>,
    readingModes?: {
      text: boolean,
      image: boolean
    },
    pageCount: number,
    dimensions?: {
      height: string,
      width: string,
      thickness: string
    },
    printType: string, // "BOOK"
    maturityRating: string, // "NOT_MATURE"
    allowAnonLogging: boolean,
    mainCategory?: string,
    categories?: string[],
    averageRating?: number,
    ratingsCount?: number,
    contentVersion: string, // "0.1.1.0.full.1"
    panelizationSummary?: {
      containsEpubBubbles: boolean,
      containsImageBubbles: boolean
    },
    imageLinks: {
      smallThumbnail: string,
      thumbnail: string,
      small?: string,
      medium?: string,
      large?: string,
      extraLarge?: string
    },
    language: string, // "en"
    previewLink: string,
    infoLink: string,
    canonicalVolumeLink: string
  },
  userInfo?: { // Not available without authentication
    review: any // mylibrary.reviews Resource,
    readingPosition: any // mylibrary.readingpositions Resource,
    isPurchased: boolean,
    isPreordered: boolean,
    updated: string
  },
  saleInfo: {
    country: string, // "FI"
    saleability: string, // "FREE", "NOT_FOR_SALE"
    onSaleDate?: string,
    isEbook: boolean,
    listPrice?: {
      amount: number,
      currencyCode: string
    },
    retailPrice?: {
      amount: number,
      currencyCode: string
    },
    buyLink?: string,
    offers?: Array<{
      finskyOfferType: number,
      listPrice: {
        amountInMicros: number,
        currencyCode: string // "EUR"
      },
      retailPrice: {
        amountInMicros: number,
        currencyCode: string // "EUR"
      }
    }>
  },
  accessInfo: {
    country: string, // "FI"
    viewability: string, // "ALL_PAGES", "PARTIAL"
    embeddable: boolean,
    publicDomain: boolean,
    textToSpeechPermission: string, // "ALLOWED"
    epub: {
      isAvailable: boolean,
      downloadLink?: string,
      acsTokenLink?: string
    },
    pdf: {
      isAvailable: boolean,
      downloadLink?: string,
      acsTokenLink?: string
    },
    webReaderLink: string,
    accessViewStatus: string, // "FULL_PUBLIC_DOMAIN", "SAMPLE"
    quoteSharingAllowed: boolean,
    downloadAccess?: {
      kind: "books#downloadAccessRestriction",
      volumeId: string,
      restricted: boolean,
      deviceAllowed: boolean,
      justAcquired: boolean,
      maxDownloadDevices: number,
      downloadsAcquired: number,
      nonce: string,
      source: string,
      reasonCode: string,
      message: string,
      signature: string
    }
  },
  searchInfo?: {
    textSnippet: string
  }
}

type BookResponse = {
  kind: "books#volumes",
  totalItems: number,
  items: BookResource[]
}