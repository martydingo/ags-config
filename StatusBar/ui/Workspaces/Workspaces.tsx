import { bind } from "astal"
import AstalHyprland from "gi://AstalHyprland"
import WorkspaceButton from "../../components/Button/WorkspaceButton"
import WorkspaceOverviewButton from "../../components/Button/WorkspaceOverviewButton"


export default function Workspaces() {
    const hyprServ = AstalHyprland.get_default()

    return (
        <box cssClasses={["Workspaces_Box"]}>
            <WorkspaceOverviewButton />
            <box cssClasses={["WorkspaceButtons_Container"]}>

                {
                    bind(hyprServ, "workspaces")
                        .as((wsArr: AstalHyprland.Workspace[]) => wsArr
                            .sort((wsA, wsB) => wsA.id - wsB.id)
                            .map((ws: AstalHyprland.Workspace) => <WorkspaceButton ws={ws} />)
                        )
                }
            </box>
        </box>
    )
}