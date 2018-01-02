
import {
  AsyncStorage,
} from 'react-native';

const storePrefix = '@petsboxStore';

const getItem = async key =>
   await AsyncStorage.getItem(`${storePrefix}:${key}`);

const getItems = async (keys) => {
  const prefixedKeys = keys.map(k => `${storePrefix}:${k}`);
  await AsyncStorage.multiGet(prefixedKeys);
};


const setItem = async (key, value) =>
   await AsyncStorage.setItem(`${storePrefix}:${key}`, value);

const setItems = async (keyValuePairs) => {
  const prefixedKeyValues = keyValuePairs.map((k, v) => {
    return [
      `${storePrefix}:${k}`,
      v,
    ];
  },
  );
  await AsyncStorage.multiSet(prefixedKeyValues);
};

const setItemsObj = async (keyValueObj) => {
  const prefixedKeyValues = Object.keys(keyValueObj).map((key) => {
    const keyPref = `${storePrefix}:${key}`;
    return [keyPref, keyValueObj[key].toString()];
  });
  console.log('setting values ', prefixedKeyValues);
  await AsyncStorage.multiSet(prefixedKeyValues);
};

export { getItem, getItems, setItem, setItems, setItemsObj };
