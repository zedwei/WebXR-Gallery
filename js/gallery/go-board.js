var selectedGoColor = '';

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

        this.el.addEventListener('click', function(event) {
            if (selectedGoColor != 'black' && selectedGoColor != 'white') {return;}
            if (!this.cursorEl) {return; }

            let position = this.cursorEl.components.raycaster.getIntersection(this);
            if (!position) {return; }
            console.log("test");
            let template = document.querySelector(`#go-${selectedGoColor}stone`);
            stoneClone = template.content.cloneNode(true);
            stone = stoneClone.querySelector("a-entity");
            stone.setAttribute("networked", `template:#go-${selectedGoColor}stone;attachTemplateToLocal:false;`);
            stone.setAttribute("position", `${position.point.x} ${position.point.y}, ${position.point.z}`);
            stoneModel = stone.querySelector('a-gltf-model');
            stoneModel.setAttribute("class", "interactable");
            stone.setAttribute("go-stone-listener", "");
            tbody = document.querySelector("a-scene");
            tbody.appendChild(stone);
        });
    },

    tick: function(time) {
        if (!this.el.cursorEl) {return; }
        if (selectedGoColor != 'black' && selectedGoColor != 'white') {return;}
        let position = this.el.cursorEl.components.raycaster.getIntersection(this.el);
        if (!position) {return; }

        if (!this.el.stoneIndicator)
        {
            let template = document.querySelector(selectedGoColor == 'black' ? '#go-blackstone' : '#go-whitestone');
            stoneClone = template.content.cloneNode(true);
            this.el.stoneIndicator = stoneClone.querySelector("a-entity");
            this.el.stoneIndicator.id = "stone-indicator";
            tbody = document.querySelector("a-scene");
            tbody.appendChild(this.el.stoneIndicator);
        }
        this.el.stoneIndicator.setAttribute("position", `${position.point.x} ${position.point.y}, ${position.point.z}`);
    }
});

AFRAME.registerComponent('go-bowl-listener', {
    schema: {
        default: 'black'
    },
    init: function() {
        this.el.goColor = this.data;
        this.el.addEventListener('click', function() {
            if (selectedGoColor == this.goColor)
                selectedGoColor = '';
            else
                selectedGoColor = this.goColor;
        });
        this.el.addEventListener('mouseenter', this.sethighlight.bind(this, true));
        this.el.addEventListener('mouseleave', this.sethighlight.bind(this, false));
    },
    sethighlight: function(highlight) {
        var mesh = this.el.getObject3D('mesh');
        if (!mesh) { return; }
        mesh.traverse(function (node) {
            if (node.isMesh && node.name.indexOf('Bowl') != -1) {
                node.material.emissive.set(highlight ? 'yellow' : 'black');
                node.material.emissiveIntensity = highlight ? 0.1 : 1;
                node.material.needsUpdate = true;
            }
        });
    }
});

AFRAME.registerComponent('go-stone-listener', {
    init: function() {
        this.el.addEventListener('mouseenter', this.sethighlight.bind(this, true));
        this.el.addEventListener('mouseleave', this.sethighlight.bind(this, false));
        this.el.addEventListener('click', function() {
            this.remove();
        });
    },
    sethighlight: function(highlight) {
        var mesh = this.el.querySelector('a-gltf-model').getObject3D('mesh');
        if (!mesh) { return; }
        mesh.traverse(function (node) {
            if (node.isMesh) {
                node.material.emissive.set(highlight ? 'yellow' : 'black');
                node.material.emissiveIntensity = highlight ? 0.5 : 1;
                node.material.needsUpdate = true;
            }
        });
    }
});