const store = new Vuex.Store({
    state: {
        totalsum: 0,
        dice: [],
        dienumber: 0
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
            state.dienumber = Math.floor(Math.random() * 6) + 1;
            
        }
    },
    getters: {
        dicelength: state => {
            return state.dice.length
        },
        getdienumber: state => {
            return state.dienumber
        }
    }
})

Vue.component('die', {
    
    template: `<div> {{ $store.getters.getdienumber }} </div>`,
    computed: {
        shownumber() {
            return this.$store.getters.getdienumber
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