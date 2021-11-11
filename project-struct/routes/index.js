// @ts-nocheck
const express = require('express')
const router = express.Router()
const fs = require('fs')
const FILE_PATH = '/Users/zq/go/src/cam/back'
const { v4: uuidv4 } = require('uuid')
/* GET home page. */

router.get('/1', async function (req, res, next) {
  // const file = queryfile(FILE_PATH)
  res.send(uuidv4())
})

router.get('/2', async function (req, res, next) {
  const file = queryfile(FILE_PATH)
  const data = await makeData(file.slice(1, 50))
  res.send({ label: 'cam', name: 'cam', children: data, id: 'cam' })
})

async function makeData (list) {
  if (list && list.length > 0) {
    const data = []
    for (const r of list) {
      const quote = []
      const outline = { name: r.name, children: [], label: r.name, id: uuidv4() }
      if (!r.children) {
        const path = await readFile(`${r.path}/${r.name}`)
        quote.push(...(await getContent(path)))
        continue
      } else {
        for (const i of r.children) {
          if (i.name.indexOf('.go') !== -1) {
            const path = await readFile(`${r.path}/${r.name}/${i.name}`)
            quote.push(...(await getContent(path)))
          } else {
            const child = await makeData([i])
            if (child.length > 0) {
              outline.children.push(...child)
            }
          }
        }
      }
      outline.quote = Array.from(new Set(quote))
      data.push(outline)
    }
    return data
  }
}

// 递归获取目录和文件
function queryfile (path) {
  const list = fs.readdirSync(path)
  if (list && list.length > 0) {
    return list.map(name => {
      const dir = `${path}/${name}`
      const isFile = fs.statSync(dir)
      if (isFile && isFile.isDirectory()) {
        return { label: name, name, children: queryfile(dir), path }
      } else {
        return { label: name, name, path }
      }
    })
  }
}

// 读取文件内容
async function readFile (path) {
  return await new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(path, { start: 1, end: 1000, encoding: 'utf8', autoClose: true, flags: 'r' })
    let context
    readStream.on('open', () => {
      // console.log('开始读取')
    })
    readStream.on('data', (data) => {
      context = context + data
    })
    readStream.on('error', (err) => {
      console.log('读取失败', err)
      reject(err)
    })
    readStream.on('end', () => {
      resolve(context)
      // console.log('读取完毕')
    })
  })
}

// 过滤文件内容
async function getContent (data) {
  const reg = /(?<=import (\([\s\S]*?\)))/g
  const arr = reg.exec(data)
  if (arr !== undefined && arr !== null && arr.length > 0) {
    const list = (arr[arr.length - 1]).replaceAll('\n\t', ',').replaceAll('\n', '').replaceAll('(', '').replaceAll(')', '').replaceAll('\t', '')
      .replaceAll('"', '')
    return list.split(',').filter(r => {
      return r !== ''
    })
  }
  return []
}

module.exports = router
