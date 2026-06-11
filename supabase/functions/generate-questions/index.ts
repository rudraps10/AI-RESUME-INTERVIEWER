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
    const { resumeText, interviewType } = await req.json();
    console.log('Generating questions for interview type:', interviewType);

    if (!resumeText || !interviewType) {
      throw new Error('Missing required fields: resumeText and interviewType');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Create system prompt based on interview type
    const typePrompts = {
      general: "You are an expert HR interviewer conducting a general interview. Focus on overall experience, background, career goals, and cultural fit.",
      technical: "You are a senior technical interviewer. Focus on technical skills, problem-solving abilities, coding experience, and domain expertise mentioned in the resume.",
      hr: "You are an HR manager conducting a behavioral interview. Focus on soft skills, teamwork, conflict resolution, and cultural fit.",
      managerial: "You are a senior executive interviewing for a management position. Focus on leadership experience, team management, strategic thinking, and decision-making abilities.",
    };

    const systemPrompt = typePrompts[interviewType as keyof typeof typePrompts] || typePrompts.general;

    const userPrompt = `Based on this resume:\n\n${resumeText}\n\nGenerate exactly 5 interview questions that are:\n1. Specific to the candidate's experience and skills\n2. Appropriate for a ${interviewType} interview\n3. Open-ended to encourage detailed responses\n4. Professional and respectful\n\nReturn ONLY a JSON array of 5 question strings, nothing else. Example format: ["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"]`;

    console.log('Calling AI gateway to generate questions');

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
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');

    const questionsText = data.choices[0].message.content;
    
    // Parse the JSON array from the response
    let questions;
    try {
      // Try to extract JSON array from the response
      const jsonMatch = questionsText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON array found in response');
      }
    } catch (parseError) {
      console.error('Error parsing questions:', parseError);
      // Fallback: split by newlines and clean up
      questions = questionsText
        .split('\n')
        .filter((q: string) => q.trim().length > 10)
        .map((q: string) => q.replace(/^\d+\.\s*/, '').replace(/^["']|["']$/g, '').trim())
        .slice(0, 5);
    }

    console.log('Generated questions:', questions.length);

    return new Response(
      JSON.stringify({ questions }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in generate-questions function:', error);
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
