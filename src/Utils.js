var Const = require('./Constants');

var _keyDownViewHelper = [
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
];

module.exports = {

    keyDownActions: function (code) {
        var _viewHelper = _keyDownViewHelper[this.state.currentView];
        var unit = _viewHelper.unit;

        switch (code) {
            case Const.keys.left:
                this.setDate(this.state.date.subtract(1, unit));
                break;
            case Const.keys.right:
                this.setDate(this.state.date.add(1, unit));
                break;
            case Const.keys.up:
                this.setDate(this.state.date.subtract(_viewHelper.upDown, unit));
                break;
            case Const.keys.down:
                this.setDate(this.state.date.add(_viewHelper.upDown, unit));
                break;
            case Const.keys.enter:
                if (_viewHelper.prev)
                    this.prevView(this.state.date);

                if (_viewHelper.exit)
                    this.setState({isVisible: false});

                break;
            case Const.keys.esc:
                this.setState({isVisible: false });
                break;
        }
    }

};