import express, { Request, Response } from "express";

import pingRoutes from "./ping.route";
import addonsRoutes from "./addons.route";
import deploymentRoutes from "./application.route";

const router = express.Router();
router.use("/ping", pingRoutes);
router.use("/addons", addonsRoutes);
router.use("/applications", deploymentRoutes);

// Custom error handler
export function errorHandler(err: Error, _req: Request, res: Response) {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
}

// Default route
export function defaultRoute(_req: Request, res: Response) {
    res.status(404).json("Endpoint not found");
}

export default router;
