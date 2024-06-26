const express = require('express');
const bodyParser = require('body-parser');
const SHA256 = require('crypto-js/sha256');
const path = require('path');

const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' folder

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash).toString();
    }
}

class Patient {
    constructor(name, condition, examinationDate) {
        this.name = name;
        this.condition = condition;
        this.examinationDate = examinationDate;
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        const patientsData = [
            new Patient('tola', 'Chronic Headache', new Date().toISOString()),
            new Patient('emy', 'Anemia', new Date().toISOString()),
            new Patient('Ahmed', 'Diabetes', new Date().toISOString())
        ];

        return new Block(0, new Date().toISOString(), patientsData, '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
}

const patientBlockchain = new Blockchain();

// Endpoint to add a new block
app.post('/addBlock', (req, res) => {
    const { patientName, condition, examinationDate } = req.body;
    const newBlockData = { patientName, condition, examinationDate };
    const newBlock = new Block(patientBlockchain.chain.length, new Date().toISOString(), newBlockData);
    patientBlockchain.addBlock(newBlock);
    res.json({ message: 'Block added successfully' });
});

// Endpoint to search for a patient
app.get('/search', (req, res) => {
    const { search } = req.query;
    // Implement search logic here
    res.send(`Searching for patient: ${search}`);
  });

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log('Server is running on port', port);
});