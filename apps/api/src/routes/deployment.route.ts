import { Router, Request, Response } from "express";

import { deployTemplate, getTemplateDeployment } from "../services/deployment.service";

const router = Router();

router.get("/template/:templateName", async (req: Request, res: Response) => {
    const { templateName, namespace } = req.query;

    const response = await getTemplateDeployment(String(templateName), String(namespace));

    if (response.statusCode !== 200) {
        return res.sendStatus(response.statusCode).json({error: response.error})
    }
    
    return res.json({ data: response.data });
});

router.post("/template/:templateName", async (req: Request, res: Response) => {
    const { templateName } = req.params;
    const {
        namespace,
        deploymentName,
        replicas,
        env,
        volumes,
        ports,
    } = req.body;

    const response = await deployTemplate({
        templateName,
        namespace: namespace,
        deploymentName,
        replicas,
        env,
        volumes,
        ports
    });

    if (response.statusCode !== 200) {
        return res.sendStatus(response.statusCode).json({error: response.error})
    }
    
    return res.json({ data: response.data });
});

export default router;