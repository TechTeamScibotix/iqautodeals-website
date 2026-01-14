# IQ Auto Deals - AI Phone Answering Service

## Overview

An AI-powered phone answering service for IQ Auto Deals that handles:
- **Car Buyers**: Answer vehicle questions, capture leads, transfer to dealers
- **Dealers**: Answer support questions, account help, inventory sync issues

**Phone Number**: 1-800-IQ-DEALS (or new dedicated number)

---

## Recommended Platform: Bland.ai

### Why Bland.ai?

| Factor | Bland.ai | Vapi.ai | Custom (Twilio+OpenAI) |
|--------|----------|---------|------------------------|
| Cost/min | **$0.09** | $0.30-0.33 | $0.32-0.35 |
| Setup Time | Hours | Hours | Days/Weeks |
| Call Transfer | ✅ | ✅ | ✅ (complex) |
| Knowledge Base | ✅ | ✅ | Custom build |
| Lead Capture | ✅ | ✅ | Custom build |
| Free Trial | ✅ $5 credits | ✅ $10 credits | Pay-as-you-go |

**At 1000 minutes/month**:
- Bland.ai: **$90/month**
- Vapi.ai: $300-330/month
- Custom: $320-350/month

---

## AI Agent Design

### Agent 1: Car Buyer Line

**Purpose**: Help customers find vehicles, answer questions, capture leads, transfer to dealers

**Greeting**:
> "Thank you for calling IQ Auto Deals, the smart way to buy your next car. I'm your AI assistant. Are you looking to buy a car, or do you have questions about how IQ Auto Deals works?"

**Capabilities**:

1. **Answer Questions About IQ Auto Deals**
   - How the platform works
   - How to compare vehicles (up to 4)
   - How dealer offers work
   - Pricing and fees (free for buyers)
   - Coverage area (all 50 states)

2. **Vehicle Search** (via API)
   - "What kind of vehicle are you looking for?"
   - Search by: make, model, year, price range, location
   - Provide matches: "I found 3 Ford F-150s under $35,000 in Georgia"

3. **Lead Capture**
   - Collect: name, phone, email, vehicle interest
   - "Can I get your name and phone number so a dealer can reach out with their best offer?"
   - POST to `/api/iqautodeals/leads`

4. **Transfer to Dealer**
   - "I can connect you directly to the dealer who has this vehicle. Would you like me to transfer you?"
   - Warm transfer with context

**Knowledge Base Topics**:
- How IQ Auto Deals works (compare vehicles, get dealer offers)
- Savings claims (up to $5,000)
- No fees for buyers
- Dealer verification process
- Test drive scheduling
- FAQ content (25+ Q&A from website)

---

### Agent 2: Dealer Support Line

**Purpose**: Help certified dealers with account and platform issues

**Greeting**:
> "Thank you for calling IQ Auto Deals dealer support. I'm your AI assistant. How can I help you today?"

**Capabilities**:

1. **Account Questions**
   - Login issues
   - Password reset (send reset email)
   - Verification status
   - Billing questions

2. **Inventory Help**
   - How to list vehicles
   - Sync issues with Scibotix
   - Photo requirements
   - Pricing guidance

3. **Lead & Deal Questions**
   - How to respond to customer requests
   - Offer strategies
   - Deal status inquiries

4. **Escalation**
   - Transfer to human support for complex issues
   - Create support ticket

---

## Technical Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Incoming Call                         │
│                   1-800-IQ-DEALS                         │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    Bland.ai                              │
│                                                          │
│  • Speech-to-Text (realtime)                            │
│  • LLM Processing (GPT-4 / Claude)                      │
│  • Text-to-Speech (natural voice)                       │
│  • Call routing logic                                   │
└─────────────────────┬───────────────────────────────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
         ▼            ▼            ▼
┌─────────────┐ ┌──────────┐ ┌─────────────┐
│ Webhook API │ │ Transfer │ │ Knowledge   │
│ (Lead       │ │ to       │ │ Base        │
│ Capture)    │ │ Dealer   │ │ (FAQ/Docs)  │
└─────────────┘ └──────────┘ └─────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│              IQ Auto Deals Backend                       │
│              (scibotixsolutions.com)                     │
│                                                          │
│  POST /api/iqautodeals/leads                            │
│  POST /api/iqautodeals/phone-leads                      │
│  GET  /api/iqautodeals/vehicles/search                  │
└─────────────────────────────────────────────────────────┘
```

---

## Implementation Steps

### Phase 1: Setup Bland.ai Account

1. Sign up at https://www.bland.ai
2. Get API key
3. Configure phone number (or use existing)
4. Set up webhook endpoints

### Phase 2: Create Knowledge Base

**File**: `knowledge_base.md` - Upload to Bland.ai

```markdown
# IQ Auto Deals Knowledge Base

## About IQ Auto Deals
IQ Auto Deals is a nationwide online car marketplace that connects car buyers
with certified dealers. We're a technology platform, NOT a car dealership.

### How It Works for Buyers
1. Browse thousands of vehicles from certified dealers
2. Compare up to 4 vehicles side-by-side
3. Request offers from dealers
4. Dealers compete for your business
5. Save up to $5,000 compared to traditional buying

### Key Facts
- **Coverage**: All 50 US states
- **Cost to Buyers**: FREE - no fees ever
- **Languages**: English and Spanish
- **Founded**: 2024
- **Headquarters**: Atlanta, GA
- **Contact**: support@iqautodeals.com

## Frequently Asked Questions

### Q: How much car can I afford?
A: Use the 20/4/10 rule: 20% down payment, 4-year loan max,
   monthly payment under 10% of gross income.

### Q: What credit score do I need?
A: You can get approved with various credit scores:
   - 750+: Excellent rates (3-5% APR)
   - 700-749: Good rates (5-7% APR)
   - 650-699: Fair rates (7-10% APR)
   - 600-649: Higher rates (10-15% APR)
   - Below 600: Subprime options available

### Q: Should I buy new or used?
A: For first-time buyers, certified pre-owned often offers
   the best value - lower price with warranty protection.

### Q: What hidden costs should I budget for?
A: Plan for: sales tax (varies by state), registration fees,
   insurance, and maintenance ($50-100/month).

[... additional FAQ content ...]
```

### Phase 3: Create AI Agent Prompts

**Buyer Agent System Prompt**:

```
You are the IQ Auto Deals AI phone assistant helping car buyers.

PERSONALITY:
- Friendly, helpful, and knowledgeable about cars
- Professional but conversational
- Enthusiastic about helping people find their perfect car

GOALS:
1. Answer questions about IQ Auto Deals and the car buying process
2. Help customers find vehicles that match their needs
3. Capture lead information (name, phone, email, vehicle interest)
4. Transfer to dealers when appropriate

RULES:
- Never make up vehicle information - use the search API
- Always offer to capture their info for dealer follow-up
- If they want to speak to a human, offer to transfer
- Keep responses concise (phone conversations should be brief)
- Confirm information before submitting leads

INFORMATION ABOUT IQ AUTO DEALS:
- We are a MARKETPLACE that connects buyers with dealers
- We are NOT a car dealership ourselves
- Buyers pay nothing - our service is free
- Dealers compete for business, which saves buyers money
- We operate in all 50 US states

AVAILABLE ACTIONS:
1. search_vehicles(make, model, year_min, year_max, price_max, state, city)
2. capture_lead(name, phone, email, vehicle_interest, notes)
3. transfer_to_dealer(dealer_phone, customer_name, vehicle_info)
4. send_sms(phone, message) - send vehicle links via text
```

**Dealer Agent System Prompt**:

```
You are the IQ Auto Deals dealer support AI assistant.

PERSONALITY:
- Professional and efficient
- Knowledgeable about the dealer portal and platform
- Patient with technical issues

GOALS:
1. Help dealers with account issues
2. Answer questions about the platform
3. Troubleshoot common problems
4. Escalate complex issues to human support

COMMON ISSUES:
- Login problems → Offer password reset
- Inventory sync issues → Check Scibotix connection
- Photo upload problems → Check format/size requirements
- Lead questions → Explain how to respond to deal requests
- Billing inquiries → Transfer to billing team

AVAILABLE ACTIONS:
1. send_password_reset(email)
2. check_account_status(email)
3. create_support_ticket(dealer_id, issue_type, description)
4. transfer_to_support(issue_type)
```

### Phase 4: Build Webhook Endpoints

**New API Endpoint**: `/api/phone/lead-capture`

```typescript
// app/api/phone/lead-capture/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      caller_phone,
      caller_name,
      caller_email,
      vehicle_interest,
      notes,
      call_id,
      call_duration,
    } = body;

    // Create or find contact
    let contact = await prisma.contact.findFirst({
      where: {
        OR: [
          { phone: caller_phone },
          { email: caller_email },
        ],
      },
    });

    if (!contact) {
      contact = await prisma.contact.create({
        data: {
          firstName: caller_name?.split(' ')[0] || 'Unknown',
          lastName: caller_name?.split(' ').slice(1).join(' ') || '',
          phone: caller_phone,
          email: caller_email,
          source: 'PHONE_AI',
        },
      });
    }

    // Create lead
    const lead = await prisma.lead.create({
      data: {
        contactId: contact.id,
        source: 'PHONE_AI',
        sourceDetails: `AI Phone Call (${call_id})`,
        vehicleInterest: vehicle_interest,
        notes: notes,
        status: 'NEW',
        temperature: 'HOT',
        score: 75, // Phone leads are high intent
      },
    });

    // Log the call
    await prisma.callLog.create({
      data: {
        callId: call_id,
        leadId: lead.id,
        duration: call_duration,
        outcome: 'LEAD_CAPTURED',
      },
    });

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Lead captured successfully'
    });

  } catch (error) {
    console.error('Phone lead capture error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to capture lead' },
      { status: 500 }
    );
  }
}
```

**Vehicle Search Endpoint**: `/api/phone/vehicle-search`

```typescript
// app/api/phone/vehicle-search/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { make, model, year_min, year_max, price_max, state, city } = await req.json();

    const vehicles = await prisma.car.findMany({
      where: {
        status: 'active',
        ...(make && { make: { contains: make, mode: 'insensitive' } }),
        ...(model && { model: { contains: model, mode: 'insensitive' } }),
        ...(year_min && { year: { gte: year_min } }),
        ...(year_max && { year: { lte: year_max } }),
        ...(price_max && { salePrice: { lte: price_max } }),
        ...(state && { state: { equals: state, mode: 'insensitive' } }),
        ...(city && { city: { contains: city, mode: 'insensitive' } }),
      },
      include: {
        dealer: {
          select: {
            businessName: true,
            city: true,
            state: true,
            phone: true,
          },
        },
      },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    // Format for voice response
    const formatted = vehicles.map(v => ({
      id: v.id,
      description: `${v.year} ${v.make} ${v.model}`,
      price: v.salePrice,
      location: `${v.city}, ${v.state}`,
      dealer: v.dealer.businessName,
      dealer_phone: v.dealer.phone,
    }));

    return NextResponse.json({
      success: true,
      count: vehicles.length,
      vehicles: formatted,
      spoken_response: vehicles.length > 0
        ? `I found ${vehicles.length} matching vehicles. The first one is a ${formatted[0].description} for $${formatted[0].price.toLocaleString()} in ${formatted[0].location}.`
        : `I couldn't find any vehicles matching that criteria. Would you like to try a different search?`,
    });

  } catch (error) {
    console.error('Vehicle search error:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}
```

### Phase 5: Configure Bland.ai Agent

**Bland.ai API Call to Create Agent**:

```javascript
const response = await fetch('https://api.bland.ai/v1/agents', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_BLAND_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'IQ Auto Deals - Buyer Assistant',
    prompt: BUYER_AGENT_PROMPT, // System prompt from above
    voice: 'maya', // Natural female voice
    model: 'enhanced', // Best quality
    first_sentence: "Thank you for calling IQ Auto Deals, the smart way to buy your next car. I'm your AI assistant. Are you looking to buy a car, or do you have questions about how we work?",
    wait_for_greeting: false,
    language: 'en',

    // Webhook for lead capture
    webhook: 'https://iqautodeals.com/api/phone/lead-capture',

    // Tools/Functions
    tools: [
      {
        name: 'search_vehicles',
        description: 'Search for vehicles matching customer criteria',
        url: 'https://iqautodeals.com/api/phone/vehicle-search',
        method: 'POST',
        parameters: {
          type: 'object',
          properties: {
            make: { type: 'string', description: 'Vehicle make (Ford, Toyota, etc.)' },
            model: { type: 'string', description: 'Vehicle model' },
            year_min: { type: 'integer', description: 'Minimum year' },
            year_max: { type: 'integer', description: 'Maximum year' },
            price_max: { type: 'number', description: 'Maximum price' },
            state: { type: 'string', description: 'State abbreviation' },
            city: { type: 'string', description: 'City name' },
          },
        },
      },
      {
        name: 'capture_lead',
        description: 'Save customer information for dealer follow-up',
        url: 'https://iqautodeals.com/api/phone/lead-capture',
        method: 'POST',
        parameters: {
          type: 'object',
          properties: {
            caller_name: { type: 'string', description: 'Customer full name' },
            caller_phone: { type: 'string', description: 'Customer phone number' },
            caller_email: { type: 'string', description: 'Customer email' },
            vehicle_interest: { type: 'string', description: 'Vehicle they are interested in' },
            notes: { type: 'string', description: 'Additional notes from call' },
          },
          required: ['caller_name', 'vehicle_interest'],
        },
      },
    ],

    // Transfer settings
    transfer_phone_number: '+16783134597', // Fallback to human
    transfer_list: {
      'human_support': '+16783134597',
    },

    // Knowledge base
    knowledge_base: KNOWLEDGE_BASE_CONTENT,
  }),
});
```

---

## Phone Number Setup

### Option 1: New Dedicated Number
- Purchase through Bland.ai or Twilio
- Cost: ~$1-2/month
- Recommended for: Easy setup, separate tracking

### Option 2: Use Existing 1-800-IQ-DEALS
- Port number or forward to Bland.ai
- Configure in Twilio/carrier settings
- Recommended for: Brand consistency

### IVR Menu (Optional)

```
"Thank you for calling IQ Auto Deals.

Press 1 if you're looking to buy a car.
Press 2 if you're a dealer needing support.
Press 0 to speak with a representative."
```

---

## Cost Estimation

### Bland.ai Pricing

| Volume | Cost/Month | Per Call (avg 3 min) |
|--------|------------|---------------------|
| 100 calls | ~$27 | $0.27 |
| 500 calls | ~$135 | $0.27 |
| 1000 calls | ~$270 | $0.27 |
| 5000 calls | ~$1,350 | $0.27 |

### Additional Costs
- Phone number: ~$2/month
- Twilio (if needed for transfer): ~$0.01/min

### Total Estimated Cost
- **Low volume (100 calls/month)**: ~$30/month
- **Medium volume (500 calls/month)**: ~$140/month
- **High volume (1000 calls/month)**: ~$275/month

---

## Success Metrics

### Call Quality
- Call completion rate > 90%
- Customer satisfaction > 4/5
- Average call duration < 5 minutes

### Lead Capture
- Lead capture rate > 40% of calls
- Lead-to-deal conversion > 10%
- Correct dealer transfer > 95%

### Cost Efficiency
- Cost per lead < $5
- Cost per transferred call < $1

---

## Testing Plan

### Phase 1: Internal Testing
1. Test all conversation flows
2. Verify API integrations
3. Test call transfers
4. Validate lead capture

### Phase 2: Beta Testing
1. Limited release to select dealers
2. Monitor call recordings
3. Gather feedback
4. Iterate on prompts

### Phase 3: Production Launch
1. Full number activation
2. Marketing integration
3. Ongoing monitoring
4. Weekly optimization

---

## Files to Create

```
priceyourauto/
├── app/api/phone/
│   ├── lead-capture/
│   │   └── route.ts          # Lead capture webhook
│   ├── vehicle-search/
│   │   └── route.ts          # Vehicle search for AI
│   ├── dealer-lookup/
│   │   └── route.ts          # Find dealer for transfer
│   └── call-log/
│       └── route.ts          # Log completed calls
├── lib/
│   └── bland-ai.ts           # Bland.ai client wrapper
├── scripts/
│   └── setup-bland-agent.ts  # Agent configuration script
└── docs/
    ├── knowledge-base.md     # AI knowledge base content
    └── phone-prompts.md      # Agent prompts
```

---

## Next Steps

1. **Sign up for Bland.ai** - Get API key and $5 free credits
2. **Create knowledge base** - Compile FAQ and IQ Auto Deals info
3. **Build webhook endpoints** - Lead capture and vehicle search
4. **Configure AI agent** - Set up prompts and tools
5. **Test with internal calls** - Verify all flows work
6. **Acquire/configure phone number** - Connect to Bland.ai
7. **Launch beta** - Limited rollout with monitoring
