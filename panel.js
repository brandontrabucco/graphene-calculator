var size = {
  height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
  width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
};

document.getElementById('equation-panel').setAttribute("style", "width: " + 400 + "px;" + "height: " + size.height + "px;");
document.getElementById('equation-graph').width = size.width - 400;
document.getElementById('equation-graph').height = size.height;

var equationModels = [{eq: math.simplify("x^2+y^2"), type: 2}];

var app = angular.module('EquationApp', []);
app.controller('EquationController', function($scope) {
  $scope.equations = [
    {text: "z=x^2+y^2"}
  ];
  $scope.add = function() {
    $scope.equations.push({text: "z=x^2+y^2"});
    equationModels.push({eq: math.simplify("x^2+y^2"), type: 2});
    graphMesh.push(new THREE.Mesh(new THREE.ParametricGeometry(function(u, v) {
      return new THREE.Vector3();
    }, graphSegments, graphSegments), graphMaterial));
    scene.add(graphMesh[graphMesh.length - 1]);
  }
  $scope.delete = function() {
    $scope.equations.splice(this.$index, 1);
    equationModels.splice(this.$index, 1);
    scene.remove(graphMesh[this.$index]);
    graphMesh.splice(this.$index, 1);
  }
  $scope.update = function() {
    // update the graph
    equationModels[this.$index] = {
      eq: math.simplify($scope.equations[this.$index].text.substr(2, $scope.equations[this.$index].text.length - 2)),
      type: $scope.equations[this.$index].text.charAt(0) === 'z' ? 2 : $scope.equations[this.$index].text.charAt(0) === 'y' ? 1 : 0
    };
  }
});
