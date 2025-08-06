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
    
    // Quality score is calculated during parsing
    // project.quality_score is set in parseGeneratedContent

    console.log('Project structured successfully:', {
      name: project.name,
      fileCount: Object.keys(project.files).length,
      qualityScore: project.quality_score
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
  return `You are an expert Flutter developer and CTO-level architect. Your task is to generate COMPLETE, PRODUCTION-READY Flutter applications that demonstrate best practices and clean architecture.

CRITICAL RULES:
1. Generate ONLY complete code files with file paths as comments
2. NO explanatory text outside code blocks
3. NO instructions or tutorials - ONLY working code
4. Each file must be complete, functional, and follow Flutter best practices
5. Use clean architecture patterns (Repository, UseCase, Provider/Bloc)
6. Include proper error handling and null safety

EXACT OUTPUT FORMAT (MANDATORY):

\`\`\`dart
// lib/main.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

import 'screens/home_screen.dart';
import 'providers/app_provider.dart';
import 'config/theme.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AppProvider()),
      ],
      child: MaterialApp(
        title: 'Flutter App',
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        home: HomeScreen(),
        localizationsDelegates: [
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
        ],
        supportedLocales: [
          Locale('en', ''),
          Locale('ar', ''),
        ],
      ),
    );
  }
}
\`\`\`

\`\`\`yaml
# pubspec.yaml
name: flutter_app
description: A production-ready Flutter application
version: 1.0.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"
  flutter: ">=3.10.0"

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter
  provider: ^6.0.5
  http: ^1.1.0
  shared_preferences: ^2.2.0
  sqflite: ^2.3.0
  path: ^1.8.3
  intl: ^0.18.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/
  fonts:
    - family: CustomFont
      fonts:
        - asset: assets/fonts/CustomFont-Regular.ttf
        - asset: assets/fonts/CustomFont-Bold.ttf
          weight: 700
\`\`\`

MANDATORY FILE STRUCTURE (Generate ALL of these):
1. lib/main.dart - Complete app entry point with providers
2. lib/models/ - Data models with JSON serialization  
3. lib/screens/ - Complete UI screens with state management
4. lib/providers/ - State management providers
5. lib/repositories/ - Data layer with error handling
6. lib/services/ - API and business logic services
7. lib/widgets/ - Reusable UI components
8. lib/config/ - App configuration (theme, constants)
9. lib/utils/ - Helper functions and utilities
10. pubspec.yaml - Complete dependencies
11. README.md - Setup instructions

${getAppTypeSpecificGuidelines(appType)}

FEW-SHOT EXAMPLES FOR ${appType.toUpperCase()}:

${getFewShotExamples(appType)}

VALIDATION REQUIREMENTS:
- Main.dart MUST contain runApp() and MaterialApp
- All imports must be valid Flutter/Dart packages
- Each screen must extend StatelessWidget or StatefulWidget
- Models must include JSON serialization (toJson/fromJson)
- Providers must extend ChangeNotifier
- Repository classes must handle errors properly
- Minimum 8 files for a complete application

CRITICAL: Generate ONLY code blocks with file paths. No explanations whatsoever.`;
}

function getAppTypeSpecificGuidelines(appType: string): string {
  const guidelines = {
    productivity: `
PRODUCTIVITY APP SPECIFIC REQUIREMENTS:
- Implement Task model with CRUD operations
- Create TaskRepository with SQLite integration
- Add TaskProvider for state management
- Include CategoryService for task organization
- Implement NotificationService structure
- Add SearchProvider for filtering tasks
- Create SettingsProvider for app preferences
- Include analytics tracking for productivity metrics`,
    
    ecommerce: `
ECOMMERCE APP SPECIFIC REQUIREMENTS:
- Implement Product, Order, User models with full relations
- Create ProductRepository with pagination and caching
- Add CartProvider for shopping cart state
- Include PaymentService structure (without real integration)
- Implement AuthProvider for user authentication
- Add SearchProvider with filters and sorting
- Create OrderRepository with order management
- Include ProductService for catalog operations`,
    
    social: `
SOCIAL APP SPECIFIC REQUIREMENTS:
- Implement User, Post, Comment models with relationships
- Create PostRepository with CRUD operations
- Add AuthProvider for user management
- Include FeedProvider for posts state management
- Implement ChatService structure for messaging
- Add MediaService for image/video handling
- Create NotificationProvider for social interactions
- Include PrivacyService for user settings`,
    
    fitness: `
FITNESS APP SPECIFIC REQUIREMENTS:
- Implement Workout, Exercise, Progress models
- Create WorkoutRepository with local storage
- Add ProgressProvider for tracking state
- Include TimerService for workout sessions
- Implement StatsProvider for analytics
- Add ExerciseRepository with exercise database
- Create GoalProvider for goal management
- Include HealthService for data integration`,
    
    education: `
EDUCATION APP SPECIFIC REQUIREMENTS:
- Implement Course, Lesson, Quiz models
- Create CourseRepository with progress tracking
- Add ProgressProvider for learning state
- Include QuizService for assessments
- Implement VideoProvider for media handling
- Add BookmarkRepository for saved content
- Create OfflineProvider for content caching
- Include AnalyticsService for learning metrics`,
    
    entertainment: `
ENTERTAINMENT APP SPECIFIC REQUIREMENTS:
- Implement Media, Playlist, User models
- Create MediaRepository with content management
- Add PlayerProvider for media state
- Include ContentService for categorization
- Implement FavoritesProvider for user preferences
- Add RecommendationService for content discovery
- Create DownloadProvider for offline content
- Include SharingService for social features`
  };

  return guidelines[appType as keyof typeof guidelines] || guidelines.productivity;
}

function getFewShotExamples(appType: string): string {
  const examples = {
    productivity: `
EXAMPLE TASK MODEL:
\`\`\`dart
// lib/models/task.dart
class Task {
  final String id;
  final String title;
  final String description;
  final DateTime createdAt;
  final bool isCompleted;
  final String categoryId;

  Task({
    required this.id,
    required this.title,
    required this.description,
    required this.createdAt,
    required this.isCompleted,
    required this.categoryId,
  });

  factory Task.fromJson(Map<String, dynamic> json) {
    return Task(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      createdAt: DateTime.parse(json['createdAt']),
      isCompleted: json['isCompleted'],
      categoryId: json['categoryId'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'createdAt': createdAt.toIso8601String(),
      'isCompleted': isCompleted,
      'categoryId': categoryId,
    };
  }
}
\`\`\``,
    
    ecommerce: `
EXAMPLE PRODUCT MODEL:
\`\`\`dart
// lib/models/product.dart
class Product {
  final String id;
  final String name;
  final String description;
  final double price;
  final String imageUrl;
  final String categoryId;
  final int stock;
  final List<String> tags;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.imageUrl,
    required this.categoryId,
    required this.stock,
    required this.tags,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'],
      name: json['name'],
      description: json['description'],
      price: json['price'].toDouble(),
      imageUrl: json['imageUrl'],
      categoryId: json['categoryId'],
      stock: json['stock'],
      tags: List<String>.from(json['tags']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'price': price,
      'imageUrl': imageUrl,
      'categoryId': categoryId,
      'stock': stock,
      'tags': tags,
    };
  }
}
\`\`\``,
    
    social: `
EXAMPLE POST MODEL:
\`\`\`dart
// lib/models/post.dart
class Post {
  final String id;
  final String userId;
  final String content;
  final List<String> imageUrls;
  final DateTime createdAt;
  final int likesCount;
  final int commentsCount;
  final bool isLiked;

  Post({
    required this.id,
    required this.userId,
    required this.content,
    required this.imageUrls,
    required this.createdAt,
    required this.likesCount,
    required this.commentsCount,
    required this.isLiked,
  });

  factory Post.fromJson(Map<String, dynamic> json) {
    return Post(
      id: json['id'],
      userId: json['userId'],
      content: json['content'],
      imageUrls: List<String>.from(json['imageUrls']),
      createdAt: DateTime.parse(json['createdAt']),
      likesCount: json['likesCount'],
      commentsCount: json['commentsCount'],
      isLiked: json['isLiked'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'content': content,
      'imageUrls': imageUrls,
      'createdAt': createdAt.toIso8601String(),
      'likesCount': likesCount,
      'commentsCount': commentsCount,
      'isLiked': isLiked,
    };
  }
}
\`\`\``
  };

  return examples[appType as keyof typeof examples] || examples.productivity;
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
  
  // Enhanced validation for instructional content
  const instructionalPatterns = [
    'To create', 'Here\'s how', 'Follow these steps', 'You can create', 'This will create',
    'Let me show you', 'First, we need to', 'Next, we\'ll', 'Finally, we\'ll',
    'Here\'s a complete', 'Here\'s how to', 'You need to', 'Make sure to',
    'Don\'t forget to', 'Remember to', 'It\'s important to'
  ];
  
  // Check for code blocks and actual Dart code indicators
  const hasCodeBlocks = (content.match(/```/g) || []).length >= 4; // At least 2 code blocks
  const hasDartCode = content.includes('import \'package:flutter/') || 
                      content.includes('class ') || 
                      content.includes('Widget build(');
  
  // More lenient check - only reject if it's clearly instructional AND has no code
  const isInstructional = instructionalPatterns.some(pattern => 
    content.toLowerCase().includes(pattern.toLowerCase())
  ) && (!hasCodeBlocks || !hasDartCode);
  
  if (isInstructional && content.length < 3000) {
    console.error('Generated content appears to be instructional rather than code');
    console.log('Content analysis:', {
      hasCodeBlocks,
      hasDartCode,
      length: content.length,
      instructionalMatch: instructionalPatterns.find(p => content.toLowerCase().includes(p.toLowerCase()))
    });
    throw new Error('AI generated instructions instead of production-ready code. Please try again.');
  }
  
  // Advanced content quality validation
  const codeBlockCount = (content.match(/```/g) || []).length / 2;
  const dartFileCount = (content.match(/\.dart/g) || []).length;
  const importCount = (content.match(/import\s+['"][^'"]+['"]/g) || []).length;
  
  if (codeBlockCount < 6 || dartFileCount < 4 || importCount < 10) {
    console.error('Generated content lacks sufficient Flutter code structure:', {
      codeBlockCount,
      dartFileCount,
      importCount
    });
    throw new Error('Generated content does not meet minimum Flutter application requirements');
  }
  
  const project = {
    name: extractProjectName(description),
    description: description,
    app_type: appType,
    files: {},
    dependencies: [],
    patterns: ['Clean Architecture', 'Repository Pattern', 'Provider State Management'],
    architecture: 'Clean Architecture with MVVM',
    quality_score: 85
  };

  // Extract different file types from the generated content
  const files = extractFiles(content);
  
  // Enhanced validation with specific requirements
  if (!validateFlutterCode(files)) {
    console.log('Generated content validation failed:', {
      fileCount: Object.keys(files).length,
      hasMainDart: !!files['lib/main.dart'],
      hasPubspec: !!files['pubspec.yaml'],
      hasModels: Object.keys(files).some(f => f.includes('/models/')),
      hasScreens: Object.keys(files).some(f => f.includes('/screens/')),
      hasProviders: Object.keys(files).some(f => f.includes('/providers/'))
    });
    throw new Error('Generated content does not contain sufficient Flutter application structure');
  }
  
  project.files = files;
  
  // Extract dependencies from pubspec.yaml if present
  if (files['pubspec.yaml']) {
    project.dependencies = extractDependencies(files['pubspec.yaml']);
  }

  // Enhanced quality analysis
  project.quality_score = calculateAdvancedQualityScore(project, files);
  project.patterns = detectArchitecturalPatterns(files);

  console.log('Content parsed successfully:', {
    fileCount: Object.keys(files).length,
    dependencies: project.dependencies.length,
    qualityScore: project.quality_score,
    patterns: project.patterns
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
  
  // Essential files validation
  const requiredFiles = ['lib/main.dart', 'pubspec.yaml'];
  for (const file of requiredFiles) {
    if (!files[file]) {
      console.log(`Missing required file: ${file}`);
      return false;
    }
  }
  
  // Validate main.dart structure
  const mainDart = files['lib/main.dart'];
  const mainRequirements = ['void main()', 'runApp', 'MaterialApp', 'StatelessWidget'];
  for (const requirement of mainRequirements) {
    if (!mainDart.includes(requirement)) {
      console.log(`main.dart missing requirement: ${requirement}`);
      return false;
    }
  }
  
  // Validate pubspec.yaml structure
  const pubspec = files['pubspec.yaml'];
  const pubspecRequirements = ['flutter:', 'dependencies:', 'name:', 'version:'];
  for (const requirement of pubspecRequirements) {
    if (!pubspec.includes(requirement)) {
      console.log(`pubspec.yaml missing requirement: ${requirement}`);
      return false;
    }
  }
  
  // Check for architectural completeness
  const hasModels = Object.keys(files).some(path => path.includes('/models/'));
  const hasScreens = Object.keys(files).some(path => path.includes('/screens/') || path.includes('/pages/'));
  const hasProviders = Object.keys(files).some(path => path.includes('/providers/') || path.includes('/bloc/'));
  
  if (!hasModels || !hasScreens || !hasProviders) {
    console.log('Missing architectural components:', { hasModels, hasScreens, hasProviders });
    return false;
  }
  
  // Validate code quality and complexity
  const totalCodeLength = Object.values(files).join('').length;
  const classCount = Object.values(files).join('').match(/class\s+\w+/g)?.length || 0;
  const importCount = Object.values(files).join('').match(/import\s+['"][^'"]+['"]/g)?.length || 0;
  
  if (totalCodeLength < 5000 || classCount < 6 || importCount < 8) {
    console.log('Code complexity insufficient:', { totalCodeLength, classCount, importCount });
    return false;
  }
  
  // Validate Flutter/Dart syntax patterns
  const dartPatterns = ['extends StatelessWidget', 'extends StatefulWidget', 'extends ChangeNotifier'];
  const hasValidDartPatterns = dartPatterns.some(pattern => 
    Object.values(files).some(content => content.includes(pattern))
  );
  
  if (!hasValidDartPatterns) {
    console.log('Missing valid Dart/Flutter patterns');
    return false;
  }
  
  console.log('Flutter code validation passed with enhanced criteria');
  return true;
}

function calculateAdvancedQualityScore(project: any, files: Record<string, string>): number {
  let score = 50; // Base score
  
  const fileList = Object.keys(files);
  const allCode = Object.values(files).join('');
  
  // File structure quality (25 points max)
  const fileCount = fileList.length;
  score += Math.min(fileCount * 2, 20); // 2 points per file, max 20
  
  if (files['lib/main.dart']) score += 5;
  if (files['pubspec.yaml']) score += 3;
  if (files['README.md']) score += 2;
  
  // Architectural patterns (30 points max)
  const patterns = {
    models: fileList.some(path => path.includes('/models/')),
    screens: fileList.some(path => path.includes('/screens/') || path.includes('/pages/')),
    providers: fileList.some(path => path.includes('/providers/') || path.includes('/bloc/')),
    repositories: fileList.some(path => path.includes('/repositories/')),
    services: fileList.some(path => path.includes('/services/')),
    widgets: fileList.some(path => path.includes('/widgets/')),
    config: fileList.some(path => path.includes('/config/') || path.includes('/constants/')),
    utils: fileList.some(path => path.includes('/utils/'))
  };
  
  Object.values(patterns).forEach(hasPattern => {
    if (hasPattern) score += 4; // 4 points per pattern
  });
  
  // Code quality indicators (25 points max)
  const qualityMetrics = {
    hasJsonSerialization: allCode.includes('toJson') && allCode.includes('fromJson'),
    hasErrorHandling: allCode.includes('try') && allCode.includes('catch'),
    hasAsyncCode: allCode.includes('async') && allCode.includes('await'),
    hasStateManagement: allCode.includes('ChangeNotifier') || allCode.includes('Provider'),
    hasProperImports: (allCode.match(/import\s+['"][^'"]+['"]/g) || []).length >= 15,
    hasValidationLogic: allCode.includes('validator') || allCode.includes('validate'),
    hasLocalizations: allCode.includes('Localizations') || allCode.includes('GlobalMaterialLocalizations'),
    hasThemeConfig: allCode.includes('ThemeData') || allCode.includes('Theme.of')
  };
  
  Object.values(qualityMetrics).forEach(hasMetric => {
    if (hasMetric) score += 3; // 3 points per quality metric
  });
  
  // Code complexity and depth (20 points max)
  const classCount = (allCode.match(/class\s+\w+/g) || []).length;
  const methodCount = (allCode.match(/\w+\s*\([^)]*\)\s*{/g) || []).length;
  const totalLines = allCode.split('\n').length;
  
  if (classCount >= 10) score += 5;
  if (methodCount >= 20) score += 5;
  if (totalLines >= 1000) score += 5;
  if (project.dependencies?.length >= 5) score += 5;
  
  return Math.min(score, 100);
}

function detectArchitecturalPatterns(files: Record<string, string>): string[] {
  const patterns: string[] = [];
  const fileList = Object.keys(files);
  const allCode = Object.values(files).join('');
  
  // Detect architectural patterns
  if (fileList.some(f => f.includes('/models/')) && allCode.includes('toJson')) {
    patterns.push('Data Transfer Objects (DTO)');
  }
  
  if (fileList.some(f => f.includes('/repositories/')) && allCode.includes('Repository')) {
    patterns.push('Repository Pattern');
  }
  
  if (allCode.includes('ChangeNotifier') || allCode.includes('Provider')) {
    patterns.push('Provider State Management');
  }
  
  if (allCode.includes('BlocProvider') || allCode.includes('BlocBuilder')) {
    patterns.push('BLoC Pattern');
  }
  
  if (fileList.some(f => f.includes('/services/')) && allCode.includes('Service')) {
    patterns.push('Service Layer');
  }
  
  if (allCode.includes('Factory') && allCode.includes('fromJson')) {
    patterns.push('Factory Pattern');
  }
  
  if (allCode.includes('Singleton') || allCode.includes('getInstance')) {
    patterns.push('Singleton Pattern');
  }
  
  if (fileList.some(f => f.includes('/config/')) || allCode.includes('AppConfig')) {
    patterns.push('Configuration Pattern');
  }
  
  if (allCode.includes('dependency') || allCode.includes('inject')) {
    patterns.push('Dependency Injection');
  }
  
  // Always include these base patterns for complete Flutter apps
  patterns.push('Clean Architecture');
  patterns.push('MVVM (Model-View-ViewModel)');
  
  return [...new Set(patterns)]; // Remove duplicates
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