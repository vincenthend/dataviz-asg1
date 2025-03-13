import fs from 'fs'
import csvParser from 'csv-parser'

interface CsvRow {
  [key: string]: string;
}

function filterCsv(filePath: string, condition: (row: CsvRow) => boolean): void {
  const outputStream = fs.createWriteStream('src/data/FilteredEntities.csv')
  let outputHeader = false
  fs.createReadStream(filePath)
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
const filePath = 'src/data/EntitiesRegisteredwithACRA.csv'
const condition = (row: CsvRow) => new Date(row['uen_issue_date']).getFullYear() > 2019 // Replace with your actual condition

filterCsv(filePath, condition)