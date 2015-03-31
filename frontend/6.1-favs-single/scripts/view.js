// CONSTS ==========================================================================================
const pictures = [
  {
    src: "https://avatars3.githubusercontent.com/u/984368?v=3&s=400",
    title: "AngularJS",
    favorite: false
  },
  {
    src: "https://pbs.twimg.com/media/B5AJRfWCYAAbLyJ.png",
    title: "RxJS",
    favorite: true
  },
  {
    src: "https://lh6.googleusercontent.com/-TlY7amsfzPs/T9ZgLXXK1cI/AAAAAAABK-c/Ki-inmeYNKk/w749-h794/AngularJS-Shield-large.png",
    title: "CycleJS",
  },
];

// IMPORTS =========================================================================================
let Cycle = require("cyclejs");
let {Rx, h} = Cycle;

// VIEWS ===========================================================================================
export default Cycle.createView(() => ({
  vtree$: Rx.Observable.return(
    <div class="pictures">
      <Picture src={pictures[0].src} title={pictures[0].title} favorite={pictures[0].favorite} width="100" something="x"/>
      <Picture src={pictures[1].src} title={pictures[1].title} favorite={pictures[1].favorite} width="100" something="y"/>
      <Picture src={pictures[2].src} title={pictures[2].title} width="100" something="z"/>
    </div>
  ),
}));