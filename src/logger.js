import path from 'node:path'
import winston from 'winston'

export function makeLogger(level, format, file) {
  // <1>
  return {
    level: level,
    format: makeFormat(format),
    transports: [
      makeTransportFile(file),
      ...(process.env.LOG_CONSOLE === '1' ? [makeTransportConsole()] : []),
    ],
  }
}

export function makeFormat(format) {
  // <2>
  if (format === 'json') {
    return makeFormatJson()
  }
  if (format === 'raw') {
    return makeFormatRaw()
  }
  throw new TypeError(`invalid format: '${format}'`)
}

export function makeFormatJson(_level, _file, _format) {
  // <3>
  return winston.format.combine(winston.format.timestamp(), winston.format.json())
}

export function makeFormatRaw(_level, _file, _format) {
  // <4>
  return winston.format.printf(({ message }) => message)
}

export function makeTransportFile(filename) {
  // <5>
  const dirname = process.env.LOG_DIRNAME || path.join(process.cwd(), 'log')

  if (process.env.LOG_ROTATION === '1') {
    return new winston.transports.File({
      dirname,
      filename,
      maxsize: 10 * 1024 * 1024,
      maxFiles: 10,
      tailable: true,
    })
  }
  return new winston.transports.File({
    dirname,
    filename,
  })
}

export function makeTransportConsole() {
  // <6>
  return new winston.transports.Console({
    format: makeFormatRaw(),
  })
}
