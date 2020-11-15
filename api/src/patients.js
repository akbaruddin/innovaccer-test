const fs = require('fs');
const path = require('path');
const multer = require('multer');
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const excelToJson = require('convert-excel-to-json');
const csv = require('csvtojson')
const route = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname + '/../uploads/'))
  },
  filename: (req, file, cb) => {
    cb(null, path.join(file.fieldname + "-" + Date.now() + "-" + file.originalname))
  }
});

const upload = multer({storage: storage});

const clientDB = new MongoClient(process.env.DB_URL,  { useUnifiedTopology: true, useNewUrlParser: true })

async function excelData(file) {
  const excel =  excelToJson({
      sourceFile: file,
      header:{
        rows: 1
      },
      columnToKey: {
        A: 'firstName',
        B: 'lastName',
        C: 'age',
        D: 'gender',
        E: 'contact'
      }
    });

  return excel.data
}

async function csvData(file) {
  const data = await csv().fromFile(file);
  return data
}

route.get('/', async (req, res) => {
  let next = parseInt(req.query.next) || 0;
  console.log(next)
  await clientDB.connect();
  const collections = await clientDB.db(process.env.DB_NAME).collection("patients").find().skip(next).limit(100);
  const results = await collections.toArray();
  res.send( { results, next: next + 100 });
})

route.post('/', upload.single("file"), async (req, res) => {
  try  {
    const filePath = path.join(__dirname + '/../uploads/' + req.file.filename);
    console.log(path.extname(filePath) === '.csv')
    const excelData = path.extname(filePath) === '.csv' ? await csvData(filePath): await excelData(filePath);
    await clientDB.connect();
    const collection = clientDB.db(process.env.DB_NAME).collection("patients");
    const resp = await collection.insertMany(excelData, { ordered: true })
    fs.unlinkSync(filePath);
    clientDB.close();
    res.send({ msg: "Your file has been successfully uploaded." });
  } catch(e){
    res.send({ msg: e });
  }
})

route.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  await clientDB.connect();
  const collections = await clientDB.db(process.env.DB_NAME).collection("patients").find(ObjectId(userId))
  const results = await collections.toArray();
  clientDB.close();
  res.send(results)
})

module.exports = route;
