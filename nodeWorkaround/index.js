const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const crypto = require('crypto');
const port = 3000;

app.use(express.json());

app.patch('/renameBlocksCollection', async (req, res) => {
    try {
        console.log("got request");
        const client = await MongoClient.connect("mongodb://mongo:27017", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        await client.connect();
        const db = client.db("blockchain");
        await db.renameCollection('newBlocks', 'blocks', {dropTarget: true});
        res.status(201).send();
    } catch (e) {
        res.status(500).send({message: e.message});
    }
});

app.post('/calculateHash', async (req, res) => {
    try {
        console.log(req.body.number);
        console.log(req.body.previousHash);
        console.log(req.body.createdAt);
        console.log(req.body.payload);
        console.log(req.body.nonce);
        req.body.hash = crypto.createHash('SHA256').update(req.body.number + req.body.previousHash + req.body.createdAt + JSON.stringify(req.body.payload) + req.body.nonce).digest('hex');
        while(!req.body.hash.startsWith('0000')) {
            req.body.nonce++;
            req.body.hash = crypto.createHash('SHA256').update(req.body.number + req.body.previousHash + req.body.createdAt + JSON.stringify(req.body.payload) + req.body.nonce).digest('hex');
        }
        res.json(req.body);
    } catch (e) {
        res.status(500).send({message: e.message});
    }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});