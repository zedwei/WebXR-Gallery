AFRAME.registerComponent('go-board-listener', {
    init: function() {
        // this.tick = AFRAME.utils.throttleTick(this.tick, 50, this);

        this.el.addEventListener('mouseenter', function(event) {
            this.cursorEl = event.detail.cursorEl;
        });

        this.el.addEventListener('mouseleave', function(event) {
            this.cursorEl = null;
            if (this.stoneIndicator)
            {
                this.stoneIndicator.remove();
                this.stoneIndicator = null;
            }
        });
    },

    tick: function(time) {
        if (!this.el.cursorEl) {return; }
        let position = this.el.cursorEl.components.raycaster.getIntersection(this.el);
        if (!position) {return; }

        if (!this.el.stoneIndicator)
        {
            let template = document.querySelector('#go-blackstone');
            stoneClone = template.content.cloneNode(true);
            this.el.stoneIndicator = stoneClone.querySelector("a-entity");
            this.el.stoneIndicator.id = "stone-indicator";
            tbody = document.querySelector("a-scene");
            tbody.appendChild(this.el.stoneIndicator);
        }
        this.el.stoneIndicator.setAttribute("position", `${position.point.x} ${position.point.y}, ${position.point.z}`);
    }
});

