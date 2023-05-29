# Duders Zone

See you next game.

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
refreshed using the Internet Archive API to get any updates to the collection.
This is done using the `download_ia_data.py` script and requires Python to run.

To run the script go into the scripts directory:

```shell
cd scripts
```

(Optional) Create and activate a virtual environment:

```shell
python -m venv env
source env/bin/activate
```

Install the `internetarchive` dependency:

```shell
pip install internetarchive
```

Run the script:

```shell
python download_ia_data.py
```

This will create a _videos.json_ file and a _shows.json_ containing the video
and show data respectively. You can then move them to the correct location,
overriding what's there:

```shell
mv videos.json shows.json ../src/lib/data/
```
