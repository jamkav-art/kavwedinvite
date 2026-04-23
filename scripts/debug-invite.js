const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugInvite() {
  console.log("🔍 Debugging invite page 404...");
  console.log("Using anon key client (subject to RLS)");

  // 1. Try to fetch order by invite_id
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("invite_id", "test-invite-001")
    .maybeSingle();

  if (orderError) {
    console.error("❌ Order fetch error:", orderError.message);
    return;
  }

  if (!order) {
    console.log("❌ Order not found via anon client (RLS may block)");
    // Check if order exists with admin client
    const {
      createClient: createAdminClient,
    } = require("@supabase/supabase-js");
    const supabaseAdmin = createAdminClient(
      supabaseUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } },
    );
    const { data: adminOrder } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("invite_id", "test-invite-001")
      .single();
    console.log("✅ Order exists via admin client:", adminOrder ? "Yes" : "No");
    if (adminOrder) {
      console.log("   Order status:", adminOrder.status);
      console.log("   expires_at:", adminOrder.expires_at);
    }
    return;
  }

  console.log("✅ Order found via anon client:");
  console.log("   ID:", order.id);
  console.log("   Status:", order.status);
  console.log("   expires_at:", order.expires_at);

  // 2. Check events and media
  const { data: events, error: eventsError } = await supabase
    .from("events")
    .select("*")
    .eq("order_id", order.id);

  if (eventsError) {
    console.error("Events error:", eventsError.message);
  } else {
    console.log(`✅ ${events.length} events found`);
  }

  const { data: media, error: mediaError } = await supabase
    .from("media")
    .select("*")
    .eq("order_id", order.id);

  if (mediaError) {
    console.error("Media error:", mediaError.message);
  } else {
    console.log(`✅ ${media.length} media items found`);
  }

  // 3. Check if template exists
  const { getTemplateBySlug } = require("../lib/templates");
  const template = getTemplateBySlug(order.template_slug);
  console.log(
    `✅ Template '${order.template_slug}' exists:`,
    template ? "Yes" : "No",
  );
}

debugInvite().catch(console.error);
