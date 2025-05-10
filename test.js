ModAPI.addEventListener("sendpacketplayerdigging", data => {
    // Only intercept block-digging packets
    if (data.status === "START_DESTROY_BLOCK" || data.status === "STOP_DESTROY_BLOCK") {
        // Get the block at the target position (e.g. via SingleplayerData/world API)
        let pos = data.position; 
        let block = /* call to get block at pos.x,pos.y,pos.z */;

        // Get the player’s current held item
        let inv = LocalPlayerData.getInventory();
        let heldItem = inv.mainInventory[inv.currentItem];
        
        // Check if block is a wood log and held item is NOT an axe
        if (isWoodLog(block) && !isAxe(heldItem.itemId)) {
            data.preventDefault = true;  // Cancel the break
        }
    }
});
