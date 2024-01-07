var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var circleGeometry = new THREE.CircleGeometry(5, 32);
var circleMaterial = new THREE.PointsMaterial({ color: 0x888888, size: 0.1 });
var circleMesh = new THREE.Points(circleGeometry, circleMaterial);
scene.add(circleMesh);

var balls = [];

// Fungsi untuk membuat lingkaran tambahan (circle yang memutar)
function createRotatingCircle() {
    var rotatingCircleGeometry = new THREE.CircleGeometry(3, 32); // Sesuaikan radius sesuai keinginan
    var rotatingCircleMaterial = new THREE.PointsMaterial({ color: 0x00ff00, size: 0.1 }); // Sesuaikan warna dan ukuran sesuai keinginan
    var rotatingCircleMesh = new THREE.Points(rotatingCircleGeometry, rotatingCircleMaterial);

    // Mengatur posisi lingkaran tambahan di tengah layar
    rotatingCircleMesh.position.set(0, 0, 0); // Posisi di tengah layar

    // Mengatur kecepatan berputar (dalam radian per frame)
    var rotationSpeed = 0.005; // Sesuaikan kecepatan sesuai keinginan

    // Menambahkan lingkaran tambahan ke dalam scene
    scene.add(rotatingCircleMesh);

    // Fungsi untuk menganimasikan rotasi lingkaran tambahan
    function animateRotatingCircle() {
        rotatingCircleMesh.rotation.z += rotationSpeed; // Mengubah sudut rotasi
        requestAnimationFrame(animateRotatingCircle);
    }

    animateRotatingCircle();
}

// Memanggil fungsi untuk membuat dan animasi lingkaran tambahan
createRotatingCircle();

document.addEventListener('click', function(event) {
    var ballGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    var ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    var ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);

    var mouse3D = new THREE.Vector3(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5
    );
    mouse3D.unproject(camera);

    ballMesh.position.copy(mouse3D);

    var direction = new THREE.Vector3(0, 0, -1).normalize();

    scene.add(ballMesh);

    balls.push({ mesh: ballMesh, direction: direction });
});

camera.position.z = 15;

function animate() {
    requestAnimationFrame(animate);

    circleMesh.rotation.x += 0.01;
    circleMesh.rotation.y += 0.01;

    for (var i = 0; i < balls.length; i++) {
        var ball = balls[i];
        ball.mesh.position.add(ball.direction.clone().multiplyScalar(0.1)); // Menggerakkan bola ke depan
    }

    renderer.render(scene, camera);
}

animate();

function checkCollisionWithCenter(ball) {
    var distance = ball.mesh.position.distanceTo(circleMesh.position);
    return distance < 10; // Ganti 5 dengan radius lingkaran pusat Anda
}

document.addEventListener('click', function(event) {
    var ballGeometry = new THREE.SphereGeometry(0.05, 16, 16);
    var ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    var ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);

    var mouse3D = new THREE.Vector3(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5
    );
    mouse3D.unproject(camera);

    ballMesh.position.copy(mouse3D);

    var direction = new THREE.Vector3(0, 0, -1).normalize();

    scene.add(ballMesh);

    balls.push({ mesh: ballMesh, direction: direction });
    
    // Deteksi bola mengenai pusat
    if (checkCollisionWithCenter({ mesh: ballMesh })) {
        // Efek ledakan (contoh: menghapus semua bola)
        for (var i = 0; i < balls.length; i++) {
            scene.remove(balls[i].mesh);
        }
        balls = [];
        
        // Lakukan efek ledakan di sini (misalnya, tambahkan partikel)
        // ...
    }
});