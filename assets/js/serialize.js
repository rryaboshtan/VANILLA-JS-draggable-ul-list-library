// function _serialize(
//    sortableContainer,
//    customContainerSerializer = (serializedContainer) => serializedContainer,
//    customItemSerializer = (serializedItem) => serializedItem,
// ) {

//    if (!customItemSerializer || !customContainerSerializer || typeof customItemSerializer !== 'function' || typeof customContainerSerializer !== 'function') {
//       throw new Error('Serialize: You need to provide a valid serializer for items and the container');
//    }

//    // const items = _filter(sortableContainer.children, )
//    console.log('CustomContainerSerializer = ', customContainerSerializer);
//    console.log('sortableContainer =', sortableContainer);
//    const items = sortableContainer.children;
//    // items = null;
//    if (!items || !items.length) {
//       throw new Error(`_serialize: Ul container children list length must be more than 0`);
//    }

//    const serializedItems = Array.from(items).map((item, index) => {
//       return {
//          parent: sortableContainer,
//          node: item,
//          html: item.innerHTML || '',
//          index: index,
//       };
//    });
//    const container = {
//       node: sortableContainer,
//       itemCount: serializedItems.length,
//    };

//    return {
//       container: customContainerSerializer(container),
//       items: serializedItems.map((item) => customItemSerializer(item)),
//    };
// }

function _serialize(
   sortableContainer,
   customContainerSerializer = (serializedContainer) => serializedContainer,
   customItemSerializer = (serializedItem) => serializedItem
) {
   // console.log('');
   if (!sortableContainer || !sortableContainer.matches || !sortableContainer.matches('ul')) {
      throw new Error('_serialize: You need to provide an ul list container');
   }

   if (typeof customItemSerializer !== 'function' || typeof customContainerSerializer !== 'function') {
      throw new Error('Serialize: You need to provide a valid serializer for items and the container');
   }

   // const items = _filter(sortableContainer.children, )
   // console.log('CustomContainerSerializer = ', customContainerSerializer);
   // console.log('sortableContainer =', sortableContainer);
   const items = sortableContainer.children;
   // items = null;
   if (!items || !items.length) {
      throw new Error(`_serialize: Ul container children list length must be more than 0`);
   }

   const serializedItems = Array.from(items).map((item, index) => {
      return {
         parent: sortableContainer,
         node: item,
         html: item.innerHTML || '',
         index: index,
      };
   });
   const container = {
      node: sortableContainer,
      itemCount: serializedItems.length,
   };

   return {
      container: customContainerSerializer(container),
      // items: [],
      items: serializedItems.map((item) => customItemSerializer(item)),
   };
}

// module.exports = _serialize;
export default _serialize;
