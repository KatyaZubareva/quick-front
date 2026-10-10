import { Request, Response } from 'express';
import ProjectGenerator from '../services/projectGenerator';
import ZipService from '../services/zipService';
import { ProjectConfig } from '../types';

class DownloadController {
  async downloadProject(req: Request, res: Response) {
    try {
      const encodedParams = req.query.params as string;
      if (!encodedParams) {
        return res.status(400).json({ error: 'Missing parameters' });
      }

      const config: ProjectConfig = JSON.parse(
        Buffer.from(encodedParams, 'base64').toString('utf-8')
      );

      if (!config.framework || !config.projectName) {
        return res.status(400).json({ error: 'Invalid project configuration' });
      }

      const generator = new ProjectGenerator();
      const projectFiles = await generator.generate(config);

      const zipService = new ZipService();
      const zipBuffer = await zipService.createZip(projectFiles);

      res.set({
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(config.projectName)}.zip`,
        'Content-Length': zipBuffer.length
      });

      res.send(zipBuffer);

    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to generate project'
      });
    }
  }

  async generateProject(req: Request, res: Response) {
    try {
      const config: ProjectConfig = req.body;

      if (!config?.framework || !config?.projectName) {
        return res.status(400).json({ error: 'Invalid project configuration' });
      }

      const generator = new ProjectGenerator();
      const files = await generator.generate(config);

      res.json({ files });
    } catch (error) {
      console.error('Generate error:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Failed to generate project'
      });
    }
  }
}

export default new DownloadController();