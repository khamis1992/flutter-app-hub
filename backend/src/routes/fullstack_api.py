"""
Full Stack API Routes
API endpoints for generating complete full-stack applications
"""

from flask import Blueprint, request, jsonify
import logging
from datetime import datetime
from typing import Dict, Any

from models.fullstack_generator import FullStackGenerator

logger = logging.getLogger(__name__)

# Create blueprint
fullstack_bp = Blueprint('fullstack', __name__)

# Initialize full stack generator
fullstack_generator = FullStackGenerator()

@fullstack_bp.route('/generate', methods=['POST'])
def generate_fullstack_app():
    """
    Generate a complete full-stack application
    
    Expected JSON payload:
    {
        "description": "User's app description",
        "app_type": "ecommerce|social|productivity|general",
        "backend_type": "flask|express|fastapi",
        "database_type": "sqlite|postgresql|mongodb",
        "model_name": "gpt-4o-mini",  // optional
        "requirements": {
            "features": ["user_auth", "file_upload", "real_time"],
            "platforms": ["android", "ios", "web"],
            "complexity": "simple|medium|complex"
        },
        "preferences": {
            "state_management": "provider|riverpod|bloc",
            "architecture": "clean",
            "testing": true,
            "documentation": true,
            "deployment": "docker|kubernetes|serverless"
        }
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No JSON data provided',
                'timestamp': datetime.utcnow().isoformat()
            }), 400
        
        # Extract parameters
        description = data.get('description', '')
        app_type = data.get('app_type', 'general')
        backend_type = data.get('backend_type', 'flask')
        database_type = data.get('database_type', 'sqlite')
        model_name = data.get('model_name')
        requirements = data.get('requirements', {})
        preferences = data.get('preferences', {})
        
        # Validate input
        if not description:
            return jsonify({
                'success': False,
                'error': 'App description is required',
                'timestamp': datetime.utcnow().isoformat()
            }), 400
        
        # Validate backend type
        valid_backends = ['flask', 'express', 'fastapi']
        if backend_type not in valid_backends:
            return jsonify({
                'success': False,
                'error': f'Invalid backend_type. Must be one of: {valid_backends}',
                'timestamp': datetime.utcnow().isoformat()
            }), 400
        
        # Validate database type
        valid_databases = ['sqlite', 'postgresql', 'mongodb', 'mysql']
        if database_type not in valid_databases:
            return jsonify({
                'success': False,
                'error': f'Invalid database_type. Must be one of: {valid_databases}',
                'timestamp': datetime.utcnow().isoformat()
            }), 400
        
        logger.info(f"Generating full-stack {app_type} app")
        logger.info(f"Backend: {backend_type}, Database: {database_type}")
        logger.info(f"Description: {description[:100]}...")
        
        # Generate the full-stack application
        result = fullstack_generator.generate_fullstack_app(
            user_request=description,
            app_type=app_type,
            backend_type=backend_type,
            database_type=database_type,
            model_name=model_name
        )
        
        if result.get('success'):
            # Add request metadata to response
            result['request_info'] = {
                'description': description,
                'app_type': app_type,
                'backend_type': backend_type,
                'database_type': database_type,
                'requirements': requirements,
                'preferences': preferences,
                'timestamp': datetime.utcnow().isoformat()
            }
            
            logger.info(f"Successfully generated full-stack app: {result['project']['name']}")
            return jsonify(result)
        else:
            logger.error(f"Failed to generate full-stack app: {result.get('error')}")
            return jsonify(result), 500
            
    except Exception as e:
        logger.error(f"Error in generate_fullstack_app: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@fullstack_bp.route('/templates', methods=['GET'])
def get_fullstack_templates():
    """
    Get available full-stack application templates
    """
    try:
        templates = {
            'ecommerce': {
                'name': 'E-commerce Platform',
                'description': 'Complete online store with product catalog, shopping cart, payment integration',
                'features': [
                    'Product management',
                    'Shopping cart',
                    'Payment processing',
                    'Order management',
                    'User accounts',
                    'Admin dashboard',
                    'Inventory tracking',
                    'Reviews and ratings'
                ],
                'tech_stack': {
                    'frontend': 'Flutter',
                    'backend': 'Flask/Express',
                    'database': 'PostgreSQL',
                    'payment': 'Stripe/PayPal',
                    'storage': 'AWS S3/CloudFlare'
                },
                'estimated_time': '2-3 weeks'
            },
            'social': {
                'name': 'Social Media Platform',
                'description': 'Social networking app with posts, messaging, and real-time features',
                'features': [
                    'User profiles',
                    'Posts and feeds',
                    'Real-time messaging',
                    'Friend connections',
                    'Media sharing',
                    'Notifications',
                    'Content moderation',
                    'Analytics dashboard'
                ],
                'tech_stack': {
                    'frontend': 'Flutter',
                    'backend': 'Flask/Express',
                    'database': 'MongoDB',
                    'real_time': 'WebSockets',
                    'storage': 'AWS S3'
                },
                'estimated_time': '3-4 weeks'
            },
            'productivity': {
                'name': 'Productivity Suite',
                'description': 'Task management and collaboration platform',
                'features': [
                    'Task management',
                    'Project tracking',
                    'Team collaboration',
                    'File sharing',
                    'Calendar integration',
                    'Time tracking',
                    'Reporting',
                    'Mobile sync'
                ],
                'tech_stack': {
                    'frontend': 'Flutter',
                    'backend': 'Flask/FastAPI',
                    'database': 'PostgreSQL',
                    'sync': 'Real-time updates',
                    'storage': 'Local/Cloud'
                },
                'estimated_time': '2-3 weeks'
            },
            'healthcare': {
                'name': 'Healthcare Management',
                'description': 'Patient management and telemedicine platform',
                'features': [
                    'Patient records',
                    'Appointment scheduling',
                    'Telemedicine',
                    'Prescription management',
                    'Medical history',
                    'Doctor dashboard',
                    'Insurance integration',
                    'HIPAA compliance'
                ],
                'tech_stack': {
                    'frontend': 'Flutter',
                    'backend': 'Flask/FastAPI',
                    'database': 'PostgreSQL',
                    'security': 'End-to-end encryption',
                    'compliance': 'HIPAA'
                },
                'estimated_time': '4-5 weeks'
            },
            'education': {
                'name': 'Learning Management System',
                'description': 'Online education platform with courses and assessments',
                'features': [
                    'Course management',
                    'Video streaming',
                    'Assessments and quizzes',
                    'Progress tracking',
                    'Student dashboard',
                    'Instructor tools',
                    'Certificates',
                    'Discussion forums'
                ],
                'tech_stack': {
                    'frontend': 'Flutter',
                    'backend': 'Flask/Express',
                    'database': 'PostgreSQL',
                    'video': 'Video streaming',
                    'storage': 'CDN'
                },
                'estimated_time': '3-4 weeks'
            },
            'fintech': {
                'name': 'Financial Technology App',
                'description': 'Digital banking and financial management platform',
                'features': [
                    'Account management',
                    'Transaction history',
                    'Money transfers',
                    'Budget tracking',
                    'Investment portfolio',
                    'Security features',
                    'KYC compliance',
                    'Analytics'
                ],
                'tech_stack': {
                    'frontend': 'Flutter',
                    'backend': 'Flask/FastAPI',
                    'database': 'PostgreSQL',
                    'security': 'Bank-level encryption',
                    'compliance': 'PCI DSS'
                },
                'estimated_time': '4-6 weeks'
            }
        }
        
        return jsonify({
            'success': True,
            'templates': templates,
            'total_count': len(templates),
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error getting templates: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@fullstack_bp.route('/estimate', methods=['POST'])
def estimate_project():
    """
    Estimate project complexity and development time
    
    Expected JSON payload:
    {
        "description": "Project description",
        "features": ["feature1", "feature2"],
        "app_type": "ecommerce",
        "backend_type": "flask",
        "database_type": "postgresql"
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'No JSON data provided',
                'timestamp': datetime.utcnow().isoformat()
            }), 400
        
        description = data.get('description', '')
        features = data.get('features', [])
        app_type = data.get('app_type', 'general')
        backend_type = data.get('backend_type', 'flask')
        database_type = data.get('database_type', 'sqlite')
        
        # Calculate complexity score
        complexity_score = 0
        
        # Base complexity by app type
        app_complexity = {
            'general': 1,
            'productivity': 2,
            'ecommerce': 3,
            'social': 4,
            'healthcare': 5,
            'fintech': 5
        }
        complexity_score += app_complexity.get(app_type, 1)
        
        # Add complexity for features
        feature_complexity = {
            'user_auth': 1,
            'file_upload': 1,
            'real_time': 2,
            'payment': 3,
            'video_streaming': 3,
            'ai_integration': 2,
            'analytics': 2,
            'admin_dashboard': 2
        }
        
        for feature in features:
            complexity_score += feature_complexity.get(feature, 1)
        
        # Backend complexity
        backend_complexity = {
            'flask': 1,
            'express': 1,
            'fastapi': 1.5
        }
        complexity_score += backend_complexity.get(backend_type, 1)
        
        # Database complexity
        db_complexity = {
            'sqlite': 1,
            'postgresql': 1.5,
            'mongodb': 2,
            'mysql': 1.5
        }
        complexity_score += db_complexity.get(database_type, 1)
        
        # Determine complexity level
        if complexity_score <= 5:
            complexity_level = 'Simple'
            estimated_days = '5-10 days'
            estimated_cost = '$2,000 - $5,000'
        elif complexity_score <= 10:
            complexity_level = 'Medium'
            estimated_days = '2-3 weeks'
            estimated_cost = '$5,000 - $15,000'
        elif complexity_score <= 15:
            complexity_level = 'Complex'
            estimated_days = '1-2 months'
            estimated_cost = '$15,000 - $50,000'
        else:
            complexity_level = 'Enterprise'
            estimated_days = '2-6 months'
            estimated_cost = '$50,000+'
        
        return jsonify({
            'success': True,
            'estimate': {
                'complexity_level': complexity_level,
                'complexity_score': complexity_score,
                'estimated_development_time': estimated_days,
                'estimated_cost': estimated_cost,
                'recommended_team_size': '2-4 developers' if complexity_score <= 10 else '4-8 developers',
                'tech_stack': {
                    'frontend': 'Flutter',
                    'backend': backend_type,
                    'database': database_type
                },
                'deliverables': [
                    'Flutter mobile app (iOS & Android)',
                    f'{backend_type.title()} backend API',
                    f'{database_type.title()} database',
                    'Authentication system',
                    'Admin dashboard',
                    'API documentation',
                    'Deployment configuration',
                    'Testing suite'
                ]
            },
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error estimating project: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@fullstack_bp.route('/health', methods=['GET'])
def fullstack_health_check():
    """
    Health check for full-stack generation service
    """
    try:
        return jsonify({
            'success': True,
            'service': 'Full Stack Generator',
            'status': 'healthy',
            'features': [
                'Flutter frontend generation',
                'Backend API generation (Flask/Express/FastAPI)',
                'Database schema generation',
                'Authentication system',
                'Deployment configurations',
                'Multi-model AI support'
            ],
            'supported_backends': ['flask', 'express', 'fastapi'],
            'supported_databases': ['sqlite', 'postgresql', 'mongodb', 'mysql'],
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error in health check: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

