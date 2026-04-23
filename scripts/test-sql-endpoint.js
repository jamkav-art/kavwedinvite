require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function testSqlEndpoint() {
  const url = `${supabaseUrl}/rest/v1/sql`;
  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
  };
  const body = JSON.stringify({
    query: "SELECT * FROM pg_policies WHERE tablename = 'orders';",
  });

  try {
    const response = await fetch(url, { method: "POST", headers, body });
    console.log("Status:", response.status, response.statusText);
    const text = await response.text();
    console.log("Response:", text);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testSqlEndpoint();
