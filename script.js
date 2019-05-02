const store = new Vuex.Store({
    state: {
        totalSum: 0,
        dice: [{
                id: 1,
                value: 0,
                locked: false
            }, {
                id: 2,
                value: 0,
                locked: false
            }, {
                id: 3,
                value: 0,
                locked: false
            }, {
                id: 4,
                value: 0,
                locked: false
            }, {
                id: 5,
                value: 0,
                locked: false
            }],
        dievalue: 0,
        sames:  {
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            '5': 0,
            '6': 0
        }, 
        pairOne: [],
        pairTwo: [],
        samesTotal: 0,
        pairSum: 0,
        lockedNumbers: [],
        lockedNumbersSum: 0,
        tretalSum: 0,
        fyrtalSum: 0,
        twoPairSum: 0,
        fullhouseSum: 0,
        smallStraight: false,
        largeStraight: false,
        yatzy: false,
        counter: 0,
        roundCounter: 0,
        gameFinished: false
    },
    mutations: {
        restartGame(state) {
            console.log('restarting')
            state.gameFinished = false
            this.commit('resetCounter')
        },
        prepareSames(state, n) {
            for (i = 0; i < state.dice.length; i++) {
                if (state.dice[i].locked && state.dice[i].value === n) {
                    state.sames[n]++
                }
                else continue
            }
            // 1. Reset sames (zeros)
            // 2. Calculate sames
        },
        rollDice(state) {
            if (state.counter < 13) {
                for (i = 0; i < state.dice.length; i++) {
                    state.dievalue = Math.floor(Math.random() * 6) + 1;
                    if (state.dice[i].locked) continue
                    else state.dice[i].value = state.dievalue
                }
                state.counter++
            } else {
                console.log('need to choose')
            }
        },
        resetCounter(state) {
            state.counter = 0
            state.dice.forEach(die => die.locked = false)
            state.lockedNumbers = []
            state.getLockedNumbersSum = 0
            state.roundCounter++
            if (state.roundCounter === 3) {
                console.log('game over')
                this.commit('gameOver')
            }
        },
        gameOver(state) {
            state.gameFinished = true
        },
        countNumbers(state, n) {
            this.commit('prepareSames', n)

            // sames is prepared

            state.samesTotal += (state.sames[n] * n)
            state.totalSum += (state.sames[n] * n)
        },
        checkPair(state) {
            if (state.dice.filter(die => die.locked)[0].value === state.dice.filter(die => die.locked)[1].value) {
                state.pairSum = state.dice.filter(die => die.locked)[0].value * 2
                state.totalSum += state.pairSum

            }
        },
        checkTwoPairs(state) {
            state.dice.filter(die => die.locked).forEach(die => state.lockedNumbers.push(die.value))
            state.lockedNumbers.sort((a, b) => a - b)
            if ((state.lockedNumbers[0]) === (state.lockedNumbers[1])
                && (state.lockedNumbers[2]) === (state.lockedNumbers[3])) {
                console.log('ja')
                state.twoPairSum = state.lockedNumbers.reduce((num, total) => total + num)
                state.totalSum += state.twoPairSum
            }
        },
        checkFullhouse(state) {
            state.lockedNumbers = []
            state.dice.filter(die => die.locked).forEach(die => state.lockedNumbers.push(die.value))
            state.lockedNumbers.sort((a, b) => a - b)
            if (state.lockedNumbers[1] < state.lockedNumbers[2]) {
                console.log('one')
                if ((state.lockedNumbers[0] === state.lockedNumbers[1])
                    && (state.lockedNumbers[2] + state.lockedNumbers[3] + state.lockedNumbers[4]) / 3 === state.lockedNumbers[2]) {
                    console.log('ja')
                    state.fullhouseSum = state.lockedNumbers.reduce((num, total) => total + num)
                    state.totalSum += state.fullhouseSum
                }
            } else {
                console.log('two')
                if ((state.lockedNumbers[0] + state.lockedNumbers[1] + state.lockedNumbers[2]) / 3 === state.lockedNumbers[0]
                    && state.lockedNumbers[3] === state.lockedNumbers[4]) {
                    console.log('ja')
                    state.fullhouseSum = state.lockedNumbers.reduce((num, total) => total + num)
                    state.totalSum += state.fullhouseSum
                }
            }
        },
        check(state, n) {
            state.getLockedNumbersSum = 0
            state.dice.filter(die => die.locked).forEach(die => state.lockedNumbers.push(die.value))
            if (state.lockedNumbers.length === n && (state.lockedNumbers.reduce((num, total) => total + num) % state.lockedNumbers.length === 0)) {
                if (n === 3) {
                    state.tretalSum = state.lockedNumbers.reduce((num, total) => total + num)
                    state.totalSum += state.tretalSum
                } else if (n === 4) {
                    state.fyrtalSum = state.lockedNumbers.reduce((num, total) => total + num)
                    state.totalSum += state.fyrtalSum
                }
            }
        },
        checkStraight(state, n) {
            state.lockedNumbers = []
            if (state.dice.filter(die => die.locked).length === 5) {
                state.dice.filter(die => die.locked).forEach(die => state.lockedNumbers.push(die.value))
                state.lockedNumbers.sort((a, b) => a - b)
                if (state.lockedNumbers[0] === n &&
                    state.lockedNumbers[1] === n + 1 &&
                    state.lockedNumbers[2] === n + 2 &&
                    state.lockedNumbers[3] === n + 3 &&
                    state.lockedNumbers[4] === n + 4) {
                    if (n === 1) {
                        state.smallStraight = true
                        state.totalSum += 15
                    }
                    else if (n === 2) {
                        state.largeStraight = true
                        state.totalSum += 20
                    }
                }
            }
        },
        checkYatzy(state) {
            if (state.dice.filter(die => die.locked).length === 5) {
                state.dice.filter(die => die.locked).forEach(die => state.lockedNumbers.push(die.value))
                if (state.lockedNumbers.every(num => num - num == 0)) {
                    state.yatzy = true
                    state.totalSum += 50
                }
            }
        },
        chance(state) {
            state.dice.filter(die => die.locked).forEach(die => state.lockedNumbers.push(die.value))
                state.lockedNumbersSum = state.lockedNumbers.reduce((num, total) => total + num)
                state.totalSum += state.lockedNumbersSum
        }
    },
    getters: {
        getSamesTotal: state => {
            return state.samesTotal
        },
        getSames: state => {
            return state.sames
        },
        getTretalSum: state => {
            return state.tretalSum
        },
        getFyrtalSum: state => {
            return state.fyrtalSum
        },
        getLocked: state => {
            return state.dice.filter(die => die.locked)
        },
        getLockedNumbersSum: (state) => {
            return state.lockedNumbersSum
        },
        getLockedNumbers: state => {
            return state.lockedNumbers
        },
        getPairSum: state => {
            return state.pairSum
        },
        getdievalue: (state) => (id) => {
            return state.dice.filter(die => die.id == id)
        }
        
    }
})

Vue.component('loader', {
    template: `<div class="custom-class"  :loading="loading" ></div>`,

})

Vue.component('dice', {
    props: ['die'],
    template: `<div>
               <div class="dice" v-for="die, index in shownumber" :key="index" @click="die.locked = !die.locked" 
    v-bind:class="{locked:die.locked}" > {{ die.value }} </div>
    </div>`,
    computed: {
        shownumber() {
            return this.$store.state.dice
        }
    },
    //components: {
    //    'loader': loader
    //}
})

Vue.component('firstsum', {
    template: `<section>
    <div> <label> Sum: </label> <span v-show="getSum > 63"> {{ getSum }}</span> </div> <br>
    <div> <label>Bonus:</label> <span v-if="getSum > 63">50 </span> <span v-else>0</span> </div>
    </section>`,
    computed: {
        getSum() {
            return this.$store.getters.getSamesTotal
        }
    }
})

Vue.component('ettor', {
    template: `<div class="child" v-bind:class="{inactive:getClick}"><button @click.once="countNumbers" >Ones</button><transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-bind:css="false"
  > <span v-show="getOnes > 0"> {{ getOnes }} </span> </transition></div>`,
    computed: {
        getOnes() {
            return this.$store.getters.getSames[1]
        },
        getClick() {
            return this.$data.clicked
        }
    },
    methods: {
        countNumbers() {
            store.commit('countNumbers', 1)
            store.commit('resetCounter')
            this.$data.clicked = true
        },
        beforeEnter: function (el) {
            el.style.opacity = 0
        },
        enter: function (el, done) {
            Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 700 })
            Velocity(el, { fontSize: '1em' }, { complete: done })
        }
    },
    data() {
        return { clicked: false }
    }
})

Vue.component('tvor', {
    template: `<div class="child" v-bind:class="{inactive:getClick}"><button @click.once="countNumbers">Twos</button> <transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-bind:css="false"
  ><span v-show="getTwos > 0"> {{ getTwos }} </span></transition></div>`,
    computed: {
        getTwos() {
            return this.$store.getters.getSames[2] * 2
        },
        getClick() {
            return this.$data.clicked
        }
    },
    methods: {
        countNumbers() {
            store.commit('countNumbers', 2)
            store.commit('resetCounter')
            this.$data.clicked = true

        },
        beforeEnter: function (el) {
            el.style.opacity = 0
        },
        enter: function (el, done) {
            Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 700 })
            Velocity(el, { fontSize: '1em' }, { complete: done })
        }
    },
    data() {
        return { clicked: false }
    }
})

Vue.component('treor', {
    template: `<div class="child" v-bind:class="{inactive:getClick}"><button @click.once="countNumbers">Threes</button><transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-bind:css="false"
  > <span v-show="getThrees > 0"> {{ getThrees }} </span></transition></div>`,
    computed: {
        getThrees() {
            return this.$store.getters.getSames[3] * 3
        },
        getClick() {
            return this.$data.clicked
        }
    },
    methods: {
        countNumbers() {
            store.commit('countNumbers', 3)
            store.commit('resetCounter')
            this.$data.clicked = true

        },
        beforeEnter: function (el) {
            el.style.opacity = 0
        },
        enter: function (el, done) {
            Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 700 })
            Velocity(el, { fontSize: '1em' }, { complete: done })
        }
    },
    data() {
        return { clicked: false }
    }
})

Vue.component('fyror', {
    template: `<div class="child" v-bind:class="{inactive:getClick}"><button @click.once="countNumbers">Fours</button><transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-bind:css="false"
  > <span v-show="getFours > 0"> {{ getFours }} </span></transition></div>`,
    computed: {
        getFours() {
            return this.$store.getters.getSames[4] * 4
        },
        getClick() {
            return this.$data.clicked
        }
    },
    methods: {
        countNumbers() {
            store.commit('countNumbers', 4)
            store.commit('resetCounter')
            this.$data.clicked = true

        },
        beforeEnter: function (el) {
            el.style.opacity = 0
        },
        enter: function (el, done) {
            Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 700 })
            Velocity(el, { fontSize: '1em' }, { complete: done })
        }
    },
    data() {
        return { clicked: false }
    }
})

Vue.component('femor', {
    template: `<div class="child" v-bind:class="{inactive:getClick}"><button @click.once="countNumbers">Fives</button><transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-bind:css="false"
  > <span v-show="getFives > 0"> {{ getFives }} </span></transition></div>`,
    computed: {
        getFives() {
            return this.$store.getters.getSames[5] * 5
        },
        getClick() {
            return this.$data.clicked
        }
    },
    methods: {
        countNumbers() {
            store.commit('countNumbers', 5)
            store.commit('resetCounter')
            this.$data.clicked = true

        },
        beforeEnter: function (el) {
            el.style.opacity = 0
        },
        enter: function (el, done) {
            Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 700 })
            Velocity(el, { fontSize: '1em' }, { complete: done })
        }
    },
    data() {
        return { clicked: false }
    }
})

Vue.component('sexor', {
    template: `<div class="child" v-bind:class="{inactive:getClick}"><button @click.once="countNumbers">Sixes</button><transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-bind:css="false"
  > <span v-show="getSixes > 0"> {{ getSixes }} </span></transition></div>`,
    computed: {
        getSixes() {
            return this.$store.getters.getSames[6] * 6
        },
        getClick() {
            return this.$data.clicked
        }
    },
    methods: {
        countNumbers() {
            store.commit('countNumbers', 6)
            store.commit('resetCounter')
            this.$data.clicked = true

        },
        beforeEnter: function (el) {
            el.style.opacity = 0
        },
        enter: function (el, done) {
            Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 700 })
            Velocity(el, { fontSize: '1em' }, { complete: done })
        }
    },
    data() {
        return { clicked: false }
    }
})

Vue.component('onepair', {
    template: `<div class="child" v-bind:class="{inactive:getClick}"><button @click.once="checkPair">1 pair</button><transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-bind:css="false"
  > <span v-if="getPair > 1">{{ getPair }}</span></transition></div>`,
    computed: {
        getPair() {
            return this.$store.getters.getPairSum 
        },
        getClick() {
            return this.$data.clicked
        }
    },
    methods: {
        checkPair() {
            store.commit('checkPair')
            store.commit('resetCounter')
            this.$data.clicked = true

        },
        beforeEnter: function (el) {
            el.style.opacity = 0
        },
        enter: function (el, done) {
            Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 700 })
            Velocity(el, { fontSize: '1em' }, { complete: done })
        }
    },
    data() {
        return { clicked: false }
    }
})

Vue.component('twopairs', {
    template: `<div class="child" v-bind:class="{inactive:getClick}"><button @click.once="checkTwoPairs">2 pairs</button><transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-bind:css="false"
  > <span v-if="getPairs > 1">{{ getPairs }}</span></transition></div>`,
    computed: {
        getPairs() {
            return this.$store.state.twoPairSum
        },
        getClick() {
            return this.$data.clicked
        }
    },
    methods: {
        checkTwoPairs() {
            store.commit('checkTwoPairs')
            store.commit('resetCounter')
            this.$data.clicked = true

        },
        beforeEnter: function (el) {
            el.style.opacity = 0
        },
        enter: function (el, done) {
            Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 700 })
            Velocity(el, { fontSize: '1em' }, { complete: done })
        }
    },
    data() {
        return { clicked: false }
    }
})

Vue.component('tretal', {
    template: `<div class="child" v-bind:class="{inactive:getClick}"><button @click.once="check3">Three of a kind</button><transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-bind:css="false"
  > <span v-if="getSum > 0">{{ getSum }}</span> </transition></div>`,
    computed: {
        getSum() {
            return this.$store.getters.getTretalSum
        },
        getClick() {
            return this.$data.clicked
        }
    },
    methods: {
        check3() {
            store.commit('check', 3)
            store.commit('resetCounter')
            this.$data.clicked = true

        },
        beforeEnter: function (el) {
            el.style.opacity = 0
        },
        enter: function (el, done) {
            Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 700 })
            Velocity(el, { fontSize: '1em' }, { complete: done })
        }
    },
    data() {
        return { clicked: false }
    }
})

Vue.component('fyrtal', {
    template: `<div class="child" v-bind:class="{inactive:getClick}"><button @click.once="check">Four of a kind</button><transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-bind:css="false"
  > <span v-if="getSum > 0">{{ getSum }}</span></transition></div>`,
    computed: {
        getSum() {
            return this.$store.getters.getFyrtalSum
        },
        getClick() {
            return this.$data.clicked
        }
    },
    methods: {
        check() {
            store.commit('check', 4)
            store.commit('resetCounter')
            this.$data.clicked = true

        },
        beforeEnter: function (el) {
            el.style.opacity = 0
        },
        enter: function (el, done) {
            Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 700 })
            Velocity(el, { fontSize: '1em' }, { complete: done })
        }
    },
    data() {
        return { clicked: false }
    }
})

Vue.component('liten', {
    template: `<div class="child" v-bind:class="{inactive:getClick}"><button @click.once="check">Small straight</button><transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-bind:css="false"
  > <span v-if="getSum">{{ 15 }}</span> </transition></div>`,
    computed: {
        getSum() {
            return this.$store.state.smallStraight
        },
        getClick() {
            return this.$data.clicked
        }
    },
    methods: {
        check() {
            store.commit('checkStraight', 1)
            store.commit('resetCounter')
            this.$data.clicked = true

        },
        beforeEnter: function (el) {
            el.style.opacity = 0
        },
        enter: function (el, done) {
            Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 700 })
            Velocity(el, { fontSize: '1em' }, { complete: done })
        }
    },
    data() {
        return { clicked: false }
    }
})

Vue.component('stor', {
    template: `<div class="child" v-bind:class="{inactive:getClick}"><button @click.once="check">Large straight</button><transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-bind:css="false"
  > <span v-if="getSum">{{ 20 }}</span></transition></div>`,
    computed: {
        getSum() {
            return this.$store.state.largeStraight
        },
        getClick() {
            return this.$data.clicked
        }
    },
    methods: {
        check() {
            store.commit('checkStraight', 2)
            store.commit('resetCounter')
            this.$data.clicked = true

        },
        beforeEnter: function (el) {
            el.style.opacity = 0
        },
        enter: function (el, done) {
            Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 700 })
            Velocity(el, { fontSize: '1em' }, { complete: done })
        }
    },
    data() {
        return { clicked: false }
    }
})

Vue.component('fullhouse', {
    template: `<div class="child" v-bind:class="{inactive:getClick}"><button @click.once="check">Fullhouse</button><transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-bind:css="false"
  > <span v-if="getSum">{{ getSum }}</span></transition></div>`,
    computed: {
        getSum() {
            return this.$store.state.fullhouseSum
        },
        getClick() {
            return this.$data.clicked
        }
    },
    methods: {
        check() {
            store.commit('checkFullhouse')
            store.commit('resetCounter')
            this.$data.clicked = true

        },
        beforeEnter: function (el) {
            el.style.opacity = 0
        },
        enter: function (el, done) {
            Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 700 })
            Velocity(el, { fontSize: '1em' }, { complete: done })
        }
    },
    data() {
        return { clicked: false }
    }
})

Vue.component('chance', {
    template: `<div class="child" v-bind:class="{inactive:getClick}"><button @click.once="check">Chance</button><transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-bind:css="false"
  > <span v-if="getSum">{{ getSum }}</span></transition></div>`,
    computed: {
        getSum() {
            return this.$store.getters.getLockedNumbersSum
        },
        getClick() {
            return this.$data.clicked
        }
    },
    methods: {
        check() {
            store.commit('chance')
            store.commit('resetCounter')
            this.$data.clicked = true

        },
        beforeEnter: function (el) {
            el.style.opacity = 0
        },
        enter: function (el, done) {
            Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 700 })
            Velocity(el, { fontSize: '1em' }, { complete: done })
        }
    },
    data() {
        return { clicked: false }
    }
})


Vue.component('yatzy', {
    template: `<div class="child" v-bind:class="{inactive:getClick}"><button @click.once="check">Yatzy!</button><transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-bind:css="false"
  > <span v-if="getSum">{{ 50 }}</span></transition></div>`,
    computed: {
        getSum() {
            return this.$store.state.yatzy
        },
        getClick() {
            return this.$data.clicked
        }
    },
    methods: {
        check() {
            store.commit('checkYatzy')
            store.commit('resetCounter')
            this.$data.clicked = true

        },
        beforeEnter: function (el) {
            el.style.opacity = 0
        },
        enter: function (el, done) {
            Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 700 })
            Velocity(el, { fontSize: '1em' }, { complete: done })
        }
    },
    data() {
        return { clicked: false }
    }
})

Vue.component('result', {
    template: `<footer> Total Sum: {{ animatedNumber }} </footer>`,
    computed: {
        number: function() {
            return this.$store.state.totalSum
        },
        animatedNumber: function () {
            return this.tweenedNumber.toFixed(0);
        }
    },
    data: function () {
        return { tweenedNumber: 0 }
    },
    watch: {
        number: function(newValue) {
            TweenLite.to(this.$data, 0.7, { tweenedNumber: newValue });
        }
    }
})

Vue.component('app-child', {
    template: `<transition name="fade"> <div class="modal" v-if="gameFinished" >
            <button @click="restartGame"> Close </button>
    <h2>Game over! Your score is {{ getResult }}. Hit refresh to play a new game</h2>
        <slot></slot>
  </div></transition>`,
    computed: {
        gameFinished() {
            return this.$store.state.gameFinished
        },
        getResult() {
            return this.$store.state.totalSum
        }
    },
    methods: {
        restartGame() {
            store.commit('restartGame')
        }
    }
})

const app = new Vue({
    el: '#app',
    //props: ['gameFinished'],
    store,
    methods: {
        throwdice () {
            store.commit('rollDice')
        }
    },
    data() {
        return {
            bkClass: 'bk',
            blurClass: 'blur'
        }
    },
    computed: {
        gameFinished() {
            return this.$store.state.gameFinished
        }
    }
})
