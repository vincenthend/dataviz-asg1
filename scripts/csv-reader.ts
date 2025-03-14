import fs from 'fs'
import csvParser from 'csv-parser'

interface CsvRow {
  [key: string]: string;
}

function filterCsv(inputFile: string, outputFile: string, condition: (row: CsvRow) => boolean): void {
  const outputStream = fs.createWriteStream(outputFile)
  let outputHeader = false
  fs.createReadStream(inputFile)
    .pipe(csvParser())
    .on('data', (row: CsvRow) => {
      if(!outputHeader) {
        const headers = Object.values(row)
        outputStream.write(headers.join(',') + '\n')
        outputHeader = true
      }
      if (condition(row)) {
        let csvRow = ''
        for (const key in row) {
          if (csvRow.length > 0) csvRow += ','
          csvRow += `"${row[key]}"`
        }
        outputStream.write(csvRow + '\n')
      }
    }).on('end', () => {
    outputStream.end()
    outputStream.close()

  })
  .on('error', (err) => {
    outputStream.emit('error', err)
  })
}

// Example usage
const filePath = 'src/data/data.csv'
const outputFile = 'src/data/FilteredEntities.csv'
const condition = (row: CsvRow) => {
  console.log(row['degree'])
  return true
}

filterCsv(filePath, outputFile, condition)