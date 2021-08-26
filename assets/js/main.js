class Sortable {
    constructor(sortableSelector) {
        this.dragging = false
        this.items = null
        this.sortableSelector = sortableSelector
        this.placeholder = null
        this.init()
    }

    init() {
        this.items = document.querySelector(this.sortableSelector).children
        console.log(this.items)

        const firstLi = this.items[0]
        console.log(firstLi)
        if (firstLi) {
            this.placeholder = firstLi.classList.add('sortable-placeholder')

            firstLi.addEventListener('dragover', this.dragoverHandler)
            firstLi.addEventListener('drop', this.dropHandler)

            this.placeholder = firstLi
            console.log(this.placeholder[0])
            console.log(this.placeholder.parentElement.children[0])

            const draggableLiItems = Array.from(this.items).filter(li => li.matches(`[draggable='true']`))
            console.log(draggableLiItems)
            draggableLiItems.forEach(item => {
                item.addEventListener('dragstart', e => {
                    e.dataTransfer.effectAllowed = 'move'
                    e.dataTransfer.setData('text/plain', null)
                    item.classList.add('sortable-dragging')

                    //Remember draggable content globally
                    this.dragging = item
                })
                item.addEventListener('dragend', e => {
                    item.classList.remove('sortable-dragging')
                    this.dragging = null

                    e.dataTransfer.effectAllowed = 'move'
                    e.dataTransfer.setData('text/html', this.dragging)

                    //Remember draggable content globally
                    this.dragging = item
                })
            })
        }

    }
    dropHandler = e => {
        if (!this.dragging) {
            return true
        }
        e.stopPropagation()
        if (this.isBefore(this.dragging, this.placeholder)) {
            this.placeholder.parentElement.insertBefore(this.dragging, this.placeholder)
            this.placeholder.removeEventListener('dragover', this.dragoverHandler)
            this.placeholder.removeEventListener('drop', this.dropHandler)
            this.placeholder.classList.remove('sortable-placeholder')
            this.placeholder = this.dragging
            this.placeholder.addEventListener('dragover', this.dragoverHandler)
            this.placeholder.addEventListener('drop', this.dropHandler)
            this.placeholder.classList.add('sortable-placeholder')
        }
        else
            this.placeholder.parentElement.insertBefore(this.dragging, this.placeholder.nextSibling)


        return false
    }
    dragoverHandler = e => {
        if (!this.dragging) {
            return true
        }
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'

        // if (e.target !== this.placeholder && e.target !== this.placeholder.parentElement) {

        // }
    }
    isBefore(el1, el2) {
        if (el2.parentNode === el1.parentNode)
            for (let cur = el1.previousSibling; cur && cur.nodeType !== 9; cur = cur.previousSibling)
                if (cur === el2)
                    return true
        return false
    }
}

const sortable = new Sortable('.sortable')
