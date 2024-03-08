import { expect } from 'chai'
import HRE from 'hardhat'
import { constants, utils } from 'ethers'
import {
  SimpleReserve,
  SimpleReserve__factory,
  IERC20Metadata,
  IERC20Metadata__factory,
  DSU,
  DSU__factory,
} from '../../../types/generated'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { impersonate } from '../../../../common/testutil'

const { ethers, deployments } = HRE

const USDC_HOLDER_ADDRESS = '0x1b7baa734c00298b9429b518d621753bb0f6eff2'
const DSU_CURRENT_OWNER = '0xD05aCe63789cCb35B9cE71d01e4d632a0486Da4B'

describe('SimpleReserve', () => {
  let owner: SignerWithAddress
  let user: SignerWithAddress
  let usdcHolder: SignerWithAddress
  let reserve: SimpleReserve
  let dsu: DSU
  let usdc: IERC20Metadata

  const beforeFixture = async () => {
    ;[owner, user] = await ethers.getSigners()

    dsu = DSU__factory.connect((await deployments.get('DSU')).address, owner)
    usdc = IERC20Metadata__factory.connect((await deployments.get('USDC')).address, owner)

    reserve = await new SimpleReserve__factory(owner).deploy(dsu.address, usdc.address)

    // Transfer DSU ownership to new Reserve
    const dsuOwnerSigner = await impersonate.impersonateWithBalance(DSU_CURRENT_OWNER, utils.parseEther('10'))
    await dsu.connect(dsuOwnerSigner).transferOwnership(reserve.address)

    await dsu.connect(user).approve(reserve.address, constants.MaxUint256)
    await usdc.connect(user).approve(reserve.address, constants.MaxUint256)

    usdcHolder = await impersonate.impersonateWithBalance(USDC_HOLDER_ADDRESS, utils.parseEther('10'))
    await usdc.connect(usdcHolder).transfer(user.address, 1000e6)
  }

  beforeEach(async () => {
    await loadFixture(beforeFixture)
  })

  describe('#constructor', () => {
    it('constructs correctly', async () => {
      expect(await reserve.DSU()).to.equal(dsu.address)
      expect(await reserve.USDC()).to.equal(usdc.address)
    })
  })

  describe('#redeemPrice', () => {
    it('returns ONE', async () => {
      expect(await reserve.redeemPrice()).to.equal(utils.parseEther('1'))
    })
  })

  describe('#mint', () => {
    it('pulls USDC from the sender, wraps it as DSU', async () => {
      const amount = utils.parseEther('10')
      await expect(reserve.connect(user).mint(amount, { gasLimit: 3e6 }))
        .to.emit(usdc, 'Transfer') // USDC pull from user
        .withArgs(user.address, reserve.address, 10e6)
        .to.emit(dsu, 'Transfer') // DSU Mint to Reserve
        .withArgs(constants.AddressZero, reserve.address, amount)
        .to.emit(dsu, 'Transfer') // DSU push from reserve
        .withArgs(reserve.address, user.address, amount)
        .to.emit(reserve, 'Mint') // Reserve Mint
        .withArgs(user.address, amount, amount)

      expect(await usdc.balanceOf(user.address)).to.equal(1000e6 - 10e6)
      expect(await dsu.balanceOf(user.address)).to.equal(amount)
    })

    it('pulls USDC from the sender, wraps it as DSU with rounding', async () => {
      const amount = utils.parseEther('10').sub(1)

      await expect(reserve.connect(user).mint(amount))
        .to.emit(usdc, 'Transfer') // USDC pull from user
        .withArgs(user.address, reserve.address, 10e6)
        .to.emit(dsu, 'Transfer') // DSU Mint to Reserve
        .withArgs(constants.AddressZero, reserve.address, amount)
        .to.emit(dsu, 'Transfer') // DSU push from reserve
        .withArgs(reserve.address, user.address, amount)
        .to.emit(reserve, 'Mint') // Reserve Mint
        .withArgs(user.address, amount, amount)

      expect(await usdc.balanceOf(user.address)).to.equal(1000e6 - 10e6)
      expect(await dsu.balanceOf(user.address)).to.equal(amount)
    })
  })

  describe('#redeem', () => {
    beforeEach(async () => {
      await reserve.connect(user).mint(utils.parseEther('11'))
    })

    it('pulls DSU from the sender, unwraps it to USDC', async () => {
      const amount = utils.parseEther('10')

      await expect(reserve.connect(user).redeem(amount))
        .to.emit(dsu, 'Transfer') // DSU pull from user
        .withArgs(user.address, reserve.address, amount)
        .to.emit(dsu, 'Transfer') // DSU burn
        .withArgs(reserve.address, constants.AddressZero, amount)
        .to.emit(usdc, 'Transfer') // USDC push from reserve
        .withArgs(reserve.address, user.address, 10e6)
        .to.emit(reserve, 'Redeem') // Reserve Redeem
        .withArgs(user.address, amount, amount)
    })

    it('pulls DSU from the sender, unwraps it to USDC with roundng', async () => {
      const amount = utils.parseEther('10').add(1)

      await expect(reserve.connect(user).redeem(amount))
        .to.emit(dsu, 'Transfer') // DSU pull from user
        .withArgs(user.address, reserve.address, amount)
        .to.emit(dsu, 'Transfer') // DSU burn
        .withArgs(reserve.address, constants.AddressZero, amount)
        .to.emit(usdc, 'Transfer') // USDC push from reserve
        .withArgs(reserve.address, user.address, 10e6)
        .to.emit(reserve, 'Redeem') // Reserve Redeem
        .withArgs(user.address, amount, amount)
    })
  })
})
