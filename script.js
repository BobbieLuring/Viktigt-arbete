const shapes = [
    { name: "triangle", create: createSVGTriangle },
    { name: "star", create: createSVGStar },
    { name: "hexagon", create: createSVGHexagon },
    { name: "circle", create: createCircleSVG },
    { name: "square", create: createSVGSquare },
    { name: "rhombus", create: createSVGRhombus }
];

let dark = true

// ----- Kod för formerna -----

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

// skapar de nya formerna och tömmer de gamla
function newShapes() {
    var arr = [];
    while(arr.length < 3){
        var r = Math.floor(Math.random() * 6);
        if(arr.indexOf(r) === -1) {
            arr.push(r);
        }
    }
    document.getElementById('shapes').innerHTML = ''
    document.getElementById('formen').innerHTML = ''
    createCorrectShape(arr[0]);
    createIncorrectShapes(arr);
}

// ------- kod för darkmode ------

function toggleDark() {
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

// när sidan har laddats

addEventListener("load", (event) => {
    initCookie()
    newShapes();
    dragElement(document.getElementById("formen"));

});

// ------ kod för kakor ------

function initCookie() {
    let cookiee = document.cookie;
    if (!cookiee) {
        document.cookie = "total=" + 0;
    }
    updateScoreBoard()
}

// uppdaterar totalen
function updateScoreBoard() {
    let totalValue = getCookieValue("total");
    if (totalValue) {
        var paragraph = document.getElementById("p");
        paragraph.innerHTML = ''
        var text = document.createTextNode('Total: ' + totalValue);
        paragraph.appendChild(text);
    }
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

// kod för att dra formen och även logik för att kolla om den är i korrekt form
function dragElement(elmnt) {

    let startpos = getGoalCoordinates('formen');
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id)) {
        // kanske kan ta bort denna if
        document.getElementById(elmnt.id).onmousedown = dragMouseDown;
    } else {
    elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
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

    // ger koordinater för den flyttbara formen
    function getMoveableCoordinates() {
        let element = document.getElementById('formen')
        let rect = element.getBoundingClientRect();
        return rect;
    }

    // ger koordinater för formen som är mål
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
        // hur nära man kan släppa formen och det räknas
        if ((diffX < 30 && diffX > -30) && (diffY < 30 && diffY > - 30)) {
            moveElmentToGoal(goalCoordinates.x, goalCoordinates.y);
            let element = document.getElementById('formen1')
            element.classList.toggle('animation')
            element.addEventListener('animationend', () => {
                getNewShape();
                increaseCookie()
            })
        }
        
        document.onmouseup = null;
        document.onmousemove = null;
    }

    // flyttar dragbara formen till samma position som målet
    function moveElmentToGoal(posx, posy) {
        let element = document.getElementById('formen')
        element.style.top = (posy) + "px";
        element.style.left = (posx) + "px";
    }

    // återställer formen till orginalplats
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

function standardSVGSettings(shape, parentID, shapeID, svg) {
    svg.setAttribute("width", "100");
    svg.setAttribute("height", "100");
    shape.setAttribute("stroke-width", "2");

    if (parentID === 'shapes') {
        dark ? shape.setAttribute("fill", "black") : shape.setAttribute("fill", "white")
        shape.setAttribute("stroke", "gray");
    } else {
        shape.setAttribute("fill", "orange");
    }

    svg.id = shapeID
    svg.appendChild(shape);
    document.getElementById(parentID).appendChild(svg);
}

function createCircleSVG(shapeID, parentID) {

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    
    let circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", "50");
    circle.setAttribute("cy", "50");
    circle.setAttribute("r", "45");
    circle = standardSVGSettings(circle, parentID, shapeID, svg)
}

function createSVGTriangle(shapeID, parentID) {

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");

    let triangle = document.createElementNS(svgNS, "polygon");
    const points = "50,5 5,99 95,99";
    triangle.setAttribute("points", points);
    triangle = standardSVGSettings(triangle, parentID, shapeID, svg)
}

function createSVGStar(shapeID, parentID) {

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");

    let star = document.createElementNS(svgNS, "polygon");
    const points = "50,5 61,38 95,38 68,57 78,91 50,72 22,91 32,57 5,38 39,38"
    star.setAttribute("points", points);
    star = standardSVGSettings(star, parentID, shapeID, svg)
}

function createSVGHexagon(shapeID, parentID) {

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");

    let hexagon = document.createElementNS(svgNS, "polygon");
    const points = "50,5 90,25 90,75 50,95 10,75 10,25";
    hexagon.setAttribute("points", points);
    hexagon = standardSVGSettings(hexagon, parentID, shapeID, svg)
}

function createSVGRhombus(shapeID, parentID) {

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    let rhombus = document.createElementNS(svgNS, "polygon");
    const points = "50,5 95,50 50,95 5,50";

    rhombus.setAttribute("points", points);
    rhombus = standardSVGSettings(rhombus, parentID, shapeID, svg)
}

function createSVGSquare(shapeID, parentID) {

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    let square = document.createElementNS(svgNS, "rect");

    square.setAttribute("x", "5");
    square.setAttribute("y", "5");
    square.setAttribute("width", "90");
    square.setAttribute("height", "90");

    square = standardSVGSettings(square, parentID, shapeID, svg)
}
