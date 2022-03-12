import { expect } from 'chai';
import { ethers } from 'hardhat';
import { BigNumber, Wallet } from 'ethers';
import { ecrecover, ecsign, pubToAddress } from 'ethereumjs-util';
import { defaultAbiCoder, getAddress, hexlify, keccak256, parseUnits, solidityPack, toUtf8Bytes } from 'ethers/lib/utils';
import { ERC20PermitMock } from '../../types';

const PERMIT_TYPEHASH = keccak256(toUtf8Bytes('Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)'));

function craftApprovalDigest(
	domSep: string,
	owner: string,
	spender: string,
	value: BigNumber,
	nonce: BigNumber,
	deadline: BigNumber
): string {
	return keccak256(
		solidityPack(
			['bytes1', 'bytes1', 'bytes32', 'bytes32'],
			[
				'0x19',
				'0x01',
				domSep,
				keccak256(
					defaultAbiCoder.encode(
						['bytes32', 'address', 'address', 'uint256', 'uint256', 'uint256'],
						[PERMIT_TYPEHASH, owner, spender, value, nonce, deadline]
					)
				),
			]
		)
	);
}

describe('ERC20PermitMock', () => {
	it('vanilla permit', async () => {
		const erc20Permit: ERC20PermitMock = await (
			await ethers.getContractFactory('ERC20PermitMock')
		).deploy('ERC20 Permit Mock', 'P');

		const randomOwner = Wallet.createRandom();
		const randomRecipient = Wallet.createRandom();
		const TEN_E18: BigNumber = parseUnits('10', 18);

		await erc20Permit.mint(randomOwner.address, TEN_E18);

		const nonce = await erc20Permit.nonces(randomOwner.address);
		const deadline = ethers.constants.MaxUint256;
		const domSep = await erc20Permit.DOMAIN_SEPARATOR();
		const digest = craftApprovalDigest(domSep, randomOwner.address, randomRecipient.address, TEN_E18, nonce, deadline);

		const { v, r, s } = ecsign(Buffer.from(digest.slice(2), 'hex'), Buffer.from(randomOwner.privateKey.slice(2), 'hex'));
		const pubKey: Buffer = ecrecover(Buffer.from(digest.slice(2), 'hex'), v, r, s);
		const recoveredAddress: string = getAddress(pubToAddress(pubKey).toString('hex'));
		expect(recoveredAddress).to.eq(randomOwner.address);

		await expect(erc20Permit.permit(randomOwner.address, randomRecipient.address, TEN_E18, deadline, v, hexlify(r), hexlify(s)))
			.to.emit(erc20Permit, 'Approval')
			.withArgs(randomOwner.address, randomRecipient.address, TEN_E18);
		expect(await erc20Permit.allowance(randomOwner.address, randomRecipient.address)).to.eq(TEN_E18);
		expect(await erc20Permit.nonces(randomOwner.address)).to.eq(BigNumber.from(1));
	});
});
