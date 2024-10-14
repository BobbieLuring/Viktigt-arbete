const shapes = [
    { name: "triangle", create: createSVGTriangle },
    { name: "star", create: createSVGStar },
    { name: "hexagon", create: createSVGHexagon },
    { name: "circle", create: createCircleSVG },
    { name: "square", create: createSVGSquare },
    { name: "rhombus", create: createSVGRhombus }
];

let dark = true

function createCorrectShape(index) {
    shapes[index].create('mål', 'shapes')
    shapes[index].create('formen1', 'formen')
}

function createIncorrectShapes(indexArr) {
    for(let i = 0; i < 2; i++) {
        if (i = 1) {
            shapes[indexArr[1]].create('fake1', 'shapes')
        }
        if (i = 2) {
            shapes[indexArr[2]].create('fake2', 'shapes')
        }
    }
}

function newShapes() {
    var arr = [];
    while(arr.length < 3){
        var r = Math.floor(Math.random() * 5);
        if(arr.indexOf(r) === -1) {
            arr.push(r);
        }
    }
    document.getElementById('shapes').innerHTML = ''
    document.getElementById('formen').innerHTML = ''
    createCorrectShape(arr[0]);
    createIncorrectShapes(arr);
}

function toggleDark() {
    console.log('toggle')
    if (dark === true) {
        document.body.style.backgroundColor = 'white'
        document.body.style.color = 'black'
        dark = false
    } else {
        document.body.style.backgroundColor = 'black'
        document.body.style.color = 'white'
        dark = true
    }
    newShapes()
}

addEventListener("load", (event) => {
    console.log('load')
    initCookie()
    newShapes();
    dragElement(document.getElementById("formen"));

});

function initCookie() {
    let cookiee = document.cookie;
    if (!cookiee) {
        document.cookie = "total=" + 0;
    }
    updateScoreBoard()
}

function updateScoreBoard() {
    let totalValue = getCookieValue("total");
    console.log('i functionen')
    if (totalValue) {
        console.log('update score?')
        let element = document.getElementsByClassName('score')
        element.innerHTML = 'Total: ' + totalValue;
    }
    console.log(totalValue);
}

function increaseCookie() {
    value = getCookieValue("total");
    value++
    document.cookie = "total=" + value;
    updateScoreBoard()
}

function getCookieValue(name) {
    let nameEQ = name + "=";
    let cookiesArray = document.cookie.split(';');
    for (let i = 0; i < cookiesArray.length; i++) {
        let cookie = cookiesArray[i].trim();
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null; // Return null if the cookie is not found
}

// Make the DIV element draggable:
// dragElement(document.getElementById("formen"));

function dragElement(elmnt) {

    let startpos = getGoalCoordinates('formen');
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id)) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id).onmousedown = dragMouseDown;
    } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        console.log('drag')
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function getMoveableCoordinates() {
        let element = document.getElementById('formen')
        let rect = element.getBoundingClientRect();
        return rect;
    }

    function getGoalCoordinates(id) {
        let element = document.getElementById(id)
        let rect = element.getBoundingClientRect();
        return rect;
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        let goalCoordinates = getGoalCoordinates('mål');
        let moveAbleCoordinates = getMoveableCoordinates();
        let diffX = goalCoordinates.x - moveAbleCoordinates.x
        let diffY = goalCoordinates.y - moveAbleCoordinates.y
        if ((diffX < 40 && diffX > -40) && (diffY < 40 && diffY > - 40)) {
            increaseCookie()
            moveElmentToGoal(goalCoordinates.x, goalCoordinates.y);
            let element = document.getElementById('formen1')
            element.classList.toggle('animation')
            element.addEventListener('animationend', () => {
                console.log('animation ended')
                getNewShape();
            })
        }
        
        document.onmouseup = null;
        document.onmousemove = null;
    }

    function moveElmentToGoal(posx, posy) {
        let element = document.getElementById('formen')
        element.style.top = (posy) + "px";
        element.style.left = (posx) + "px";
    }

    function getNewShape() {
        let element = document.getElementById('formen')
        element.style.top = (startpos.y) + "px";
        element.style.left = (startpos.x) + "px";
        let randomNumber = Math.floor(Math.random() * 6);

        newShapes()
        goalbox = document.getElementById('mål');
        goalbox.style.order = randomNumber;
    }
}

function createCircleSVG(shapeID, parentID) {
    // Create an SVG namespace
    const svgNS = "http://www.w3.org/2000/svg";

    // Create an SVG element
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100");
    svg.setAttribute("height", "100");
    
    // Create a circle element
    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", "50");
    circle.setAttribute("cy", "50");
    circle.setAttribute("r", "45");
    circle.setAttribute("stroke-width", "2");
    if (parentID === 'shapes') {
        circle.setAttribute("fill", "black");
        dark ? circle.setAttribute("fill", "black") : circle.setAttribute("fill", "white")
        circle.setAttribute("stroke", "gray");
    } else {
        circle.setAttribute("fill", "orange");
    }
    svg.id = shapeID;
    
    // Append the circle to the SVG
    svg.appendChild(circle);
    
    // Append the SVG to the div
    document.getElementById(parentID).appendChild(svg);
}

function createSVGTriangle(shapeID, parentID) {
    // Create an SVG namespace element
    const svgNS = "http://www.w3.org/2000/svg";

    // Create an SVG element
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100");
    svg.setAttribute("height", "100");

    // Create a polygon for the triangle
    const triangle = document.createElementNS(svgNS, "polygon");

    // Define the points of the triangle (x1,y1 x2,y2 x3,y3)
    const points = "50,5 5,99 95,99";
    triangle.setAttribute("points", points);

    // Set a fill color and stroke for the triangle
    // triangle.setAttribute("fill", "white");
    // triangle.setAttribute("stroke", "black");
    triangle.setAttribute("stroke-width", "2")
    if (parentID === 'shapes') {
        dark ? triangle.setAttribute("fill", "black") : triangle.setAttribute("fill", "white")
        triangle.setAttribute("stroke", "gray");
    } else {
        triangle.setAttribute("fill", "orange");
    }
    svg.id = shapeID

    // Append the triangle to the SVG element
    svg.appendChild(triangle);

    // Append the SVG to the container in the HTML
    document.getElementById(parentID).appendChild(svg);
}

function createSVGStar(shapeID, parentID) {
    // Create an SVG namespace element
    const svgNS = "http://www.w3.org/2000/svg";

    // Create an SVG element
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100");
    svg.setAttribute("height", "100");

    // Create a polygon for the star
    const star = document.createElementNS(svgNS, "polygon");

    // Define the points of the 5-pointed star
    // These are calculated to fit within a 100x100 box
    const points = "50,5 61,38 95,38 68,57 78,91 50,72 22,91 32,57 5,38 39,38"

    star.setAttribute("points", points);

    // Set a fill color and stroke for the star
    star.setAttribute("stroke-width", "2");
    if (parentID === 'shapes') {
        dark ? star.setAttribute("fill", "black") : star.setAttribute("fill", "white")
        star.setAttribute("stroke", "gray");
    } else {
        star.setAttribute("fill", "orange");
    }
    svg.id = shapeID

    // Append the star to the SVG element
    svg.appendChild(star);

    // Append the SVG to the container in the HTML
    document.getElementById(parentID).appendChild(svg);
}

function createSVGHexagon(shapeID, parentID) {
    // Create an SVG namespace element
    const svgNS = "http://www.w3.org/2000/svg";

    // Create an SVG element
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100");
    svg.setAttribute("height", "100");

    // Create a polygon for the hexagon
    const hexagon = document.createElementNS(svgNS, "polygon");

    // Define the points of the hexagon that fills the 100x100 box
    // The hexagon's center is at (50,50), with a radius that reaches the box edges
    const points = "50,5 90,25 90,75 50,95 10,75 10,25";

    hexagon.setAttribute("points", points);

    // Set a fill color and stroke for the hexagon
    hexagon.setAttribute("stroke-width", "2");
    if (parentID === 'shapes') {
        dark ? hexagon.setAttribute("fill", "black") : hexagon.setAttribute("fill", "white")
        hexagon.setAttribute("stroke", "gray");
    } else {
        hexagon.setAttribute("fill", "orange");
    }
    svg.id = shapeID

    // Append the hexagon to the SVG element
    svg.appendChild(hexagon);

    // Append the SVG to the container in the HTML
    document.getElementById(parentID).appendChild(svg);
}

function createSVGRhombus(shapeID, parentID) {
    // Create an SVG namespace element
    const svgNS = "http://www.w3.org/2000/svg";

    // Create an SVG element
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100");
    svg.setAttribute("height", "100");

    // Create a polygon for the rhombus
    const rhombus = document.createElementNS(svgNS, "polygon");

    // Define the points of the rhombus that fills the 100x100 box
    const points = "50,5 95,50 50,95 5,50";

    rhombus.setAttribute("points", points);

    // Set a fill color and stroke for the rhombus
    rhombus.setAttribute("stroke-width", "2");
    if (parentID === 'shapes') {
        dark ? rhombus.setAttribute("fill", "black") : rhombus.setAttribute("fill", "white")
        rhombus.setAttribute("stroke", "gray");
    } else {
        rhombus.setAttribute("fill", "orange");
    }
    svg.id = shapeID

    // Append the rhombus to the SVG element
    svg.appendChild(rhombus);

    // Append the SVG to the container in the HTML
    document.getElementById(parentID).appendChild(svg);
}

function createSVGSquare(shapeID, parentID) {
    // Create an SVG namespace element
    const svgNS = "http://www.w3.org/2000/svg";

    // Create an SVG element
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100");
    svg.setAttribute("height", "100");

    // Create a rectangle for the square shape
    const square = document.createElementNS(svgNS, "rect");

    // Define the position and size of the square
    square.setAttribute("x", "5");
    square.setAttribute("y", "5");
    square.setAttribute("width", "90");
    square.setAttribute("height", "90");

    // Set a fill color and stroke for the square
    square.setAttribute("stroke-width", "2");
    if (parentID === 'shapes') {
        dark ? square.setAttribute("fill", "black") : square.setAttribute("fill", "white")
        square.setAttribute("stroke", "gray");
    } else {
        square.setAttribute("fill", "orange");
    }
    svg.id = shapeID

    // Append the square to the SVG element
    svg.appendChild(square);

    // Append the SVG to the container in the HTML
    document.getElementById(parentID).appendChild(svg);
}
