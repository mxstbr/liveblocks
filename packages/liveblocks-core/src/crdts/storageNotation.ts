import { assertNever } from "../lib/assert";
import type { Json } from "../lib/Json";
import { isJsonObject } from "../lib/Json";
import { LiveList } from "./LiveList";
import { LiveMap } from "./LiveMap";
import { LiveObject } from "./LiveObject";
import type { Lson, LsonObject } from "./Lson";

export type StorageNotationRoot = StorageNotationObject;

type StorageNotationFields = Record<string, StorageNotation>;

type StorageNotationObject = {
  liveblocksType: "LiveObject";
  data: StorageNotationFields;
};

type StorageNotationMap = {
  liveblocksType: "LiveMap";
  data: StorageNotationFields;
};

type StorageNotationList = {
  liveblocksType: "LiveList";
  data: StorageNotation[];
};

type StorageNotationNode =
  | StorageNotationObject
  | StorageNotationMap
  | StorageNotationList;

type StorageNotation = StorageNotationNode | Json;

export function storageNotationToLiveObject(
  root: StorageNotationRoot
): LiveObject<LsonObject> {
  return fieldsToLiveObject(root.data);
}

function storageNotationToLson(data: StorageNotation): Lson {
  if (isStorageNotationNode(data)) {
    switch (data.liveblocksType) {
      case "LiveObject":
        return fieldsToLiveObject(data.data);

      case "LiveList":
        return itemsToLiveList(data.data);

      case "LiveMap":
        return fieldsToLiveMap(data.data);

      default:
        return assertNever(data, "Unknown `liveblocksType` field");
    }
  } else {
    return data;
  }
}

function fieldsToLiveMap(fields: StorageNotationFields): LiveMap<string, Lson> {
  const liveMap = new LiveMap();

  for (const [key, value] of Object.entries(fields)) {
    liveMap.set(key, storageNotationToLson(value));
  }

  return liveMap;
}

function itemsToLiveList(items: StorageNotation[]): LiveList<Lson> {
  const liveList = new LiveList();

  items.forEach((item) => {
    liveList.push(storageNotationToLson(item));
  });

  return liveList;
}

function fieldsToLiveObject(
  fields: StorageNotationFields
): LiveObject<LsonObject> {
  const liveObject = new LiveObject();

  for (const [key, value] of Object.entries(fields)) {
    if (isStorageNotationNode(value)) {
      liveObject.set(key, storageNotationToLson(value));
    } else {
      liveObject.set(key, value);
    }
  }

  return liveObject;
}

function isStorageNotationNode(
  value: StorageNotation
): value is StorageNotationNode {
  return isJsonObject(value) && value.liveblocksType !== undefined;
}
