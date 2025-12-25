"""
Celery Tasks for FixPix

Background tasks for heavy AI image processing operations.
These run in Celery workers, not the main web server.
"""

from celery import shared_task
from django.conf import settings
import os


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def process_image_async(self, image_id, process_settings):
    """
    Async task to process an image with AI engine.
    
    Args:
        image_id: ID of the ImageProject to process
        process_settings: Dict of processing settings
    """
    from api.models import ImageProject
    from api.ai_engine import AIEngine
    
    try:
        project = ImageProject.objects.get(id=image_id)
        project.status = 'processing'
        project.save()
        
        # Get absolute path to original image
        original_path = os.path.join(settings.MEDIA_ROOT, str(project.original_image))
        
        # Start with original image
        current_image = original_path
        
        # Apply processing based on settings
        if process_settings.get('colorize'):
            current_image = AIEngine.colorize_image(current_image, return_path=True, ref_path=original_path)
            current_image = os.path.join(settings.MEDIA_ROOT, current_image)
            
        if process_settings.get('removeScratches'):
            strength = process_settings.get('denoiseStrength', 50)
            current_image = AIEngine.remove_scratches(current_image, strength=strength, return_path=True, ref_path=original_path)
            current_image = os.path.join(settings.MEDIA_ROOT, current_image)
            
        if process_settings.get('faceRestoration'):
            current_image = AIEngine.restore_faces(current_image, return_path=True, ref_path=original_path)
            current_image = os.path.join(settings.MEDIA_ROOT, current_image)
            
        if process_settings.get('autoEnhance'):
            current_image = AIEngine.auto_enhance(current_image, return_path=True, ref_path=original_path)
            current_image = os.path.join(settings.MEDIA_ROOT, current_image)
            
        if process_settings.get('removeBackground'):
            current_image = AIEngine.remove_background(current_image, return_path=True, ref_path=original_path)
            current_image = os.path.join(settings.MEDIA_ROOT, current_image)
        
        # Get final relative path
        if os.path.isabs(current_image):
            final_path = os.path.relpath(current_image, settings.MEDIA_ROOT)
        else:
            final_path = current_image
            
        # Update project
        project.processed_image = final_path
        project.settings = process_settings
        project.status = 'completed'
        project.save()
        
        return {'status': 'success', 'image_id': image_id}
        
    except ImageProject.DoesNotExist:
        return {'status': 'error', 'message': 'Project not found'}
    except Exception as exc:
        # Retry on failure
        project.status = 'error'
        project.save()
        raise self.retry(exc=exc)


@shared_task
def cleanup_old_processed_images(days=7):
    """
    Periodic task to clean up old processed images.
    Run via Celery Beat scheduler.
    """
    from api.models import ImageProject
    from django.utils import timezone
    from datetime import timedelta
    
    cutoff = timezone.now() - timedelta(days=days)
    old_projects = ImageProject.objects.filter(
        updated_at__lt=cutoff,
        processed_image__isnull=False
    )
    
    deleted_count = 0
    for project in old_projects:
        if project.processed_image:
            path = os.path.join(settings.MEDIA_ROOT, str(project.processed_image))
            if os.path.exists(path):
                os.remove(path)
                deleted_count += 1
                
    return f'Cleaned up {deleted_count} old processed images'
