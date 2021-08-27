export default function _serialize(
   sortableContainer,
   customItemSerializer = (serializedItem, sortableContainer) => serializedItem,
   customContainerSerializer = (serializedContainer) => serializedContainer
) {
   if (typeof customItemSerializer !== 'function' || typeof customContainerSerializer !== 'function') {
      console.error('Serialize: You need to provide a valid serializer for items and the container');
      return;
   }

   // const items = _filter(sortableContainer.children, )
    console.log('sortableContainer =', sortableContainer)
   const items = sortableContainer.children;
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