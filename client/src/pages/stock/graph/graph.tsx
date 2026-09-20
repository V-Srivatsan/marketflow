// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import {
  AreaSeries,
  LineSeries,
  CandlestickSeries,
  createChart,
  type UTCTimestamp,
  type AreaSeriesOptions,
  type CandlestickSeriesOptions,
  type ChartOptions,
  type DeepPartial,
  type IChartApi,
  type ISeriesApi,
  type LogicalRange,
} from "lightweight-charts";

import IndicatorsDropdown from "./IndicatorsDropDown";
import { computeIndicator } from "./indicatorCalculator";
import SubIndicatorPanel from "./SubIndicatorPanel";
import {
  ON_CHART_INDICATORS,
  BELOW_CHART_INDICATORS,
} from "./indicatorTypes";

type StockEntry = {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};

type GraphProps = {
  data: StockEntry[];
  curr: string;
  indicatorData: { name: string; values: number[] } | null;
};

const Graph = ({ data, indicatorData }: GraphProps) => {
  const [selectedIndicator, setSelectedIndicator] = useState<string | null>(null);
  const [subPanelData, setSubPanelData] = useState<any[]>([]);
  const [showCandle, setShowCandle] = useState(true);

  const finChartRef = useRef<IChartApi | null>(null);
  const lineChartRef = useRef<IChartApi | null>(null);
  const subChartRef = useRef<IChartApi | null>(null);

  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const priceLineRef = useRef<ISeriesApi<"Area"> | null>(null);
  const candleOverlayRef = useRef<ISeriesApi<"Line"> | null>(null);
  const lineOverlayRef = useRef<ISeriesApi<"Line"> | null>(null);

  useEffect(() => {
    if (indicatorData) setSelectedIndicator(indicatorData.name);
  }, [indicatorData]);

  /* ---------------- MAIN CHART INIT ---------------- */
  useEffect(() => {
    if (!data.length) return;

    if (!finChartRef.current) {
      const fin = createChart(
        document.getElementById("candle-chart")!,
        CHART_MAIN
      );
      candleSeriesRef.current = fin.addSeries(
        CandlestickSeries,
        CANDLE_STYLE
      );
      finChartRef.current = fin;
    }
    candleSeriesRef.current?.setData(data);

    if (!lineChartRef.current) {
      const line = createChart(
        document.getElementById("line-chart")!,
        CHART_MAIN
      );
      priceLineRef.current = line.addSeries(AreaSeries, PRICE_STYLE);
      lineChartRef.current = line;
    }

    priceLineRef.current?.setData(
      data.map(d => ({ time: d.time, value: d.close }))
    );
  }, [data]);

  /* ---------------- INDICATORS ---------------- */
  useEffect(() => {
    if (!selectedIndicator || !data.length) {
      setSubPanelData([]);
      candleOverlayRef.current?.setData([]);
      lineOverlayRef.current?.setData([]);
      return;
    }

    const close = data.map(v => v.close);
    const open = data.map(v => v.open);
    const high = data.map(v => v.high);
    const low = data.map(v => v.low);
    const volume = data.map(v => v.volume || 1000);
    const t = data.map(v => v.time);

    const out = computeIndicator(selectedIndicator, {
      open,
      high,
      low,
      close,
      volume,
    });

    const formatted = out
      .map((v, i) =>
        isNaN(v) || !isFinite(v) ? null : { time: t[i], value: v }
      )
      .filter(Boolean);

    if (ON_CHART_INDICATORS.includes(selectedIndicator)) {
      candleOverlayRef.current ??=
        finChartRef.current?.addSeries(LineSeries, INDICATOR_STYLE);
      lineOverlayRef.current ??=
        lineChartRef.current?.addSeries(LineSeries, INDICATOR_STYLE);

      candleOverlayRef.current?.setData(formatted);
      lineOverlayRef.current?.setData(formatted);
      setSubPanelData([]);
    }

    if (BELOW_CHART_INDICATORS.includes(selectedIndicator)) {
      setSubPanelData(formatted);
      candleOverlayRef.current?.setData([]);
      lineOverlayRef.current?.setData([]);
    }
  }, [selectedIndicator, data]);

  /* --------- BIDIRECTIONAL TIME SCALE SYNC --------- */
  useEffect(() => {
    if (!subPanelData.length) return;

    const mainChart = showCandle
      ? finChartRef.current
      : lineChartRef.current;

    const subChart = subChartRef.current;

    if (!mainChart || !subChart) return;

    const syncFromMain = (range: LogicalRange | null) => {
      if (range) {
        subChart.timeScale().setVisibleLogicalRange(range);
      }
    };

    const syncFromSub = (range: LogicalRange | null) => {
      if (range) {
        mainChart.timeScale().setVisibleLogicalRange(range);
      }
    };

    mainChart.timeScale().subscribeVisibleLogicalRangeChange(syncFromMain);
    subChart.timeScale().subscribeVisibleLogicalRangeChange(syncFromSub);

    return () => {
      mainChart.timeScale().unsubscribeVisibleLogicalRangeChange(syncFromMain);
      subChart.timeScale().unsubscribeVisibleLogicalRangeChange(syncFromSub);
    };
  }, [showCandle, subPanelData.length]);

  return (
    <div className="relative">

      <div className="absolute top-4 left-4 z-50 flex gap-3 items-center bg-background/80 backdrop-blur-md px-4 py-2 rounded-xl border border-border">
        <div className="flex overflow-hidden rounded-md border border-border">
          <button
            onClick={() => setShowCandle(true)}
            className={"px-3 py-1 font-medium " + (showCandle ? "bg-primary text-white" : "text-secondary-foreground hover:text-foreground")}
          >Candles</button>
          <button
            onClick={() => setShowCandle(false)}
            className={"px-3 py-1 text-white font-medium " + (!showCandle ? "bg-primary text-white" : "text-secondary-foreground hover:text-foreground")}
          >Line</button>
        </div>

        <IndicatorsDropdown onSelect={setSelectedIndicator} />
      </div>

      <div
        id="candle-chart"
        className={showCandle ? "block" : "hidden"}
        style={{ height: subPanelData.length ? "60vh" : "75vh" }}
      />

      <div
        id="line-chart"
        className={!showCandle ? "block" : "hidden"}
        style={{ height: subPanelData.length ? "60vh" : "75vh" }}
      />

      {subPanelData.length > 0 && (
        <SubIndicatorPanel
          data={subPanelData}
          height={200}
          onChartReady={(chart) => (subChartRef.current = chart)}
        />
      )}
    </div>
  );
};

/* ---------- CHART STYLES ---------- */

const CHART_MAIN: DeepPartial<ChartOptions> = {
  autoSize: true,
  layout: { background: { color: "transparent" }, textColor: "#e5e7eb" },
  grid: {
    vertLines: { color: "rgba(255,255,255,0.08)" },
    horzLines: { color: "rgba(255,255,255,0.08)" },
  },
  rightPriceScale: { borderVisible: false },
  timeScale: { borderVisible: false },
};

const CANDLE_STYLE: DeepPartial<CandlestickSeriesOptions> = {
  upColor: "#22C55E",
  downColor: "#ef4444",
  wickUpColor: "#22C55E",
  wickDownColor: "#ef4444",
  borderVisible: false,
};

const PRICE_STYLE: DeepPartial<AreaSeriesOptions> = {
  lineColor: "#22C55E",
  topColor: "#22C55E",
  bottomColor: "transparent",
  lineWidth: 2,
  lastValueVisible: false,
  priceLineVisible: false,
};

const INDICATOR_STYLE = {
  lineWidth: 2,
  color: "#7C5CFF",
  priceLineVisible: false,
  lastValueVisible: false,
};

export default Graph;
