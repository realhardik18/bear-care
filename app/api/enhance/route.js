import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
  try {
    console.log('📝 Received enhancement request');
    const { notes } = await req.json();
    console.log(`📋 Processing ${notes.length} notes`);

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    console.log('🤖 Calling Gemini API...');
    const prompt = `
      Transform these medical notes into a well-structured professional medical report.
      Use proper Markdown formatting with:
      - Clear headings (##)
      - Bullet points for lists
      - Bold for important terms
      - Tables where appropriate
      - Include sections for: Summary, Key Findings, Recommendations

      Notes to transform:
      ${notes.join('\n\n')}
    `;

    const result = await model.generateContent(prompt);
    const markdown = result.response.text();
    console.log('✨ Successfully generated markdown content');

    // Add timestamp and report ID to the markdown
    const reportId = Math.random().toString(36).substr(2, 9);
    const timestamp = new Date().toISOString();
    const formattedMarkdown = `# Enhanced Medical Report
Report ID: ${reportId}
Generated: ${timestamp}

${markdown}`;

    return new NextResponse(JSON.stringify({
      markdown: formattedMarkdown,
      reportId,
      timestamp
    }), {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('❌ Error in enhance API:', error);
    return new NextResponse(JSON.stringify({
      error: 'Failed to process notes',
      details: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}