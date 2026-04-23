require("dotenv").config({ path: ".env.local" });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const admin = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function updateOrderStatus() {
  // Update order status to 'paid'
  const { data, error } = await admin
    .from("orders")
    .update({ status: "paid" })
    .eq("invite_id", "test-invite-001")
    .select();

  if (error) {
    console.error("Update error:", error.message);
    return;
  }
  console.log("Updated order:", data);

  // Test with anon client
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const anon = createClient(supabaseUrl, anonKey);
  const { data: order, error: orderError } = await anon
    .from("orders")
    .select("*")
    .eq("invite_id", "test-invite-001")
    .maybeSingle();

  if (orderError) {
    console.error("Anon fetch error:", orderError.message);
  } else if (order) {
    console.log("✅ Order now visible via anon client:", order.id);
  } else {
    console.log("❌ Order still not visible via anon client");
  }
}

updateOrderStatus();
