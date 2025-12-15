import type { Stock, StockEntry } from "../../types";

type Props = {
  stocks: Record<string, Stock>;
  currentStockId: string;
  entries: Record<string, StockEntry[]>;
};

const PortfolioSummary = ({ currentStockId, entries, stocks }: Props) => {

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-[#062733] to-[#041f2b] border border-[#1e6b6b]">
      <h4 className="text-lg font-semibold mb-3">
        Stock Value
      </h4>

      <div className="space-y-2 text-sm">
        {Object.keys(stocks)
          .filter((id) => id !== currentStockId)
          .map((stockId) => {
            const stockEntries = entries[stockId];
            if (!stockEntries || stockEntries.length === 0)
              return null;

            const last =
              stockEntries[stockEntries.length - 1];

            return (
              <div
                key={stockId}
                className="flex justify-between items-center bg-[#031a22] rounded-lg px-3 py-2"
              >
                <span className="truncate">
                  {stocks[stockId].name}
                </span>
                <span className="font-medium">
                  ₹{last.close.toFixed(2)}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default PortfolioSummary;
