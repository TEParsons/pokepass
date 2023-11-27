import requests
import json
from pathlib import Path

# dict of names/nums
with open("pokemap_bynum.json", "r") as f:
    pokemap_bynum = json.load(f)

# directory to save to
target_dir = Path("./sprites/")
# list of string roots to try, in order of priority
roots = [
    "https://img.pokemondb.net/sprites/bank/normal/{}.png",
    "https://img.pokemondb.net/sprites/scarlet-violet/normal/1x/{}.png",
]


def getSprite(name, iteration=0):
    """
    Get the sprite for a pokemon, iteratively trying each root.
    
    Parameters
    ----------
    name : str
        Name of the pokemon
    iteration : int
        What iteration are we on?

    Returns
    -------
    bytes
        Image data
    """
    # if we've run out of roots to try, give up
    if iteration >= len(roots):
        return
    # construct url from root
    url = roots[iteration].format(name)
    # request data
    data = requests.get(url).content
    # iterate on fail
    if b"404 Not Found" in data:
        iteration += 1
        return getSprite(name, iteration)
    # return on success
    return data


# array to store failed sprites
fails = []
# iterate through all pokemon
for num, name in pokemap_bynum.items():
    # try a selection of 10 for testing
    # if num % 100:
    #     continue
    # if sprite already exists, skip
    if (target_dir / f"{name}.png").is_file():
        continue
    # get sprite
    sprite = getSprite(name)
    # if we got None, append to fails array
    if sprite is None:
        fails.append((num, name))
        continue
    # if success, write image data to file
    with (target_dir / f"{name}.png").open('wb') as f:
        f.write(sprite)

# save fails as a JSON
with (target_dir / "fails.json").open("w") as f:
    json.dump(
        fails, f, indent=True
    )

