const shape1 = document.querySelectorAll('.shape')[0]
var currentObj = 0; 
var error = document.getElementById('error');
var download = document.getElementById('download')
var color = document.getElementById('color-picker')
var cropBtn = document.getElementById('crop') 
let isResizing = false;  
let isSelected = false;
let circleCounter = 0;
let squareCounter = 0
let imageCounter = 0
let textCounter = 0
let shapes = document.querySelectorAll('.shape') 
let savedData = document.getElementById('saved-data')
var deleteButton = document.getElementById('delete')
let playground = document.getElementById('playground')
const hiddenImg = document.createElement('img')


// Input Image Display
let fileInput  ;
var imgInput = document.getElementById('file-input')
imgInput.addEventListener('change',function(event){
    fileInput = URL.createObjectURL( event.target.files[0]) 
    error.innerText = ''  
    hiddenImg.setAttribute('src',fileInput)
})
 

playground.addEventListener('click',function(){ 
    for (let index = 0; index < playground.children.length; index++) {
        if( playground.children[index].classList.contains('selected'))
        {
            playground.children[index].classList.remove('selected')
            isSelected = false; 
            cropBtn.value = 'Crop'
        }
    }   
}) 


// Add Shapes
let addShape = document.querySelectorAll('.shape-button')
addShape.forEach((item,index)=>{ 
    let shapeName = item.getAttribute('id').slice(4) 
 
    item.addEventListener('click',function(){
        let newShape = document.createElement('div')
           // RESIZE
           let nwResize = document.createElement('div')
           nwResize.classList.add('resizer')
           nwResize.classList.add('nw')
           let neResize = document.createElement('div')
           neResize.classList.add('resizer')
           neResize.classList.add('ne')
           let seResize = document.createElement('div')
           seResize.classList.add('resizer')
           seResize.classList.add('se')
           let swResize = document.createElement('div')
           swResize.classList.add('resizer')
           swResize.classList.add('sw')

        // ADD TEXT
        if(shapeName=='text'){
            textCounter++ 
            newShape.setAttribute('id','text'+ new Date().getTime())
            newShape.classList.add('shape') 
            playground.appendChild(newShape)
        
            const newText = document.createElement('input')
            newText.setAttribute('type','text')
            newText.setAttribute('class','input-text')
            newText.setAttribute('value','Add-Text')
            newText.style.color = color.value 
            newShape.appendChild(newText)
        }
        //ADD IMAGE
        else if(shapeName == 'image' && fileInput){
             imageCounter++
            // DIV SHAPE
           
            newShape.classList.add('cover')
            newShape.style.width = hiddenImg.naturalWidth/10 + 'px'
            newShape.style.height = hiddenImg.naturalHeight/10 + 'px'
            newShape.classList.add('shape')
            newShape.setAttribute('id',shapeName+ new Date().getTime())  
            playground.appendChild(newShape)
            
            // IMAGE
            let newImg = document.createElement('img')
            newImg.classList.add(shapeName)
            newImg.setAttribute('src',fileInput)
            // newImg.classList.add('crop')

            newShape.appendChild(newImg)    
            newShape.appendChild(nwResize)
            newShape.appendChild(neResize)
            newShape.appendChild(swResize)
            newShape.appendChild(seResize)  

        }else if(shapeName== 'circle' || shapeName == 'rect'){ 
            let counter;
            if(shapeName == 'circle'){
                circleCounter++
               counter = circleCounter
            }else{
                squareCounter++
                counter = squareCounter
            }
            // DIV SHAPE
            newShape.classList.add('cover')
            newShape.classList.add('shape')
            newShape.style.width = '100px'
            newShape.style.height = '100px'
            
            newShape.setAttribute('id',shapeName+new Date().getTime())  
            playground.appendChild(newShape)
            
            // DIV RECT
            let newRect = document.createElement('div')
            newRect.classList.add(shapeName)
            newShape.appendChild(newRect)
            newRect.style.backgroundColor = color.value 
            newRect.style.position = 'default' 
         
            newRect.appendChild(nwResize)
            newRect.appendChild(neResize)
            newRect.appendChild(swResize)
            newRect.appendChild(seResize)       
        }else{
            error.innerText = 'Please upload File' 
        }
        // DRAG AND DROP
        dragDropResize()
    })
})

// Crop Button
cropBtn.addEventListener('click',function(){
    if(isSelected){
        for (let i = 0; i < playground.children.length; i++) {
            let element = playground.children[i]   
            if(element.classList.contains('selected') && element.children[0].classList.contains('image')){
                if(!element.children[0].classList.contains('crop')){
                    element.children[0].classList.remove('uncrop')
                    element.children[0].classList.add('crop')
                }else if(!element.children[0].classList.contains('uncrop')){
                    element.children[0].classList.remove('crop')
                    element.children[0].classList.add('uncrop')
                }
            } 
        } 
    }
})

// Change Color
color.onchange = function(){
    if(isSelected){
        for (let i = 0; i < playground.children.length; i++) {
            let element = playground.children[i]   
            if(element.classList.contains('selected') && (element.children[0].classList.contains('rect') || element.children[0].classList.contains('circle'))){
                element.children[0].style.backgroundColor = color.value
            }
            if(element.classList.contains('selected') && element.children[0].classList.contains('input-text')){
                element.children[0].style.color = color.value 
            }
        } 
    }
} 

// Change Font Size
let fontSize = document.getElementById('font-size')
fontSize.onchange = function(){
    if(isSelected){
        for (let i = 0; i < playground.children.length; i++) {
            let element = playground.children[i]   
            if(element.classList.contains('selected') && element.children[0].classList.contains('input-text')){
                element.children[0].style.fontSize = fontSize.value + 'px'
                
            }
        } 
    }
} 

// Display on Canvas 
download.addEventListener('click',function(){ 
    const canvasItems = playground.children 
    // canvas initialization
    const canvas = document.getElementById('mycanvas')
    canvas.width = playground.getBoundingClientRect().width;
    canvas.height = playground.getBoundingClientRect().height;
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < canvasItems.length; i++) {  

        var shapeName = canvasItems[i].children[0].classList[0]
        var shape = canvasItems[i] 
        var sizePosition = canvasItems[i].getBoundingClientRect() 
        var color = canvasItems[i].children[0].style.backgroundColor
         
         if(shapeName == 'rect'){ 

            ctx.beginPath(); 
            ctx.fillStyle = color;
            ctx.fillRect(
                sizePosition.x, 
                sizePosition.y, 
                sizePosition.width, 
                sizePosition.height);
            ctx.stroke()
        }
        else if(shapeName == 'circle'){
            ctx.beginPath();
            ctx.arc(
                sizePosition.x + sizePosition.width/2, 
                sizePosition.y + sizePosition.width/2, 
                sizePosition.width/2, 
                0, 
                2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
        }
        else if(shapeName == 'image'){ 
            var img = canvasItems[i].children[0]
             if(shape.children[0].classList.contains('crop')){
                var imgCanvas = document.createElement('canvas')
                
                imgCanvas.width = sizePosition.width
                imgCanvas.height = sizePosition.height

                let imgCtx = imgCanvas.getContext('2d')
                imgCtx.fillStyle = 'red' 
                imgCtx.beginPath();
                imgCtx.arc(
                     sizePosition.width/2,
                     sizePosition.height/2,
                    sizePosition.width/2,0,
                    Math.PI*2); 
                imgCtx.fill();

                imgCtx.globalCompositeOperation = 'source-in'
                imgCtx.beginPath(); 
                imgCtx.drawImage(img, 
                    0, 
                    0,
                    sizePosition.width,
                    sizePosition.height);  
                imgCtx.stroke()
               
                // Genreating a Cropped Image Link Async Function
                var cropLink = imgCanvas.toDataURL('image/png',1)
                
                var imgCrop = document.createElement('img')
                imgCrop.src = cropLink;
                imgCrop.style.width = imgCanvas.width;
                imgCrop.style.height = imgCanvas.height 

                // Displaying on Orginal Canvas
                ctx.beginPath(); 
                ctx.drawImage(imgCrop, sizePosition.x, sizePosition.y,sizePosition.width,sizePosition.height);   
                ctx.stroke()

             }else{ 
                ctx.beginPath(); 
                ctx.drawImage(img, sizePosition.x, sizePosition.y,sizePosition.width,sizePosition.height);  
                ctx.stroke()
             }
          
        }
        else if(shapeName == 'input-text'){ 
            var text = canvasItems[i].children[0]; 
            var textProp = text.getBoundingClientRect();

            var fontSize =  textProp.height-3 + 'px'; 
            ctx.beginPath();  
            ctx.fillStyle = 'black'
            ctx.font = fontSize+" Arial";
            ctx.fillText(text.value, textProp.x, textProp.height + textProp.y-6);
            ctx.stroke()
        }
    }

    // const imageLink = document.createElement('a');  
    // imageLink.download = 'canvas.png'
    // imageLink.href = canvas.toDataURL('image/png',1); 
    // imageLink.click();
 
}) 

// Delete Function
function deleteObj(e){  
    if(isSelected === true){
        for (let i = 0; i < playground.children.length; i++) {
            if(playground.children[i].classList.contains('selected')){
                console.log(playground.children[i])
               var element = playground.children[i].getAttribute('id') 
               var deleteEle = document.getElementById(element)
                deleteEle.remove(deleteEle)
               isSelected = false; 
            }
       }
    }
    dragDropResize()
}


// Saving data when the window is closed
window.onunload = function(){
    for (let i = 0; i < playground.children.length; i++) { 
        if(playground.children[i].classList.contains('selected')){
            playground.children[i].classList.remove('selected')
            isSelected = false
        }
    }
    let data = domToJSON();
    localStorage.setItem('newItem',data)
}   

//  Save
let save = document.getElementById('save')
save.onclick = function(){ 
    let data = domToJSON(); 
    let fileName = prompt('File Name') 
    localStorage.setItem(fileName.slice(0,10),data) 

    // display it on saved data
    displaySavedData() 
};

// display it on saved data
function displaySavedData(){ 
    // let newData = document.createElement('div')
    savedData.innerHTML = '' 
    for (let i = 0; i < localStorage.length; i++) {
        let div = document.createElement('div')
        div.setAttribute('id', Object.entries(localStorage)[i][0])
        div.innerHTML = `<span>${Object.entries(localStorage)[i][0]}</span>  <span class="delete-file">-<span>`
        savedData.appendChild(div)
    }
    crud()
}

function domToJSON(){ 
    const data = playground.children 
    const jsonData = []
    for (let i = 0; i < data.length; i++) { 
        if(data[i].children[0].classList[0]==='rect' || data[i].children[0].classList[0]=== 'circle'){
            data[i].children[0].classList[0] === 'rect' ? squareCounter++ : circleCounter++
            jsonData.push({
                id:data[i].getAttribute('id'),
                shapeType:data[i].children[0].classList[0],
                left:data[i].getBoundingClientRect().x,
                top:data[i].getBoundingClientRect().y,
                width:data[i].getBoundingClientRect().width,
                height:data[i].getBoundingClientRect().height,
                backgroundColor:data[i].children[0].style.backgroundColor
            })
        } if(data[i].children[0].classList[0]==='image'){
            imageCounter++
            jsonData.push({
                id:data[i].getAttribute('id'),
                shapeType:data[i].children[0].classList[0],
                left:data[i].getBoundingClientRect().x,
                top:data[i].getBoundingClientRect().y,
                width:data[i].getBoundingClientRect().width,
                height:data[i].getBoundingClientRect().height,
                imgSrc:data[i].children[0].src
            })
        } if(data[i].children[0].classList[0]==='input-text'){
            textCounter++
            jsonData.push({
                id:data[i].getAttribute('id'),
                shapeType:data[i].children[0].classList[0],
                width:data[i].getBoundingClientRect().width,
                height:data[i].getBoundingClientRect().height,
                left:data[i].getBoundingClientRect().x,
                top:data[i].getBoundingClientRect().y,  
                fontSize:data[i].children[0].style.fontSize,
                color:data[i].children[0].style.color,
                value:data[i].children[0].value
            })
        } 
    }
    return JSON.stringify(jsonData) 
}

 
window.onload = function(){
    for (let i = 0; i < savedData.children.length; i++) {
        savedData.children[i].onclick = function(){
            console.log('clicked')
        }  
    } 
    // saved files 
    displaySavedData()

    // Get Data from Local Storage
    let data =  JSON.parse(localStorage.getItem('newItem'))

    displayDataOnContainer(data); 
    
    let shape = document.querySelectorAll('.shape')  

    // DRAG AND DROP Resize
    dragDropResize()

    // Delete from keyboard
    window.onkeydown = function(e){
        if(e.key == 'Delete'){
            deleteObj()
        }
    }
    // Delete Element
    deleteButton.onclick = deleteObj 

    // display and delete files from local storage
    crud()
    
}

function crud(){
     // get data from storage 
     let localStore = savedData.children
     for (let i = 0; i < localStore.length; i++) {
         localStore[i].ondblclick = ()=> {
             playground.innerHTML = ''
             let data = JSON.parse(localStorage.getItem(localStore[i].getAttribute('id')))    
             displayDataOnContainer(data)
             dragDropResize()
         }
       
         localStore[i].children[1].onclick = function(event){
             // console.log('red')
             localStorage.removeItem(localStore[i].getAttribute('id'))
             displaySavedData()
         } 
     }
}

function deleteDataFromStorage(e){
    console.log(e.target)
}

function displayDataOnContainer(data){ 
    // get data from local storage and display on playground container
    for (let i = 0; i < data.length; i++) {
        
        let newShape = document.createElement('div')
        newShape.classList.add('cover')
        newShape.classList.add('shape')
        newShape.setAttribute('id',data[i].id)
        playground.appendChild(newShape)

        // RESIZE
        let nwResize = document.createElement('div')
        nwResize.classList.add('resizer')
        nwResize.classList.add('nw')
        let neResize = document.createElement('div')
        neResize.classList.add('resizer')
        neResize.classList.add('ne')
        let seResize = document.createElement('div')
        seResize.classList.add('resizer')
        seResize.classList.add('se')
        let swResize = document.createElement('div')
        swResize.classList.add('resizer')
        swResize.classList.add('sw')

        if(data[i].shapeType == 'rect' || data[i].shapeType == 'circle'){

            // DIV RECT
            let newRect = document.createElement('div')
            newRect.classList.add(data[i].shapeType)
            newShape.appendChild(newRect)
            newRect.style.backgroundColor = data[i].backgroundColor 
            newShape.style.position = 'absolute' 
            newShape.style.width = data[i].width + 'px'
            newShape.style.height = data[i].height + 'px'
            newShape.style.left = data[i].left + 'px'
            newShape.style.top = data[i].top + 'px'
            
            newRect.appendChild(nwResize)
            newRect.appendChild(neResize)
            newRect.appendChild(swResize)
            newRect.appendChild(seResize)  
        }
        if(data[i].shapeType == 'image'){
             
            let newImg = document.createElement('img');
            newImg.classList.add(data[i].shapeType)
            newImg.setAttribute('src',data[i].imgSrc)
            
            newShape.style.position = 'absolute'
            newShape.style.width = data[i].width + 'px'
            newShape.style.height = data[i].height + 'px'
            newShape.style.left = data[i].left + 'px'
            newShape.style.top = data[i].top + 'px'

            newShape.appendChild(newImg);
            newShape.appendChild(nwResize);
            newShape.appendChild(neResize);
            newShape.appendChild(swResize);
            newShape.appendChild(seResize);

        }if(data[i].shapeType == 'input-text'){ 
            newShape.style.postion = 'absolute'
            newShape.style.left = data[i].left + 'px'
            newShape.style.top = data[i].top + 'px' 

            let newText = document.createElement('input')
            
            newText.setAttribute('type','text')
            newText.classList.add('input-text')
            newText.setAttribute('value',data[i].value)
            newText.style.fontSize = data[i].fontSize
            newShape.appendChild(newText)
            newText.style.color = data[i].color
        }
    }
}

function dragDropResize(){
    let shape = document.querySelectorAll('.shape')  

    // DRAG AND DROP
    shape.forEach((ele,index)=>{  
        
        ele.addEventListener('click',
        function(event){ 
            event.stopPropagation() 
            if(isSelected == false ){ 
                isSelected = true
                ele.classList.add('selected') 
            }
            else if(isSelected == true){
                for (let i = 0; i < shape.length; i++) {
                    let element = shape[i];
                    if(element.classList.contains('selected')){
                        element.classList.remove('selected')
                    }
                }
                ele.classList.add('selected')
            }
            
        })

        ele.onmousedown = function(e){ 
            currentObj = ele
            var thisObj = document.querySelectorAll('.shape')[index]  

            let shiftX = e.clientX - thisObj.getBoundingClientRect().x 
            let shiftY = e.clientY - thisObj.getBoundingClientRect().top  
        
            thisObj.style.position = 'absolute';
            // thisObj.style.zIndex = '1000'; 
        
            moveAt(e.pageX, e.pageY);
        
            //  moves the shape at (pageX, pageY) cordinates
            function moveAt(pageX,pageY){
                thisObj.style.left = pageX - shiftX + 'px'
                thisObj.style.top = pageY - shiftY + 'px'
            }
        
            function onMouseMove(e){
                if(!isResizing){
                    moveAt(e.pageX,e.pageY)
                }
                
            }
            // move the shape on mousemove
            document.addEventListener('mousemove',onMouseMove);
        
            // drop the shape,remove uneeded handlers
            thisObj.onmouseup = function(){
                document.removeEventListener('mousemove',onMouseMove);
                thisObj.onmouseup = null
                thisObj.style.zIndex = '0'; 
            }

            thisObj.ondragstart = function() {
            return false;
            };
        }
    }) 

      //  RESIZERS
      const resizers = document.querySelectorAll('.resizer');
      let currentResizer;

      for(let resizer of resizers){

          resizer.addEventListener('mousedown',mousedown);

          function mousedown(e){ 
              currentResizer = e.target;
              isResizing = true

              let prevX = e.clientX;
              let prevY = e.clientY;

              window.addEventListener('mousemove',mousemove);
              window.addEventListener('mouseup',mouseup);
                 
              function mousemove(e){
                  const thisObj = currentObj
                  const rect = thisObj.getBoundingClientRect();
                  if(currentResizer.classList.contains('se')){
                      thisObj.style.width = rect.width - (prevX - e.clientX) + 'px';
                      thisObj.style.height = rect.height - (prevY - e.clientY) + 'px';
                  }
                  else if(currentResizer.classList.contains('sw')){
                      thisObj.style.width = rect.width + (prevX - e.clientX) + 'px';
                      thisObj.style.height = rect.height - (prevY - e.clientY) + 'px';
                      thisObj.style.left =  rect.left - (prevX - e.clientX) + 'px';
                      
                  }
                  else if(currentResizer.classList.contains('ne')){
                      thisObj.style.width = rect.width - (prevX - e.clientX) + 'px';
                      thisObj.style.height = rect.height + (prevY - e.clientY) + 'px';
                      thisObj.style.top =  rect.top - (prevY - e.clientY) + 'px'
                  }
                  else if(currentResizer.classList.contains('nw')){
                      thisObj.style.width = rect.width + (prevX - e.clientX) + 'px';
                      thisObj.style.height = rect.height + (prevY - e.clientY) + 'px';
                      thisObj.style.top =  rect.top - (prevY - e.clientY) + 'px'
                      thisObj.style.left =  rect.left - (prevX - e.clientX) + 'px'
                  }

                  prevX = e.clientX
                  prevY = e.clientY
              }

            function mouseup(){
                window.removeEventListener('mousemove',mousemove);
                window.removeEventListener('mouseup',mouseup);
                isResizing = false;
            }
        }
    }
}
 