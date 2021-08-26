export default function _filter(arr, selector) {
   if (typeof selector !== 'string') {
      console.error('Filter: selector must be only a string');
      return Array.from(arr);
   }

   return Array.from(arr).filter((item) => item.nodeType === 1 && item.matches(selector));
}