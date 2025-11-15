import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const systemPrompt = `You are a helpful AI assistant for IQ Auto Deals, a nationwide online car marketplace.

ABOUT IQ AUTO DEALS:
- We connect car buyers with local dealers across all 50 US states
- Buyers can select up to 4 cars and get competitive offers from up to 3 dealers per vehicle
- Completely FREE for buyers - no hidden fees, no membership costs
- Dealers pay $19/car to list their inventory
- Buyers typically save $1,500-$5,000 compared to traditional dealership prices
- We offer a wide selection: sedans, SUVs, trucks, luxury vehicles, certified pre-owned cars
- All dealers are licensed and certified

HOW IT WORKS:
1. Browse thousands of vehicles from dealers within 50 miles
2. Select up to 4 cars you're interested in
3. Request competitive offers - dealers compete for your business
4. Choose the best deal and reserve your vehicle
5. Complete purchase at the dealership

YOUR ROLE:
- Help users find the right vehicle for their needs
- Explain how the platform works
- Answer questions about pricing, process, and services
- Collect leads when appropriate (name, email, phone for serious buyers)
- Be friendly, professional, and helpful
- Keep responses concise and easy to read
- Use bullet points for lists
- If you don't know something, offer to connect them with a human

TONE:
- Friendly and conversational
- Professional but not stuffy
- Enthusiastic about helping them find their perfect car
- Transparent about how the service works

Remember: You're here to help buyers find great deals on quality used cars!`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt
    });

    // Format conversation history for Gemini
    // Filter out any leading assistant messages (like initial greeting) since Gemini requires history to start with user
    const historyMessages = messages.slice(0, -1);
    const firstUserIndex = historyMessages.findIndex((msg: any) => msg.role === 'user');
    const validHistory = firstUserIndex >= 0 ? historyMessages.slice(firstUserIndex) : [];

    const chat = model.startChat({
      history: validHistory.map((msg: any) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
    });

    // Get the last user message
    const lastMessage = messages[messages.length - 1];

    // Send message and get response
    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    const text = response.text();

    // Detect if financing calculator should be shown
    const showCalculator = /payment|afford|finance|monthly|cost|budget/i.test(lastMessage.content);

    return NextResponse.json({
      message: text,
      showCalculator: showCalculator
    });

  } catch (error: any) {
    console.error('Chat API error:', error);
    console.error('Error details:', {
      message: error?.message,
      status: error?.status,
      response: error?.response
    });

    // Handle rate limiting with helpful message
    if (error?.message?.includes('quota') || error?.message?.includes('rate') || error?.message?.includes('429')) {
      return NextResponse.json(
        {
          error: 'High demand right now',
          message: "I'm popular today! 😅 Please wait 5-10 seconds and ask again. I'll be ready to help you find the perfect car!",
          retryAfter: 10
        },
        { status: 429 }
      );
    }

    // Handle 404 errors (invalid model or endpoint)
    if (error?.message?.includes('404') || error?.status === 404) {
      return NextResponse.json(
        {
          error: 'Service temporarily unavailable',
          message: "I'm updating my systems! Please try again in a moment. You can also reach out directly for immediate assistance!"
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to get AI response',
        message: error?.message || 'Please try again or contact support.'
      },
      { status: 500 }
    );
  }
}
