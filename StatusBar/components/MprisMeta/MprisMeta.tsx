import { bind, Gio, interval } from "astal";
import { App, Gtk } from "astal/gtk4";
import { Box, Label, Overlay, Stack, Image } from "astal/gtk4/widget";
import AstalMpris from "gi://AstalMpris";
import AstalApps from "gi://AstalApps";
import ScrollingLabel from "../ScrollingLabel";
import Pango from "gi://Pango";
import app from "astal/gtk4/app";

function handleStackTransition(stack: Gtk.Stack) {
    const curChild = stack.visibleChildName
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
    const appServ = new AstalApps.Apps()
    const apps = appServ.fuzzy_query(mprisPlayer.entry)

    const playerIconTitle = Image({ iconName: "applications-multimedia" })
    if (apps.length > 0) {
        playerIconTitle.iconName = apps[0].iconName
    }
    const playerIconArtist = Image({ iconName: playerIconTitle.iconName })
    const playerIconAlbum = Image({ iconName: playerIconTitle.iconName })

    const trackLabel = Label({ css_classes: ["MprisMeta_Label"], label: bind(mprisPlayer, "title").as((titleStr) => `${titleStr}`), max_width_chars: 16, ellipsize: Pango.EllipsizeMode.END })
    const artistLabel = Label({ css_classes: ["MprisMeta_Label"], label: bind(mprisPlayer, "artist").as((artistStr) => `${artistStr}`), max_width_chars: 16, ellipsize: Pango.EllipsizeMode.END })
    const albumLabel = Label({ css_classes: ["MprisMeta_Label"], label: bind(mprisPlayer, "album").as((albumStr) => `${albumStr}`), max_width_chars: 16, ellipsize: Pango.EllipsizeMode.END })

    const mediaCoverArt = bind(mprisPlayer, "art_url").as(coverArtUrl => coverArtUrl)
    const mediaCoverCss = bind(mprisPlayer, "art_url").as(coverArtUrl => `background-image: url('${coverArtUrl}');`)

    const trackBox = Box({ spacing: 12, name: "Track", children: [playerIconTitle, trackLabel] })
    const artistBox = Box({ spacing: 12, name: "Artist", children: [playerIconArtist, artistLabel] })
    const albumBox = Box({ spacing: 12, name: "Album", children: [playerIconAlbum, albumLabel] })

    const stack = Stack({
        children: [trackBox, artistBox, albumBox],
        transition_type: Gtk.StackTransitionType.SLIDE_DOWN,
        transition_duration: 1000,
        css_classes: ["MprisMeta_Stack"]
    })

    const mediaOverlayBox = Box({
        children: [trackLabel, artistLabel, albumLabel],
    })

    const mediaArtPicture = bind(mprisPlayer, "art_url").as(coverArtUrl => Gtk.Picture.new_for_filename(coverArtUrl))

    interval(5000, () => handleStackTransition(stack))
    return (
        <menubutton>
            {stack}
            <popover>
                <overlay>
                    <box vertical cssClasses={[`MprisMeta_Overlay_MediaArt_${mprisPlayer.identity.replace(" ", "_")}`, "MprisMeta_Overlay_MediaArt_Static"]} widthRequest={512}>
                        <box vertical cssClasses={["MprisMeta_Overlay_MediaArt_Shader"]} widthRequest={512} heightRequest={128}>
                            <box vertical cssClasses={["MprisMeta_Overlay_Container"]}>
                                <label label={bind(mprisPlayer, "title")} halign={Gtk.Align.START} justify={Gtk.Justification.LEFT} cssClasses={["MprisMeta_Overlay_Label_Title"]} />
                                <Gtk.Separator orientation={Gtk.Orientation.HORIZONTAL} />
                                <box>
                                    <label label={bind(mprisPlayer, "artist")} justify={Gtk.Justification.LEFT} cssClasses={["MprisMeta_Overlay_Label_Artist"]} />
                                    <Gtk.Separator />
                                    <label label={bind(mprisPlayer, "album")} justify={Gtk.Justification.RIGHT} halign={Gtk.Align.END} cssClasses={["MprisMeta_Overlay_Label_Album"]} />
                                </box>
                                <box vertical cssClasses={["MprisMeta_Overlay_MediaControls"]} spacing={6}>
                                    <box halign={Gtk.Align.CENTER}>
                                        <label>{bind(mprisPlayer, "position").as((position) => `${Math.floor(position / 60)}:${Math.floor(position % 60) < 10 && "0" || ""}${Math.floor(position % 60)}`)}</label>
                                        <slider widthRequest={384} max={100} min={0} value={bind(mprisPlayer, "position").as((position) => (100 / mprisPlayer.length) * position)} onChangeValue={(slider) => mprisPlayer.set_position((slider.value * mprisPlayer.length) / 100)} />
                                        <label>{bind(mprisPlayer, "length").as((length) => `${Math.floor(length / 60)}:${Math.floor(length % 60) < 10 && "0" || ""}${Math.floor(length % 60)}`)}</label>
                                    </box>
                                    <box halign={Gtk.Align.CENTER} >
                                        <button onButtonPressed={() => mprisPlayer.previous()}>
                                            <image iconName={"media-skip-backward"} />
                                        </button>
                                        <button onButtonPressed={() => mprisPlayer.play_pause()}>
                                            <image iconName={bind(mprisPlayer, "playback_status").as((playbackStatus => playbackStatus == AstalMpris.PlaybackStatus.PLAYING && "media-playback-pause" || "media-playback-start"))} />
                                        </button>
                                        <button onButtonPressed={() => mprisPlayer.next()}>
                                            <image iconName={"media-skip-forward"} />
                                        </button>
                                    </box>
                                </box>
                            </box>
                        </box>
                    </box>
                </overlay>
            </popover>
        </menubutton>
    )
}

function discernPlayer(mprisPlayer: AstalMpris.Player) {
    if (mprisPlayer.busName.endsWith("slimpris2")) {
        if (mprisPlayer.playbackStatus == AstalMpris.PlaybackStatus.PLAYING) {
            return true
        } else if (mprisPlayer.position < 600) {
            return true
        }
        else {
            return false
        }
    } else return true


}

function updateMediaBackgroundCss(mprisPlayer: AstalMpris.Player) {
    app.apply_css(`.MprisMeta_Overlay_MediaArt_${mprisPlayer.identity.replace(" ", "_")} { background-image: url('${mprisPlayer.artUrl}'); }`)
}

function buildWidget(mprisPlayer: AstalMpris.Player) {

    let addWidget = discernPlayer(mprisPlayer)
    addWidget = true
    if (addWidget) {
        updateMediaBackgroundCss(mprisPlayer)
        mprisPlayer.connect("notify", (mprisPlayer) => updateMediaBackgroundCss(mprisPlayer))
        return <MprisStack mprisPlayer={mprisPlayer} />
    }
}

export default function MprisMeta() {
    const mprisServ = AstalMpris.get_default()
    return (
        <box cssClasses={["MprisMeta_Box"]}>
            {bind(mprisServ, "players").as((mprisPlayerArray) => mprisPlayerArray.map((mprisPlayer) => buildWidget(mprisPlayer)))}
        </box>

    )
}