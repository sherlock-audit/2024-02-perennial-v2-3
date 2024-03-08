import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { DSU__factory } from '../types/generated'
import { isArbitrum, isBase, isOptimism } from '../../common/testutil/network'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers, network } = hre
  const { deploy, get } = deployments
  const { deployer } = await getNamedAccounts()
  const deployerSigner = await ethers.getSigner(deployer)

  const usdc = await get('USDC')
  const dsu = new DSU__factory(deployerSigner).attach((await get('DSU')).address)
  console.log(`Using USDC at ${usdc.address}`)
  console.log(`Using DSU at ${dsu.address}`)

  if (isArbitrum(network.name)) {
    await deploy('UCrossChainOwner', {
      contract: 'UCrossChainOwner_Arbitrum',
      from: deployer,
      skipIfAlreadyDeployed: true,
      log: true,
      autoMine: true,
    })
  } else if (isOptimism(network.name) || isBase(network.name)) {
    await deploy('UCrossChainOwner', {
      contract: 'UCrossChainOwner_Optimism',
      from: deployer,
      skipIfAlreadyDeployed: true,
      log: true,
      autoMine: true,
    })
  }

  const reserveImplDeploy = await deploy('ReserveImpl', {
    contract: 'SimpleReserve',
    args: [dsu.address, usdc.address],
    from: deployer,
    skipIfAlreadyDeployed: true,
    log: true,
    autoMine: true,
  })

  const proxyAdminDeploy = await deploy('ProxyAdmin', {
    from: deployer,
    skipIfAlreadyDeployed: true,
    log: true,
    autoMine: true,
  })

  await deploy('ReserveProxy', {
    contract: 'TransparentUpgradeableProxy',
    args: [reserveImplDeploy.address, proxyAdminDeploy.address, '0x'],
    from: deployer,
    skipIfAlreadyDeployed: true,
    log: true,
    autoMine: true,
  })
}

export default func
func.tags = ['Deploy_Core']
