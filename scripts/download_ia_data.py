import json
import re
import time
from os import getenv
from urllib.parse import quote

from internetarchive import configure, get_files, search_items

# Identifier for the GB archive
COLLECTION_IDENTIFIER = 'giant-bomb-archive'

# Seconds to delay between making requests to IA
DELAY_TIME = 2

# Which thumbnail in the list to use as the image
NTH_THUMBNAIL = 4

# Filename to write the data to
TARGET_FILE = 'videos.json'

# Limiting the items to get, leave it as 0 to have no limit
LIMIT = 1000


def get_show_id(result):
    """Extract out the show ID from a result by looking at its subject(s)."""

    subjects = result['subject']
    if type(subjects) == str:
        subjects = [subjects]

    if 'Giant Bomb' in subjects:
        subjects.remove('Giant Bomb')

    if len(subjects) != 1:
        print(f"[{result['identifier']}] Unable to determine show:", subjects)
        return None

    return re.sub(r'[^\w-]', '', subjects[0].lower().replace(' ', '-'))


print('Logging in to the Internet Archive')
configure(getenv('IA_USERNAME'), getenv('IA_PASSWORD'))

print(f'Searching for items in collection: {COLLECTION_IDENTIFIER}')
search = search_items(
    query=f'collection:{COLLECTION_IDENTIFIER}',
    fields=['identifier', 'date', 'title', 'description', 'mediatype', 'subject'],
)

print('Extracting video items...')
videos = []
count = 0
for result in search:
    identifier = result['identifier']

    if result['mediatype'] != 'movies':
        print('{identifier}: Skipping non-movie entry')
        continue

    try:
        video = {
            'id': identifier,
            'title': result['title'],
            'description': result.get('description', ''),
            'date': result['date'],
            'show': get_show_id(result),
        }
    except KeyError:
        print('{identifier}: Missing metadata:', result)
        continue

    files = get_files(
        identifier=identifier,
        formats='Thumbnail',
    )

    try:
        i = 0
        file = next(files)
        while i < NTH_THUMBNAIL:
            video['image'] = f'https://archive.org/download/{identifier}/' + quote(file.name)
            file = next(files)
            i += 1
    except StopIteration:
        pass  # ran out of thumbnails, so just use the last one

    videos.append(video)

    count = count + 1
    if count == LIMIT:
        break

    time.sleep(DELAY_TIME)

print(f'Got {count} videos!')

print(f'Saving to: {TARGET_FILE}')
with open(TARGET_FILE, 'w', encoding='utf-8') as file:
    json.dump(videos, file, ensure_ascii=False)
