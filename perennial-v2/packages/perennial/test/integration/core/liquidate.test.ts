import { expect } from 'chai'
import 'hardhat'
import { BigNumber, constants, utils } from 'ethers'

import { InstanceVars, deployProtocol, createMarket, settle } from '../helpers/setupHelpers'
import { parse6decimal } from '../../../../common/testutil/types'
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'

export const TIMESTAMP_2 = 1631113819

describe('Liquidate', () => {
  let instanceVars: InstanceVars

  beforeEach(async () => {
    instanceVars = await loadFixture(deployProtocol)
    await instanceVars.chainlink.reset()
  })

  it('liquidates a user', async () => {
    const POSITION = parse6decimal('10')
    const COLLATERAL = parse6decimal('1000')
    const { user, userB, dsu, chainlink } = instanceVars

    const market = await createMarket(instanceVars)
    await dsu.connect(user).approve(market.address, COLLATERAL.mul(1e12))
    await market
      .connect(user)
      ['update(address,uint256,uint256,uint256,int256,bool)'](user.address, POSITION, 0, 0, COLLATERAL, false)

    // Settle the market with a new oracle version
    await chainlink.nextWithPriceModification(price => price.mul(2))

    await expect(
      market.connect(userB)['update(address,uint256,uint256,uint256,int256,bool)'](user.address, 0, 0, 0, 0, true),
    ) // liquidate
      .to.emit(market, 'Updated')
      .withArgs(userB.address, user.address, TIMESTAMP_2, 0, 0, 0, 0, true, constants.AddressZero)

    expect((await market.pendingOrders(user.address, 2)).protection).to.eq(1)
    expect(await market.liquidators(user.address, 2)).to.eq(userB.address)

    expect((await market.locals(user.address)).collateral).to.equal(COLLATERAL)
    expect(await dsu.balanceOf(market.address)).to.equal(utils.parseEther('1000'))

    await chainlink.next()
    await market.connect(user)['update(address,uint256,uint256,uint256,int256,bool)'](user.address, 0, 0, 0, 0, false) // settle
    expect((await market.locals(userB.address)).claimable).to.equal(parse6decimal('10'))
    await market.connect(userB).claimFee() // liquidator withdrawal

    expect(await dsu.balanceOf(userB.address)).to.equal(utils.parseEther('200010')) // Original 200000 + fee
    expect((await market.locals(user.address)).collateral).to.equal(parse6decimal('1000').sub(parse6decimal('10')))
    expect(await dsu.balanceOf(market.address)).to.equal(utils.parseEther('1000').sub(utils.parseEther('10')))

    await market
      .connect(user)
      ['update(address,uint256,uint256,uint256,int256,bool)'](user.address, 0, 0, 0, constants.MinInt256, false) // withdraw everything

    expect((await market.position()).timestamp).to.eq(TIMESTAMP_2)
    expect((await market.pendingOrders(user.address, 2)).protection).to.eq(1)
  })

  it('creates and resolves a shortfall', async () => {
    const POSITION = parse6decimal('10')
    const COLLATERAL = parse6decimal('1000')
    const { user, userB, dsu, chainlink } = instanceVars

    const market = await createMarket(instanceVars)
    await dsu.connect(user).approve(market.address, COLLATERAL.mul(1e12))
    await dsu.connect(userB).approve(market.address, COLLATERAL.mul(1e12))
    await market
      .connect(user)
      ['update(address,uint256,uint256,uint256,int256,bool)'](
        user.address,
        POSITION,
        0,
        0,
        parse6decimal('1000'),
        false,
      )
    await market
      .connect(userB)
      ['update(address,uint256,uint256,uint256,int256,bool)'](
        userB.address,
        0,
        POSITION,
        0,
        parse6decimal('1000'),
        false,
      )

    // Settle the market with a new oracle version
    await chainlink.next()
    await settle(market, user)

    await chainlink.nextWithPriceModification(price => price.mul(2))

    await settle(market, userB)
    const userBCollateral = (await market.locals(userB.address)).collateral
    await expect(
      market
        .connect(userB)
        ['update(address,uint256,uint256,uint256,int256,bool)'](
          userB.address,
          0,
          0,
          0,
          userBCollateral.mul(-1).sub(1),
          false,
        ),
    ).to.be.revertedWithCustomError(market, 'MarketInsufficientMarginError') // underflow

    await market.connect(userB)['update(address,uint256,uint256,uint256,int256,bool)'](user.address, 0, 0, 0, 0, true) // liquidate

    await chainlink.nextWithPriceModification(price => price.mul(2))
    await settle(market, user)

    expect((await market.locals(user.address)).collateral).to.equal(BigNumber.from('-2523154460'))

    await dsu.connect(userB).approve(market.address, constants.MaxUint256)
    const userCollateral = (await market.locals(user.address)).collateral

    await market
      .connect(userB)
      ['update(address,uint256,uint256,uint256,int256,bool)'](user.address, 0, 0, 0, userCollateral.mul(-1), false)
    expect((await market.locals(user.address)).collateral).to.equal(0)
  })

  it('uses a socialization factor', async () => {
    const POSITION = parse6decimal('10')
    const COLLATERAL = parse6decimal('1000')
    let totalCollateral, totalFees
    const { user, userB, userC, userD, chainlink, dsu } = instanceVars

    const market = await createMarket(instanceVars)
    await dsu.connect(user).approve(market.address, COLLATERAL.mul(1e12))
    await dsu.connect(userB).approve(market.address, COLLATERAL.mul(1e12))
    await dsu.connect(userC).approve(market.address, COLLATERAL.mul(10).mul(1e12))
    await dsu.connect(userD).approve(market.address, COLLATERAL.mul(10).mul(1e12))
    await market
      .connect(user)
      ['update(address,uint256,uint256,uint256,int256,bool)'](user.address, POSITION, 0, 0, COLLATERAL, false)
    await market
      .connect(userB)
      ['update(address,uint256,uint256,uint256,int256,bool)'](userB.address, POSITION, 0, 0, COLLATERAL, false)
    await market
      .connect(userC)
      ['update(address,uint256,uint256,uint256,int256,bool)'](userC.address, 0, POSITION, 0, COLLATERAL.mul(10), false)
    await market
      .connect(userD)
      ['update(address,uint256,uint256,uint256,int256,bool)'](userD.address, 0, POSITION, 0, COLLATERAL.mul(10), false)

    // Expect the system to remain solvent
    totalCollateral = (await market.locals(user.address)).collateral
      .add((await market.locals(userB.address)).collateral)
      .add((await market.locals(userC.address)).collateral)
      .add((await market.locals(userD.address)).collateral)
    totalFees = (await market.global()).protocolFee
      .add((await market.global()).oracleFee)
      .add((await market.global()).riskFee)
      .add((await market.global()).donation)
    expect(totalCollateral.add(totalFees)).to.equal(parse6decimal('22000'))

    // Settle the market with a new oracle version
    await chainlink.nextWithPriceModification(price => price.mul(2))

    // Liquidate `user` which results in taker > maker
    await expect(
      market.connect(userB)['update(address,uint256,uint256,uint256,int256,bool)'](user.address, 0, 0, 0, 0, true),
    ) // liquidate
      .to.emit(market, 'Updated')
      .withArgs(userB.address, user.address, TIMESTAMP_2, 0, 0, 0, 0, true, constants.AddressZero)

    await chainlink.next()
    await settle(market, user)
    await settle(market, userB)
    await settle(market, userC)
    await settle(market, userD)

    const currA = (await market.locals(user.address)).collateral
    const currB = (await market.locals(userB.address)).collateral
    const currC = (await market.locals(userC.address)).collateral
    const currD = (await market.locals(userD.address)).collateral
    const totalCurr = currA.add(currB).add(currC).add(currD)
    const feesCurr = (await market.global()).protocolFee
      .add((await market.global()).oracleFee)
      .add((await market.global()).riskFee)
      .add((await market.global()).donation)

    await chainlink.next()
    await settle(market, user)
    await settle(market, userB)
    await settle(market, userC)
    await settle(market, userD)

    const newA = (await market.locals(user.address)).collateral
    const newB = (await market.locals(userB.address)).collateral
    const newC = (await market.locals(userC.address)).collateral
    const newD = (await market.locals(userD.address)).collateral
    const totalNew = newA.add(newB).add(newC).add(newD)
    const feesNew = (await market.global()).protocolFee
      .add((await market.global()).oracleFee)
      .add((await market.global()).riskFee)
      .add((await market.global()).donation)

    // Expect the loss from B to be socialized equally to C and D
    expect(currA).to.equal(newA)
    expect(currB.gt(newB)).to.equal(true)
    expect(currC.lt(newC)).to.equal(true)
    expect(currD.lt(newD)).to.equal(true)

    expect(totalCurr.add(feesCurr)).to.be.gte(totalNew.add(feesNew))
    expect(totalCurr.add(feesCurr)).to.be.closeTo(totalNew.add(feesNew), 100)

    // Expect the system to remain solvent
    totalCollateral = (await market.locals(user.address)).collateral
      .add((await market.locals(userB.address)).collateral)
      .add((await market.locals(userC.address)).collateral)
      .add((await market.locals(userD.address)).collateral)
    totalFees = (await market.global()).protocolFee
      .add((await market.global()).oracleFee)
      .add((await market.global()).riskFee)
      .add((await market.global()).donation)
    expect(totalCollateral.add(totalFees)).to.be.lte(parse6decimal('22000'))
  })
})
