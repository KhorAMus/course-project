///////////////////////////////////////////////////////////////////////
var GL_window = function(canvas){
  this.canvas = canvas;
  this.gl = initGL(canvas);
  initShaders(this.gl);
  initBuffers(this.gl);


  //this.drawScene();
}


function initGL(canvas) {
  var gl = canvas.getContext("experimental-webgl") || canvas.getContext("webgl");
  if (gl == null) {
    alert("Could not initialize WebGL");
    return;
  }

  gl.viewportWidth = canvas.width;
  gl.viewportHeight = canvas.height;
  return gl;
}


function makeShader(str, type, gl) {
  var shader = gl.createShader(type);

  gl.shaderSource(shader, str);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

function readTextFile(file)
{
  var allText;
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function ()
  {
    if(rawFile.readyState === 4)
      if(rawFile.status === 200 || rawFile.status == 0)
        allText = rawFile.responseText;
  }
  rawFile.send();
  return allText;
}




var shader_program;
var vertexPositionAttribute;

function initShaders(gl) {
  var vertexShader = makeShader(readTextFile("../static/Shaders/vertex_shader.txt"), gl.VERTEX_SHADER, gl);
  var fragmentShader = makeShader(readTextFile("../static/Shaders/fragment_shader.txt"), gl.FRAGMENT_SHADER, gl);


  shader_program = gl.createProgram();
  gl.attachShader(shader_program, vertexShader);
  gl.attachShader(shader_program, fragmentShader);
  gl.linkProgram(shader_program);

  if (!gl.getProgramParameter(shader_program, gl.LINK_STATUS)) {
    alert("Could not initialize shaders");
  }

  vertexPositionAttribute = gl.getAttribLocation(shader_program, "in_Pos");
  gl.enableVertexAttribArray(vertexPositionAttribute);


  function Uniforms() {
   this.scaleId = gl.getUniformLocation(shader_program, "nav.scale");
   this.posId = gl.getUniformLocation(shader_program, "nav.tratslate");
   this.rotId = gl.getUniformLocation(shader_program, "nav.rotate");
 }

 Uniforms.prototype.refresh = function(n) {
   gl.uniform2f(this.scaleId, n.scale[0], n.scale[1]);
   gl.uniform2f(this.posId, n.tratslate[0], n.tratslate[1]);
   gl.uniform2f(this.rotId, n.rotate[0], n.rotate[1]);
 }

 uniforms = new Uniforms();
}

var squareVertexPositionBuffer;
var itemSize, numItems;


var elementbuffer;

function initBuffers(gl) {
    vertices = [
  1.0, 1.0,
  -1.0, 1.0,
  1.0, -1.0,
  -1.0, -1.0,
  ];

  vertices2 = [ // this is code from the tutorial
// Front face
-1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
// Back face
-1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
// Top face
-1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
// Bottom face
-1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
// Right face
1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
// Left face
-1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0
];





  //elementbuffer = gl.createBuffer();
  //gl.bindBuffer(gl.GL_ELEMENT_ARRAY_BUFFER, elementbuffer);
  //gl.bufferData(gl.GL_ELEMENT_ARRAY_BUFFER, indices.size() * sizeof(unsigned int), &indices[0], GL_STATIC_DRAW);




  squareVertexPositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  itemSize = 2;
  numItems = vertices.length/itemSize;
}


GL_window.prototype.drawScene =  function (navigation) {

  var gl = this.gl;
  gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  gl.clearColor(0.9, 0.8, 0.7, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(shader_program);

  gl.bindBuffer(gl.ARRAY_BUFFER, squareVertexPositionBuffer);
  gl.vertexAttribPointer(vertexPositionAttribute, itemSize, gl.FLOAT, false, 0, 0);

  uniforms.refresh(navigation);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, numItems);
}
///////////////////////////////////////////////////////////////////////

function makeTranslation(tx, ty) {
  return [
    1, 0, 0,
    0, 1, 0,
    tx, ty, 1
  ];
}
 
function makeRotation(angleInRadians) {
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);
  return [
    c,-s, 0,
    s, c, 0,
    0, 0, 1
  ];
}
 
function makeScale(sx, sy) {
  return [
    sx, 0, 0,
    0, sy, 0,
    0, 0, 1
  ];
}