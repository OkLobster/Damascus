(function ApplyFatigueDebuff() {
    // Effect IDs
    const MINING_FATIGUE_ID = 4; // Mining Fatigue
    const FATIGUE_DURATION = 20; // 1 second (in ticks)
    const FATIGUE_LEVEL = 10;     // Level XI - very brutal by design

    // Tool classes in Minecraft (roughly — adapt to Eagler as needed)
    const validToolClasses = ["pickaxe", "axe", "shovel", "hoe", "sword"];

    // Fallback for ModAPI.reflect.getClass (not implemented)
    function getClass(obj) {
        return obj?.constructor?.__class__ || { getSimpleName: () => "unknown" };
    }

    ModAPI.addEventListener("lib:tick", () => {
        const players = ModAPI.player.list();

        players.forEach(player => {
            const heldItem = player.getHeldItem();

            let isHoldingTool = false;

            if (heldItem && heldItem.getItem()) {
                const item = heldItem.getItem();
                const itemClass = getClass(item);
                const className = itemClass.getSimpleName().toLowerCase();

                isHoldingTool = validToolClasses.some(tool => className.includes(tool));
            }

            let lookingAtGravel = false;

            // Only raytrace if not holding a tool to save performance
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
                const potionEffect = ModAPI.reflect.getClassById("net.minecraft.potion.PotionEffect")
                    .constructors[2](MINING_FATIGUE_ID, FATIGUE_DURATION, FATIGUE_LEVEL);

                player.addPotionEffect(potionEffect);
            }
        });
    });
})();

