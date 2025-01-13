import { Variable } from "astal"
import { Gtk } from "astal/gtk4"


export default function Clock() {
    const time = Variable("").poll(1000, "date '+%I:%M %p'")

    return (
        <menubutton>
            <label>
                {time()}
            </label>
            <popover>
                <Gtk.Calendar />
            </popover>
        </menubutton>
    )
}