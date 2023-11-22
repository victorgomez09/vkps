import { Request, Response } from 'express';

import { templates } from '../templates/data.template';

export const listTemplates = (_req: Request, res: Response) => {
    res.json({
        data: templates,
    });
};

export const getTemplate = (req: Request, res: Response) => {
    const { name } = req.params;

    const template = templates.find((t) => t.name === name);

    if (!template) {
        res.status(404).json({
            error: 'Template not found',
        });
    }

    res.json({
        data: template,
    });
};
