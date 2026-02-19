"""
SWAG Video Generation - Gemini Veo Backend
Replaces Wan2.1 local diffuser with Google Gemini Veo API.
"""
import os
import time
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

OUTPUT_DIR = "static/videos"


def generate_video_gemini(prompt: str) -> str | None:
    """
    Generate a video from a text prompt using the Gemini Veo API.

    Args:
        prompt: The visual prompt string for video generation.

    Returns:
        URL-friendly path to the saved video file, or None on failure.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set.")

    from google import genai

    client = genai.Client(api_key=api_key)

    print(f"[GEMINI VIDEO] Submitting prompt to Veo: '{prompt[:80]}...'")

    operation = client.models.generate_videos(
        model="veo-3.1-generate-preview",
        prompt=prompt,
    )

    # Poll until the video is ready
    while not operation.done:
        print("[GEMINI VIDEO] Waiting for video generation to complete...")
        time.sleep(10)
        operation = client.operations.get(operation)

    print("[GEMINI VIDEO] Generation complete. Downloading video...")

    # Download the generated video
    generated_video = operation.response.generated_videos[0]
    client.files.download(file=generated_video.video)

    # Save to output directory
    Path(OUTPUT_DIR).mkdir(parents=True, exist_ok=True)
    timestamp = int(time.time())
    filename = f"video_{timestamp}.mp4"
    output_path = os.path.join(OUTPUT_DIR, filename)

    generated_video.video.save(output_path)
    print(f"[GEMINI VIDEO] Video saved to {output_path}")

    # Return URL-friendly path
    return f"/{OUTPUT_DIR}/{filename}".replace("\\", "/")
