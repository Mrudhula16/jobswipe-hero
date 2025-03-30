
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const openAIApiKey = Deno.env.get("OPENAI_API_KEY") || "";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the Admin key
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    // Get auth token from the request
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    
    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error('Error authenticating user:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized', message: 'User authentication failed' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { resumeText, action } = await req.json();
    
    if (!resumeText) {
      return new Response(
        JSON.stringify({ error: 'Bad Request', message: 'Resume text is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    let systemPrompt, userPrompt;
    
    if (action === 'extract_skills') {
      systemPrompt = "You are an AI resume parser that extracts skills from resumes. Extract both hard skills (technical skills, tools, programming languages) and soft skills.";
      
      userPrompt = `Extract all skills from the following resume text. Return the result as a JSON array where each item is an object with a "name" property for the skill name and a "type" property that is either "hard" or "soft".

Resume:
${resumeText}

Format your response as valid JSON that can be parsed. Don't include any explanations or markdown, just the JSON array.`;
    } else {
      // Default action is parse
      systemPrompt = "You are an AI resume parser that analyzes resumes and extracts structured information.";
      
      userPrompt = `Parse the following resume text and extract structured information including:
      
1. Contact information (name, email, phone)
2. Skills (as an array of strings)
3. Work experience (as an array of objects with company, title, dates, and description)
4. Education (as an array of objects with institution, degree, dates)
5. Summary or objective statement

Resume:
${resumeText}

Return the result as a JSON object that can be directly parsed. Don't include any explanations or markdown.`;
    }
    
    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error("OpenAI API error:", error);
      throw new Error("Failed to get response from AI service");
    }
    
    const aiResponse = await response.json();
    let parsedData;
    
    try {
      // Parse the response from OpenAI
      parsedData = JSON.parse(aiResponse.choices[0].message.content);
    } catch (e) {
      console.error("Error parsing OpenAI response:", e);
      parsedData = { error: "Failed to parse AI response", content: aiResponse.choices[0].message.content };
    }
    
    if (action === 'extract_skills' && Array.isArray(parsedData)) {
      // If extracting skills, update the user's resume with the extracted skills
      const { data: userResumes } = await supabase
        .from('resumes')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (userResumes && userResumes.length > 0) {
        // Update existing resume with skills
        await supabase
          .from('resumes')
          .update({
            skills: parsedData,
            updated_at: new Date().toISOString()
          })
          .eq('id', userResumes[0].id);
          
        console.log(`Updated resume ${userResumes[0].id} with ${parsedData.length} skills`);
      }
    } else if (!action || action === 'parse') {
      // If full parse, store the full resume data
      if (parsedData.skills) {
        // Insert a new resume with the parsed data
        const { data: newResume, error: resumeError } = await supabase
          .from('resumes')
          .insert({
            user_id: user.id,
            title: `Resume - ${new Date().toLocaleDateString()}`,
            content: resumeText,
            skills: parsedData.skills
          })
          .select()
          .single();
          
        if (resumeError) {
          console.error("Error storing resume:", resumeError);
        } else {
          console.log(`Created new resume with ID: ${newResume.id}`);
        }
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: parsedData,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in resume-parser function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
