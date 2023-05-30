import json
import os
import re
import sys
import time
from urllib.parse import urlparse

import requests


# Base URL to the Giant Bomb API
BASE_URL = 'https://www.giantbomb.com/api/'

# Seconds to delay between making requests to GB
DELAY_TIME = 2

# Amount of shows to fetch per page (max: 100)
SHOWS_PER_PAGE = 100

# Path to the file to store image URLs
TARGET_IMAGES_FILE = 'images.txt'

# Path to the file to store the show meta data
TARGET_SHOW_FILE = 'shows.json'

# The API key used when connecting to the Giant Bomb API
API_KEY = os.getenv('GB_API_KEY')


def make_identifier(name):
    """Convert a name into an identifier."""

    return re.sub(r'[^\w-]', '', name.lower().replace(' ', '-'))


def get_shows():
    url = f'{BASE_URL}video_shows/?api_key={API_KEY}&format=json&limit={SHOWS_PER_PAGE}&offset='
    headers = {'user-agent': 'michaelenger/duders-zone'}

    shows = []
    page = 1
    while True:
        full_url = url + str((page - 1) * SHOWS_PER_PAGE)
        print(f'Fetching from: {full_url}')
        response = requests.get(
            full_url,
            headers=headers,
        )

        if response.status_code != 200:
            print(f'ERROR! Unexpected {response.status_code} response code', file=sys.stderr)
            print(response.text, file=sys.stderr)
            return []

        results = response.json()['results']
        if not results:
            break

        shows = shows + [
            {
                'id': make_identifier(result['title']),
                'title': result['title'],
                'description': result['deck'],
                'poster': result['image']['medium_url'] if result['image'] else None,
                'logo': result['logo']['medium_url'] if result['logo'] else None,
            }
            for result in results
        ]
        page = page + 1

        time.sleep(DELAY_TIME)

    print(f'Got {len(shows)} shows!')
    return shows


if __name__ == '__main__':
    shows = get_shows()

    images = []
    for show in shows:
        if show['poster']:
            url = urlparse(show['poster'])
            name = url.path.rpartition('/')[-1]
            images.append(show['poster'])
            show['poster'] = name

        if show['logo']:
            url = urlparse(show['logo'])
            name = url.path.rpartition('/')[-1]
            images.append(show['logo'])
            show['logo'] = name

    print(f'Saving shows to: {TARGET_SHOW_FILE}')
    with open(TARGET_SHOW_FILE, 'w', encoding='utf-8') as file:
        json.dump(shows, file, ensure_ascii=False, indent=4)

    print(f'Saving image URLs to: {TARGET_IMAGES_FILE}')
    with open(TARGET_IMAGES_FILE, 'w', encoding='utf-8') as file:
        for image in images:
            file.write(f"{image}\n")
