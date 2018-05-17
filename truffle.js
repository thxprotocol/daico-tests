module.exports = {
    networks: {
        ganache: {
            host: "localhost",
            port: 8545,
            network_id: "*"
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