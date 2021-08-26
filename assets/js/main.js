class Sortable {
   constructor(sortableSelector) {
      this.dragging = false;
      this.items = null;
      this.sortableSelector = sortableSelector;
      this.placeholder = null;
      this.init();
   }

   init() {
      this.items = document.querySelector(this.sortableSelector).children;
      console.log(this.items);

      const firstLi = this.items[0];
      if (!firstLi) return;

      this.placeholder = firstLi.classList.add("sortable-placeholder");

      firstLi.addEventListener("dragover", this.dragoverHandler);
      firstLi.addEventListener("drop", this.dropHandler);

      this.placeholder = firstLi;

      const draggableLiItems = Array.from(this.items).filter((li) => li.matches(`[draggable='true']`));
      draggableLiItems.forEach((item) => {
         item.addEventListener("dragstart", (e) => {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/plain", null);
            item.classList.add("sortable-dragging");

            //Remember draggable content globally
            this.dragging = item;
         });
         item.addEventListener("dragend", (e) => {
            item.classList.remove("sortable-dragging");
         });
      });
   }
   dropHandler = (e) => {
      if (!this.dragging) {
         return true;
      }
      e.stopPropagation();
      let plh = this.placeholder;

      if (this.isBefore(this.dragging, this.placeholder)) {
         plh.parentElement.insertBefore(this.dragging, plh);
         plh.removeEventListener("dragover", this.dragoverHandler);
         plh.removeEventListener("drop", this.dropHandler);
         plh.classList.remove("sortable-placeholder");
         plh = this.placeholder = this.dragging;

         plh.addEventListener("dragover", this.dragoverHandler);
         plh.addEventListener("drop", this.dropHandler);
         plh.classList.add("sortable-placeholder");
      } else plh.parentElement.insertBefore(this.dragging, plh.nextSibling);

      this.dragging = null;
      return false;
   };
   dragoverHandler = (e) => {
      if (!this.dragging) {
         return true;
      }
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";

      // if (e.target !== this.placeholder && e.target !== this.placeholder.parentElement) {
      // }
   };
   isBefore(el1, el2) {
      if (el2.parentNode === el1.parentNode)
         for (let cur = el1.previousSibling; cur && cur.nodeType !== 9; cur = cur.previousSibling) if (cur === el2) return true;
      return false;
   }
}

const sortable = new Sortable(".sortable");
