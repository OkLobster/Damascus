(function WoodPrimitiveMod() {
    ModAPI.meta.title("Primitive Wood Harvest");
    ModAPI.meta.version("v0.2");
    ModAPI.meta.description("Breaking logs without an axe drops a stick and instantly regrows the log.");

    ModAPI.addEventListener("bootstrap", () => {
        const logs = ["log", "log2"];
        const axes = [
            ModAPI.items.wooden_axe,
            ModAPI.items.stone_axe,
            ModAPI.items.iron_axe,
            ModAPI.items.golden_axe,
            ModAPI.items.diamond_axe
        ].map(x => x.getRef());

        logs.forEach(logId => {
            const block = ModAPI.blocks[logId]?.getRef();
            if (!block) return;

            const originalBreakBlock = block.$breakBlock;

            block.$breakBlock = function ($world, $pos, $state) {
                const wrappedWorld = ModAPI.util.wrap($world);
                const players = wrappedWorld.playerEntities.toArray1().data;

                for (const player of players) {
                    const held = player.getHeldItem?.();
                    const isHoldingAxe = held && axes.includes(held.item?.getRef());
                    const isNear = player.getDistanceSq($pos) < 6 * 6;

                    if (isNear && !isHoldingAxe) {
                        efb2__executeCommand(wrappedWorld.getRef(), $pos, "/summon Item ~ ~ ~ {Item:{id:stick,Count:1}}", false);

                        // Instantly replace the log
                        const stateMeta = $state.getBlock().getMetaFromState($state.getRef());
                        wrappedWorld.setBlockState($pos, block.getStateFromMeta(stateMeta));
                        return;
                    }
                }

                return originalBreakBlock.call(this, $world, $pos, $state);
            };
        });
    });
})();
