import express from 'express';
import { getTemplate, listTemplates } from '../services/template.service';

const router = express.Router();

router.get('/list', listTemplates);
router.get('/find/:name', getTemplate);

export default router;
