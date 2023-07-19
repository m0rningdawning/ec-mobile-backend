import * as http from "http";
import * as os from "os";

type ServerType = {
  req: any;
  res: any;
};

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

const server = http.createServer(
  (req: ServerType["req"], res: ServerType["res"]) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write("Hello, Node.js server!");
    res.end();
  }
);

server.listen(port, () => {
  console.log(`Server is running on http://${getLocalAddress()}:${port}`);
});

function shutdown() {
  console.log("Shutting down server gracefully...");
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
