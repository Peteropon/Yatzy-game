const store = new Vuex.Store({
    state: {
        totalsum: 0,
        dice: []
    },
    mutations: {
        throwdice(state) {
            var i;
            state.dice = [];
            for (i = 1; i < 6; i++) {
                newDie = Math.floor(Math.random() * 6) + 1;
                state.dice.push(newDie);
            }
        }
    },
    getters: {
       
    }
})

const app = new Vue({
    el: '#app',
    store,
    methods: {
        throwdice () {
            store.commit('throwdice')
        }
    }
})