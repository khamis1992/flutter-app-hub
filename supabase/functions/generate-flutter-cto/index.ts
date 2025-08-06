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

  try {
    console.log('Received request to generate Flutter app');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { description, app_type, requirements, preferences } = await req.json();
    console.log('Request data:', { description, app_type, requirements, preferences });

    // Enhanced system prompt for CTO-level Flutter development
    const systemPrompt = getCTOSystemPrompt(app_type);
    const userPrompt = getDetailedUserPrompt(description, app_type, requirements, preferences);

    console.log('Calling OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0]?.message?.content;

    if (!generatedContent) {
      throw new Error('No content generated from OpenAI');
    }

    console.log('Successfully generated content from OpenAI');

    // Parse and structure the generated code
    const project = parseGeneratedContent(generatedContent, description, app_type);
    
    // Calculate quality score based on generated features
    const qualityScore = calculateQualityScore(project);
    project.quality_score = qualityScore;

    console.log('Project structured successfully:', {
      name: project.name,
      fileCount: Object.keys(project.files).length,
      qualityScore
    });

    return new Response(JSON.stringify({
      success: true,
      project,
      usage: data.usage
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-flutter-cto function:', error);
    
    // Return fallback project on error
    const fallbackProject = getFallbackProject(description || 'Flutter App', app_type || 'general');
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      project: fallbackProject
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getCTOSystemPrompt(appType: string): string {
  return `أنت خبير CTO متخصص في تطوير تطبيقات Flutter على مستوى المؤسسات. مهمتك هي إنشاء كود Flutter عالي الجودة يلتزم بـ:

🏗️ **معايير الهندسة المعمارية:**
- Clean Architecture مع فصل الطبقات
- MVVM Pattern مع Repository Pattern
- Dependency Injection باستخدام GetIt
- State Management باستخدام Provider/Riverpod

🔒 **معايير الأمان والجودة:**
- Input validation و data sanitization
- Error handling شامل مع logging
- Performance optimization
- Responsive design لجميع أحجام الشاشات

📝 **هيكل الكود المطلوب:**
\`\`\`
/lib
  /core
    /constants
    /errors
    /utils
  /data
    /datasources
    /models
    /repositories
  /domain
    /entities
    /repositories
    /usecases
  /presentation
    /pages
    /widgets
    /providers
  main.dart
\`\`\`

${getAppTypeSpecificGuidelines(appType)}

📋 **متطلبات الإخراج:**
1. main.dart كامل مع setup صحيح
2. Models مع JSON serialization
3. Repository classes مع error handling
4. UI screens responsive ومتكاملة
5. pubspec.yaml مع جميع التبعيات
6. Tests أساسية
7. README.md مع تعليمات التشغيل

🎯 **جودة الكود:**
- Clean Code principles
- SOLID principles
- DRY و KISS
- Comprehensive comments باللغة العربية
- Type safety كامل`;
}

function getAppTypeSpecificGuidelines(appType: string): string {
  const guidelines = {
    productivity: `
🎯 **تطبيق إنتاجية - متطلبات خاصة:**
- Task management مع SQLite local storage
- Notifications system
- Categories و filters
- Search functionality
- Data export/import`,
    
    ecommerce: `
🛒 **تطبيق تجارة إلكترونية - متطلبات خاصة:**
- Product catalog مع categories
- Shopping cart functionality
- Payment integration structure
- User authentication
- Order management
- Product search و filtering`,
    
    social: `
👥 **تطبيق تواصل اجتماعي - متطلبات خاصة:**
- User profiles management
- Posts و comments system
- Real-time messaging structure
- Media upload handling
- Social interactions (likes, shares)
- Privacy settings`,
    
    fitness: `
💪 **تطبيق لياقة بدنية - متطلبات خاصة:**
- Workout tracking
- Progress monitoring
- Exercise database
- Timer functionality
- Stats و analytics
- Goal setting system`,
    
    education: `
📚 **تطبيق تعليمي - متطلبات خاصة:**
- Course management
- Progress tracking
- Quiz و assessment system
- Video player integration
- Bookmarks و notes
- Offline content support`,
    
    entertainment: `
🎮 **تطبيق ترفيه - متطلبات خاصة:**
- Media player functionality
- Content categorization
- User preferences
- Favorites system
- Sharing capabilities
- Offline mode support`
  };

  return guidelines[appType as keyof typeof guidelines] || guidelines.productivity;
}

function getDetailedUserPrompt(description: string, appType: string, requirements: any, preferences: any): string {
  return `قم بإنشاء تطبيق Flutter كامل بناءً على الوصف التالي:

📝 **وصف التطبيق:** ${description}
🏷️ **نوع التطبيق:** ${appType}

🔧 **المتطلبات التقنية:**
- المنصات: ${requirements?.platforms?.join(', ') || 'Android, iOS'}
- الميزات: ${requirements?.features?.join(', ') || 'UI حديث, تصميم متجاوب'}
- مستوى التعقيد: ${requirements?.complexity || 'متوسط'}

⚙️ **التفضيلات:**
- إدارة الحالة: ${preferences?.state_management || 'Provider'}
- الهندسة المعمارية: ${preferences?.architecture || 'Clean Architecture'}
- الاختبارات: ${preferences?.testing ? 'مطلوبة' : 'اختيارية'}

📦 **مطلوب إنشاء:**
1. main.dart مع إعداد التطبيق الكامل
2. Models مع serialization
3. Repository classes
4. UI Screens متكاملة
5. pubspec.yaml مع التبعيات
6. Basic tests
7. README.md

⚠️ **مهم:** استخدم أفضل الممارسات في Flutter وتأكد من:
- كود نظيف ومنظم
- تعليقات واضحة باللغة العربية
- UI responsive وجميل
- Error handling شامل
- Performance optimization`;
}

function parseGeneratedContent(content: string, description: string, appType: string): any {
  console.log('Parsing generated content...');
  
  const project = {
    name: extractProjectName(description),
    description: description,
    app_type: appType,
    files: {},
    dependencies: [],
    patterns: ['Clean Architecture', 'MVVM', 'Repository Pattern'],
    quality_score: 85
  };

  // Extract different file types from the generated content
  const files = extractFiles(content);
  project.files = files;
  
  // Extract dependencies from pubspec.yaml if present
  if (files['pubspec.yaml']) {
    project.dependencies = extractDependencies(files['pubspec.yaml']);
  }

  console.log('Content parsed successfully');
  return project;
}

function extractProjectName(description: string): string {
  const arabicMatches = description.match(/(?:تطبيق|برنامج|نظام)\s+([^\s]+)/);
  if (arabicMatches) {
    return arabicMatches[1];
  }
  
  // Fallback to app type based names
  const appTypeNames = {
    productivity: 'تطبيق_المهام',
    ecommerce: 'متجر_إلكتروني',
    social: 'تطبيق_تواصل',
    fitness: 'تطبيق_لياقة',
    education: 'تطبيق_تعليمي',
    entertainment: 'تطبيق_ترفيه'
  };
  
  return 'flutter_app';
}

function extractFiles(content: string): Record<string, string> {
  const files: Record<string, string> = {};
  
  // Extract code blocks from the generated content
  const codeBlockRegex = /```(?:dart|yaml|md)?\n?([\s\S]*?)```/g;
  let match;
  let fileIndex = 0;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const code = match[1].trim();
    
    // Determine file type and name based on content
    if (code.includes('void main()') || code.includes('runApp')) {
      files['lib/main.dart'] = code;
    } else if (code.includes('name:') && code.includes('dependencies:')) {
      files['pubspec.yaml'] = code;
    } else if (code.includes('class') && code.includes('extends StatelessWidget')) {
      const className = extractClassName(code);
      files[`lib/presentation/pages/${className.toLowerCase()}_page.dart`] = code;
    } else if (code.includes('class') && code.includes('Model')) {
      const className = extractClassName(code);
      files[`lib/data/models/${className.toLowerCase()}.dart`] = code;
    } else if (code.includes('Repository')) {
      const className = extractClassName(code);
      files[`lib/data/repositories/${className.toLowerCase()}.dart`] = code;
    } else if (code.includes('#') && code.includes('Flutter')) {
      files['README.md'] = code;
    } else {
      // Generic file
      fileIndex++;
      files[`lib/core/utils/file_${fileIndex}.dart`] = code;
    }
  }

  // Ensure we have essential files
  if (!files['lib/main.dart']) {
    files['lib/main.dart'] = generateBasicMainDart();
  }
  
  if (!files['pubspec.yaml']) {
    files['pubspec.yaml'] = generateBasicPubspec();
  }

  if (!files['README.md']) {
    files['README.md'] = generateBasicReadme();
  }

  return files;
}

function extractClassName(code: string): string {
  const classMatch = code.match(/class\s+(\w+)/);
  return classMatch ? classMatch[1] : 'Unknown';
}

function extractDependencies(pubspecContent: string): string[] {
  const dependencies: string[] = [];
  const dependencySection = pubspecContent.match(/dependencies:([\s\S]*?)(?=dev_dependencies:|$)/);
  
  if (dependencySection) {
    const lines = dependencySection[1].split('\n');
    for (const line of lines) {
      const match = line.trim().match(/^(\w+):/);
      if (match && match[1] !== 'flutter') {
        dependencies.push(match[1]);
      }
    }
  }
  
  return dependencies;
}

function calculateQualityScore(project: any): number {
  let score = 60; // Base score
  
  // File structure quality
  const fileCount = Object.keys(project.files).length;
  score += Math.min(fileCount * 5, 20);
  
  // Check for essential files
  if (project.files['lib/main.dart']) score += 10;
  if (project.files['pubspec.yaml']) score += 5;
  if (project.files['README.md']) score += 5;
  
  return Math.min(score, 100);
}

function generateBasicMainDart(): string {
  return `import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter App',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('مرحباً بك في التطبيق'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.flutter_dash,
              size: 100,
              color: Colors.blue,
            ),
            SizedBox(height: 20),
            Text(
              'تم إنشاء التطبيق بنجاح!',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
          ],
        ),
      ),
    );
  }
}`;
}

function generateBasicPubspec(): string {
  return `name: flutter_app
description: A new Flutter application.
version: 1.0.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  provider: ^6.0.5
  get_it: ^7.6.4
  freezed_annotation: ^2.4.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  build_runner: ^2.4.7
  freezed: ^2.4.6
  json_annotation: ^4.8.1
  json_serializable: ^6.7.1

flutter:
  uses-material-design: true`;
}

function generateBasicReadme(): string {
  return `# Flutter Application

تطبيق Flutter تم إنشاؤه باستخدام أفضل الممارسات والمعايير المهنية.

## الميزات الرئيسية

- تصميم Material Design
- بنية نظيفة (Clean Architecture)
- إدارة الحالة باستخدام Provider
- دعم اللغة العربية

## كيفية التشغيل

1. تأكد من تثبيت Flutter SDK
2. قم بتشغيل الأمر التالي:

\`\`\`
flutter pub get
flutter run
\`\`\`

## البنية المعمارية

يتبع التطبيق مبادئ Clean Architecture مع فصل الطبقات:

- **Presentation Layer**: واجهات المستخدم
- **Domain Layer**: منطق العمل
- **Data Layer**: مصادر البيانات

تم تطوير هذا التطبيق باستخدام Flutter AI CTO Expert.`;
}

function getFallbackProject(description: string, appType: string): any {
  return {
    name: extractProjectName(description),
    description: description,
    app_type: appType,
    files: {
      'lib/main.dart': generateBasicMainDart(),
      'pubspec.yaml': generateBasicPubspec(),
      'README.md': generateBasicReadme()
    },
    dependencies: ['provider', 'get_it', 'freezed_annotation'],
    patterns: ['Clean Architecture', 'MVVM'],
    quality_score: 75
  };
}