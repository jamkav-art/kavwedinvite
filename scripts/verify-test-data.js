const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables. Check .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function verifyTestData() {
  console.log("🔍 Verifying test data...");

  try {
    // Fetch order by invite_id
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("invite_id", "test-invite-001")
      .single();

    if (orderError) {
      throw new Error(`Order not found: ${orderError.message}`);
    }

    console.log("✅ Order found:");
    console.log(`   ID: ${order.id}`);
    console.log(`   Couple: ${order.couple_name_1} & ${order.couple_name_2}`);
    console.log(`   Wedding Date: ${order.wedding_date}`);
    console.log(`   Status: ${order.status}`);
    console.log(`   Invite ID: ${order.invite_id}`);

    // Fetch events
    const { data: events, error: eventsError } = await supabase
      .from("events")
      .select("*")
      .eq("order_id", order.id);

    if (eventsError) {
      throw new Error(`Events fetch failed: ${eventsError.message}`);
    }

    console.log(`\n✅ ${events.length} events found:`);
    events.forEach((event, idx) => {
      console.log(
        `   ${idx + 1}. ${event.event_name} on ${event.event_date} at ${event.venue_name}`,
      );
    });

    // Fetch media
    const { data: media, error: mediaError } = await supabase
      .from("media")
      .select("*")
      .eq("order_id", order.id);

    if (mediaError) {
      throw new Error(`Media fetch failed: ${mediaError.message}`);
    }

    console.log(`\n✅ ${media.length} media items found:`);
    media.forEach((item, idx) => {
      console.log(
        `   ${idx + 1}. ${item.media_type}: ${item.file_name} (${item.file_url})`,
      );
    });

    console.log("\n🎉 Verification successful!");
    console.log(
      `📋 Invite URL: http://localhost:3000/invite/${order.invite_id}`,
    );
  } catch (error) {
    console.error("❌ Verification failed:", error.message);
    process.exit(1);
  }
}

verifyTestData();
