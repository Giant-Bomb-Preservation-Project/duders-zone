import argparse
import json
import os
import os.path
import re
import sys
import time
import urllib.parse
import urllib.request

import requests


# Base URL to the Giant Bomb API
BASE_URL = 'https://www.giantbomb.com/api/'

# Seconds to delay between making requests to GB
DELAY_TIME = 2

# Amount of shows to fetch per page (max: 100)
SHOWS_PER_PAGE = 100

# Path to the file to store the show meta data
TARGET_SHOW_FILE = 'shows.json'

# Path to the location to store the images
TARGET_IMAGES_PATH = './images'

# The API key used when connecting to the Giant Bomb API
API_KEY = os.getenv('GB_API_KEY')


def make_identifier(name):
    """Convert a show name into an identifier."""

    return re.sub(r'[^\w-]', '', name.lower().replace(' ', '-'))


def get_image_filename(url):
    """Convert a URL to an image filename."""

    url = urllib.parse.urlparse(url)
    name = url.path.rpartition('/')[-1]  # get just the file name
    name = re.sub(r'(.*\.\w+)(.*?)$', r'\1', name)  # remove anything trailing after the file extension

    return urllib.parse.unquote(name)


def get_shows():
    """Get shows from the Giant Bomb API."""

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
    parser = argparse.ArgumentParser(
        description='Downloads Giant Bomb show data')
    parser.add_argument(
        '-i', '--images',
        help='download images',
        action='store_true')
    args = parser.parse_args()

    shows = get_shows()

    images = {}
    for show in shows:
        if show['poster']:
            name = get_image_filename(show['poster'])
            images[name] = show['poster']
            show['poster'] = name

        if show['logo']:
            name = get_image_filename(show['logo'])
            images[name] = show['logo']
            show['logo'] = name

    print(f'Saving shows to: {TARGET_SHOW_FILE}')
    with open(TARGET_SHOW_FILE, 'w', encoding='utf-8') as file:
        json.dump(shows, file, ensure_ascii=False, indent=4)

    if args.images:
        print(f'Got {len(images)} images!')
        print(f'Saving images to: {TARGET_IMAGES_PATH}')
        try:
            os.mkdir(TARGET_IMAGES_PATH)
        except FileExistsError:
            pass  # this is fine
        for name, url in images.items():
            print(f'Downloading: {url}')

            local_file = os.path.join(TARGET_IMAGES_PATH, name)
            urllib.request.urlretrieve(url, local_file)

            time.sleep(DELAY_TIME)
