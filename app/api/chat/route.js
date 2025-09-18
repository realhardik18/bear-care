import { google } from "@ai-sdk/google"
import { convertToModelMessages, streamText,UIMessage } from "ai"

export const maxDuration = 30

export async function POST(req) {
  const { messages } = await req.json()

  const prompt = convertToModelMessages(messages)

  const result = streamText({
    model: google("gemini-2.0-flash-exp"),
    messages: [
      {
        role: "system",
        content: `You are BearCare AI, a medical assistant specialized in healthcare data analysis and patient care recommendations.

Key capabilities:
- Analyze patient FHIR records and medical data
- Provide evidence-based treatment recommendations
- Explain medical insights in clear, professional language
- Maintain HIPAA compliance and patient privacy
- Focus on actionable healthcare insights

Always provide:
1. Clear, concise medical information
2. Evidence-based recommendations when appropriate
3. Explanations for your reasoning
4. Appropriate medical disclaimers when giving clinical advice

Remember: You are an AI assistant and should always recommend consulting with healthcare professionals for medical decisions.`,
      },
      ...prompt,
    ],
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    onFinish: async ({ isAborted }) => {
      if (isAborted) {
        console.log("Chat aborted")
      }
    },
  })
}
