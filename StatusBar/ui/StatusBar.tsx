import { App, Astal, Gdk } from "astal/gtk4"
import Tray from "./Tray/Tray"
import Workspaces from "./Workspaces/Workspaces"
import Meta from "./Meta/Meta"


function StatusBar_CentreBox() {
    return (
        <centerbox cssName="StatusBar_CentreBox">
            <Workspaces />
            <Meta />
            <Tray />
        </centerbox>
    )
}

export default function StatusBar(monitor: Gdk.Monitor) {
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

    return (
        <window
            visible
            cssClasses={["StatusBar"]}
            namespace="StatusBar"
            name="StatusBar"
            gdkmonitor={monitor}
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            anchor={TOP | LEFT | RIGHT}
            application={App}
        >
            <StatusBar_CentreBox />
        </window>
    )
}
