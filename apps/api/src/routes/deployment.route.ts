import express from 'express';
import {
    deployApplication,
    getApplicationDeployment,
} from '../services/deployment.service';

const router = express.Router();

router.get('/find', getApplicationDeployment);

router.post('/create/:name', deployApplication);

export default router;
