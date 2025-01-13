import { bind, Variable } from "astal";
import { App, Gtk } from "astal/gtk4";
import { LevelBar } from "astal/gtk4/widget";
import AstalCava from "gi://AstalCava";
import AstalMpris from "gi://AstalMpris?version=0.1";

function handleCavaLevelsUpdate(cavaLevels: Variable<number[]>) {
    const cavaServ = AstalCava.get_default()
    cavaLevels.set(cavaServ!.get_values())
}

function CavaLevelBar({ cavaLevel, invert = false }: { cavaLevel: number, invert?: boolean }) {
    const cavaServ = AstalCava.get_default()
    let x = LevelBar()
    return (
        <levelbar

            value={cavaLevel}
            maxValue={1.5}
            widthRequest={100}
            orientation={Gtk.Orientation.HORIZONTAL}
            mode={Gtk.LevelBarMode.CONTINUOUS}
            inverted={invert}
        />
    )
}

function MprisMetadata() {
    const mprisServ = AstalMpris.get_default()
    return (
        <box>
            {mprisServ.connect("player-added", (mprisServ, mPrisPlayer) => console.log(mPrisPlayer.title))}
        </box>
    )
}

export default function Levels() {
    const cavaServ = AstalCava.get_default()
    // console.log(barHeight)
    cavaServ?.set_bars(14)
    cavaServ?.set_channels(2)
    cavaServ?.set_stereo(true)
    cavaServ?.set_framerate(60)
    cavaServ?.set_samplerate(192000)
    cavaServ?.set_autosens(true)

    const cavaChannelArray = Array.from(Array(cavaServ!.channels).keys())
    const cavaChannels = cavaServ!.channels
    const cavaBars = cavaServ!.get_bars()

    const cavaLevels = Variable([])

    cavaServ?.connect("notify::values", () => handleCavaLevelsUpdate(cavaLevels))

    return (
        <box spacing={24} css_classes={["LevelsBox"]} valign={Gtk.Align.CENTER}>
            {cavaChannelArray.map((channelIndex) =>
                <box css_classes={["LevelsChannelBox", `LevelsChannelBox_${(channelIndex + 1).toString()}`]}>
                    {(channelIndex == 1) && <label halign={Gtk.Align.CENTER} justify={Gtk.Justification.CENTER}>R</label>}
                    <box vertical>
                        {/* {cavaLevels().as(cavaLevelArr => cavaLevelArr.map((cavaLevel: number) => <label>{cavaLevel.toString()}</label>))} */}
                        {channelIndex == 0 &&
                            cavaLevels().as(cavaLevelArr => cavaLevelArr.slice(channelIndex * (cavaBars / cavaChannels), (cavaBars / cavaChannels) * (channelIndex + 1)).map((cavaChannelLevel: number, index: number) =>
                            (
                                <box>
                                    <CavaLevelBar cavaLevel={cavaChannelLevel} invert />
                                </box>

                            )
                            ))


                            ||
                            cavaLevels().as(cavaLevelArr => cavaLevelArr.slice(channelIndex * (cavaBars / cavaChannels), (cavaBars / cavaChannels) * (channelIndex + 1)).map((cavaChannelLevel: number, index: number) =>
                            (
                                <box>
                                    <CavaLevelBar cavaLevel={cavaChannelLevel} />
                                </box>

                            )
                            ))
                        }

                    </box>

                    {channelIndex == 0 && <label halign={Gtk.Align.CENTER} justify={Gtk.Justification.CENTER}>L</label>}
                </box>

            )}
        </box>
    )
}