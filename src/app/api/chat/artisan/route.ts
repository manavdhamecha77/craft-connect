import { NextRequest, NextResponse } from 'next/server';
import { askArtisanAssistant, type AskArtisanAssistantInputType } from '@/ai/flows/artisan-assistant';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as AskArtisanAssistantInputType;
    
    // Validate the request body
    if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required and must not be empty' },
        { status: 400 }
      );
    }
    
    // Validate message structure
    for (const message of body.messages) {
      if (!message.role || !message.content) {
        return NextResponse.json(
          { error: 'Each message must have role and content' },
          { status: 400 }
        );
      }
      if (!['user', 'assistant'].includes(message.role)) {
        return NextResponse.json(
          { error: 'Message role must be either "user" or "assistant"' },
          { status: 400 }
        );
      }
    }

    // Call the Genkit flow
    const response = await askArtisanAssistant(body);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Artisan chat API error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST instead.' },
    { status: 405 }
  );
}
