import { bind, interval } from "astal";
import { Gtk } from "astal/gtk4";
import { ButtonProps, Label, Stack } from "astal/gtk4/widget";
import AstalMpris from "gi://AstalMpris";
import ScrollingLabel from "../ScrollingLabel";

function handleStackTransition(stack: Gtk.Stack) {
    const curChild = stack.visibleChildName
    console.log(curChild)
    if (curChild === "Track") {
        stack.set_visible_child_name("Artist")
    } else if (curChild === "Artist") {
        stack.set_visible_child_name("Album")
    } else if (curChild === "Album") {
        stack.set_visible_child_name("Track")
    }

    // const nextChild = stack.child
}

function MprisStack({ mprisPlayer }: { mprisPlayer: AstalMpris.Player }) {
    // const trackLabel = bind(mprisPlayer, "title").as((titleStr) => ScrollingLabel({ name: "Track", label: titleStr }))
    const trackBind = bind(mprisPlayer, "title")
    const artistBind = bind(mprisPlayer, "artist")
    const albumBind = bind(mprisPlayer, "album")

    const text = trackBind.as(trackStr => artistBind.as(artistStr => albumBind.as(albumStr => `${trackStr} - ${artistStr} - ${albumStr}`)))

    // interval(10000, () => handleStackTransition(stack))
    return (
        <box>
            <label></label>
        </box>
    )
}

function discernPlayer(mprisPlayer: AstalMpris.Player) {
    if (mprisPlayer.title.length > 0) {
        return true
    }
    return false
}

function buildWidget(mprisPlayer: AstalMpris.Player) {
    const addWidget = discernPlayer(mprisPlayer)
    if (addWidget) {
        return MprisStack({ mprisPlayer: mprisPlayer })
    }
    return
}

export default function MprisMeta() {
    const mprisServ = AstalMpris.get_default()

    return (
        <box cssClasses={["MprisMeta_Box"]}>
            {bind(mprisServ, "players").as((mprisPlayerArray) => mprisPlayerArray.map((mprisPlayer) => buildWidget(mprisPlayer)))}
        </box>
    )
}