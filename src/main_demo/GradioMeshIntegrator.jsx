import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { Client } from '@gradio/client';

//interface MeshViewerProps {
//  meshData: number[][] | null; // [[x1,y1,z1], [x2,y2,z2], ...]
//  facesDataData: number[][] | null; // [[x1,y1,z1], [x2,y2,z2], ...]
//}

const MeshViewer = ({ meshData, facesData=null, width, height }) => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const controlsRef = useRef(null);

    useEffect(() => {
	// Initialize Three.js scene
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
	const renderer = new THREE.WebGLRenderer({ antialias: true });
	
	// Set up camera and renderer
	camera.position.z = 5;
	//renderer.setSize(width,
	//		 height);
	renderer.setClearColor(0xeeeeee);
	
	// Add controls
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableDamping = true;
	controls.dampingFactor = 0.05;

	// Store references
	sceneRef.current = scene;
	cameraRef.current = camera;
	rendererRef.current = renderer;
	controlsRef.current = controls;

	// Add to DOM
	mountRef.current?.appendChild(renderer.domElement);



	// Animation loop
	const animate = () => {
	    requestAnimationFrame(animate);
	    controls.update();
	    renderer.render(scene, camera);
	};

	animate();

	console.log(`Just initialized the meshviewer through use-effects`);

	return () => {
	    console.log(`Going to destroy the meshviewer through use-effects`);
	    //window.removeEventListener('resize', handleResize);
	    mountRef.current?.removeChild(renderer.domElement);
	    renderer.dispose();
	};
    }, []);

    // Handle resize
    const handleResize = () => {
	if(cameraRef.current && rendererRef.current){
	    const camera = cameraRef.current;
	    const renderer = rendererRef.current;
	    camera.aspect = width / height;
	    camera.updateProjectionMatrix();
	    //renderer.setSize(width,
	    //height);
	}
    };

    useEffect(() => {
	handleResize();
    }, [width, height]);

    useEffect(() => {
	console.log(`Mesh data changed (inside MeshViewer)`);
	if (!meshData || !sceneRef.current || !cameraRef.current || !controlsRef.current) return;

	if (mountRef.current && rendererRef.current ){
	    const parentDiv = mountRef.current;
	    const newWidth = parentDiv.clientWidth;
	    const newHeight = parentDiv.clientHeight;
	    cameraRef.current?.updateProjectionMatrix();
	    // Update renderer size
	    rendererRef.current?.setSize(newWidth, newHeight);
	}

	console.log(`There was a mesh data also in there`);
	// Clear previous mesh
	sceneRef.current.children = sceneRef.current.children.filter(
            child => child.type !== 'Points' && child.type !== 'Mesh'
	);

	// Add lighting if not already present
	if (!sceneRef.current.getObjectByName('ambientLight')) {
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
            ambientLight.name = 'ambientLight';
            sceneRef.current.add(ambientLight);
	}

	if (!sceneRef.current.getObjectByName('directionalLight')) {
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.name = 'directionalLight';
            directionalLight.position.set(1, 1, 1).normalize();
            sceneRef.current.add(directionalLight);
	}


	// Convert array to Float32Array
	const vertices = new Float32Array(meshData.flat());

	// Create geometry
	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

	
	// Add faces if available
	if (facesData) {
            const indices = new Uint32Array(facesData.flat());
            geometry.setIndex(new THREE.BufferAttribute(indices, 1));
            geometry.computeVertexNormals(); // For proper lighting if using materials
	}

	// Compute bounding box
	geometry.computeBoundingBox();
	const bbox = geometry.boundingBox;
	console.log('Bounding Box:', bbox?.min, bbox?.max);

	// Create appropriate material and object
	const meshObject = (() => {
	    if (facesData) {
		console.log(`Going to draw faces`);
		const material = new THREE.MeshPhongMaterial({
		    color: 0xffcc99,
		    specular: 0x222222,
		    shininess: 30, 
		    wireframe: false, // Set to false for solid rendering
		    wireframeLinewidth: 0.5
		});

		return new THREE.Mesh(geometry, material);
	    } else {
		console.log(`Going to draw vertices`);
		const material = new THREE.PointsMaterial({
		    color: 0x000000,
		    size: 0.01,
		    vertexColors: false
		});
		return new THREE.Points(geometry, material);
	    }
	})();

	sceneRef.current.add(meshObject);


	// Apply a vertical flip by scaling Y by -1
	geometry.scale(1, -1, -1);

	// Recompute normals after scaling
	geometry.computeVertexNormals();
	
	// Adjust camera to fit mesh
	if (bbox) {
            const center = new THREE.Vector3();
            bbox.getCenter(center);
            const size = bbox.getSize(new THREE.Vector3()).length();
            
            // Adjust camera position to fit 90% of screen
            cameraRef.current.position.copy(center);
            cameraRef.current.position.z += size * 1.5; // Adjust multiplier as needed
            cameraRef.current.lookAt(center);
            cameraRef.current.updateProjectionMatrix();
            
            // Update controls
            controlsRef.current.target.copy(center);
            controlsRef.current.update();
	}
	console.log(`Finished doing stuff in mesh viewer, so quitting`);
    }, [meshData, facesData]);

    return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
};

// Utility fxn to help draw upon a mesh viewer?
const GradioMeshIntegrator = forwardRef(({gradio_url, video_elem_ref, style}, ref) => {
    const canvasRef = useRef(null);
    const [meshData, setMeshData] = useState(null);
    const [facesData, setFacesData] = useState(null);
    const [dims, setDims] = useState({width: 0, height: 0});


    useEffect(() => {
	//if (!video_elem_ref.current) return;
	//const video = video_elem_ref.current;
	//if (video) {
	//    const handleLoadedMetadata = () => {
	//	setDims({ width: video.videoWidth, height: video.videoHeight });
	//    };
	//    video.addEventListener('loadedmetadata', handleLoadedMetadata);
	//    return () => {
	//	video.removeEventListener('loadedmetadata', handleLoadedMetadata);
	//    };
	//}
    }, [video_elem_ref]);

    //useEffect(() => {
    const run_gradio_inference = async (data_callback = null) => {
	console.log(`I was signaled to run gradio api inference`);
	if (!gradio_url || !video_elem_ref.current) return;
	
	const video = video_elem_ref.current;
	const canvas = canvasRef.current;


	const context = canvas.getContext('2d');
	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;
	context.drawImage(video, 0, 0, canvas.width, canvas.height);

	canvas.toBlob(async (imageBlob) => {
	    if (imageBlob) {
		// Now try to invoke gradio
		try {
		    // Connect to the Gradio backend
		    const client = await Client.connect(gradio_url);

		    // Prepare the image for prediction
		    const imageFile = new File([imageBlob], 'capture.png', { type: 'image/png' });

		    // Make the prediction
		    const result = await client.predict('/predict', [imageFile]);
		    console.log(`Got the dammned results`);

		    // Update the state with the processed image
		    setDims({width: video.videoWidth, height: video.videoHeight});
		    //setProcessedImage(result.data[0]);
		    console.log(`Mesh received of type ${typeof result.data[1]}`);
		    if(data_callback){
			data_callback(result.data[1]);
		    }
		    setMeshData(result.data[1]['mesh']);
		    if(result.data[1]['faces']){
			setFacesData(result.data[1]['faces']);
		    }
		} catch (error) {
		    console.error('Error processing image:', error);
		}
	    }
	}, 'image/png');
    };

    // A fxn to override default source setting
    const override_mesh_data = (mesh_face_data) => {
	if(mesh_face_data){
	    setMeshData(mesh_face_data['mesh']);
	    if(mesh_face_data['faces']){
		setFacesData(mesh_face_data['faces']);
	    }
	}
    };
    
    // Expose the childMethod to the parent through the ref
    useImperativeHandle(ref, () => ({
	run_gradio_inference,
	override_mesh_data,
    }));


    return (
	<div style={{ ...style, border: '1px solid #ccc' }}>
	    <canvas ref={canvasRef} style={{ display: 'none' }} />
	    <MeshViewer meshData={meshData} facesData={facesData} width={dims.width} height={dims.height}/>
	    {/*<MeshViewer meshData={meshData} facesData={facesData} width="width" height="height"/>*/}
	</div>
    );
    
});

export default GradioMeshIntegrator;
