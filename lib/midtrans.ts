// Midtrans integration helper for NikahLink
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "";
const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

// MUST use NEXT_PUBLIC_ prefix so this value is available in client components
// (e.g. app/harga/page.tsx uses SNAP_URL to load the correct Snap.js script)
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

export async function createMidtransTransaction({
  orderId,
  amount,
  customerDetails,
  itemDetails,
}: {
  orderId: string;
  amount: number;
  customerDetails: {
    first_name: string;
    email: string;
    phone?: string;
  };
  itemDetails: Array<{
    id: string;
    price: number;
    quantity: number;
    name: string;
  }>;
}) {
  const authHeader = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64");
  const payload = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount,
    },
    credit_card: {
      secure: true,
    },
    customer_details: customerDetails,
    item_details: itemDetails,
  };
  const response = await fetch(MIDTRANS_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${authHeader}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errText = await response.text();
    console.error("Midtrans Error Response:", errText);
    throw new Error(`Midtrans Error: ${response.statusText}`);
  }
  const data = await response.json();
  return data; // { token: "...", redirect_url: "..." }
}

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