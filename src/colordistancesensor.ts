import { Device } from "./device";
import { Hub } from "./hub";

import * as Consts from "./consts";

export class ColorDistanceSensor extends Device {

    constructor (hub: Hub, portId: number) {
        super(hub, portId, Consts.DeviceType.COLOR_DISTANCE_SENSOR);

        this.on("newListener", (event) => {
            if (this.autoSubscribe) {
                switch (event) {
                    case "color":
                        this.subscribe(0x08);
                        break;
                    case "distance":
                        this.subscribe(0x08);
                        break;
                    case "colorAndDistance":
                        this.subscribe(0x08);
                        break;
                }
            }
        });
    }

    public receive (message: Buffer) {
        const mode = this._mode;

        switch (mode) {
            case 0x08:
                /**
                 * Emits when a color sensor is activated.
                 * @event ColorDistanceSensor#color
                 * @param {string} port
                 * @param {Color} color
                 */
                if (message[4] <= 10) {
                    const color = message[4];
                    this.emit("color", color);
                }

                let distance = message[5];
                const partial = message[7];

                if (partial > 0) {
                    distance += 1.0 / partial;
                }

                distance = Math.floor(distance * 25.4) - 20;

                /**
                 * Emits when a distance sensor is activated.
                 * @event ColorDistanceSensor#distance
                 * @param {string} port
                 * @param {number} distance Distance, in millimeters.
                 */
                this.emit("distance", distance);

                /**
                 * A combined color and distance event, emits when the sensor is activated.
                 * @event ColorDistanceSensor#colorAndDistance
                 * @param {string} port
                 * @param {Color} color
                 * @param {number} distance Distance, in millimeters.
                 */
                if (message[4] <= 10) {
                    const color = message[4];
                    this.emit("colorAndDistance", color, distance);
                }
                break;
        }
    }

}
