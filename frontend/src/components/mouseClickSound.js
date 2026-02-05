const mouseClickSound = new Audio("/Sounds/computer-mouse-click.mp3");
const endCallSound = new Audio("/Sounds/phoneEndCall.mp3");
export const clickSound = ()=> {
    mouseClickSound.currentTime = 0;
    mouseClickSound.play()
}
export const phoneEndCall = ()=> {
    endCallSound.currentTime = 0;
    endCallSound.play().catch(err=> console.log(err))
}