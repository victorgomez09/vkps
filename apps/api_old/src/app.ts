import express from "express";
import cors from "cors";

import appLogger from "./middlewares/logger";
import router, { defaultRoute, errorHandler } from "./routes/";

export const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(appLogger);
app.use(router);
app.use(defaultRoute); // default route has to be last route
app.use(errorHandler); // Error handler goes last
