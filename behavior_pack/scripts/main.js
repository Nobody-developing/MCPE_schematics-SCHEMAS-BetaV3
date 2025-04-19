import { world, system } from "@minecraft/server";
import { loadSchematic, placeSchematic } from "./modules/schematic_functions.js";

system.afterEvents.chatSend.subscribe(eventData => {
  const message = eventData.message.trim();
  const sender = eventData.sender;

  if (message.startsWith("!helyez")) {
    const parts = message.split(" ");
    if (parts.length === 2) {
      const schematicName = parts[1];
      const position = sender.location;
      const schematicData = loadSchematic(schematicName);
      if (schematicData) {
        placeSchematic(world, sender, schematicData, position);
      } else {
        sender.sendMessage(`§c[Schematics]§r A(z) "${schematicName}" nevű séma nem található.`);
      }
    } else {
      sender.sendMessage("§c[Schematics]§r Helyes használat: !helyez <sémanév>");
    }
  }
});