import express from 'express';
import apiRoutes from './server/routes/apiRoutes.js';
const app = express();
const PORT = 3000;

app.use(express.static('client'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api', apiRoutes);

app.listen(PORT, () => {
    console.log(`Now listening on port ${PORT}`);
});