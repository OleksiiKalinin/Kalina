const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 6000;

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

(function start() {
    try {
        app.listen(port, () => console.log('server started')); 
    } catch {
        console.log('Server error', e.message);
        process.exit(1);
    }
})();
