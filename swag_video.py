import torch
from diffusers import DiffusionPipeline, DPMSolverMultistepScheduler
from diffusers.utils import export_to_video
import os

# Configuration
MODEL_ID = "Wan-AI/Wan2.1-T2V-1.3B"
OUTPUT_DIR = "static/videos"

class VideoGenerator:
    def __init__(self):
        self.pipeline = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.dtype = torch.float16 if self.device == "cuda" else torch.float32

    def load_model(self):
        """Load the Wan 2.1 model pipeline."""
        if self.pipeline is not None:
            return

        print(f"Loading video generation model: {MODEL_ID}...")
        try:
            # Using generic localized pipeline loading if specific class not found
            # Note: For Wan 2.1 specifically, we might need a custom pipeline or specific class
            # attempting standard DiffusionPipeline first.
            self.pipeline = DiffusionPipeline.from_pretrained(
                MODEL_ID, 
                torch_dtype=self.dtype,
                variant="fp16" if self.device == "cuda" else None
            )
            
            # Utilize DPM-Solver for speed/quality balance
            self.pipeline.scheduler = DPMSolverMultistepScheduler.from_config(self.pipeline.scheduler.config)
            
            if self.device == "cuda":
                self.pipeline.enable_model_cpu_offload() # Save VRAM
                
            print("Model loaded successfully.")
        except Exception as e:
            print(f"Error loading model {MODEL_ID}: {e}")
            raise e

    def generate_video(self, prompt, num_frames=16, height=320, width=512, num_inference_steps=25):
        """Generate video from text prompt."""
        if not self.pipeline:
            self.load_model()

        print(f"Generating video for prompt: '{prompt}'")
        
        # Ensure output directory exists
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        
        try:
            video_frames = self.pipeline(
                prompt, 
                num_inference_steps=num_inference_steps,
                height=height,
                width=width,
                num_frames=num_frames
            ).frames[0]
            
            # Generate filename based on prompt hash or timestamp
            import time
            timestamp = int(time.time())
            filename = f"video_{timestamp}.mp4"
            output_path = os.path.join(OUTPUT_DIR, filename)
            
            export_to_video(video_frames, output_path, fps=8)
            print(f"Video saved to {output_path}")
            
            return f"/{OUTPUT_DIR}/{filename}".replace("\\", "/") # Return URL-friendly path
            
        except Exception as e:
            print(f"Generation failed: {e}")
            return None

if __name__ == "__main__":
    # verification
    generator = VideoGenerator()
    try:
        generator.load_model()
        print("Model loading test passed.")
    except Exception as e:
        print(f"Model loading test failed: {e}")
