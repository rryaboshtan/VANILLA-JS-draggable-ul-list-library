let dragging;
class Sortable {
   constructor(sortableSelector, options) {
      this.dragging = false;
      this.items = null;
      this.sortableSelector = sortableSelector;
      this.placeholder = null;
      this.options = options || {};
      this.init();
   }

   init() {
      this.items = document.querySelector(this.sortableSelector).children;
      // const options = this.options.connectWith || null

      const plh = (this.placeholder = this.items[0]);
      if (!plh) return;

      plh.classList.add("sortable-placeholder");
      plh.addEventListener("dragover", this.dragoverHandler);
      plh.addEventListener("drop", this.dropHandler);
      if (this.options.connectWith) {
         this.placeholder.parentElement.data = { connectWith: this.options.connectWith };
         console.log("connectWith");
      }

      console.log(this.placeholder.parentElement.data);
      const draggableLiItems = Array.from(this.items).filter((li) => li.matches(`[draggable='true']`));
      draggableLiItems.forEach((item) => {
         item.addEventListener("dragstart", this.dragstartHandler);
         item.addEventListener("dragend", (e) => item.classList.remove("sortable-dragging"));
      });
   }
   isEmpty(obj) {
      return !obj;
   }
   dragstartHandler = (e) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", "sdfdfsdfsdfd");
      e.target.classList.add("sortable-dragging");

      //Remember draggable content globally

      this.dragging = e.target;
      dragging = e.target;
      console.log("dragging=", dragging);
   };
   dropHandler = (e) => {
      console.log("Drop dragging = ", dragging);
      console.log(this.dragging);
      // if (!this.dragging) {
      //     return
      // }
      console.log("this.placeholder = ", this.placeholder);
      if (!this.placeholder) {
         return;
      }
      console.log("dragging = ", dragging);

      e.stopPropagation();
      let plh = this.placeholder;

      // if (this.isBefore(this.dragging, this.placeholder)) {
      console.log("dragging = ", dragging);
      plh.parentElement.insertBefore(dragging, plh);
      console.log(plh.parentElement.children);
      plh.removeEventListener("dragover", this.dragoverHandler);
      plh.removeEventListener("drop", this.dropHandler);
      plh.classList.remove("sortable-placeholder");
      plh = this.placeholder = dragging;

      plh.addEventListener("dragover", this.dragoverHandler);
      plh.addEventListener("drop", this.dropHandler);
      plh.classList.add("sortable-placeholder");
      // }
      // else
      //     plh.parentElement.insertBefore(this.dragging, plh.nextSibling)

      this.dragging = null;
      console.log(e.dataTransfer.getData("text/plain"));
      e.preventDefault();
   };
   dragoverHandler = (e) => {
      if (!this.placeholder) {
         return true;
      }
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      console.log(e.dataTransfer.getData("text/plain"));
      // this.placeholder.parentElement.addEventListener('onsort', ()=> console.log('OnSort'))
      this.placeholder.parentElement.dispatchEvent(new CustomEvent("onsort"));
      // if (e.target !== this.placeholder && e.target !== this.placeholder.parentElement) {
      // }
   };
   isBefore(el1, el2) {
      if (el2.parentNode === el1.parentNode && el1.previousSibling)
         for (let cur = el1.previousSibling; cur && cur.nodeType !== 9; cur = cur.previousSibling) if (cur === el2) return true;
      return false;
   }
}

// function isEmpty(obj) {
//     if (Boolean(obj))
//         return false
//     for (let key in obj) {
//         if (this.hasOwnProperty(key))
//             return false
//     }
//     return true
// }

const sortable = new Sortable(".sortable", { connectWith: ".connected" });
const connected = new Sortable(".connected");
