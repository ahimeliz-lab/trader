"use client";

import React from "react";

type TimeframeSummary = {
  timeframe: string;
  bars: number;
  close: number | null;
  changePct: number | null;
  ema20: number | null;
  ema50: number | null;
  ema200: number | null;
  rsi14: number | null;
  atr: number | null;
  atrPct: number | null;
  swingHigh: number | null;
  swingLow: number | null;
  trend: string;
  volatilityPct: number | null;
};

type Strategy = {
  name: string;
  bias: "LONG" | "SHORT" | "NEUTRAL";
  setup: string;
  entry: {
    type: "market" | "limit" | "stop";
    price?: number;
    zone?: { lo: number; hi: number } | null;
  };
  stop: number;
  targets: number[];
  timeHorizon: string;
  positionSizing: string;
  invalidation: string;
  rationale: string[];
  confidence: number;
};

type Analysis = {
  headline: string;
  summary: string;
  marketRegime: string;
  momentum: string;
  volatility: string;
  keyLevels: { support: number[]; resistance: number[]; pivots: number[] };
  riskNotes: string[];
  confidence: { score: number; rationale: string[] };
};

type StrategistResponse = {
  ok: boolean;
  error?: string;
  mode?: "LTF" | "HTF";
  symbol?: string;
  generatedAt?: string;
  model?: "openai" | "fallback";
  modelError?: string;
  liveError?: string;
  liveSource?: string;
  live?: {
    price: number | null;
    change24hPct: number | null;
    high24h: number | null;
    low24h: number | null;
    volume24h: number | null;
    timestamp: string | null;
  };
  timeframes?: Record<string, TimeframeSummary>;
  analysis?: Analysis;
  strategies?: {
    intraday: Strategy;
    scalp: Strategy;
    swing: Strategy;
  };
};

const DEFAULT_SYMBOL = "BTCUSDT";

const formatNumber = (value: number | null | undefined, digits = 2) => {
  if (value == null || !Number.isFinite(value)) return "n/a";
  return value.toFixed(digits);
};

const formatPrice = (value: number | null | undefined) => {
  if (value == null || !Number.isFinite(value)) return "n/a";
  return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatPct = (value: number | null | undefined) => {
  if (value == null || !Number.isFinite(value)) return "n/a";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
};

const asList = (items: string[] | undefined) => (Array.isArray(items) && items.length ? items : []);

const asNums = (items: number[] | undefined) => (Array.isArray(items) && items.length ? items : []);

export default function StrategistDashboard() {
  const [mode, setMode] = React.useState<"LTF" | "HTF" | null>(null);
  const [lookback, setLookback] = React.useState(420);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [data, setData] = React.useState<StrategistResponse | null>(null);

  const runAnalysis = React.useCallback(
    async (nextMode: "LTF" | "HTF") => {
      setMode(nextMode);
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            mode: nextMode,
            symbol: DEFAULT_SYMBOL,
            lookback,
          }),
        });

        const json = (await res.json()) as StrategistResponse;
        if (!res.ok || !json.ok) {
          throw new Error(json.error || `Request failed (${res.status})`);
        }
        setData(json);
      } catch (err: any) {
        setError(err?.message || "Failed to run analysis.");
      } finally {
        setLoading(false);
      }
    },
    [lookback]
  );

  const live = data?.live ?? null;
  const analysis = data?.analysis ?? null;
  const strategies = data?.strategies ?? null;
  const timeframes = data?.timeframes ?? {};
  const orderedTimeframes = Object.values(timeframes).sort((a, b) => {
    const order = ["15m", "1h", "4h", "1d"];
    return order.indexOf(a.timeframe) - order.indexOf(b.timeframe);
  });

  return (
    <div className="desk">
      <header className="hero">
        <div className="hero-copy">
          <p className="eyebrow">AI Trading Strategist</p>
          <h1>Bitcoin Strategy Desk</h1>
          <p className="lead">
            Advanced model blends your Candles table with live Binance data to produce a full market brief plus
            actionable intraday, scalp, and mid/long-term plans.
          </p>
          <div className="pill-row">
            <span>Symbol: {DEFAULT_SYMBOL}</span>
            <span>Data: Candles + Binance live</span>
            <span>Output: 3 strategy playbooks</span>
          </div>
        </div>

        <div className="hero-controls">
          <div className="control-card">
            <div className="control-title">Command Deck</div>
            <div className="control-subtitle">Choose the full plan to run.</div>
            <div className="button-row">
              <button className="btn primary" onClick={() => void runAnalysis("LTF")} disabled={loading}>
                {loading && mode === "LTF" ? "Running LTF plan..." : "Run full LTF plan"}
              </button>
              <button className="btn ghost" onClick={() => void runAnalysis("HTF")} disabled={loading}>
                {loading && mode === "HTF" ? "Running HTF plan..." : "Run full HTF plan"}
              </button>
            </div>
            <label className="lookback">
              Lookback
              <input
                type="range"
                min={240}
                max={1200}
                step={60}
                value={lookback}
                onChange={(event) => setLookback(Number(event.target.value))}
              />
              <span>{lookback} bars</span>
            </label>
            <div className="control-footnote">
              {data?.generatedAt ? `Last run: ${new Date(data.generatedAt).toLocaleString()}` : "Ready when you are."}
            </div>
          </div>

          <div className="live-card">
          <div className="control-title">Live Bitcoin Tape</div>
          {data?.liveSource ? <div className="live-source">Source: {data.liveSource}</div> : null}
          <div className="live-price">{formatPrice(live?.price)}</div>
            <div className={`live-change ${live?.change24hPct && live.change24hPct >= 0 ? "up" : "down"}`}>
              {formatPct(live?.change24hPct)} (24h)
            </div>
            <div className="live-grid">
              <div>
                <span>High</span>
                <strong>{formatPrice(live?.high24h)}</strong>
              </div>
              <div>
                <span>Low</span>
                <strong>{formatPrice(live?.low24h)}</strong>
              </div>
              <div>
                <span>Volume</span>
                <strong>{formatNumber(live?.volume24h, 0)}</strong>
              </div>
              <div>
                <span>Updated</span>
                <strong>{live?.timestamp ? new Date(live.timestamp).toLocaleTimeString() : "n/a"}</strong>
              </div>
            </div>
            {data?.liveError ? <div className="warning">Live data note: {data.liveError}</div> : null}
            {data?.modelError ? <div className="warning">Model note: {data.modelError}</div> : null}
          </div>
        </div>
      </header>

      {error ? <div className="error">{error}</div> : null}

      <section className="grid summary">
        {orderedTimeframes.map((tf, index) => (
          <div key={tf.timeframe} className={`card rise delay-${index + 1}`}>
            <div className="card-label">{tf.timeframe.toUpperCase()}</div>
            <div className="card-price">{formatPrice(tf.close)}</div>
            <div className={`card-change ${tf.changePct != null && tf.changePct >= 0 ? "up" : "down"}`}>
              {formatPct(tf.changePct)}
            </div>
            <div className="card-grid">
              <span>Trend</span>
              <strong>{tf.trend || "n/a"}</strong>
              <span>RSI</span>
              <strong>{formatNumber(tf.rsi14, 1)}</strong>
              <span>ATR</span>
              <strong>{formatNumber(tf.atr, 2)}</strong>
              <span>Vol</span>
              <strong>{formatPct(tf.volatilityPct)}</strong>
            </div>
          </div>
        ))}
      </section>

      {analysis ? (
        <section className="analysis">
          <div className="section-head">
            <h2>Market Analysis</h2>
            <span className="badge">{data?.model === "openai" ? "AI-Generated" : "Fallback"}</span>
          </div>

          <div className="analysis-grid">
            <div className="analysis-card">
              <h3>{analysis.headline}</h3>
              <p>{analysis.summary}</p>
              <div className="pill-row">
                <span>Regime: {analysis.marketRegime}</span>
                <span>Momentum: {analysis.momentum}</span>
                <span>Volatility: {analysis.volatility}</span>
              </div>
            </div>

            <div className="analysis-card">
              <h3>Key Levels</h3>
              <div className="level-grid">
                <div>
                  <span>Support</span>
                  <strong>{asNums(analysis.keyLevels.support).map(formatPrice).join(" | ") || "n/a"}</strong>
                </div>
                <div>
                  <span>Resistance</span>
                  <strong>{asNums(analysis.keyLevels.resistance).map(formatPrice).join(" | ") || "n/a"}</strong>
                </div>
                <div>
                  <span>Pivots</span>
                  <strong>{asNums(analysis.keyLevels.pivots).map(formatPrice).join(" | ") || "n/a"}</strong>
                </div>
              </div>
            </div>

            <div className="analysis-card">
              <h3>Risk Notes</h3>
              <ul>
                {asList(analysis.riskNotes).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="analysis-card">
              <h3>Confidence</h3>
              <div className="confidence">
                <div className="confidence-score">{formatNumber(analysis.confidence.score, 0)}</div>
                <div>
                  <p>Score out of 100</p>
                  <ul>
                    {asList(analysis.confidence.rationale).map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {strategies ? (
        <section className="strategies">
          <div className="section-head">
            <h2>Strategy Playbooks</h2>
            <span className="badge">Intraday / Scalp / Mid/Long</span>
          </div>

          <div className="strategy-grid">
            {[strategies.intraday, strategies.scalp, strategies.swing].map((strategy, index) => (
              <div key={strategy.name} className={`strategy-card rise delay-${index + 1}`}>
                <div className="strategy-header">
                  <div>
                    <h3>{strategy.name}</h3>
                    <p>{strategy.timeHorizon}</p>
                  </div>
                  <span className={`bias ${strategy.bias.toLowerCase()}`}>{strategy.bias}</span>
                </div>

                <div className="strategy-row">
                  <span>Setup</span>
                  <strong>{strategy.setup}</strong>
                </div>
                <div className="strategy-row">
                  <span>Entry</span>
                  <strong>
                    {strategy.entry.zone
                      ? `${strategy.entry.type} ${formatPrice(strategy.entry.zone.lo)} - ${formatPrice(
                          strategy.entry.zone.hi
                        )}`
                      : `${strategy.entry.type} ${formatPrice(strategy.entry.price)}`}
                  </strong>
                </div>
                <div className="strategy-row">
                  <span>Stop</span>
                  <strong>{formatPrice(strategy.stop)}</strong>
                </div>
                <div className="strategy-row">
                  <span>Targets</span>
                  <strong>{asNums(strategy.targets).map(formatPrice).join(" | ") || "n/a"}</strong>
                </div>

                <div className="strategy-row">
                  <span>Invalidation</span>
                  <strong>{strategy.invalidation}</strong>
                </div>

                <div className="strategy-row">
                  <span>Positioning</span>
                  <strong>{strategy.positionSizing}</strong>
                </div>

                <div className="strategy-notes">
                  <p>Rationale</p>
                  <ul>
                    {asList(strategy.rationale).map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="strategy-confidence">
                  Confidence: <strong>{formatNumber(strategy.confidence, 0)}</strong>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="footer">
        <div>
          Strategy desk output is generated from your data sources and should be validated before any real capital
          exposure.
        </div>
      </section>

      <style jsx>{`
        .desk {
          max-width: 1240px;
          margin: 0 auto;
          padding: 40px 24px 80px;
          position: relative;
        }
        .desk::before {
          content: "";
          position: absolute;
          inset: 12px;
          border-radius: 40px;
          background: radial-gradient(circle at top right, rgba(232, 140, 46, 0.12), transparent 45%),
            radial-gradient(circle at 20% 40%, rgba(18, 124, 90, 0.12), transparent 55%);
          z-index: 0;
        }
        .desk > * {
          position: relative;
          z-index: 1;
        }
        .hero {
          display: grid;
          gap: 32px;
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
          align-items: start;
        }
        .hero-copy h1 {
          font-size: clamp(2.6rem, 3vw, 3.4rem);
          margin: 0 0 16px;
          letter-spacing: -0.02em;
        }
        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.3em;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--ink-soft);
        }
        .lead {
          font-size: 1.1rem;
          line-height: 1.6;
          color: var(--ink-soft);
        }
        .pill-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 20px;
          font-size: 0.85rem;
        }
        .pill-row span {
          padding: 6px 12px;
          border-radius: 999px;
          border: 1px solid rgba(30, 30, 30, 0.15);
          background: rgba(255, 255, 255, 0.7);
        }
        .hero-controls {
          display: grid;
          gap: 18px;
        }
        .control-card,
        .live-card {
          padding: 20px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(30, 30, 30, 0.1);
          box-shadow: 0 12px 40px rgba(16, 24, 40, 0.08);
        }
        .control-title {
          font-weight: 700;
          margin-bottom: 6px;
        }
        .control-subtitle {
          color: var(--ink-soft);
          font-size: 0.9rem;
        }
        .button-row {
          display: grid;
          gap: 12px;
          margin: 20px 0;
        }
        .btn {
          padding: 14px 18px;
          border-radius: 14px;
          border: 1px solid transparent;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn:disabled {
          cursor: not-allowed;
          opacity: 0.7;
          transform: none;
        }
        .btn.primary {
          background: linear-gradient(135deg, #0f6e5a, #1a8f74);
          color: white;
          box-shadow: 0 12px 25px rgba(15, 110, 90, 0.25);
        }
        .btn.ghost {
          background: #fff6e8;
          border-color: rgba(224, 143, 46, 0.4);
          color: #9b5b10;
        }
        .btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }
        .lookback {
          display: grid;
          gap: 8px;
          font-size: 0.85rem;
        }
        .lookback input {
          width: 100%;
        }
        .control-footnote {
          margin-top: 10px;
          font-size: 0.8rem;
          color: var(--ink-soft);
        }
        .live-price {
          font-size: 2.1rem;
          font-weight: 700;
        }
        .live-source {
          font-size: 0.8rem;
          color: var(--ink-soft);
          margin-bottom: 6px;
        }
        .live-change {
          font-weight: 700;
          margin-bottom: 16px;
        }
        .live-change.up {
          color: #14804a;
        }
        .live-change.down {
          color: #bb3b2d;
        }
        .live-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          font-size: 0.85rem;
        }
        .live-grid span {
          color: var(--ink-soft);
          display: block;
          margin-bottom: 4px;
        }
        .warning {
          margin-top: 12px;
          background: rgba(224, 143, 46, 0.12);
          border-radius: 12px;
          padding: 10px;
          font-size: 0.85rem;
        }
        .error {
          margin: 24px 0;
          padding: 14px 18px;
          border-radius: 16px;
          background: rgba(187, 59, 45, 0.12);
          color: #a33226;
          font-weight: 600;
        }
        .grid.summary {
          margin-top: 36px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
        }
        .card {
          padding: 18px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(30, 30, 30, 0.08);
        }
        .card-label {
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ink-soft);
        }
        .card-price {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 8px 0 4px;
        }
        .card-change {
          font-weight: 700;
        }
        .card-change.up {
          color: #14804a;
        }
        .card-change.down {
          color: #bb3b2d;
        }
        .card-grid {
          margin-top: 14px;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 6px 12px;
          font-size: 0.85rem;
        }
        .analysis,
        .strategies {
          margin-top: 44px;
        }
        .section-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }
        .section-head h2 {
          margin: 0;
        }
        .badge {
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(15, 110, 90, 0.12);
          color: #0f6e5a;
          font-weight: 700;
        }
        .analysis-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 16px;
        }
        .analysis-card {
          padding: 20px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(30, 30, 30, 0.1);
        }
        .analysis-card h3 {
          margin-top: 0;
        }
        .analysis-card ul {
          padding-left: 18px;
          margin: 10px 0 0;
          color: var(--ink-soft);
        }
        .level-grid {
          display: grid;
          gap: 12px;
          font-size: 0.9rem;
        }
        .level-grid span {
          color: var(--ink-soft);
          display: block;
          margin-bottom: 4px;
        }
        .confidence {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 14px;
          align-items: start;
        }
        .confidence-score {
          font-size: 2.4rem;
          font-weight: 700;
          color: #0f6e5a;
        }
        .strategy-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 18px;
        }
        .strategy-card {
          padding: 22px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(30, 30, 30, 0.1);
          display: grid;
          gap: 12px;
        }
        .strategy-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .strategy-header h3 {
          margin: 0;
        }
        .strategy-header p {
          margin: 4px 0 0;
          color: var(--ink-soft);
          font-size: 0.85rem;
        }
        .bias {
          padding: 6px 12px;
          border-radius: 999px;
          font-weight: 700;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .bias.long {
          background: rgba(20, 128, 74, 0.15);
          color: #14804a;
        }
        .bias.short {
          background: rgba(187, 59, 45, 0.15);
          color: #bb3b2d;
        }
        .bias.neutral {
          background: rgba(64, 64, 64, 0.1);
          color: #444;
        }
        .strategy-row {
          display: grid;
          grid-template-columns: 110px 1fr;
          gap: 10px;
          font-size: 0.88rem;
        }
        .strategy-row span {
          color: var(--ink-soft);
        }
        .strategy-notes p {
          margin: 0 0 6px;
          font-weight: 700;
        }
        .strategy-notes ul {
          margin: 0;
          padding-left: 18px;
          color: var(--ink-soft);
        }
        .strategy-confidence {
          font-size: 0.9rem;
          font-weight: 700;
          color: #0f6e5a;
        }
        .footer {
          margin-top: 48px;
          padding-top: 18px;
          border-top: 1px solid rgba(30, 30, 30, 0.1);
          color: var(--ink-soft);
          font-size: 0.85rem;
        }
        .rise {
          opacity: 0;
          animation: rise 0.6s ease forwards;
        }
        .delay-1 {
          animation-delay: 0.1s;
        }
        .delay-2 {
          animation-delay: 0.2s;
        }
        .delay-3 {
          animation-delay: 0.3s;
        }
        .delay-4 {
          animation-delay: 0.4s;
        }
        @keyframes rise {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 1000px) {
          .hero {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
