import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function main() {
  // Get a sample row
  const { data, error } = await supabase
    .from("content_queue")
    .select("*")
    .limit(1);

  if (error) {
    console.error("ERROR:", error.message);
    return;
  }

  if (data && data.length > 0) {
    console.log("COLUMNS:", JSON.stringify(Object.keys(data[0])));
    console.log("SAMPLE:", JSON.stringify(data[0], null, 2));
  } else {
    console.log("No rows found in content_queue");
    // Just show column info
    const { data: colData } = await supabase
      .from("content_queue")
      .select("*")
      .limit(0);
    console.log("Table exists, no data");
  }
}

main().catch(console.error);
