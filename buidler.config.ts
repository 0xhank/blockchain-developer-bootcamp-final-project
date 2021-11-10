mport { BuidlerConfig, usePlugin } from "@nomiclabs/buidler/config";

usePlugin("buidler-ethers-v5");
usePlugin("buidler-deploy");
usePlugin("@symfoni/buidler-typechain");
usePlugin("@symfoni/buidler-react");

const config: BuidlerConfig = {
  solc: {
    version: "0.6.8",
  },
  networks: {
    buidlerevm: {
      accounts: [
        {
          balance: "0x1B1AE4D6E2EF500000", //5000
          privateKey:
            "0x50228cca6dd3264c74713855801d16e63a2b0e42e86fa374562316a629d03a30",
        },
      ],
    },
  },
};

export default config;