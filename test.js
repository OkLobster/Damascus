(function RecipeRemovalMod() {
    ModAPI.meta.title("Recipe Removal Mod");
    ModAPI.meta.description("This mod removes the vanilla crafting recipes for wooden planks.");
    ModAPI.meta.version("v1.0");

    function removePlankRecipes() {
        // Wait for the CraftingManager to be initialized
        ModAPI.addEventListener("bootstrap", () => {
            // Access the CraftingManager instance
            const craftingManager = ModAPI.reflect.getClassById("net.minecraft.item.crafting.CraftingManager").staticMethods.getInstance.method();
            
            // Retrieve the list of all recipes
            const recipes = craftingManager.getRecipes();

            // Identify the wooden plank item stack
            const oakPlank = ModAPI.blocks["planks"].getRef(); // Oak planks (or use ModAPI.items["planks"].getRef() if accessing items directly)
            const sprucePlank = ModAPI.blocks["planks:1"].getRef(); // Spruce planks
            const birchPlank = ModAPI.blocks["planks:2"].getRef(); // Birch planks
            const junglePlank = ModAPI.blocks["planks:3"].getRef(); // Jungle planks
            const acaciaPlank = ModAPI.blocks["planks:4"].getRef(); // Acacia planks
            const darkOakPlank = ModAPI.blocks["planks:5"].getRef(); // Dark Oak planks
            
            // Filter out recipes that produce wooden planks
            recipes.forEach(recipe => {
                if (recipe.getResult().getRef() === oakPlank ||
                    recipe.getResult().getRef() === sprucePlank ||
                    recipe.getResult().getRef() === birchPlank ||
                    recipe.getResult().getRef() === junglePlank ||
                    recipe.getResult().getRef() === acaciaPlank ||
                    recipe.getResult().getRef() === darkOakPlank) {
                
                    // Remove the recipe from the CraftingManager
                    craftingManager.getRecipeList().remove(recipe); // Assuming there's a remove method
                }
            });

            console.log("Wooden plank recipes have been removed.");
        });
    }

    removePlankRecipes();
})();
