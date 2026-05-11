---
name: pseo-localization-engine
description: Complete Indian geographic location hierarchy, cultural context mapping, priority scoring, and hyperlocal content injection for the WedInviter pSEO system
---

## Objective

Define, seed, and manage the complete Indian geographic location hierarchy for the WedInviter programmatic SEO system. This engine powers all location-specific aspects of the 50,000+ page pipeline, including:

- **Location Data Management**: Seed and maintain the `wedding_locations` table with 136+ entries (28 states + 8 UTs + 100+ cities)
- **Priority Scoring**: Calculate location priority scores that feed into the content queue ranking formula
- **Cultural Context Mapping**: Map each location to its dominant wedding culture (Hindu/Muslim/Christian/Sikh/Regional) for AI prompt injection
- **Hyperlocal Content Injection**: Provide location-specific details (venues, neighborhoods, landmarks, price ranges, seasons) for AI content generation
- **Internal Linking Topology**: Define location-based proximity groups for cross-linking related city/region pages
- **URL Structure Governance**: Enforce consistent `/[pillar]/[location-slug]/[subtopic]` URL patterns

---

## Input Parameters

When the localization engine is invoked (via content queue item or manual trigger), it expects:

| Field                  | Type    | Description                                                                           |
| ---------------------- | ------- | ------------------------------------------------------------------------------------- |
| `location_name`        | string  | Display name (e.g., "Mumbai", "Ernakulam")                                            |
| `location_slug`        | string  | URL-safe slug (e.g., "mumbai", "ernakulam")                                           |
| `type`                 | string  | One of: `"city"`, `"state"`, `"union-territory"`, `"district"`                        |
| `state`                | string  | Parent state name (nullable for UTs)                                                  |
| `cultural_context`     | string  | Dominant wedding culture (e.g., "Marathi Hindu", "Kerala Christian", "Bengali Hindu") |
| `population`           | integer | City/region population for priority weighting                                         |
| `search_volume`        | integer | Monthly search volume for `[location] wedding` queries                                |
| `priority`             | integer | 1-100 priority score (100 = highest)                                                  |
| `latitude`             | decimal | For LocalBusiness schema geo coordinates                                              |
| `longitude`            | decimal | For LocalBusiness schema geo coordinates                                              |
| `proximity_group`      | string  | Group name for internal linking (e.g., "west-india", "south-india")                   |
| `dominant_religion`    | string  | Primary religion: `"hindu"`, `"muslim"`, `"christian"`, `"sikh"`, `"mixed"`           |
| `wedding_season_start` | string  | Month when wedding season begins (e.g., "November")                                   |
| `wedding_season_end`   | string  | Month when wedding season ends (e.g., "March")                                        |

---

## Location Hierarchy Model

The pSEO system uses a 3-level hierarchy for geographic targeting:

```
Level 1: State / Union Territory    (28 + 8 = 36 entries)
    └── Level 2: City / District        (100+ entries)
        └── Level 3: Neighborhood / Area    (future expansion)
```

- **Level 1** entries generate state-level pillar pages: `/wedding-invitations/kerala/`
- **Level 2** entries generate city/district-level pages: `/wedding-invitations/kochi/`
- **Level 3** entries (future) generate hyperlocal "near me" pages: `/wedding-invitations/kochi/fort-kochi/`

---

## Complete Geographic Data Registry

### 1. KERALA — Complete District Breakdown (14 Districts)

Kerala is treated as a **Tier 1 location** (Priority 100) due to its high wedding search volume, large diaspora, and strong digital adoption. Each district below gets its own city-level entry.

| #   | District           | Headquarters       | Slug               | Notable Wedding Venues & Places                                                                         | Culture                                    |
| --- | ------------------ | ------------------ | ------------------ | ------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| 1   | Thiruvananthapuram | Thiruvananthapuram | thiruvananthapuram | Kovalam Beach, Padmanabhaswamy Temple, Kanakakunnu Palace, Greenfield Stadium, Uday Samudra             | Kerala Hindu / Christian                   |
| 2   | Kollam             | Kollam             | kollam             | Ashtamudi Lake, Tangasseri, Jadayupara, Munroe Island, Kollam Beach                                     | Kerala Hindu / Christian                   |
| 3   | Pathanamthitta     | Pathanamthitta     | pathanamthitta     | Sabarimala, Konni Elephant Camp, Perunthenaruvi Waterfalls, Gavi                                        | Kerala Hindu / Christian                   |
| 4   | Alappuzha          | Alappuzha          | alappuzha          | Alleppey Backwaters, Vembanad Lake, Marari Beach, Kumarakom, Alappuzha Beach                            | Kerala Christian / Hindu                   |
| 5   | Kottayam           | Kottayam           | kottayam           | Kumarakom Bird Sanctuary, Illikkal Kallu, Vaikom Temple, Ettumanoor Temple                              | Kerala Christian / Hindu                   |
| 6   | Idukki             | Painavu            | idukki             | Munnar, Thekkady, Periyar Wildlife Sanctuary, Idukki Dam, Vagamon                                       | Kerala Hindu / Christian                   |
| 7   | Ernakulam          | Kochi              | ernakulam          | Fort Kochi, Marine Drive, Lulu Mall, Bolgatty Palace, Brunton Boatyard, Cherai Beach                    | Kerala Christian / Hindu / Jewish heritage |
| 8   | Thrissur           | Thrissur           | thrissur           | Vadakkunnathan Temple, Thrissur Pooram, Athirapally Falls, Punnathur Kotta, Shakthan Thampuran Palace   | Kerala Hindu                               |
| 9   | Palakkad           | Palakkad           | palakkad           | Palakkad Fort, Malampuzha Dam, Silent Valley, Nelliyampathy, Parambikulam                               | Kerala Hindu                               |
| 10  | Malappuram         | Malappuram         | malappuram         | Kottakkunnu, Keraladeshpuram Temple, Bharathapuzha River, Nilambur Teak Museum                          | Muslim / Kerala Hindu                      |
| 11  | Kozhikode          | Kozhikode          | kozhikode          | Kozhikode Beach, Kappad Beach, Beypore, Mananchira, Tali Temple, IIM Kozhikode                          | Muslim / Kerala Hindu                      |
| 12  | Wayanad            | Kalpetta           | wayanad            | Wayanad Wildlife Sanctuary, Edakkal Caves, Banasura Sagar Dam, Chembra Peak, Soochipara Falls           | Kerala Hindu / Christian                   |
| 13  | Kannur             | Kannur             | kannur             | Payyambalam Beach, St. Angelo Fort, Muzhappilangad Beach, Parassinikkadavu Temple, Theyyam performances | Kerala Hindu / Christian                   |
| 14  | Kasaragod          | Kasaragod          | kasargod           | Bekal Fort, Ranipuram Hills, Valiyaparamba Backwaters, Kappil Beach, Ananthapura Lake Temple            | Kerala Hindu / Muslim                      |

**Note**: Multiple slugs exist for the same area in the mega plan (e.g., `kochi` and `ernamkulam`, `kozhikode` and `calicut`). Use the standardized slug from the table above as the canonical slug and redirect the alternate.

---

### 2. ALL 28 INDIAN STATES with Major Cities & Notable Wedding Places

#### Northern States

| #   | State            | Capital                              | Major Cities                                                  | Notable Wedding Venues & Places                                                              | Primary Culture |
| --- | ---------------- | ------------------------------------ | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------- |
| 1   | Jammu & Kashmir  | Srinagar (Summer), Jammu (Winter)    | Srinagar, Jammu, Anantnag, Baramulla, Pulwama                 | Dal Lake houseboats, Mughal Gardens Shalimar Bagh, Gulmarg, Pahalgam, Pari Mahal             | Muslim / Hindu  |
| 2   | Himachal Pradesh | Shimla                               | Shimla, Manali, Dharamshala, Kullu, Palampur, Solan           | The Oberoi Wildflower Hall, Manali resorts, Dharamshala monasteries, Kufri, Mashobra         | Hindu           |
| 3   | Punjab           | Chandigarh                           | Ludhiana, Amritsar, Jalandhar, Patiala, Bathinda, Mohali      | Golden Temple, Wagah Border, Amritsar wedding farms, Jalandhar banquet halls, Patiala Palace | Sikh            |
| 4   | Uttarakhand      | Dehradun (Winter), Gairsain (Summer) | Dehradun, Haridwar, Rishikesh, Nainital, Mussoorie, Haldwani  | Nainital lake venues, Jim Corbett resorts, Rishikesh riverside venues, Haridwar ghats        | Hindu           |
| 5   | Haryana          | Chandigarh                           | Faridabad, Gurugram, Panipat, Ambala, Karnal, Sonipat, Rohtak | Gurgaon farmhouses, Ambala banquet halls, Karnal resorts, Sultanpur National Park            | Hindu           |
| 6   | Delhi NCR        | New Delhi                            | Delhi, Gurugram, Noida, Ghaziabad, Faridabad                  | Taj Palace, The Imperial, India Gate lawns, Farmhouses in Chattarpur, 5-star hotels          | Mixed           |

#### Western States

| #   | State       | Capital     | Major Cities                                                      | Notable Wedding Venues & Places                                                              | Primary Culture   |
| --- | ----------- | ----------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------- |
| 7   | Rajasthan   | Jaipur      | Jaipur, Jodhpur, Udaipur, Kota, Bikaner, Ajmer, Jaisalmer         | Udaipur palaces City Palace, Jaipur palaces, Jodhpur Mehrangarh Fort, Jaisalmer desert camps | Hindu / Rajput    |
| 8   | Gujarat     | Gandhinagar | Ahmedabad, Surat, Vadodara, Rajkot, Bhavnagar, Jamnagar, Junagadh | Ahmedabad heritage venues, Surat banquet halls, Vadodara palaces, Dwarka temples             | Hindu / Gujarati  |
| 9   | Maharashtra | Mumbai      | Mumbai, Pune, Nagpur, Thane, Nashik, Aurangabad, Solapur          | Taj Mahal Palace, JW Marriott Juhu, Pune resorts, Nashik vineyards, Mahabaleshwar            | Hindu / Marathi   |
| 10  | Goa         | Panaji      | Panaji, Margao, Vasco da Gama, Mapusa, Ponda                      | Goan beach resorts, south Goa villas, church weddings, Aguada Fort, Candolim                 | Christian / Hindu |

#### Central & Eastern States

| #   | State          | Capital     | Major Cities                                                                   | Notable Wedding Venues & Places                                                                | Primary Culture  |
| --- | -------------- | ----------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | ---------------- |
| 11  | Madhya Pradesh | Bhopal      | Bhopal, Indore, Jabalpur, Gwalior, Ujjain, Sagar, Dewas                        | Indore palace venues, Bhopal lake venues, Khajuraho temples, Gwalior Fort                      | Hindu            |
| 12  | Chhattisgarh   | Raipur      | Raipur, Bhilai, Bilaspur, Korba, Durg                                          | Raipur banquet halls, Barnawapara Wildlife Sanctuary, Sirpur temples                           | Hindu            |
| 13  | Uttar Pradesh  | Lucknow     | Lucknow, Kanpur, Agra, Varanasi, Allahabad, Meerut, Ghaziabad, Bareilly, Noida | Agra Taj Mahal view venues, Varanasi ghats, Lucknow heritage venues, Kanpur convention halls   | Hindu / Muslim   |
| 14  | Bihar          | Patna       | Patna, Gaya, Bhagalpur, Muzaffarpur, Purnia, Darbhanga                         | Patna banquet halls, Bodh Gaya, Nalanda ruins, Vaishali                                        | Hindu            |
| 15  | Jharkhand      | Ranchi      | Ranchi, Jamshedpur, Dhanbad, Bokaro, Deoghar                                   | Ranchi waterfalls venues, Jamshedpur Tata grounds, Deoghar temples, Netarhat                   | Hindu            |
| 16  | Odisha         | Bhubaneswar | Bhubaneswar, Cuttack, Rourkela, Puri, Brahmapur, Sambalpur                     | Puri beach venues, Bhubaneswar temples, Konark Sun Temple, Chilika Lake                        | Hindu            |
| 17  | West Bengal    | Kolkata     | Kolkata, Howrah, Siliguri, Durgapur, Asansol, Darjeeling                       | Kolkata Rajbari venues, Darjeeling tea garden venues, Sundarbans, Bishnupur terracotta temples | Hindu / Bengali  |
| 18  | Sikkim         | Gangtok     | Gangtok, Namchi, Mangan, Gyalshing                                             | Gangtok resorts, Tsomgo Lake, Rumtek Monastery, Yuksom                                         | Hindu / Buddhist |

#### Northeastern States

| #   | State             | Capital  | Major Cities                                           | Notable Wedding Venues & Places                                          | Primary Culture    |
| --- | ----------------- | -------- | ------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------ |
| 19  | Arunachal Pradesh | Itanagar | Itanagar, Naharlagun, Pasighat, Tawang, Ziro           | Tawang Monastery, Ziro Valley, Bhalukpong, Sela Pass                     | Buddhist / Tribal  |
| 20  | Assam             | Dispur   | Guwahati, Silchar, Dibrugarh, Jorhat, Nagaon, Tinsukia | Guwahati Brahmaputra venues, Kaziranga National Park, Jorhat tea gardens | Hindu / Assamese   |
| 21  | Manipur           | Imphal   | Imphal, Bishnupur, Churachandpur, Thoubal              | Loktak Lake, Kangla Fort, Ima Market, Sendra Island                      | Hindu / Meitei     |
| 22  | Meghalaya         | Shillong | Shillong, Tura, Nongstoin, Jowai                       | Shillong resorts, Cherrapunji, Dawki River, Umiam Lake                   | Christian / Tribal |
| 23  | Mizoram           | Aizawl   | Aizawl, Lunglei, Champhai, Serchhip                    | Aizawl convention centers, Reiek Tlang, Vantawng Falls                   | Christian          |
| 24  | Nagaland          | Kohima   | Kohima, Dimapur, Mokokchung, Tuensang                  | Kohima War Cemetery, Dzukou Valley, Kisama Heritage Village              | Christian / Tribal |
| 25  | Tripura           | Agartala | Agartala, Udaipur, Dharmanagar, Kailashahar            | Neermahal Palace, Ujjayanta Palace, Sepahijala Wildlife Sanctuary        | Hindu / Bengali    |

#### Southern States

| #   | State          | Capital   | Major Cities                                                               | Notable Wedding Venues & Places                                                    | Primary Culture   |
| --- | -------------- | --------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------- |
| 26  | Karnataka      | Bengaluru | Bengaluru, Mysuru, Hubli, Mangaluru, Belagavi, Davanagere, Bellary         | Bengaluru palace venues, Mysuru Palace, Coorg resorts, Mangaluru beach venues      | Hindu / Kannadiga |
| 27  | Telangana      | Hyderabad | Hyderabad, Warangal, Karimnagar, Nizamabad, Khammam                        | Hyderabad Taj Falaknuma Palace, convention halls, Ramoji Film City, Golconda       | Hindu / Muslim    |
| 28  | Tamil Nadu     | Chennai   | Chennai, Coimbatore, Madurai, Tiruchirappalli, Salem, Tirunelveli, Vellore | Chennai ITC Grand Chola, Mahabalipuram venues, Madurai Meenakshi Temple area, Ooty | Hindu / Tamil     |
| 29  | Andhra Pradesh | Amaravati | Visakhapatnam, Vijayawada, Guntur, Nellore, Kurnool, Tirupati              | Vizag beach venues, Tirupati temples, Vijayawada convention halls, Araku Valley    | Hindu / Telugu    |

---

### 3. ALL 8 UNION TERRITORIES

| #   | UT                                   | Capital                 | Major Areas                                 | Notable Wedding Venues & Places                                                       | Primary Culture         |
| --- | ------------------------------------ | ----------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------- | ----------------------- |
| 1   | Andaman & Nicobar Islands            | Port Blair              | Port Blair, Havelock, Neil Island, Diglipur | Radhanagar Beach resorts, Havelock island venues, Mahatma Gandhi Marine National Park | Mixed                   |
| 2   | Chandigarh                           | Chandigarh              | Sector 17, Panchkula, Mohali                | Rock Garden, Sukhna Lake, Chandigarh Club, ITC Hotels                                 | Mixed                   |
| 3   | Dadra & Nagar Haveli and Daman & Diu | Daman                   | Daman, Diu, Silvassa                        | Devka Beach, Diu Fort, Nagoa Beach, Silvassa resorts                                  | Hindu / Christian       |
| 4   | Lakshadweep                          | Kavaratti               | Kavaratti, Agatti, Minicoy                  | Bangaram Island, Kadmat Island, Agatti beach resorts                                  | Muslim                  |
| 5   | Delhi (NCR)                          | New Delhi               | See Delhi NCR under Haryana                 | See above                                                                             | Mixed                   |
| 6   | Puducherry                           | Puducherry              | White Town, Auroville, Karaikal             | French Quarter venues, Promenade Beach, Auroville, Sri Aurobindo Ashram               | Hindu / French heritage |
| 7   | Jammu & Kashmir                      | See State listing above | See State listing above                     | See State listing above                                                               | See State listing above |
| 8   | Ladakh                               | Leh                     | Leh, Kargil, Nubra Valley, Zanskar          | Pangong Lake, Nubra Valley camps, Leh Palace, Khardung La                             | Buddhist                |

**Note**: J&K and Ladakh function as both states and union territories in the system. Ladakh is separate (UT created 2019). The mega plan lists 8 UTs; the system uses the post-2019 definition.

---

### 4. METRO CITIES (Tier 1 — Priority 100)

These cities generate the highest search volume and get priority content generation first:

| #   | Metro City    | State            | Search Volume Rank | Wedding Season   | Notable Wedding Areas                               |
| --- | ------------- | ---------------- | ------------------ | ---------------- | --------------------------------------------------- |
| 1   | Mumbai        | Maharashtra      | 1                  | Nov-Feb          | Juhu, Bandra, Worli, Powai, Andheri                 |
| 2   | Delhi NCR     | Delhi/Haryana/UP | 2                  | Oct-Mar          | Chanakyapuri, Chattarpur, Aerocity, Noida, Gurgaon  |
| 3   | Bengaluru     | Karnataka        | 3                  | Dec-May          | Whitefield, Indiranagar, Koramangala, MG Road       |
| 4   | Hyderabad     | Telangana        | 4                  | Nov-Apr          | Banjara Hills, Jubilee Hills, Hitech City, Madhapur |
| 5   | Chennai       | Tamil Nadu       | 5                  | Jun-Sep, Dec-Mar | Mylapore, T Nagar, OMR, ECR, Mahabalipuram          |
| 6   | Kolkata       | West Bengal      | 6                  | Nov-Mar          | Salt Lake, Rajarhat, Alipore, Ballygunge            |
| 7   | Pune          | Maharashtra      | 7                  | Nov-Feb          | Koregaon Park, Baner, Hinjawadi, Camp               |
| 8   | Ahmedabad     | Gujarat          | 8                  | Nov-Feb          | SG Highway, Bodakdev, Satellite, Vastrapur          |
| 9   | Kochi         | Kerala           | 9                  | Aug-Mar          | Marine Drive, Fort Kochi, Kakkanad, Edapally        |
| 10  | Jaipur        | Rajasthan        | 10                 | Oct-Mar          | C Scheme, Vaishali Nagar, Malviya Nagar, palaces    |
| 11  | Lucknow       | Uttar Pradesh    | 11                 | Nov-Mar          | Gomti Nagar, Hazratganj, Aliganj, Indira Nagar      |
| 12  | Surat         | Gujarat          | 12                 | Nov-Feb          | City Light, Vesu, Adajan, Piplod                    |
| 13  | Nagpur        | Maharashtra      | 13                 | Nov-Mar          | Civil Lines, Dharampeth, Wardha Road                |
| 14  | Indore        | Madhya Pradesh   | 14                 | Oct-Mar          | Vijay Nagar, Scheme 54, AB Road                     |
| 15  | Visakhapatnam | Andhra Pradesh   | 15                 | Dec-May          | Beach Road, MVP Colony, Madhurawada                 |
| 16  | Bhopal        | Madhya Pradesh   | 16                 | Oct-Mar          | Arera Colony, MP Nagar, Shahpura                    |
| 17  | Patna         | Bihar            | 17                 | Nov-Apr          | Fraser Road, Kankarbagh, Boring Road                |
| 18  | Vadodara      | Gujarat          | 18                 | Nov-Feb          | Alkapuri, Gotri, Fatehgunj, Akota                   |
| 19  | Ludhiana      | Punjab           | 19                 | Oct-Feb          | Model Town, Dugri, Sarabha Nagar                    |
| 20  | Coimbatore    | Tamil Nadu       | 20                 | Jun-Sep, Dec-Mar | RS Puram, Race Course, Gandhipuram                  |

---

## Priority Scoring System

### Tier Matrix

| Tier        | Priority | Coverage                            | Count       |
| ----------- | -------- | ----------------------------------- | ----------- |
| Tier 1      | 100      | Metro cities + Kerala districts     | 24 entries  |
| Tier 2      | 75       | Major state capitals + large cities | 20 entries  |
| Tier 3      | 50       | Remaining major cities              | 60+ entries |
| State-level | 40       | State & UT headquarters (Level 1)   | 36 entries  |

### Priority Score Formula

```sql
priority_score = (search_volume / keyword_difficulty) * location_priority * topic_priority
```

Where:

- `search_volume` = monthly searches for `[location] wedding` (integer)
- `keyword_difficulty` = 1-100 from SEO tools
- `location_priority` = 100/75/50/40 from tier matrix
- `topic_priority` = 100 (primary pillar), 80 (supporting), 60 (subtopic)

### Queue Generation Order

1. **Phase 1** (Month 1): Tier 1 cities x Primary pillar (Wedding Invitations)
2. **Phase 2** (Month 2): Tier 1 cities x All 12 pillars
3. **Phase 3** (Month 3-4): Tier 2 cities x Primary pillar
4. **Phase 4** (Month 5-6): Tier 2 cities x All 12 pillars + Tier 1 state pages
5. **Phase 5** (Month 7-12): Tier 3 cities + Remaining states/UTs

---

## Cultural Context Mapping

The engine automatically determines the cultural context for each location based on demographic data. This context is injected into the AI prompt as a `cultural_context` field.

### Cultural Context by Region

| Region    | States                                       | Dominant Wedding Culture                  | Key Traditions                                       |
| --------- | -------------------------------------------- | ----------------------------------------- | ---------------------------------------------------- |
| North     | Punjab, Haryana, HP, Uttarakhand, J&K        | Hindu (North Indian) / Sikh               | Sangeet, Anand Karaj, Mehendi, Haldi                 |
| East      | West Bengal, Bihar, Jharkhand, Odisha, Assam | Hindu (Bengali/Eastern) / Muslim          | Shubho Drishti, Saat Paak, Sindoor Daan              |
| West      | Maharashtra, Gujarat, Rajasthan, Goa         | Hindu (Marathi/Gujarati) / Christian      | Ganesh Puja, Varghodo, Saptapadi, Goan mass          |
| South     | Kerala, Tamil Nadu, Karnataka, AP, Telangana | Hindu (South Indian) / Christian / Muslim | Thali tying, Kanyadanam, Sadya, Kaashi Yatra         |
| Northeast | 7 sisters                                    | Christian / Tribal / Buddhist             | Church weddings, tribal rituals, traditional attires |
| Central   | MP, Chhattisgarh, UP                         | Hindu (Central) / Muslim                  | Baraat, Jaimaal, Kanyadaan, Vidai                    |

### Cultural Context Injection Rules

When building the AI prompt, the engine generates the following cultural context string:

```
CULTURAL CONTEXT: This content should focus on [DOMINANT CULTURE] wedding traditions
and customs specific to [LOCATION]. Include references to [KEY TRADITIONS 1], [KEY TRADITIONS 2],
and [KEY TRADITIONS 3]. Mention local wedding foods like [LOCAL DISHES], popular wedding
attire including [ATTIRE], and traditional rituals unique to this region.
```

**Fallback rule**: If `cultural_context` is NULL in the database, generate:

```
CULTURAL CONTEXT: Cover all major Indian wedding traditions (Hindu, Muslim, Christian, Sikh)
with sensitivity and respect, while focusing on the most common practices in [LOCATION].
```

---

## Location Proximity Groups (for Internal Linking)

Locations are grouped into proximity clusters. Pages within the same group link to each other as "nearby wedding destinations."

| Group Name        | States/Locations Included                                                      |
| ----------------- | ------------------------------------------------------------------------------ |
| `north-india`     | J&K, Ladakh, HP, Punjab, Haryana, Delhi NCR, Chandigarh, Uttarakhand           |
| `west-india`      | Rajasthan, Gujarat, Maharashtra, Goa, Dadra & Nagar Haveli, Daman & Diu        |
| `central-india`   | MP, Chhattisgarh, UP (west)                                                    |
| `east-india`      | UP (east), Bihar, Jharkhand, West Bengal, Odisha                               |
| `south-india`     | Kerala, Tamil Nadu, Karnataka, AP, Telangana, Puducherry, Lakshadweep, Andaman |
| `northeast-india` | Assam, Arunachal, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, Tripura       |

### Proximity Linking Rules

- Each city page links to 2-3 other cities in the **same** proximity group
- Each city page links to 1-2 state-level pages in the **same** proximity group
- Tier 1 cities link to 1-2 other Tier 1 cities in **different** proximity groups (for authority flow)
- State pages link to all Tier 1 city pages within that state
- All Kerala district pages interlink with each other (minimum 3 cross-links per page)

---

## Wedding Seasonality by Location

The engine injects seasonal context into content. This table drives the `best_seasons` field in the AI prompt.

| Location Group | Peak Wedding Season | Shoulder Season  | Off-Season    | Rationale                                 |
| -------------- | ------------------- | ---------------- | ------------- | ----------------------------------------- |
| North India    | Oct-Mar             | Apr-Jun          | Jul-Sep       | Post-monsoon, winter weddings, exams      |
| South India    | Jun-Sep, Dec-May    | Oct-Nov          | Monsoon break | Monsoon weddings (Tamil), summer weddings |
| East India     | Nov-Apr             | May-Jun, Oct     | Jul-Sep       | Winter/spring weddings                    |
| West India     | Nov-Feb             | Mar-Jun, Sep-Oct | Jul-Aug       | Peak winter weddings                      |
| Northeast      | Oct-Apr             | May-Sep          | Monsoon       | Dry season weddings                       |
| Kerala         | Aug-Mar             | Apr-Jul          | Monsoon peak  | Onam season, post-monsoon                 |
| Maharashtra    | Nov-Feb             | Mar-May, Sep-Oct | Jun-Aug       | Winter weddings, Ganesh Chaturthi         |
| Bengaluru      | Dec-May             | Jun-Sep, Oct-Nov | Monsoon       | Pleasant weather year-round               |
| Delhi NCR      | Oct-Mar             | Apr-Jun, Sep     | Jul-Aug       | Extreme summer heat avoidance             |

---

## Database Schema — `wedding_locations`

```sql
CREATE TABLE wedding_locations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,              -- "Mumbai", "Kerala", "Ernakulam"
  slug TEXT NOT NULL UNIQUE,        -- "mumbai", "kerala", "ernakulam"
  type TEXT NOT NULL,               -- "city", "state", "union-territory", "district"
  state TEXT,                       -- "Maharashtra", "Kerala", NULL for UTs
  population INTEGER,               -- For prioritization and demographic context
  search_volume INTEGER,            -- Monthly searches for "[location] wedding"
  priority INTEGER DEFAULT 50,      -- 1-100 (100 = highest priority)
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  cultural_context TEXT,            -- "Marathi Hindu", "Kerala Christian", etc.
  proximity_group TEXT,             -- "south-india", "west-india", etc.
  dominant_religion TEXT,           -- "hindu", "muslim", "christian", "sikh", "mixed"
  wedding_season_start TEXT,        -- Month name, e.g., "November"
  wedding_season_end TEXT,          -- Month name, e.g., "March"
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_location_priority ON wedding_locations(priority DESC, search_volume DESC);
CREATE INDEX idx_location_state ON wedding_locations(state);
CREATE INDEX idx_location_type ON wedding_locations(type);
CREATE INDEX idx_location_proximity ON wedding_locations(proximity_group);
CREATE INDEX idx_location_slug ON wedding_locations(slug);
```

---

## SQL Seed Data

### Tier 1 Cities (Priority 100) — Metro Cities + Kerala Districts

```sql
-- Mumbai
INSERT INTO wedding_locations (name, slug, type, state, population, search_volume, priority, latitude, longitude, cultural_context, proximity_group, dominant_religion, wedding_season_start, wedding_season_end)
VALUES ('Mumbai', 'mumbai', 'city', 'Maharashtra', 20667656, 45000, 100, 19.0760, 72.8777, 'Marathi Hindu / Gujarati / Muslim', 'west-india', 'hindu', 'November', 'February');

-- Delhi NCR
INSERT INTO wedding_locations (name, slug, type, state, population, search_volume, priority, latitude, longitude, cultural_context, proximity_group, dominant_religion, wedding_season_start, wedding_season_end)
VALUES ('Delhi NCR', 'delhi-ncr', 'city', 'Delhi', 31280000, 42000, 100, 28.7041, 77.1025, 'North Indian Hindu / Sikh / Muslim', 'north-india', 'mixed', 'October', 'March');

-- Bengaluru
INSERT INTO wedding_locations (name, slug, type, state, population, search_volume, priority, latitude, longitude, cultural_context, proximity_group, dominant_religion, wedding_season_start, wedding_season_end)
VALUES ('Bengaluru', 'bengaluru', 'city', 'Karnataka', 12426000, 35000, 100, 12.9716, 77.5946, 'Kannadiga Hindu / Tamil / Christian', 'south-india', 'hindu', 'December', 'May');

-- Hyderabad
INSERT INTO wedding_locations (name, slug, type, state, population, search_volume, priority, latitude, longitude, cultural_context, proximity_group, dominant_religion, wedding_season_start, wedding_season_end)
VALUES ('Hyderabad', 'hyderabad', 'city', 'Telangana', 10350000, 30000, 100, 17.3850, 78.4867, 'Telugu Hindu / Muslim', 'south-india', 'hindu', 'November', 'April');

-- Chennai
INSERT INTO wedding_locations (name, slug, type, state, population, search_volume, priority, latitude, longitude, cultural_context, proximity_group, dominant_religion, wedding_season_start, wedding_season_end)
VALUES ('Chennai', 'chennai', 'city', 'Tamil Nadu', 11235000, 28000, 100, 13.0827, 80.2707, 'Tamil Hindu / Christian', 'south-india', 'hindu', 'June', 'March');

-- Kolkata
INSERT INTO wedding_locations (name, slug, type, state, population, search_volume, priority, latitude, longitude, cultural_context, proximity_group, dominant_religion, wedding_season_start, wedding_season_end)
VALUES ('Kolkata', 'kolkata', 'city', 'West Bengal', 14980000, 25000, 100, 22.5726, 88.3639, 'Bengali Hindu / Muslim', 'east-india', 'hindu', 'November', 'March');

-- Pune
INSERT INTO wedding_locations (name, slug, type, state, population, search_volume, priority, latitude, longitude, cultural_context, proximity_group, dominant_religion, wedding_season_start, wedding_season_end)
VALUES ('Pune', 'pune', 'city', 'Maharashtra', 6487000, 20000, 100, 18.5204, 73.8567, 'Marathi Hindu', 'west-india', 'hindu', 'November', 'February');

-- Ahmedabad
INSERT INTO wedding_locations (name, slug, type, state, population, search_volume, priority, latitude, longitude, cultural_context, proximity_group, dominant_religion, wedding_season_start, wedding_season_end)
VALUES ('Ahmedabad', 'ahmedabad', 'city', 'Gujarat', 7724000, 18000, 100, 23.0225, 72.5714, 'Gujarati Hindu', 'west-india', 'hindu', 'November', 'February');

-- Kerala state-level entry
INSERT INTO wedding_locations (name, slug, type, state, population, search_volume, priority, latitude, longitude, cultural_context, proximity_group, dominant_religion, wedding_season_start, wedding_season_end)
VALUES ('Kerala', 'kerala', 'state', NULL, 35100000, 40000, 100, 10.8505, 76.2711, 'Kerala Hindu / Christian / Muslim', 'south-india', 'mixed', 'August', 'March');
```

### Kerala Districts (Priority 100 — all treated as Tier 1)

```sql
-- Thiruvananthapuram
INSERT INTO wedding_locations (name, slug, type, state, population, search_volume, priority, latitude, longitude, cultural_context, proximity_group, dominant_religion, wedding_season_start, wedding_season_end)
VALUES ('Thiruvananthapuram', 'thiruvananthapuram', 'city', 'Kerala', 3074000, 8000, 100, 8.5241, 76.9366, 'Kerala Hindu / Christian', 'south-india', 'hindu', 'August', 'March');

-- Kollam
INSERT INTO wedding_locations (name, slug, type, state, population, search_volume, priority, latitude, longitude, cultural_context, proximity_group, dominant_religion, wedding_season_start, wedding_season_end)
VALUES ('Kollam', 'kollam', 'city', 'Kerala', 2626000, 4000, 100, 8.8932, 76.6141, 'Kerala Hindu / Christian', 'south-india', 'hindu', 'August', 'March');

-- Pathanamthitta
INSERT INTO wedding_locations (name, slug, type, state, population, search_volume, priority, latitude, longitude, cultural_context, proximity_group, dominant_religion, wedding_season_start, wedding_season_end)
VALUES ('Pathanamthitta', 'pathanamthitta', 'city', 'Kerala', 1197000, 2500, 100, 9.2647, 76.7866, 'Kerala Hindu / Christian', 'south-india', 'hindu', 'August', 'March');

-- Alappuzha
INSERT INTO wedding_locations (name, slug, type, state, population, search_volume, priority, latitude, longitude, cultural_context, proximity_group, dominant_religion, wedding_season_start, wedding_season_end)
VALUES ('Alappuzha', 'alappuzha', 'city', 'Kerala', 2124000, 5000, 100, 9.4981, 76.3388, 'Kerala Christian / Hindu', 'south-india', 'christian', 'August', 'March');

-- Kottayam
INSERT INTO wedding_locations (name, slug, type, state, population, search_volume, priority, latitude, longitude, cultural_context, proximity_group, dominant_religion, wedding_season_start, wedding_season_end)
VALUES ('Kottayam', 'kottayam', 'city', 'Kerala', 1974000, 4500, 100, 9.5916, 76.5222, 'Kerala Christian / Hindu', 'south-india', 'christian', 'August', 'March');

-- Idukki
INSERT INTO wedding_locations (name, slug, type, state, population, search_volume, priority, latitude, longitude, cultural_context, proximity_group, dominant_religion, wedding_season_start, wedding_season_end)
VALUES ('Idukki', 'idukki', 'city', 'Kerala', 1101000, 2000, 100, 9.8499, 76.9803, 'Kerala Hindu / Christian', 'south-india', 'hindu', 'August', 'March');

-- Ernakulam (Kochi)
INSERT INTO wedding_locations (name, slug, type, state, population, search_volume, priority, latitude, longitude, cultural_context, proximity_group, dominant_religion, wedding_season_start, wedding_season_end)
VALUES ('Ernakulam', 'ernakulam', 'city', 'Kerala', 3279000, 12000, 100, 9.9816, 76.2999, 'Kerala Christian / Hindu / Jewish heritage', 'south-india', 'christian', 'August', 'March');

-- Thrissur
INSERT INTO wedding_locations (name, slug, type, state, population, search_volume, priority, latitude, longitude, cultural_context, proximity_group, dominant_religion, wedding_season_start, wedding_season_end)
VALUES ('Thrissur', 'thrissur', 'city', 'Kerala', 3141000, 7000, 100, 10.5276, 76.2144, 'Kerala Hindu', 'south-india', 'hindu', 'August', 'March');

-- Palakkad
INSERT INTO wedding_locations (name, slug, type, state, population, search_volume, priority, latitude, longitude, cultural_context, proximity_group, dominant_religion, wedding_season_start, wedding_season_end)
VALUES ('Palakkad', 'palakkad', 'city', 'Kerala', 2810000, 3500, 100, 10.7690, 76.6544, 'Kerala Hindu', 'south-india', 'hindu', 'August', 'March');

-- Malappuram
INSERT INTO wedding_locations (name, slug, type, state, population, search_volume, priority, latitude, longitude, cultural_context, proximity_group, dominant_religion, wedding_season_start, wedding_season_end)
VALUES ('Malappuram', 'malappuram', 'city', 'Kerala', 4116000, 3000, 100, 11.0510, 76.0711, 'Muslim / Kerala Hindu', 'south-india', 'muslim', 'August', 'March');

-- Kozhikode (Calicut)
INSERT INTO wedding_locations (name, slug, type, state, population, search_volume, priority, latitude, longitude, cultural_context, proximity_group, dominant_religion, wedding_season_start, wedding_season_end)
VALUES ('Kozhikode', 'kozhikode', 'city', 'Kerala', 3089000, 8000, 100, 11.2588, 75.7804, 'Muslim / Kerala Hindu', 'south-india', 'muslim', 'August', 'March');

-- Wayanad
INSERT INTO wedding_locations (name, slug, type, state, population, search_volume, priority, latitude, longitude, cultural_context, proximity_group, dominant_religion, wedding_season_start, wedding_season_end)
VALUES ('Wayanad', 'wayanad', 'city', 'Kerala', 846000, 2000, 100, 11.6854, 76.1322, 'Kerala Hindu / Christian', 'south-india', 'hindu', 'August', 'March');

-- Kannur
INSERT INTO wedding_locations (name, slug, type, state, population, search_volume, priority, latitude, longitude, cultural_context, proximity_group, dominant_religion, wedding_season_start, wedding_season_end)
VALUES ('Kannur', 'kannur', 'city', 'Kerala', 2615000, 4500, 100, 11.8745, 75.3704, 'Kerala Hindu / Christian', 'south-india', 'hindu', 'August', 'March');

-- Kasaragod
INSERT INTO wedding_locations (name, slug, type, state, population, search_volume, priority, latitude, longitude, cultural_context, proximity_group, dominant_religion, wedding_season_start, wedding_season_end)
VALUES ('Kasaragod', 'kasargod', 'city', 'Kerala', 1310000, 2000, 100, 12.4992, 74.9871, 'Kerala Hindu / Muslim', 'south-india', 'hindu', 'August', 'March');
```

### Tier 2 Cities (Priority 75)

```sql
INSERT INTO wedding_locations (name, slug, type, state, population, search_volume, priority, cultural_context, proximity_group, dominant_religion, wedding_season_start, wedding_season_end)
VALUES
('Jaipur', 'jaipur', 'city', 'Rajasthan', 3820000, 15000, 75, 'Rajput Hindu / Marwari', 'west-india', 'hindu', 'October', 'March'),
('Lucknow', 'lucknow', 'city', 'Uttar Pradesh', 3620000, 12000, 75, 'North Indian Hindu / Muslim', 'north-india', 'hindu', 'November', 'March'),
('Surat', 'surat', 'city', 'Gujarat', 4690000, 10000, 75, 'Gujarati Hindu', 'west-india', 'hindu', 'November', 'February'),
('Indore', 'indore', 'city', 'Madhya Pradesh', 2470000, 9000, 75, 'Central Indian Hindu', 'central-india', 'hindu', 'October', 'March'),
('Nagpur', 'nagpur', 'city', 'Maharashtra', 2790000, 8500, 75, 'Marathi Hindu', 'west-india', 'hindu', 'November', 'March'),
('Visakhapatnam', 'visakhapatnam', 'city', 'Andhra Pradesh', 1750000, 8000, 75, 'Telugu Hindu', 'south-india', 'hindu', 'December', 'May');
```

### Tier 3 Cities (Priority 50) — Batch Insert

```sql
INSERT INTO wedding_locations (name, slug, type, state, priority, proximity_group, dominant_religion, wedding_season_start, wedding_season_end)
VALUES
('Kanpur', 'kanpur', 'city', 'Uttar Pradesh', 50, 'north-india', 'hindu', 'November', 'March'),
('Thane', 'thane', 'city', 'Maharashtra', 50, 'west-india', 'hindu', 'November', 'February'),
('Bhopal', 'bhopal', 'city', 'Madhya Pradesh', 50, 'central-india', 'hindu', 'October', 'March'),
('Patna', 'patna', 'city', 'Bihar', 50, 'east-india', 'hindu', 'November', 'April'),
('Vadodara', 'vadodara', 'city', 'Gujarat', 50, 'west-india', 'hindu', 'November', 'February'),
('Ghaziabad', 'ghaziabad', 'city', 'Uttar Pradesh', 50, 'north-india', 'hindu', 'October', 'March'),
('Ludhiana', 'ludhiana', 'city', 'Punjab', 50, 'north-india', 'sikh', 'October', 'February'),
('Coimbatore', 'coimbatore', 'city', 'Tamil Nadu', 50, 'south-india', 'hindu', 'June', 'March'),
('Agra', 'agra', 'city', 'Uttar Pradesh', 50, 'north-india', 'hindu', 'October', 'March'),
('Madurai', 'madurai', 'city', 'Tamil Nadu', 50, 'south-india', 'hindu', 'June', 'March'),
('Nashik', 'nashik', 'city', 'Maharashtra', 50, 'west-india', 'hindu', 'November', 'February'),
('Faridabad', 'faridabad', 'city', 'Haryana', 50, 'north-india', 'hindu', 'October', 'March'),
('Meerut', 'meerut', 'city', 'Uttar Pradesh', 50, 'north-india', 'hindu', 'October', 'March'),
('Rajkot', 'rajkot', 'city', 'Gujarat', 50, 'west-india', 'hindu', 'November', 'February'),
('Varanasi', 'varanasi', 'city', 'Uttar Pradesh', 50, 'north-india', 'hindu', 'October', 'March'),
('Srinagar', 'srinagar', 'city', 'Jammu and Kashmir', 50, 'north-india', 'muslim', 'March', 'October'),
('Aurangabad', 'aurangabad', 'city', 'Maharashtra', 50, 'west-india', 'hindu', 'November', 'February'),
('Amritsar', 'amritsar', 'city', 'Punjab', 50, 'north-india', 'sikh', 'October', 'February'),
('Allahabad', 'allahabad', 'city', 'Uttar Pradesh', 50, 'north-india', 'hindu', 'October', 'March'),
('Ranchi', 'ranchi', 'city', 'Jharkhand', 50, 'east-india', 'hindu', 'November', 'April'),
('Howrah', 'howrah', 'city', 'West Bengal', 50, 'east-india', 'hindu', 'November', 'March'),
('Jabalpur', 'jabalpur', 'city', 'Madhya Pradesh', 50, 'central-india', 'hindu', 'October', 'March'),
('Gwalior', 'gwalior', 'city', 'Madhya Pradesh', 50, 'central-india', 'hindu', 'October', 'March'),
('Vijayawada', 'vijayawada', 'city', 'Andhra Pradesh', 50, 'south-india', 'hindu', 'December', 'May'),
('Jodhpur', 'jodhpur', 'city', 'Rajasthan', 50, 'west-india', 'hindu', 'October', 'March'),
('Raipur', 'raipur', 'city', 'Chhattisgarh', 50, 'central-india', 'hindu', 'October', 'March'),
('Kota', 'kota', 'city', 'Rajasthan', 50, 'west-india', 'hindu', 'October', 'March'),
('Guwahati', 'guwahati', 'city', 'Assam', 50, 'northeast-india', 'hindu', 'November', 'April'),
('Chandigarh', 'chandigarh', 'city', 'Chandigarh', 50, 'north-india', 'mixed', 'October', 'March'),
('Solapur', 'solapur', 'city', 'Maharashtra', 50, 'west-india', 'hindu', 'November', 'February'),
('Mysuru', 'mysuru', 'city', 'Karnataka', 50, 'south-india', 'hindu', 'December', 'May'),
('Bareilly', 'bareilly', 'city', 'Uttar Pradesh', 50, 'north-india', 'hindu', 'October', 'March'),
('Tiruchirappalli', 'tiruchirappalli', 'city', 'Tamil Nadu', 50, 'south-india', 'hindu', 'June', 'March');
```

### State-Level Entries (Priority 40)

```sql
INSERT INTO wedding_locations (name, slug, type, state, priority, proximity_group, dominant_religion, wedding_season_start, wedding_season_end)
VALUES
('Andhra Pradesh', 'andhra-pradesh', 'state', NULL, 40, 'south-india', 'hindu', 'December', 'May'),
('Arunachal Pradesh', 'arunachal-pradesh', 'state', NULL, 40, 'northeast-india', 'buddhist', 'October', 'April'),
('Assam', 'assam', 'state', NULL, 40, 'northeast-india', 'hindu', 'November', 'April'),
('Bihar', 'bihar', 'state', NULL, 40, 'east-india', 'hindu', 'November', 'April'),
('Chhattisgarh', 'chhattisgarh', 'state', NULL, 40, 'central-india', 'hindu', 'October', 'March'),
('Goa', 'goa', 'state', NULL, 40, 'west-india', 'christian', 'November', 'April'),
('Gujarat', 'gujarat', 'state', NULL, 40, 'west-india', 'hindu', 'November', 'February'),
('Haryana', 'haryana', 'state', NULL, 40, 'north-india', 'hindu', 'October', 'March'),
('Himachal Pradesh', 'himachal-pradesh', 'state', NULL, 40, 'north-india', 'hindu', 'March', 'June'),
('Jharkhand', 'jharkhand', 'state', NULL, 40, 'east-india', 'hindu', 'November', 'April'),
('Karnataka', 'karnataka', 'state', NULL, 40, 'south-india', 'hindu', 'December', 'May'),
('Madhya Pradesh', 'madhya-pradesh', 'state', NULL, 40, 'central-india', 'hindu', 'October', 'March'),
('Maharashtra', 'maharashtra', 'state', NULL, 40, 'west-india', 'hindu', 'November', 'February'),
('Manipur', 'manipur', 'state', NULL, 40, 'northeast-india', 'hindu', 'October', 'April'),
('Meghalaya', 'meghalaya', 'state', NULL, 40, 'northeast-india', 'christian', 'October', 'April'),
('Mizoram', 'mizoram', 'state', NULL, 40, 'northeast-india', 'christian', 'October', 'April'),
('Nagaland', 'nagaland', 'state', NULL, 40, 'northeast-india', 'christian', 'October', 'April'),
('Odisha', 'odisha', 'state', NULL, 40, 'east-india', 'hindu', 'November', 'April'),
('Punjab', 'punjab', 'state', NULL, 40, 'north-india', 'sikh', 'October', 'February'),
('Rajasthan', 'rajasthan', 'state', NULL, 40, 'west-india', 'hindu', 'October', 'March'),
('Sikkim', 'sikkim', 'state', NULL, 40, 'northeast-india', 'buddhist', 'October', 'April'),
('Tamil Nadu', 'tamil-nadu', 'state', NULL, 40, 'south-india', 'hindu', 'June', 'March'),
('Telangana', 'telangana', 'state', NULL, 40, 'south-india', 'hindu', 'November', 'April'),
('Tripura', 'tripura', 'state', NULL, 40, 'northeast-india', 'hindu', 'October', 'April'),
('Uttar Pradesh', 'uttar-pradesh', 'state', NULL, 40, 'north-india', 'hindu', 'October', 'March'),
('Uttarakhand', 'uttarakhand', 'state', NULL, 40, 'north-india', 'hindu', 'March', 'June'),
('West Bengal', 'west-bengal', 'state', NULL, 40, 'east-india', 'hindu', 'November', 'March');
```

### Union Territory Entries (Priority 40)

```sql
INSERT INTO wedding_locations (name, slug, type, state, priority, proximity_group, dominant_religion, wedding_season_start, wedding_season_end)
VALUES
('Andaman and Nicobar Islands', 'andaman-and-nicobar-islands', 'union-territory', NULL, 40, 'south-india', 'mixed', 'October', 'May'),
('Chandigarh', 'chandigarh', 'union-territory', NULL, 40, 'north-india', 'mixed', 'October', 'March'),
('Dadra and Nagar Haveli and Daman and Diu', 'dadra-and-nagar-haveli-daman-diu', 'union-territory', NULL, 40, 'west-india', 'hindu', 'November', 'February'),
('Lakshadweep', 'lakshadweep', 'union-territory', NULL, 40, 'south-india', 'muslim', 'October', 'March'),
('Puducherry', 'puducherry', 'union-territory', NULL, 40, 'south-india', 'hindu', 'June', 'March'),
('Jammu and Kashmir', 'jammu-and-kashmir', 'union-territory', NULL, 40, 'north-india', 'muslim', 'March', 'October'),
('Ladakh', 'ladakh', 'union-territory', NULL, 40, 'north-india', 'buddhist', 'May', 'September');
```

---

## URL Structure Governance

### Pattern

```
https://wedinviter.wasleen.com/[pillar-slug]/[location-slug]/[subtopic-slug]
```

### Examples

| Pillar              | Location  | Subtopic            | URL                                               |
| ------------------- | --------- | ------------------- | ------------------------------------------------- |
| Wedding Invitations | Mumbai    | Digital Invitations | `/wedding-invitations/mumbai/digital-invitations` |
| Wedding Venues      | Kochi     | Banquet Halls       | `/wedding-venues/kochi/banquet-halls`             |
| Bridal Fashion      | Bengaluru | Lehengas            | `/bridal-fashion/bengaluru/lehengas`              |
| Wedding Planning    | Delhi NCR | Budget              | `/wedding-planning/delhi-ncr/budget`              |
| Photography         | Kerala    | Traditional         | `/photography/kerala/traditional`                 |
| Wedding Rituals     | Kolkata   | Bengali Traditions  | `/wedding-rituals/kolkata/bengali-traditions`     |
| Catering            | Hyderabad | Mughlai             | `/catering/hyderabad/mughlai`                     |

### Canonical Slug Rules

- Use **city-level slug** for city pages (e.g., `kochi` NOT `ernakulam` — though both are valid, pick one canonical)
- Use **state slug** for state-level pages (e.g., `kerala` for `/wedding-invitations/kerala/`)
- Use **slug from the table above** as the canonical; set up 301 redirects from alternate slugs
- All slugs must be lowercase, hyphen-separated, URL-encoded

---

## Location Injection into AI Prompts

When the content generator fetches a queue item, the localization engine enriches the prompt with location-specific data. The following fields are injected:

### Prompt Injection Template

```typescript
function buildLocalizedPrompt(item: QueueItem, location: LocationData): string {
  return `
You are writing about "${item.topic_name}" specifically for couples in **${location.name}**, ${location.state || ""}.

LOCATION: ${location.name}
STATE: ${location.state || "N/A"}
TYPE: ${location.type}
POPULATION: ${location.population ? location.population.toLocaleString() : "N/A"}
WEDDING SEASON: ${location.wedding_season_start || "N/A"} to ${location.wedding_season_end || "N/A"}
CULTURAL CONTEXT: ${location.cultural_context || "Mixed Indian traditions"}
DOMINANT RELIGION: ${location.dominant_religion || "Mixed"}

CRITICAL REQUIREMENTS:
1. Include 10-15 SPECIFIC details about ${location.name} (neighborhoods, landmarks, venues, local customs)
2. Reference the wedding season (${location.wedding_season_start || "peak"} to ${location.wedding_season_end || "peak"})
3. Mention ${location.cultural_context || "local"} wedding traditions and rituals
4. Use price ranges accurate for ${location.name} market
5. Include 2-3 nearby venues or landmarks specific to ${location.name}
6. If applicable, mention diaspora-related details (e.g., NRI weddings for Kerala, Punjab)
`;
}
```

### Location-Specific Content Requirements by Type

| Location Type     | Content Requirements                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------- |
| `city`            | Mention 3-5 neighborhoods, 2-3 landmark venues, local price ranges, nearby cities for comparison      |
| `district`        | Mention district headquarters, major towns within district, cultural festivals, local specialties     |
| `state`           | Mention 5-7 major cities within state, state-wide wedding traditions, regional cuisine, climate zones |
| `union-territory` | Mention unique cultural blend, tourist venues, diaspora wedding trends, legal considerations          |

---

## Location-Based LocalBusiness Schema

For each city page, the engine generates a `LocalBusiness` JSON-LD block using the location's coordinates and name:

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "WedInviter - [City], [State]",
  "image": "https://wedinviter.wasleen.com/logo.png",
  "url": "https://wedinviter.wasleen.com/[pillar]/[location-slug]/",
  "telephone": "[Contact Number]",
  "priceRange": "₹₹",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "[City]",
    "addressRegion": "[State]",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": [location.latitude],
    "longitude": [location.longitude]
  },
  "areaServed": {
    "@type": "City",
    "name": "[City]"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "2500"
  }
}
```

**Rule**: The `LocalBusiness` schema is ONLY generated for Tier 1 and Tier 2 cities. State-level and Tier 3 pages skip this schema to avoid over-optimization penalties.

---

## Error Handling & Validation

### Location Not Found

If a queue item references a location slug that doesn't exist in `wedding_locations`:

1. Log error to `generation_logs` with status `failed` and error `LOCATION_NOT_FOUND`
2. Skip the queue item (do NOT generate content)
3. Flag for manual review — the location may need to be added to the database

### Duplicate Slug

If a duplicate slug is detected during seeding:

1. Use `ON CONFLICT (slug) DO UPDATE` to update existing row
2. Log the conflict to generation_logs
3. Do NOT create duplicate entries

### Missing Cultural Context

If `cultural_context` is NULL for a location:

1. Fall back to the `dominant_religion` field
2. If both are NULL, use the generic fallback prompt
3. Log a warning to generation_logs for manual enrichment

### Validation Rules

- All Tier 1 locations MUST have non-NULL `latitude`, `longitude`, `cultural_context`, `proximity_group`
- All locations MUST have a unique `slug` (enforced by UNIQUE constraint)
- `priority` MUST be one of: 100, 75, 50, 40
- `type` MUST be one of: `"city"`, `"state"`, `"union-territory"`, `"district"`
- `proximity_group` MUST be one of: `"north-india"`, `"west-india"`, `"central-india"`, `"east-india"`, `"south-india"`, `"northeast-india"`

---

## Location Data Operations

### Fetch All Locations for Queue Generation

```typescript
async function fetchLocationsForQueue(
  supabase: SupabaseClient,
): Promise<LocationData[]> {
  const { data, error } = await supabase
    .from("wedding_locations")
    .select("*")
    .order("priority", { ascending: false })
    .order("search_volume", { ascending: false });

  if (error) throw error;
  return data;
}
```

### Fetch Location for a Specific Queue Item

```typescript
async function fetchLocationBySlug(
  supabase: SupabaseClient,
  slug: string,
): Promise<LocationData | null> {
  const { data, error } = await supabase
    .from("wedding_locations")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}
```

### Get Proximity Group Locations (for Internal Linking)

```typescript
async function fetchNearbyLocations(
  supabase: SupabaseClient,
  location: LocationData,
): Promise<LocationData[]> {
  const { data, error } = await supabase
    .from("wedding_locations")
    .select("*")
    .eq("proximity_group", location.proximity_group)
    .neq("slug", location.slug)
    .order("priority", { ascending: false })
    .limit(5);

  if (error) return [];
  return data;
}
```

### Batch Seed Locations

```typescript
async function seedLocations(
  supabase: SupabaseClient,
  locations: LocationSeed[],
): Promise<void> {
  const { error } = await supabase
    .from("wedding_locations")
    .upsert(locations, { onConflict: "slug" });

  if (error) throw error;
  console.log(`✅ Seeded ${locations.length} locations`);
}
```

---

## Quality Evaluation for Location Data

The localization engine's quality is measured across these dimensions:

| Dimension         | Weight | Target    | Description                                                          |
| ----------------- | ------ | --------- | -------------------------------------------------------------------- |
| Location Coverage | 25%    | 136/136   | All states, UTs, and cities are present in the database              |
| Data Accuracy     | 25%    | 100%      | All coordinates, populations, and cultural contexts are accurate     |
| Prompt Injection  | 20%    | >90%      | AI-generated content includes 10+ location-specific details per page |
| SEO Impact        | 20%    | Top 10    | Location pages rank in top 10 for `[service] in [city]` queries      |
| Freshness         | 10%    | Quarterly | Location data reviewed and updated every 3 months                    |

---

## Output File Structure

When the localization engine processes a location, it produces:

```json
{
  "location": {
    "name": "Ernakulam",
    "slug": "ernakulam",
    "type": "city",
    "state": "Kerala",
    "priority": 100,
    "cultural_context": "Kerala Christian / Hindu / Jewish heritage",
    "proximity_group": "south-india"
  },
  "prompt_injection": {
    "neighborhoods": ["Fort Kochi", "Marine Drive", "Kakkanad", "Edapally", "Aluva"],
    "venues": ["Bolgatty Palace", "Brunton Boatyard", "Grand Hyatt Kochi", "Lulu Convention Hall"],
    "price_range": "₹5,00,000 - ₹25,00,000",
    "season": "August to March",
    "traditions": ["Kerala Christian wedding mass", "Hindu thali tying", "Sadya feast"]
  },
  "url": "/wedding-invitations/ernakulam/digital-invitations",
  "schema": { ... LocalBusiness JSON-LD ... },
  "nearby_locations": ["Thrissur", "Kottayam", "Alappuzha", "Kozhikode", "Kollam"],
  "state_location": "kerala"
}
```
