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
        dievalue: 0
    },
    mutations: {
        throwdice(state) {
            var i;
            state.dice = [];
            for (i = 1; i < 6; i++) {
                newDie = Math.floor(Math.random() * 6) + 1;
                state.dice.push(newDie);
            }
        },
        rolldie(state) {
            for (i = 0; i < 5; i++) {
                state.dievalue = Math.floor(Math.random() * 6) + 1;
                //state.dice.push(this.state.dievalue);
                state.dice[i].value = state.dievalue
            }
        }
    },
    getters: {
        dicelength: state => {
            return state.dice.length
        },
        getdievalue: (state) => (id) => {
            return state.dice.filter(die => die.id == id)
        }
    }
})

Vue.component('dice', {
    props: ['die'],
    template: `<div>
                    <div v-for="die, index in shownumber" :key="index"> {{ die.value }} </div>
</div>`,
    computed: {
        shownumber() {
            return this.$store.state.dice
        }
    }
})

const app = new Vue({
    el: '#app',
    store,
    methods: {
        throwdice () {
            store.commit('rolldie')
        }
    }
})