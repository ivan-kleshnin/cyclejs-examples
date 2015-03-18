// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;

// EXPORTS =========================================================================================
let View = Cycle.createView(Model => {
  let query$ = Model.get("query$");
  let data$ = Model.get("data$");
  return {
    vtree$: data$.combineLatest(query$, (data, query) => {
      let effectiveQuery = query.toLowerCase();
      let items = query ? data.filter(obj => obj.name.toLowerCase().match(effectiveQuery)) : data;
      return (
        <div>
          <input class="query" type="text" value={query} placeholder="Type here"/>
          <ul>
            {items.map(obj =>
              <li>{obj.name} <a href={obj.url}>{obj.name}</a></li>
            )}
          </ul>
        </div>
      );
    }),
  };
});

module.exports = View;