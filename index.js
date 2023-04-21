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

let projectId = process.env.PROJECT_ID;
let keyFilename = process.env.GC_SERVICE_ACCOUNT_CREDS;
const storage = new Storage({
    projectId,
    keyFilename,
});
const bucket = storage.bucket(process.env.BUCKET);
const app = express();
const PORT = process.env.PORT | 3000;

app.use(express.static('client'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', apiRoutes);

app.post("/upload", multer.single("hidden-new-file"), (req, res) => {
    try {
        if (req.file) {
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