import os from "node:os"


export const getHost = () => {
  const interfaces = Object.values(os.networkInterfaces())
    .filter((val): val is os.NetworkInterfaceInfo[] => Array.isArray(val));

  const allInterfaces = interfaces.reduce(
    (acc, val) => acc.concat(val),
    [] as os.NetworkInterfaceInfo[]
  );

  const host = allInterfaces.find(
    ip => ip.family === "IPv4" && !ip.internal
  )?.address;

  return host;
}