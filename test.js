ModAPI.addEventListener("lib:tick", () => {
    const players = ModAPI.player.list();

    players.forEach(player => {
        const heldItem = player.getHeldItem();
        let isHoldingTool = false;

        // Basic fallback tool check based on item ID or name
        if (heldItem && heldItem.getItem()) {
            const itemName = heldItem.getItem().getUnlocalizedName?.() || "";
            isHoldingTool = ["pickaxe", "axe", "shovel", "hoe", "sword"]
                .some(tool => itemName.toLowerCase().includes(tool));
        }

        let lookingAtGravel = false;

        if (!isHoldingTool) {
            const raytrace = player.rayTrace(5.0, 1.0);
            if (raytrace && raytrace.typeOfHit === "BLOCK") {
                const targetBlock = ModAPI.world.getBlock(raytrace.getBlockPos());
                if (targetBlock && targetBlock.getRegistryName().includes("gravel")) {
                    lookingAtGravel = true;
                }
            }
        }

        if (!isHoldingTool && !lookingAtGravel) {
            player.command("/effect give @s minecraft:mining_fatigue 1 10 true");
        }
    });
});
