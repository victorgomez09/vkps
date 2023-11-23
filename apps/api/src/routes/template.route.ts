import { Router, Request, Response } from "express";

import { getTemplate, listTemplates } from "../services/template.service";

const router = Router();

router.get("/list", async (_req: Request, res: Response) => {
    const templates = await listTemplates();

    res.json({
        data: templates
    })
});

router.get("/:name", async (req: Request, res: Response) => {
    const { name } = req.params;
    const template = await getTemplate(name);

    res.json({
        data: template
    })
});

export default router;
