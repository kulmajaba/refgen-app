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
    description?: string, // Can be HTML formatted
    industryIdentifiers: Array<{
      type: string, // "ISBN_13", "ISBN_10", "ISSN", "OTHER"
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
    printType: string, // "BOOK", "MAGAZINE"
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
      smallThumbnail: string, // w ≈ 80px
      thumbnail: string, // w ≈ 128px
      small?: string, // w ≈ 300px
      medium?: string, // w ≈ 575px
      large?: string, // w ≈ 800px
      extraLarge?: string // w ≈ 1280px
    },
    language: string, // ISO 639-1 language code
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
        currencyCode: string // ISO 4217 currency code
      },
      retailPrice: {
        amountInMicros: number,
        currencyCode: string // ISO 4217 currency code
      }
    }>
  },
  accessInfo: {
    country: string, // ISO_3166-1 country code
    viewability: string, // "ALL_PAGES", "PARTIAL", "NO_PAGES", "UNKNOWN"
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

type BookData = {
  id: string,
  selfLink: string,
  volumeInfo: {
    title: string,
    subtitle?: string,
    authors: string[],
    publisher?: string,
    publishedDate: string,
    industryIdentifiers: Array<{
      type: string,
      identifier: string
    }>,
    printType: string,
    imageLinks: {
      smallThumbnail: string,
      thumbnail: string,
    },
    language: string,
  },
  accessInfo: {
    country: string,
    viewability: string,
    publicDomain: boolean,
    epub: {
      isAvailable: boolean,
      downloadLink?: string,
      acsTokenLink?: string
    },
    pdf: {
      isAvailable: boolean,
      downloadLink?: string,
      acsTokenLink?: string
    }
  }
};