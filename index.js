import express from 'express';
import apiRoutes from './server/routes/apiRoutes.js';
import { Storage } from '@google-cloud/storage';
import Multer from 'multer';

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, 
    },
});

let projectId = "INST490"; 
let keyFilename = "GCkeys.json"; 
const storage = new Storage({
    projectId,
    keyFilename,
});
const bucket = storage.bucket("weedwarriors"); 
const app = express();
const PORT = process.env.PORT | 3000;

app.use(express.static('client'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', apiRoutes);

app.post("/upload", multer.single("hidden-new-file"), (req, res) => {
    console.log("Made it /upload");
    try {
        if (req.file) {
            console.log("File found, trying to upload...");
            const blob = bucket.file(req.file.originalname);
            const blobStream = blob.createWriteStream();

            blobStream.on("finish", () => {
                res.status(200).send("Success");
                console.log("Success");
            });
            blobStream.end(req.file.buffer);
        } else throw "error with img";
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(PORT, () => {
    console.log(`Now listening on port ${PORT}`);
});