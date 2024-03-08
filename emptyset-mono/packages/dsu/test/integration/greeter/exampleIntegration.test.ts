import { expect } from 'chai'
import HRE from 'hardhat'
import { Greeter, Greeter__factory, Registry, Registry__factory } from '../../../types/generated'
import { Signer } from 'ethers'

const { ethers } = HRE

const GREETING = 'hello'

describe('Greeter', () => {
  let owner: Signer
  let user: Signer
  let registry: Registry
  let greeter: Greeter

  beforeEach(async () => {
    ;[owner, user] = await ethers.getSigners()

    registry = await new Registry__factory(owner).deploy()
    greeter = await new Greeter__factory(owner).deploy(registry.address)
  })

  it('should properly update and return greeting', async () => {
    await expect(registry.connect(user).updateGreeting(GREETING))
      .to.emit(registry, 'GreetingUpdated')
      .withArgs(GREETING)

    expect(await registry.connect(user).greeting()).to.equal(GREETING)

    const greeting = await greeter.connect(user).callStatic.greet()

    await expect(greeter.connect(user).greet()).to.emit(greeter, 'Greet').withArgs(GREETING)
    expect(greeting).to.equal(GREETING)
  })
})
