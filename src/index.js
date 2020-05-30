const { TREE } = require('isomorphic-git');
const git = require('isomorphic-git');
const path = require('path');
const fs = require('fs');

async function getFilesChanges() {
    const dir = path.resolve(`${__dirname}`, '../');
    console.log(dir);
    await git.walk({
        fs,
        dir,
        trees: [
            TREE({ ref: 'HEAD' }),
            TREE({ ref: 'origin/master' }),
        ],
        map: async function(filepath, [A, B]) {
            // ignore directories
            if (filepath === '.') {
                return
            }
            if ((await A.type()) === 'tree' || (await B.type()) === 'tree') {
                return
            }

            // generate ids
            const Aoid = await A.oid()
            const Boid = await B.oid()

            // determine modification type
            let type = 'equal';
            if (Aoid !== Boid) {
                type = 'modify'
            }
            if (Aoid === undefined) {
                type = 'add'
            }
            if (Boid === undefined) {
                type = 'remove'
            }
            if (Aoid === undefined && Boid === undefined) {
                console.log('Something weird happened:')
                console.log(A)
                console.log(B)
            }
            return {
                path: `/${filepath}`,
                type: type,
            }
        },
    });
}

(async function() {
   return getFilesChanges();
})();


