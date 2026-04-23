require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function testRLS() {
  const url = `${supabaseUrl}/rest/v1/orders?invite_id=eq.test-invite-001&select=*`;
  const headers = {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, { headers });
    console.log("Response status:", response.status, response.statusText);
    if (response.ok) {
      const data = await response.json();
      console.log("Data:", JSON.stringify(data, null, 2));
    } else {
      const text = await response.text();
      console.log("Error body:", text);
    }
  } catch (error) {
    console.error("Fetch error:", error.message);
  }
}

testRLS();
