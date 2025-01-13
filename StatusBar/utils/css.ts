import { exec } from "astal"
import { monitorFile } from "astal/file"
import { App } from "astal/gtk4"

export function compileSass(sassFilePath: string) {
    const css = exec(["sass", sassFilePath])
    return css
}

export function applyCss(css: string) {
    App.apply_css(css, true)
}

export function monitorCss(sassFilePath: string) {
    monitorFile(sassFilePath, () => {
        const css = compileSass(sassFilePath)
        applyCss(css)
    })
}