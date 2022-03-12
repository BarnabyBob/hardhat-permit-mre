// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.0;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ERC20, ERC20Permit } from "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

import "hardhat/console.sol";

contract ERC20PermitMock is ERC20Permit {
	/* ========== CONSTRUCTOR ========== */

	constructor(string memory name, string memory symbol) ERC20(name, symbol) ERC20Permit(name) {} // solhint-disable-line no-empty-blocks

	/* ========== MUTATIVE FUNCTIONS ========== */

	function mint(address account, uint256 amount) external returns (bool) {
		_mint(account, amount);
		return true;
	}

	function burn(uint256 amount) external returns (bool) {
		_burn(msg.sender, amount);
		return true;
	}
}
