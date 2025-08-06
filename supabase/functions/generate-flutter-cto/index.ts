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
        model: 'gpt-4o-mini',
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
  return `You are a Flutter CTO expert. Generate complete, working Flutter application code only. Do NOT provide instructions or explanations - only generate actual Dart code files.

CRITICAL: Return ONLY complete code files in the following format:
- Each file must be wrapped in code blocks with clear file paths
- Generate complete, functional Flutter code
- No explanations, just code

Required files to generate:
1. lib/main.dart - Complete main app file
2. pubspec.yaml - Complete dependencies file
3. At least 2-3 complete UI screens
4. At least 1-2 model classes
5. At least 1 repository/service class
6. README.md - Setup instructions

Code structure requirements:
- Clean Architecture with proper layer separation
- MVVM Pattern with Repository Pattern
- State Management using Provider
- Responsive UI design
- Error handling
- Material Design components

${getAppTypeSpecificGuidelines(appType)}

IMPORTANT: Generate ONLY working Flutter code files. Each file must be complete and functional.`;
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
  
  // Validate that we have actual Flutter code
  if (!validateFlutterCode(files)) {
    console.log('Generated content does not contain valid Flutter code, using fallback');
    throw new Error('Generated content does not contain valid Flutter code');
  }
  
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
  
  // First try to extract files with explicit file path headers
  const filePathRegex = /(?:^|\n)(?:\/\/\s*)?(?:File:|Path:)?\s*([^\n]+\.(?:dart|yaml|md))\s*\n```(?:dart|yaml|md)?\n?([\s\S]*?)```/gi;
  let match;
  
  while ((match = filePathRegex.exec(content)) !== null) {
    const filePath = match[1].trim();
    const code = match[2].trim();
    files[filePath] = code;
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
  // Check if we have a valid main.dart
  const mainDart = files['lib/main.dart'];
  if (!mainDart || (!mainDart.includes('void main()') && !mainDart.includes('runApp'))) {
    return false;
  }
  
  // Check if we have a valid pubspec.yaml
  const pubspec = files['pubspec.yaml'];
  if (!pubspec || !pubspec.includes('flutter:') || !pubspec.includes('dependencies:')) {
    return false;
  }
  
  // Check if we have at least one UI screen
  const hasUIScreen = Object.values(files).some(content => 
    content.includes('StatelessWidget') || content.includes('StatefulWidget')
  );
  
  return hasUIScreen;
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