// Midtrans integration helper for NikahLink
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "";
const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

export const IS_PRODUCTION =
  process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";

export const SNAP_URL = IS_PRODUCTION
  ? "https://app.midtrans.com/snap/snap.js"
  : "https://app.sandbox.midtrans.com/snap/snap.js";

const MIDTRANS_API_URL = IS_PRODUCTION
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions";

// GET Status API menggunakan host berbeda (api.midtrans.com) dari Snap (app.midtrans.com)
const MIDTRANS_BASE_URL = IS_PRODUCTION
  ? "https://api.midtrans.com"
  : "https://api.sandbox.midtrans.com";

// ... createMidtransTransaction tetap apa adanya ...

/**
 * Ambil status otoritatif sebuah transaksi dari Midtrans.
 * Dipakai webhook untuk verifikasi ulang (defense-in-depth).
 * Basic Auth: username = Server Key, password kosong.
 */
export async function getMidtransTransactionStatus(orderId: string) {
  const authHeader = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64");
  const response = await fetch(
    `${MIDTRANS_BASE_URL}/v2/${encodeURIComponent(orderId)}/status`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${authHeader}`,
      },
    }
  );
  if (!response.ok) {
    const errText = await response.text();
    console.error("Midtrans Status Error:", errText);
    throw new Error(`Midtrans Status Error: ${response.statusText}`);
  }
  return response.json();
}