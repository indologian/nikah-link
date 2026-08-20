import "server-only";

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "";
const IS_PRODUCTION = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";

const MIDTRANS_API_URL = IS_PRODUCTION
  ? "https://app.midtrans.com/snap/v1/transactions"
  : "https://app.sandbox.midtrans.com/snap/v1/transactions";

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
  if (!MIDTRANS_SERVER_KEY) {
    throw new Error("MIDTRANS_SERVER_KEY belum dikonfigurasi");
  }

  const authHeader = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64");
  const payload = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount,
    },
    credit_card: { secure: true },
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

  return response.json();
}

export async function getMidtransTransactionStatus(orderId: string) {
  if (!MIDTRANS_SERVER_KEY) {
    throw new Error("MIDTRANS_SERVER_KEY belum dikonfigurasi");
  }

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
