"""
Model Manager - Support for Multiple AI Models
Supports OpenAI, DeepSeek, Claude, and other AI models
"""

import os
import logging
from typing import Dict, Any, Optional, List
from enum import Enum
import json

logger = logging.getLogger(__name__)

class ModelProvider(Enum):
    """Supported AI model providers"""
    OPENAI = "openai"
    DEEPSEEK = "deepseek"
    CLAUDE = "claude"
    GEMINI = "gemini"
    LOCAL = "local"

class ModelConfig:
    """Configuration for AI models"""
    
    def __init__(self, provider: ModelProvider, model_name: str, api_key: str, 
                 base_url: Optional[str] = None, max_tokens: int = 4000,
                 temperature: float = 0.7, **kwargs):
        self.provider = provider
        self.model_name = model_name
        self.api_key = api_key
        self.base_url = base_url
        self.max_tokens = max_tokens
        self.temperature = temperature
        self.extra_params = kwargs

class ModelManager:
    """
    Manages multiple AI models and provides unified interface
    Supports dynamic switching between different AI providers
    """
    
    def __init__(self):
        """Initialize Model Manager with available models"""
        self.models: Dict[str, ModelConfig] = {}
        self.current_model = None
        self.load_model_configurations()
        
    def load_model_configurations(self):
        """Load model configurations from environment variables"""
        
        # OpenAI Models
        openai_key = os.getenv('OPENAI_API_KEY')
        if openai_key:
            self.add_model("gpt-4o-mini", ModelConfig(
                provider=ModelProvider.OPENAI,
                model_name="gpt-4o-mini",
                api_key=openai_key,
                base_url=os.getenv('OPENAI_API_BASE', 'https://api.openai.com/v1'),
                max_tokens=4000,
                temperature=0.7
            ))
            
            self.add_model("gpt-4", ModelConfig(
                provider=ModelProvider.OPENAI,
                model_name="gpt-4",
                api_key=openai_key,
                base_url=os.getenv('OPENAI_API_BASE', 'https://api.openai.com/v1'),
                max_tokens=4000,
                temperature=0.7
            ))
        
        # DeepSeek Models
        deepseek_key = os.getenv('DEEPSEEK_API_KEY')
        if deepseek_key:
            self.add_model("deepseek-coder", ModelConfig(
                provider=ModelProvider.DEEPSEEK,
                model_name="deepseek-coder",
                api_key=deepseek_key,
                base_url=os.getenv('DEEPSEEK_API_BASE', 'https://api.deepseek.com/v1'),
                max_tokens=4000,
                temperature=0.7
            ))
            
            self.add_model("deepseek-chat", ModelConfig(
                provider=ModelProvider.DEEPSEEK,
                model_name="deepseek-chat",
                api_key=deepseek_key,
                base_url=os.getenv('DEEPSEEK_API_BASE', 'https://api.deepseek.com/v1'),
                max_tokens=4000,
                temperature=0.7
            ))
        
        # Claude Models
        claude_key = os.getenv('CLAUDE_API_KEY')
        if claude_key:
            self.add_model("claude-3-sonnet", ModelConfig(
                provider=ModelProvider.CLAUDE,
                model_name="claude-3-sonnet-20240229",
                api_key=claude_key,
                base_url=os.getenv('CLAUDE_API_BASE', 'https://api.anthropic.com'),
                max_tokens=4000,
                temperature=0.7
            ))
        
        # Gemini Models
        gemini_key = os.getenv('GEMINI_API_KEY')
        if gemini_key:
            self.add_model("gemini-pro", ModelConfig(
                provider=ModelProvider.GEMINI,
                model_name="gemini-pro",
                api_key=gemini_key,
                base_url=os.getenv('GEMINI_API_BASE', 'https://generativelanguage.googleapis.com'),
                max_tokens=4000,
                temperature=0.7
            ))
        
        # Set default model
        if self.models:
            self.current_model = list(self.models.keys())[0]
            logger.info(f"Model Manager initialized with {len(self.models)} models")
            logger.info(f"Default model: {self.current_model}")
        else:
            logger.warning("No AI models configured. Please set API keys.")
    
    def add_model(self, name: str, config: ModelConfig):
        """Add a new model configuration"""
        self.models[name] = config
        logger.info(f"Added model: {name} ({config.provider.value})")
    
    def switch_model(self, model_name: str) -> bool:
        """Switch to a different model"""
        if model_name in self.models:
            self.current_model = model_name
            logger.info(f"Switched to model: {model_name}")
            return True
        else:
            logger.error(f"Model not found: {model_name}")
            return False
    
    def get_current_model(self) -> Optional[ModelConfig]:
        """Get current model configuration"""
        if self.current_model:
            return self.models[self.current_model]
        return None
    
    def get_available_models(self) -> List[Dict[str, Any]]:
        """Get list of available models"""
        return [
            {
                "name": name,
                "provider": config.provider.value,
                "model_name": config.model_name,
                "max_tokens": config.max_tokens,
                "temperature": config.temperature
            }
            for name, config in self.models.items()
        ]
    
    def create_client(self, model_name: Optional[str] = None):
        """Create appropriate client for the specified model"""
        target_model = model_name or self.current_model
        if not target_model or target_model not in self.models:
            raise ValueError(f"Model not available: {target_model}")
        
        config = self.models[target_model]
        
        if config.provider == ModelProvider.OPENAI:
            from openai import OpenAI
            return OpenAI(
                api_key=config.api_key,
                base_url=config.base_url
            )
        
        elif config.provider == ModelProvider.DEEPSEEK:
            from openai import OpenAI  # DeepSeek uses OpenAI-compatible API
            return OpenAI(
                api_key=config.api_key,
                base_url=config.base_url
            )
        
        elif config.provider == ModelProvider.CLAUDE:
            try:
                import anthropic
                return anthropic.Anthropic(api_key=config.api_key)
            except ImportError:
                logger.error("anthropic package not installed. Install with: pip install anthropic")
                raise
        
        elif config.provider == ModelProvider.GEMINI:
            try:
                import google.generativeai as genai
                genai.configure(api_key=config.api_key)
                return genai.GenerativeModel(config.model_name)
            except ImportError:
                logger.error("google-generativeai package not installed. Install with: pip install google-generativeai")
                raise
        
        else:
            raise ValueError(f"Unsupported provider: {config.provider}")
    
    def generate_completion(self, prompt: str, model_name: Optional[str] = None, **kwargs) -> str:
        """Generate completion using the specified or current model"""
        target_model = model_name or self.current_model
        if not target_model:
            raise ValueError("No model available")
        
        config = self.models[target_model]
        client = self.create_client(target_model)
        
        # Merge kwargs with model config
        params = {
            "temperature": config.temperature,
            "max_tokens": config.max_tokens,
            **kwargs
        }
        
        try:
            if config.provider in [ModelProvider.OPENAI, ModelProvider.DEEPSEEK]:
                response = client.chat.completions.create(
                    model=config.model_name,
                    messages=[{"role": "user", "content": prompt}],
                    **params
                )
                return response.choices[0].message.content
            
            elif config.provider == ModelProvider.CLAUDE:
                response = client.messages.create(
                    model=config.model_name,
                    messages=[{"role": "user", "content": prompt}],
                    **params
                )
                return response.content[0].text
            
            elif config.provider == ModelProvider.GEMINI:
                response = client.generate_content(prompt)
                return response.text
            
            else:
                raise ValueError(f"Unsupported provider: {config.provider}")
                
        except Exception as e:
            logger.error(f"Error generating completion with {target_model}: {str(e)}")
            raise
    
    def get_model_info(self, model_name: Optional[str] = None) -> Dict[str, Any]:
        """Get information about a specific model"""
        target_model = model_name or self.current_model
        if not target_model or target_model not in self.models:
            return {}
        
        config = self.models[target_model]
        return {
            "name": target_model,
            "provider": config.provider.value,
            "model_name": config.model_name,
            "max_tokens": config.max_tokens,
            "temperature": config.temperature,
            "base_url": config.base_url,
            "is_current": target_model == self.current_model
        }

# Global model manager instance
model_manager = ModelManager()

