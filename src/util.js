const _keyDownViewHelper = [
  {
    prev: false,
    next: true,
    exit: true,
    unit: 'day',
    upDown: 7
  },
  {
    prev: true,
    next: true,
    unit: 'months',
    upDown: 3
  },
  {
    prev: true,
    next: false,
    unit: 'years',
    upDown: 3
  }
]

const KEYS = {
  backspace: 8,
  tab: 9,
  enter: 13,
  esc: 27,
  left: 37,
  up: 38,
  right: 39,
  down: 40
}

export default {
  toDate(date) {
    return date instanceof Date ? date : new Date(date)
  },

  keyDownActions(code) {
    const _viewHelper = _keyDownViewHelper[this.state.currentView]
    const unit = _viewHelper.unit

    switch (code) {
      case KEYS.left:
        this.setInternalDate(this.state.date.subtract(1, unit))
        break
      case KEYS.right:
        this.setInternalDate(this.state.date.add(1, unit))
        break
      case KEYS.up:
        this.setInternalDate(this.state.date.subtract(_viewHelper.upDown, unit))
        break
      case KEYS.down:
        this.setInternalDate(this.state.date.add(_viewHelper.upDown, unit))
        break
      case KEYS.enter:
        if (_viewHelper.prev) {
          this.prevView(this.state.date)
        }
        if (_viewHelper.exit) {
          this.setInputDate(this.state.date)
          this.setState({ isVisible: false })
        }
        break
      case KEYS.esc:
        this.setState({ isVisible: false })
        break
      case KEYS.tab:
        this.props.hideOnBlur && this.setState({ isVisible: false })
        break
      default:
        break
    }
  },

  checkForMobile(hideTouchKeyboard) {
    let readOnly = false
    // do not break server side rendering:
    try {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      ) {
        readOnly = true
      }
    } catch (e) {
      console.warn(e) //eslint-disable-line
    }
    return readOnly
  }
}
