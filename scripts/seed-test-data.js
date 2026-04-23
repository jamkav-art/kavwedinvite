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

async function seedTestData() {
  console.log("🌱 Seeding test data...");

  try {
    // 1. Insert test order
    const orderData = {
      invite_id: "test-invite-001",
      couple_name_1: "Priya",
      couple_name_2: "Arjun",
      wedding_date: "2026-06-15",
      template_slug: "royal-gold",
      status: "active",
      payment_id: "test_payment_123",
      amount_paid: 699,
      custom_message: "We can't wait to celebrate this special day with you!",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert(orderData)
      .select("id, invite_id")
      .single();

    if (orderError) {
      throw new Error(`Failed to insert order: ${orderError.message}`);
    }

    console.log(
      `✅ Order inserted with ID: ${order.id}, Invite ID: ${order.invite_id}`,
    );

    // 2. Insert events
    const events = [
      {
        order_id: order.id,
        event_name: "Mehendi Ceremony",
        event_date: "2026-06-13",
        event_time: "16:00",
        venue_name: "Lotus Gardens",
        venue_address: "123 MG Road, Delhi",
        venue_map_link: "https://maps.google.com",
      },
      {
        order_id: order.id,
        event_name: "Sangeet Night",
        event_date: "2026-06-14",
        event_time: "19:00",
        venue_name: "Royal Palace Lawn",
        venue_address: "456 Nehru Place, Delhi",
        venue_map_link: "https://maps.google.com",
      },
      {
        order_id: order.id,
        event_name: "Wedding Ceremony",
        event_date: "2026-06-15",
        event_time: "18:00",
        venue_name: "Grand Temple Hall",
        venue_address: "789 Connaught Place, Delhi",
        venue_map_link: "https://maps.google.com",
      },
    ];

    const { data: insertedEvents, error: eventsError } = await supabase
      .from("events")
      .insert(events)
      .select();

    if (eventsError) {
      throw new Error(`Failed to insert events: ${eventsError.message}`);
    }

    console.log(`✅ ${insertedEvents.length} events inserted`);

    // 3. Insert media
    const media = [
      {
        order_id: order.id,
        media_type: "photo",
        file_url: "https://placehold.co/800x600",
        file_name: "photo1.jpg",
      },
      {
        order_id: order.id,
        media_type: "photo",
        file_url: "https://placehold.co/600x800",
        file_name: "photo2.jpg",
      },
      {
        order_id: order.id,
        media_type: "video",
        file_url:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        file_name: "save-the-date.mp4",
      },
      {
        order_id: order.id,
        media_type: "voice",
        file_url:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        file_name: "voice-note.mp3",
      },
    ];

    const { data: insertedMedia, error: mediaError } = await supabase
      .from("media")
      .insert(media)
      .select();

    if (mediaError) {
      throw new Error(`Failed to insert media: ${mediaError.message}`);
    }

    console.log(`✅ ${insertedMedia.length} media items inserted`);

    console.log("\n🎉 Test data seeding completed successfully!");
    console.log(
      `📋 Invite URL: http://localhost:3000/invite/${order.invite_id}`,
    );
    console.log("📋 Order ID:", order.id);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
}

seedTestData();
