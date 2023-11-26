import { Router, Request, Response } from "express";

import { deployTemplate, getDeploymentByName, getDeploymentLogsByName, getDeployments } from "../services/deployment.service";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
    const response = await getDeployments();

    if (response.statusCode !== 200) {
        return res.status(response.statusCode).json({ error: response.error });
    }

    return res.json({ data: response.data });
});

router.get("/:name/logs", async (req: Request, res: Response) => {
    const { name } = req.query;

    const response = await getDeploymentLogsByName(String(name));

    if (response.statusCode !== 200) {
        return res.status(response.statusCode).json({ error: response.error });
    }

    return res.json({ data: response.data });
});

router.get("/template/:templateName", async (req: Request, res: Response) => {
    const { templateName, namespace } = req.query;

    const response = await getDeploymentByName(String(templateName), String(namespace));

    if (response.statusCode !== 200) {
        return res.status(response.statusCode).json({ error: response.error });
    }

    return res.json({ data: response.data });
});

router.post("/template/:templateName", async (req: Request, res: Response) => {
    const { templateName } = req.params;
    const { namespace, name, version, replicas, env, volumes, ports } = req.body;

    const response = await deployTemplate({
        templateName,
        namespace: namespace,
        deploymentName: name,
        version,
        replicas,
        env,
        volumes,
        ports,
    });

    if (response.statusCode !== 200) {
        return res.status(response.statusCode).json({ error: response.error });
    }

    return res.json({ data: response.data });
});

export default router;
