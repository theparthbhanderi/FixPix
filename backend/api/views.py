from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.core.files.base import ContentFile
import time
import os
import base64
from .models import ImageProject
from .serializers import ImageProjectSerializer, RegisterSerializer, UserSerializer, MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = UserSerializer.Meta.model.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class ImageViewSet(viewsets.ModelViewSet):
    serializer_class = ImageProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ImageProject.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def process_image(self, request, pk=None):
        project = self.get_object()
        
        # Determine settings from request body (Pipeline Mode)
        # Sandbox defaults if not provided
        settings = request.data.get('settings', {})
        print(f"DEBUG: Process Image called. Settings: {settings}")
        
        # Fallback to legacy processing_type if settings empty
        algo_type = project.processing_type
        if not settings and algo_type:
             if algo_type == 'restore': settings['removeScratches'] = True
             if algo_type == 'colorize': settings['colorize'] = True
             if algo_type == 'upscale': settings['upscaleX'] = 2

        # Simulate processing delay slightly for UX (1.5s)
        project.status = 'processing'
        project.save()
        
        try:
             # Use AI Engine
            from .ai_engine import AIEngine
            from django.conf import settings as django_settings
            
            if not project.original_image:
                 return Response({'error': 'No original image'}, status=status.HTTP_400_BAD_REQUEST)
                 
            # Start pipeline with original image
            current_path = project.original_image.path
            current_img = AIEngine._read_image(current_path)
            
            # 1. Restoration (Scratches/Denoise)
            if settings.get('removeScratches', False):
                current_img = AIEngine.remove_scratches(current_img, return_path=False)

            # 2. Face Restoration
            if settings.get('faceRestoration', False):
                current_img = AIEngine.restore_faces(current_img, return_path=False)
            
            # 3. Colorization
            if settings.get('colorize', False):
                current_img = AIEngine.colorize_image(current_img, return_path=False)
                
            # 4. Adjustments (Brightness, Contrast, Saturation)
            b = float(settings.get('brightness', 1.0))
            c = float(settings.get('contrast', 1.0))
            s = float(settings.get('saturation', 1.0))
            
            if b != 1.0 or c != 1.0 or s != 1.0:
                current_img = AIEngine.adjust_image(current_img, brightness=b, contrast=c, saturation=s, return_path=False)

            # 5. Upscaling (Last step)
            upscale_x = int(settings.get('upscaleX', 1))
            if upscale_x > 1:
                current_img = AIEngine.upscale_image(current_img, scale=2, return_path=False)
                if upscale_x >= 4:
                     current_img = AIEngine.upscale_image(current_img, scale=2, return_path=False)

            # 6. Auto-Enhance (Magic Wand)
            if settings.get('autoEnhance', False):
                 current_img = AIEngine.auto_enhance(current_img, return_path=False)

            # 6.5. White Balance Correction
            if settings.get('whiteBalance', False):
                 current_img = AIEngine.correct_white_balance(current_img, return_path=False)

            # 6.6. Advanced Denoising (if strength specified)
            denoise_strength = int(settings.get('denoiseStrength', 0))
            if denoise_strength > 0:
                 current_img = AIEngine.denoise_advanced(current_img, strength=denoise_strength, return_path=False)

            # 6.7. Filter Preset
            filter_preset = settings.get('filterPreset', '')
            if filter_preset and filter_preset != 'none':
                 current_img = AIEngine.apply_filter_preset(current_img, filter_preset, return_path=False)

            # 7. Background Removal
            if settings.get('removeBackground', False):
                 try:
                    current_img = AIEngine.remove_background(current_img, return_path=False)
                 except Exception as e:
                    print(f"BG Removal Failed: {e}")
            
            # 8. Object Removal (Inpainting)
            mask_data = request.data.get('mask')
            if mask_data:
                # Expecting "data:image/png;base64,..."
                if 'base64,' in mask_data:
                    mask_data = mask_data.split('base64,')[1]
                
                # Save mask temporarily
                mask_content = base64.b64decode(mask_data)
                mask_filename = f"mask_{pk}_{int(time.time())}.png"
                mask_path = os.path.join(django_settings.MEDIA_ROOT, 'temp', mask_filename)
                os.makedirs(os.path.dirname(mask_path), exist_ok=True)
                
                with open(mask_path, 'wb') as f:
                    f.write(mask_content)
                
                # Run Inpainting
                current_img = AIEngine.inpaint_object(current_img, mask_path, return_path=False)
                
                # Clean up mask
                if os.path.exists(mask_path):
                    os.remove(mask_path)
            
            # Final Save
            # We use the original path to generate the filename base
            # If current_img is mixed input (e.g. from scratch), ensure we save it.
            # Using _save_result directly
            final_rel_path = AIEngine._save_result(current_img, project.original_image.path, 'edited', return_path=True)
            
            current_path = os.path.join(django_settings.MEDIA_ROOT, final_rel_path)

            # Make relative path for DB
            # current_path is absolute. Need relative to MEDIA_ROOT?
            # AIEngine returns 'processed/file.ext' relative to MEDIA_ROOT usually.
            # But we kept overwriting current_path with Absolute.
            # We need to extract the relative part for the final save.
            
            final_rel_path = os.path.relpath(current_path, django_settings.MEDIA_ROOT)
            
            
            project.processed_image.name = final_rel_path
            # Save the settings used for this generation
            project.settings = settings
            project.status = 'completed'
            project.save()
            
            serializer = self.get_serializer(project)
            return Response(serializer.data)
            
        except Exception as e:
            project.status = 'failed'
            project.save()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'], permission_classes=[AllowAny])
    def download(self, request, pk=None):
        """
        Serve the processed image as a downloadable attachment.
        Supports format conversion and quality control.
        Query Params:
        - format: 'png', 'jpg', 'jpeg', 'webp' (default: original ext or png)
        - quality: 1-100 (default: 90)
        """
        from django.http import FileResponse, HttpResponse
        import mimetypes
        from PIL import Image
        import io
        
        try:
            # Bypass get_object() which filters by user (since we are AllowAny now)
            project = ImageProject.objects.get(pk=pk)
        except ImageProject.DoesNotExist:
            return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if not project.processed_image:
             return Response({'error': 'No processed image available'}, status=status.HTTP_404_NOT_FOUND)
             
        file_path = project.processed_image.path
        if not os.path.exists(file_path):
            return Response({'error': 'File not found on server'}, status=status.HTTP_404_NOT_FOUND)

        # Parse Query Params
        target_format = request.query_params.get('format', '').lower()
        quality_param = request.query_params.get('quality', '90')
        
        try:
            quality = int(quality_param)
            quality = max(1, min(100, quality))
        except ValueError:
            quality = 90

        # If no specific format requested, serve raw file (fastest) unless resizing/re-encoding needed?
        # Actually, let's always use PIL if format/quality is specified to ensure it applies.
        # But if format is empty and quality is default, serve raw.
        original_ext = os.path.splitext(file_path)[1].lower().replace('.', '')
        if original_ext == 'jpeg': original_ext = 'jpg'
        
        if not target_format:
            target_format = original_ext
        if target_format == 'jpeg': target_format = 'jpg'

        # Optimize: If requested format matches original AND quality is high/default, serve distinct file
        # But user might want to Compress (quality 50) same format.
        # Simple Logic: Open, Convert, Save to Buffer.
        
        try:
            with Image.open(file_path) as img:
                # Convert RGBA to RGB if saving as JPEG
                if target_format == 'jpg' and img.mode == 'RGBA':
                    img = img.convert('RGB')
                
                # Buffer
                buffer = io.BytesIO()
                
                # Save mapping
                pil_format = target_format.upper()
                if pil_format == 'JPG': pil_format = 'JPEG'
                
                # Save parameters
                save_params = {'format': pil_format}
                if target_format in ['jpg', 'jpeg', 'webp']:
                    save_params['quality'] = quality
                    # Optimize for webp
                    if target_format == 'webp':
                        save_params['method'] = 6
                
                img.save(buffer, **save_params)
                buffer.seek(0)
                
                # Generate filename
                timestamp = int(time.time())
                filename = f"fixpix_export_{timestamp}.{target_format}"
                content_type = mimetypes.guess_type(filename)[0] or f'image/{target_format}'
                
                return FileResponse(buffer, as_attachment=True, filename=filename, content_type=content_type)
        except Exception as e:
            print(f"Export Error: {e}")
            return Response({'error': 'Error generating export'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
