export default function readFile(inputFile: Blob): Promise<string> {
  const temporaryFileReader = new FileReader();

  // TODO: timeout after a suitable period
  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      reject(new Error("Problem parsing input file."));
    };
    temporaryFileReader.onload = () => {
      resolve(temporaryFileReader.result as string);
    };
    temporaryFileReader.readAsText(inputFile);
  });
};