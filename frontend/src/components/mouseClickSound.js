const mouseClickSound = new Audio("/Sounds/computer-mouse-click.mp3");
export const clickSound = ()=> {
    mouseClickSound.currentTime = 0;
    mouseClickSound.play()
}
