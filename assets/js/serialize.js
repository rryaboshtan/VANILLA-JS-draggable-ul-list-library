export default function _serialize(
   sortableContainer,
   customContainerSerializer = (serializedContainer) => serializedContainer,
   customItemSerializer = (serializedItem, sortableContainer) => serializedItem
) {
   if (typeof customItemSerializer !== 'function' || typeof customContainerSerializer !== 'function') {
      throw new Error('Serialize: You need to provide a valid serializer for items and the container');
   }

   // const items = _filter(sortableContainer.children, )
   console.log('CustomContainerSerializer = ', customContainerSerializer);
   console.log('sortableContainer =', sortableContainer);
   const items = sortableContainer.children;
   if (!items.length) {
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
      items: serializedItems.map((item) => customItemSerializer(item, sortableContainer)),
   };
}
