import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('Chat function called:', {
    method: req.method,
    url: req.url,
    timestamp: new Date().toISOString(),
    headers: Object.fromEntries(req.headers.entries())
  });

  // Check if OpenAI API key is available
  if (!openAIApiKey) {
    console.error('Missing OpenAI API key - check Supabase secrets configuration');
    return new Response(JSON.stringify({ 
      error: 'مفتاح OpenAI API غير متوفر. يرجى التحقق من إعدادات المشروع.',
      details: 'OpenAI API key not configured in Supabase secrets'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { messages, model } = await req.json();

    console.log('Received chat request:', { 
      messagesCount: messages?.length || 0, 
      model: model || 'gpt-4o-mini',
      timestamp: new Date().toISOString()
    });

    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new Error('رسائل غير صالحة أو فارغة');
    }

    console.log('Calling OpenAI API...', {
      model: model || 'gpt-4o-mini',
      messageCount: messages.length,
      timestamp: new Date().toISOString()
    });

    // Add timeout to OpenAI request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `أنت مساعد ذكي لتطوير التطبيقات. تجيب باللغة العربية وتساعد في البرمجة وتطوير التطبيقات.

ملاحظة مهمة: إذا طلب المستخدم إنشاء تطبيق Flutter أو موبايل، أو استخدم كلمات مثل "أنشئ تطبيق" أو "اصنع برنامج"، يجب أن تنصحه بأن يستخدم الأزرار السريعة أسفل الشاشة أو أن يكون أكثر وضوحاً في طلبه لتوليد الكود. لا تعطِ تعليمات برمجية أو كود، بل وجهه لاستخدام ميزة توليد الكود المخصصة.

مثال للرد: "لإنشاء تطبيق Flutter، يمكنك استخدام الأزرار السريعة أسفل الشاشة أو كتابة طلب واضح مثل 'أنشئ تطبيق تسوق إلكتروني' وسيقوم النظام بتوليد الكود تلقائياً."`
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1000,
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
      
      let errorMessage = 'حدث خطأ في الاتصال بخدمة الذكاء الاصطناعي';
      if (response.status === 401) {
        errorMessage = 'مفتاح OpenAI API غير صحيح';
      } else if (response.status === 429) {
        errorMessage = 'تم تجاوز حد الاستخدام. يرجى المحاولة لاحقاً';
      } else if (response.status >= 500) {
        errorMessage = 'خطأ في خادم OpenAI. يرجى المحاولة لاحقاً';
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('OpenAI response received successfully:', {
      model: data.model,
      usage: data.usage,
      timestamp: new Date().toISOString()
    });

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('استجابة غير صحيحة من خدمة الذكاء الاصطناعي');
    }

    return new Response(JSON.stringify({ 
      content: data.choices[0].message.content 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat function:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: new Date().toISOString()
    });
    
    let errorMessage = 'حدث خطأ في معالجة الطلب';
    let statusCode = 500;
    
    if (error.name === 'AbortError') {
      errorMessage = 'انتهت مهلة الاتصال بخدمة الذكاء الاصطناعي. يرجى المحاولة مرة أخرى';
      statusCode = 408;
    } else if (error.message.includes('fetch') || error.message.includes('network')) {
      errorMessage = 'فشل في الاتصال بخدمة الذكاء الاصطناعي. يرجى التحقق من الاتصال بالإنترنت';
      statusCode = 503;
    } else if (error.message.includes('API key')) {
      errorMessage = 'خطأ في مفتاح OpenAI API. يرجى التحقق من الإعدادات';
      statusCode = 401;
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