const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const app = express()
app.use(express.json())
app.use(function (err, req, res, next) {
  if (err instanceof multer.MulterError) {
    res.status(400).send('에러: 파일 업로드 중 오류가 발생했습니다.')
  } else if (err) {
    res.status(500).send('서버 오류: ' + err)
  } else {
    next()
  }
})

//https 적용 : https://gamsunghacker.tistory.com/150

const port = 4000
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)

var storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, __dirname + '/uploads')
  },
  filename: (request, file, callback) => {
    /* 확장자를 제외한 파일명 */
    console.log('file', file)
    let basename = path.basename(file.originalname)
    basename = decodeURIComponent(basename)

    /* 파일의 중복과 덮어쓰기를 방지하기 위해 시간을 붙인다 */
    const date = Date.now()

    callback(null, date + '_' + basename)
  },
})

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 100 /* 업로드할 파일의 최대 크기 100MB */,
  },
})

app.post('/upload', upload.single('frm'), (request, response) => {
  console.log('# POST /upload 전송 끝나고 나오는 부분')
  const data = {
    message: 'success',
    filename: request.file.filename,
  }
  response.status(200).json(data)
})
// use middleware to serve static images
app.use(express.static('public'))

// read data from file
const dumiData = fs.readFileSync('./data.json', 'utf-8')
const sendData = JSON.parse(dumiData)

app.get('/200', (req, res) => {
  res.json(sendData)
})
app.get('/timeout', (req, res) => {
  setTimeout(() => {
    res.json(sendData)
  }, 4000)
})

app.get('/401', (req, res) => {
  res.status(401).end()
})

if (require.main === module) {
  app.listen(port, () => console.log(`listening on port ${port}`))
}

module.exports = app
