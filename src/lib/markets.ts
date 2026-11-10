export const markets = [
  { pair: "EUR/USD", base: "eur", quote: "usd" },
  { pair: "GBP/USD", base: "gbp", quote: "usd" },
  { pair: "USD/JPY", base: "usd", quote: "jpy" },
  { pair: "USD/CHF", base: "usd", quote: "chf" },
  { pair: "AUD/USD", base: "aud", quote: "usd" },
  { pair: "USD/CAD", base: "usd", quote: "cad" },
  { pair: "NZD/USD", base: "nzd", quote: "usd" },
  { pair: "USD/CNY", base: "usd", quote: "cny" },
  { pair: "USD/INR", base: "usd", quote: "inr" },
  { pair: "USD/AED", base: "usd", quote: "aed" },
  { pair: "USD/SAR", base: "usd", quote: "sar" },
  { pair: "USD/PKR", base: "usd", quote: "pkr" },
  { pair: "USD/BDT", base: "usd", quote: "bdt" },
  { pair: "USD/TRY", base: "usd", quote: "try" },
  { pair: "USD/ZAR", base: "usd", quote: "zar" },
  { pair: "USD/THB", base: "usd", quote: "thb" },
] as const;

export type Quote = {
  price: number;
  change24h: number;
};

export function formatPrice(value: number) {
  const amount =
    value >= 100
      ? value.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : value >= 0.5
        ? value.toFixed(4)
        : value.toLocaleString("en-US", {
            minimumFractionDigits: 5,
            maximumFractionDigits: 6,
          });

  return amount;
}

export function formatChange(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}
