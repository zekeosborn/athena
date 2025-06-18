export const txColors = {
  transfer: 0x06b6d4, // Cyan/Teal
  swap: 0xf59e42,     // Orange
  mint: 0x10b981,     // Green
  burn: 0xf43f5e,     // Red-Pink
  stake: 0xa21caf,    // Purple
  other: 0xf1f5f9,    // Light Gray
};

export const txColorLabels: Record<keyof typeof txColors, string> = {
  transfer: "Transfer",
  swap: "Swap",
  mint: "Mint",
  burn: "Burn",
  stake: "Stake",
  other: "Other",
};