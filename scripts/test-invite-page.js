require("dotenv").config({ path: ".env.local" });

async function testInvitePage() {
  const url = "http://localhost:3000/invite/test-invite-001";
  try {
    const response = await fetch(url);
    console.log("Status:", response.status, response.statusText);
    const html = await response.text();
    // Check for couple names
    if (html.includes("Priya") && html.includes("Arjun")) {
      console.log("✅ Couple names found in HTML");
    } else {
      console.log("❌ Couple names not found in HTML");
      // Output snippet for debugging
      const snippet = html.substring(0, 2000);
      console.log("First 2000 chars:", snippet);
    }
    // Check for wedding date
    if (html.includes("2026-06-15")) {
      console.log("✅ Wedding date found");
    }
    // Check for template
    if (html.includes("royal-gold")) {
      console.log("✅ Template slug found");
    }
  } catch (error) {
    console.error("Error fetching invite page:", error.message);
  }
}

testInvitePage();
