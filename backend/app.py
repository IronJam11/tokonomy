from flask import Flask, request, jsonify
import requests
import re
import json
from datetime import datetime, timedelta
import os
from urllib.parse import urlparse, parse_qs
import base64
import hashlib
import time

app = Flask(__name__)

# Configuration - Add your API keys here
YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY', 'your_youtube_api_key_here')
SPOTIFY_CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID', 'your_spotify_client_id_here')
SPOTIFY_CLIENT_SECRET = os.getenv('SPOTIFY_CLIENT_SECRET', 'your_spotify_client_secret_here')
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN', 'your_github_token_here')

def extract_video_id(url):
    """Extract video ID from YouTube URL"""
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)',
        r'youtube\.com\/v\/([^&\n?#]+)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None



def extract_github_info(url):
    """Extract owner and repo from GitHub URL"""
    pattern = r'github\.com\/([^\/]+)\/([^\/]+)'
    match = re.search(pattern, url)
    if match:
        return match.group(1), match.group(2)
    return None, None

def extract_instagram_info(url):
    """Extract Instagram post info from URL"""
    patterns = [
        r'instagram\.com\/p\/([^\/\?]+)',
        r'instagram\.com\/reel\/([^\/\?]+)',
        r'instagram\.com\/tv\/([^\/\?]+)'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None
def extract_spotify_track_id(url):
    """Extract track ID from Spotify URLs"""
    import re
    
    # Handle different Spotify URL formats
    patterns = [
        r'spotify:track:([a-zA-Z0-9]+)',
        r'open\.spotify\.com/track/([a-zA-Z0-9]+)',
        r'spotify\.com/track/([a-zA-Z0-9]+)'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    
    return None
def parse_youtube_duration(duration):
    """Parse YouTube ISO 8601 duration format"""
    import re
    match = re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?', duration)
    if match:
        hours = int(match.group(1) or 0)
        minutes = int(match.group(2) or 0)
        seconds = int(match.group(3) or 0)
        return hours * 3600 + minutes * 60 + seconds
    return 0

def calculate_engagement_rate(likes, comments, views):
    """Calculate engagement rate"""
    if views == 0:
        return 0
    return ((likes + comments) / views) * 100

def get_youtube_channel_details(channel_id, api_key):
    """Get detailed channel information"""
    try:
        url = f'https://www.googleapis.com/youtube/v3/channels'
        params = {
            'part': 'snippet,statistics,brandingSettings',
            'id': channel_id,
            'key': api_key
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        return data['items'][0] if data['items'] else None
    except:
        return None

def get_youtube_comments_sample(video_id, api_key):
    """Get sample comments for sentiment analysis"""
    try:
        url = f'https://www.googleapis.com/youtube/v3/commentThreads'
        params = {
            'part': 'snippet',
            'videoId': video_id,
            'maxResults': 20,
            'order': 'relevance',
            'key': api_key
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        comments = []
        for item in data.get('items', []):
            comment = item['snippet']['topLevelComment']['snippet']
            comments.append({
                'text': comment['textDisplay'],
                'author': comment['authorDisplayName'],
                'likes': comment['likeCount'],
                'published': comment['publishedAt']
            })
        return comments
    except:
        return []

@app.route('/api/youtube/analytics', methods=['POST'])
def youtube_analytics():
    """Get comprehensive YouTube video analytics"""
    try:
        data = request.get_json()
        if not data or 'url' not in data:
            return jsonify({'error': 'URL is required'}), 400
        
        video_id = extract_video_id(data['url'])
        if not video_id:
            return jsonify({'error': 'Invalid YouTube URL'}), 400
        
        # YouTube Data API call
        api_url = f'https://www.googleapis.com/youtube/v3/videos'
        params = {
            'part': 'snippet,statistics,contentDetails,status,topicDetails,recordingDetails,liveStreamingDetails',
            'id': video_id,
            'key': YOUTUBE_API_KEY
        }
        
        response = requests.get(api_url, params=params)
        response.raise_for_status()
        
        video_data = response.json()
        
        if not video_data['items']:
            return jsonify({'error': 'Video not found'}), 404
        
        video = video_data['items'][0]
        snippet = video['snippet']
        stats = video['statistics']
        content_details = video['contentDetails']
        status = video['status']
        
        # Get channel details
        channel_details = get_youtube_channel_details(snippet['channelId'], YOUTUBE_API_KEY)
        
        # Get sample comments
        comments_sample = get_youtube_comments_sample(video_id, YOUTUBE_API_KEY)
        
        # Calculate metrics
        view_count = int(stats.get('viewCount', 0))
        like_count = int(stats.get('likeCount', 0))
        comment_count = int(stats.get('commentCount', 0))
        duration_seconds = parse_youtube_duration(content_details['duration'])
        
        # Calculate engagement metrics
        engagement_rate = calculate_engagement_rate(like_count, comment_count, view_count)
        
        # Video age calculation
        published_date = datetime.fromisoformat(snippet['publishedAt'].replace('Z', '+00:00'))
        video_age_days = (datetime.now().replace(tzinfo=published_date.tzinfo) - published_date).days
        
        analytics = {
            'video_id': video_id,
            'url': data['url'],
            
            # Basic video info
            'title': snippet['title'],
            'description': snippet['description'],
            'channel_title': snippet['channelTitle'],
            'channel_id': snippet['channelId'],
            'published_at': snippet['publishedAt'],
            'duration': content_details['duration'],
            'duration_seconds': duration_seconds,
            'duration_formatted': f"{duration_seconds//3600:02d}:{(duration_seconds%3600)//60:02d}:{duration_seconds%60:02d}",
            
            # Engagement metrics
            'view_count': view_count,
            'like_count': like_count,
            'comment_count': comment_count,
            'engagement_rate': round(engagement_rate, 2),
            'views_per_day': round(view_count / max(video_age_days, 1), 2),
            'likes_to_views_ratio': round((like_count / view_count) * 100, 2) if view_count > 0 else 0,
            'comments_to_views_ratio': round((comment_count / view_count) * 100, 2) if view_count > 0 else 0,
            
            # Content details
            'thumbnail': snippet['thumbnails']['maxres']['url'] if 'maxres' in snippet['thumbnails'] else snippet['thumbnails']['high']['url'],
            'tags': snippet.get('tags', []),
            'category_id': snippet['categoryId'],
            'default_language': snippet.get('defaultLanguage', 'unknown'),
            'caption': content_details.get('caption', 'false'),
            'definition': content_details.get('definition', 'hd'),
            'dimension': content_details.get('dimension', '2d'),
            'licensed_content': content_details.get('licensedContent', False),
            
            # Status info
            'privacy_status': status.get('privacyStatus', 'unknown'),
            'upload_status': status.get('uploadStatus', 'unknown'),
            'embeddable': status.get('embeddable', True),
            'public_stats_viewable': status.get('publicStatsViewable', True),
            'made_for_kids': status.get('madeForKids', False),
            
            # Topic details
            'topic_categories': video.get('topicDetails', {}).get('topicCategories', []),
            'relevant_topic_ids': video.get('topicDetails', {}).get('relevantTopicIds', []),
            
            # Time-based metrics
            'video_age_days': video_age_days,
            'is_recent': video_age_days <= 7,
            'is_trending_candidate': view_count > 10000 and video_age_days <= 3,
            
            # Channel context
            'channel_details': None,
            'comments_sample': comments_sample[:5] if comments_sample else []
        }
        
        # Add channel details if available
        if channel_details:
            channel_stats = channel_details.get('statistics', {})
            analytics['channel_details'] = {
                'subscriber_count': int(channel_stats.get('subscriberCount', 0)),
                'total_videos': int(channel_stats.get('videoCount', 0)),
                'total_views': int(channel_stats.get('viewCount', 0)),
                'channel_created': channel_details['snippet']['publishedAt'],
                'channel_description': channel_details['snippet']['description'][:200] + '...' if len(channel_details['snippet']['description']) > 200 else channel_details['snippet']['description'],
                'channel_thumbnail': channel_details['snippet']['thumbnails']['high']['url'],
                'channel_country': channel_details['snippet'].get('country', 'unknown')
            }
        
        return jsonify({
            'platform': 'YouTube',
            'analytics': analytics,
            'fetched_at': datetime.now().isoformat()
        })
        
    except requests.RequestException as e:
        return jsonify({'error': f'API request failed: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/api/instagram/analytics', methods=['POST'])
def instagram_analytics():
    """Get Instagram analytics with web scraping approach"""
    try:
        data = request.get_json()
        if not data or 'url' not in data:
            return jsonify({'error': 'URL is required'}), 400
        
        post_id = extract_instagram_info(data['url'])
        if not post_id:
            return jsonify({'error': 'Invalid Instagram URL'}), 400
        
        # Attempt to get public metadata (limited)
        # Note: This is a basic approach - Instagram heavily restricts scraping
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            
            # Try to get basic page info
            response = requests.get(f'https://www.instagram.com/p/{post_id}/', headers=headers, timeout=10)
            
            # Basic content analysis
            content = response.text
            
            # Extract basic metadata from page source
            import re
            
            # Try to find JSON data in page source
            json_match = re.search(r'window\._sharedData = ({.*?});', content)
            
            extracted_data = {
                'post_id': post_id,
                'url': data['url'],
                'extraction_method': 'web_scraping',
                'page_accessible': response.status_code == 200,
                'content_length': len(content),
                'has_video_tag': '<video' in content.lower(),
                'has_image_tag': '<img' in content.lower(),
                'estimated_media_type': 'video' if '<video' in content.lower() else 'image'
            }
            
            # Try to extract some basic info from meta tags
            title_match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
            if title_match:
                extracted_data['page_title'] = title_match.group(1)
            
            description_match = re.search(r'<meta name="description" content="(.*?)"', content, re.IGNORECASE)
            if description_match:
                extracted_data['meta_description'] = description_match.group(1)
            
        except Exception as scraping_error:
            extracted_data = {
                'post_id': post_id,
                'url': data['url'],
                'extraction_method': 'failed',
                'error': str(scraping_error)
            }
        
        analytics = {
            'post_id': post_id,
            'url': data['url'],
            'platform_limitations': {
                'note': 'Instagram severely restricts data access',
                'official_api_required': True,
                'scraping_limitations': 'Rate limited and blocked by anti-bot measures'
            },
            'extracted_data': extracted_data,
            'mock_analytics_structure': {
                'engagement_metrics': {
                    'likes': 'Requires Instagram Graph API',
                    'comments': 'Requires Instagram Graph API',
                    'shares': 'Requires Instagram Graph API',
                    'saves': 'Requires Instagram Graph API',
                    'reach': 'Requires Instagram Graph API',
                    'impressions': 'Requires Instagram Graph API'
                },
                'content_metrics': {
                    'media_type': 'video/image/carousel',
                    'duration': 'For videos only',
                    'dimensions': 'Width x Height',
                    'file_size': 'Estimated size'
                },
                'audience_metrics': {
                    'demographics': 'Age, gender, location',
                    'activity_times': 'When followers are most active',
                    'top_locations': 'Geographic data'
                }
            },
            'api_requirements': {
                'instagram_basic_display': 'For personal posts',
                'instagram_graph_api': 'For business accounts',
                'required_permissions': ['instagram_graph_user_profile', 'instagram_graph_user_media'],
                'approval_process': 'App review required by Meta'
            }
        }
        
        return jsonify({
            'platform': 'Instagram',
            'analytics': analytics,
            'fetched_at': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)