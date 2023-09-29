const { NodeSSH } = require('node-ssh')
const ssh = new NodeSSH();
const USER = process.env.USER;
const KEYPHRASE = `${process.env.HOME}/.ssh/id_rsa`
const HOST = process.argv[2] ? process.argv[2] : '192.168.1.1'

const PARAMS = {
    host: HOST
    , username: USER
    , privateKeyPath: KEYPHRASE
}
const MAC_PATTERN = /[0-9a-f]{1,2}([\.:-])(?:[0-9a-f]{1,2}\1){4}[0-9a-f]{1,2}/gmi

ssh.connect(PARAMS)
    .then(async function () {
        console.info(">> success connection");
        try {
            const response = await ssh.exec( 'uptime', [] )
            console.info( ">> [SERVER]:", response );
            const mac = await ssh.exec( 'ip', ['link', 'show', 'ath0'])
            const version   = await ssh.exec( 'cat', ['/etc/version'] )
            console.info( ">> [SERVER]", {
                host: HOST
                , mac: mac.match( MAC_PATTERN ).at(0).toUpperCase()
                , version: version
            })
        } catch( err ) {
            console.log( `>> [SERVER]: ${err}`)
        }

    })
    .finally( ()=> ssh.dispose() );