import UUID from "node-uuid";
import {filter, keys, values} from "ramda";
import Moment from "moment";
import {merge} from "./helpers";

// MODELS ==========================================================================================
export default function Robot(data={}) {
  // Default values
  data = merge(data, {
    id: UUID.v4(),
  });

  // Convert and validate
  // ... omitted for brevity

  return data;
}
