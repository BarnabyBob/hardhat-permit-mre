import { parseEther } from 'ethers/lib/utils';

export enum Blockchain {
	LOCALHOST = 31337,
	ETHEREUM = 1,
	ROPSTEN = 3,
	RINKEBY = 4,
	GOERLI = 5,
	KOVAN = 42,
	ARBITRUM_ONE = 42161,
	ARBITRUM_TESTNET = 421611,
	OPTIMISTIC_ETHEREUM = 10,
	OPTIMISTIC_KOVAN = 69,
}

export const ALICE: string = '0x5457c416a785f5015fb9746ced19248e1f3cd3adbdc1f9eae4b0765a550633c9'; // 0x7EB7847Bc296026cC660DC9C8B7F6bED11219C00
export const BOB: string = '0x5f444224073047c3ce5fd92c79dce2ca6339e822f1d6f4d52e983f97500596d5'; // 0xBABa22f89CC440468F2170B7c274e511cFefF3a5
export const CAROL: string = '0x1e74ce7d94717fb97089f3a005b85703ebeb51ab8be34c1f16b9b5135afb4b63'; // 0xA10c933f3108BaC781388DCCd87daCe5aFf45C23

// Change this to fork a different blockchain when running test suites or dry-running deployments with Hardhat VM
export const HARDHAT_BLOCKCHAIN_FORK = Blockchain.OPTIMISTIC_ETHEREUM;

export function nodeUrl(blockchain: Blockchain): string {
	if (blockchain === Blockchain.LOCALHOST) {
		return 'http://localhost:8545';
	}

	if (blockchain === Blockchain.ETHEREUM) {
		const uri = process.env['ETHEREUM_NODE_URI'];
		if (uri && uri !== '') {
			return uri;
		}
	}

	if (blockchain === Blockchain.OPTIMISTIC_ETHEREUM) {
		const uri = process.env['OPTIMISTIC_ETHEREUM_NODE_URI'];
		if (uri && uri !== '') {
			return uri;
		}
	}

	if (blockchain === Blockchain.OPTIMISTIC_KOVAN) {
		const uri = process.env['OPTIMISTIC_KOVAN_NODE_URI'];
		if (uri && uri !== '') {
			return uri;
		}
	}

	throw Error('Unknown blockchain: ' + blockchain.toString());
}

export function forkHeight(blockchain: Blockchain): number {
	switch (blockchain) {
		case Blockchain.ETHEREUM:
			return 14166382;
		case Blockchain.ARBITRUM_ONE:
			return 2760012;
		case Blockchain.OPTIMISTIC_ETHEREUM:
			return 4392369;
		case Blockchain.OPTIMISTIC_KOVAN:
			return 2128387;
		default:
			throw Error('Unknown blockchain: ' + blockchain.toString());
	}
}

export function mnemonicAccounts(networkName?: string): any {
	if (networkName) {
		const mnemonic = process.env['MNEMONIC_' + networkName.toUpperCase()];
		if (!mnemonic || mnemonic === '') {
			throw Error(`Unknown mnemonic for network (${networkName})`);
		}
	}

	let mnemonic = process.env.MNEMONIC;
	if (!mnemonic || mnemonic === '') {
		mnemonic = 'junk test test test test test test test test test test junk';
	}

	return {
		mnemonic,
		accountsBalance: parseEther(String(1_000_000)).toString(),
	};
}

export function accounts(real: boolean): any {
	if (real) return [ALICE, BOB, CAROL];
	else {
		const balance: string = parseEther(String(1_000_000)).toString();
		return [
			{ privateKey: ALICE, balance },
			{ privateKey: BOB, balance },
			{ privateKey: CAROL, balance },
		];
	}
}
