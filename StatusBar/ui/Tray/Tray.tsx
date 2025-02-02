import AudioButton from "../../components/Button/AudioButton";
import NotificationButton from "../../components/Button/NotificationButton";
import Clock from "../../components/Clock/Clock";
import SystemTray from "../../components/SystemTray/SystemTray";

export default function Tray() {
    return (
        <box spacing={6} cssClasses={["Tray_Box"]}>
            <SystemTray />
            <AudioButton />
            <Clock />
            {/* <NotificationButton /> */}
        </box>
    )
}