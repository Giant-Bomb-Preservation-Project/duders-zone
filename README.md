# Duders Zone

This is an archival website about video games. It shows video content from Giant
Bomb where the actual videos are hosted at
[Internet Archive](https://archive.org/details/giant-bomb-archive). It's
maintained for my own nostalgic benefit.

Thanks for everything! See you next game.

## Requirements

* Node 19+
* Python 3.9+ (optional - for refreshing the store for IA)

## Developing

Install the dependencies:

```shell
npm run install
```

Run the development server:

```shell
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Use the `check` script to validate TypeScript code:

```shell
npm run check
```

## Building

To create a production version of your app:

```bash
npm run build
```

## Downloading Data

The web app relies on bundled JSON files for its data store which need to be
refreshed using the Giant Bomb and Internet Archive APIs to get any updates to
the collection. This is done using the scripts in the _scripts_ directory and
requires Python.

To run the scripts go into the _scripts_ directory:

```shell
cd scripts
```

(Optional) Create and activate a virtual environment:

```shell
python -m venv env
source env/bin/activate
```

Install the `internetarchive` and `requests` dependencies:

```shell
pip install internetarchive requests
```

You can now download shows and videos, which must be done in order.

### Shows

To run this file you will need to have an existing Giant Bomb API key. This can
be retrieved from [Giant Bomb](https://www.giantbomb.com/api/) (while it's still
available) and you either need to provide it as an environment variable
named `GB_API_KEY`.

Using your key, run the `download_show_data.py` script:

```shell
GB_API_KEY=<your api key> python download_show_data.py
```

This will create a _shows.json_ file containing the show metadata and an
_images.txt_ file which contains the URL to the needed images. The images can
be downloaded manually or using `wget` (or something similar):

```shell
cat images.txt | xargs wget -c
```

### Videos

Getting videos requires that you have a _shows.json_ file in the _scripts_
directory, either by copying the existing one or by downloading them using the
script described above.

If you have that, run the `download_video_data.py` script:

```shell
python download_video_data.py
```

This will create a _videos.json_ file containing the video meta data as well as
updating the _shows.json_ file with a mapping of each video to a show.

You can then move them to the correct location, overriding what's there:

```shell
mv videos.json shows.json ../src/lib/data/
```
