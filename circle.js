var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var circleMeshes = []; // Untuk menyimpan banyak lingkaran
var balls = [];

camera.position.z = 15;

// Fungsi untuk menciptakan lingkaran
function createCircle(radius, color, rotateSpeedX, rotateSpeedY, rotateSpeedZ) {
    var circleGeometry = new THREE.CircleGeometry(radius, 256);
    var circleMaterial = new THREE.PointsMaterial({ color: color, size: 0.1 });
    var circleMesh = new THREE.Points(circleGeometry, circleMaterial);

    // Menambahkan lingkaran ke scene
    scene.add(circleMesh);
    circleMeshes.push(circleMesh); // Menambahkan ke array

    // Fungsi untuk menganimasikan rotasi
    function animateRotation() {
        // Menambahkan rotasi pada sumbu X, Y, dan Z
        circleMesh.rotation.x += rotateSpeedX;
        circleMesh.rotation.y += rotateSpeedY;
        circleMesh.rotation.z += rotateSpeedZ;

        // Meminta frame selanjutnya
        requestAnimationFrame(animateRotation);
    }

    // Memulai animasi rotasi
    animateRotation();
}

// ...

// Contoh membuat lingkaran dengan radius, warna, dan kecepatan rotasi yang berbeda pada sumbu X, Y, dan Z
createCircle(5, 0x888888, 0.005, 0.002, 0.003);
createCircle(4, 0xff0fff, 0.002, 0.004, 0.007);
createCircle(3, 0x00ff00, 0.004, 0.004, 0.004);
createCircle(2, 0xff0000, 0.003, 0.001, 0.002);
createCircle(1, 0x0000ff, 0.002, 0.003, 0.001);
createCircle(0.5, 0xffff00, 0.001, 0.002, 0.003);
createCircle(0.25, 0xff00ff, 0.003, 0.001, 0.002);

// Fungsi untuk menambahkan bola saat klik
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

// Fungsi untuk menganimasikan bola dan deteksi tumbukan
function animate() {
    requestAnimationFrame(animate);

    for (var i = 0; i < circleMeshes.length; i++) {
        circleMeshes[i].rotation.x += 0.01;
        circleMeshes[i].rotation.y += 0.01;
    }

    for (var j = 0; j < balls.length; j++) {
        var ball = balls[j];
        ball.mesh.position.add(ball.direction.clone().multiplyScalar(0.1));

        // Deteksi tumbukan dengan pusat
        if (checkCollisionWithCenter(ball.mesh)) {
            triggerExplosion();
        }
    }

    renderer.render(scene, camera);
}

animate();

// Fungsi untuk memeriksa tumbukan dengan pusat
function checkCollisionWithCenter(ballMesh) {
    var distance = ballMesh.position.distanceTo(new THREE.Vector3(0, 0, 0));
    return distance < 0.1; // Sesuaikan radius jika perlu
}

// Fungsi untuk memicu efek ledakan
function triggerExplosion() {
    // Mengubah warna latar belakang menjadi putih
    renderer.setClearColor(0xffffff, 1);

    // Menghentikan semua animasi lingkaran
    for (var i = 0; i < circleMeshes.length; i++) {
        scene.remove(circleMeshes[i]);
    }
    circleMeshes = [];

    // Menghapus semua bola
    for (var j = 0; j < balls.length; j++) {
        scene.remove(balls[j].mesh);
    }
    balls = [];
}