import Faker from "faker";
import {merge} from "./helpers";
import Robot from "./model";

// EXPORTS =========================================================================================
export default function makeRobot(manualData={}) {
  // no support to pick name by gender for now in Faker :(
  return Robot(merge(manualData, {
    name: Faker.name.firstName(),
    assemblyDate: Faker.date.between("1970-01-01", "1995-01-01"),
    manufacturer: Faker.random.arrayElement(["Russia", "USA", "China"]),
  }));
}
