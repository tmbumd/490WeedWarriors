import express from 'express';
import apiRoutes from './server/routes/apiRoutes.js';

const app = express();
const port = 4000;
const staticFolder = 'client';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(staticFolder));
app.use('/api', apiRoutes);

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});