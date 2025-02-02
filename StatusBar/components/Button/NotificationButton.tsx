import { bind } from "astal"
import { App, Gtk } from "astal/gtk4"
import { Astal } from "astal/gtk4"
import AstalNotifd from "gi://AstalNotifd"
import Pango from "gi://Pango?version=1.0"

function handleDismiss(box, notification: AstalNotifd.Notification) {
    notification.dismiss()
}

export default function NotificationButton() {
    const notifyServ = AstalNotifd.get_default()
    const scrollable = new Gtk.ScrolledWindow
    console.log(notifyServ.get_notifications())
    return (
        <menubutton cssClasses={["Notifications_MenuButton"]} iconName="notifications">
            {bind(notifyServ, "notifications").as((notifyArray) => notifyArray.length > 0 &&
                <popover cssClasses={["Notifications_Popover"]}>
                    <Gtk.ScrolledWindow widthRequest={App.get_monitors()[0].geometry.width / 8} heightRequest={App.get_monitors()[0].geometry.height * 0.8} cssClasses={["Notifications_Popover_Scrollable"]}>
                        <box vertical cssClasses={["Notifications_Popover_Box"]}>
                            <button heightRequest={4} halign={Gtk.Align.END} onButtonPressed={() => notifyServ.notifications.forEach(notif => (notif.dismiss()))}>
                                <image pixelSize={8} iconName={"window-close"} />
                            </button>
                            {notifyArray.map((notification) =>
                                <box vertical cssClasses={["Notifications_Popover_NotificationBox"]} setup={(self) => notification.connect("resolved", (_source, reason) => _source.dismiss())}>
                                    <box halign={Gtk.Align.FILL} cssClasses={["Notifications_Popover_NotificationTitleBox"]}>
                                        {notification.appIcon && <image iconName={notification.appIcon} />}
                                        <label halign={Gtk.Align.START} justify={Gtk.Justification.LEFT} cssClasses={["Notifications_Popover_NotificationTitle"]}>{notification.summary}</label>
                                    </box>
                                    <label wrap={true} wrapMode={Gtk.WrapMode.WORD as Pango.WrapMode} maxWidthChars={40} halign={Gtk.Align.START} justify={Gtk.Justification.LEFT} cssClasses={["Notifications_Popover_NotificationBody"]}>{notification.body}</label>
                                    <Gtk.Separator />
                                </box>
                            )}
                        </box>
                    </Gtk.ScrolledWindow>
                </popover>
                || "")}
        </menubutton>
    )
}