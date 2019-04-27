const store = new Vuex.Store({
    state: {
        totalsum: 0,
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
        //ones: 0,
        sames: [
            {
                id: 1,
                value: 0
            },
            {
                id: 2,
                value: 0
            },
            {
                id: 3,
                value: 0
            },
            {
                id: 4,
                value: 0
            },
            {
                id: 5,
                value: 0
            },
            {
                id: 6,
                value: 0
            }
        ],
        samesTotal: 0
    },
    mutations: {
        rollDice(state) {
            //state.sames = 0
            for (i = 0; i < state.dice.length; i++) {
                state.dievalue = Math.floor(Math.random() * 6) + 1;
                if (state.dice[i].locked) continue
                else state.dice[i].value = state.dievalue
            }
        },
        countNumbers(state, n) {
            for (i = 0; i < state.dice.length; i++) {
                if (state.dice[i].locked && state.dice[i].value === n) {
                    state.sames[n - 1].value++
                }
                else continue
            }
            state.samesTotal += (state.sames[n - 1].value * n)
        },
        calculateSum(state, getters) {
            for (i = 0; i < getters.getSames.length; i++) {
                state.totalsum += getters.getSames[i].value
            }
            return state.totalsum
        }
        //filter(die => die.value == n)
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
        getLocked: state => {
            return state.dice.filter(die => die.locked)
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
    v-bind:class="{locked:die.locked}" v-show="die.value > 0"> {{ die.value }} </div>
    </div>`,
    computed: {
        shownumber() {
            return this.$store.state.dice
        }
    }
})

Vue.component('firstsum', {
    template: `
    <div v-show="getSum > 63"> <label> Sum </label>  {{ getSum }} </div>
    `,
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
            return this.$store.getters.getSames[0].value
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
            return this.$store.state.sames[1].value*2
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
            return this.$store.state.sames[2].value*3
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
            return this.$store.state.sames[3].value*4
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
            return this.$store.state.sames[4].value*5
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
            return this.$store.state.sames[5].value*6
        }
    },
    methods: {
        countNumbers() {
            store.commit('countNumbers', 6)
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