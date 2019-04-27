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
        ones: 0
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
                if (state.dice[i].locked && state.dice[i].value === n) state.ones++
                else continue
            }
            //if (state.getLocked.length > 0) console.log('tora')
        }
        //filter(die => die.value == n)
    },
    actions: {
        countNumbers({ commit }) {
            commit('countNumbers')
        }
    },
    getters: {
        getOnes: state => {
            return state.ones
        },
        getLocked: state => {
            return state.dice.filter(die => die.locked)
        },
        getdievalue: (state) => (id) => {
            return state.dice.filter(die => die.id == id)
        },
        calculateSum(state, getters) {
            for (i = 0; i < getters.getLocked.length; i++) {
                state.totalsum += getters.getLocked[i].value
            }
            return state.totalsum
        }
    }
})

Vue.component('dice', {
    props: ['die'],
    template: `<div>
               <div class="dice" v-for="die, index in shownumber" :key="index" @click="die.locked = !die.locked" v-bind:class="{locked:die.locked}"> {{ die.value }} </div>
    </div>`,
    computed: {
        shownumber() {
            return this.$store.state.dice
        }
    }
})

Vue.component('protocoll', {
    template: `
    <div> <label> Sum </label> <input type="text" > </div>
    `,
    computed: {
        getSum() {
            return this.$store.getters.calculateSum
        }
    }
})

Vue.component('ettor', {
    template: `<div class="child"><button @click="countNumbers">Ones</button> <span> {{ getOnes }} </span> </div>`,
    computed: {
        getOnes() {

            return this.$store.getters.getOnes
        }
    },
    methods: {
        countNumbers() {
            store.commit('countNumbers', 1)
        }
    }
})

Vue.component('tvor', {
    template: `<div class="child"><button >Twos</button> <span> Result here </span> </div>`
})

const app = new Vue({
    el: '#app',
    store,
    methods: {
        throwdice () {
            store.commit('rollDice')
        },
        //countNumbers(n) {
        //    store.commit('countNumbers', n)
        //}
    }
})

//todo: add the iterator (count to 15)