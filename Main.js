(function Damascus() {
    const flintHatchetTexture = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAS5JREFUOE+lkz1Lw1AUht841HATCUbDjaAOLpmFikMLDi5SEOzuH/NHCCIuLg51EB2sk1TsFBGapgSx+VrCkRtIIJgv8Sx3OO/z3vNxr4R/hlTHc84pyzuOU6qtNBCwYRgp7/s+oihCmUmjgYBFBEGAMAzFWWBKDbLbMzhJEsRxnBqcH2/g4trOuUYDAYsQBrIsw/O8rKKUrW0h61+cjLHUQNM0uK6bz6N2CwIc9k3qdCTcPH5D1/W/GQz7W2TtMtw+zTGeLiVFUUhV1cI2Kis47XFiqyt4s328TJeVutLE4EAnkzPcjxd4/4xr2/yVHBxyOtpfx9VohofXr8YZFQQn3U3a21Zx97zAxPYb4cIaz3omda01XI5m6cDa/rFcaO0wkkCYfESt4dqH1LaCHzUaghF9dEXTAAAAAElFTkSuQmCC";

    // Mod metadata
    ModAPI.meta.title("Damascus");
    ModAPI.meta.icon("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAMdJREFUOE9jZKAQMKLrn8rK+j/7928McVz2oCgEaQYpBBlArEF4bcpkZ/8//edPvGpwSoI06/z7x3CFiYkBnyE4wwBmAMhLIENAAJtBBF0g/x8cLAxbmZnBBqCHDVYDQLaDNGX8/MnwmIWFYSI7O8Pur1+xqsUq6MrN/b/n61ewZhBYxcLC8JyZGashOA3I//mT4RYvL8OTb9/AhlxmYSHeAJAGEwaG/4Lc3GDN779+ZTjDwEC8F0hJ3UQnWaKSMik2w9QOvAsAiQVQEU/ucD4AAAAASUVORK5CYIIA");
    ModAPI.meta.description("Adds a lot of content and stages to the game.");
    ModAPI.meta.credits("By OkLobster");

    // Item registration (adapted from BEA's ItemDatablock)
    function ServersideItem() {
        var itemClass = ModAPI.reflect.getClassById("net.minecraft.item.Item");
        var itemSuper = ModAPI.reflect.getSuper(itemClass, (x) => x.length === 1);
        var itemUseAnimation = ModAPI.reflect.getClassById("net.minecraft.item.EnumAction").staticVariables["NONE"];
        var itemGetAttributes = ModAPI.reflect.getClassById("net.minecraft.item.Item").methods.getItemAttributeModifiers.method;

        function CustomItem() {
            itemSuper(this);
            this.$maxStackSize = 1; // Like wooden_axe
            this.$setMaxDamage(50); // Durability 50
            this.$setCreativeTab(ModAPI.reflect.getClassById("net.minecraft.creativetab.CreativeTabs").staticVariables.tabTools);
        }
        ModAPI.reflect.prototypeStack(itemClass, CustomItem);

        // Mimic wooden_axe properties
        CustomItem.prototype.$getMaxItemUseDuration = function () {
            return 0; // No right-click action
        };
        CustomItem.prototype.$getItemUseAction = function () {
            return itemUseAnimation;
        };
        CustomItem.prototype.$onItemRightClick = function (itemstack, world, player) {
            return itemstack;
        };
        CustomItem.prototype.$getItemAttributeModifiers = function () {
            var attributeMap = itemGetAttributes.apply(this, []);
            // Wooden axe: ~2.0 damage (base 1.0 + 1.0 modifier)
            efb2__attrMapSet(attributeMap, "generic.attackDamage", 1.0);
            return attributeMap;
        };
        CustomItem.prototype.$getStrVsBlock = function (itemstack, block) {
            // Wooden axe: ~2.0 speed on wood
            return block.material === "wood" ? 2.0 : 1.0;
        };

        function internalReg() {
            var customItem = new CustomItem().$setUnlocalizedName(ModAPI.util.str("flint_hatchet"));
            itemClass.staticMethods.registerItem.method(
                ModAPI.keygen.item("flint_hatchet"),
                ModAPI.util.str("flint_hatchet"),
                customItem
            );
            ModAPI.items["flint_hatchet"] = customItem;
            console.log("Flint Hatchet registered with ID: damascus:flint_hatchet");
            return customItem;
        }

        if (ModAPI.items) {
            return internalReg();
        } else {
            ModAPI.addEventListener("bootstrap", internalReg);
        }
    }

    ModAPI.dedicatedServer.appendCode(ServersideItem);
    var customItem = ServersideItem();

    // Texture and model registration (adapted from BEA)
    ModAPI.addEventListener("lib:asyncsink", async () => {
        ModAPI.addEventListener("lib:asyncsink:registeritems", (renderItem) => {
            renderItem.registerItem(customItem, ModAPI.util.str("flint_hatchet"));
        });
        AsyncSink.L10N.set("item.flint_hatchet.name", "Flint Hatchet");
        AsyncSink.setFile(
            "resourcepacks/AsyncSinkLib/assets/minecraft/models/item/flint_hatchet.json",
            JSON.stringify({
                "parent": "builtin/generated",
                "textures": {
                    "layer0": "items/flint_hatchet"
                },
                "display": {
                    "thirdperson": {
                        "rotation": [-90, 0, 0],
                        "translation": [0, 1, -3],
                        "scale": [0.55, 0.55, 0.55]
                    },
                    "firstperson": {
                        "rotation": [0, -135, 25],
                        "translation": [0, 4, 2],
                        "scale": [1.7, 1.7, 1.7]
                    }
                }
            })
        );
        AsyncSink.setFile(
            "resourcepacks/AsyncSinkLib/assets/minecraft/textures/items/flint_hatchet.png",
            await (await fetch(flintHatchetTexture)).arrayBuffer()
        );
    });

    // Crafting recipe (adapted from BEA's CraftingRecipeDatablock)
    function registerRecipe() {
        function internalRegister() {
            var ObjectClass = ModAPI.reflect.getClassById("java.lang.Object").class;
            function ToChar(char) {
                return ModAPI.reflect.getClassById("java.lang.Character").staticMethods.valueOf.method(char[0].charCodeAt(0));
            }
            var resultItemArg = "item/flint_hatchet";
            var recipeLegend = {
                "F": { type: "item", id: "flint" },
                "S": { type: "item", id: "stick" },
                "Z": { type: "item", id: "string" }
            };
            var recipePattern = ["   ",
                                 " FF",
                                 " SZ"];
            var recipeInternal = [];
            Object.keys(recipeLegend).forEach((key) => {
                recipeInternal.push(ToChar(key));
                var ingredient = ModAPI.items[recipeLegend[key].id].getRef();
                recipeInternal.push(ingredient);
            });

            var recipeContents = recipePattern.map(row => ModAPI.util.str(row));
            var recipe = ModAPI.util.makeArray(ObjectClass, recipeContents.concat(recipeInternal));

            var itemStackFromItem = ModAPI.reflect.getClassById("net.minecraft.item.ItemStack").constructors[4];
            var resultItem = itemStackFromItem(ModAPI.items[resultItemArg.replace("item/", "")].getRef(), 1);

            var craftingManager = ModAPI.reflect.getClassById("net.minecraft.item.crafting.CraftingManager").staticMethods.getInstance.method();
            ModAPI.hooks.methods.nmic_CraftingManager_addRecipe(craftingManager, resultItem, recipe);
        }

        if (ModAPI.items) {
            internalRegister();
        } else {
            ModAPI.addEventListener("bootstrap", internalRegister);
        }
    }
    ModAPI.dedicatedServer.appendCode(registerRecipe);
    registerRecipe();

    // Blockbreak listener (fixed to prevent wood hand-breaking)
    ModAPI.addEventListener("blockbreak", function(event) {
        let player = event.player;
        let block = event.block;
        console.log("Blockbreak triggered - Material:", block.material, "ID:", block.id);
        let allowedBlocks = [
            "minecraft:dirt",
            "minecraft:sand",
            "minecraft:gravel",
            "minecraft:soul_sand",
            "minecraft:clay",
            "minecraft:snow",
            "minecraft:snow_layer",
            "minecraft:mycelium",
            "minecraft:tallgrass",
            "minecraft:deadbush"
        ];
        if (!player.inventory.getCurrentItem()) {
            if (block.material === "wood") {
                event.preventDefault = true;
                player.sendMessage("You need a tool to break wood!");
                console.log("Prevented wood break");
            } else if (block.material !== "leaves" && !allowedBlocks.includes(block.id)) {
                event.preventDefault = true;
                player.sendMessage("You need a tool to break this block!");
            }
        }
    });
})();
