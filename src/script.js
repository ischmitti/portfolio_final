import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'

/**
 * Debug
 */

window.onload = ()=>{

    if(window.innerWidth >= 1768){


    const parameters = {
        materialColor: '#ffeded'
    }

    /**
     * Base
     */
    // Canvas
    const canvas = document.querySelector('canvas.webgl')

    // Scene
    const scene = new THREE.Scene()

    /**
     * Objects
     */
    // Texture
    const textureLoader = new THREE.TextureLoader()
    const gradientTexture = textureLoader.load('')
    gradientTexture.magFilter = THREE.NearestFilter

    // Material
    const material = new THREE.MeshToonMaterial({
        color: parameters.materialColor,
    })

    // Objects
    const objectsDistance = 4
    const mesh1 = new THREE.Mesh(
        new THREE.TorusBufferGeometry(0.15, 0.1, 20, 100),
        material
    )
    const mesh2 = new THREE.Mesh(
        new THREE.ConeBufferGeometry(0.25, 0.5, 32),
        material
    )
    const mesh3 = new THREE.Mesh(
        new THREE.BoxBufferGeometry(0.25, 0.25, 0.25, 16),
        material
    )

    mesh1.position.x = - 2.5
    mesh2.position.x = 2.5
    mesh3.position.x = -2.5

    mesh1.position.y =  objectsDistance * 0.3
    mesh2.position.y = - objectsDistance * 0.7
    mesh3.position.y = - objectsDistance * 1.7

    scene.add(mesh1, mesh2, mesh3)

    const sectionMeshes = [ mesh1, mesh2, mesh3 ]

    /**
     * Lights
     */
    const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
    directionalLight.position.set(1, 1, 0)
    scene.add(directionalLight)

    /**
     * Particles
     */
    // Geometry
    const particlesCount = 200
    const positions = new Float32Array(particlesCount * 3)

    for(let i = 0; i < particlesCount; i++)
    {
        positions[i * 3 + 0] = (Math.random() - 0.5) * 10
        positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }

    const particlesGeometry = new THREE.BufferGeometry()
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    // Material
    const particlesMaterial = new THREE.PointsMaterial({
        color: parameters.materialColor,
        sizeAttenuation: textureLoader,
        size: 0.03
    })

    // Points
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    /**
     * Sizes
     */
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    window.addEventListener('resize', () =>
    {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    /**
     * Camera
     */
    // Group
    const cameraGroup = new THREE.Group()
    scene.add(cameraGroup)

    // Base camera
    const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
    camera.position.z = 6
    cameraGroup.add(camera)

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    /**
     * Scroll
     */
    let scrollY = window.scrollY
    let currentSection = 0

    window.addEventListener('scroll', () =>
    {
        scrollY = window.scrollY
        const newSection = Math.round(scrollY / sizes.height)

        if(newSection != currentSection)
        {
            currentSection = newSection

            gsap.to(
                sectionMeshes[currentSection].rotation,
                {
                    duration: 1.5,
                    ease: 'power2.inOut',
                    x: '+=6',
                    y: '+=3',
                    z: '+=1.5'
                }
            )
        }
    })

    /**
     * Cursor
     */
    const cursor = {}
    cursor.x = 0
    cursor.y = 0

    window.addEventListener('mousemove', (event) =>
    {
        cursor.x = event.clientX / sizes.width - 0.5
        cursor.y = event.clientY / sizes.height - 0.5
    })

    /**
     * Animate
     */
    const clock = new THREE.Clock()
    let previousTime = 0

    const tick = () =>
    {
        const elapsedTime = clock.getElapsedTime()
        const deltaTime = elapsedTime - previousTime
        previousTime = elapsedTime

        // Animate camera
        camera.position.y = - scrollY / sizes.height * objectsDistance

        const parallaxX = cursor.x * 0.5
        const parallaxY = - cursor.y * 0.5
        cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
        cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

        // Animate meshes
        for(const mesh of sectionMeshes)
        {
            mesh.rotation.x += deltaTime * 0.1
            mesh.rotation.y += deltaTime * 0.12
        }

        // Render
        renderer.render(scene, camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)
    }

    tick()

    }


    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'Juli', 'August', 'September', 'October', 'November', 'December']
    const weekdays = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    function getTime(){
        const today = new Date();
        let minutes = today.getMinutes()
        if(minutes < 10){
        minutes = '0'+minutes
        }
        const time = today.getHours() + ":" + minutes
        const month = today.getMonth()
        const weekday = today.getDay() % 7
        let day = today.getDay()
        if(day < 10){
        day = '0'+ day
        }
        document.getElementById('time').textContent = time
        document.getElementById('date').textContent =weekdays[weekday] + ', '+day + '. ' + months[month]
    }

    getTime()

    function navbarShow(){
        const navbar = document.getElementById('navbar')
         const body = document.getElementsByTagName('body')[0]
         document.addEventListener('scroll', () => {
           if(scrollY > window.innerHeight){
             navbar.style.display = 'inline'
           }else{
             navbar.style.display = 'none'
           }
        })
      }
      
      navbarShow()
      
      
      function scrollUp(){
         document.getElementById('up-button').addEventListener('click', () => {
           window.scrollTo({
             top: 0, behavior: 'smooth'
           })
        })  
      }
      scrollUp()
}