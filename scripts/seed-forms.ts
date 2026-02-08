
import { db } from "../src/db";
import { formFields } from "../src/db/schema";

async function main() {
    console.log("Seeding default form fields...");

    // Check if fields exist
    const existing = await db.select().from(formFields);
    if (existing.length > 0) {
        console.log("Form fields already exist. Skipping.");
        process.exit(0);
    }

    try {
        await db.insert(formFields).values([
            { label: "Steam Pressure", key: "steam_pressure", type: "number", unit: "kg/cm²", order: 1 },
            { label: "Steam Temperature", key: "steam_temp", type: "number", unit: "°C", order: 2 },
            { label: "Feed Water Temp", key: "feed_water_temp", type: "number", unit: "°C", order: 3 },
            { label: "Furnace Draft", key: "furnace_draft", type: "number", unit: "mmWC", order: 4 },
            { label: "Drum Level", key: "drum_level", type: "number", unit: "%", order: 5 },
        ]);
        console.log("Default fields added successfully!");
    } catch (error) {
        console.error("Error seeding form fields:", error);
    }

    process.exit(0);
}

main();
