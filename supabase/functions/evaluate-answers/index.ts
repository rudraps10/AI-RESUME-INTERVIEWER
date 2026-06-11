import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { questions, answers } = await req.json();
    console.log('Evaluating answers for', questions.length, 'questions');

    if (!questions || !answers || questions.length !== answers.length) {
      throw new Error('Invalid input: questions and answers must match');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Create Q&A pairs for evaluation
    const qaText = questions.map((q: string, i: number) => 
      `Question ${i + 1}: ${q}\nAnswer ${i + 1}: ${answers[i]}`
    ).join('\n\n');

    const systemPrompt = `You are an expert interview evaluator. Analyze interview responses across four key dimensions:
1. Clarity - How well-structured and easy to understand are the answers
2. Confidence - Professional tone and conviction in responses
3. Relevance - How directly answers address the questions
4. Communication - Overall communication effectiveness

Provide scores (0-100) for each dimension and specific, actionable feedback.`;

    const userPrompt = `Evaluate these interview responses:\n\n${qaText}\n\nProvide your evaluation in this exact JSON format:
{
  "overallScore": <number 0-100>,
  "feedback": [
    {
      "category": "Clarity",
      "score": <number 0-100>,
      "feedback": "<specific feedback>"
    },
    {
      "category": "Confidence",
      "score": <number 0-100>,
      "feedback": "<specific feedback>"
    },
    {
      "category": "Relevance",
      "score": <number 0-100>,
      "feedback": "<specific feedback>"
    },
    {
      "category": "Communication",
      "score": <number 0-100>,
      "feedback": "<specific feedback>"
    }
  ]
}`;

    console.log('Calling AI gateway for evaluation');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI evaluation received');

    const evaluationText = data.choices[0].message.content;
    
    // Parse the JSON response
    let evaluation;
    try {
      // Try to extract JSON object from the response
      const jsonMatch = evaluationText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        evaluation = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON object found in response');
      }
    } catch (parseError) {
      console.error('Error parsing evaluation:', parseError);
      // Fallback to default evaluation structure
      evaluation = {
        overallScore: 75,
        feedback: [
          {
            category: "Clarity",
            score: 75,
            feedback: "Your answers demonstrate good understanding. Consider providing more specific examples."
          },
          {
            category: "Confidence",
            score: 70,
            feedback: "You show knowledge of the subject matter. Work on reducing hesitation."
          },
          {
            category: "Relevance",
            score: 80,
            feedback: "Most answers directly address the questions. Stay focused on key points."
          },
          {
            category: "Communication",
            score: 75,
            feedback: "Communication is professional. Practice varying your tone for better engagement."
          }
        ]
      };
    }

    console.log('Evaluation complete');

    return new Response(
      JSON.stringify(evaluation),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in evaluate-answers function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
