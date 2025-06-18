import { TransactionType } from "@/types";

export default function classifyTransaction(input: string): TransactionType {
  const methodSig = input.slice(0, 10).toLowerCase();
  
  const signatures = {
    // ERC20 Transfer
    '0xa9059cbb': 'transfer', // transfer(address,uint256)
    '0x23b872dd': 'transfer', // transferFrom(address,address,uint256)
    
    // DEX Swaps
    '0x7ff36ab5': 'swap', // swapExactETHForTokens
    '0x18cbafe5': 'swap', // swapExactTokensForETH
    '0x38ed1739': 'swap', // swapExactTokensForTokens
    '0x8803dbee': 'swap', // swapTokensForExactTokens
    '0x5c11d795': 'swap', // swapExactTokensForTokensSupportingFeeOnTransferTokens
    '0x791ac947': 'swap', // swapExactTokensForETHSupportingFeeOnTransferTokens
    '0x022c0d9f': 'swap', // swap(uint256,uint256,address,bytes)
    
    // Minting
    '0x40c10f19': 'mint', // mint(address,uint256)
    '0xa0712d68': 'mint', // mint(uint256)
    '0x4f02c420': 'mint', // mintPosition
    
    // Burning
    '0x42966c68': 'burn', // burn(uint256)
    '0x9dc29fac': 'burn', // burn(address,uint256)
    '0xa399b6a2': 'burn', // burnPosition
    
    // Staking
    '0xa694fc3a': 'stake', // stake(uint256)
    '0x2e1a7d4d': 'stake', // withdraw(uint256) - could be unstaking
    '0xb6b55f25': 'stake', // deposit(uint256)
    '0xe2bbb158': 'stake', // deposit(uint256,address)
    '0x379607f5': 'stake', // claim()
    '0x4e71d92d': 'stake', // claim(address)
  } as const;

  return signatures[methodSig as keyof typeof signatures] ?? 'other';
}