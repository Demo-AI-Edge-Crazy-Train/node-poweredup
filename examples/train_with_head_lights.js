const PoweredUP = require("..");
const poweredUP = new PoweredUP.PoweredUP();

poweredUP.on("discover", async (hub) => {
    console.log(`Discovered ${hub.name}!`);
    poweredUP.stop();

    await hub.connect();

    // Make sure a motor is plugged into port A
    const motorA = await hub.waitForDeviceAtPort("A");
    // Make sure a led is plugged into port B
    const ledB = await hub.waitForDeviceAtPort("B");

    console.log("Connected");

    while (true) {
        console.log("Ramping up...")
        await motorA.rampPower(25, 100, 2000);
        console.log("Waiting...")
        await hub.sleep(2000);
        console.log("Braking...")
        await motorA.rampPower(100, 0, 500);
        await motorA.brake();
        console.log("Flashing the headlamp...")
        for (i = 0; i < 2; i++) {
            await ledB.setBrightness(100);
            await hub.sleep(250);
            await ledB.setBrightness(0);
            await hub.sleep(250);
        }
        console.log("Waiting...")
        await hub.sleep(2000);
    }
});

poweredUP.scan();
console.log("Scanning for Hubs...");
