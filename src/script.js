import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'
/**
 * Debug
 */

window.onload = ()=>{

    if(window.innerWidth >= 600){


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
    const starTexture = textureLoader.load('/images/singlestar.png')


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
        new THREE.BoxBufferGeometry(0.35, 0.35, 0.35, 16),
        material
    )
    if(window.innerWidth >= 1200){   
        mesh1.position.x = -2.6
        mesh2.position.x = 2.6
        mesh3.position.x = -2.6

        mesh1.position.y =  objectsDistance * 0.3
        mesh2.position.y = - objectsDistance * 0.7
        mesh3.position.y = - objectsDistance * 1.7
        
    }else{
        mesh1.position.x = 0
        mesh2.position.x = 1.2
        mesh3.position.x = -1.2

        mesh1.position.y = - objectsDistance * 0.7
        mesh2.position.y = - objectsDistance * 0.7
        mesh3.position.y = - objectsDistance * 0.7
    }


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
    const particlesCount = 500
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
        map: starTexture,
        sizeAttenuation: textureLoader,
        size: 0.1,
        transparent: true
    })

    // Points
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)


      // Raindrops
            
      const rainGeometry = new THREE.BufferGeometry()
      const count = 500
      
      const vertices = new Float32Array(count * 3)
      
      for(let i = 0; i < count * 3; i++ ){
        
        vertices[i] = (Math.random()-0.5)*5
      }
      
      rainGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(vertices,3)
        )
        
        const p = rainGeometry.attributes.position.array
        
        const rainMaterial = new THREE.PointsMaterial({
            size: 0.013,
            sizeAttenuation: true,
            transparent: true,
            color: new THREE.Color(0xffffff),
            depthTest: false,
            depthWrite: false
        })
        
        const rain = new THREE.Points(rainGeometry, rainMaterial)
        rain.position.y = -objectsDistance 
        scene.add(rain)


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

        for ( let i = 1; i <= (count * 3); i = i+3 ) {
            p[i] =p[i] - 0.03
            if(p[i] < -2){
              p[i] = 2.5
            }
          }
          rainGeometry.attributes.position.needsUpdate = true;
          
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
        const weekday = today.getDay()
        let day = today.getDate()
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
         if(scrollY > window.innerHeight){
             navbar.style.display = 'inline'
            }else{
                navbar.style.display = 'none'
            }
        }
        
        const img1 = document.getElementById('img-1')
        function imgScrollTop(){
            if(window.innerWidth<600){
                let scrollValue = -0.25 * window.scrollY
                img1.style.transform = 'translateY('+scrollValue+'px)'
            }
        }
        
        document.addEventListener('scroll', () => {
            
            imgScrollTop()
            navbarShow()
                
        })

    const img2 = document.getElementById('img-2')
    const work = document.getElementById('work-button')
    const resume = document.getElementById('resume-button')
    const contactMe = document.getElementById('contact-me')
    const contact = document.getElementById('contact-button')
    
    function imgHover(){
        if(window.innerWidth > 992){
            img1.addEventListener('mouseover', () => {
                work.classList.add('shake')
            })
            img1.addEventListener('mouseout',() => {
                work.classList.remove('shake')
            })
            img2.addEventListener('mouseover', () => {
                resume.classList.add('shake')
            })
            img2.addEventListener('mouseout',() => {
                resume.classList.remove('shake')
            })
            contactMe.addEventListener('mouseover', () => {
                contact.classList.add('shake')
            })
            contactMe.addEventListener('mouseout',() => {
                contact.classList.remove('shake')
            })
        }
    }
    imgHover()

    const container = document.getElementsByClassName('card-container');
    const inner = document.getElementsByClassName('card-inner');
    
    for(let i=0;i<container.length;i++){

        container[i].addEventListener('mouseover', (e) =>{

            
            const onMouseEnterHandler = function(event) {
                update(event);
            };
            const onMouseLeaveHandler = function() {
                inner[i].style = "";
                inner[i].style.transition = "transform 1000ms cubic-bezier(0.68, 0.5, 0.3, 8)";
            };
            const onMouseMoveHandler = function(event) {
                if (isTimeToUpdate()) {
                    update(event);
                }
            };
            
            
            
            container[i].onmouseenter = onMouseEnterHandler;
            container[i].onmouseleave = onMouseLeaveHandler;
            container[i].onmousemove = onMouseMoveHandler;
            
            let counter = 0;
            const updateRate = 10;
            const isTimeToUpdate = function() {
                return counter++ % updateRate === 0;
            };
            
            // Mouse 
            var mouse = {
                _x: 0,
                _y: 0,
                x: 0,
                y: 0,
                updatePosition: function(event) {
                    const e = event || window.event;
                    this.x = e.clientX - this._x;
                    this.y = (e.clientY - this._y) * -1;
                },
                setOrigin: function(e) {
                    this._x = e.offsetLeft + Math.floor(e.offsetWidth/2);
                    this._y = e.offsetTop + Math.floor(e.offsetHeight/2);
                },
                show: function() { return '(' + this.x + ', ' + this.y + ')'; }
            }
            
            mouse.setOrigin(container[i]);
            
            
            const update = function(event) {
                mouse.updatePosition(event);
        updateTransformStyle(
            (mouse.y / inner[i].offsetHeight/2).toFixed(2),
            (mouse.x / inner[i].offsetWidth/2).toFixed(2)
            );
        };
        
        const updateTransformStyle = function(x, y) {
            const style = "rotateX(" + x + "deg) rotateY(" + y + "deg)";
            inner[i].style.transform = style;
            inner[i].style.mozTransform = style;
            inner[i].style.msTransform = style;
            inner[i].style.oTransform = style;
        }
    })
    }
}