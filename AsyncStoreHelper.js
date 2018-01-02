
import {
  AsyncStorage,
} from 'react-native';

const storePrefix = '@petsboxStore';

const getItem = async (key) => {
  const valueRaw = await AsyncStorage.getItem(`${storePrefix}:${key}`);
  return JSON.parse(valueRaw);
};

const getItems = async (keys) => {
  const prefixedKeys = keys.map(k => `${storePrefix}:${k}`);
  return await AsyncStorage.multiGet(prefixedKeys);
};

const setItem = async (key, value) =>
  AsyncStorage.setItem(`${storePrefix}:${key}`, JSON.stringify(value));

const setItems = async (keyValuePairs) => {
  const prefixedKeyValues = keyValuePairs.map((k, v) => {
    return [
      `${storePrefix}:${k}`,
      v,
    ];
  },
  );
  return await AsyncStorage.multiSet(prefixedKeyValues);
};

const setItemsObj = async (keyValueObj) => {
  const prefixedKeyValues = Object.keys(keyValueObj).map((key) => {
    const keyPref = `${storePrefix}:${key}`;
    return [keyPref, JSON.stringify(keyValueObj[key])];
  });
  return await AsyncStorage.multiSet(prefixedKeyValues);
};

export { getItem, getItems, setItem, setItems, setItemsObj };
