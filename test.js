(function RecipeRemovalMod() {
    ModAPI.meta.title("Recipe Removal Mod");
    ModAPI.meta.description("This mod removes the vanilla crafting recipes for wooden planks.");
    ModAPI.meta.version("v1.0");

    function removePlankRecipes() {
        // Wait for the CraftingManager to be initialized
        ModAPI.addEventListener("bootstrap", () => {
            // Access the CraftingManager instance
            const craftingManager = ModAPI.reflect.getClassById("net.minecraft.item.crafting.CraftingManager").staticMethods.getInstance.method();

            // Retrieve the current recipe list as an array
            let recipeList = craftingManager.getRecipeList();

            // Identify the wooden plank item stack references
            const woodenPlanks = [
                ModAPI.blocks["planks"].getRef(), // Oak planks
                ModAPI.blocks["planks:1"].getRef(), // Spruce planks
                ModAPI.blocks["planks:2"].getRef(), // Birch planks
                ModAPI.blocks["planks:3"].getRef(), // Jungle planks
                ModAPI.blocks["planks:4"].getRef(), // Acacia planks
                ModAPI.blocks["planks:5"].getRef()  // Dark Oak planks
            ];

            // Filter the recipes and create a new array without plank recipes
            let newRecipeList = recipeList.filter(recipe => {
                // Keep recipes that do not produce any wooden plank
                return !woodenPlanks.includes(recipe.getResult().getRef());
            });

            // Update the recipe list in the CraftingManager
            craftingManager.setRecipeList(newRecipeList); // Assuming there's a method to set the recipe list

            console.log("Wooden plank recipes have been removed.");
        });
    }

    removePlankRecipes();
})();
