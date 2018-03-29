if (typeof Buffer === 'undefined') {
    global.Buffer = require('buffer').Buffer
}

const RNRandomBytes = require('react-native').NativeModules.RNRandomBytes;

const rndCache = [];

const fillCache = () => {
    RNRandomBytes.randomBytes(32, (err, base64String) => {
        if (err) {
            throw err;
        } else {
            rndCache.push(base64String);
        }
    });
    if (rndCache.length < 10) {
        global.setTimeout(() => fillCache(), 10);
    }
}

fillCache();

const randomBytes = length => {
    fillCache();

    const buffer = new Buffer(rndCache.pop(), 'base64');
    if (buffer.length > length) {
        return buffer.slice(0, length);
    }
    return buffer;
}

module.exports = {
    randomBytes,
    createHash: () => {}
}

// (function() {
//   // Initialize PRNG if environment provides CSPRNG.
//   // If not, methods calling randombytes will throw.
//   var crypto = typeof self !== 'undefined' ? (self.crypto || self.msCrypto) : null;
//   if (crypto && crypto.getRandomValues) {
//     // Browsers.
//     var QUOTA = 65536;
//     nacl.setPRNG(function(x, n) {
//       var i, v = new Uint8Array(n);
//       for (i = 0; i < n; i += QUOTA) {
//         crypto.getRandomValues(v.subarray(i, i + Math.min(n - i, QUOTA)));
//       }
//       for (i = 0; i < n; i++) x[i] = v[i];
//       cleanup(v);
//     });
//   } else if (typeof require !== 'undefined') {
//     // Node.js.
//     crypto = require('crypto');
//     if (crypto && crypto.randomBytes) {
//       nacl.setPRNG(function(x, n) {
//         var i, v = crypto.randomBytes(n);
//         for (i = 0; i < n; i++) x[i] = v[i];
//         cleanup(v);
//       });
//     }
//   }
// })();
