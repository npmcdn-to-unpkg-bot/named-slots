const div = document.createElement('div');
const hasLookupFunctions = !!div.__lookupGetter__;

export default function (obj, key) {
  if (hasLookupFunctions) {
    if (obj instanceof Node) {
      obj = div;
    }

    const getter = obj.__lookupGetter__(key);
    const setter = obj.__lookupSetter__(key);
    const descriptor = {
      configurable: true,
      enumerable: true
    };

    if (getter) {
      descriptor.get = getter;
      descriptor.set = setter;
      return descriptor;
    } else if (typeof obj[key] === 'function') {
      descriptor.value = obj[key];
      return descriptor;
    }
  }

  const descriptor = Object.getOwnPropertyDescriptor(obj, key);
  if (descriptor && descriptor.get) {
    return descriptor;
  }
}
