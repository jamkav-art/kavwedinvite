require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function testRpc() {
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Try to call a function named 'query' (if exists)
  const { data, error } = await supabase.rpc("query", {
    sql: "SELECT 1 as test",
  });
  if (error) {
    console.error("RPC error:", error);
    // Maybe the function is named 'exec' or 'run_sql'
    // Let's check other possible functions
    const { data: data2, error: error2 } = await supabase.rpc("exec", {
      sql: "SELECT 1",
    });
    if (error2) {
      console.error("Exec error:", error2);
      // Try 'run_sql'
      const { data: data3, error: error3 } = await supabase.rpc("run_sql", {
        sql: "SELECT 1",
      });
      if (error3) {
        console.error("Run SQL error:", error3);
      } else {
        console.log("Run SQL result:", data3);
      }
    } else {
      console.log("Exec result:", data2);
    }
  } else {
    console.log("Query result:", data);
  }
}

testRpc();
