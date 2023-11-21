import express from 'express';
import { listNamespacedPod } from "./utils/k8s.util";
import { createPostgresqlTemplate } from "./templates/postgresql.template";

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);

  listNamespacedPod("default").then((data) => {
    console.log("data: " + data);
  });

  createPostgresqlTemplate("postgresql4", "datasabe_test", "postgres", "postgres", 10, 1).then(() => {
  });

});
