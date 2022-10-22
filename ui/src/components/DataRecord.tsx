interface Dictionary<T> {
    [Key: string]: T;
}

export default class DataRecord {
  key: Dictionary<number> = {};
}
