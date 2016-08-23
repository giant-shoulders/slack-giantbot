function arrayRemove(array, item) {
  let arrayIndex = array.indexOf(item);
  if (arrayIndex > -1) {
    array.splice(arrayIndex, 1);
  }
}

export default arrayRemove;
