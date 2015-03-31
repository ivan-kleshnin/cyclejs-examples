// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;

// VIEWS ===========================================================================================
export default Cycle.createView(Model => ({
  vtree$: Model.get("pictures$").map(pictures => (
    <div>
      <h2>Pictures</h2>
      <Pictures data={pictures.filter(m => !m.favorite)}/>

      <h2>Favorites</h2>
      <Pictures data={pictures.filter(m => m.favorite)}/>
    </div>
  )),
}));