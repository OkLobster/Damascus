(function PreventWoodBreak() {
    let lastLogPos = null;

    ModAPI.addEventListener("update", () => {
        const player = ModAPI.player.getLocal();
        const ray = player.rayTrace(5.0, 1.0);
        if (!ray || ray.typeOfHit !== "BLOCK") return;

        const pos = ray.getBlockPos();
        const block = ModAPI.world.getBlock(pos);
        const id = block?.getRegistryName?.() || "";

        // Check if block is log
        if (id.includes("log") || id.includes("wood")) {
            lastLogPos = pos;
        }

        // Now, check if the block disappeared
        if (lastLogPos) {
            const current = ModAPI.world.getBlock(lastLogPos);
            const currentId = current?.getRegistryName?.() || "minecraft:air";
            if (currentId === "minecraft:air") {
                // Check if player was not holding axe
                const item = player.getHeldItem();
                const name = item?.getItem?.()?.getUnlocalizedName?.()?.toLowerCase() || "";
                const isAxe = name.includes("axe");

                if (!isAxe) {
                    player.command(`/setblock ${lastLogPos.getX()} ${lastLogPos.getY()} ${lastLogPos.getZ()} minecraft:log`);
                    player.sendMessage("§cYou need an axe to chop wood!");
                }

                lastLogPos = null;
            }
        }
    });
})();
