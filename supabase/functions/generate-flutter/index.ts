import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Create Supabase client
const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('Flutter generation function called:', {
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
  });

  if (!openAIApiKey) {
    console.error('Missing OpenAI API key');
    return new Response(JSON.stringify({ 
      error: 'مفتاح OpenAI API غير متوفر. يرجى التحقق من إعدادات المشروع.',
      details: 'OpenAI API key not configured'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { 
      prompt, 
      projectType = 'mobile_app', 
      framework = 'flutter',
      projectId,
      userId 
    } = await req.json();

    console.log('Received generation request:', { 
      promptLength: prompt?.length || 0,
      projectType,
      framework,
      projectId,
      timestamp: new Date().toISOString()
    });

    if (!prompt) {
      throw new Error('الطلب مطلوب لتوليد الكود');
    }

    const systemPrompt = getFlutterSystemPrompt(projectType);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    console.log('Calling OpenAI API for Flutter generation...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      throw new Error('خطأ في تولید الكود. يرجى المحاولة مرة أخرى');
    }

    const data = await response.json();
    console.log('OpenAI response received:', {
      model: data.model,
      usage: data.usage,
      timestamp: new Date().toISOString()
    });

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('استجابة غير صحيحة من خدمة الذكاء الاصطناعي');
    }

    const generatedCode = data.choices[0].message.content;
    const parsedProject = parseFlutterCode(generatedCode);

    // Save to database if projectId and userId provided
    if (projectId && userId) {
      try {
        await supabase
          .from('projects')
          .upsert({
            id: projectId,
            user_id: userId,
            generated_code: parsedProject,
            framework,
            project_type: projectType,
            updated_at: new Date().toISOString()
          });

        // Save chat history
        await supabase
          .from('chat_history')
          .insert({
            project_id: projectId,
            user_id: userId,
            message_type: 'user',
            content: prompt
          });

        await supabase
          .from('chat_history')
          .insert({
            project_id: projectId,
            user_id: userId,
            message_type: 'assistant',
            content: generatedCode,
            metadata: { usage: data.usage }
          });

        console.log('Project and chat history saved successfully');
      } catch (dbError) {
        console.error('Database save error:', dbError);
        // Continue without failing the request
      }
    }

    return new Response(JSON.stringify({ 
      project: parsedProject,
      usage: data.usage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in Flutter generation function:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: new Date().toISOString()
    });
    
    let errorMessage = 'حدث خطأ في تولید الكود';
    let statusCode = 500;
    
    if (error.name === 'AbortError') {
      errorMessage = 'انتهت مهلة تولید الكود. يرجى المحاولة مرة أخرى';
      statusCode = 408;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getFlutterSystemPrompt(projectType: string): string {
  const basePrompt = `أنت خبير تطوير تطبيقات Flutter باللغة العربية. تقوم بإنشاء كود Flutter كامل وعالي الجودة يتبع أفضل الممارسات.

قواعد مهمة:
1. استخدم Clean Architecture مع MVVM pattern
2. طبق SOLID principles
3. استخدم proper state management (Provider/Riverpod/Bloc)
4. اكتب كود آمن ومحسن للأداء
5. أضف التعليقات باللغة العربية
6. استخدم proper error handling
7. اجعل التصميم responsive وجميل
8. استخدم Material Design 3

يجب أن يكون الكود جاهز للتشغيل مباشرة ويحتوي على:
- main.dart كملف رئيسي
- هيكل مجلدات منظم
- models, views, controllers/providers
- themes ومفاتيح النصوص`;

  const typeSpecificPrompts = {
    'mobile_app': 'ركز على تطبيق جوال كامل مع navigation وstate management',
    'ecommerce': 'ركز على متجر إلكتروني مع عربة التسوق والدفع',
    'social': 'ركز على تطبيق اجتماعي مع التفاعل والمحتوى',
    'productivity': 'ركز على تطبيق إنتاجية مع المهام والتنظيم',
    'game': 'ركز على لعبة بسيطة مع Flutter Game',
    'web_app': 'ركز على تطبيق ويب responsive',
    'api': 'ركز على API integration وdata handling'
  };

  return `${basePrompt}\n\nنوع المشروع: ${typeSpecificPrompts[projectType as keyof typeof typeSpecificPrompts] || typeSpecificPrompts.mobile_app}`;
}

function parseFlutterCode(content: string): any {
  const project = {
    main: '',
    models: [],
    views: [],
    controllers: [],
    services: [],
    themes: [],
    utils: [],
    pubspec: '',
    description: '',
    structure: {}
  };

  try {
    // Extract main.dart
    const mainMatch = content.match(/```dart[\s\S]*?\/\/ main\.dart[\s\S]*?\n([\s\S]*?)```/i);
    if (mainMatch) {
      project.main = mainMatch[1].trim();
    }

    // Extract pubspec.yaml
    const pubspecMatch = content.match(/```yaml[\s\S]*?pubspec\.yaml[\s\S]*?\n([\s\S]*?)```/i);
    if (pubspecMatch) {
      project.pubspec = pubspecMatch[1].trim();
    }

    // Extract all code blocks
    const codeBlocks = content.match(/```dart[\s\S]*?\n([\s\S]*?)```/gi);
    if (codeBlocks) {
      codeBlocks.forEach(block => {
        const code = block.replace(/```dart\s*\n/, '').replace(/```$/, '').trim();
        
        if (code.includes('class') && code.includes('extends StatefulWidget')) {
          project.views.push(code);
        } else if (code.includes('class') && code.includes('Provider')) {
          project.controllers.push(code);
        } else if (code.includes('class') && !code.includes('Widget')) {
          project.models.push(code);
        } else if (code.includes('service') || code.includes('Service')) {
          project.services.push(code);
        } else if (code.includes('theme') || code.includes('Theme')) {
          project.themes.push(code);
        }
      });
    }

    // Extract description
    const descMatch = content.match(/(?:الوصف|Description)[\s:]*([^\n]+)/i);
    if (descMatch) {
      project.description = descMatch[1].trim();
    }

  } catch (error) {
    console.error('Error parsing Flutter code:', error);
  }

  return project;
}