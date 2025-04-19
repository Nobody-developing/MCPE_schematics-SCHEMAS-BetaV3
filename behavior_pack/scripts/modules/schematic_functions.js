export function loadSchematic(schematicName) {
  // Itt implementáld a logika a .schematic fájl beolvasásához
  // Ez lehet egy egyszerű JSON formátum, ami a blokkok pozícióit és típusait tartalmazza.
  // Például:
  // return {
  //   "size": [3, 3, 3],
  //   "blocks": {
  //     "0 0 0": "minecraft:stone",
  //     "1 0 0": "minecraft:dirt",
  //     "0 1 0": "minecraft:grass_block"
  //     // ... további blokkok
  //   }
  // };

  // Egyelőre egy egyszerű példa struktúrát adunk vissza:
  if (schematicName === "kis_haz") {
    return {
      "size": [3, 3, 3],
      "blocks": {
        "0 0 0": "minecraft:oak_planks",
        "1 0 0": "minecraft:oak_planks",
        "2 0 0": "minecraft:oak_planks",
        "0 1 0": "minecraft:oak_planks",
        "1 1 0": "minecraft:air",
        "2 1 0": "minecraft:oak_planks",
        "0 2 0": "minecraft:oak_planks",
        "1 2 0": "minecraft:oak_planks",
        "2 2 0": "minecraft:oak_planks",
        "0 0 1": "minecraft:cobblestone",
        "1 0 1": "minecraft:cobblestone",
        "2 0 1": "minecraft:cobblestone",
        "0 1 1": "minecraft:air",
        "1 1 1": "minecraft:air",
        "2 1 1": "minecraft:air",
        "0 2 1": "minecraft:cobblestone",
        "1 2 1": "minecraft:cobblestone",
        "2 2 1": "minecraft:cobblestone",
        "0 0 2": "minecraft:cobblestone",
        "1 0 2": "minecraft:cobblestone",
        "2 0 2": "minecraft:cobblestone",
        "0 1 2": "minecraft:air",
        "1 1 2": "minecraft:door",
        "2 1 2": "minecraft:air",
        "0 2 2": "minecraft:cobblestone",
        "1 2 2": "minecraft:cobblestone",
        "2 2 2": "minecraft:cobblestone"
      },
      "materials": {
        "minecraft:oak_planks": 6,
        "minecraft:cobblestone": 12,
        "minecraft:door": 1
      }
    };
  }
  return null;
}

export function placeSchematic(world, entity, schematicData, position) {
  if (!schematicData) {
    log("A séma nem található.");
    return;
  }

  const player = world.getEntity(entity.id);
  const isCreative = player.getComponent("minecraft:is_creative").value;
  const materials = schematicData.materials || {};

  if (!isCreative) {
    for (const material in materials) {
      const requiredAmount = materials[material];
      const hasAmount = player.getComponent("minecraft:inventory").container.hasItem(material, requiredAmount);
      if (!hasAmount) {
        log(`Nincs elég ${material} az építéshez (${requiredAmount} szükséges).`);
        return;
      }
    }

    for (const material in materials) {
      const requiredAmount = materials[material];
      player.getComponent("minecraft:inventory").container.removeItem(material, requiredAmount);
    }
    log("Az alapanyagok levonásra kerültek.");
  } else {
    log("Kreatív módban az alapanyagok nem kerülnek levonásra.");
  }

  const [sizeX, sizeY, sizeZ] = schematicData.size;
  for (const blockPos in schematicData.blocks) {
    const [offsetX, offsetY, offsetZ] = blockPos.split(" ").map(Number);
    const blockType = schematicData.blocks[blockPos];
    world.setBlock({ x: position.x + offsetX, y: position.y + offsetY, z: position.z + offsetZ }, blockType);
  }
  log(`A séma elhelyezve a(z) ${position.x}, ${position.y}, ${position.z} koordinátákon.`);
}

function log(message) {
  console.log(`[Schematics] ${message}`);
  // Esetleg küldhetsz üzenetet a játékosnak is:
  world.say(message);
}