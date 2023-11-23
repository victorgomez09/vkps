import { Router } from "express";

import { ping } from "../services/ping.service";

const router = Router();

router.get("/", (_req, res) => {
    res.send(ping());
});

export default router;
