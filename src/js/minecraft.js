// styles
import '../scss/index.scss';

// three.js
import * as THREE from 'three';
import 'gsap'
import 'three/examples/js/controls/PointerLockControls';

var camera, scene, renderer, geometry, material, mesh, loader;
var controls, intersects;
let myTween;
let myTweenBack;
let myTweenObj;

var keys = [];
document.onkeydown = function (e) {
    e = e || window.event;
    keys[e.keyCode] = true;
};

document.onkeyup = function (e) {
    e = e || window.event;
    keys[e.keyCode] = false;
};

var earth;
var pivotObject;

function init() {

    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);

    // GRASS MATERIAL
    var grassMaterials = [
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('images/grass-dirt.png')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('images/grass-dirt.png')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('images/grass.png')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('images/dirt.png')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('images/grass-dirt.png')
        }),
        new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('images/grass-dirt.png')
        })
    ];

    // cubes floor
    for (var x = 0; x < 30; x++) {
        var material = new THREE.MeshFaceMaterial(grassMaterials);

        for (var y = 0; y < 30; y++) {
            var geometry = new THREE.BoxGeometry(2, 2, 2);


            var mesh = new THREE.Mesh(geometry, material);
            mesh.position.x -= x * 2;
            mesh.position.z -= y * 2;
            mesh.position.y = -2;

            scene.add(mesh);
        }
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



    var geometry = new THREE.SphereGeometry( 10, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var sun = new THREE.Mesh( geometry, material );
    sun.position.x = -20;
    sun.position.y = 30;
    sun.position.z = -50;
    scene.add( sun );

    var light = new THREE.PointLight( 0xffffff, 1, 3000 );


    sun.add( light );
    scene.add(new THREE.AmbientLight(0x909090));

    var geometry2 = new THREE.SphereGeometry( 5, 32, 32 );
    var material2 = new THREE.MeshLambertMaterial( {color: 0x0000ff} );
    earth = new THREE.Mesh( geometry2, material2 );
    earth.position.x = -21;
    scene.add( earth );

    pivotObject = new THREE.Object3D();
    sun.add(pivotObject);
    pivotObject.add( earth );


    // SKY MATERIAL
    loader = new THREE.ImageLoader();

    var cubeMap = new THREE.CubeTexture( [] );
    cubeMap.format = THREE.RGBFormat;

    loader.load( '../images/cube.jpg', function ( image ) {

        var getSide = function ( x, y ) {
            var size = 1024;
            var canvas = document.createElement( 'canvas' );
            canvas.width = size;
            canvas.height = size;
            var context = canvas.getContext( '2d' );
            context.drawImage( image, - x * size, - y * size );
            return canvas;
        };

        cubeMap.images[ 0 ] = getSide( 2, 1 ); // px
        cubeMap.images[ 1 ] = getSide( 0, 1 ); // nx
        cubeMap.images[ 2 ] = getSide( 1, 0 ); // py
        cubeMap.images[ 3 ] = getSide( 1, 2 ); // ny
        cubeMap.images[ 4 ] = getSide( 1, 1 ); // pz
        cubeMap.images[ 5 ] = getSide( 3, 1 ); // nz
        cubeMap.needsUpdate = true;

    } );

    var cubeShader = THREE.ShaderLib[ 'cube' ];
    cubeShader.uniforms[ 'tCube' ].value = cubeMap;



    var skyBoxMaterial = new THREE.ShaderMaterial( {
        fragmentShader: cubeShader.fragmentShader,
        vertexShader: cubeShader.vertexShader,
        uniforms: cubeShader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
    } );

    var skyBox = new THREE.Mesh(
        new THREE.BoxGeometry( 100000, 100000, 100000 ),
        skyBoxMaterial
    );

    scene.add( skyBox );

    skyBox.position.y= -10;
    skyBox.position.z= -10;

    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1 );
    hemiLight.position.set( 15, 500, 15 );
    scene.add( hemiLight );


}

var clock = new THREE.Clock();
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function animate() {

    requestAnimationFrame(animate);

    var delta = clock.getDelta();
    var speed = 50;
    // up
    if (keys[38] || keys[90]) {
        controls.getObject().translateZ(-delta * speed);
    }
    // down
    if (keys[40] || keys[83]) {
        controls.getObject().translateZ(delta * speed);
    }
    // left
    if (keys[37] || keys[81]) {
        controls.getObject().translateX(-delta * speed);
    }
    // right
    if (keys[39] || keys[68]) {
        controls.getObject().translateX(delta * speed);
    }

    earth.rotation.y += 3.2 * delta;
    pivotObject.rotation.y += 0.7 * delta;
    raycaster.setFromCamera( mouse, camera );



    intersects = raycaster.intersectObjects( scene.children );


    renderer.render(scene, camera);


}

Number.prototype.roundTo = function(num) {
    var nombre = this*(-1);

    var resto = nombre%num;
    if (resto <= (num/2)) {
        return (nombre-resto)*(-1);
    } else {
        return (nombre+num-resto)*(-1);
    }
}

document.addEventListener('keypress', (event) => {
    const keyName = event.key;
    //create
    if (keyName == "c") {

        if (intersects.length != 0) {

            var appX = intersects[0].point.x.roundTo(2);
            var appY = Math.round(intersects[0].point.y);
            var appZ = intersects[0].point.z.roundTo(2);

            var geometry4 = new THREE.BoxGeometry(2, 2, 2);
            var texture = new THREE.TextureLoader().load( 'images/crate.gif' ); // Relatif au dossier build du projet
            var material4 = new THREE.MeshBasicMaterial( { map: texture } );

            var mesh4 = new THREE.Mesh(geometry4, material4);
            mesh4.position.x = appX;
            mesh4.position.z = appZ;
            mesh4.position.y = appY+1;

            scene.add(mesh4);

            myTweenObj = mesh4;

            myTween = TweenLite.to(myTweenObj.rotation, 1, {
                y: Math.PI,
                ease: Expo.easeOut,
                onComplete: () => {
                    myTween = null;
                }
            });
        }

    }
    // Highlight in red
    if(keyName == "h"){
        if (intersects.length != 0) {
            if (intersects[0].object.geometry.type != "SphereGeometry") {
                intersects[0].object.material.color.set( 0xff0000 );
            }
        }
    }

    // Remove
    if(keyName == "r"){
        if (intersects.length != 0) {
            if (intersects[0].point.y >= 0 && intersects[0].object.geometry.type != "SphereGeometry") {
                scene.remove(intersects[0].object);
            }
        }
    }

});

init();
animate();