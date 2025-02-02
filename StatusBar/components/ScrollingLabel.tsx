import { bind, Binding, interval, Variable } from "astal"



export default function ScrollingLabel({ label, name }: { label: string, name?: string }) {
    const maxChars = 16
    let curChar = 0
    const spaceBuffer = Array.from(Array(maxChars - 1)).fill(" ").join("")

    const spacedlabel = `${spaceBuffer}${label}${spaceBuffer}`

    const labelVar = Variable(spacedlabel.slice(curChar, maxChars - 1))

    function handleTextScroll() {
        if ((curChar + maxChars) <= spacedlabel.length) {
            labelVar.set(spacedlabel.slice(curChar, maxChars + curChar - 1))
            curChar++
        } else {
            labelVar.set(spacedlabel.slice(curChar, maxChars + curChar - 1))
            curChar = 0

        }
        // console.log(labelVar().get())
    }

    interval(150, () => handleTextScroll())

    return name && <label name={name}>{labelVar()}</label> || <label>{labelVar()}</label>
}