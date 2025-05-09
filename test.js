(function PeacefulNetherCrab() {
    ModAPI.meta.title("Peaceful Nether Crab");
    ModAPI.meta.version("v0");
    ModAPI.meta.description("Adds a peaceful crab that spawns in the Nether.");
    ModAPI.meta.credits("By YourName (with assistance from AI)");

    function waitForRenderManager() {
        return new Promise((res, rej) => {
            function check() {
                if (ModAPI.mc.renderManager) {
                    res();
                } else {
                    setTimeout(check, 1 / 20);
                }
            }
            check();
        });
    }

    function registerCrab() {
        // --- Utility References ---
        const ResourceLocation = ModAPI.reflect.getClassByName("ResourceLocation").constructors.find(x => x.length === 1);
        const GlStateManager = Object.fromEntries(Object.values(ModAPI.reflect.getClassByName("GlStateManager").staticMethods).map(x => [x.methodNameShort, x.method]));
        const EntityLiving = ModAPI.reflect.getClassById("net.minecraft.entity.EntityLiving");
        const EnumCreatureType = ModAPI.reflect.getClassById("net.minecraft.entity.EnumCreatureType").staticFields;
        const BiomeGenBase = ModAPI.reflect.getClassById("net.minecraft.world.biome.BiomeGenBase").staticFields;
        const EntityList = ModAPI.reflect.getClassById("net.minecraft.entity.EntityList").staticMethods;

        // --- ENTITY CLASS (nme_EntityNetherCrab) ---
        var entitySuper = ModAPI.reflect.getSuper(EntityLiving, (x) => x.length === 2);
        var nme_EntityNetherCrab = function nme_EntityNetherCrab($worldIn) {
            entitySuper(this, $worldIn);
            this.$setSize(0.8, 0.6);
            this.stepHeight = 1.0; // Can climb higher steps

            // Peaceful behavior - no target tasks
            this.wrapped.tasks.addTask(0, ModAPI.util.newClass("net.minecraft.entity.ai.EntityAISwimming", [this.wrapped]));
            this.wrapped.tasks.addTask(5, ModAPI.util.newClass("net.minecraft.entity.ai.EntityAIWander", [this.wrapped, 0.8]));
            this.wrapped.tasks.addTask(6, ModAPI.util.newClass("net.minecraft.entity.ai.EntityAILookIdle", [this.wrapped]));
            this.wrapped.tasks.addTask(6, ModAPI.util.newClass("net.minecraft.entity.ai.EntityAIWatchClosest", [this.wrapped, ModAPI.reflect.getClassById("net.minecraft.entity.player.EntityPlayer").classOf(), 8.0]));
        };
        ModAPI.reflect.prototypeStack(EntityLiving, nme_EntityNetherCrab);

        nme_EntityNetherCrab.prototype.$moveEntityWithHeading = function (sideways, forward) {
            // Implement basic sideways movement
            this.$moveFlying(sideways, 0, forward * 0.6); // Reduced forward speed
        };

        nme_EntityNetherCrab.prototype.$getLivingSound = function () {
            return ModAPI.util.str("mob.spider.say"); // Placeholder sound
        };

        nme_EntityNetherCrab.prototype.$getHurtSound = function () {
            return ModAPI.util.str("mob.spider.say");
        };

        nme_EntityNetherCrab.prototype.$getDeathSound = function () {
            return ModAPI.util.str("mob.spider.death");
        };

        nme_EntityNetherCrab.prototype.$getDropItem = function () {
            return null; // Peaceful, so no drops by default
        };

        nme_EntityNetherCrab.prototype.$canDespawn = function () {
            return false; // Don't despawn naturally
        };

        nme_EntityNetherCrab.prototype.$getCreatureAttribute = function () {
            return EnumCreatureType.field_70841_b.get(); // ARTHROPOD
        };

        // --- MODEL CLASS (nmcm_ModelNetherCrab) ---
        var ModelRenderer = ModAPI.reflect.getClassById("net.minecraft.client.model.ModelRenderer").constructors.find(x => x.length === 1);
        var modelBaseClass = ModAPI.reflect.getClassById("net.minecraft.client.model.ModelBase");
        var modelBaseSuper = ModAPI.reflect.getSuper(modelBaseClass);
        var nmcm_ModelNetherCrab = function nmcm_ModelNetherCrab() {
            modelBaseSuper(this);
            this.$textureWidth = 64;
            this.$textureHeight = 32;

            this.$body = ModelRenderer(this).$setTextureOffset(0, 0);
            this.$body.$addBox0(-4, -3, -3, 8, 6, 6);
            this.$body.$setRotationPoint(0, 21, 0);

            this.$rightClawBase = ModelRenderer(this).$setTextureOffset(16, 12);
            this.$rightClawBase.$addBox0(-2, -1, -1, 4, 2, 2);
            this.$rightClawBase.$setRotationPoint(-5, 19, 0);

            this.$rightClawPincer = ModelRenderer(this).$setTextureOffset(24, 12);
            this.$rightClawPincer.$addBox0(-1, 0, -1, 3, 2, 2);
            this.$rightClawPincer.$setRotationPoint(-5, 18, 0);

            this.$leftClawBase = ModelRenderer(this).$setTextureOffset(16, 16);
            this.$leftClawBase.$addBox0(-2, -1, -1, 4, 2, 2);
            this.$leftClawBase.$setRotationPoint(5, 19, 0);

            this.$leftClawPincer = ModelRenderer(this).$setTextureOffset(24, 16);
            this.$leftClawPincer.$addBox0(-2, 0, -1, 3, 2, 2);
            this.$leftClawPincer.$setRotationPoint(5, 18, 0);

            this.$rightFrontLeg = ModelRenderer(this).$setTextureOffset(0, 12);
            this.$rightFrontLeg.$addBox0(-1, 0, -1, 2, 3, 2);
            this.$rightFrontLeg.$setRotationPoint(-3, 21, -2);

            this.$leftFrontLeg = ModelRenderer(this).$setTextureOffset(0, 17);
            this.$leftFrontLeg.$addBox0(-1, 0, -1, 2, 3, 2);
            this.$leftFrontLeg.$setRotationPoint(3, 21, -2);

            this.$rightBackLeg = ModelRenderer(this).$setTextureOffset(8, 12);
            this.$rightBackLeg.$addBox0(-1, 0, -1, 2, 3, 2);
            this.$rightBackLeg.$setRotationPoint(-3, 21, 2);

            this.$leftBackLeg = ModelRenderer(this).$setTextureOffset(8, 17);
            this.$leftBackLeg.$addBox0(-1, 0, -1, 2, 3, 2);
            this.$leftBackLeg.$setRotationPoint(3, 21, 2);

            this.$rightEyeStalk = ModelRenderer(this).$setTextureOffset(32, 0);
            this.$rightEyeStalk.$addBox0(-1, -2, -1, 2, 2, 2);
            this.$rightEyeStalk.$setRotationPoint(-2, 16, -3);

            this.$leftEyeStalk = ModelRenderer(this).$setTextureOffset(32, 4);
            this.$leftEyeStalk.$addBox0(-1, -2, -1, 2, 2, 2);
            this.$leftEyeStalk.$setRotationPoint(2, 16, -3);
        };
        ModAPI.reflect.prototypeStack(modelBaseClass, nmcm_ModelNetherCrab);

        nmcm_ModelNetherCrab.prototype.$render = function ($entity, useless1, useless2, partialTicks, useless3, useless4, degToRad) {
            this.$body.$render(degToRad);
            this.$rightClawBase.$render(degToRad);
            this.$rightClawPincer.$render(degToRad);
            this.$leftClawBase.$render(degToRad);
            this.$leftClawPincer.$render(degToRad);
            this.$rightFrontLeg.$render(degToRad);
            this.$leftFrontLeg.$render(degToRad);
            this.$rightBackLeg.$render(degToRad);
            this.$leftBackLeg.$render(degToRad);
            this.$rightEyeStalk.$render(degToRad);
            this.$leftEyeStalk.$render(degToRad);
        };

        nmcm_ModelNetherCrab.prototype.$setRotationAngles = function (limbSwing, limbSwingAmount, ageInTicks, netHeadYaw, headPitch, scaleEntity, entity) {
            const walkSpeed = 0.8;
            const walkDegree = 0.8;

            this.$rightFrontLeg.rotateAngleX = Math.cos(limbSwing * walkSpeed) * walkDegree * limbSwingAmount;
            this.$leftFrontLeg.rotateAngleX = Math.cos(limbSwing * walkSpeed + Math.PI) * walkDegree * limbSwingAmount;
            this.$rightBackLeg.rotateAngleX = Math.cos(limbSwing * walkSpeed + Math.PI * 0.5) * walkDegree * limbSwingAmount;
            this.$leftBackLeg.rotateAngleX = Math.cos(limbSwing * walkSpeed + Math.PI * 1.5) * walkDegree * limbSwingAmount;

            this.$rightEyeStalk.rotateAngleY = netHeadYaw * (Math.PI / 180);
            this.$leftEyeStalk.rotateAngleY = netHeadYaw * (Math.PI / 180);
            this.$rightEyeStalk.rotateAngleX = headPitch * (Math.PI / 180) - 0.2;
            this.$leftEyeStalk.rotateAngleX = headPitch * (Math.PI / 180) - 0.2;
        };

        // --- RENDERER CLASS (nmcre_RenderNetherCrab) ---
        var renderClass = ModAPI.reflect.getClassById("net.minecraft.client.renderer.entity.RenderLiving");
        var renderSuper = ModAPI.reflect.getSuper(renderClass, (x) => x.length === 4);
        const crabTextures = ResourceLocation(ModAPI.util.str("textures/entity/crab.png"));
        var nmcre_RenderNetherCrab = function nmcre_RenderNetherCrab(renderManager) {
            renderSuper(this, renderManager, new nmcm_ModelNetherCrab(), 0.4);
        }
        ModAPI.reflect.prototypeStack(renderClass, nmcre_RenderNetherCrab);
        nmcre_RenderNetherCrab.prototype.$getEntityTexture = function (entity) {
            return crabTextures;
        }
        const parentDoRender = nmcre_RenderNetherCrab.prototype.$doRender;
        nmcre_RenderNetherCrab.prototype.$doRender = function (entity, x, y, z, yaw, pitch) {
            GlStateManager.pushMatrix();
            GlStateManager.translate(x + 0.5, y, z + 0.5);
            GlStateManager.rotate(180 - yaw, 0, 1, 0);
            GlStateManager.scale(0.3, 0.3, 0.3);
            this.$bindEntityTexture(entity);
            this.mainModel.$render(entity, entity.$limbSwing, entity.$limbSwingAmount, entity.$ticksExisted + partialTicks, entity.$rotationYawHead, entity.$rotationPitch, 0.0625);
            GlStateManager.popMatrix();
            parentDoRender.apply(this, [entity, x, y, z, yaw, pitch]);
        }

        // --- ENTITY REGISTRATION ---
        const CRAB_ID = ModAPI.keygen.entity("nether_crab");
        EntityList.addMapping0.method(
            ModAPI.util.asClass(nme_EntityNetherCrab),
            {
                $createEntity: function ($worldIn) {
                    return new nme_EntityNetherCrab($worldIn);
                }
            },
            ModAPI.util.str("Nether Crab"),
            CRAB_ID,
            0x800000, // Egg base color
            0xFF8000  // Egg spots color
        );
        console.log("Nether Crab Entity ID:", CRAB_ID);

        // --- SPAWN IN NETHER ---
        ModAPI.mc.world.biomeGenBase.getStatic().hell.wrapped.spawnableCreatureList.add(ModAPI.util.newClass("net.minecraft.world.biome.SpawnListEntry", [
            ModAPI.util.asClass(nme_EntityNetherCrab),
            10, // Weight - higher means more common
            4,  // Min group size
            8   // Max group size
        ]));

        return {
            EntityNetherCrab: nme_EntityNetherCrab,
            ModelNetherCrab: nmcm_ModelNetherCrab,
            RenderNetherCrab: nmcre_RenderNetherCrab,
            crabTexture: crabTextures
        };
    }

    ModAPI.dedicatedServer.appendCode(registerCrab);
    var data = registerCrab();

    ModAPI.addEventListener("lib:asyncsink", async () => {
        AsyncSink.setFile("resourcepacks/AsyncSinkLib/assets/minecraft/textures/entity/crab.png", await (await fetch(
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADqSURBVHhe7dMxAQAgEAAgYf9/0+YMSt9WCE17FkYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFh")
                                                                                                         }});
