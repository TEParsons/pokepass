import requests
import json
from pathlib import Path

# dict of names/nums
with open("pokemap_bynum.json", "r") as f:
    pokemap_bynum = json.load(f)
with open("fails.json", "r") as f:
    last_fails = json.load(f)

# target = pokemap_bynum  # use to start
target = last_fails  # then check just the ones which fail

# array to store failed sprites
fails = {}
# iterate through all pokemon
for num in target:
    name = pokemap_bynum[num]
    # try a selection of 10 for testing
    # if num % 100:
    #     continue
    # request page
    data = requests.get(f"https://pokemondb.net/sprites/{name}").content
    # did we get it?
    if b"Page Not Found" in data:
        print(name)
        # on fail, add to fail array
        fails[num] = name

# save fails as a JSON
with open("fails.json", "w") as f:
    json.dump(
        fails, f, indent=True
    )

