// Removes an element from an array.
// String value: the value to search and remove.
// return: an array with the removed element; false otherwise.
export const removeItemFromArray = function(array: any[], value: any) {
    const idx = array.indexOf(value);
    if (idx != -1) {
        return array.splice(idx, 1); // The second parameter is the number of elements to remove.
    }
    return false;
};