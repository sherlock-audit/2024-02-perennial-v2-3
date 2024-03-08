import { FakeContract, smock } from '@defi-wonderland/smock'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect, use } from 'chai'
import { utils } from 'ethers'
import HRE from 'hardhat'
import { DSU, IERC20Metadata, SimpleReserve, SimpleReserve__factory } from '../../../types/generated'

const { ethers } = HRE
use(smock.matchers)

describe('SimpleReserve', () => {
  let owner: SignerWithAddress
  let user: SignerWithAddress
  let reserve: SimpleReserve
  let usdc: FakeContract<IERC20Metadata>
  let dsu: FakeContract<DSU>

  beforeEach(async () => {
    ;[owner, user] = await ethers.getSigners()

    usdc = await smock.fake<IERC20Metadata>('IERC20Metadata')
    dsu = await smock.fake<DSU>('DSU')

    dsu.decimals.returns(18)
    usdc.decimals.returns(6)

    reserve = await new SimpleReserve__factory(owner).deploy(dsu.address, usdc.address)
  })

  describe('#constructor', () => {
    it('constructs correctly', async () => {
      expect(await reserve.DSU()).to.equal(dsu.address)
      expect(await reserve.USDC()).to.equal(usdc.address)
    })
  })

  describe('#initialize', () => {
    it('does nothing if already DSU owner', async () => {
      dsu.owner.returns(reserve.address)
      await expect(reserve.initialize()).to.not.be.reverted
    })

    it('accepts ownership if not DSU owner', async () => {
      dsu.owner.returns(dsu.address)
      dsu.acceptOwnership.whenCalledWith().returns()
      await expect(reserve.initialize()).to.not.be.reverted
      expect(dsu.acceptOwnership).to.have.been.called
    })

    it('reverts if not pending owner', async () => {
      dsu.owner.returns(dsu.address)
      dsu.acceptOwnership.reverts('Ownable2Step: caller is not the new owner')
      await expect(reserve.initialize()).to.be.reverted
      expect(dsu.acceptOwnership).to.have.been.called
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

      usdc.transferFrom.whenCalledWith(user.address, reserve.address, 10e6).returns(true)
      dsu.mint.whenCalledWith(amount).returns(true)
      dsu.transfer.whenCalledWith(user.address, amount).returns(true)

      await expect(reserve.connect(user).mint(amount)).to.emit(reserve, 'Mint').withArgs(user.address, amount, amount)

      expect(usdc.transferFrom).to.have.been.calledWith(user.address, reserve.address, 10e6)
      expect(dsu.mint).to.have.been.calledWith(amount)
      expect(dsu.transfer).to.have.been.calledWith(user.address, amount)
    })

    it('pulls USDC from the sender, wraps it as DSU with rounding', async () => {
      const amount = utils.parseEther('10').sub(1)

      usdc.transferFrom.whenCalledWith(user.address, reserve.address, 10e6).returns(true)
      dsu.mint.whenCalledWith(amount).returns(true)
      dsu.transfer.whenCalledWith(user.address, amount).returns(true)

      await expect(reserve.connect(user).mint(amount)).to.emit(reserve, 'Mint').withArgs(user.address, amount, amount)

      expect(usdc.transferFrom).to.have.been.calledWith(user.address, reserve.address, 10e6)
      expect(dsu.mint).to.have.been.calledWith(amount)
      expect(dsu.transfer).to.have.been.calledWith(user.address, amount)
    })
  })

  describe('#redeem', () => {
    it('pulls DSU from the sender, unwraps it to USDC', async () => {
      const amount = utils.parseEther('10')

      dsu.transferFrom.whenCalledWith(user.address, reserve.address, amount).returns(true)
      dsu.burn.whenCalledWith(amount).returns(true)
      usdc.transfer.whenCalledWith(user.address, 10e6).returns(true)

      await expect(reserve.connect(user).redeem(amount))
        .to.emit(reserve, 'Redeem')
        .withArgs(user.address, amount, amount)

      expect(dsu.transferFrom).to.have.been.calledWith(user.address, reserve.address, amount)
      expect(dsu.burn).to.have.been.calledWith(amount)
      expect(usdc.transfer).to.have.been.calledWith(user.address, 10e6)
    })

    it('pulls DSU from the sender, unwraps it to USDC with roundng', async () => {
      const amount = utils.parseEther('10').add(1)

      dsu.transferFrom.whenCalledWith(user.address, reserve.address, amount).returns(true)
      dsu.burn.whenCalledWith(amount).returns(true)
      usdc.transfer.whenCalledWith(user.address, 10e6).returns(true)

      await expect(reserve.connect(user).redeem(amount))
        .to.emit(reserve, 'Redeem')
        .withArgs(user.address, amount, amount)

      expect(dsu.transferFrom).to.have.been.calledWith(user.address, reserve.address, amount)
      expect(dsu.burn).to.have.been.calledWith(amount)
      expect(usdc.transfer).to.have.been.calledWith(user.address, 10e6)
    })
  })
})
