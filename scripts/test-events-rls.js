require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const admin = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const anon = createClient(supabaseUrl, anonKey);

async function test() {
  // Get order id via admin
  const { data: order } = await admin
    .from("orders")
    .select("id")
    .eq("invite_id", "test-invite-001")
    .single();

  console.log("Order ID:", order.id);

  // Try to fetch events with anon
  const { data: events, error } = await anon
    .from("events")
    .select("*")
    .eq("order_id", order.id);

  if (error) console.error("Events error:", error.message);
  else console.log(`Events visible via anon: ${events.length}`);

  // Try to fetch media with anon
  const { data: media, error: mediaError } = await anon
    .from("media")
    .select("*")
    .eq("order_id", order.id);

  if (mediaError) console.error("Media error:", mediaError.message);
  else console.log(`Media visible via anon: ${media.length}`);
}

test().catch(console.error);
