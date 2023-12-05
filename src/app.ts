import { envs } from './config'
import { Server } from './presentation/server'
import { AppRoutes } from './presentation/routes'


(()=>{
    main()
})()

async function main () {

    new Server ({
        port: envs.PORT,
        routes: AppRoutes.routes

    }).Start()

}