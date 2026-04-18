import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { statistics } = await req.json();

    if (!statistics) {
      return new Response(
        JSON.stringify({ error: "Missing statistics in request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const hasIntersectional = statistics.intersectionalGroups && statistics.intersectionalGroups.length > 0;

    const systemPrompt = `You are a fairness and bias detection expert. You analyze dataset statistics and compute fairness metrics.

Given the dataset statistics, you must:
1. Compute fairness metrics based on the cross-tabulation data
2. Provide a plain-language summary of the bias detected
3. Identify which features most influence outcomes across groups
4. Provide actionable mitigation recommendations
5. Compute an overall fairness score (0-100) and letter grade (A-F)
${hasIntersectional ? '6. Analyze intersectional bias patterns from the cross-attribute combinations' : ''}

IMPORTANT: You must respond using the suggest_audit_results tool. Do not respond with plain text.`;

    const intersectionalSection = hasIntersectional
      ? `\n\nIntersectional groups (combinations of protected attributes):\n${JSON.stringify(statistics.intersectionalGroups.slice(0, 30), null, 2)}`
      : '';

    const userPrompt = `Analyze these dataset statistics for bias and fairness:

Dataset: ${statistics.rowCount} rows, ${statistics.columnCount} columns
Target column: "${statistics.targetColumn}" (positive outcome = "${statistics.positiveOutcomeValue}")
Protected attributes: ${statistics.protectedAttributes.join(", ")}

Target distribution: ${JSON.stringify(statistics.targetDistribution)}

Cross-tabulations by protected attribute:
${JSON.stringify(statistics.crossTabulations, null, 2)}

Group distributions:
${JSON.stringify(statistics.groupDistributions, null, 2)}
${intersectionalSection}

Compute the following metrics for each protected attribute:
- Demographic Parity Ratio (ratio of positive rates between most/least favored groups, ideal = 1.0, fail < 0.8)
- Disparate Impact (same as above, legal threshold 0.8)
- Equal Opportunity Difference (difference in true positive rates, ideal = 0, fail > 0.1)
- Statistical Parity Difference (difference in positive rates, ideal = 0, fail > 0.1)

Also compute an overall fairness score from 0-100 (100 = perfectly fair) and assign a letter grade (A/B/C/D/F).
${hasIntersectional ? 'Analyze intersectional patterns: which specific group combinations face the most/least favorable outcomes?' : ''}

Provide a clear, non-technical summary, feature importance analysis, and concrete mitigation steps.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "suggest_audit_results",
              description: "Return the bias audit results in structured format",
              parameters: {
                type: "object",
                properties: {
                  summary: {
                    type: "string",
                    description: "Plain-language summary of bias findings (2-4 sentences)",
                  },
                  fairnessMetrics: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        value: { type: "number" },
                        threshold: { type: "number" },
                        status: { type: "string", enum: ["pass", "warning", "fail"] },
                        description: { type: "string" },
                      },
                      required: ["name", "value", "threshold", "status", "description"],
                      additionalProperties: false,
                    },
                  },
                  featureImportance: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        feature: { type: "string" },
                        influence: { type: "number", description: "0 to 1 scale" },
                        direction: { type: "string" },
                      },
                      required: ["feature", "influence", "direction"],
                      additionalProperties: false,
                    },
                  },
                  recommendations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        impact: { type: "string", enum: ["high", "medium", "low"] },
                      },
                      required: ["title", "description", "impact"],
                      additionalProperties: false,
                    },
                  },
                  fairnessScore: {
                    type: "number",
                    description: "Overall fairness score 0-100",
                  },
                  fairnessGrade: {
                    type: "string",
                    description: "Letter grade A/B/C/D/F",
                  },
                  intersectionalFindings: {
                    type: "string",
                    description: "Analysis of intersectional bias patterns (if data provided)",
                  },
                },
                required: ["summary", "fairnessMetrics", "featureImportance", "recommendations", "fairnessScore", "fairnessGrade"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "suggest_audit_results" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a few seconds." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage credits exhausted. Please add funds in Settings > Workspace > Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("No structured response from AI");
    }

    const auditResults = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(auditResults), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("audit-bias error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
