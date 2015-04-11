// Activate/deactivate rules, with curring
var mdit = require('markdown-it')()
            .disable([ 'link', 'image' ])
            .enable([ 'link' ])
            .enable('image');

mdit.disable('code');
console.log(mdit.render("```this isn't anymore```"));
