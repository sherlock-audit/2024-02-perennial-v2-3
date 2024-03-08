import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import {
  DSU__factory,
  ProxyAdmin__factory,
  SimpleReserve__factory,
  UCrossChainOwner__factory,
} from '../types/generated'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { isArbitrum, isBase, isOptimism } from '../../common/testutil/network'
import { getMultisigAddress } from '../../common/testutil/constants'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers, network } = hre
  const { get } = deployments
  const { deployer } = await getNamedAccounts()
  const deployerSigner: SignerWithAddress = await ethers.getSigner(deployer)

  const dsu = new DSU__factory(deployerSigner).attach((await get('DSU')).address)

  const isCrossChain = isArbitrum(network.name) || isOptimism(network.name) || isBase(network.name)
  if (isCrossChain) {
    console.log(`Crosschain Network Detected: ${network.name}`)
  }

  const proxyAdmin = new ProxyAdmin__factory(deployerSigner).attach((await get('ProxyAdmin')).address)
  const reserve = new SimpleReserve__factory(deployerSigner).attach((await get('ReserveProxy')).address)

  console.log(`Using DSU at ${dsu.address}`)
  console.log(`Using ProxyAdmin at ${proxyAdmin.address}`)
  console.log(`Using Reserve at ${reserve.address}`)

  let ownerAddress = getMultisigAddress(network.name)
  if (isCrossChain) {
    const crosschainOwner = await UCrossChainOwner__factory.connect(
      (
        await get('UCrossChainOwner')
      ).address,
      deployerSigner,
    )
    console.log(`Using CrossChainOwner at ${crosschainOwner.address}`)

    ownerAddress = crosschainOwner.address
    if ((await crosschainOwner.owner()) === deployerSigner.address) {
      console.log('CrossChain Owner already initialized.')
    } else {
      process.stdout.write('Initializing CrossChain Owner ')
      await (await crosschainOwner.initialize()).wait(2)
      process.stdout.write('complete.\n')
    }
  }

  if (ownerAddress === null) {
    throw 'No Owner Found'
  }

  console.log('Using owner address: ', ownerAddress)

  if ((await proxyAdmin.owner()) === ownerAddress) {
    console.log('ProxyAdmin already owned by owner.')
  } else {
    process.stdout.write('Transferring ProxyAdmin ownership to owner... ')
    await (await proxyAdmin.transferOwnership(ownerAddress)).wait(2)
    process.stdout.write('complete.\n')
  }

  if ((await dsu.owner()) === reserve.address) {
    console.log('Reserve already initialized.')
  } else {
    process.stdout.write('initializing Reserve... ')
    await (await reserve.initialize()).wait(2)
    process.stdout.write('complete.\n')
  }
}

export default func
func.tags = ['Init_Core']
