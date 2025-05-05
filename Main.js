(function CustomItemMod() {
    //...

    function CustomItem() {
        var creativeMiscTab = ModAPI.reflect.getClassById("net.minecraft.creativetab.CreativeTabs").staticVariables.tabMisc; //chuck it in the miscellaneous category ig
        var itemClass = ModAPI.reflect.getClassById("net.minecraft.item.Item"); //Get the item class
        var itemSuper = ModAPI.reflect.getSuper(itemClass, (x) => x.length === 1); //Get the super() function of the item class that has a length of 1
        function CustomItem() {
            itemSuper(this); //Use super function to get block properties on this class.
            this.$setCreativeTab(creativeMiscTab); //Set the creative tab of the item to be the misc tab
        }
        ModAPI.reflect.prototypeStack(itemClass, CustomItem); // ModAPI equivalent of `extends` in java
        CustomItem.prototype.$onItemRightClick = function ($itemstack, $world, $player) { //example of how to override a method
            //use ModAPI.util.wrap to create a proxy of the player and the world without $ prefixes on the properties and methods
            var player = ModAPI.util.wrap($player);
            var world = ModAPI.util.wrap($world);

            if (!world.isRemote) { //If we are on the server
                // Math.random() returns a number from 0.0 to 1.0, so we subtract 0.5 and then multiply by 2 to make it become -1.0 to 1.0 instead
                player.motionX += (Math.random() - 0.5) * 3;
                player.motionZ += (Math.random() - 0.5) * 3;

                player.motionY += Math.random() * 1.5; // gravity is a thing, so no negative numbers here otherwise it'll be boring
            }
            
            return $itemstack;
        }

        // Internal registration function. This will be used to actually register the item on both the client and the server.
        function internal_reg() {
            // Construct an instance of the CustomItem, and set it's unlocalized name (translation id)
            var custom_item = (new CustomItem()).$setUnlocalizedName(
                ModAPI.util.str("custom_item")
            );
            //Register it using ModAPI.keygen() to get the item id.
            itemClass.staticMethods.registerItem.method(ModAPI.keygen.item("custom_item"), ModAPI.util.str("custom_item"), custom_item);

            //Expose it to ModAPI
            ModAPI.items["custom_item"] = custom_item;
            
            //return the instance.
            return custom_item;
        }

        //if the item global exists (and it will on the client), register the item and return the registered instance.
        if (ModAPI.items) {
            return internal_reg();
        } else {
            //Otherwise attatch the registration method to the bootstrap method.
            ModAPI.addEventListener("bootstrap", internal_reg);
        }
    }
})();
