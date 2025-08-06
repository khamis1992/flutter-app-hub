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
        max_tokens: 8000,
        temperature: 0.3,
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
  return `You are an expert Flutter developer. Your task is to generate ONLY complete, working Flutter code files. NO EXPLANATIONS, NO INSTRUCTIONS - ONLY CODE.

EXAMPLE OUTPUT FORMAT:

\`\`\`dart
// lib/main.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Instagram Clone',
      home: HomeScreen(),
    );
  }
}
\`\`\`

\`\`\`yaml
# pubspec.yaml
name: instagram_clone
description: A Flutter Instagram clone app
version: 1.0.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  provider: ^6.0.5
\`\`\`

RULES:
- Generate ONLY code blocks with file paths as comments
- Each file must be complete and functional
- NO explanatory text outside code blocks
- NO instructions or tutorials
- Use proper Flutter/Dart syntax
- Include proper imports and dependencies

REQUIRED FILES:
1. lib/main.dart - Complete main app
2. pubspec.yaml - All dependencies
3. lib/screens/ - Multiple UI screens
4. lib/models/ - Data models
5. lib/services/ - Business logic
6. README.md - Basic setup instructions

${getAppTypeSpecificGuidelines(appType)}

CRITICAL: Output ONLY code blocks. Nothing else.`;
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
  return `Generate a complete Flutter application for: ${description}

App Type: ${appType}
Technical Requirements:
- Platforms: ${requirements?.platforms?.join(', ') || 'Android, iOS'}
- Features: ${requirements?.features?.join(', ') || 'Modern UI, Responsive design'}
- Complexity: ${requirements?.complexity || 'Medium'}

Preferences:
- State Management: ${preferences?.state_management || 'Provider'}
- Architecture: ${preferences?.architecture || 'Clean Architecture'}
- Testing: ${preferences?.testing ? 'Required' : 'Optional'}

Generate these complete code files:
1. lib/main.dart - Complete main app setup
2. lib/models/ - Data models with JSON serialization
3. lib/repositories/ - Repository classes with error handling
4. lib/screens/ - Complete UI screens with Material Design
5. pubspec.yaml - All required dependencies
6. README.md - Setup and run instructions

GENERATE ONLY CODE FILES. No explanations. Each file must be complete and functional.`;
}

function parseGeneratedContent(content: string, description: string, appType: string): any {
  console.log('Parsing generated content...');
  console.log('Generated content preview:', content.substring(0, 500));
  
  // Check if content contains instructional/explanatory text instead of code
  const isInstructional = content.includes('To create') || 
                          content.includes('Here\'s how') || 
                          content.includes('Follow these steps') ||
                          content.includes('You can create') ||
                          content.includes('This will create') ||
                          content.length < 1000; // Too short to be actual code
  
  if (isInstructional) {
    console.error('Generated content is instructional rather than code');
    throw new Error('AI generated instructions instead of code');
  }
  
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
  
  // Enhanced validation
  if (!validateFlutterCode(files) || Object.keys(files).length < 3) {
    console.log('Generated content validation failed:', {
      fileCount: Object.keys(files).length,
      hasMainDart: !!files['lib/main.dart'],
      hasPubspec: !!files['pubspec.yaml']
    });
    throw new Error('Generated content does not contain sufficient Flutter code');
  }
  
  project.files = files;
  
  // Extract dependencies from pubspec.yaml if present
  if (files['pubspec.yaml']) {
    project.dependencies = extractDependencies(files['pubspec.yaml']);
  }

  console.log('Content parsed successfully:', {
    fileCount: Object.keys(files).length,
    dependencies: project.dependencies.length
  });
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
  
  // Enhanced regex to match file paths in comments
  const filePathRegex = /(?:^|\n)\s*(?:\/\/|#)\s*([^\n]*\.(?:dart|yaml|md))\s*\n```(?:dart|yaml|md)?\s*\n([\s\S]*?)```/gi;
  let match;
  
  while ((match = filePathRegex.exec(content)) !== null) {
    const filePath = match[1].trim();
    const code = match[2].trim();
    if (code && code.length > 20) { // Filter out empty or too small code blocks
      files[filePath] = code;
    }
  }
  
  // If no explicit paths found, extract code blocks and infer file types
  if (Object.keys(files).length === 0) {
    const codeBlockRegex = /```(?:dart|yaml|md)?\n?([\s\S]*?)```/g;
    let fileIndex = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const code = match[1].trim();
      
      // Skip empty code blocks
      if (!code || code.length < 10) continue;
      
      // Determine file type and name based on content
      if (code.includes('void main()') || code.includes('runApp')) {
        files['lib/main.dart'] = code;
      } else if (code.includes('name:') && code.includes('dependencies:') && code.includes('flutter:')) {
        files['pubspec.yaml'] = code;
      } else if (code.includes('class') && (code.includes('extends StatelessWidget') || code.includes('extends StatefulWidget'))) {
        const className = extractClassName(code);
        if (className !== 'Unknown') {
          files[`lib/screens/${className.toLowerCase()}_screen.dart`] = code;
        }
      } else if (code.includes('class') && code.includes('Model')) {
        const className = extractClassName(code);
        if (className !== 'Unknown') {
          files[`lib/models/${className.toLowerCase()}.dart`] = code;
        }
      } else if (code.includes('class') && code.includes('Repository')) {
        const className = extractClassName(code);
        if (className !== 'Unknown') {
          files[`lib/repositories/${className.toLowerCase()}.dart`] = code;
        }
      } else if (code.includes('#') && (code.includes('Flutter') || code.includes('README'))) {
        files['README.md'] = code;
      } else if (code.includes('import \'package:flutter/') || code.includes('import "package:flutter/')) {
        // Generic Dart file
        fileIndex++;
        files[`lib/utils/file_${fileIndex}.dart`] = code;
      }
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

function validateFlutterCode(files: Record<string, string>): boolean {
  console.log('Validating Flutter code with files:', Object.keys(files));
  
  // Check if we have a valid main.dart
  const mainDart = files['lib/main.dart'];
  if (!mainDart || (!mainDart.includes('void main()') && !mainDart.includes('runApp'))) {
    console.log('Invalid main.dart:', mainDart ? 'missing main() or runApp()' : 'file not found');
    return false;
  }
  
  // Check if we have a valid pubspec.yaml
  const pubspec = files['pubspec.yaml'];
  if (!pubspec || !pubspec.includes('flutter:') || !pubspec.includes('dependencies:')) {
    console.log('Invalid pubspec.yaml:', pubspec ? 'missing flutter or dependencies' : 'file not found');
    return false;
  }
  
  // Check if main.dart has actual Flutter widgets
  if (!mainDart.includes('Widget') && !mainDart.includes('MaterialApp')) {
    console.log('main.dart does not contain Flutter widgets');
    return false;
  }
  
  // Check total code volume - should be substantial
  const totalCodeLength = Object.values(files).join('').length;
  if (totalCodeLength < 2000) {
    console.log('Total code length too small:', totalCodeLength);
    return false;
  }
  
  console.log('Flutter code validation passed');
  return true;
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
  
  // Check for architectural patterns
  const hasModels = Object.keys(project.files).some(path => path.includes('/models/'));
  const hasScreens = Object.keys(project.files).some(path => path.includes('/screens/') || path.includes('/pages/'));
  const hasRepositories = Object.keys(project.files).some(path => path.includes('/repositories/'));
  
  if (hasModels) score += 5;
  if (hasScreens) score += 5;
  if (hasRepositories) score += 5;
  
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