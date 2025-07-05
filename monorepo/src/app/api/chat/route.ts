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
      const jsonMatch = geminiResponse.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
      let jsonString = jsonMatch ? jsonMatch[1] : geminiResponse;
      jsonString = jsonString.trim();

      const parsedResponse = JSON.parse(jsonString);
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

      else if(parsedResponse.response_type === 'create-coin') {
                const transformedData = {
          name: data.data.name || '',
          symbol: data.data.symbol || '',
          description: data.data.description || '',
          assetType: data.data.assetType || '',
          links: data.data.links || [],
          // Note: image will be null since Gemini doesn't provide image files
          image: null,
          // Convert currency and initial purchase amount if needed
          currency: data.data.currency || 'ETH',
          initialPurchaseAmount: data.data.initialPurchaseAmount || ''
        };
        


      }
      
      return NextResponse.json(parsedResponse);
    } catch (e) {
      try {
        const jsonObjectMatch = geminiResponse.match(/\{[\s\S]*\}/);
        if (jsonObjectMatch) {
          const parsedResponse = JSON.parse(jsonObjectMatch[0]);
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
        return NextResponse.json({ response: geminiResponse });
      }
      return NextResponse.json({ response: geminiResponse });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}