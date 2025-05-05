(function Damascus() {
    const flintHatchetTexture = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAS5JREFUOE+lkz1Lw1AUht841HATCUbDjaAOLpmFikMLDi5SEOzuH/NHCCIuLg51EB2sk1TsFBGapgSx+VrCkRtIIJgv8Sx3OO/z3vNxr4R/hlTHc84pyzuOU6qtNBCwYRgp7/s+oihCmUmjgYBFBEGAMAzFWWBKDbLbMzhJEsRxnBqcH2/g4trOuUYDAYsQBrIsw/O8rKKUrW0h61+cjLHUQNM0uK6bz6N2CwIc9k3qdCTcPH5D1/W/GQz7W2TtMtw+zTGeLiVFUUhV1cI2Kis47XFiqyt4s328TJeVutLE4EAnkzPcjxd4/4xr2/yVHBxyOtpfx9VohofXr8YZFQQn3U3a21Zx97zAxPYb4cIaz3omda01XI5m6cDa/rFcaO0wkkCYfESt4dqH1LaCHzUaghF9dEXTAAAAAElFTkSuQmCC";

    // Mod metadata
    ModAPI.meta.title("Damascus");
    ModAPI.meta.icon("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAMdJREFUOE9jZKAQMKLrn8rK+j/7928McVz2oCgEaQYpBBlArEF4bcpkZ/8//edPvGpwSoI06/z7x3CFiYkBnyE4wwBmAMhLIENAAJtBBF0g/x8cLAxbmZnBBqCHDVYDQLaDNGX8/MnwmIWFYSI7O8Pur1+xqsUq6MrN/b/n61ewZhBYxcLC8JyZGashOA3I//mT4RYvL8OTb9/AhlxmYSHeAJAGEwaG/4Lc3GDN779+ZTjDwEC8F0hJ3UQnWaKSMik2w9QOvAsAiQVQEU/ucD4AAAAASUVORK5CYIIA");
    ModAPI.meta.description("Adds a lot of content and stages to the game.");
    ModAPI.meta.credits("By OkLobster");

    // Item registration
    function ServersideItem() {
        var itemClass = ModAPI.reflect.getClassById("net.minecraft.item.Item");
        var itemSuper = ModAPI.reflect.getSuper(itemClass, (x) => x.length === 1);
        var itemUseAnimation = ModAPI.reflect.getClassById("net.minecraft.item.EnumAction").staticVariables["NONE"];
        var itemGetAttributes = ModAPI.reflect.getClassById("net.minecraft.item.Item").methods.getItemAttributeModifiers.method;

        function CustomItem() {
            itemSuper(this);
            this.$maxStackSize = 1;
            this.$setMaxDamage(50);
            this.$setCreativeTab(ModAPI.reflect.getClassById("net.minecraft.creativetab.CreativeTabs").staticVariables.tabTools);
        }
        ModAPI.reflect.prototypeStack(itemClass, CustomItem);

        CustomItem.prototype.$getMaxItemUseDuration = function () {
            return 0;
        };
        CustomItem.prototype.$getItemUseAction = function () {
            return itemUseAnimation;
        };
        CustomItem.prototype.$onItemRightClick = function (itemstack, world, player) {
            return itemstack;
        };
        CustomItem.prototype.$getItemAttributeModifiers = function () {
            var attributeMap = itemGetAttributes.apply(this, []);
            try {
                const AttributeModifier = ModAPI.reflect.getClassByName("AttributeModifier").constructors.find(x => x.length === 4);
                const secretUUID = ModAPI.reflect.getClassByName("Item").staticVariables.itemModifierUUID;
                const modifier = AttributeModifier(secretUUID, ModAPI.util.str("Tool modifier"), 1.0, 0);
                attributeMap.$put(ModAPI.util.str("generic.attackDamage"), modifier);
                console.log("Applied attack damage modifier to Flint Hatchet");
            } catch (e) {
                console.error("Failed to apply attack damage modifier:", e);
            }
            return attributeMap;
        };
        CustomItem.prototype.$getStrVsBlock = function (itemstack, block) {
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

    // Texture and model registration
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

    // Crafting recipe
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
            var recipePattern = ["FF", "SZ"];
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

// Blockbreak listener (replace wood and drop a stick if broken without an axe)
ModAPI.addEventListener("blockbreak", function(event) {
    let player = event.player;
    let block = event.block;
    let heldItem = player.inventory.getCurrentItem(); // Get the held item (ItemStack or null)

    console.log("Blockbreak triggered - Material:", block.material, "ID:", block.id, "Held Item:", heldItem ? heldItem.item.getUnlocalizedName() : "none");

    // Only modify behavior for wood blocks
    if (block.material && block.material.toLowerCase() === "wood") {
        let isAxe = false;

        // Check if the player is holding a valid axe
        if (heldItem) {
            let item = heldItem.item; // Get the Item object from ItemStack
            let itemAxeClass = ModAPI.reflect.getClassById("net.minecraft.item.ItemAxe");

            try {
                // Check if the held item is an axe or the custom Flint Hatchet
                isAxe = itemAxeClass.instanceOf(item.getRef()) || item.getUnlocalizedName() === "item.flint_hatchet";
                console.log("Held item is an axe:", isAxe);
            } catch (e) {
                console.error("Error checking if item is an axe:", e);
            }
        }

        if (!isAxe) {
            // Cancel the block breaking event
            event.setCancelled(true); // Prevent the block from breaking normally

            // Drop a stick at the block's location
            try {
                let stickItem = ModAPI.items["stick"]; // Get the stick item
                if (stickItem) {
                    let stickDrop = stickItem.createStack(1); // Create a stack of 1 stick
                    block.world.dropItem(stickDrop, block.pos); // Drop the stick at the block's position
                    console.log("Dropped a stick at the block's location.");
                } else {
                    console.error("Stick item not found!");
                }
            } catch (e) {
                console.error("Error dropping the stick:", e);
            }

            // Replace the block with the same wood block
            try {
                block.world.setBlock(block.pos, block.id, block.metadata); // Set the block back to its original state
                console.log("Replaced the wood block at the original position.");
            } catch (e) {
                console.error("Error replacing the wood block:", e);
            }

            // Send feedback to the player
            player.sendMessage("You need an axe to collect wood!");
        }
    }
});
})();
