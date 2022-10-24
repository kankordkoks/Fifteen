const body = document.querySelector('body')
const page = document.createElement('div')

page.classList.add('page')
body.prepend(page)


const containerNode = document.createElement('div')
containerNode.classList.add('fifteen')
page.append(containerNode)

let countItems = 16
// create buttons
for(let i = 0; i < countItems; i++){
    let btn = document.createElement('button')
    btn.classList.add('item')
    btn.dataset.matrixId = `${i+1}`
    let spn = document.createElement('span')
    spn.classList.add('itemVal')
    spn.textContent = `${i+1}`
    btn.append(spn)
    containerNode.append(btn)
}

const itemNodes = Array.from(containerNode.querySelectorAll('.item'))

console.log(itemNodes, itemNodes.length)



if (itemNodes.length !== 16){
    throw new Error(`Должно быть ${countItems} items in HTML`)
}
// Position of elements
itemNodes[countItems - 1].style.display = 'none'
let matrix = getMatrix(itemNodes.map(item => Number(item.dataset.matrixId)))

setPositionItems(matrix)
// Shafle of elements
const shuffle = document.createElement('button')
shuffle.classList.add('button')
shuffle.setAttribute('id', 'shuflle')
shuffle.textContent = 'Shuffle'
page.append(shuffle)

shuffle.addEventListener('click', ()=>{
    
    const flatMatrix = matrix.flat()
    const shuffleArr = shuffleArray(flatMatrix)
    matrix = getMatrix(shuffleArr)
    setPositionItems(matrix)
    
})
// // Change position by click
const blankNumber = 16
containerNode.addEventListener('click', (event)=>{
    const buttonNode = event.target.closest('button')
    if(!buttonNode){
        return
    }

    const buttonNumber = Number(buttonNode.dataset.matrixId)
    const buttonCoords = findCoordinatesByNumber(buttonNumber, matrix)
    const blankCoords = findCoordinatesByNumber(blankNumber, matrix)
    const isValid = isValidForSwape(buttonCoords, blankCoords)
    console.log(isValid)
    if(isValid){
        swap(blankCoords, buttonCoords, matrix)
        setPositionItems(matrix)
    }
})

// Our help-function
function getMatrix(arr){
    const matrix =[[],[],[],[]]
    let x = 0;
    let y = 0;
    for(let i = 0; i < arr.length; i++){
        if( x >= 4){
            y++
            x = 0
        }
        matrix[y][x] = arr[i]
        x++
    }    
    return matrix
}

function setPositionItems(matrix){
    for(let y = 0; y < matrix.length; y++){
        for(let x = 0; x < matrix[y].length; x++){
            const value = matrix[y][x]
            console.log(value)
            const node = itemNodes[value - 1]
            console.log(node)
            setNodeStyles(node, x, y)
        }
    }
}

function setNodeStyles(node, x, y){
     const shiftPs = 100;
     node.style.transform = `translate3D(${x*shiftPs}%, ${y*shiftPs}%, 0)`
}

function shuffleArray(arr){
    
    return arr.sort(() => Math.random() - 0.5);
}

function findCoordinatesByNumber(number, matrix){
    for(let y = 0; y < matrix.length; y++){
        for(let x = 0; x < matrix[y].length; x++){
            if(matrix[y][x] === number){
                return {x, y}
            }
        }
    }
    return null
}

function isValidForSwape(coords1, coords2){
    console.log(coords1, coords2)
    const diffX = Math.abs(coords1.x - coords2.x)
    const diffY = Math.abs(coords1.y - coords2.y)
    return (diffX == 1 || diffY == 1) && (coords1.x === coords2.x || coords1.y === coords2.y)
}

function swap(coords1, coords2, matrix){    
    const coords1Number = matrix[coords1.y][coords1.x]
    matrix[coords1.y][coords1.x] = matrix[coords2.y][coords2.x]
    matrix[coords2.y][coords2.x] = coords1Number
}