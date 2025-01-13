import AudioButton from "../../components/Button/AudioButton";
import Clock from "../../components/Clock/Clock";
import SystemTray from "../../components/SystemTray/SystemTray";

export default function Tray() {
    return (
        <box>
            <SystemTray />
            <AudioButton />
            <Clock />
        </box>
    )
}