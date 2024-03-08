import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { constants, utils } from 'ethers'
import HRE from 'hardhat'
import { DSU, DSU__factory } from '../../../types/generated'

const { ethers } = HRE

describe('Registry', () => {
  let owner: SignerWithAddress
  let user: SignerWithAddress
  let dsu: DSU

  beforeEach(async () => {
    ;[owner, user] = await ethers.getSigners()

    dsu = await new DSU__factory(owner).deploy()
  })

  describe('#mint', () => {
    it('mints to the msg.sender', async () => {
      const amount = utils.parseEther('10')
      await expect(dsu.mint(amount)).to.emit(dsu, 'Transfer').withArgs(constants.AddressZero, owner.address, amount)
    })

    it('reverts if not owner', async () => {
      await expect(dsu.connect(user).mint(utils.parseEther('10'))).to.be.revertedWith(
        'Ownable: caller is not the owner',
      )
    })
  })

  describe('#burn', () => {
    it('burns from the msg.sender', async () => {
      const amount = utils.parseEther('10')
      await dsu.mint(amount)

      await expect(dsu.burn(amount)).to.emit(dsu, 'Transfer').withArgs(owner.address, constants.AddressZero, amount)
    })

    it('reverts if not owner', async () => {
      await expect(dsu.connect(user).burn(utils.parseEther('10'))).to.be.revertedWith(
        'Ownable: caller is not the owner',
      )
    })
  })
})
