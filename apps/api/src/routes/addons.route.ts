import { Router, Request, Response } from "express";

import { getAddon, listAddons } from "../services/addon.service";

const router = Router();

router.get("/list", async (_req: Request, res: Response) => {
    const templates = await listAddons();

    res.json({
        data: templates,
    });
});

router.get("/:name", async (req: Request, res: Response) => {
    const { name } = req.params;
    const template = await getAddon(name);

    res.json({
        data: template,
    });
});

export default router;
