ModAPI.meta.title("Damascus")
ModAPI.meta.description("Adds a multitude of content and game stages.")
ModAPI.meta.credits("By OkLobster")

// constants
const flinthatchettex = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAS5JREFUOE+lkz1Lw1AUht841HATCUbDjaAOLpmFikMLDi5SEOzuH/NHCCIuLg51EB2sk1TsFBGapgSx+VrCkRtIIJgv8Sx3OO/z3vNxr4R/hlTHc84pyzuOU6qtNBCwYRgp7/s+oihCmUmjgYBFBEGAMAzFWWBKDbLbMzhJEsRxnBqcH2/g4trOuUYDAYsQBrIsw/O8rKKUrW0h61+cjLHUQNM0uK6bz6N2CwIc9k3qdCTcPH5D1/W/GQz7W2TtMtw+zTGeLiVFUUhV1cI2Kis47XFiqyt4s328TJeVutLE4EAnkzPcjxd4/4xr2/yVHBxyOtpfx9VohofXr8YZFQQn3U3a21Zx97zAxPYb4cIaz3omda01XI5m6cDa/rFcaO0wkkCYfESt4dqH1LaCHzUaghF9dEXTAAAAAElFTkSuQmCC"

// flint hatchet
<ModAPI.addEventListener("lib:libcustomitems:loaded", () => {
  console.log("Registered Flint Hatchet.");
  tag: "damascus:flint_hatchet",
  base: "wooden_axe",
  name: "Flint Hatchet"
  qty: 1,
  texture: "flinthatchettex",
  useRecipe: true,
  recipe: [
    "FF",
    "SZ"
  ],
  recipeLegend: {
    "F": {
      "type": "item",
      "id": "flint"
    },
    "S": {
      "type": "item",
      "id": "stick"
    },
    "Z": {
      "type": "item",
      "id": "string"
    }
  }
  }
});

