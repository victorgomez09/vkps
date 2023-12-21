import { Router, Request, Response } from "express";

import {
    createApp as createApplication,
    deployApplication,
    getApplicationById,
    getApplicationByName,
    getApplicationLogs,
    getApplications,
    updateApplication,
} from "../services/application.service";

const router = Router();

/* GET ROUTES */
router.get("/", async (_req: Request, res: Response) => {
    const response = await getApplications();

    if (response.statusCode !== 200) {
        return res.status(response.statusCode).json({ error: response.error });
    }

    return res.json(response.data);
});

router.get("/:applicationId", async (req: Request, res: Response) => {
    const { applicationId } = req.params;
    console.log("applicationId", applicationId);

    const response = await getApplicationById(applicationId);

    if (response.statusCode !== 200) {
        return res.status(response.statusCode).json({ error: response.error });
    }

    return res.json(response.data);
});

router.get("/:name/logs", async (req: Request, res: Response) => {
    const { name } = req.params;

    const response = await getApplicationLogs(String(name));

    if (response.statusCode !== 200) {
        return res.status(response.statusCode).json({ error: response.error });
    }

    return res.json(response.data);
});

router.get("/addon/:addonName", async (req: Request, res: Response) => {
    const { addonName, namespace } = req.query;

    const response = await getApplicationByName(String(addonName), String(namespace));

    if (response.statusCode !== 200) {
        return res.status(response.statusCode).json({ error: response.error });
    }

    return res.json({ data: response.data });
});

/* POST ROUTES */
router.post("/create", async (req: Request, res: Response) => {
    const { name, description, image, replicas, cpu, memory, env, volumes, ports } = req.body;

    const response = await createApplication({
        name,
        description,
        image,
        replicas: Number(replicas),
        cpu: cpu,
        memory: memory,
        env,
        volumes,
        ports,
    });

    if (response.statusCode !== 200) {
        return res.status(response.statusCode).json({ error: response.error });
    }

    return res.json({ data: response.data });
});

router.post("/deploy/:applicationId", async (req: Request, res: Response) => {
    const { applicationId } = req.params;

    const response = await deployApplication(applicationId);

    if (response.statusCode !== 200) {
        return res.status(response.statusCode).json({ error: response.error });
    }

    return res.json(response.data);
});

/* PUT ROUTES */
router.put("/update/:applicationId", async (req: Request, res: Response) => {
    const { applicationId } = req.params;
    const { name, description, image, replicas, cpu, memory, env } = req.body;
    console.log("body", req.body);

    const { statusCode, data, error } = await updateApplication(applicationId, {
        name,
        description,
        image,
        replicas: Number(replicas),
        cpu: cpu,
        memory: memory,
        env,
    });

    if (statusCode !== 200) {
        return res.status(statusCode).json(error);
    }

    return res.json(data);
});

// router.post("/addon/:addonName", async (req: Request, res: Response) => {
//     const { addonName } = req.params;
//     const { namespace, name, description, version, replicas, cpu, memory, env, volumes, ports } = req.body;

//     const response = await deployAddon({
//         addonName,
//         namespace: namespace,
//         applicationName: name,
//         description,
//         version,
//         replicas,
//         cpu,
//         memory,
//         env,
//         volumes,
//         ports,
//     });

//     if (response.statusCode !== 200) {
//         return res.status(response.statusCode).json({ error: response.error });
//     }

//     return res.json({ data: response.data });
// });

export default router;
