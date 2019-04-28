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
        sames: [
            {
                id: 1,
                count: 0
            },
            {
                id: 2,
                count: 0
            },
            {
                id: 3,
                count: 0
            },
            {
                id: 4,
                count: 0
            },
            {
                id: 5,
                count: 0
            },
            {
                id: 6,
                count: 0
            }
        ],
        samesTotal: 0,
        pairSum: 0,
        lockedNumbers: [],
        lockedNumbersSum: 0,
        tretalSum: 0,
        fyrtalSum: 0,
        smallStraight: false,
        largeStraight: false,
        yatzy: false
    },
    mutations: {
        rollDice(state) {
            for (i = 0; i < state.dice.length; i++) {
                state.dievalue = Math.floor(Math.random() * 6) + 1;
                if (state.dice[i].locked) continue
                else state.dice[i].value = state.dievalue
            }
        },
        countNumbers(state, n) {
            for (i = 0; i < state.dice.length; i++) {
                if (state.dice[i].locked && state.dice[i].value === n) {
                    state.sames[n - 1].count++
                }
                else continue
            }
            state.samesTotal += (state.sames[n - 1].count * n)
            state.totalSum += (state.sames[n - 1].count * n)
        },
        calculateSum(state, getters) {
            for (i = 0; i < getters.getSames.length; i++) {
                state.totalSum += getters.getSames[i].count
            }
            return state.totalSum
        },
        checkPair(state) {
            if (state.dice.filter(die => die.locked)[0].value === state.dice.filter(die => die.locked)[1].value) {
                state.pairSum = state.dice.filter(die => die.locked)[0].value * 2
                state.totalSum += state.pairSum
            }
            //for (i = 0; i < state.dice.filter(die => die.locked).length; i++) console.log('ok')
        },
        checkTwoPairs(state) {
            //state.lockedNumbers = []
            state.dice.filter(die => die.locked).forEach(die => state.lockedNumbers.push(die.value))
            for (i = 0; i < state.lockedNumbers.length; i++) {
                if (state.lockedNumbers[i] == state.sames[state.lockedNumbers[i] - 1].id) {
                    state.sames[state.lockedNumbers[i] - 1].count++
                    console.log(i)
                } else console.log('oxi')
            }
        },
        check(state, n) {
            state.lockedNumbers = []
            state.getLockedNumbersSum = 0
            state.dice.filter(die => die.locked).forEach(die => state.lockedNumbers.push(die.value))
            if (state.lockedNumbers.length === n && state.lockedNumbers.every(num => num - num === 0)) {
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
            state.lockedNumbers = []
            if (state.dice.filter(die => die.locked).length === 5) {
                state.dice.filter(die => die.locked).forEach(die => state.lockedNumbers.push(die.value))
                if (state.lockedNumbers.every(num => num - num == 0)) {
                    state.yatzy = true
                    state.totalSum += 50
                }
            }
        },
        chance(state) {
            state.lockedNumbers = []
            state.getLockedNumbersSum = 0
            state.dice.filter(die => die.locked).forEach(die => state.lockedNumbers.push(die.value))
            state.lockedNumbersSum = state.lockedNumbers.reduce((num, total) => total + num)
            state.totalSum += state.lockedNumbersSum
        }
    },
    actions: {
        countNumbers({ commit }) {
            commit('countNumbers')
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
    }
})

Vue.component('firstsum', {
    template: `<section>
    <div v-show="getSum > 63"> <label> Sum </label>  {{ getSum }} </div> <br>
    <div> <label>Bonus</label> <span v-if="getSum > 63">50 </span> <span v-else>0</span> </div>
    </section>`,
    computed: {
        getSum() {
            return this.$store.getters.getSamesTotal
        }
    }
})

Vue.component('ettor', {
    template: `<div class="child"><button @click="countNumbers">Ones</button> <span v-show="getOnes > 0"> {{ getOnes }} </span> </div>`,
    computed: {
        getOnes() {
            return this.$store.getters.getSames[0].count
        }
    },
    methods: {
        countNumbers() {
            store.commit('countNumbers', 1)
        }
    }
})

Vue.component('tvor', {
    template: `<div class="child"><button @click="countNumbers">Twos</button> <span v-show="getTwos > 0"> {{ getTwos }} </span></div>`,
    computed: {
        getTwos() {
            return this.$store.state.sames[1].count * 2
        }
    },
    methods: {
        countNumbers() {
            store.commit('countNumbers', 2)
        }
    }
})

Vue.component('treor', {
    template: `<div class="child"><button @click="countNumbers">Threes</button> <span v-show="getThrees > 0"> {{ getThrees }} </span></div>`,
    computed: {
        getThrees() {
            return this.$store.state.sames[2].count * 3
        }
    },
    methods: {
        countNumbers() {
            store.commit('countNumbers', 3)
        }
    }
})

Vue.component('fyror', {
    template: `<div class="child"><button @click="countNumbers">Fours</button> <span v-show="getFours > 0"> {{ getFours }} </span></div>`,
    computed: {
        getFours() {
            return this.$store.state.sames[3].count * 4
        }
    },
    methods: {
        countNumbers() {
            store.commit('countNumbers', 4)
        }
    }
})

Vue.component('femor', {
    template: `<div class="child"><button @click="countNumbers">Fives</button> <span v-show="getFives > 0"> {{ getFives }} </span></div>`,
    computed: {
        getFives() {
            return this.$store.state.sames[4].count * 5
        }
    },
    methods: {
        countNumbers() {
            store.commit('countNumbers', 5)
        }
    }
})

Vue.component('sexor', {
    template: `<div class="child"><button @click="countNumbers">Sixes</button> <span v-show="getSixes > 0"> {{ getSixes }} </span></div>`,
    computed: {
        getSixes() {
            return this.$store.state.sames[5].count * 6
        }
    },
    methods: {
        countNumbers() {
            store.commit('countNumbers', 6)
        }
    }
})

Vue.component('onepair', {
    template: `<div class="child"><button @click="checkPair">1 pair</button> <span v-if="getPair > 1">{{ getPair }}</span> <span v-else>0</span></div>`,
    computed: {
        getPair() {
            return this.$store.getters.getPairSum 
        }
    },
    methods: {
        checkPair() {
            store.commit('checkPair')
        }
    }
})

Vue.component('twopairs', {
    template: `<div class="child"><button @click="checkTwoPairs">2 pairs</button> <span v-if="getPairs > 1">{{ getPairs }}</span> <span v-else>0</span></div>`,
    computed: {
        getPairs() {
            return 
        }
    },
    methods: {
        checkTwoPairs() {
            store.commit('checkTwoPairs')
        }
    }
})

Vue.component('tretal', {
    template: `<div class="child"><button @click="check3">Three of a kind</button> <span v-if="getSum > 0">{{ getSum }}</span> <span v-else>0</span></div>`,
    computed: {
        getSum() {
            return this.$store.getters.getTretalSum
        }
    },
    methods: {
        check3() {
            store.commit('check', 3)
        }
    }
})

Vue.component('fyrtal', {
    template: `<div class="child"><button @click="check">Four of a kind</button> <span v-if="getSum > 0">{{ getSum }}</span> <span v-else>0</span></div>`,
    computed: {
        getSum() {
            return this.$store.getters.getFyrtalSum
        }
    },
    methods: {
        check() {
            store.commit('check', 4)
        }
    }
})

Vue.component('liten', {
    template: `<div class="child"><button @click="check">Small straight</button> <span v-if="getSum">{{ 15 }}</span> <span v-else>0</span></div>`,
    computed: {
        getSum() {
            return this.$store.state.smallStraight
        }
    },
    methods: {
        check() {
            store.commit('checkStraight', 1)
        }
    }
})

Vue.component('stor', {
    template: `<div class="child"><button @click="check">Large straight</button> <span v-if="getSum">{{ 20 }}</span> <span v-else>0</span></div>`,
    computed: {
        getSum() {
            return this.$store.state.largeStraight
        }
    },
    methods: {
        check() {
            store.commit('checkStraight', 2)
        }
    }
})

Vue.component('chance', {
    template: `<div class="child"><button @click="check">Chance</button> <span v-if="getSum">{{ getSum }}</span> <span v-else>0</span></div>`,
    computed: {
        getSum() {
            return this.$store.getters.getLockedNumbersSum
        }
    },
    methods: {
        check() {
            store.commit('chance')
        }
    }
})


Vue.component('yatzy', {
    template: `<div class="child"><button @click="check">Yatzy!</button> <span v-if="getSum">{{ 50 }}</span> <span v-else>0</span></div>`,
    computed: {
        getSum() {
            return this.$store.state.yatzy
        }
    },
    methods: {
        check() {
            store.commit('checkYatzy')
        }
    }
})



const app = new Vue({
    el: '#app',
    store,
    methods: {
        throwdice () {
            store.commit('rollDice')
        },
    }
})

//todo: add the iterator (count to 15)