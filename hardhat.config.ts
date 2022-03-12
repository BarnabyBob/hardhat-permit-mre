import { HardhatUserConfig, task } from 'hardhat/config';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';

import * as dotenv from 'dotenv';
dotenv.config();

import { accounts, forkHeight, HARDHAT_BLOCKCHAIN_FORK, nodeUrl } from './lib/config';

// This is a sample Hardhat task. To learn how to create your own go to https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
	const accounts = await hre.ethers.getSigners();
	for (const account of accounts) {
		console.log(account.address);
	}
});

// You need to export an object to set up your config. Go to https://hardhat.org/config/ to learn more
const config: HardhatUserConfig = {
	solidity: {
		version: '0.8.12',
		settings: {
			optimizer: {
				enabled: true,
				runs: 999999, // 969696, 888888, 777666
			},
		},
	},
	networks: {
		hardhat: {
			forking: {
				url: nodeUrl(HARDHAT_BLOCKCHAIN_FORK),
				blockNumber: forkHeight(HARDHAT_BLOCKCHAIN_FORK),
			},
			accounts: accounts(false),
		},
	},
	typechain: {
		outDir: 'types',
	},
};

export default config;
