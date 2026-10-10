import { Router } from 'express';
import DownloadController from '../controllers/downloadController';

const router = Router();

router.get('/download', DownloadController.downloadProject);
router.post('/generate', DownloadController.generateProject);

export default router;