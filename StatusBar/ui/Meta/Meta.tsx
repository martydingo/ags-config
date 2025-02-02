import { bind } from "astal";
import { Gtk } from "astal/gtk4";
import Levels from "../../components/Levels/Levels";
import MprisMeta from "../../components/MprisMeta/MprisMeta";
import Pango from "gi://Pango?version=1.0";

export default function Meta() {

    return (
        <box spacing={8} css_classes={["Meta_Box"]}>
            <Levels channel={0} />
            <MprisMeta />
            <Levels channel={1} />
        </box>
    )
}