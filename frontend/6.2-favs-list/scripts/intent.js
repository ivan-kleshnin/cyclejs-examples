// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx} = Cycle;

// INTENTS =========================================================================================
export default Cycle.createIntent(User => ({
  favup$: User.event$(".pictures", "favup").map(event => event.data),
  unfav$: User.event$(".pictures", "unfav").map(event => event.data),
}));