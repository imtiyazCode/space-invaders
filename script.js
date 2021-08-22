document.addEventListener("DOMContentLoaded", ()=>{

    const squares = document.querySelectorAll('.grid div');
    const resultsDisplay = document.querySelector('#results');

    let currentShooterIndex = 202;
    let width = 15
    let direction = 1
    let invadersId;
    let aliensRemoved = [];
    let results = 0;

    const alienInvaders = [
        0,1,2,3,4,5,6,7,8,9,
        15,16,17,18,19,20,21,22,23,24,
        30,31,32,33,34,35,36,37,38,39
    ];

    // draw alien invader
    
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.add('invader')
    }

    // draw shooter
    squares[currentShooterIndex].classList.add('shooter');

    // shooter move
    function moveShooter(e) {
        squares[currentShooterIndex].classList.remove('shooter');
        switch(e.key) {
        case 'ArrowLeft':
            if (currentShooterIndex % width !== 0)
                currentShooterIndex -=1;
                break;
        case 'ArrowRight' :
            if (currentShooterIndex % width < width -1)
                currentShooterIndex +=1;
                break;
        }
        squares[currentShooterIndex].classList.add('shooter');
    }
    document.addEventListener('keydown', moveShooter);

    // move invader
    function moveInvader(){
        const leftEdge = alienInvaders[0] % width === 0;
        const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width-1;

        for (let i = 0; i < alienInvaders.length; i++) {
            squares[alienInvaders[i]].classList.remove('invader')
        }

        if((leftEdge && direction == -1) || (rightEdge && direction == 1)){
            direction = width;
        }
        else if(direction == width){
            if(leftEdge) { direction = 1; }
            else {  direction = -1; }
        }

        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += direction;
        }

        for (let i = 0; i < alienInvaders.length; i++) {
            if(!aliensRemoved.includes(i)) {
                squares[alienInvaders[i]].classList.add('invader')
            }
        }

        if(squares[currentShooterIndex].classList.contains('invader','shooter')){
            squares[currentShooterIndex].classList.add('boom');
            resultsDisplay.innerHTML = 'Game Over'
            clearInterval(invadersId);
        }

        for(let i=0; i<=alienInvaders.length-1; i++){
            if(alienInvaders[i] > (squares.length-(2*width-1))){
                resultsDisplay.innerHTML = "Game Over"
                clearInterval(invadersId);
            }
        }

        // desice winer
        if(aliensRemoved.length === alienInvaders.length){
            resultsDisplay.textContent = "You Win";
        }
    }

    invadersId = setInterval(moveInvader,500);
    

    // shoot Aliens
    function shoot(e){

        let laserId
        let currentLaserIndex = currentShooterIndex
        function moveLaser() {
          squares[currentLaserIndex].classList.remove('laser')
          currentLaserIndex -= width
          squares[currentLaserIndex].classList.add('laser')
      
          if (squares[currentLaserIndex].classList.contains('invader')) {
            squares[currentLaserIndex].classList.remove('laser')
            squares[currentLaserIndex].classList.remove('invader')
            squares[currentLaserIndex].classList.add('boom')
      
            setTimeout(()=> squares[currentLaserIndex].classList.remove('boom'), 300)
            clearInterval(laserId)
      
            const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
            aliensRemoved.push(alienRemoved)
            results++
            resultsDisplay.innerHTML = results
            console.log(aliensRemoved)
      
          }
      
        }
        switch(e.key) {
          case 'ArrowUp':
            laserId = setInterval(moveLaser, 100)
        }
    }

    document.addEventListener('keydown',shoot);

})