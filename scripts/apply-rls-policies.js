require("dotenv").config({ path: ".env.local" });
const fs = require("fs");
const path = require("path");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function applyPolicies() {
  console.log("Attempting to apply RLS policies via Supabase SQL API...");

  const sqlPath = path.join(__dirname, "add-rls-policies.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");

  // Try the SQL endpoint (might not be enabled)
  const url = `${supabaseUrl}/rest/v1/sql`;
  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
  };
  const body = JSON.stringify({ query: sql });

  try {
    const response = await fetch(url, { method: "POST", headers, body });
    const text = await response.text();
    if (response.ok) {
      console.log("✅ Policies applied successfully via SQL API.");
      console.log("Response:", text);
      return true;
    } else {
      console.log(
        "❌ SQL API returned error:",
        response.status,
        response.statusText,
      );
      console.log("Response:", text);
      console.log("\n--- Manual steps required ---");
      console.log("The SQL API is not enabled for your Supabase project.");
      console.log(
        "Please run the SQL script manually in the Supabase SQL Editor:",
      );
      console.log(
        "\n1. Go to https://supabase.com/dashboard/project/lmfpgmnsrhjrpzzedsjk/sql",
      );
      console.log("2. Copy the contents of scripts/add-rls-policies.sql");
      console.log("3. Paste into the SQL editor and click 'Run'.");
      console.log(
        "\nAfter running, the invite page will work with the regular client (no admin bypass).",
      );
      return false;
    }
  } catch (error) {
    console.error("❌ Failed to connect to SQL API:", error.message);
    console.log("\n--- Manual steps required ---");
    console.log(
      "Please run the SQL script manually in the Supabase SQL Editor.",
    );
    console.log("See instructions above.");
    return false;
  }
}

applyPolicies().then((success) => {
  if (!success) {
    // Also output the SQL for easy copying
    console.log("\n--- SQL Script ---");
    const sql = fs.readFileSync(
      path.join(__dirname, "add-rls-policies.sql"),
      "utf8",
    );
    console.log(sql);
  }
});
