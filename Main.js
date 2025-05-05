(function Damascus() {
    const flintHatchetTexture = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAS5JREFUOE+lkz1Lw1AUht841HATCUbDjaAOLpmFikMLDi5SEOzuH/NHCCIuLg51EB2sk1TsFBGapgSx+VrCkRtIIJgv8Sx3OO/z3vNxr4R/hlTHc84pyzuOU6qtNBCwYRgp7/s+oihCmUmjgYBFBEGAMAzFWWBKDbLbMzhJEsRxnBqcH2/g4trOuUYDAYsQBrIsw/O8rKKUrW0h61+cjLHUQNM0uK6bz6N2CwIc9k3qdCTcPH5D1/W/GQz7W2TtMtw+zTGeLiVFUUhV1cI2Kis47XFiqyt4s328TJeVutLE4EAnkzPcjxd4/4xr2/yVHBxyOtpfx9VohofXr8YZFQQn3U3a21Zx97zAxPYb4cIaz3omda01XI5m6cDa/rFcaO0wkkCYfESt4dqH1LaCHzUaghF9dEXTAAAAAElFTkSuQmCC";

    ModAPI.meta.title("Damascus");
    ModAPI.meta.icon("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAMdJREFUOE9jZKAQMKLrn8rK+j/7928McVz2oCgEaQYpBBlArEF4bcpkZ/8//edPvGpwSoI06/z7x3CFiYkBnyE4wwBmAMhLIENAAJtBBF0g/x8cLAxbmZnBBqCHDVYDQLaDNGX8/MnwmIWFYSI7O8Pur1+xqsUq6MrN/b/n61ewZhBYxcLC8JyZGashOA3I//mT4RYvL8OTb9/AhlxmYSHeAJAGEwaG/4Lc3GDN779+ZTjDwEC8F0hJ3UQnWaKSMik2w9QOvAsAiQVQEU/ucD4AAAAASUVORK5CYIIA");
    ModAPI.meta.description("Adds a lot of content and stages to the game.");
    ModAPI.meta.credits("By OkLobster");

    // Texture registration
    AsyncSink.setFile("resourcepacks/AsyncSinkLib/assets/minecraft/textures/items/flint_hatchet.png", flintHatchetTexture);

    if (window.LibCustomItems && LibCustomItems.registerItem) {
        LibCustomItems.registerItem({
            tag: "damascus:flint_hatchet",
            base: "wooden_axe",
            name: "Flint Hatchet",
            qty: 1,
            durability: 50,
            texture: "minecraft:flint_hatchet",
            useRecipe: true,
            recipe: [
                "   ",
                " FF",
                " SZ"
            ],
            recipeLegend: {
                "F": { type: "item", id: "flint" },
                "S": { type: "item", id: "stick" },
                "Z": { type: "item", id: "string" }
            }
        });
    } else {
        console.error("LibCustomItems not loaded!");
    }

    // Prevent hand-breaking except for specific blocks, allow leaves and shrubs
    ModAPI.addEventListener("blockbreak", function(event) {
        let player = event.player;
        let block = event.block;
        let allowedBlocks = [
            "minecraft:dirt",
            "minecraft:sand",
            "minecraft:gravel",
            "minecraft:soul_sand",
            "minecraft:clay",
            "minecraft:snow",
            "minecraft:snow_layer",
            "minecraft:mycelium",
            "minecraft:tallgrass", // Grass, ferns
            "minecraft:deadbush"  // Dead bushes for sticks
        ];
        if (!player.inventory.getCurrentItem() && 
            block.material !== "leaves" && 
            !allowedBlocks.includes(block.id)) {
            event.preventDefault = true;
            player.sendMessage("You need a tool to break this block!");
        }
    });
})();
