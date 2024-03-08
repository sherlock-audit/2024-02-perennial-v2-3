import { FakeContract, smock } from '@defi-wonderland/smock'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect, use } from 'chai'
import { utils } from 'ethers'
import HRE from 'hardhat'
import { DSU, IERC20Metadata, MigrationReserve, MigrationReserve__factory } from '../../../types/generated'

const { ethers } = HRE
use(smock.matchers)

describe('MigrationReserve', () => {
  let owner: SignerWithAddress
  let user: SignerWithAddress
  let reserve: MigrationReserve
  let usdc: FakeContract<IERC20Metadata>
  let usdcBridged: FakeContract<IERC20Metadata>
  let dsu: FakeContract<DSU>

  beforeEach(async () => {
    ;[owner, user] = await ethers.getSigners()

    usdc = await smock.fake<IERC20Metadata>('IERC20Metadata')
    usdcBridged = await smock.fake<IERC20Metadata>('IERC20Metadata')
    dsu = await smock.fake<DSU>('DSU')

    dsu.decimals.returns(18)
    usdc.decimals.returns(6)

    reserve = await new MigrationReserve__factory(owner).deploy(dsu.address, usdc.address, usdcBridged.address)
  })

  describe('#constructor', () => {
    it('constructs correctly', async () => {
      expect(await reserve.DSU()).to.equal(dsu.address)
      expect(await reserve.USDC()).to.equal(usdc.address)
      expect(await reserve.USDC_BRIDGED()).to.equal(usdcBridged.address)
    })
  })

  describe('#migrate', () => {
    it('pulls native USDC from the sender, returns bridge USDC', async () => {
      const amount = utils.parseEther('10')

      usdc.transferFrom.whenCalledWith(user.address, reserve.address, 10e6).returns(true)
      usdcBridged.transfer.whenCalledWith(user.address, 10e6).returns(true)

      await expect(reserve.connect(user).migrate(amount)).to.emit(reserve, 'Migrate').withArgs(user.address, amount)

      expect(usdc.transferFrom).to.have.been.calledWith(user.address, reserve.address, 10e6)
      expect(usdcBridged.transfer).to.have.been.calledWith(user.address, 10e6)
    })

    it('pulls native USDC from the sender, returns bridge USDC with rounding', async () => {
      const amount = utils.parseEther('10').add(1)

      usdc.transferFrom.whenCalledWith(user.address, reserve.address, 10e6).returns(true)
      usdcBridged.transfer.whenCalledWith(user.address, 10e6).returns(true)

      await expect(reserve.connect(user).migrate(amount)).to.emit(reserve, 'Migrate').withArgs(user.address, amount)

      expect(usdc.transferFrom).to.have.been.calledWith(user.address, reserve.address, 10e6)
      expect(usdcBridged.transfer).to.have.been.calledWith(user.address, 10e6)
    })
  })
})
