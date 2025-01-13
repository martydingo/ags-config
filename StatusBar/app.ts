import { App } from "astal/gtk4"
import style from "./style.scss"
import StatusBar from "./ui/StatusBar"
import { monitorCss } from "./utils/css"

monitorCss("./style.scss")

App.start({
    css: style,
    main() {
        App.get_monitors().map(StatusBar)
    },
})
