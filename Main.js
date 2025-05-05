(function Damascus() {
    const flintHatchetTexture = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAS5JREFUOE+lkz1Lw1AUht841HATCUbDjaAOLpmFikMLDi5SEOzuH/NHCCIuLg51EB2sk1TsFBGapgSx+VrCkRtIIJgv8Sx3OO/z3vNxr4R/hlTHc84pyzuOU6qtNBCwYRgp7/s+oihCmUmjgYBFBEGAMAzFWWBKDbLbMzhJEsRxnBqcH2/g4trOuUYDAYsQBrIsw/O8rKKUrW0h61+cjLHUQNM0uK6bz6N2CwIc9k3qdCTcPH5D1/W/GQz7W2TtMtw+zTGeLiVFUUhV1cI2Kis47XFiqyt4s328TJeVutLE4EAnkzPcjxd4/4xr2/yVHBxyOtpfx9VohofXr8YZFQQn3U3a21Zx97zAxPYb4cIaz3omda01XI5m6cDa/rFcaO0wkkCYfESt4dqH1LaCHzUaghF9dEXTAAAAAElFTkSuQmCC";

    ModAPI.meta.title("Damascus");
    ModAPI.meta.icon(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAMdJREFUOE9jZKAQMKLrn8rK+j/7928McVz2oCgEaQYpBBlArEF4bcpkZ/8//edPvGpwSoI06/z7x3CFiYkBnyE4wwBmAMhLIENAAJtBBF0g/x8cLAxbmZnBBqCHDVYDQLaDNGX8/MnwmIWFYSI7O8Pur1+xqsUq6MrN/b/n61ewZhBYxcLC8JyZGashOA3I//mT4RYvL8OTb9/AhlxmYSHeAJAGEwaG/4Lc3GDN779+ZTjDwEC8F0hJ3UQnWaKSMik2w9QOvAsAiQVQEU/ucD4AAAAASUVORK5CYIIA);
    ModAPI.meta.description("Adds a lot of content and stages to the game.");
    ModAPI.meta.credits("By OkLobster");

    if (window.LibCustomItems && LibCustomItems.registerItem) {
        LibCustomItems.registerItem({
            tag: "flint_hatchet" // Unique identifier for your item
            name: "Flint Hatchet",
            maxDamage: 50,
            itemCategory: "tools",
            enchantable: true,
            damageVsEntity: 2.0,
            harvestLevel: 1,
            harvestType: axe,
            qty: 1, // Default stack size
            texture: flintHatchetTexture,
            recipe: [ // Example recipe
                "   ",
                " FF",
                " SZ"
            ],
            recipeLegend: {
                "F": { type: "item", id: "minecraft:flint" },
                "S": { type: "item", id: "minecraft:stick" },
                "Z": { type: "item", id: "minecraft:string" }
            }
        });
    } else {
        console.error("LibCustomItems not loaded!");
    }
})();

        AsyncSink.setFile("resourcepacks/AsyncSinkLib/assets/minecraft/textures/flint_hatchet.png", await (await fetch(
            flintHatchetTexture
        )).arrayBuffer());
    });
})();
