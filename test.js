(function ForceAxeForWood() {
    const woodTypes = ["log", "log2", "stripped_log", "wood"];
    const axeKeywords = ["axe"];

    ModAPI.addEventListener("update", () => {
        const p = ModAPI.player.getLocal();      // your player
        if (!p.isSwingInProgress()) return;      // only when they’re swinging
        const hit = p.rayTrace(5.0, 1.0);
        if (!hit || hit.typeOfHit !== "BLOCK") return;

        const pos = hit.getBlockPos();
        const block = ModAPI.world.getBlock(pos);
        const id = block.getRegistryName();
        if (!woodTypes.some(w => id.includes(w))) return;

        // Check for axe
        const held = p.getHeldItem();
        const name = held?.getItem()?.getUnlocalizedName?.()?.toLowerCase() || "";
        if (!axeKeywords.some(k => name.includes(k))) {
            // revert the break
            const meta = block.getMeta(); 
            p.command(`/setblock ${pos.getX()} ${pos.getY()} ${pos.getZ()} minecraft:${id} ${meta}`);
            p.sendMessage("§cYou need an axe to chop wood!");
        }
    });
})();
