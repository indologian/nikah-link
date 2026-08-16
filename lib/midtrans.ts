// Midtrans integration helper for NikahLink

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-DUMMY_KEY_FOR_DEV";
const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "SB-Mid-client-DUMMY_KEY_FOR_DEV";

export const IS_MIDTRANS_SANDBOX = process.env.MIDTRANS_IS_SANDBOX !== "false";

export const SNAP_URL = IS_MIDTRANS_SANDBOX
  ? "https://app.sandbox.midtrans.com/snap/snap.js"
  : "https://app.midtrans.com/snap/snap.js";

const MIDTRANS_API_URL = IS_MIDTRANS_SANDBOX
  ? "https://app.sandbox.midtrans.com/snap/v1/transactions"
  : "https://app.midtrans.com/snap/v1/transactions";

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
