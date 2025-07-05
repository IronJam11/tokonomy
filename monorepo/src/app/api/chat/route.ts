import { INSTRUCTION } from '@/utils/constants/manual/instruction';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Construct the full prompt with instruction manual and user message
    const fullPrompt = `${INSTRUCTION}

Current user prompt: "${message}"

Please analyze the above user prompt and respond according to the instruction manual.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Gemini API error' }, { status: response.status });
    }

    const data = await response.json();
    const geminiResponse = data.candidates[0].content.parts[0].text;
    
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = geminiResponse.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      let jsonString = jsonMatch ? jsonMatch[1] : geminiResponse;
      
      // Clean up the JSON string - remove any extra whitespace and normalize
      jsonString = jsonString.trim();
      
      // Try to parse the response as JSON
      const parsedResponse = JSON.parse(jsonString);
      
      // If it's a normal response type, replace the data.message with the response content
      if (parsedResponse.response_type === 'normal') {
        return NextResponse.json({
          ...parsedResponse,
          message: parsedResponse.data.response,
          data: {
            ...parsedResponse.data,
            message: parsedResponse.data.response
          }
        });
      }
      
      return NextResponse.json(parsedResponse);
    } catch (e) {
      // If parsing fails, try to extract JSON without markdown wrapper
      try {
        // Look for JSON object pattern in the response
        const jsonObjectMatch = geminiResponse.match(/\{[\s\S]*\}/);
        if (jsonObjectMatch) {
          const parsedResponse = JSON.parse(jsonObjectMatch[0]);
          
          // If it's a normal response type, replace the data.message with the response content
          if (parsedResponse.response_type === 'normal') {
            return NextResponse.json({
              ...parsedResponse,
              message: parsedResponse.data.response,
              data: {
                ...parsedResponse.data,
                message: parsedResponse.data.response
              }
            });
          }
          
          return NextResponse.json(parsedResponse);
        }
      } catch (e2) {
        // If all parsing attempts fail, return the raw response
        return NextResponse.json({ response: geminiResponse });
      }
      
      // Fallback: return raw response
      return NextResponse.json({ response: geminiResponse });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}