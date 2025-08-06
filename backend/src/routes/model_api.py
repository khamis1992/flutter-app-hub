"""
Model Management API Routes
API endpoints for managing AI models and switching between them
"""

from flask import Blueprint, request, jsonify
import logging
from datetime import datetime
from typing import Dict, Any

from models.model_manager import model_manager

logger = logging.getLogger(__name__)

# Create blueprint
model_bp = Blueprint('models', __name__)

@model_bp.route('/available', methods=['GET'])
def get_available_models():
    """
    Get list of available AI models
    
    Returns:
        JSON response with available models and their configurations
    """
    try:
        models = model_manager.get_available_models()
        current_model = model_manager.get_model_info()
        
        return jsonify({
            'success': True,
            'models': models,
            'current_model': current_model,
            'total_count': len(models),
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error getting available models: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@model_bp.route('/switch', methods=['POST'])
def switch_model():
    """
    Switch to a different AI model
    
    Expected JSON payload:
    {
        "model_name": "gpt-4o-mini"
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'model_name' not in data:
            return jsonify({
                'success': False,
                'error': 'model_name is required',
                'timestamp': datetime.utcnow().isoformat()
            }), 400
        
        model_name = data['model_name']
        
        # Switch to the specified model
        success = model_manager.switch_model(model_name)
        
        if success:
            current_model = model_manager.get_model_info()
            return jsonify({
                'success': True,
                'message': f'Successfully switched to {model_name}',
                'current_model': current_model,
                'timestamp': datetime.utcnow().isoformat()
            })
        else:
            return jsonify({
                'success': False,
                'error': f'Model not found: {model_name}',
                'available_models': [m['name'] for m in model_manager.get_available_models()],
                'timestamp': datetime.utcnow().isoformat()
            }), 404
            
    except Exception as e:
        logger.error(f"Error switching model: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@model_bp.route('/current', methods=['GET'])
def get_current_model():
    """
    Get information about the currently active model
    """
    try:
        current_model = model_manager.get_model_info()
        
        if current_model:
            return jsonify({
                'success': True,
                'current_model': current_model,
                'timestamp': datetime.utcnow().isoformat()
            })
        else:
            return jsonify({
                'success': False,
                'error': 'No model currently active',
                'timestamp': datetime.utcnow().isoformat()
            }), 404
            
    except Exception as e:
        logger.error(f"Error getting current model: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@model_bp.route('/test', methods=['POST'])
def test_model():
    """
    Test a specific model with a simple prompt
    
    Expected JSON payload:
    {
        "model_name": "gpt-4o-mini",  // optional
        "prompt": "Hello, how are you?"
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'prompt' not in data:
            return jsonify({
                'success': False,
                'error': 'prompt is required',
                'timestamp': datetime.utcnow().isoformat()
            }), 400
        
        prompt = data['prompt']
        model_name = data.get('model_name')
        
        # Test the model
        start_time = datetime.utcnow()
        response = model_manager.generate_completion(prompt, model_name)
        end_time = datetime.utcnow()
        
        response_time = (end_time - start_time).total_seconds()
        
        return jsonify({
            'success': True,
            'response': response,
            'model_used': model_manager.get_model_info(model_name),
            'response_time_seconds': response_time,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error testing model: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'model_used': model_manager.get_model_info(),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@model_bp.route('/configure', methods=['POST'])
def configure_model():
    """
    Configure model parameters (temperature, max_tokens, etc.)
    
    Expected JSON payload:
    {
        "model_name": "gpt-4o-mini",
        "temperature": 0.7,
        "max_tokens": 4000
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'model_name' not in data:
            return jsonify({
                'success': False,
                'error': 'model_name is required',
                'timestamp': datetime.utcnow().isoformat()
            }), 400
        
        model_name = data['model_name']
        
        # Check if model exists
        if model_name not in model_manager.models:
            return jsonify({
                'success': False,
                'error': f'Model not found: {model_name}',
                'available_models': [m['name'] for m in model_manager.get_available_models()],
                'timestamp': datetime.utcnow().isoformat()
            }), 404
        
        # Update model configuration
        config = model_manager.models[model_name]
        
        if 'temperature' in data:
            config.temperature = float(data['temperature'])
        if 'max_tokens' in data:
            config.max_tokens = int(data['max_tokens'])
        
        # Update extra parameters
        for key, value in data.items():
            if key not in ['model_name', 'temperature', 'max_tokens']:
                config.extra_params[key] = value
        
        return jsonify({
            'success': True,
            'message': f'Model {model_name} configured successfully',
            'model_config': model_manager.get_model_info(model_name),
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error configuring model: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@model_bp.route('/health', methods=['GET'])
def model_health_check():
    """
    Check health status of all configured models
    """
    try:
        models = model_manager.get_available_models()
        health_status = []
        
        for model in models:
            try:
                # Test with a simple prompt
                test_prompt = "Hello"
                response = model_manager.generate_completion(
                    test_prompt, 
                    model['name']
                )
                
                health_status.append({
                    'model': model['name'],
                    'status': 'healthy',
                    'provider': model['provider'],
                    'response_length': len(response) if response else 0
                })
                
            except Exception as e:
                health_status.append({
                    'model': model['name'],
                    'status': 'unhealthy',
                    'provider': model['provider'],
                    'error': str(e)
                })
        
        healthy_count = sum(1 for status in health_status if status['status'] == 'healthy')
        
        return jsonify({
            'success': True,
            'overall_status': 'healthy' if healthy_count > 0 else 'unhealthy',
            'healthy_models': healthy_count,
            'total_models': len(health_status),
            'models': health_status,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error checking model health: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

