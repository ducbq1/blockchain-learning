export function addStorage(obj, name) {
  const addressStorage = window.localStorage;
  if (
    getStorage(name).length == 0 ||
    getStorage(name).every(
      (item) => !item.address.toLowerCase().includes(obj.address.toLowerCase())
    )
  ) {
    addressStorage.setItem(
      "addressBook",
      JSON.stringify(getStorage(name).concat(obj))
    );
  }
}

export function getStorage(name) {
  const addressStorage = window.localStorage;
  return JSON.parse(addressStorage.getItem(name));
}
