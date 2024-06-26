const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const { Blockchain, Block } = require('./blockchain');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));


const healthcareDBPath = path.join(__dirname, '../healthcare.db');
const healthcareDB = new sqlite3.Database(healthcareDBPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log(`Connected to SQLite database at ${healthcareDBPath}`);
        // Ensure tables are created
        initializeDatabase();
    }
});

function initializeDatabase() {
    healthcareDB.run(`CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        gender TEXT,
        birthDate TEXT,
        lastVisitDate TEXT,
        chronicDisease TEXT,
        currentTreatment TEXT
    )`, (err) => {
        if (err) {
            console.error('Error creating patients table', err.message);
        } else {
            console.log('Patients table created successfully');
        }
    });

    healthcareDB.run(`CREATE TABLE IF NOT EXISTS doctors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        gender TEXT,
        email TEXT,
        phone TEXT,
        specialization TEXT
    )`, (err) => {
        if (err) {
            console.error('Error creating doctors table', err.message);
        } else {
            console.log('Doctors table created successfully');
        }
    });

    healthcareDB.run(`CREATE TABLE IF NOT EXISTS drugs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        type TEXT,
        creationDate TEXT
    )`, (err) => {
        if (err) {
            console.error('Error creating drugs table', err.message);
        } else {
            console.log('Drugs table created successfully');
        }
    });
}

let healthcareChain = new Blockchain();

// Add Block to Blockchain
function addBlockToChain(data, entityType) {
    const newBlock = new Block(healthcareChain.chain.length, new Date().toString(), data, healthcareChain.getLatestBlock().hash, entityType);
    healthcareChain.addBlock(newBlock);
}


// Homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});


/***************************************** Patients *****************************************/
// Get Patients Blocks
app.get('/blocks/patients', (req, res) => {
    const patientBlocks = healthcareChain.chain.filter(block => block.entityType === 'patient');
    res.json(patientBlocks);
});

// Add Patient
app.post('/add-patient', (req, res) => {
    const patientData = req.body;
    healthcareDB.run(`INSERT INTO patients (name, gender, birthDate, lastVisitDate, chronicDisease, currentTreatment) VALUES (?, ?, ?, ?, ?, ?)`,
        [patientData.addPatientName, patientData.addPatientGender, patientData.addPatientBirthDate, patientData.addPatientLastVisitDate, patientData.addPatientChronicDisease, patientData.addPatientCurrentTreatment],
        function (err) {
            if (err) {
                return res.status(500).send(err.message);
            }
            addBlockToChain(patientData, 'patient');
            res.status(201).json({ id: this.lastID });
        });
});

// Get a patient data
app.get('/patient/:id', (req, res) => {
    const id = req.params.id;
    healthcareDB.get('SELECT * FROM patients WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.json(row);
    });
});

// Update Patient
app.put('/update-patient/:id', (req, res) => {
    const id = req.params.id;
    const patientData = req.body;
    healthcareDB.run(`UPDATE patients SET name = ?, gender = ?, birthDate = ?, lastVisitDate = ?, chronicDisease = ?, currentTreatment = ? WHERE id = ?`,
        [patientData.name, patientData.gender, patientData.birthDate, patientData.lastVisitDate, patientData.chronicDisease, patientData.currentTreatment, id],
        function (err) {
            if (err) {
                return res.status(500).send(err.message);
            }
            addBlockToChain({ id, ...patientData, entity: 'patient' });
            res.status(200).json({ changes: this.changes });
        });
});

// Delete Patient
app.delete('/delete-patient/:id', (req, res) => {
    const id = req.params.id;
    healthcareDB.run('DELETE FROM patients WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        addBlockToChain({ id, entity: 'patient', deleted: true });
        res.status(200).json({ changes: this.changes });
    });
});


/***************************************** Doctors *****************************************/
// Get Doctors Blocks
app.get('/blocks/doctors', (req, res) => {
    const doctorBlocks = healthcareChain.chain.filter(block => block.entityType === 'doctor');
    res.json(doctorBlocks);
});

// Add Doctor
app.post('/add-doctor', (req, res) => {
    const doctorData = req.body;
    healthcareDB.run(`INSERT INTO doctors (name, gender, email, phone, specialization) VALUES (?, ?, ?, ?, ?)`,
        [doctorData.addDoctorName, doctorData.addDoctorGender, doctorData.addDoctorEmail, doctorData.addDoctorPhone, doctorData.addDoctorSpecialization],
        function (err) {
            if (err) {
                return res.status(500).send(err.message);
            }
            addBlockToChain(doctorData, 'doctor');
            res.status(201).json({ id: this.lastID });
        });
});

// Get a doctor data
app.get('/doctor/:id', (req, res) => {
    const id = req.params.id;
    healthcareDB.get('SELECT * FROM doctors WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.json(row);
    });
});

// Update Doctor
app.put('/update-doctor/:id', (req, res) => {
    const id = req.params.id;
    const doctorData = req.body;
    healthcareDB.run(`UPDATE doctors SET name = ?, gender = ?, email = ?, phone = ?, specialization = ? WHERE id = ?`,
        [doctorData.name, doctorData.gender, doctorData.email, doctorData.phone, doctorData.specialization, id],
        function (err) {
            if (err) {
                return res.status(500).send(err.message);
            }
            addBlockToChain({ id, ...doctorData, entity: 'doctor' });
            res.status(200).json({ changes: this.changes });
        });
});

// Delete Doctor
app.delete('/delete-doctor/:id', (req, res) => {
    const id = req.params.id;
    healthcareDB.run('DELETE FROM doctors WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        addBlockToChain({ id, entity: 'doctor', deleted: true });
        res.status(200).json({ changes: this.changes });
    });
});


/***************************************** Drugs *****************************************/
// Get Drugs Blocks
app.get('/blocks/drugs', (req, res) => {
    const drugBlocks = healthcareChain.chain.filter(block => block.entityType === 'drug');
    res.json(drugBlocks);
});

// Add Drug
app.post('/add-drug', (req, res) => {
    const drugData = req.body;
    healthcareDB.run(`INSERT INTO drugs (name, type, creationDate) VALUES (?, ?, ?)`,
        [drugData.addDrugName, drugData.addDrugType, drugData.addDrugCreationDate],
        function (err) {
            if (err) {
                return res.status(500).send(err.message);
            }
            addBlockToChain(drugData, 'drug');
            res.status(201).json({ id: this.lastID });
        });
});

// Get a drug data
app.get('/drug/:id', (req, res) => {
    const id = req.params.id;
    healthcareDB.get('SELECT * FROM drugs WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).send(err.message);
        }
        res.json(row);
    });
});

// Update Drug
app.put('/update-drug/:id', (req, res) => {
    const id = req.params.id;
    const drugData = req.body;
    healthcareDB.run(`UPDATE drugs SET name = ?, type = ?, creationDate = ? WHERE id = ?`,
        [drugData.name, drugData.type, drugData.creationDate, id],
        function (err) {
            if (err) {
                return res.status(500).send(err.message);
            }
            addBlockToChain({ id, ...drugData, entity: 'drug' });
            res.status(200).json({ changes: this.changes });
        });
});

// Delete Drug
app.delete('/delete-drug/:id', (req, res) => {
    const id = req.params.id;
    healthcareDB.run('DELETE FROM drugs WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).send(err.message);
        }
        addBlockToChain({ id, entity: 'drug', deleted: true });
        res.status(200).json({ changes: this.changes });
    });
});


// Run project
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
