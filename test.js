(function ApplyFatigueDebuff() {
    // Tool classes that can break wood
    const validAxes = ["axe"];

    // Wood blocks to block unless holding axe
    const blockedWoodTypes = ["log", "log2", "stripped_log", "wood"];

    // Prevent breaking wood if not holding an axe
    ModAPI.addEventListener("lib:breakattempt", (event) => {
        const player = event.getPlayer();
        const block = ModAPI.world.getBlock(event.getBlockPos());

        const blockId = block.getRegistryName();
        const isWood = blockedWoodTypes.some(wood => blockId.includes(wood));

        if (isWood) {
            const heldItem = player.getHeldItem();
            let isHoldingAxe = false;

            if (heldItem && heldItem.getItem()) {
                const name = heldItem.getItem().getUnlocalizedName?.().toLowerCase() || "";
                isHoldingAxe = validAxes.some(tool => name.includes(tool));
            }

            if (!isHoldingAxe) {
                event.setCanceled(true); // Cancel block break
                player.sendMessage("§cYou need an axe to chop wood!");
            }
        }
    });

    // Always give buffs to spawned enemies (100% chance for testing)
    ModAPI.addEventListener("lib:entityspawn", (event) => {
        const entity = event.getEntity();

        if (entity && entity.isMob) {
            const enchantments = ModAPI.reflect.getClassById("net.minecraft.enchantment.Enchantment").staticMethods.values.method();
            const applyEnchantment = ModAPI.reflect.getClassById("net.minecraft.item.ItemStack").methods.addEnchantment.method;

            const equipmentSlots = [0, 1, 2, 3, 4]; // Mainhand, armor
            equipmentSlots.forEach(slot => {
                const item = entity.getEquipmentInSlot(slot);
                if (item) {
                    applyEnchantment(item, enchantments[0], 2); // Example: apply Sharpness II or similar
                }
            });

            const potionEffectCtor = ModAPI.reflect.getClassById("net.minecraft.potion.PotionEffect").constructors[2];

            const buffPool = [
                { id: 1, level: 1 },  // Speed
                { id: 5, level: 1 },  // Strength
                { id: 11, level: 0 }, // Resistance
                { id: 12, level: 0 }, // Fire Resistance
                { id: 10, level: 0 }, // Regeneration
                { id: 21, level: 0 }  // Health Boost
            ];

            // Give 2 random buffs from the pool
            const chosenBuffs = [];
            while (chosenBuffs.length < 2) {
                const buff = buffPool[Math.floor(Math.random() * buffPool.length)];
                if (!chosenBuffs.some(b => b.id === buff.id)) {
                    chosenBuffs.push(buff);
                }
            }

            chosenBuffs.forEach(buff => {
                const effect = potionEffectCtor(buff.id, 32767, buff.level);
                entity.addPotionEffect(effect);
            });

            entity.setCustomNameTag("§dEmpowered");
        }
    });
})();
