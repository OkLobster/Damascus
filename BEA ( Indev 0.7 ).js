(function EFB2Mod() {
    const $$scoped_efb_globals = {};

        function EFB2__defineFixupGlobal() {
            globalThis.efb2__fixupBlockIds = function efb2__fixupBlockIds() {
                var blockRegistry = ModAPI.util.wrap(ModAPI.reflect.getClassById("net.minecraft.block.Block").staticVariables.blockRegistry).getCorrective();
                var BLOCK_STATE_IDS = ModAPI.util.wrap(ModAPI.reflect.getClassById("net.minecraft.block.Block").staticVariables.BLOCK_STATE_IDS).getCorrective();
                blockRegistry.registryObjects.hashTableKToV.forEach(entry => {
                    if (entry) {
                        var block = entry.value;
                        var validStates = block.getBlockState().getValidStates();
                        var stateArray = validStates.array || [validStates.element];
                        stateArray.forEach(iblockstate => {
                            var i = blockRegistry.getIDForObject(block.getRef()) << 4 | block.getMetaFromState(iblockstate.getRef());
                            BLOCK_STATE_IDS.put(iblockstate.getRef(), i);
                        });
                    }
                });
            }
        }
        ModAPI.dedicatedServer.appendCode(EFB2__defineFixupGlobal);
        EFB2__defineFixupGlobal();
    
        function EFB2__defineStr2Ab() {
            globalThis.efb2__str2ab = function efb2__str2ab(str) {
                var buf = new ArrayBuffer(str.length);
                var bufView = new Uint8Array(buf);
                for (var i = 0, strLen = str.length; i < strLen; i++) {
                    bufView[i] = str.charCodeAt(i);
                }
                return buf;
            }
        }
        ModAPI.dedicatedServer.appendCode(EFB2__defineStr2Ab);
        EFB2__defineStr2Ab();
    
        function EFB2__defineJavaLogger() {
            var logger = ModAPI.reflect.getClassByName("LogManager").staticMethods.getLogger0.method();
            globalThis.efb2__jlog = function efb2__jlog(log) {
                if (typeof log === "string") {
                    logger.$info(ModAPI.util.str(log));
                } else {
                    console.log(log);
                }
            }
            globalThis.efb2__jwarn = function efb2__jwarn(log) {
                logger.$warn(ModAPI.util.str(log));
            }
            globalThis.efb2__jerr = function efb2__jerr(log) {
                logger.$error1(ModAPI.util.str(log));
            }
        }
        ModAPI.dedicatedServer.appendCode(EFB2__defineJavaLogger);
        EFB2__defineJavaLogger();
    
        function EFB2_defineAttrMapSet() {
            const AttributeModifier = ModAPI.reflect.getClassByName("AttributeModifier").constructors.find(x => x.length === 4);
            const secretUUID = ModAPI.reflect.getClassByName("Item").staticVariables.itemModifierUUID;
            globalThis.efb2__attrMapSet = function efb2__attrMapSet(map, key, value) {
                map.$put(ModAPI.util.str(key), AttributeModifier(secretUUID, ModAPI.util.str("Tool modifier"), value, 0));
            }
        }
        ModAPI.dedicatedServer.appendCode(EFB2_defineAttrMapSet);
        EFB2_defineAttrMapSet();
    
        function EFB2__defineExecCmdAsGlobal() {
            var getServer = ModAPI.reflect.getClassById("net.minecraft.server.MinecraftServer").staticMethods.getServer.method;
            globalThis.efb2__executeCommandAs = function efb2__executeCommandAs($commandsender, command, feedback) {
                var server = getServer();
                if (!server) { return };
                var commandManager = server.$commandManager;

                //lie a bit
                var x = $commandsender.$canCommandSenderUseCommand;
                $commandsender.$canCommandSenderUseCommand = () => 1;

                var y = $commandsender.$sendCommandFeedback;
                $commandsender.$sendCommandFeedback = feedback ? () => 1 : () => 0;

                const notifyOps0 = ModAPI.hooks.methods.nmc_CommandBase_notifyOperators0;
                const notifyOps = ModAPI.hooks.methods.nmc_CommandBase_notifyOperators;
                const addChatMsg = $commandsender.$addChatMessage;

                if (!feedback) {
                    ModAPI.hooks.methods.nmc_CommandBase_notifyOperators0 = () => { };
                    ModAPI.hooks.methods.nmc_CommandBase_notifyOperators = () => { };
                    $commandsender.$addChatMessage = () => { };
                }

                try {
                    commandManager.$executeCommand($commandsender, ModAPI.util.str(command));
                } catch (error) {
                    console.error(error);
                }

                if (!feedback) {
                    ModAPI.hooks.methods.nmc_CommandBase_notifyOperators0 = notifyOps0;
                    ModAPI.hooks.methods.nmc_CommandBase_notifyOperators = notifyOps;
                    $commandsender.$addChatMessage = addChatMsg;
                }

                $commandsender.$canCommandSenderUseCommand = x;
                $commandsender.$sendCommandFeedback = y;
            }
        }
        ModAPI.dedicatedServer.appendCode(EFB2__defineExecCmdAsGlobal);
        EFB2__defineExecCmdAsGlobal();
    
        function EFB2__defineExecCmdGlobal() {
            globalThis.efb2__executeCommand = function efb2__executeCommand($world, $blockpos, commandStr, feedback) {
                if ($world.$isRemote) {
                    return;
                }
                function x() {
                    ModAPI.reflect.getSuper(ModAPI.reflect.getClassByName("CommandBlockLogic"))(this);
                }
                ModAPI.reflect.prototypeStack(ModAPI.reflect.getClassByName("CommandBlockLogic"), x);
                var vector = ModAPI.reflect.getClassByName("Vec3").constructors[0]($blockpos.$x + 0.5, $blockpos.$y + 0.5, $blockpos.$z + 0.5);
                x.prototype.$getEntityWorld = () => { return $world };
                x.prototype.$getCommandSenderEntity = () => { return null };
                x.prototype.$updateCommand = () => { };
                x.prototype.$addChatMessage = (e) => { console.log(e) };
                x.prototype.$func_145757_a = () => { };
                x.prototype.$getPosition = () => { return $blockpos };
                x.prototype.$getPosition0 = () => { return $blockpos };
                x.prototype.$getPositionVector = () => { return vector };
                x.prototype.$func_145751_f = () => { return 0 };
                x.prototype.$sendCommandFeedback = () => { return feedback ? 1 : 0 }
                var cmd = new x();
                cmd.$setCommand(ModAPI.util.str(commandStr));

                const notifyOps0 = ModAPI.hooks.methods.nmc_CommandBase_notifyOperators0;
                const notifyOps = ModAPI.hooks.methods.nmc_CommandBase_notifyOperators;

                if (!feedback) {
                    ModAPI.hooks.methods.nmc_CommandBase_notifyOperators0 = () => { };
                    ModAPI.hooks.methods.nmc_CommandBase_notifyOperators = () => { };
                }

                try {
                    cmd.$trigger($world);
                } catch (error) {
                    console.error(error);
                }

                if (!feedback) {
                    ModAPI.hooks.methods.nmc_CommandBase_notifyOperators0 = notifyOps0;
                    ModAPI.hooks.methods.nmc_CommandBase_notifyOperators = notifyOps;
                }
            }
        }
        ModAPI.dedicatedServer.appendCode(EFB2__defineExecCmdGlobal);
        EFB2__defineExecCmdGlobal();
    
        function EFB2__defineMakeVec3() {
            var mkVec3 = ModAPI.reflect.getClassById("net.minecraft.util.Vec3").constructors.find(x => x.length === 3);
            globalThis.efb2__makeVec3 = function efb2__makeVec3(x, y, z) {
                return mkVec3(x, y, z);
            }
        }
        ModAPI.dedicatedServer.appendCode(EFB2__defineMakeVec3);
        EFB2__defineMakeVec3();
    

(function MetadataDatablock() {
    ModAPI.meta.title("BEA");
    ModAPI.meta.version("Indev v0.7 ( CANCELLED BUILD )");
    ModAPI.meta.description("( Use /BEA load ) BendiesEaglerAdvetnure adds bosses, leveling, and more!");
    ModAPI.meta.credits("By BendieGames");
})();
(function IconDatablock() {
    ModAPI.meta.icon("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAONJREFUOE9jZKAQMFKonwGnAW7Jpf+RDd81txurWqyCIM0753ShOM49pYwBmyEYBsA0967cBTfANciKoaFyGsPXD28wDEExAKZ56Z5TDC/efgAbUBzuxgAzbNfuPcQZANIA0ggyCAZABh49fQHDFXAXIDsd2VaYASDb3VxdGNBdgdUACWEBuBfQDUB3BYYByP5Hicbde1BiBRYjWF0AUglyKjLgFhABc0ExAZaHpguMWID5k5ODA8WA7z9+MIAMQY9KDANgirAZAA8PpFSJNSGBFOIyAD014kzK2DIZUUmZ1NwJAE+amhED2ToOAAAAAElFTkSuQmCC");
})();(function AdvancedBlockDatablock() {
    const $$blockTexture = "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/+EAIkV4aWYAAE1NACoAAAAIAAEBEgADAAAAAQABAAAAAAAA/9sAQwABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB/9sAQwEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB/8AAEQgAEAAQAwERAAIRAQMRAf/EABYAAQEBAAAAAAAAAAAAAAAAAAQGCP/EAB8QAAIDAQEAAgMAAAAAAAAAAAQFAgMGAQcTFQgSFP/EABkBAAIDAQAAAAAAAAAAAAAAAAQFAgMGB//EACERAAMBAQABBAMBAAAAAAAAAAIDBAEFBhESExQABxUl/9oADAMBAAIRAxEAPwDSH447Iqo90JCvGavgqu9r0nfYlBqc9jjvijBa4eamsAfZ4TN8ZligNdB8lg4XZwJkwV11dMo7L+uunBiGJrnwr4ZLHciwuLgTcx6lMbLZT2ZKlPwMqPPlKuC4QARAWJD3aOG8zha5E7F0WKWyudVSIuwyau+c2DlMcfMcs5b6SmBhonByGMZhbgP3NUyF9CyFQta90l838oxK77EdKxLwXo42qFHIvjYRzpgI3rmsM/unOq4kOXVQ15IkiCK4XRHt/RA3j25x+jeXj/i+yJaM7OsXX3GopetjATH/AKwJop9gk34cnoYGBmmGZ65raK+c71yf1O/TSxbHhN0OQUizQowBjiZ/FiwVibFjp63M97BHN9SHPxmO9ZqwmHer7gs/vSX0y1TdLqjdoOBZQPesMzjSodYbnE8SQSx2XetbPnZj3sKawu1jVysqPh8nk5PhXM58tcHUvurvk7HK6OdI/p82nVbIqbDz+bOrGrc99cpBaLWo9pewWZ+D3cV3R7g1tZdCqBU1HOu548wDKwcoVaNDXJfc4XJakBjMPomtTcaOs1eaX0PUxYHV5TK5DE5/NsSUDBteqYE3FHOuiB1sryW24qfMiRVtn2wyIjNECicXWEckLZE2yVkPNunBy00+L+NP4jeFS+eyxcatvpHpJQjGbvWrlAzBL/sKjbCwRKU2Cz0+cxKziwUtJHW6zek7qLCqdBVNXMpcDaW6oM50Oqmw6JxldUNaTcFSw3NHULwP/9k=";

    function $$ServersideBlocks() {
        const $$scoped_efb_globals = {};
        var $$itemClass = ModAPI.reflect.getClassById("net.minecraft.item.Item");
        var $$blockClass = ModAPI.reflect.getClassById("net.minecraft.block.Block");
        var $$iproperty = ModAPI.reflect.getClassById("net.minecraft.block.properties.IProperty").class;
        var $$makeBlockState = ModAPI.reflect.getClassById("net.minecraft.block.state.BlockState").constructors.find(x => x.length === 2);
        var $$blockSuper = ModAPI.reflect.getSuper($$blockClass, (x) => x.length === 2);

        var $$breakBlockMethod = $$blockClass.methods.breakBlock.method;
        var $$onBlockAddedMethod = $$blockClass.methods.onBlockAdded.method;
        var $$onNeighborBlockChangeMethod = $$blockClass.methods.onNeighborBlockChange.method;
        var $$onBlockDestroyedByPlayerMethod = $$blockClass.methods.onBlockDestroyedByPlayer.method;
        var $$randomTickMethod = $$blockClass.methods.randomTick.method;
        var $$entityCollisionMethod = $$blockClass.methods.onEntityCollidedWithBlock.method;
        var $$getDroppedItem = $$blockClass.methods.getItemDropped.method;
        var $$quantityDropped = $$blockClass.methods.quantityDropped.method;

        var $$nmb_AdvancedBlock = function $$nmb_AdvancedBlock() {
            $$blockSuper(this, ModAPI.materials.rock.getRef());
            this.$defaultBlockState = this.$blockState.$getBaseState();
              this["$fullBlock"] = 1;this.$setBlockBounds(0, 0, 0, 1, 1, 1);this.$setCreativeTab(ModAPI.reflect.getClassById("net.minecraft.creativetab.CreativeTabs").staticVariables.tabBlock);;
        }
        ModAPI.reflect.prototypeStack($$blockClass, $$nmb_AdvancedBlock);
        $$nmb_AdvancedBlock.prototype.$isOpaqueCube = function () {
            return 1;
        }
        $$nmb_AdvancedBlock.prototype.$createBlockState = function () {
            return $$makeBlockState(this, ModAPI.array.object($$iproperty, 0));
        }
        $$nmb_AdvancedBlock.prototype.$breakBlock = function ($$world, $$blockpos, $$blockstate) {
            ;
            return $$breakBlockMethod(this, $$world, $$blockpos, $$blockstate);
        }
        $$nmb_AdvancedBlock.prototype.$onBlockAdded = function ($$world, $$blockpos, $$blockstate) {
            ;
            return $$onBlockAddedMethod(this, $$world, $$blockpos, $$blockstate);
        }
        $$nmb_AdvancedBlock.prototype.$onNeighborBlockChange = function ($$world, $$blockpos, $$blockstate) {
            ;
            return $$onNeighborBlockChangeMethod(this, $$world, $$blockpos, $$blockstate);
        }
        $$nmb_AdvancedBlock.prototype.$onBlockDestroyedByPlayer = function (__efb2_arg_world, __efb2_arg_blockpos, $$blockstate) {
            var __efb2_arg_world,__efb2_arg_blockpos,FLFWBB,pos,worldz,player_item,playerss,worldz,count,players_list,selected_player,pos,player_item;function Look_for_who_mined(pos, worldz, player_item) {
  playerss = ((worldz).$playerEntities.$toArray1().data);
  count = 1;
  players_list = playerss;
  var repeat_end = players_list.length;
  for (var count2 = 0; count2 < repeat_end; count2++) {
    if (FLFWBB == 'false') {
      selected_player = players_list[(count - 1)];
      if (((((selected_player)["$getPositionVector"]())).$distanceTo((efb2__makeVec3(((pos)["$x"]),((pos)["$y"]),((pos)["$z"]))))) <= 6 && ((selected_player).$getHeldItem()?(selected_player).$getHeldItem().$item:null) == player_item) {
        selected_player = selected_player;
        FLFWBB = 'true';
        console.log('Found player');
        break;
      }
      count = (typeof count === 'number' ? count : 0) + 1;
    }
  }
  if (FLFWBB == 'false') {
    console.log('failed');
    FLFWBB = 'failed';
  }
}  FLFWBB = 'false';
  Look_for_who_mined(__efb2_arg_blockpos, __efb2_arg_world, (ModAPI.items["diamond_pickaxe"]?.getRef() || null));
  while (!(FLFWBB == 'true' || FLFWBB == 'failed')) {
    return;}
  if (FLFWBB == 'true') {
    efb2__executeCommand(__efb2_arg_world, __efb2_arg_blockpos, '/summon Item ~ ~ ~ {Item:{id:mana_nugget,Count:1}}', false);efb2__executeCommand(__efb2_arg_world, __efb2_arg_blockpos, '/kill @e[rm=0,r=2,type=Item,name="Mana Ore"]', false);}
;
            return $$onBlockDestroyedByPlayerMethod(this, __efb2_arg_world, __efb2_arg_blockpos, $$blockstate);
        }
        $$nmb_AdvancedBlock.prototype.$randomTick = function ($$world, $$blockpos, $$blockstate, $$random) {
            ;
            return $$randomTickMethod(this, $$world, $$blockpos, $$blockstate, $$random);
        }
        $$nmb_AdvancedBlock.prototype.$tickRate = function () {
            return 10;
        }
        $$nmb_AdvancedBlock.prototype.$onEntityCollidedWithBlock = function ($$world, $$blockpos, $$entity) {
            ;
            return $$entityCollisionMethod(this, $$world, $$blockpos, $$entity);
        }
        $$nmb_AdvancedBlock.prototype.$getItemDropped = function ($$blockstate, $$random, __efb2_arg_forture) {
            var __efb2_arg_forture;  return ((ModAPI.items["air"]?.getRef() || null));;
            return $$getDroppedItem(this, $$blockstate, $$random, __efb2_arg_forture);
        }
        $$nmb_AdvancedBlock.prototype.$quantityDropped = function ($$random, $$fortune) {
            $$random ||= 0;
            ;
            return $$quantityDropped(this, $$random, $$fortune);
        }
        $$nmb_AdvancedBlock.prototype.$quantityDroppedWithBonus = function ($$random, $$fortune) {
            ;
            return $$quantityDropped(this, $$random, $$fortune);
        }

        function $$internal_reg() {
            var $$cblock = (new $$nmb_AdvancedBlock()).$setUnlocalizedName(
                ModAPI.util.str("mana_ore")
            );
            $$blockClass.staticMethods.registerBlock0.method(
                ModAPI.keygen.block("mana_ore"),
                ModAPI.util.str("mana_ore"),
                $$cblock
            );
            $$itemClass.staticMethods.registerItemBlock0.method($$cblock);
            efb2__fixupBlockIds();
            ModAPI.blocks["mana_ore"] = $$cblock;
            
            return $$cblock;
        }

        if (ModAPI.materials) {
            return $$internal_reg();
        } else {
            ModAPI.addEventListener("bootstrap", $$internal_reg);
        }
    }
    ModAPI.dedicatedServer.appendCode($$ServersideBlocks);
    var $$cblock = $$ServersideBlocks();
    ModAPI.addEventListener("lib:asyncsink", async () => {
        ModAPI.addEventListener("lib:asyncsink:registeritems", ($$renderItem)=>{
            $$renderItem.registerBlock($$cblock, ModAPI.util.str("mana_ore"));
        });
        AsyncSink.L10N.set("tile.mana_ore.name", "Mana ore");
        AsyncSink.setFile("resourcepacks/AsyncSinkLib/assets/minecraft/models/block/mana_ore.json", JSON.stringify(
            {
                "parent": "block/cube_all",
                "textures": {
                    "all": "blocks/mana_ore"
                }
            }
        ));
        AsyncSink.setFile("resourcepacks/AsyncSinkLib/assets/minecraft/models/item/mana_ore.json", JSON.stringify(
            {
                "parent": "block/mana_ore",
                "display": {
                    "thirdperson": {
                        "rotation": [10, -45, 170],
                        "translation": [0, 1.5, -2.75],
                        "scale": [0.375, 0.375, 0.375]
                    }
                }
            }
        ));
        AsyncSink.setFile("resourcepacks/AsyncSinkLib/assets/minecraft/blockstates/mana_ore.json", JSON.stringify(
            {
                "variants": {
                    "normal": [
                        { "model": "mana_ore" },
                    ]
                }
            }
        ));
        AsyncSink.setFile("resourcepacks/AsyncSinkLib/assets/minecraft/textures/blocks/mana_ore.png", await (await fetch(
            $$blockTexture
        )).arrayBuffer());
        
    });
})();(function OreGenerationDatablock() {
    ModAPI.dedicatedServer.appendCode(()=>{
        const WorldGenMineable = ModAPI.reflect.getClassById("net.minecraft.world.gen.feature.WorldGenMinable").constructors.find(x=>x.length===2);

        const BiomeDecorator_decorate = ModAPI.util.getMethodFromPackage("net.minecraft.world.biome.BiomeDecorator", "decorate");
        const oldDecorate = ModAPI.hooks.methods[BiomeDecorator_decorate];
        ModAPI.hooks.methods[BiomeDecorator_decorate] = function ($this, $world, $random, $biomeGenBase, $blockpos) {
            if (!$this.$currentWorld) {
                $this[`$efb2__mana_ore0_931974_BlockGen`] = WorldGenMineable(ModAPI.blocks[`mana_ore`].getStateFromMeta(0).getRef(), 1);
            }
            return oldDecorate.apply(this, [$this, $world, $random, $biomeGenBase, $blockpos]);
        }

        const BiomeDecorator_generateOres = ModAPI.util.getMethodFromPackage("net.minecraft.world.biome.BiomeDecorator", "generateOres");
        const oldGenerateOres = ModAPI.hooks.methods[BiomeDecorator_generateOres];
        ModAPI.hooks.methods[BiomeDecorator_generateOres] = function ($this) {
            $this.$genStandardOre1(105, $this[`$efb2__mana_ore0_931974_BlockGen`] || null, 20, 256);
            return oldGenerateOres.apply(this, [$this]);
        }
    });
})();
(function CommandDatablock() {
    PluginAPI.dedicatedServer.appendCode(function () {
        const $$scoped_efb_globals = {};
        PluginAPI.addEventListener("processcommand", ($$event) => {
            if ($$event.command.startsWith("/BEA")) {
                var $$arguments = $$event.command.substring(5).trim().split(" ").filter(x=>!!x);
                var $$isPlayer = ModAPI.reflect.getClassById("net.minecraft.entity.player.EntityPlayerMP").instanceOf($$event.sender.getRef());
                if (
                    $$isPlayer
                ) {
                    (function (__efb2_arg_argument_list,__efb2_arg_player,__efb2_arg_command_sender) {var __efb2_arg_argument_list,__efb2_arg_player,__efb2_arg_command_sender,loaded_,player_to_send,message,message,player_to_send,current_player,player_to_set,version,current_level,player_xp_get,player_xp_get,MANA_LEVEL,MAX_MANA,MANA_AMOUNT,mana_to_take_away,spell_name,spell_name,mana_to_take_away;function send_message(player_to_send, message) {
  efb2__executeCommandAs(player_to_send, ('/tellraw @p ' + String(message)), true);};function load(player_to_set) {
  loaded_ = 'yes';
  $$scoped_efb_globals["loaded"] = 'yes';version = 'v0.6 INDEV!';
  efb2__jlog('loaded BEA!');console.log('loaded BEA');
  send_message(current_player, loaded_);
  send_message(current_player, 'Loading LEVELING system and other systems.');
  send_message(current_player, 'THIS BUILD OF BEA IS NOT FINISHED AND WILL NOT BE FINISHED. THIS IS BECAUSE I AM MOVING TO REAL MODAPI CODING! ( The next OFFICAL build will be BEA v0.1 ( REMASTERED INDEV )');
  setTimeout(()=>{
          ModAPI.promisify(()=>{
                LEVEL_SYSTEM();
  ;
          })();
      }, 1000);setTimeout(()=>{
          ModAPI.promisify(()=>{
                send_message(current_player, ['Welcome to BEA, ',version,'. Use "/BEA help" for more info'].join(''));
  ;
          })();
      }, 1000);setTimeout(()=>{
          ModAPI.promisify(()=>{
                ANTI_CHEAT();
  ;
          })();
      }, 2000);};function LEVEL_SYSTEM() {
  send_message(current_player, 'The level system is currently broken due to a error in EFB!');
};function get_level(player_xp_get) {
  efb2__jlog(((ModAPI.util.ustr((player_xp_get).$getName())).$experienceLevel));console.log((ModAPI.util.ustr((player_xp_get).$getName())).$experienceLevel);
  return (ModAPI.util.ustr((player_xp_get).$getName())).$experienceLevel;
};function DETECT_FOR_LEVEL_UP() {
  while (0 == 0) {
    if (current_level < get_level(current_player)) {
      efb2__jlog(([ModAPI.util.ustr((current_player).$getName()),'! You have leveled up, your new level is ',get_level(current_player),'!'].join('')));send_message(current_player, [ModAPI.util.ustr((current_player).$getName()),'! You have leveled up, your new level is ',get_level(current_player),'!'].join(''));
    }
    
            var start = Date.now();
            var current = start;
            while (current - start < (0.01 * 1000)) {
                current = Date.now();
            };
         ENSURE_NO_ENCHANT_TABLE();
    current_level = get_level(current_player);
    
            var start = Date.now();
            var current = start;
            while (current - start < (0.01 * 1000)) {
                current = Date.now();
            };
         }
};function ENSURE_NO_ENCHANT_TABLE() {
  if (((current_player).$getHeldItem()?(current_player).$getHeldItem().$item:null) == (ModAPI.util.getItemFromBlock(ModAPI.blocks["enchanting_table"]?.getRef() || null))) {
    efb2__executeCommandAs(current_player, '/clear @p enchanting_table', false);}
};function ANTI_CHEAT() {
};function load_mana_system() {
  $$scoped_efb_globals["MANA_AMOUNT_GLOBAL"] = 0;$$scoped_efb_globals["mana_system_loaded"] = 'true';$$scoped_efb_globals["regening_mana"] = 'no';$$scoped_efb_globals["using_mana"] = 'no';send_message(get_current_player(), 'Mana system loaded!');
  mana_system();
};function get_current_player() {
  current_player = ($$scoped_efb_globals["current_player"]);
  return $$scoped_efb_globals["current_player"];
};function mana_system() {
  send_message(get_current_player(), 'mana system client loaded.');
  $$scoped_efb_globals["mana_system_loaded"] = ($$scoped_efb_globals["mana_system_loaded"]);$$scoped_efb_globals["running_mana_system"] = 'no';console.log($$scoped_efb_globals["mana_system_loaded"]);
  if (($$scoped_efb_globals["mana_system_loaded"]) == 'true') {
    console.log(get_current_player());
    console.log('mana system');
    console.log(current_player.$experienceLevel);
    console.log($$scoped_efb_globals["regening_mana"]);
    send_message(get_current_player(), 'starting mana system');
    send_message(get_current_player(), $$scoped_efb_globals["regening_mana"]);
    mana_system_run();
    send_message(get_current_player(), ($$scoped_efb_globals["regening_mana"]) == 'no');
  }
};function mana_system_run() {
  if (($$scoped_efb_globals["regening_mana"]) == 'no') {
    setTimeout(()=>{
            ModAPI.promisify(()=>{
                  if (($$scoped_efb_globals["regening_mana"]) == 'no') {
        current_player = get_current_player();
        MANA_LEVEL = Math.round((current_player.$experienceLevel) / 3) + 1;
        MAX_MANA = 5 * MANA_LEVEL;
        if (MANA_AMOUNT != MAX_MANA || ($$scoped_efb_globals["MANA_AMOUNT_GLOBAL"]) != MAX_MANA) {
          if (MANA_AMOUNT > MAX_MANA || ($$scoped_efb_globals["MANA_AMOUNT_GLOBAL"]) > MAX_MANA) {
            MANA_AMOUNT = MAX_MANA;
            $$scoped_efb_globals["MANA_AMOUNT_GLOBAL"] = MANA_AMOUNT;}
          console.log(current_player.$experienceLevel);
          console.log(get_current_player());
          $$scoped_efb_globals["regening_mana"] = 'yes';setTimeout(()=>{
                  ModAPI.promisify(()=>{
                        console.log(current_player.$experienceLevel);
            console.log(get_current_player());
            $$scoped_efb_globals["MANA_LEVEL_GLOBAL"] = MANA_LEVEL;if (($$scoped_efb_globals["using_mana"]) == 'no') {
              MANA_AMOUNT = ($$scoped_efb_globals["MANA_AMOUNT_GLOBAL"]);
              if (!(MANA_AMOUNT > MAX_MANA || ($$scoped_efb_globals["MANA_AMOUNT_GLOBAL"]) > MAX_MANA)) {
                MANA_AMOUNT = (typeof MANA_AMOUNT === 'number' ? MANA_AMOUNT : 0) + 1;
                $$scoped_efb_globals["MANA_AMOUNT_GLOBAL"] = MANA_AMOUNT;MANA_AMOUNT = ($$scoped_efb_globals["MANA_AMOUNT_GLOBAL"]);
                console.log(['REGENING MANA: ',MANA_AMOUNT,'/',MAX_MANA].join(''));
                if (MANA_AMOUNT % 5 === 0 || MANA_AMOUNT == MAX_MANA) {
                  send_message(current_player, ['REGENING MANA: ',MANA_AMOUNT,'/',MAX_MANA].join(''));
                }
              }
            }
            $$scoped_efb_globals["regening_mana"] = 'no';mana_system_run();
          ;
                  })();
              }, NaN);} else if (MANA_AMOUNT == MAX_MANA) {
          mana_system_run();
        }
      }
    ;
            })();
        }, 1000);}
};function mana_spells_system___BETA__(mana_to_take_away, spell_name) {
  current_player = get_current_player();
  console.log(spell_name);
  if (spell_name != null) {
    send_message(current_player, 'NO SPELLS YET');
  }
  if (spell_name == null) {
    setTimeout(()=>{
            ModAPI.promisify(()=>{
                  $$scoped_efb_globals["using_mana"] = 'yes';setTimeout(()=>{
              ModAPI.promisify(()=>{
                    send_message(current_player, 'Taking away mana ( testing )');
        MANA_AMOUNT = ($$scoped_efb_globals["MANA_AMOUNT_GLOBAL"]) - mana_to_take_away;
        $$scoped_efb_globals["MANA_AMOUNT_GLOBAL"] = MANA_AMOUNT;MANA_AMOUNT = ($$scoped_efb_globals["MANA_AMOUNT_GLOBAL"]);
        send_message(current_player, $$scoped_efb_globals["MANA_AMOUNT_GLOBAL"]);
        console.log($$scoped_efb_globals["MANA_AMOUNT_GLOBAL"]);
        setTimeout(()=>{
                ModAPI.promisify(()=>{
                      $$scoped_efb_globals["using_mana"] = 'no';;
                })();
            }, 2000);setTimeout(()=>{
                ModAPI.promisify(()=>{
                      send_message(current_player, $$scoped_efb_globals["MANA_AMOUNT_GLOBAL"]);
        ;
                })();
            }, 5000);;
              })();
          }, 1000);;
            })();
        }, 1000);}
}  loaded_ = ($$scoped_efb_globals["loaded"]);
  if (__efb2_arg_argument_list[0] == 'load') {
    if (loaded_ != 'yes') {
      send_message(__efb2_arg_command_sender, 'Load command running...');
      loaded_ = 'yes';
      current_player = __efb2_arg_command_sender;
      $$scoped_efb_globals["current_player"] = current_player;load(__efb2_arg_command_sender);
    }
  }
  if (__efb2_arg_argument_list[0] != 'load') {
    if (($$scoped_efb_globals["loaded"]) == 'yes') {
      if (__efb2_arg_argument_list[0] == 'changelog') {
        send_message(__efb2_arg_command_sender, 'Loading request to give changelog book.');
        efb2__executeCommandAs(__efb2_arg_command_sender, '/give @p written_book 1 0 {pages:["[\\"\\",{\\"text\\":\\"v0.7 Indev - \\"},{\\"text\\":\\"Mana \\",\\"color\\":\\"dark_blue\\"},{\\"text\\":\\"update!\\",\\"color\\":\\"dark_green\\"},{\\"text\\":\\"\\\\n\\\\n\\",\\"color\\":\\"reset\\"},{\\"text\\":\\"-Added Mana Ingot.\\\\n-Added \\",\\"color\\":\\"black\\"},{\\"text\\":\\"Mana System \\",\\"color\\":\\"dark_blue\\"},{\\"text\\":\\"( BETA )\\",\\"color\\":\\"dark_red\\"},{\\"text\\":\\"\\\\n-Added Mana potion\\\\n-Fixed /BEA command handler\\",\\"color\\":\\"reset\\"}]","[\\"\\",{\\"text\\":\\"v0.6 Indev - \\"},{\\"text\\":\\"The Code redo update\\",\\"color\\":\\"dark_green\\"},{\\"text\\":\\"\\\\n\\\\n-Redid ALL the code\\\\n-Added some new commands\\\\n-Changed systems\\\\n-Added Orb of Origin ( Not obtainable yet )\\\\n-Added mana ore.\\",\\"color\\":\\"reset\\"}]"],title:Changelog,author:BendieGames}', true);}
      if (__efb2_arg_argument_list[0] == 'help') {
        send_message(__efb2_arg_command_sender, ['/BEA help ','/BEA changelog ','/BEA load',' /BEA info_book'].join(''));
      }
      if (__efb2_arg_argument_list[0] == 'info_book') {
        send_message(__efb2_arg_command_sender, 'Loading request to give info book.');
        efb2__executeCommandAs(__efb2_arg_command_sender, '/give @p written_book 1 0 {pages:["[\\"\\",{\\"text\\":\\"WARNING! THIS BOOK IS NOT COMPLETED!\\",\\"bold\\":true,\\"underlined\\":true,\\"color\\":\\"dark_red\\",\\"hoverEvent\\":{\\"action\\":\\"show_text\\",\\"value\\":\\"What did you expect this to say? Dumbass....\\"}},{\\"text\\":\\"\\\\nWelcome to \\",\\"color\\":\\"reset\\"},{\\"text\\":\\"BEA, Bendies Eagler Adventure\\",\\"color\\":\\"light_purple\\"},{\\"text\\":\\". A mod that adds \\",\\"color\\":\\"reset\\"},{\\"text\\":\\"leveling\\",\\"color\\":\\"green\\"},{\\"text\\":\\", \\",\\"color\\":\\"reset\\"},{\\"text\\":\\"bosses\\",\\"color\\":\\"dark_red\\"},{\\"text\\":\\", and so much \\",\\"color\\":\\"reset\\"},{\\"text\\":\\"more\\",\\"color\\":\\"gold\\"},{\\"text\\":\\"!\\\\n\\",\\"color\\":\\"reset\\"},{\\"text\\":\\"However, you may be new and need guidance, then this book is for you!\\",\\"color\\":\\"dark_blue\\"}]","[\\"\\",{\\"text\\":\\"Commands Page\\",\\"bold\\":true,\\"color\\":\\"blue\\"},{\\"text\\":\\"\\\\n1. \\",\\"color\\":\\"reset\\"},{\\"text\\":\\"/BEA help\\",\\"clickEvent\\":{\\"action\\":\\"run_command\\",\\"value\\":\\"/BEA help\\"}},{\\"text\\":\\" ( lists all the commands )\\\\n2. \\"},{\\"text\\":\\"/BEA load\\",\\"clickEvent\\":{\\"action\\":\\"run_command\\",\\"value\\":\\"/BEA load\\"}},{\\"text\\":\\" ( loads the mod )\\\\n3. \\"},{\\"text\\":\\"/BEA info_book\\",\\"clickEvent\\":{\\"action\\":\\"run_command\\",\\"value\\":\\"/BEA info_book\\"}},{\\"text\\":\\" ( grants you the info book )\\\\n4. \\"},{\\"text\\":\\"/BEA changelog\\",\\"clickEvent\\":{\\"action\\":\\"run_command\\",\\"value\\":\\"/BEA changelog\\"}},{\\"text\\":\\" ( gives you a book of the change log\\"}]","[\\"\\",{\\"text\\":\\"Mana Ore\\",\\"bold\\":true,\\"color\\":\\"light_purple\\"},{\\"text\\":\\"\\\\n\\\\n\\",\\"color\\":\\"reset\\"},{\\"text\\":\\"( Image of mana ore )\\",\\"underlined\\":true,\\"clickEvent\\":{\\"action\\":\\"open_url\\",\\"value\\":\\"data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/+EAIkV4aWYAAE1NACoAAAAIAAEBEgADAAAAAQABAAAAAAAA/9sAQwABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB/9sAQwEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEB/8AAEQgAEAAQAwERAAIRAQMRAf/EABYAAQEBAAAAAAAAAAAAAAAAAAQGCP/EAB8QAAIDAQEAAgMAAAAAAAAAAAQFAgMGAQcTFQgSFP/EABkBAAIDAQAAAAAAAAAAAAAAAAQFAgMGB//EACERAAMBAQABBAMBAAAAAAAAAAIDBAEFBhESExQABxUl/9oADAMBAAIRAxEAPwDSH447Iqo90JCvGavgqu9r0nfYlBqc9jjvijBa4eamsAfZ4TN8ZligNdB8lg4XZwJkwV11dMo7L+uunBiGJrnwr4ZLHciwuLgTcx6lMbLZT2ZKlPwMqPPlKuC4QARAWJD3aOG8zha5E7F0WKWyudVSIuwyau+c2DlMcfMcs5b6SmBhonByGMZhbgP3NUyF9CyFQta90l838oxK77EdKxLwXo42qFHIvjYRzpgI3rmsM/unOq4kOXVQ15IkiCK4XRHt/RA3j25x+jeXj/i+yJaM7OsXX3GopetjATH/AKwJop9gk34cnoYGBmmGZ65raK+c71yf1O/TSxbHhN0OQUizQowBjiZ/FiwVibFjp63M97BHN9SHPxmO9ZqwmHer7gs/vSX0y1TdLqjdoOBZQPesMzjSodYbnE8SQSx2XetbPnZj3sKawu1jVysqPh8nk5PhXM58tcHUvurvk7HK6OdI/p82nVbIqbDz+bOrGrc99cpBaLWo9pewWZ+D3cV3R7g1tZdCqBU1HOu548wDKwcoVaNDXJfc4XJakBjMPomtTcaOs1eaX0PUxYHV5TK5DE5/NsSUDBteqYE3FHOuiB1sryW24qfMiRVtn2wyIjNECicXWEckLZE2yVkPNunBy00+L+NP4jeFS+eyxcatvpHpJQjGbvWrlAzBL/sKjbCwRKU2Cz0+cxKziwUtJHW6zek7qLCqdBVNXMpcDaW6oM50Oqmw6JxldUNaTcFSw3NHULwP/9k=\\"}},{\\"text\\":\\"\\\\n\\\\n\\",\\"color\\":\\"reset\\"},{\\"text\\":\\"Mana Ore \\",\\"color\\":\\"dark_blue\\"},{\\"text\\":\\"is a block of well, mana, to mine it you need a \\",\\"color\\":\\"reset\\"},{\\"text\\":\\"diamond \\",\\"color\\":\\"aqua\\"},{\\"text\\":\\"pickaxe.\\\\nHowever, when you do mine, this block only drops a single nugget.\\",\\"color\\":\\"reset\\"}]","[\\"\\",{\\"text\\":\\"Mana nugget\\",\\"bold\\":true,\\"color\\":\\"dark_purple\\"},{\\"text\\":\\"\\\\n\\\\n\\",\\"color\\":\\"reset\\"},{\\"text\\":\\"9 \\",\\"color\\":\\"gold\\"},{\\"text\\":\\"Mana nuggets\\",\\"color\\":\\"dark_purple\\"},{\\"text\\":\\" in a crafting grid can be used to make a single \\",\\"color\\":\\"reset\\"},{\\"text\\":\\"Mana Ingot\\",\\"bold\\":true,\\"color\\":\\"dark_aqua\\"},{\\"text\\":\\". So far this is its \\",\\"color\\":\\"reset\\"},{\\"text\\":\\"ONLY \\",\\"color\\":\\"dark_red\\"},{\\"text\\":\\"use.\\",\\"color\\":\\"reset\\"}]","[\\"\\",{\\"text\\":\\"Mana Ingot\\",\\"bold\\":true,\\"color\\":\\"dark_aqua\\"},{\\"text\\":\\"\\\\n\\\\n\\",\\"color\\":\\"reset\\"},{\\"text\\":\\"Mana Ingots \\",\\"bold\\":true,\\"color\\":\\"dark_aqua\\"},{\\"text\\":\\"are crafted from Mana nuggets. As of this update, the Mana Ingot is no longer in use.\\",\\"color\\":\\"reset\\"}]"],title:"BEA Info Book",author:BendieGames}', true);}
      if (__efb2_arg_argument_list[0] == 'mana_system') {
        if (__efb2_arg_argument_list[1] == 'testing') {
          send_message(__efb2_arg_command_sender, 'Loading mana system');
          setTimeout(()=>{
                  ModAPI.promisify(()=>{
                        send_message(__efb2_arg_command_sender, 'WARNING! THIS MANA SYSTEM ISNT STABLE! YOUR GAME CAN CRASH! ');
          ;
                  })();
              }, 2000);setTimeout(()=>{
                  ModAPI.promisify(()=>{
                        send_message(__efb2_arg_command_sender, 'loading mana system');
            $$scoped_efb_globals["mana_system_loaded"] = 'true';load_mana_system();
          ;
                  })();
              }, 3000);}
        if (__efb2_arg_argument_list[1] == 'stable') {
          send_message(__efb2_arg_command_sender, 'Your current build doesnt support stable mana system!');
        }
        if (__efb2_arg_argument_list[1] != 'stable' && __efb2_arg_argument_list[1] != 'testing') {
          send_message(__efb2_arg_command_sender, 'Missing params!!');
        }
      }
      if (__efb2_arg_argument_list[0] == 'spell_run') {
        send_message(__efb2_arg_command_sender, 'NO SPELLS MADE YET');
        setTimeout(()=>{
                ModAPI.promisify(()=>{
                      console.log('Running test spell');
          mana_spells_system___BETA__(__efb2_arg_argument_list[1], null);
        ;
                })();
            }, 1000);}
    }
    if (($$scoped_efb_globals["loaded"]) != 'yes') {
      send_message(__efb2_arg_command_sender, 'You need to run /BEA load, before running other BEA commands');
      send_message(__efb2_arg_command_sender, loaded_);
    }
  }
})($$arguments, $$event.sender.getRef(), $$event.sender.getRef());
                }
                $$event.preventDefault = true;
            }
        });
    });
})();(function ItemDatablock() {
    const $$itemTexture = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAItJREFUOE9jZKAQMFKon2EQG1CU2vgf5r2+2fU4XYpVAqTZKLuOgY//P8Onj4wM56Y2MeAyBKcBDlW18PDl42dg2FTejNUQggaANB/f/pbh9YFppBng1wlxAUizgvRfhtNLZxJvAEgjKByca+sYPt17CTaIIgNwaQYZjDchwaKS5GgkJXkP4qRMrDcAljhCEaQC3RMAAAAASUVORK5CYII=";

    function $$ServersideItem() {
        const $$scoped_efb_globals = {};
        var $$itemClass = ModAPI.reflect.getClassById("net.minecraft.item.Item");
        var $$itemSuper = ModAPI.reflect.getSuper($$itemClass, (x) => x.length === 1);
        var $$itemUseAnimation = ModAPI.reflect.getClassById("net.minecraft.item.EnumAction").staticVariables["NONE"];
        var $$itemGetAttributes = ModAPI.reflect.getClassById("net.minecraft.item.Item").methods.getItemAttributeModifiers.method;
        function $$CustomItem() {
            $$itemSuper(this);
              this.$maxStackSize = (64);this.$setCreativeTab(ModAPI.reflect.getClassById("net.minecraft.creativetab.CreativeTabs").staticVariables.tabMaterials);;
        }
        ModAPI.reflect.prototypeStack($$itemClass, $$CustomItem);
        $$CustomItem.prototype.$onItemRightClick = function ($$itemstack, $$world, $$player) {
            
            ;
            return ($$itemstack);
        }
        $$CustomItem.prototype.$getMaxItemUseDuration = function () {
            return 32;
        }
        $$CustomItem.prototype.$getItemUseAction = function () {
            return $$itemUseAnimation;
        }
        $$CustomItem.prototype.$onItemUseFinish = function ($$itemstack, $$world, $$player) {
            ;
            return ($$itemstack);
        }
        $$CustomItem.prototype.$onUpdate = function ($$itemstack, $$world, $$player, $$hotbar_slot, $$is_held) {
            $$is_held = ($$is_held) ? true : false;
            ;
            return ($$itemstack);
        }
        $$CustomItem.prototype.$onItemUse0 = function ($$itemstack, $$player, $$world, $$blockpos) {
            ;
            return 0;
        }
        $$CustomItem.prototype.$onCreated = function ($$itemstack, $$world, $$player) {
            ;
        }
        $$CustomItem.prototype.$onBlockDestroyed = function ($$itemstack, $$world, $$block, $$blockpos, $$entity) {
            ;
            return 0;
        }
        $$CustomItem.prototype.$getItemAttributeModifiers = function () {
            var __efb2_arg_attribute_map = $$itemGetAttributes.apply(this, []);
            var __efb2_arg_attribute_map;  efb2__attrMapSet(__efb2_arg_attribute_map, "generic.attackDamage", 0);;
            return __efb2_arg_attribute_map;
        }
        $$CustomItem.prototype.$getStrVsBlock = function (__efb2_arg_itemstack, __efb2_arg_block) {
            var __efb2_arg_itemstack,__efb2_arg_block;  return 0.5;;
            return 1.0;
        }
        function $$internal_reg() {
            var $$custom_item = (new $$CustomItem()).$setUnlocalizedName(
                ModAPI.util.str("mana_nugget")
            );
            $$itemClass.staticMethods.registerItem.method(ModAPI.keygen.item("mana_nugget"), ModAPI.util.str("mana_nugget"), $$custom_item);
            ModAPI.items["mana_nugget"] = $$custom_item;
            return $$custom_item;
        }
        if (ModAPI.items) {
            return $$internal_reg();
        } else {
            ModAPI.addEventListener("bootstrap", $$internal_reg);
        }
    }

    ModAPI.dedicatedServer.appendCode($$ServersideItem); 
    var $$custom_item = $$ServersideItem();

    ModAPI.addEventListener("lib:asyncsink", async () => {
        ModAPI.addEventListener("lib:asyncsink:registeritems", ($$renderItem)=>{
            $$renderItem.registerItem($$custom_item, ModAPI.util.str("mana_nugget"));
        });
        AsyncSink.L10N.set("item.mana_nugget.name", "Mana nugget");
        AsyncSink.setFile("resourcepacks/AsyncSinkLib/assets/minecraft/models/item/mana_nugget.json", JSON.stringify(
            {
                "parent": "builtin/generated",
                "textures": {
                    "layer0": "items/mana_nugget"
                },
                "display": {
                    "thirdperson": {
                        "rotation": [ -90, 0, 0 ],
                        "translation": [ 0, 1, -3 ],
                        "scale": [ 0.55, 0.55, 0.55 ]
                    },
                    "firstperson": {
                        "rotation": [ 0, -135, 25 ],
                        "translation": [ 0, 4, 2 ],
                        "scale": [ 1.7, 1.7, 1.7 ]
                    }
                }
            }
        ));
        AsyncSink.setFile("resourcepacks/AsyncSinkLib/assets/minecraft/textures/items/mana_nugget.png", await (await fetch(
            $$itemTexture
        )).arrayBuffer());
    });
})();(function ItemDatablock() {
    const $$itemTexture = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAQBJREFUOE9jZKAQMFKon4FoA4pnb/sPsqw31QtFD14DYJpAGl1c3cCO3bN7F4ohGAYga7J38cDqw4N7dsANARuAbtPv/0x4g+brw1cMB45vZZhZmczICNIcGebB8OwdccEpJQRRB1K/dcV8BrABhqaeDBqK/3EaAtME03j3zE0GUVUNhsPb5yEM4OP/zwBSCHMJuiaQs1+8fg93JlYDPn1kBLsEZhO6JpC4hKggw18BcbAauAtMVI0YuOXFGEAGgFxCjEaQAeBAhMUCyBCQyegGgGwEAVCowwBII4wNZ4ACE2YI84eXeDUhxxdKQoKlhy9vnoPVINuEK5KJzgs0MwAAb5qJOXzBuwUAAAAASUVORK5CYII=";

    function $$ServersideItem() {
        const $$scoped_efb_globals = {};
        var $$itemClass = ModAPI.reflect.getClassById("net.minecraft.item.Item");
        var $$itemSuper = ModAPI.reflect.getSuper($$itemClass, (x) => x.length === 1);
        var $$itemUseAnimation = ModAPI.reflect.getClassById("net.minecraft.item.EnumAction").staticVariables["NONE"];
        var $$itemGetAttributes = ModAPI.reflect.getClassById("net.minecraft.item.Item").methods.getItemAttributeModifiers.method;
        function $$CustomItem() {
            $$itemSuper(this);
              this.$maxStackSize = (1);this.$setCreativeTab(ModAPI.reflect.getClassById("net.minecraft.creativetab.CreativeTabs").staticVariables.tabMaterials);;
        }
        ModAPI.reflect.prototypeStack($$itemClass, $$CustomItem);
        $$CustomItem.prototype.$onItemRightClick = function ($$itemstack, $$world, $$player) {
            ($$player).$setItemInUse($$itemstack,32);
            ;
            return ($$itemstack);
        }
        $$CustomItem.prototype.$getMaxItemUseDuration = function () {
            return 32;
        }
        $$CustomItem.prototype.$getItemUseAction = function () {
            return $$itemUseAnimation;
        }
        $$CustomItem.prototype.$onItemUseFinish = function ($$itemstack, $$world, $$player) {
            ;
            return ($$itemstack);
        }
        $$CustomItem.prototype.$onUpdate = function ($$itemstack, $$world, $$player, $$hotbar_slot, $$is_held) {
            $$is_held = ($$is_held) ? true : false;
            ;
            return ($$itemstack);
        }
        $$CustomItem.prototype.$onItemUse0 = function ($$itemstack, $$player, $$world, $$blockpos) {
            ;
            return 0;
        }
        $$CustomItem.prototype.$onCreated = function ($$itemstack, $$world, $$player) {
            ;
        }
        $$CustomItem.prototype.$onBlockDestroyed = function ($$itemstack, $$world, $$block, $$blockpos, $$entity) {
            ;
            return 0;
        }
        $$CustomItem.prototype.$getItemAttributeModifiers = function () {
            var __efb2_arg_attribute_map = $$itemGetAttributes.apply(this, []);
            var __efb2_arg_attribute_map;  efb2__attrMapSet(__efb2_arg_attribute_map, "generic.attackDamage", 0);;
            return __efb2_arg_attribute_map;
        }
        $$CustomItem.prototype.$getStrVsBlock = function (__efb2_arg_itemstack, __efb2_arg_block) {
            var __efb2_arg_itemstack,__efb2_arg_block;  return 0.1;;
            return 1.0;
        }
        function $$internal_reg() {
            var $$custom_item = (new $$CustomItem()).$setUnlocalizedName(
                ModAPI.util.str("mana_ingot")
            );
            $$itemClass.staticMethods.registerItem.method(ModAPI.keygen.item("mana_ingot"), ModAPI.util.str("mana_ingot"), $$custom_item);
            ModAPI.items["mana_ingot"] = $$custom_item;
            return $$custom_item;
        }
        if (ModAPI.items) {
            return $$internal_reg();
        } else {
            ModAPI.addEventListener("bootstrap", $$internal_reg);
        }
    }

    ModAPI.dedicatedServer.appendCode($$ServersideItem); 
    var $$custom_item = $$ServersideItem();

    ModAPI.addEventListener("lib:asyncsink", async () => {
        ModAPI.addEventListener("lib:asyncsink:registeritems", ($$renderItem)=>{
            $$renderItem.registerItem($$custom_item, ModAPI.util.str("mana_ingot"));
        });
        AsyncSink.L10N.set("item.mana_ingot.name", "Mana Ingot");
        AsyncSink.setFile("resourcepacks/AsyncSinkLib/assets/minecraft/models/item/mana_ingot.json", JSON.stringify(
            {
                "parent": "builtin/generated",
                "textures": {
                    "layer0": "items/mana_ingot"
                },
                "display": {
                    "thirdperson": {
                        "rotation": [ -90, 0, 0 ],
                        "translation": [ 0, 1, -3 ],
                        "scale": [ 0.55, 0.55, 0.55 ]
                    },
                    "firstperson": {
                        "rotation": [ 0, -135, 25 ],
                        "translation": [ 0, 4, 2 ],
                        "scale": [ 1.7, 1.7, 1.7 ]
                    }
                }
            }
        ));
        AsyncSink.setFile("resourcepacks/AsyncSinkLib/assets/minecraft/textures/items/mana_ingot.png", await (await fetch(
            $$itemTexture
        )).arrayBuffer());
    });
})();(function CraftingRecipeDatablock() {
    function $$registerRecipe() {
        function $$internalRegister() {
            const $$scoped_efb_globals = {};
            var $$ObjectClass = ModAPI.reflect.getClassById("java.lang.Object").class;
            function $$ToChar(char) {
                return ModAPI.reflect.getClassById("java.lang.Character").staticMethods.valueOf.method(char[0].charCodeAt(0));
            }
            var $$resultItemArg = "item/mana_ingot";
            var $$recipeLegend = {
                "A": {
                type: "item",
                id: "mana_nugget",
                
            },
            };
            var $$recipePattern = [
                "AAA","AAA","AAA",
            ];
            var $$itemStackFromBlockWithMeta = ModAPI.reflect.getClassById("net.minecraft.item.ItemStack").constructors[2];
            var $$itemStackFromItem = ModAPI.reflect.getClassById("net.minecraft.item.ItemStack").constructors[4];
            var $$recipeInternal = [];
            Object.keys($$recipeLegend).forEach(($$key) => {
                $$recipeInternal.push($$ToChar($$key));
                var $$ingredient = ($$recipeLegend[$$key].type === "block" ? $$itemStackFromBlockWithMeta(ModAPI.blocks[$$recipeLegend[$$key].id].getRef(),1,$$recipeLegend[$$key].meta) : ModAPI.items[$$recipeLegend[$$key].id].getRef());
                $$recipeInternal.push($$ingredient);
            });

            var $$recipeContents = $$recipePattern.map(row => ModAPI.util.str(row));
            var $$recipe = ModAPI.util.makeArray($$ObjectClass, $$recipeContents.concat($$recipeInternal));

            var $$resultItem = $$resultItemArg.startsWith("block/") ?
                ($$itemStackFromBlockWithMeta(ModAPI.blocks[$$resultItemArg.replace("block/", "").split("@")[0]].getRef(),1,$$resultItemArg.replace("block/", "").split("@")[1] || 0))
                : ($$itemStackFromItem(ModAPI.items[$$resultItemArg.replace("item/", "")].getRef(), 1));
            
            (function ($$itemstack) {})($$resultItem);
            
            var $$craftingManager = ModAPI.reflect.getClassById("net.minecraft.item.crafting.CraftingManager").staticMethods.getInstance.method();
            ModAPI.hooks.methods.nmic_CraftingManager_addRecipe($$craftingManager, $$resultItem, $$recipe);
            
        }

        if (ModAPI.items) {
            $$internalRegister();
        } else {
            ModAPI.addEventListener("bootstrap", $$internalRegister);
        }
    }
    ModAPI.dedicatedServer.appendCode($$registerRecipe);
    $$registerRecipe();
})();
ModAPI.addEventListener("load", () => { 
      if (($$scoped_efb_globals["loaded"]) != 'yes') {
    $$scoped_efb_globals["mana_system_loaded"] = 'false';$$scoped_efb_globals["loaded"] = 'no';}
 })
})();
