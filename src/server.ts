import * as http from "http";
import * as os from "os";
import * as express from "express";
import { readEmails } from "./reader";

const port: number = 3000;

interface NetworkInterface {
  family: string;
  address: string;
  internal: boolean;
}

const getLocalAddress = () => {
  const networkInterfaces: NodeJS.Dict<NetworkInterface[]> | undefined =
    os.networkInterfaces();
  let localAddress: string | undefined;

  if (networkInterfaces) {
    const interfacesArray = Object.values(networkInterfaces);
    const flattenedInterfaces = interfacesArray.flat();

    for (const iface of flattenedInterfaces) {
      if (iface && iface.family === "IPv4" && !iface.internal) {
        localAddress = iface.address;
        break;
      }
    }
  }

  return localAddress;
};

const app = express();
app.use(express.json());

app.head("/", (req, res) => {
  res.sendStatus(200);
});

app.post("/", (req, res) => {
  const credentials = req.body;
  readEmails(req, res, credentials);
});

app.get('*', (req, res) => {
  res.send('The server is up and running.');
});

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on http://${getLocalAddress()}:${port}`);
});

function shutdown() {
  server.close(() => {
    console.log("Server closed. Exiting process.");
    process.exit(0);
  });
}

process.on("SIGINT", () => {
  console.log("\nReceived SIGINT signal.");
  shutdown();
});

process.on("SIGTERM", () => {
  console.log("\nReceived SIGTERM signal.");
  shutdown();
});
