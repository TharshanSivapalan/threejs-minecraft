/**************************************************/
/* exo déplacement FPS                            */
/**************************************************/
console.log('exo FPS');


// styles
import '../scss/index.scss';

// three.js
import * as THREE from 'three';
import 'three/examples/js/controls/PointerLockControls';


var camera, scene, renderer, geometry, material, mesh;
var controls;


var keys = [];
document.onkeydown = function (e) {
    e = e || window.event;
    keys[e.keyCode] = true;
};

document.onkeyup = function (e) {
    e = e || window.event;
    keys[e.keyCode] = false;
};


function init() {
    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);

    // cubes floor
    for (var x = 0; x < 30; x++) {
        for (var y = 0; y < 30; y++) {
            var geometry = new THREE.BoxGeometry(2, 2, 2);
            var material = new THREE.MeshBasicMaterial({
                color: /*Math.floor(Math.random() * 16777215)*/0x139615
            });

            //Image minecraft à redimensionner
            /*var texture = new THREE.TextureLoader().load( 'images/mine.jpg' ); // Relatif au dossier build du projet
            var material = new THREE.MeshBasicMaterial( { map: texture } );*/
            var mesh = new THREE.Mesh(geometry, material);
            mesh.position.x -= x * 2;
            mesh.position.z -= y * 2;
            mesh.position.y = -2;

            scene.add(mesh);
        }
        // soleil
        var geometry = new THREE.SphereGeometry( 5, 32, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        var sphere = new THREE.Mesh( geometry, material );
        scene.add( sphere );
        sphere.position.x = 0;
        sphere.position.y = 10;
        sphere.position.z = 0;

        // terre
        var earth = new THREE.SphereGeometry(2, 15, 15);
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        var earth = new THREE.Mesh(geometry, material);
        scene.add(earth);

        earth.position.x = 15;

        // lune
        var earth2 = new THREE.SphereGeometry(2, 30,15 );
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        var earth2 = new THREE.Mesh(geometry, material);
        scene.add(earth2);

        earth2.position.x = 15;


    }

    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    // mouse view controls
    controls = new THREE.PointerLockControls(camera);
    scene.add(controls.getObject());

    // pointer lock
    var element = document.body;

    var pointerlockchange = function (event) {
        if (document.pointerLockElement == element) {
            controls.enabled = true;
        } else {
            controls.enabled = false;
        }
    };
    var pointerlockerror = function (event) {};

    // hook pointer lock state change events
    document.addEventListener('pointerlockchange', pointerlockchange, false);
    document.addEventListener('pointerlockerror', pointerlockerror, false);

    element.addEventListener('click', function () {
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        element.requestPointerLock();
    }, false);
}

var clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    var delta = clock.getDelta();
    var speed = 10;

    // up
    if (keys[38]) {
        controls.getObject().translateZ(-delta * speed);
    }
    // down
    if (keys[40]) {
        controls.getObject().translateZ(delta * speed);
    }
    // left
    if (keys[37]) {
        controls.getObject().translateX(-delta * speed);
    }
    // right
    if (keys[39]) {
        controls.getObject().translateX(delta * speed);
    }


    renderer.render(scene, camera);
}

init();
animate();