import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { DSU__factory } from '../types/generated'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers } = hre
  const { get } = deployments
  const { deployer } = await getNamedAccounts()
  const deployerSigner: SignerWithAddress = await ethers.getSigner(deployer)

  const dsu = new DSU__factory(deployerSigner).attach((await get('DSU')).address)
  const reserve = await get('ReserveProxy')

  if ((await dsu.owner()) === reserve.address.toLowerCase()) {
    console.log('DSU owner already set.')
  } else {
    process.stdout.write('Setting DSU pending owner... ')
    await (await dsu.transferOwnership(reserve.address)).wait(2)
    process.stdout.write('complete.\n')
  }
}

export default func
func.tags = ['Transfer_DSU']
