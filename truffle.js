module.exports = {
    networks: {
        ganache: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "5777"
        },
        geth: {
            host: "localhost",
            port: 7545,
            network_id: "*"
        }
    },
    solc: {
        optimizer: {
            enabled: true,
            runs: 200
        }
    }
};