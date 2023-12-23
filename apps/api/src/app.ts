import express from "express";
import cors from "cors";

import appLogger from "./middlewares/logger";
import router, { defaultRoute, errorHandler } from "./routes";
import { k8sCoreApi } from "engine";
import { NAMESPACE } from "./constants/k8s.constant";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(appLogger);
app.use(router);
app.use(defaultRoute); // default route has to be last route
app.use(errorHandler); // Error handler goes last

// create kubernetes namespace if it doesn't exist
const createNamespace = async (namespace: string) => {
    try {
        await k8sCoreApi.readNamespace(namespace);
    } catch (error) {
        if (error.statusCode === 404) {
            await k8sCoreApi.createNamespace({ metadata: { name: namespace } });
        } else {
            throw error;
        }
    }
};

// Usage:
createNamespace(NAMESPACE);
