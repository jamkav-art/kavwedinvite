require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function explore() {
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 1. Check if pg_query function exists
  console.log("Testing pg_query via rpc...");
  const { data: pgQueryData, error: pgQueryError } = await supabase.rpc(
    "pg_query",
    { query: "SELECT 1 as test" },
  );
  if (pgQueryError) {
    console.log("pg_query error:", pgQueryError.message);
  } else {
    console.log("pg_query success:", pgQueryData);
  }

  // 2. Check if query function exists (maybe in pg schema)
  const { data: queryData, error: queryError } = await supabase.rpc("query", {
    sql: "SELECT 1",
  });
  if (queryError) {
    console.log("query error:", queryError.message);
  } else {
    console.log("query success:", queryData);
  }

  // 3. List functions in public schema via information_schema.routines
  console.log("\nListing functions from information_schema.routines...");
  const { data: routines, error: routinesError } = await supabase
    .from("information_schema.routines")
    .select("routine_name, routine_schema")
    .eq("routine_schema", "public")
    .limit(10);
  if (routinesError) {
    console.log("Routines error:", routinesError.message);
  } else {
    console.log("Routines:", routines);
  }

  // 4. Check if pg extension is enabled by querying pg_extension
  const { data: extensions, error: extensionsError } = await supabase
    .from("pg_extension")
    .select("extname")
    .eq("extname", "pg")
    .maybeSingle();
  if (extensionsError) {
    console.log("Extensions error:", extensionsError.message);
  } else {
    console.log("pg extension:", extensions);
  }
}

explore();
