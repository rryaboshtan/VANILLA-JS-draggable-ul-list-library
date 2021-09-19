// import _serialize from './serialize.js';
const _serialize = require('./serialize');

let dragging;
//========================================main class============================================
class Sortable {
   constructor(sortableSelector, options) {
      this.sortableSelector = sortableSelector;
      this.options = options || '';
      this.items = null;
      this.placeholder = null;
      this.deactiveElemClass = null;
      this.placeholderStyleClass = null;
      this._serialized = null;
      this.containerSerializer = (serializedContainer) => serializedContainer;
      this.itemSerializer = (serializedItem, sortableContainer) => serializedItem;

      this.init();
   }
   get Serialized() {
      return this._serialized;
   }

   init() {
      this.items = document.querySelectorAll(`${this.sortableSelector} li`);
      if (!this.items || !this.items.length) {
         throw new Error(`Init: this.items.length must be more than 0`);
      }

      const plh = (this.placeholder = this.items[0]);
      if (!plh) {
         throw new Error("Init: this.placeholder can't be null or undefined");
      }

      plh.classList.add('sortable-placeholder');
      plh.parentElement.style.userSelect = 'none';
      plh.addEventListener('dragover', this.dragoverHandler);
      plh.addEventListener('drop', this.dropHandler);

      const draggableLiItems = Array.from(this.items).filter((li) => li.matches(`[draggable='true']`));
      if (!draggableLiItems || !draggableLiItems.length) {
         throw new Error(`Init: draggableLiItems.length can't be equal to 0`);
      }
      draggableLiItems.forEach((item) => {
         item.addEventListener('mouseenter', () => {
            if (!item.matches(this.deactiveElemClass)) item.style.opacity = '.6';
         });
         item.addEventListener('mouseleave', () => {
            if (!item.matches(this.deactiveElemClass)) item.style.opacity = '1';
         });
         item.addEventListener('dragstart', this.dragstartHandler);
         item.addEventListener('dragend', (e) => item.classList.remove('sortable-dragging'));
      });

      this.placeholder.parentElement.addEventListener('onsort', () => console.log('Custom Event Fired'));
   }

   destroySortable() {
      if (!this.items) {
         throw new Error(
            `destroySortable: this.items can\'t be undefined or null, so the List <<${this.sortableSelector}>> is already destroyed`
         );
      }
      const draggableLiItems = Array.from(this.items).filter((li) => li.matches(`[draggable='true']`));
      draggableLiItems.forEach((item) => {
         item.removeEventListener('dragstart', this.dragstartHandler);
         item.removeEventListener('dragend', (e) => item.classList.remove('sortable-dragging'));
         item.setAttribute('draggable', 'false');
      });

      delete this.placeholder.parentElement.data;
      delete this.items;
      this.placeholder.removeEventListener('dragover', this.dragoverHandler);
      this.placeholder.removeEventListener('drop', this.dropHandler);
   }

   deactivateElem() {
      if (!this.items) {
         throw new Error(
            `deactivateElems: this.items can\'t be undefined or null, so the list of elements <<${this.deactiveElemClass}>> can't be deactivated`
         );
      }
      const deactiveLiItems = Array.from(this.items).filter((li) => li.matches(this.deactiveElemClass));
      if (!deactiveLiItems || deactiveLiItems.length === 0) {
         throw new Error(
            `deactivateElems of class <<${this.deactiveElemClass}>> are absent, so that it's impossible to deactivate them`
         );
      }

      deactiveLiItems.forEach((item) => {
         item.classList.add('disabled');
         item.setAttribute('draggable', 'false');
      });
   }
   activateElem() {
      if (!this.items) {
         throw new Error(
            `activateElems: this.items can\'t be undefined or null, so the list of elements <<${this.deactiveElemClass}>> can't be activated`
         );
      }
      const deactiveLiItems = Array.from(this.items).filter((li) => li.matches(this.deactiveElemClass));

      if (!deactiveLiItems || deactiveLiItems.length === 0) {
         throw new Error(
            `ActivateElem: activateElems of class <<${this.deactiveElemClass}>> are absent, so that it's impossible to activate them`
         );
      }
      deactiveLiItems.forEach((item) => {
         item.classList.remove('disabled');
         item.setAttribute('draggable', 'true');
      });

      this.deactiveElemClass = null;
   }

   dragstartHandler = (e) => {
      e.stopPropagation();
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', 'sdfdfsdfsdfd');
      e.target.classList.add('sortable-dragging');

      dragging = e.target;
   };

   dropHandler = (e) => {
      if (!this.placeholder) {
         throw new Error("dropHandler: this.placeholder can't be null or undefined");
      }

      e.stopImmediatePropagation();
      let plh = this.placeholder;

      plh.parentElement.insertBefore(dragging, plh);
      console.log(plh.parentElement.children);
      plh.removeEventListener('dragover', this.dragoverHandler);
      plh.removeEventListener('drop', this.dropHandler);
      plh.classList.remove('sortable-placeholder');
      plh = this.placeholder = dragging;

      plh.addEventListener('dragover', this.dragoverHandler);
      plh.addEventListener('drop', this.dropHandler);
      plh.classList.add('sortable-placeholder');

      this.placeholder.parentElement.dispatchEvent(new CustomEvent('onsort'));

      e.preventDefault();
   };

   dragoverHandler = (e) => {
      if (!this.placeholder) {
         throw new Error("dragoverHandler: this.placeholder can't be null or undefined");
      }
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
   };

   addOption(option) {
      const optionArgs = option.split(/\s\s*/);

      switch (optionArgs[0]) {
         case 'destroy':
            try {
               this.destroySortable();
            } catch (err) {
               console.error(err.message);
            }
            break;
         case 'disable':
            this.placeholder.removeEventListener('dragover', this.dragoverHandler);
            this.placeholder.removeEventListener('drop', this.dropHandler);
            break;
         case 'enable':
            this.placeholder.addEventListener('dragover', this.dragoverHandler);
            this.placeholder.addEventListener('drop', this.dropHandler);
            break;
         case 'deactive-elem':
            this.deactiveElemClass = option.split(/\s\s*/)[1];
            try {
               this.deactivateElem();
            } catch (err) {
               console.error(err.message);
            }
            break;
         case 'activate-elem':
            try {
               this.activateElem();
            } catch (err) {
               console.error(err.message);
            }
            break;
         case 'containerSerializer':
            this.userContSerializer = window[optionArgs[1]];
            break;
         case 'itemSerializer':
            this.userItemSerializer = window[optionArgs[1]];
            break;
         case 'serialize':
            this.serialized = _serialize(
               document.querySelector(this.sortableSelector),
               this.userContSerializer,
               this.userItemSerializer
            );
            break;
         case 'drag-image':
            this.dragImage();
            break;
         case 'placeholder-class':
            this.placeholder.classList.remove(this.placeholderStyleClass);

            this.placeholderStyleClass = optionArgs[1].substring(1, optionArgs[1].length);
            this.placeholder.classList.add(this.placeholderStyleClass);

            break;
         default:
            throw new Error('executeOption: user inputs unknown option');
      }
   }
   dragImage() {
      const draggableLiItems = Array.from(this.items).filter((li) => li.matches(`[draggable='true']`));
      if (!draggableLiItems) {
         throw new Error(`Init: draggableLiItems.length can't be equal to 0`);
      }
      draggableLiItems.forEach((item) => {
         item.addEventListener('dragstart', (e) => {
            const img = new Image();
            img.src = optionArgs[1];
            e.dataTransfer.setDragImage(img, 20, 20);
         });
      });
   }
}

const sortable = new Sortable('.sortable', 'connected');
const connected = new Sortable('.connected');

connected.addOption('deactive-elem :not(.other)');

window.userContSerializer = () => {
   return {
      length: 20,
   };
};

window.userItemSerializer = (item) => {
   item.description = 'user serialize';
   return item;
};

sortable.addOption('containerSerializer userContSerializer');
sortable.addOption('itemSerializer userItemSerializer');

sortable.addOption('serialize');
console.log(sortable._serialized);
// sortable.addOption('asdfdsdfsdf');

// connected.addOption('activate-elem :not(.other)');
// sortable.addOption('placeholder-class .red')

// sortable.addOption('placeholder-class .yellow')
// sortable.addOption('placeholder-class .red')
// sortable.addOption('placeholder-class .yellow')
// sortable.addOption('drag-image example.gif')
