import { bind } from "astal"
import AstalTray from "gi://AstalTray"

function SystemTrayButton({ trayItem }: { trayItem: AstalTray.TrayItem }) {

    return (
        <menubutton menuModel={trayItem.menuModel}>
            <image iconName={trayItem.iconName} />
        </menubutton>
    )
}

export default function SystemTray() {
    const trayServ = AstalTray.get_default()

    return (
        <box>
            {
                bind(trayServ, "items").as((trayItems: AstalTray.TrayItem[]) => trayItems.map((trayItem: AstalTray.TrayItem) => <SystemTrayButton trayItem={trayItem} />))
            }
        </box>
    )
}