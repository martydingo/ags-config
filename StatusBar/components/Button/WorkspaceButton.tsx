import { bind } from "astal";
import AstalApps from "gi://AstalApps";
import AstalHyprland from "gi://AstalHyprland";

function discernIcon(client: AstalHyprland.Client): string {
    const appServ = new AstalApps.Apps()

    const searchByClassResult = appServ.fuzzy_query(client.class.replace("-wrapped", "").replace(/^\./, "")).map((app) => app)
    if (searchByClassResult.length > 0) {
        return searchByClassResult[0].icon_name
    } else {
        const searchByNameResult = appServ.fuzzy_query(client.title.split(/—|-/).pop()?.trim()).map((app) => app)
        if (searchByNameResult.length > 0) {
            return searchByNameResult[0].icon_name
        }
    }

    return client.class
}

function WorkspaceLabel({ ws }: { ws: AstalHyprland.Workspace }) {
    const hyprServ = AstalHyprland.get_default()

    return (
        <box>
            {
                bind(hyprServ, "clients").as((clientArr: AstalHyprland.Client[]) => clientArr
                    .filter((client: AstalHyprland.Client) => client.workspace.id == ws.id)
                    .reverse()
                    .map((wsClient: AstalHyprland.Client) => <image cssClasses={["WorkspaceButton_ClientLabel"]} pixelSize={-1} iconName={discernIcon(wsClient)} />)
                )
            }
        </box>
    )
}


export default function WorkspaceButton({ ws }: { ws: AstalHyprland.Workspace }) {
    const hyprServ = AstalHyprland.get_default()

    return (
        <button css_classes={bind(hyprServ, "focusedWorkspace").as((activeWs) => activeWs.id == ws.id && ["active", "WorkspaceButton_Button"] || ["WorkspaceButton_Button"])} onClicked={() => { ws.focus() }}>
            <box>
                <label cssClasses={["WorkspaceButton_WSLabel"]}>{ws.name}</label>
                <WorkspaceLabel ws={ws} />
            </box>
        </button>
    )
}