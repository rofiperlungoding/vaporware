import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const PAPER = "#f1ebdd";
const CARD = "#fbf7ee";
const INK = "#18150f";
const INK_SOFT = "#6f6655";

const TIERS: Record<string, { title: string; color: string }> = {
  "wallet-matches-mouth": { title: "Wallet Matches Mouth", color: "#15603a" },
  lukewarm: { title: "Lukewarm", color: "#d9982b" },
  "certified-talker": { title: "Certified Talker", color: "#cf3a26" },
  "pure-vapor": { title: "Pure Vapor", color: "#cf3a26" },
};

function clampInt(value: string | null, max: number): number {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(n, max);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const saidYes = clampInt(searchParams.get("saidYes"), 9999);
  const paid = clampInt(searchParams.get("paid"), 9999);
  const gap = clampInt(searchParams.get("gap"), 100);
  const tierId = searchParams.get("tier") ?? "pure-vapor";
  const tier = TIERS[tierId] ?? TIERS["pure-vapor"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: PAPER,
          padding: "48px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "820px",
            backgroundColor: CARD,
            border: `4px solid ${INK}`,
            boxShadow: `12px 12px 0 0 ${INK}`,
            padding: "48px 56px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: 64, fontWeight: 800, color: INK }}>
              Vaporware
            </div>
            <div style={{ fontSize: 22, letterSpacing: 10, color: INK_SOFT }}>
              DEMAND RECEIPT
            </div>
          </div>

          <div
            style={{
              display: "flex",
              borderTop: `3px dashed ${INK}`,
              marginTop: 36,
              marginBottom: 28,
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 34,
              color: INK,
              marginBottom: 14,
            }}
          >
            <span>Said &quot;take my money&quot;</span>
            <span style={{ fontWeight: 800 }}>{saidYes}×</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 34,
              color: INK,
            }}
          >
            <span>Actually paid</span>
            <span style={{ fontWeight: 800 }}>{paid}×</span>
          </div>

          <div
            style={{
              display: "flex",
              borderTop: `3px dashed ${INK}`,
              marginTop: 28,
              marginBottom: 28,
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 28, color: INK_SOFT }}>
              Personal say-do gap
            </span>
            <span style={{ fontSize: 96, fontWeight: 800, color: tier.color }}>
              {gap}%
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignSelf: "center",
              marginTop: 28,
              border: `5px solid ${tier.color}`,
              borderRadius: 14,
              padding: "10px 24px",
              transform: "rotate(-4deg)",
              fontSize: 44,
              fontWeight: 800,
              letterSpacing: 2,
              color: tier.color,
              textTransform: "uppercase",
            }}
          >
            {tier.title}
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 28, fontSize: 22, color: INK_SOFT }}>
          everyone says they&apos;d pay. few actually click.
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
