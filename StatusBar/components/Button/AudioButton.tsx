import { bind, Variable } from "astal";
import { Gtk } from "astal/gtk4";
import { Slider } from "astal/gtk4/widget";
import Wp from "gi://AstalWp";

function AudioSlider({ spk }: { spk: Wp.Endpoint }) {

    const slider = Slider({
        min: 0,
        max: 100,
        widthRequest: 100,
        valuePos: Gtk.PositionType.BOTTOM,
        onChangeValue: (self) => spk.set_volume(Math.round(self.value) / 100),
        drawValue: true,
        digits: 0,
    })

    slider.set_value(Math.round(spk.volume * 100))

    return slider
}

export default function AudioButton() {
    const audioServ = Wp.get_default()!.audio

    return (
        <box>
            {bind(audioServ, "speakers").as((spkArr) => spkArr.map((spk) => spk.is_default && (
                <menubutton iconName={bind(spk, "volume_icon")}>
                    <popover>
                        <box vertical>
                            {/* <label>{spk.description}</label> */}
                            <AudioSlider spk={spk} />
                        </box>
                    </popover>
                </menubutton>
            ) || ""
            ))}
        </box>
    )
}