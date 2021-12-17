        class Player {
            constructor({color, n, elem}) {
                this.color = color
                this.n = n
                this.elem = elem
                this.playerLabel = document.getElementById('player_label')
                this.ludoBoard = document.getElementById('board')
                this.diceLabel = document.getElementById('dice_res')
// gap
                this.remDist = 56
                this.canMove = false
                this.pos = 0
                if(this.color == 'blue') {
                    this.pos = 1
                } else if(this.color == 'orange') {
                    this.pos = 14
                } else if(this.color == 'green') {
                    this.pos = 27
                } else {
                    this.pos = 40
                }

                this.elem.addEventListener('click', this.elemClicked.bind(this))
            }
            resetPlayer() {
                if(this.color == 'blue') {
                    this.pos == 1
                } else if(this.color == 'orange') {
                    this.pos = 14
                } else if(this.color == 'green') {
                    this.pos = 27
                } else {
                    this.pos = 40
                }
                this.remDist = 56
                this.canMove = false
                this.elem.style.transform = 'translate(0px, 0px)'
            }
            elemClicked() {
                let correctTurn = this.playerLabel.innerText.toLowerCase()
                if(this.color != correctTurn) {
                    alert('It\'s ' + correctTurn + '\'s turn!')
                } else {
                    let diceThrow = App.diceThrow
                    if(this.isValidMove(diceThrow)) {
                        this.move(diceThrow)
                        if(this.notSafePos()) {
                            this.removeOpponents()
                        }
                        // RESET THE DICE LABEL
                        App.diceThrow = 0
                        this.diceLabel.innerText = App.diceThrow
                    } else {
                        alert('Invalid move')
                    }
                }
            }
            notSafePos() {
                if(this.pos == 0) {
                    return false
                }
                let arr = [1, 9, 14, 22, 27, 35, 40, 48]
                if(arr.includes(this.pos)) {
                    return false
                } else {
                    return true
                }
            }
            removeOpponents() {
                let leaveIndex = -1
                if(this.color == 'blue') {
                    leaveIndex = 0
                } else if(this.color == 'orange') {
                    leaveIndex = 1
                } else if(this.color == 'green') {
                    leaveIndex = 2
                } else if(this.color == 'yellow') {
                    leaveIndex = 3
                }
                for(let i = 0; i < 4; i++) {
                    if(i == leaveIndex) {
                        continue
                    } else {
                        for(let j = 0; j < 4; j++) {
                            if(App.players[i][j].pos == this.pos) {
                                App.players[i][j].resetPlayer()
                            }
                        }
                    }
                }
            }
            move(diceThrow) {
                let x = 0, y = 0
                if(this.canMove == true) {
                    if(this.remDist - diceThrow >= 6) {
                        let sElem = null
                        if(this.pos + diceThrow > 52) {
                            sElem = document.getElementById('r-' + (this.pos + diceThrow - 52))
                        } else {
                            sElem = document.getElementById('r-' + (this.pos + diceThrow))
                        }
                        let data = this.getLocation(sElem)
                        x = data.x
                        y = data.y
                        this.pos += diceThrow
                        if(this.pos > 52) {
                            this.pos -= 52
                        }
                        this.remDist -= diceThrow
                    } else {
                        let sElem = null
                        if(this.color == 'blue') {
                            sElem = document.getElementById('br-' + (this.remDist - diceThrow))
                        } else if(this.color == 'orange') {
                            sElem = document.getElementById('or-' + (this.remDist - diceThrow))
                        } else if(this.color == 'green') {
                            sElem = document.getElementById('gr-' + (this.remDist - diceThrow))
                        } else if(this.color == 'yellow') {
                            sElem = document.getElementById('yr-' + (this.remDist - diceThrow))
                        }
                        let data = this.getLocation(sElem)
                        x = data.x
                        y = data.y
                        this.remDist -= diceThrow
                        this.pos = 0
                    }
                } else {
                    // UNLOCKING MOVE
                    let sElem = document.getElementById('r-' + this.pos)
                    let data = this.getLocation(sElem)
                    x = data.x
                    y = data.y
                    this.canMove = true
                }

                if(this.elem.style.transform == '') {
                    this.elem.style.transform = 'translate(' + x + 'px, ' + y + 'px)'
                } else {
                    let s = this.elem.style.transform
                    let xCurr = x + parseFloat(s.substring(s.indexOf('(')+1, s.indexOf('px')))
                    let yCurr = y + parseFloat(s.substring(s.indexOf(',')+1, s.indexOf('px', s.indexOf('px') + 1)))
                    this.elem.style.transform = 'translate(' + xCurr + 'px, ' + yCurr + 'px)'
                }
                App.prevMovePlayed = true
                if(this.color == 'blue') {
                    this.playerLabel.innerText = 'orange'
                } else if(this.color == 'orange') {
                    this.playerLabel.innerText = 'green'
                } else if(this.color == 'green') {
                    this.playerLabel.innerText = 'yellow'
                } else if(this.color == 'yellow') {
                    this.playerLabel.innerText = 'blue'
                }
            }
            getLocation(sElem) {
                let ratio = this.ludoBoard.getBoundingClientRect().width / 1000
                let data = { x: 0, y: 0 }
                data.x = (sElem.getBoundingClientRect().x - this.ludoBoard.getBoundingClientRect().x) / ratio
                data.y = (sElem.getBoundingClientRect().y - this.ludoBoard.getBoundingClientRect().y) / ratio
                data.x = this.roundToTwo(data.x)
                data.y = this.roundToTwo(data.y)
                data.x -= (this.elem.getBoundingClientRect().x - this.ludoBoard.getBoundingClientRect().x) / ratio
                data.y -= (this.elem.getBoundingClientRect().y - this.ludoBoard.getBoundingClientRect().y) / ratio
                if(sElem.id == 'br-0' || sElem.id == 'or-0' || sElem.id == 'gr-0' || sElem.id == 'yr-0') {
                    data.x += (sElem.getBoundingClientRect().width - this.elem.getBoundingClientRect().width) / (2 * ratio)
                    data.y += (sElem.getBoundingClientRect().height - this.elem.getBoundingClientRect().height) / (2 * ratio)
                } else {
                    data.x += 13
                    data.y -= 17
                }
                return data
            }
            roundToTwo(num) {
                return +(Math.round(num + "e+2") + "e-2");
            }
            isValidMove(diceThrow) {
                if(this.canMove == false) {
                    if(diceThrow == 6) {
                        return true
                    } else {
                        return false
                    }
                }
                if(this.remDist - diceThrow < 0) {
                    return false
                } else {
                    return true
                }
            }
        }
        class App {
            static prevMovePlayed = true
            static diceThrow = 0
            static players = [
                [
                    new Player({ color: 'blue', n: 1, elem: document.getElementById('b-player-1') }),
                    new Player({ color: 'blue', n: 2, elem: document.getElementById('b-player-2') }),
                    new Player({ color: 'blue', n: 3, elem: document.getElementById('b-player-3') }),
                    new Player({ color: 'blue', n: 4, elem: document.getElementById('b-player-4') })
                ],
                [
                    new Player({ color: 'orange', n: 1, elem: document.getElementById('o-player-1') }),
                    new Player({ color: 'orange', n: 2, elem: document.getElementById('o-player-2') }),
                    new Player({ color: 'orange', n: 3, elem: document.getElementById('o-player-3') }),
                    new Player({ color: 'orange', n: 4, elem: document.getElementById('o-player-4') })
                ],
                [
                    new Player({ color: 'green', n: 1, elem: document.getElementById('g-player-1') }),
                    new Player({ color: 'green', n: 2, elem: document.getElementById('g-player-2') }),
                    new Player({ color: 'green', n: 3, elem: document.getElementById('g-player-3') }),
                    new Player({ color: 'green', n: 4, elem: document.getElementById('g-player-4') })
                ],
                [
                    new Player({ color: 'yellow', n: 1, elem: document.getElementById('y-player-1') }),
                    new Player({ color: 'yellow', n: 2, elem: document.getElementById('y-player-2') }),
                    new Player({ color: 'yellow', n: 3, elem: document.getElementById('y-player-3') }),
                    new Player({ color: 'yellow', n: 4, elem: document.getElementById('y-player-4') })
                ]
            ]
            constructor() {
                this.diceBtn = document.getElementById('dice_roll_btn')
                this.diceLabel = document.getElementById('dice_res')
                this.playerLabel = document.getElementById('player_label')

                this.diceBtn.addEventListener('click', this.diceBtnClicked.bind(this))
            }
            diceBtnClicked() {
                if(App.prevMovePlayed) {
                    App.prevMovePlayed = false
                    this.randomDiceThrow()
                    let currPlayer = this.playerLabel.innerText.toLowerCase()
                    if(currPlayer == 'blue') {
                        if(!App.players[0][0].canMove && !App.players[0][1].canMove && !App.players[0][2].canMove && !App.players[0][3].canMove && App.diceThrow != 6) {
                            App.prevMovePlayed = true
                            this.playerLabel.innerText = 'orange'
                            App.diceThrow = 0
                            this.diceLabel.innerText = App.diceThrow
                        }
                    } else if(currPlayer == 'orange') {
                        if(!App.players[1][0].canMove && !App.players[1][1].canMove && !App.players[1][2].canMove && !App.players[1][3].canMove && App.diceThrow != 6) {
                            App.prevMovePlayed = true
                            this.playerLabel.innerText = 'green'
                            App.diceThrow = 0
                            this.diceLabel.innerText = App.diceThrow
                        }
                    } else if(currPlayer == 'green') {
                        if(!App.players[2][0].canMove && !App.players[2][1].canMove && !App.players[2][2].canMove && !App.players[2][3].canMove && App.diceThrow != 6) {
                            App.prevMovePlayed = true
                            this.playerLabel.innerText = 'yellow'
                            App.diceThrow = 0
                            this.diceLabel.innerText = App.diceThrow
                        }
                    } else if(currPlayer == 'yellow') {
                        if(!App.players[3][0].canMove && !App.players[3][1].canMove && !App.players[3][2].canMove && !App.players[3][3].canMove && App.diceThrow != 6) {
                            App.prevMovePlayed = true
                            this.playerLabel.innerText = 'blue'
                            App.diceThrow = 0
                            this.diceLabel.innerText = App.diceThrow
                        }
                    }
                } else {
                    alert('Play the previous move!')
                }
            }
            randomDiceThrow() {
                let x = App.diceThrow
                do {
                    x = Math.floor(Math.random() * 6) + 1
                } while (x == App.diceThrow);
                App.diceThrow = x
                let currPlayer = this.playerLabel.innerText.toLowerCase()
                let ind = -1
                if(currPlayer == 'blue') {
                    ind = 0
                } else if(currPlayer == 'orange') {
                    ind = 1
                } else if(currPlayer == 'green') {
                    ind = 2
                } else if(currPlayer == 'yellow') {
                    ind = 3
                }
                if(!App.players[ind][0].canMove && !App.players[ind][1].canMove && !App.players[ind][2].canMove && !App.players[ind][3].canMove) {
                    if(Math.random() < 0.5) {
                        App.diceThrow = 6
                    }
                }
                this.diceLabel.innerText = App.diceThrow
            }
        }
        let game = new App()
