import { Router, Request, Response } from "express";

import { getAddon, listAddons } from "../services/addon.service";

const router = Router();

router.get("/list", async (_req: Request, res: Response) => {
    const { statusCode, data, error } = await listAddons();

    if (statusCode !== 200) {
        return res.status(statusCode).json({ error });
    }

    res.status(statusCode).json({
        data,
    });
});

router.get("/:name", async (req: Request, res: Response) => {
    const { name } = req.params;
    const { statusCode, data, error } = await getAddon(name);

    if (statusCode !== 200) {
        return res.status(statusCode).json({ error });
    }

    res.json({
        data,
    });
});

export default router;
