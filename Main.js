ModAPI.meta.title("Damascus")
ModAPI.meta.description("Adds a multitude of content and game stages.")
ModAPI.meta.credits("By OkLobster")

// flint hatchet
<ModAPI.registeritem({
  id: "flint_hatchet",
  name: "Flint Hatchet",
  maxStackSize: 1,
  maxDamage: 50,
  texture: "minecraft:items/iron_axe",
  onItemUse: function(event) {
    let block = event.block
    if (block.material === "wood") {
      event.player.breaksBlock(block)
    }
  }
});

// flint hatchet recipe
ModAPI.registerRecipe({
  result: "flint_hatchet",
  ingredients: [
  { item: "minecraft:flint", count: 2},
  { item: "minecraft:stick", count: 1}
  ],
  shape: [
   "FF",
   " S"
  ]
})
