import { Pane } from 'tweakpane'

export default class DebugPanel {
	constructor() {
		this.app = window.__APP__
		this.init()
	}
	init() {
		this.pane = new Pane()
	}
}
