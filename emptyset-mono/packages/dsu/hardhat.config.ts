import { dirname } from 'path'
import defaultConfig from '../common/hardhat.default.config'

// Reserve is only a dev dependency so may not exist
let reserveDir = ''
try {
  reserveDir = dirname(require.resolve('@emptyset/reserve/package.json'))
} catch {
  // pass
}

const config = defaultConfig({
  externalDeployments: {
    kovan: [`${reserveDir}/deployments/kovan`],
    goerli: [`${reserveDir}/deployments/goerli`],
    optimismGoerli: [`${reserveDir}/deployments/optimismGoerli`],
    arbitrumGoerli: [`${reserveDir}/deployments/arbitrumGoerli`],
    arbitrumSepolia: [`${reserveDir}/deployments/arbitrumSepolia`],
    baseGoerli: [`${reserveDir}/deployments/baseGoerli`],
    arbitrum: [`${reserveDir}/deployments/arbitrum`],
    optimism: [`${reserveDir}/deployments/optimism`],
    mainnet: [`${reserveDir}/deployments/mainnet`],
    base: [`${reserveDir}/deployments/base`],
    hardhat: [`${reserveDir}/deployments/mainnet`],
    localhost: [`${reserveDir}/deployments/localhost`],
  },
})

export default config
