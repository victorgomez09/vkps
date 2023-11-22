import express from 'express';

import templateRoutes from './routes/templates.route';
import deploymentRoutes from './routes/deployment.route';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

// For parsing application/json
app.use(express.json());

// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
    res.send({ message: 'Hello API' });
});

// Use routes from other files
app.use('/templates', templateRoutes);
app.use('/deployments', deploymentRoutes);

app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
});
