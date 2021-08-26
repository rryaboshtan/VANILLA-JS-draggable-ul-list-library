import _debounce from './debounce.js';
import _throttle from './throttle.js';
import _filter from './filter.js';
import _serialize from './serialize.js';

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

      this.init();
   }

   init() {
      console.log('options = ', '----', this.options);
      console.log('destroy.test = ', /destroy/.test(this.options));
      //executeOption()

      // console.log('after Destroy')
      // console.log('this.SortableSelector = ', this.sortableSelector)
      // console.log('children = ', document.querySelector(this.sortableSelector).children)
      // this.items = document.querySelector(this.sortableSelector).children
      this.items = document.querySelectorAll(`${this.sortableSelector} li`);
      console.log('this.items = ', this.items);
      if (!this.items.length) {
         console.error(`Init: this.items.length must be more then 0`);
         return;
      }

      const plh = (this.placeholder = this.items[0]);
      if (!plh) {
         // console.log('In placeholder')
         console.error("Init: this.placeholder can't be null or undefined");
         return;
      }

      console.log('this.placeholder = ', this.placeholder);
      console.log('this.items = ', this.items);

      plh.classList.add('sortable-placeholder');
      plh.parentElement.style.userSelect = 'none';
      //   this.dragoverHandler = (_debounce(this.dragoverHandler, 200))(e);
      plh.addEventListener('dragover', this.dragoverHandler);
      plh.addEventListener('drop', this.dropHandler);
      // if (/connected/.test(this.options)) {
      //     this.placeholder.parentElement.data = { connectWith: 'connected' }
      // }

      // console.log(this.placeholder.parentElement.data)
      const draggableLiItems = Array.from(this.items).filter((li) => li.matches(`[draggable='true']`));
      if (!draggableLiItems) {
         console.error(`Init: draggableLiItems.length can't be equal to 0`);
         return;
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
      console.log('draggable items = ', draggableLiItems);

      this.placeholder.parentElement.addEventListener('onsort', () => console.log('Custom Event Fired'));
   }

   destroySortable() {
      if (!this.items) {
         console.error(
            `destroySortable: this.items can\'t be undefined or null, so the Elems <<${this.sortableSelector}>> can't be destroyed`
         );
         return;
      }
      const draggableLiItems = Array.from(this.items).filter((li) => li.matches(`[draggable='true']`));
      draggableLiItems.forEach((item) => {
         item.removeEventListener('dragstart', this.dragstartHandler);
         item.removeEventListener('dragend', (e) => item.classList.remove('sortable-dragging'));
         item.setAttribute('draggable', 'false');
         // console.log('draggableItems = ', draggableLiItems)
      });
      console.log('DraggableLiItems = ', draggableLiItems);
      delete this.placeholder.parentElement.data;
      delete this.items;
      this.placeholder.removeEventListener('dragover', this.dragoverHandler);
      this.placeholder.removeEventListener('drop', this.dropHandler);

      console.log('this=', this);
   }

   deactivateElem() {
      if (!this.items) {
         console.error(
            `deactivateElems: this.items can\'t be undefined or null, so the list of elements <<${this.deactiveElemClass}>> can't be deactivated`
         );
         return;
      }
      console.log('this.items = ', this.items);
      console.log('this.deactiveElemClass = ', this.deactiveElemClass);
      console.log('deactiveElemClass', this.deactiveElemClass);
      const deactiveLiItems = Array.from(this.items).filter((li) => li.matches(this.deactiveElemClass));
      console.log('deactiveLiItems', deactiveLiItems);
      if (!deactiveLiItems || deactiveLiItems.length === 0) {
         console.error(
            `deactivateElems of class <<${this.deactiveElemClass}>> are absent, so that it's impossible to deactivate them`
         );
         return;
      }
      console.log('deactiveElems = ', deactiveLiItems);
      deactiveLiItems.forEach((item) => {
         item.classList.add('disabled');
         console.log('GetAttribute Draggable = ', item.getAttribute('draggable'));
         item.setAttribute('draggable', 'false');
         console.log('GetAttribute Draggable = ', item.getAttribute('draggable'));
         // item.removeEventListener('dragstart', this.dragstartHandler)
         // item.removeEventListener('dragend', e => item.classList.remove('sortable-dragging'))
      });
   }
   activateElem() {
      if (!this.items) {
         console.error(
            `activateElems: this.items can\'t be undefined or null, so the list of elements <<${this.deactiveElemClass}>> can't be activated`
         );
         return;
      }
      const deactiveLiItems = Array.from(this.items).filter((li) => li.matches(this.deactiveElemClass));
      // console.log('deactiveElems = ', deactiveLiItems)
      if (!deactiveLiItems || deactiveLiItems.length === 0) {
         console.error(
            `ActivateElem: activateElems of class <<${this.deactiveElemClass}>> are absent, so that it's impossible to activate them`
         );
         return;
      }
      deactiveLiItems.forEach((item) => {
         item.classList.remove('disabled');
         // console.log('GetAttribute Draggable = ', item.getAttribute('draggable'))
         item.setAttribute('draggable', 'true');
      });

      this.deactiveElemClass = null;
   }

   dragstartHandler = (e) => {
      e.stopPropagation();
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', 'sdfdfsdfsdfd');
      e.target.classList.add('sortable-dragging');

      //Remember draggable content globally
      // this.dragging = e.target
      dragging = e.target;
      // console.log('dragging=', dragging)
   };

   dropHandler = (e) => {
      // console.log('Drop dragging = ', dragging)
      // console.log(this.dragging)
      // if (!this.dragging) {
      //     return
      // }
      // console.log('this.placeholder = ', this.placeholder)
      if (!this.placeholder) {
         console.error("dropHandler: this.placeholder can't be null or undefined");
         return;
      }
      // console.log('dragging = ', dragging)

      e.stopImmediatePropagation();
      let plh = this.placeholder;

      // if (this.isBefore(this.dragging, this.placeholder)) {
      // console.log('dragging = ', dragging)
      plh.parentElement.insertBefore(dragging, plh);
      console.log(plh.parentElement.children);
      plh.removeEventListener('dragover', this.dragoverHandler);
      plh.removeEventListener('drop', this.dropHandler);
      plh.classList.remove('sortable-placeholder');
      plh = this.placeholder = dragging;

      plh.addEventListener('dragover', this.dragoverHandler);
      plh.addEventListener('drop', this.dropHandler);
      plh.classList.add('sortable-placeholder');
      // }
      // else
      //     plh.parentElement.insertBefore(this.dragging, plh.nextSibling)

      // this.dragging = null
      // console.log(e.dataTransfer.getData('text/plain'))
      this.placeholder.parentElement.dispatchEvent(new CustomEvent('onsort'));

      e.preventDefault();
   };

   dragoverHandler = (e) => {
      // this.placeholder = null
      if (!this.placeholder) {
         console.error("dragoverHandler: this.placeholder can't be null or undefined");
         return;
      }
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      console.log('drag over Function');
   };

   executeOption(option) {
      if (/destroy/.test(option)) {
         this.destroySortable();
         return;
      } else if (/disable/.test(option)) {
         // console.log('disable ON')
         // console.log('option = ', option)
         this.placeholder.removeEventListener('dragover', this.dragoverHandler);
         this.placeholder.removeEventListener('drop', this.dropHandler);
         return;
      } else if (/enable/.test(option)) {
         // console.log('enable ON')
         // console.log('option = ', option)
         this.placeholder.addEventListener('dragover', this.dragoverHandler);
         this.placeholder.addEventListener('drop', this.dropHandler);
         return;
      } else if (/deactive-elem/.test(option)) {
         this.deactivateElem();
         return;
         // console.log('DraggableLiItems = ', draggableLiItems)
      } else if (/activate-elem/.test(option)) {
         this.activateElem();
         return;
      }
   }

   addOption(option) {
      option = option.toLowerCase();
      const optionArgs = option.split(/\s\s*/);
      console.log('optionArgs[0] = ', optionArgs[0]);

      switch (optionArgs[0]) {
         case 'drag-image':
            console.log('Drag Image');
            console.log('Drag Image name = ', optionArgs[1]);
            const draggableLiItems = Array.from(this.items).filter((li) => li.matches(`[draggable='true']`));
            draggableLiItems.forEach((item) => {
               item.addEventListener('dragstart', (e) => {
                  const img = new Image();
                  img.src = optionArgs[1];
                  console.log('img.src = ', img.src);
                  e.dataTransfer.setDragImage(img, 20, 20);
               });
               // item.addEventListener('dragend', e => item.classList.remove('sortable-dragging'))
            });
            console.log('draggable items = ', draggableLiItems);
            // console.log('optionArgs[1] = ', optionArgs[1].substring(1, optionArgs[1].length))
            break;
         case 'placeholder-class':
            this.placeholder.classList.remove(this.placeholderStyleClass);

            this.placeholderStyleClass = optionArgs[1].substring(1, optionArgs[1].length);
            console.log('optionArgs[1] = ', optionArgs[1].substring(1, optionArgs[1].length));
            this.placeholder.classList.add(this.placeholderStyleClass);

            break;
         case 'deactive-elem':
            this.deactiveElemClass = option.split(/\s\s*/)[1];
      }

      console.log('this.deactiveElemClass = ', this.deactiveElemClass);
      // console.log(this.options)

      this.executeOption(option);
      // console.log(this)
   }
}

const sortable = new Sortable('.sortable', 'connected');
const connected = new Sortable('.connected');
// // sortable.addOption('enable')
// // sortable.addOption('destroy')
connected.addOption('deactive-elem :not(.other)');
// connected.addOption('deactive-elem')

// connected.addOption('activate-elem :not(.other)');
// sortable.addOption('placeholder-class .red')

// sortable.addOption('placeholder-class .yellow')
// sortable.addOption('placeholder-class .red')
// sortable.addOption('placeholder-class .yellow')
// sortable.addOption('drag-image example.gif')

// sortable.addOption('destroy')

// sortable.addOption('placeholder-class .yellow')
