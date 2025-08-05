"""
Flutter AI Platform - CTO Expert Level
Advanced AI system for generating production-ready Flutter code
Following Google's official best practices and enterprise standards
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import logging
from datetime import datetime

# Import our advanced modules
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from models.cto_flutter_generator import CTOFlutterGenerator
from models.code_quality_analyzer import CodeQualityAnalyzer
from models.security_validator import SecurityValidator
from models.performance_optimizer import PerformanceOptimizer
from models.architecture_enforcer import ArchitectureEnforcer
from routes.cto_api import cto_bp

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def create_app():
    """Create and configure the Flask application"""
    app = Flask(__name__)
    
    # Enable CORS for all routes
    CORS(app, origins="*", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    
    # Register blueprints
    app.register_blueprint(cto_bp, url_prefix='/api/cto')
    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        return jsonify({
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'version': '2.0.0-cto-expert',
            'features': [
                'CTO Expert Level Code Generation',
                'Google Flutter Best Practices',
                'Production-Ready Architecture',
                'Security Validation',
                'Performance Optimization',
                'Code Quality Analysis',
                'SOLID Principles Enforcement'
            ]
        })
    
    # Root endpoint
    @app.route('/')
    def root():
        return jsonify({
            'message': 'Flutter AI Platform - CTO Expert Level',
            'description': 'Advanced AI system for generating production-ready Flutter code',
            'documentation': '/api/cto/docs',
            'health': '/health',
            'version': '2.0.0-cto-expert'
        })
    
    return app

if __name__ == '__main__':
    app = create_app()
    
    logger.info("Starting Flutter AI Platform - CTO Expert Level")
    logger.info("Features enabled:")
    logger.info("- CTO Expert Level Code Generation")
    logger.info("- Google Flutter Best Practices")
    logger.info("- Production-Ready Architecture")
    logger.info("- Security Validation")
    logger.info("- Performance Optimization")
    logger.info("- Code Quality Analysis")
    
    # Run the application
    port = int(os.environ.get('PORT', 8006))
    app.run(
        host='0.0.0.0',
        port=port,
        debug=False,
        threaded=True
    )

