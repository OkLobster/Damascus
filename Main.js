ModAPI.meta.title("Damascus")
ModAPI.meta.description("Adds a multitude of content and game stages.")
ModAPI.meta.credits("By OkLobster")
ModAPI.meta.icon("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAMdJREFUOE9jZKAQMKLrn8rK+j/7928McVz2oCgEaQYpBBlArEF4bcpkZ/8//edPvGpwSoI06/z7x3CFiYkBnyE4wwBmAMhLIENAAJtBBF0g/x8cLAxbmZnBBqCHDVYDQLaDNGX8/MnwmIWFYSI7O8Pur1+xqsUq6MrN/b/n61ewZhBYxcLC8JyZGashOA3I//mT4RYvL8OTb9/AhlxmYSHeAJAGEwaG/4Lc3GDN779+ZTjDwEC8F0hJ3UQnWaKSMik2w9QOvAsAiQVQEU/ucD4AAAAASUVORK5CYIIA")

// constants
const flinthatchettex = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAS5JREFUOE+lkz1Lw1AUht841HATCUbDjaAOLpmFikMLDi5SEOzuH/NHCCIuLg51EB2sk1TsFBGapgSx+VrCkRtIIJgv8Sx3OO/z3vNxr4R/hlTHc84pyzuOU6qtNBCwYRgp7/s+oihCmUmjgYBFBEGAMAzFWWBKDbLbMzhJEsRxnBqcH2/g4trOuUYDAYsQBrIsw/O8rKKUrW0h61+cjLHUQNM0uK6bz6N2CwIc9k3qdCTcPH5D1/W/GQz7W2TtMtw+zTGeLiVFUUhV1cI2Kis47XFiqyt4s328TJeVutLE4EAnkzPcjxd4/4xr2/yVHBxyOtpfx9VohofXr8YZFQQn3U3a21Zx97zAxPYb4cIaz3omda01XI5m6cDa/rFcaO0wkkCYfESt4dqH1LaCHzUaghF9dEXTAAAAAElFTkSuQmCC"
AsyncSink.setFile("resourcepacks/AsyncSinkLib/assets/minecraft/textures/items/flint_hatchet.png", flinghatchettex);

// flint hatchet
<ModAPI.registerItem({
  console.log("Registered Flint Hatchet.");
  tag: "damascus:flint_hatchet",
  base: "wooden_axe",
  name: "Flint Hatchet"
  qty: 1,
  texture: "minecraft:flint_hatchet",
  damageVsEntity: 3.0,
  enchantable: true,
  maxDamage: 40,
  harvestLevel: 1,
  hervestType: "axe",
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


