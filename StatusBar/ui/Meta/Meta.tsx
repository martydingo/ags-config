import { bind } from "astal";
import { Gtk } from "astal/gtk4";
import Levels from "../../components/Levels/Levels";

export default function Meta() {

    return (
        <box css_classes={["Meta_Box"]}>
            <box></box>
            <Levels />
        </box>
    )
}