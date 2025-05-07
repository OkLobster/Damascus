(()=> {
    ModAPI.meta.title("remove_planks");
    ModAPI.meta.version("v0.1");
    ModAPI.meta.description("Removes the plank crafting recipe");

    ModAPI.require("player");

    ModAPI.addEventListener("bootstrap", () => {
        const craftingManager = ModAPI.reflect.getClassByName("CraftingManager").staticMethods.getInstance.method();
        const recipes = craftingManager.getRecipeList();

        // Loop through all recipes and remove ones that output planks
        for (let i = recipes.size() - 1; i >= 0; i--) {
            const recipe = recipes.get(i);
            const output = recipe.getRecipeOutput?.();

            if (output != null && output.getUnlocalizedName().contains("planks")) {
                console.log("Removing recipe for:", output.getUnlocalizedName());
                recipes.remove(i);
            }
        }
    });
})();
