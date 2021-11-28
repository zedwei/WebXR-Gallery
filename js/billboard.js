    /**
 * Billboard component.
 *
 * Modifies rotation to track the current camera, keeping the entity facing it 
 *
 */
    AFRAME.registerComponent('billboard', {
    init: function () {
        this.vector = new THREE.Vector3();
    },

    tick: function (t) {
        var self = this;
        var target = self.el.sceneEl.camera;
        var object3D = self.el.object3D;
        // make sure camera is set
        if (target) { 
        target.updateMatrixWorld();
        this.vector.setFromMatrixPosition(target.matrixWorld);
        if (object3D.parent.parent) {
            object3D.parent.parent.updateMatrixWorld();
            object3D.parent.parent.worldToLocal(this.vector);
        }
        return object3D.lookAt(this.vector);
        }
    }
    });