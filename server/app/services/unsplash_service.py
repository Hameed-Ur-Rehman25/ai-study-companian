"""
Unsplash API service for fetching relevant images
"""
import os
import logging
import requests
from typing import Optional, Dict
from pathlib import Path

logger = logging.getLogger(__name__)


class UnsplashService:
    """Service for searching and downloading images from Unsplash"""
    
    def __init__(self):
        self.access_key = os.getenv("UNSPLASH_ACCESS_KEY")
        if not self.access_key:
            logger.warning("UNSPLASH_ACCESS_KEY not set - image fetching will be disabled")
        
        self.base_url = "https://api.unsplash.com"
    
    def search_image(self, query: str, orientation: str = "landscape") -> Optional[Dict]:
        """
        Search for an image on Unsplash
        
        Args:
            query: Search query (keywords)
            orientation: 'landscape', 'portrait', or 'squarish'
            
        Returns:
            Dict with 'url' and 'download_location' or None if not found
        """
        if not self.access_key:
            logger.warning("Cannot search Unsplash - no access key configured")
            return None
        
        try:
            params = {
                "query": query,
                "orientation": orientation,
                "per_page": 1,
                "order_by": "relevant"
            }
            
            headers = {
                "Authorization": f"Client-ID {self.access_key}"
            }
            
            response = requests.get(
                f"{self.base_url}/search/photos",
                params=params,
                headers=headers,
                timeout=10
            )
            
            if response.status_code != 200:
                logger.error(f"Unsplash API error: {response.status_code} - {response.text}")
                return None
            
            data = response.json()
            
            if not data.get("results"):
                logger.warning(f"No images found for query: {query}")
                return None
            
            photo = data["results"][0]
            
            # Get the regular size URL (good quality, not too large)
            return {
                "url": photo["urls"]["regular"],
                "download_location": photo["links"]["download_location"],
                "photographer": photo["user"]["name"],
                "photographer_url": photo["user"]["links"]["html"]
            }
        
        except Exception as e:
            logger.error(f"Error searching Unsplash: {e}")
            return None
    
    def download_image(self, image_url: str, save_path: Path) -> bool:
        """
        Download an image from URL to local path
        
        Args:
            image_url: URL of image to download
            save_path: Path to save the image
            
        Returns:
            True if successful, False otherwise
        """
        try:
            response = requests.get(image_url, timeout=30, stream=True)
            
            if response.status_code != 200:
                logger.error(f"Failed to download image: {response.status_code}")
                return False
            
            # Ensure parent directory exists
            save_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Save image
            with open(save_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            logger.info(f"Downloaded image to {save_path}")
            return True
        
        except Exception as e:
            logger.error(f"Error downloading image: {e}")
            return False
    
    def trigger_download(self, download_location: str):
        """
        Trigger a download event (required by Unsplash API guidelines)
        This helps track usage for photographers
        
        Args:
            download_location: The download_location URL from search result
        """
        if not self.access_key or not download_location:
            return
        
        try:
            headers = {
                "Authorization": f"Client-ID {self.access_key}"
            }
            requests.get(download_location, headers=headers, timeout=5)
        except Exception as e:
            logger.warning(f"Failed to trigger download event: {e}")
    
    def fetch_image_for_topic(self, topic: str, save_dir: Path, filename: str = "background.jpg") -> Optional[str]:
        """
        Search, download, and return path to image for a topic
        
        Args:
            topic: Topic/keyword to search for
            save_dir: Directory to save image
            filename: Filename for saved image
            
        Returns:
            Path to downloaded image or None
        """
        # Search for image
        result = self.search_image(topic)
        
        if not result:
            return None
        
        # Download image
        save_path = save_dir / filename
        success = self.download_image(result["url"], save_path)
        
        if success:
            # Trigger download event (Unsplash API requirement)
            self.trigger_download(result.get("download_location"))
            return str(save_path)
        
        return None
