# REFGEN

Refgen is a mobile application for scanning book barcodes and creating properly formatted citations out of them for you research paper.

## Contributing

Pull requests and issues welcome. See license for more details about modifying and distributing.

This project was a part of a candidate's thesis done for Tampere University of Technology. As the thesis was work in progress, no pull requests were accepted until the thesis was completed.

## Roadmap

- Remove MainView, reconfigure ScannerView to be the initial view. Redo the navigation stack and use event listeners in ScannerView to detect focus change and disable barcode reading.
  * OR: use MainView to display recent scans or scan results that can be reused, store data in local storage
- Graceful timeout and feedback from fetch error handling
