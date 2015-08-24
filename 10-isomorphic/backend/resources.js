import {Rx} from "@cycle/core";
import SuperAgent from "superagent";

// RESOURCES =======================================================================================
//let vendorsBundle$ = (function () {
//  let replaySubject = new Rx.ReplaySubject(1);
//  SuperAgent
//    .get("http://localhost:2992/10-isomorphic/public/vendors.js")
//    .buffer()
//    .end((err, res) => {
//        if (err) {
//          throw new Error("vendors.js bundle is unavailable");
//        }
//      replaySubject.onNext(res.text);
//      replaySubject.onCompleted();
//    });
//  return replaySubject;
//})();

let clientBundle$ = (function () {
  let replaySubject = new Rx.ReplaySubject(1);
  SuperAgent
    .get("http://localhost:2992/10-isomorphic/public/app.js")
    .buffer()
    .end((err, res) => {
      if (err) {
        throw new Error("app.js bundle is unavailable");
      }
      replaySubject.onNext(res.text);
      replaySubject.onCompleted();
    });
  return replaySubject;
})();

export default {
  //vendorsBundle$,
  clientBundle$,
};

//bundleStream.on('data', function (data) {
//  bundleString += data;
//});
//bundleStream.on('end', function () {
//  replaySubject.onNext(bundleString);
//  replaySubject.onCompleted();
//  console.log('Client bundle successfully compiled.');
//});
