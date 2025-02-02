import AstalHyprland from "gi://AstalHyprland?version=0.1"

function launchExpo() {
    const hyprServ = AstalHyprland.get_default()
    hyprServ.dispatch("hyprexpo:expo", "toggle")
}

export default function WorkspaceOverviewButton() {

    return (
        <button onClicked={() => launchExpo()} cssClasses={["WorkspaceOverview_Button"]}>
            <image iconName="start-here" />
        </button>
    )
}