/**
 * Set up the rendering environment
 */
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, ((size.width - 400) / size.height), 0.1, 1000 );
camera.position.z = 5;
var canvas = document.getElementById("equation-graph");
var renderer = new THREE.WebGLRenderer({canvas: canvas, alpha: true});

/**
 * Allow the user to control the scene with the mouse
 */
controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

/**
 * Global variables for configuring the three axes
 */
var color = new THREE.Color(0xff0000);
var pointSize = 5;
var graphSegments = 20;

/**
 * Display the X Axis into the canvas screen
 */
var xAxisUnitVector = new THREE.Vector3(1, 0, 0);
var xAxisGeometry = new THREE.Geometry();
xAxisGeometry.dynamic = true;
xAxisGeometry.vertices.push(xAxisUnitVector.clone(), xAxisUnitVector.clone().negate());
var xAxisMaterial = new THREE.LineBasicMaterial({color: color});
var xAxisMesh = new THREE.Line(xAxisGeometry, xAxisMaterial);
scene.add(xAxisMesh);

/**
 * Display the Y Axis into the canvas screen
 */
var yAxisUnitVector = new THREE.Vector3(0, 1, 0);
var yAxisGeometry = new THREE.Geometry();
yAxisGeometry.dynamic = true;
yAxisGeometry.vertices.push(yAxisUnitVector.clone(), yAxisUnitVector.clone().negate());
var yAxisMaterial = new THREE.LineBasicMaterial({color: color});
var yAxisMesh = new THREE.Line(yAxisGeometry, yAxisMaterial);
scene.add(yAxisMesh);

/**
 * Display the Y Axis into the canvas screen
 */
var zAxisUnitVector = new THREE.Vector3(0, 0, 1);
var zAxisGeometry = new THREE.Geometry();
zAxisGeometry.dynamic = true;
zAxisGeometry.vertices.push(zAxisUnitVector.clone(), zAxisUnitVector.clone().negate());
var zAxisMaterial = new THREE.LineBasicMaterial({color: color});
var zAxisMesh = new THREE.Line(zAxisGeometry, zAxisMaterial);
scene.add(zAxisMesh);

/**
 * Display a Point at the center of the graph
 */
var centerPointsGeometry = new THREE.Geometry();
centerPointsGeometry.dynamic = true;
centerPointsGeometry.vertices.push(new THREE.Vector3());
var centerPointsMaterial = new THREE.PointsMaterial({size: pointSize, sizeAttenuation: false, color: 0xFF0000});
var centerPoints = new THREE.Points(centerPointsGeometry, centerPointsMaterial);
scene.add(centerPoints);

/**
 * Display a Point Cloud on the x axis, with number labels
 */
var xAxisPointsGeometry = new THREE.Geometry();
xAxisPointsGeometry.dynamic = true;
xAxisPointsGeometry.vertices.push(xAxisUnitVector.clone());
xAxisPointsGeometry.vertices.push(xAxisUnitVector.clone().negate());
var xAxisPointsMaterial = new THREE.PointsMaterial({size: pointSize, sizeAttenuation: false, color: 0xFF0000});
var xAxisPoints = new THREE.Points(xAxisPointsGeometry, xAxisPointsMaterial);
scene.add(xAxisPoints);

/**
 * Display a Point Cloud on the x axis, with number labels
 */
var yAxisPointsGeometry = new THREE.Geometry();
yAxisPointsGeometry.dynamic = true;
yAxisPointsGeometry.vertices.push(yAxisUnitVector.clone());
yAxisPointsGeometry.vertices.push(yAxisUnitVector.clone().negate());
var yAxisPointsMaterial = new THREE.PointsMaterial({size: pointSize, sizeAttenuation: false, color: 0xFF0000});
var yAxisPoints = new THREE.Points(yAxisPointsGeometry, yAxisPointsMaterial);
scene.add(yAxisPoints);

/**
 * Display a Point Cloud on the z axis, with number labels
 */
var zAxisPointsGeometry = new THREE.Geometry();
zAxisPointsGeometry.dynamic = true;
zAxisPointsGeometry.vertices.push(zAxisUnitVector.clone());
zAxisPointsGeometry.vertices.push(zAxisUnitVector.clone().negate());
var zAxisPointsMaterial = new THREE.PointsMaterial({size: pointSize, sizeAttenuation: false, color: 0xFF0000});
var zAxisPoints = new THREE.Points(zAxisPointsGeometry, zAxisPointsMaterial);
scene.add(zAxisPoints);

/**
 * Display the graph of an equation
 */
var graphGeometry = new THREE.ParametricGeometry(function(u, v) {
  return new THREE.Vector3();
}, graphSegments, graphSegments);
var graphMaterial = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});
var graphMesh = [new THREE.Mesh(graphGeometry, graphMaterial)];
scene.add(graphMesh[0]);

//alert(equationModels.length);

/**
 * Update the WebGL canvas
 */
var render = function () {
	requestAnimationFrame(render);

  /**
   * Scale the axes depending on the zoom distance
   */
  var distanceToFocus = camera.position.distanceTo(controls.target);
  xAxisGeometry.vertices[0] = xAxisUnitVector.clone().multiplyScalar(distanceToFocus / 2);
  xAxisGeometry.vertices[1] = xAxisUnitVector.clone().negate().multiplyScalar(distanceToFocus / 2);
  xAxisGeometry.verticesNeedUpdate = true;
  yAxisGeometry.vertices[0] = yAxisUnitVector.clone().multiplyScalar(distanceToFocus / 2);
  yAxisGeometry.vertices[1] = yAxisUnitVector.clone().negate().multiplyScalar(distanceToFocus / 2);
  yAxisGeometry.verticesNeedUpdate = true;
  zAxisGeometry.vertices[0] = zAxisUnitVector.clone().multiplyScalar(distanceToFocus / 2);
  zAxisGeometry.vertices[1] = zAxisUnitVector.clone().negate().multiplyScalar(distanceToFocus / 2);
  zAxisGeometry.verticesNeedUpdate = true;

  /**
   * Scale the axis points
   */
  xAxisPointsGeometry.vertices[0] = xAxisUnitVector.clone().multiplyScalar(distanceToFocus / 2);
  xAxisPointsGeometry.vertices[1] = xAxisUnitVector.clone().negate().multiplyScalar(distanceToFocus / 2);
  xAxisPointsGeometry.verticesNeedUpdate = true;
  yAxisPointsGeometry.vertices[0] = yAxisUnitVector.clone().multiplyScalar(distanceToFocus / 2);
  yAxisPointsGeometry.vertices[1] = yAxisUnitVector.clone().negate().multiplyScalar(distanceToFocus / 2);
  yAxisPointsGeometry.verticesNeedUpdate = true;
  zAxisPointsGeometry.vertices[0] = zAxisUnitVector.clone().multiplyScalar(distanceToFocus / 2);
  zAxisPointsGeometry.vertices[1] = zAxisUnitVector.clone().negate().multiplyScalar(distanceToFocus / 2);
  zAxisPointsGeometry.verticesNeedUpdate = true;

  /**
   * Redraw the graph
   */
  for (var i = 0; i < equationModels.length; i++) {
    graphMesh[i].geometry = new THREE.ParametricGeometry(function(u, v) {
      var _u = (2 * u - 1) * (distanceToFocus / 2);
      var _v = (2 * v - 1) * (distanceToFocus / 2);
      if (equationModels[i].type == 2) return new THREE.Vector3(_u, _v, equationModels[i].eq.eval({x: _u, y: _v}));
      else if (equationModels[i].type == 1) return new THREE.Vector3(_u, equationModels[i].eq.eval({x: _u, z: _v}), _v);
      else if (equationModels[i].type == 0) return new THREE.Vector3(equationModels[i].eq.eval({y: _u, z: _v}), _u, _v);
    }, graphSegments, graphSegments);
    graphMesh[i].geometry.verticesNeedUpdate = true;
  }

  /**
   * Render the scene
   */
  controls.update();
	renderer.render(scene, camera);
};
render();
//setTimeout(render, 0);
