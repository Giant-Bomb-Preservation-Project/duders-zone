import json
import re
import time
from urllib.parse import quote

from internetarchive import get_files, search_items

# Identifier for the GB archive
COLLECTION_IDENTIFIER = 'giant-bomb-archive'

# Seconds to delay between making requests to IA
DELAY_TIME = 2

# Which thumbnail in the list to use as the image
NTH_THUMBNAIL = 4

# Files to write the data to
TARGET_VIDEO_FILE = 'videos.json'
TARGET_SHOW_FILE = 'shows.json'

# Limiting the items to get, leave it as 0 to have no limit
LIMIT = 0


def make_identifier(name):
    """Convert a name into an identifier."""

    return re.sub(r'[^\w-]', '', name.lower().replace(' ', '-'))


def fetch_ia_data():
    """Get video items from Internet Archive."""
    print(f'Searching for items in collection: {COLLECTION_IDENTIFIER}')
    search = search_items(
        query=f'collection:{COLLECTION_IDENTIFIER}',
        fields=['identifier', 'date', 'title', 'description', 'mediatype', 'subject'],
    )

    print('Fetching video items...')
    videos = []
    shows = {}
    count = 0
    for result in search:
        video_id = result['identifier']

        if result['mediatype'] != 'movies':
            print('{video_id}: Skipping non-movie entry')
            continue

        try:
            video = {
                'id': video_id,
                'title': result['title'],
                'description': result.get('description', ''),
                'date': result['date'],
            }
        except KeyError:
            print('{video_id}: Missing metadata:', result)
            continue

        subjects = (
            [result['subject']]
            if type(result['subject']) == str
            else result['subject']
        )
        for subject in subjects:
            if subject == 'Giant Bomb':
                continue

            show_id = make_identifier(subject)
            if show_id not in shows:
                shows[show_id] = {
                    'id': show_id,
                    'title': subject,
                    'description': '',
                    'videos': []
                }

            shows[show_id]['videos'].append(video_id)
        files = get_files(
            identifier=video_id,
            formats='Thumbnail',
        )

        try:
            i = 0
            file = next(files)
            while i < NTH_THUMBNAIL:
                video['thumbnail'] = f'https://archive.org/download/{video_id}/' + quote(file.name)
                file = next(files)
                i += 1
        except StopIteration:
            pass  # ran out of thumbnails, so just use the last one

        videos.append(video)

        count = count + 1
        if count == LIMIT:
            break

        time.sleep(DELAY_TIME)

    print(f'Got {count} videos and {len(shows)} shows!')
    return videos, list(shows.values())


if __name__ == '__main__':
    videos, shows = fetch_ia_data()

    print(f'Saving videos to: {TARGET_VIDEO_FILE}')
    with open(TARGET_VIDEO_FILE, 'w', encoding='utf-8') as file:
        json.dump(videos, file, ensure_ascii=False, indent=4)

    print(f'Saving shows to: {TARGET_SHOW_FILE}')
    with open(TARGET_SHOW_FILE, 'w', encoding='utf-8') as file:
        json.dump(shows, file, ensure_ascii=False, indent=4)
