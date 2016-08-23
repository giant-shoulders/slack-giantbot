function arrayFind(array, key, item) {
  return array.find(single => single[key] === item);
}

export default arrayFind;
