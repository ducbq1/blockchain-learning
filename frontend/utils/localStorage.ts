export function addStorage(obj, name) {
  const addressStorage = window.localStorage;
  if (
    getStorage(name).length == 0 ||
    getStorage(name).every(
      (item) => !item.address.toLowerCase().includes(obj.address.toLowerCase())
    )
  ) {
    addressStorage.setItem(name, JSON.stringify(getStorage(name).concat(obj)));
  }
}

export function getStorage(name) {
  const addressStorage = window.localStorage;
  if (!addressStorage.getItem(name)) {
    addressStorage.setItem("addressBook", "[]");
  }
  return JSON.parse(addressStorage.getItem(name));
}
