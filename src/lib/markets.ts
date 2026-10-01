export const markets = [
  { symbol: "BTC", name: "Bitcoin", id: "bitcoin" },
  { symbol: "ETH", name: "Ethereum", id: "ethereum" },
  { symbol: "USDT", name: "Tether", id: "tether" },
  { symbol: "BNB", name: "BNB", id: "binancecoin" },
  { symbol: "SOL", name: "Solana", id: "solana" },
  { symbol: "XRP", name: "XRP", id: "ripple" },
  { symbol: "ADA", name: "Cardano", id: "cardano" },
  { symbol: "AVAX", name: "Avalanche", id: "avalanche-2" },
  { symbol: "LINK", name: "Chainlink", id: "chainlink" },
  { symbol: "DOGE", name: "Dogecoin", id: "dogecoin" },
  { symbol: "TRX", name: "TRON", id: "tron" },
  { symbol: "DOT", name: "Polkadot", id: "polkadot" },
  { symbol: "MATIC", name: "Polygon", id: "matic-network" },
  { symbol: "LTC", name: "Litecoin", id: "litecoin" },
  { symbol: "SHIB", name: "Shiba Inu", id: "shiba-inu" },
  { symbol: "UNI", name: "Uniswap", id: "uniswap" },
] as const;

export type Market = (typeof markets)[number];

export type Quote = {
  price: number;
  change24h: number;
};

export function formatPrice(value: number) {
  const amount =
    value >= 1000
      ? value.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : value >= 1
        ? value.toFixed(2)
        : value.toLocaleString("en-US", {
            minimumFractionDigits: 4,
            maximumFractionDigits: 6,
          });

  return amount;
}

export function formatChange(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}
