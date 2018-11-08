# REFGEN

Refgen is a mobile application for scanning book barcodes and creating properly formatted citations out of them for you research paper.

This project is a part of a candidate's thesis being done for Tampere University of Technology. As the thesis is currently work in progress, no pull requests are accepted until the thesis is completed.

## TODO

- Polish Android styles
- Polish citation style
- iOS-specific styles

## Roadmap

- Remove MainView, reconfigure ScannerView to be the initial view. Redo the navigation stack and use event listeners in ScannerView to detect focus change and disable barcode reading.
  * OR: use MainView to display recent scans or scan results that can be reused, store data in local storage