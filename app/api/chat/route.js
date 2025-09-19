import { google } from "@ai-sdk/google"
import { convertToModelMessages, streamText, UIMessage } from "ai"

export const maxDuration = 30

export async function POST(req) {
  const { messages } = await req.json()

  // Extract patient IDs mentioned in the conversation
  const patientIds = extractPatientIds(messages);
  let patientContext = "";

  // If there are patient IDs, get their information to add to the system prompt
  if (patientIds.length > 0) {
    patientContext = await buildPatientContext(patientIds);
  }

  // --- SUGGEST FEATURE: Google Search and Citation ---
  // Check if the latest user message starts with "suggest:"
  const lastUserMsg = messages.slice().reverse().find(m => m.role === "user" && m.parts && m.parts.length > 0 && m.parts[0].type === "text");
  let googleCitations = "";
  let isSuggest = false;
  if (lastUserMsg && lastUserMsg.parts[0].text.trim().toLowerCase().startsWith("suggest:")) {
    isSuggest = true;
    // Generate citations using Gemini keywords -> SerpAPI
    googleCitations = await searchWithKeywords(messages);
  }

  const prompt = convertToModelMessages(messages)

  const result = streamText({
    model: google("gemini-2.0-flash-exp"),
    messages: [
      {
        role: "system",
        content: `You are BearCare AI, a medical assistant specialized in healthcare data analysis and patient care recommendations You are also a healthcare professional.

Instructions:
- Use only the provided patient context and do not speculate or invent information.
- Provide clear, concise, and semi-formal medical information and recommendations.
- Reply in Markdown format for readability (use lists, bold, headings, etc. where appropriate).
- If the user requests a graph, chart, or visualization, reply with a Markdown code block using the language 'chartjs' and provide a valid Chart.js config as JSON. Example:

\`\`\`chartjs
{
  "type": "bar",
  "data": { "labels": ["A", "B"], "datasets": [{ "label": "Example", "data": [1,2] }] }
}
\`\`\`

- Do not repeat the same disclaimers or information in every message.
- Be straight to the point and avoid unnecessary repetition.
- If information is missing, state only what is available in the context.

Capabilities:
- Analyze patient FHIR records and medical data
- Provide evidence-based treatment recommendations
- Explain medical insights in clear, professional language
- Maintain HIPAA compliance and patient privacy

${patientContext ? `\nPatient Context:\n${patientContext}\n` : ""}

${
  isSuggest
    ? `
IMPORTANT: The user is asking for suggestions. After your answer, append the following citations as Markdown links under a "References" heading. Do NOT invent or hallucinate citations, only use the provided links.

${googleCitations ? googleCitations : ""}`
    : ""
}

Always:
1. Give crisp, actionable medical information (under 100 words when possible)
2. Reference evidence or reasoning when appropriate
3. Use Markdown formatting for clarity

Remember: You are an AI assistant. Recommend consulting healthcare professionals for medical decisions.`,
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

// ---------------------- New Functions ----------------------

// Extract patient IDs from messages
function extractPatientIds(messages) {
  const patientIds = new Set();
  const regex = /@(\d+)/g;

  for (const message of messages) {
    if (message.parts) {
      for (const part of message.parts) {
        if (part.type === "text") {
          let match;
          while ((match = regex.exec(part.text)) !== null) {
            patientIds.add(match[1]);
          }
        }
      }
    }
  }

  return [...patientIds];
}

// Build patient context from IDs
async function buildPatientContext(patientIds) {
  let context = "";

  try {
    for (const id of patientIds) {
      // Fetch patient details
      const patientResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/patients?id=${id}`);

      // Fetch patient records
      const recordsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/records?id=${id}`);

      if (patientResponse.ok && recordsResponse.ok) {
        const patient = await patientResponse.json();
        const records = await recordsResponse.json();

        context += `### PATIENT INFORMATION ###\n`;
        context += `Patient ID: ${id}\n`;
        context += `Name: ${patient.name || "Unknown"}\n`;
        context += `Age: ${patient.age || "Unknown"} years\n`;
        context += `Birth Date: ${patient.birthDate || "Unknown"}\n`;
        context += `Gender: ${patient.gender === 'm' ? 'Male' : patient.gender === 'f' ? 'Female' : patient.gender || "Unknown"}\n`;
        context += `Contact: ${patient.telecom || "Unknown"}\n`;

        if (patient.conditions && patient.conditions.length > 0) {
          context += `\nMedical Conditions:\n`;
          patient.conditions.forEach(condition => {
            context += `- ${condition}\n`;
          });
        }

        if (patient.medications && patient.medications.length > 0) {
          context += `\nCurrent Medications:\n`;
          patient.medications.forEach(med => {
            context += `- ${med}\n`;
          });
        }

        context += `\n### START OF PATIENT ${id} RECORDS ###\n`;
        if (records && records.length > 0) {
          for (let i = 0; i < records.length; i++) {
            context += `\n--- RECORD ${i + 1} ---\n`;
            context += JSON.stringify(records[i], null, 2) + "\n";
          }
        } else {
          context += `No medical records available for this patient.\n`;
        }
        context += `### END OF PATIENT ${id} RECORDS ###\n\n`;
      }
    }
  } catch (error) {
    console.error("Error building patient context:", error);
    context += "Note: There was an error retrieving complete patient data.\n";
  }

  return context;
}

// Generate keywords from chat history using Gemini
async function generateKeywordsFromChat(messages) {
  try {
    const keywordPrompt = [
      {
        role: "system",
        content: `You are an AI that extracts crisp, relevant medical search keywords from chat history.
Return only a short comma-separated list of keywords. No sentences, no explanations.`,
      },
      ...convertToModelMessages(messages),
    ];

    const response = await streamText({
      model: google("gemini-2.0-flash-exp"),
      messages: keywordPrompt,
    });

    let keywords = "";
    for await (const part of response.textStream) {
      keywords += part;
    }

    return keywords.trim();
  } catch (e) {
    console.error("Keyword generation failed:", e);
    return "";
  }
}

// Search SerpAPI using the extracted keywords
async function searchWithKeywords(messages) {
  const serpApiKey = process.env.SERPAPI_KEY;
  if (!serpApiKey) {
    console.log("[Search] SERPAPI_KEY missing.");
    return "";
  }

  console.log("[Gemini] Generating keywords from chat history...");
  const keywords = await generateKeywordsFromChat(messages);
  console.log("[Gemini] Keywords generated:", keywords);

  if (!keywords) {
    console.log("[Search] No keywords generated.");
    return "";
  }

  try {
    console.log("[Search] Searching articles with keywords:", keywords);
    const serpRes = await fetch(
      `https://serpapi.com/search.json?q=${encodeURIComponent(
        keywords + " site:.gov OR site:.edu OR site:.org medical"
      )}&num=5&hl=en&api_key=${serpApiKey}`
    );

    if (serpRes.ok) {
      const serpJson = await serpRes.json();
      const organic = serpJson.organic_results || [];

      // Filter medical links before slicing
      const filteredLinks = organic
        .filter(
          (r) =>
            r.link &&
            (r.link.includes(".gov") ||
              r.link.includes(".edu") ||
              r.link.includes(".org") ||
              (r.title &&
                /health|medical|medicine|nih|cdc|who|clinic|hospital/i.test(
                  r.title
                )))
        );
      console.log(`[Search] Filtered ${filteredLinks.length} medical articles before slicing.`);

      const medicalLinks = filteredLinks.slice(0, 3);

      console.log(`[Search] Returning ${medicalLinks.length} articles with keywords.`);

      if (medicalLinks.length > 0) {
        return (
          "\n\n#### References:\n" +
          medicalLinks
            .map((r, i) => `${i + 1}. [${r.title}](${r.link})`)
            .join("\n")
        );
      }
    } else {
      console.log("[Search] SerpAPI response not ok.");
    }
  } catch (e) {
    console.error("SerpAPI keyword search failed:", e);
  }
  return "";
}
